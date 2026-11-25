'use client'

// Her portrait drawn from 1,695 tiles, each one of the real emails from Gwen Addo's journey.
// Scrolling the hero dives through the face: the tiles scatter in depth and turn from
// portrait greys to the emails' own colours. The pointer lifts nearby tiles into colour.
// A few tiles flash at a time, the way the emails went out, while the hero is on screen.
//
// Raw WebGL2, one instanced draw call. The canvas is decorative (aria-hidden); the content
// is server-rendered HTML. A pixelated copy of the portrait sits underneath as the first
// frame and as the fallback when WebGL2 is unavailable.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type MosaicData = {
  cols: number
  rows: number
  atlasCols: number
  atlasRows: number
  tiles: number
  cells: [number, number, number, number][]
}

const VERT = `#version 300 es
in vec2 aCorner;
in vec2 aCell;
in float aLum;
in float aTile;
in vec3 aRand;
uniform vec2 uRes;
uniform vec4 uRect;
uniform vec2 uGrid;
uniform vec2 uAtlas;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
out vec2 vUv;
out float vLum;
out float vReveal;
out float vAlpha;
const float F = 1500.0;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float cell = uRect.z / uGrid.x;
  vec2 center = uRect.xy + (aCell + 0.5) * cell;

  float h = uHover * smoothstep(150.0, 0.0, distance(center, uMouse));

  // An email "goes out": a short, soft flash in colour, a few tiles at a time
  float rate = 0.35 + aRand.y * 0.4;
  float slot = floor(uTime * rate + aRand.x * 31.0);
  float ph = fract(uTime * rate + aRand.x * 31.0);
  float flash = step(0.988, hash(slot * 7.31 + aTile * 1.7 + aRand.z * 113.0)) * sin(ph * 3.14159);

  float p = uProgress;
  float scatter = smoothstep(0.04, 0.7, p);
  float dolly = smoothstep(0.22, 1.0, p);
  float z = (aRand.z - 0.4) * 1100.0 * scatter + h * 70.0;
  z += dolly * (1100.0 + aRand.x * 900.0);

  vec2 focus = uRect.xy + uRect.zw * vec2(0.5, 0.45);
  vec2 sc = uRes * 0.5;
  vec2 pos = center + (center - focus) * scatter * (0.1 + aRand.y * 0.5);
  // The cloud drifts to the middle of the screen as it comes apart
  pos += (sc - (uRect.xy + uRect.zw * 0.5)) * smoothstep(0.05, 0.55, p);

  float s = F / max(F - z, 1.0);
  vec2 projected = sc + (pos - sc) * s;
  float size = cell * 0.84 * s * (1.0 + h * 0.18);

  float ang = (aRand.x - 0.5) * 1.6 * scatter;
  mat2 R = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
  vec2 v = projected + R * (aCorner * size);
  vec2 clip = (v / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  float tx = mod(aTile, uAtlas.x);
  float ty = floor(aTile / uAtlas.x);
  vUv = (vec2(tx, ty) + (aCorner + 0.5)) / uAtlas;
  vLum = aLum;
  vReveal = clamp(smoothstep(0.06, 0.45, p) + h + flash, 0.0, 1.0);
  // Background cells stay a whisper until they turn into emails, so no frame shows round the face
  float bg = mix(0.22, 1.0, smoothstep(0.05, 0.2, aLum));
  vAlpha = (1.0 - smoothstep(F * 0.5, F * 0.88, z)) * mix(bg, 1.0, vReveal);
  // The field steps back behind the one-line summary
  vAlpha *= mix(1.0, 0.4, smoothstep(0.46, 0.62, p));
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
in float vLum;
in float vReveal;
in float vAlpha;
uniform sampler2D uTex;
out vec4 o;
void main() {
  vec3 t = texture(uTex, vUv).rgb;
  float tl = dot(t, vec3(0.299, 0.587, 0.114));
  float L = pow(vLum, 1.1);
  vec3 bone = vec3(0.925, 0.914, 0.886);
  vec3 portrait = min(bone * L * (0.72 + 0.6 * tl) * 1.2, vec3(1.0));
  vec3 col = mix(portrait, t * 1.15, vReveal);
  o = vec4(col * vAlpha, vAlpha);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('createShader failed')
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader error')
  return sh
}

export default function MosaicCanvas({ heroId, slotId }: { heroId: string; slotId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = document.getElementById(heroId)
    const slot = document.getElementById(slotId)
    if (!canvas || !hero || !slot) return
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: true, alpha: true })
    if (!gl || gl.isContextLost()) return // the pixelated portrait underneath stays as the design

    gsap.registerPlugin(ScrollTrigger)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let disposed = false
    let raf = 0
    let visible = true
    const state = { progress: 0, mouse: [-9999, -9999], target: [-9999, -9999], hover: 0, time: 0 }

    const prog = gl.createProgram()
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    } catch {
      return // a driver that rejects the shaders keeps the pixelated portrait
    }
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const U = (n: string) => gl.getUniformLocation(prog, n)
    const u = {
      res: U('uRes'), rect: U('uRect'), grid: U('uGrid'), atlas: U('uAtlas'), progress: U('uProgress'),
      mouse: U('uMouse'), hover: U('uHover'), time: U('uTime'), tex: U('uTex'),
    }

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buffers: WebGLBuffer[] = []
    let texture: WebGLTexture | null = null
    const buf = (data: Float32Array, name: string, size: number, divisor: number) => {
      const loc = gl.getAttribLocation(prog, name)
      const b = gl.createBuffer()
      buffers.push(b)
      gl.bindBuffer(gl.ARRAY_BUFFER, b)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(loc, divisor)
    }
    buf(new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), 'aCorner', 2, 0)

    let count = 0
    let grid: [number, number] = [1, 1]
    let atlasGrid: [number, number] = [1, 1]
    let ready = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.res, w, h)
      const r = slot.getBoundingClientRect()
      const stage = canvas.getBoundingClientRect()
      gl.uniform4f(u.rect, r.left - stage.left, r.top - stage.top, r.width, r.height)
      draw()
    }

    const draw = () => {
      if (!ready) return
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(u.progress, state.progress)
      gl.uniform2f(u.mouse, state.mouse[0], state.mouse[1])
      gl.uniform1f(u.hover, state.hover)
      gl.uniform1f(u.time, state.time)
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)
    }

    const loop = (t: number) => {
      if (disposed) return
      if (!reduce) state.time = t / 1000
      state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.18
      state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.18
      draw()
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const start = () => { if (!raf && !disposed) raf = requestAnimationFrame(loop) }

    Promise.all([
      fetch('/directions/mosaic/cells.json').then((r) => r.json() as Promise<MosaicData>),
      new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = rej
        img.src = '/directions/mosaic/atlas.webp'
      }).then(async (img) => { await img.decode().catch(() => undefined); return img }),
    ]).then(([data, img]) => {
      if (disposed) return
      count = data.cells.length
      grid = [data.cols, data.rows]
      atlasGrid = [data.atlasCols, data.atlasRows]
      const cell = new Float32Array(count * 2)
      const lum = new Float32Array(count)
      const tile = new Float32Array(count)
      const rand = new Float32Array(count * 3)
      let seed = 7
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
      data.cells.forEach(([x, y, l, t], i) => {
        cell[i * 2] = x; cell[i * 2 + 1] = y; lum[i] = l; tile[i] = t
        rand[i * 3] = rnd(); rand[i * 3 + 1] = rnd(); rand[i * 3 + 2] = rnd()
      })
      buf(cell, 'aCell', 2, 1)
      buf(lum, 'aLum', 1, 1)
      buf(tile, 'aTile', 1, 1)
      buf(rand, 'aRand', 3, 1)

      texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.uniform1i(u.tex, 0)
      gl.uniform2f(u.grid, grid[0], grid[1])
      gl.uniform2f(u.atlas, atlasGrid[0], atlasGrid[1])
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      ready = true
      resize()
      canvas.dataset.ready = 'true'
      start()
    }).catch(() => undefined)

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      state.target = [e.clientX - r.left, e.clientY - r.top]
      gsap.to(state, { hover: 1, duration: 0.4, overwrite: 'auto' })
    }
    const onLeave = () => gsap.to(state, { hover: 0, duration: 0.6, overwrite: 'auto' })
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }

    // The dive: scroll through the hero's height while the stage is sticky
    const st = reduce
      ? null
      : ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => { state.progress = self.progress },
        })

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(hero)
    window.addEventListener('resize', resize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      st?.kill()
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      // Free what this effect made; the context itself stays usable for a remount
      buffers.forEach((b) => gl.deleteBuffer(b))
      if (texture) gl.deleteTexture(texture)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(prog)
      delete canvas.dataset.ready
    }
  }, [heroId, slotId])

  return <canvas ref={canvasRef} aria-hidden="true" data-mosaic-canvas="" />
}
