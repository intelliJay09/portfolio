'use client'

// The homepage's one signature moment, one sticky scene:
//   1. Her head and shoulders, drawn only by the 1,695 real emails from Gwen Addo's journey
//      (one tile per email sent; no tile sits outside her). They fly in from behind the camera
//      on load while her name rises with them. The pointer lifts nearby tiles into colour; a
//      few flash at a time, the way the emails went out.
//   2. Scrolling bursts the portrait: the emails fly past the camera and clear, while the ink
//      lifts away like a sheet to the paper beneath, and the page carries on in normal scroll.
//
// WebGL2 draws the portrait in one instanced call. All content is server-rendered and the
// canvas is decorative. Reduced motion gets the portrait still, with the text in place.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type MosaicData = { cols: number; rows: number; atlasCols: number; atlasRows: number; cells: [number, number, number, number][] }

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
uniform float uIntro;   // 0 to 1, the arrival
uniform int uMode;      // 1 photo, 2 send, 3 develop, 4 fly
uniform float uFade;    // share of the rows that fade out at the bottom (phone)
out vec2 vUv;
out vec2 vPhotoUv;
out float vLum;
out float vReveal;
out float vAlpha;
out float vPhoto;
out float vDevelop;
const float F = 1500.0;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float cell = uRect.z / uGrid.x;
  vec2 center = uRect.xy + (aCell + 0.5) * cell;
  float h = uHover * smoothstep(150.0, 0.0, distance(center, uMouse));

  // An email "goes out": a short flash in colour, a few tiles at a time
  float rate = 0.35 + aRand.y * 0.4;
  float slot = floor(uTime * rate + aRand.x * 31.0);
  float ph = fract(uTime * rate + aRand.x * 31.0);
  float flash = step(0.988, hash(slot * 7.31 + aTile * 1.7 + aRand.z * 113.0)) * sin(ph * 3.14159);

  // The arrival, per tile
  float row = aCell.y / uGrid.y;
  float order = (aCell.y * uGrid.x + aCell.x) / (uGrid.x * uGrid.y);
  float photo = 0.0;   // 1 = still the photograph
  float shown = 1.0;   // 0 = not there yet
  float develop = 1.0; // 0 = not yet developed
  float arrive = 0.0;  // 1 = still far behind the camera
  float burst = 0.0;   // a flash of colour at the moment a tile becomes an email
  if (uMode == 1) {
    float t = clamp((uIntro * 1.45 - row - aRand.x * 0.12) / 0.22, 0.0, 1.0);
    photo = 1.0 - t;
    burst = sin(t * 3.14159);
  } else if (uMode == 2) {
    float t = clamp((uIntro * 1.04 - order) / 0.035, 0.0, 1.0);
    shown = t;
    burst = sin(t * 3.14159);
  } else if (uMode == 3) {
    float L0 = clamp((aLum - 0.1) / 0.75, 0.0, 1.0);
    develop = smoothstep(0.0, 1.0, clamp((uIntro * 1.7 - (1.0 - L0) - aRand.x * 0.25) / 0.45, 0.0, 1.0));
  } else if (uMode == 4) {
    float t = clamp((uIntro * 1.35 - aRand.y * 0.35) / 1.0, 0.0, 1.0);
    arrive = pow(1.0 - t, 3.0); // eases in: fast from behind the camera, soft as it lands
    burst = 0.6 * (1.0 - t) * step(0.001, t);
  }

  // The burst: scatter in depth, rush past the camera, clear
  float p = uProgress;
  float scatter = smoothstep(0.0, 0.7, p);
  float dolly = smoothstep(0.2, 1.0, p);
  float z = (aRand.z - 0.4) * 1100.0 * scatter + h * 70.0 + dolly * (900.0 + aRand.x * 900.0);
  z += arrive * (1250.0 + aRand.x * 600.0);
  vec2 sc = uRes * 0.5;
  vec2 focus = uRect.xy + uRect.zw * vec2(0.5, 0.4);
  vec2 pos = center + (center - focus) * scatter * (0.1 + aRand.y * 0.5);
  pos += (center - focus) * arrive * (0.6 + aRand.z * 0.8);
  pos += (sc - focus) * smoothstep(0.0, 0.6, p);
  float s = F / max(F - z, 1.0);
  vec2 projected = sc + (pos - sc) * s;
  // While still the photograph, tiles sit edge to edge so it reads as one image
  float size = cell * mix(0.84, 1.002, photo) * s * (1.0 + h * 0.18);
  float ang = (aRand.x - 0.5) * 1.6 * max(scatter, arrive * 0.8);
  mat2 R = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
  vec2 v = projected + R * (aCorner * size);
  vec2 clip = (v / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  float tx = mod(aTile, uAtlas.x);
  float ty = floor(aTile / uAtlas.x);
  vUv = (vec2(tx, ty) + (aCorner + 0.5)) / uAtlas;
  vPhotoUv = (aCell + aCorner + 0.5) / uGrid;
  vLum = aLum;
  vPhoto = photo;
  vDevelop = develop;
  vReveal = clamp(smoothstep(0.04, 0.4, p) + h + flash * (1.0 - photo) + burst, 0.0, 1.0);
  vAlpha = (1.0 - smoothstep(F * 0.5, F * 0.88, z)) * (1.0 - smoothstep(0.62, 0.95, p)) * shown;
  vAlpha *= uFade > 0.0 ? 1.0 - smoothstep(1.0 - uFade, 1.0, row) * (1.0 - scatter) : 1.0;
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
in float vLum;
in float vReveal;
in float vAlpha;
in vec2 vPhotoUv;
in float vPhoto;
in float vDevelop;
uniform sampler2D uTex;
uniform sampler2D uPhoto;
out vec4 o;
void main() {
  vec3 t = texture(uTex, vUv).rgb;
  float tl = dot(t, vec3(0.299, 0.587, 0.114));
  vec3 bone = vec3(0.925, 0.914, 0.886);
  // A floor of grey keeps her hair and sweater visible against the ink: every tile is her
  // Tones stretched so her glasses and features read at tile scale
  float L = clamp((vLum - 0.1) / 0.75, 0.0, 1.0);
  vec3 portrait = min(bone * (0.14 + 0.86 * pow(L, 1.15)) * (0.72 + 0.6 * tl) * 1.15, vec3(1.0));
  portrait *= mix(0.12, 1.0, vDevelop);
  vec3 col = mix(portrait, t * 1.15, vReveal);
  vec4 ph = texture(uPhoto, vPhotoUv);
  vec3 photo = ph.a > 0.0 ? ph.rgb / ph.a : vec3(0.0);
  float a = vAlpha * mix(1.0, ph.a, vPhoto);
  col = mix(col, photo, vPhoto);
  o = vec4(col * a, a);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('createShader failed')
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader error')
  return sh
}

export type Intro = 'photo' | 'send' | 'develop' | 'fly'
const MODE: Record<Intro, number> = { photo: 1, send: 2, develop: 3, fly: 4 }
const DURATION: Record<Intro, number> = { photo: 1.9, send: 2.4, develop: 2.0, fly: 2.3 }

export default function SignatureScene({ intro }: { intro: Intro }) {
  useEffect(() => {
    const scene = document.querySelector<HTMLElement>('[data-scene]')
    const stage = scene?.querySelector<HTMLElement>('[data-stage]')
    const canvas = scene?.querySelector<HTMLCanvasElement>('[data-scene-canvas]')
    const slot = scene?.querySelector<HTMLElement>('[data-face-slot]')
    if (!scene || !stage || !canvas || !slot) return
    gsap.registerPlugin(ScrollTrigger)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const state = { progress: 0, intro: 0, hover: 0, time: 0, mouse: [-9999, -9999], target: [-9999, -9999] }
    const counter = scene.querySelector<HTMLElement>('[data-count]')
    const photoImg = scene.querySelector<HTMLElement>('[data-photo]')
    let disposed = false
    let raf = 0
    let visible = true

    // ---------- WebGL: the portrait and its burst ----------
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: true, alpha: true })
    let draw = () => {}
    let cleanupGl = () => {}
    if (gl && !gl.isContextLost()) {
      const prog = gl.createProgram()
      let ok = true
      try {
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
        gl.linkProgram(prog)
        ok = !!gl.getProgramParameter(prog, gl.LINK_STATUS)
      } catch {
        ok = false
      }
      if (ok) {
        gl.useProgram(prog)
        const U = (n: string) => gl.getUniformLocation(prog, n)
        const u = {
          res: U('uRes'), rect: U('uRect'), grid: U('uGrid'), atlas: U('uAtlas'), progress: U('uProgress'),
          mouse: U('uMouse'), hover: U('uHover'), time: U('uTime'), tex: U('uTex'),
          introP: U('uIntro'), mode: U('uMode'), photo: U('uPhoto'), fade: U('uFade'),
        }
        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)
        const buffers: WebGLBuffer[] = []
        let texture: WebGLTexture | null = null
        let photoTex: WebGLTexture | null = null
        const attr = (data: Float32Array, name: string, size: number, divisor: number) => {
          const loc = gl.getAttribLocation(prog, name)
          const b = gl.createBuffer()
          buffers.push(b)
          gl.bindBuffer(gl.ARRAY_BUFFER, b)
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
          gl.enableVertexAttribArray(loc)
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
          gl.vertexAttribDivisor(loc, divisor)
        }
        attr(new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), 'aCorner', 2, 0)
        let count = 0
        let ready = false

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          const r = canvas.getBoundingClientRect()
          canvas.width = Math.round(r.width * dpr)
          canvas.height = Math.round(r.height * dpr)
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.uniform2f(u.res, r.width, r.height)
          // On a phone the portrait sits above the text, so her shoulders fade into the ink
          gl.uniform1f(u.fade, window.matchMedia('(max-width: 760px)').matches ? 0.3 : 0)
          const sr = slot.getBoundingClientRect()
          gl.uniform4f(u.rect, sr.left - r.left, sr.top - r.top, sr.width, sr.height)
        }

        draw = () => {
          if (!ready) return
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT)
          if (state.progress >= 1) return // the emails have all gone past
          gl.uniform1f(u.progress, state.progress)
          gl.uniform2f(u.mouse, state.mouse[0], state.mouse[1])
          gl.uniform1f(u.hover, state.hover)
          gl.uniform1f(u.time, state.time)
          gl.uniform1f(u.introP, state.intro)
          gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)
        }

        Promise.all([
          fetch('/directions/mosaic/cells.json').then((r) => r.json() as Promise<MosaicData>),
          new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image()
            img.onload = () => res(img)
            img.onerror = rej
            img.src = '/directions/mosaic/atlas.webp'
          }),
          new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image()
            img.onload = () => res(img)
            img.onerror = rej
            img.src = '/directions/mosaic/bust.webp'
          }),
        ])
          .then(([data, img, bust]) => {
            if (disposed) return
            count = data.cells.length
            const cell = new Float32Array(count * 2)
            const lum = new Float32Array(count)
            const tile = new Float32Array(count)
            const rand = new Float32Array(count * 3)
            let seed = 7
            const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
            data.cells.forEach(([x, y, l, t], i) => {
              cell[i * 2] = x
              cell[i * 2 + 1] = y
              lum[i] = l
              tile[i] = t
              rand[i * 3] = rnd()
              rand[i * 3 + 1] = rnd()
              rand[i * 3 + 2] = rnd()
            })
            attr(cell, 'aCell', 2, 1)
            attr(lum, 'aLum', 1, 1)
            attr(tile, 'aTile', 1, 1)
            attr(rand, 'aRand', 3, 1)
            texture = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
            gl.generateMipmap(gl.TEXTURE_2D)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.uniform1i(u.tex, 0)
            photoTex = gl.createTexture()
            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D, photoTex)
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bust)
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
            gl.generateMipmap(gl.TEXTURE_2D)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.uniform1i(u.photo, 1)
            gl.activeTexture(gl.TEXTURE0)
            gl.uniform1i(u.mode, MODE[intro])
            gl.uniform2f(u.grid, data.cols, data.rows)
            gl.uniform2f(u.atlas, data.atlasCols, data.atlasRows)
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            ready = true
            resize()
            canvas.dataset.ready = 'true'
            start()
            playIntro()
          })
          .catch(() => undefined)

        window.addEventListener('resize', resize)
        cleanupGl = () => {
          window.removeEventListener('resize', resize)
          buffers.forEach((b) => gl.deleteBuffer(b))
          if (texture) gl.deleteTexture(texture)
          if (photoTex) gl.deleteTexture(photoTex)
          gl.deleteVertexArray(vao)
          gl.deleteProgram(prog)
          delete canvas.dataset.ready
        }
      }
    }

    // ---------- The arrival ----------
    const showCount = (n: number) => { if (counter) counter.textContent = Math.round(n).toLocaleString('en-GB') }
    // The hero text comes in with the portrait, as one entrance
    let textIn = false
    const bringText = (at: gsap.core.Timeline | null, offset = 0) => {
      if (textIn) return
      textIn = true
      const rise = scene.querySelectorAll('[data-rise]')
      const fade = scene.querySelectorAll('[data-fade]')
      const tl = at ?? gsap.timeline()
      // y: 0 overrides the held-back CSS offset, which GSAP would otherwise keep as a base
      tl.fromTo(rise, { y: 0, yPercent: 108 }, { y: 0, yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' }, offset)
        .fromTo(fade, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.15, clearProps: 'transform' }, offset + 0.45)
      stage.removeAttribute('data-entrance')
    }
    // If WebGL is slow or unavailable, the words never wait longer than this
    const textFallback = window.setTimeout(() => bringText(null), 2500)

    const playIntro = () => {
      window.clearTimeout(textFallback)
      if (reduce) {
        // Still: the photograph stays a photograph; the others arrive complete
        state.intro = intro === 'photo' ? 0 : 1
        stage.removeAttribute('data-entrance')
        return
      }
      const counts = intro !== 'develop'
      if (counts) showCount(0)
      const tl = gsap.timeline({ delay: intro === 'photo' ? 0.7 : 0.15 })
      tl.to(state, {
        intro: 1,
        duration: DURATION[intro],
        ease: intro === 'send' ? 'none' : intro === 'fly' ? 'power1.out' : 'power1.inOut',
        onUpdate: () => {
          if (!counts) return
          // The count follows the emails that have actually settled
          const i = state.intro
          const k = intro === 'send' ? i * 1.04 : intro === 'fly' ? (i * 1.35 - 0.95) / 0.35 : i * 1.45 - 0.06
          showCount(Math.max(0, Math.min(1, k)) * 1695)
        },
        onComplete: () => showCount(1695),
      }, 0)
      // The name lands as the face resolves
      bringText(tl, DURATION[intro] * (intro === 'fly' ? 0.42 : 0.3))
      // The DOM photograph steps back once WebGL is drawing the same pixels
      if (photoImg) gsap.to(photoImg, { autoAlpha: 0, duration: 0.25, delay: 0.1 })
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

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      state.target = [e.clientX - r.left, e.clientY - r.top]
      gsap.to(state, { hover: 1, duration: 0.4, overwrite: 'auto' })
    }
    const onLeave = () => gsap.to(state, { hover: 0, duration: 0.6, overwrite: 'auto' })
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }

    // ---------- The scroll ----------
    const mm = gsap.matchMedia()
    // reduce is listed so the callback also runs when only it matches (desktop, reduced motion)
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { motion } = ctx.conditions as { motion: boolean }
      if (!motion) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // Smoothed scrub: the burst glides after the scroll instead of stepping with it
        scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })
      tl.to('[data-hero-text]', { autoAlpha: 0, y: -30, duration: 0.18 }, 0.04)
        .to(state, { progress: 1, duration: 0.8 }, 0.05)
        // The ink lifts away like a sheet, so the page below arrives clean, never through grey
        .fromTo('[data-ink]', { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.4, ease: 'power2.inOut' }, 0.5)
    })

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(scene)
    start()

    return () => {
      window.clearTimeout(textFallback)
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      mm.revert()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cleanupGl()
    }
  }, [intro])

  return null
}
