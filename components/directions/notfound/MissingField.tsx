'use client'

// The 404's field: a wall of the emails her system sent for Gwen Addo (the homepage portrait's
// emails, cells.json, in order, drawn from the same 42 designs in atlas.webp), each square large
// enough to read as the email it is, filling the ink opening. On arrival they land in a wave, but
// one never does: its place stays empty and an orange outline appears there. That one is this page.
// Alive like the homepage: now and then a few squares light up, the way the emails went out, and
// with a fine pointer the squares near it lift into colour. Only the squares that change are
// redrawn once the wave has landed, and nothing runs while the field is off screen or the tab is hidden.
// Reduced motion: the finished wall with its gap, still. Decorative: the words say it all.

import { useEffect, useRef } from 'react'

type Cells = { cells: [number, number, number, number][]; atlasCols: number; atlasRows: number }

const GREY = 0.34 // a square at rest
const LIFT_RADIUS = 170
const ARRIVAL = 1.5 // seconds for the wave
// Square size: big enough to read as an email (header, button, QR code)
const cellFor = (w: number) => (w < 760 ? w / 7.5 : Math.min(72, Math.max(52, w / 22)))
// Where the missing square sits, as a share of the wall, clear of the words: up and right on a
// wide screen; near the top on a phone, where the words fill the lower part
const gapAt = (w: number): [number, number] => (w < 760 ? [0.72, 0.16] : [0.72, 0.3])

export default function MissingField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let alive = true
    let raf = 0
    let visible = true

    // Layout, rebuilt on resize
    let cell = 0, cols = 0, rows = 0, count = 0, gap = 0, dpr = 1, width = 0
    let sent: number[] = [] // the design of each email, in the order they went out
    let lift = new Float32Array(0) // 0 rest, 1 full colour
    let arrive = new Float32Array(0) // seconds each square lands
    const flashes: { i: number; t0: number }[] = []
    const pointer = { x: -1e4, y: -1e4, active: false }
    let t0 = performance.now()
    let arrived = still
    let colour: HTMLCanvasElement | null = null
    let grey: HTMLCanvasElement | null = null
    let atlas: HTMLImageElement | null = null
    let atlasCols = 7, atlasRows = 6

    const css = getComputedStyle(canvas)
    const ink = css.getPropertyValue('--ink-ground').trim() || '#121210'
    const signal = css.getPropertyValue('--signal').trim() || '#f2471a'

    // The 42 designs at the drawn size, in colour and in grey (grey made by hand: Safari has no canvas filter)
    const bake = () => {
      if (!atlas) return
      const s = Math.max(1, Math.round(cell * dpr))
      const c = document.createElement('canvas')
      c.width = atlasCols * s; c.height = atlasRows * s
      const cx = c.getContext('2d')!
      cx.imageSmoothingQuality = 'high'
      cx.drawImage(atlas, 0, 0, c.width, c.height)
      const g = document.createElement('canvas')
      g.width = c.width; g.height = c.height
      const data = cx.getImageData(0, 0, c.width, c.height)
      const p = data.data
      for (let k = 0; k < p.length; k += 4) {
        const l = p[k] * 0.2126 + p[k + 1] * 0.7152 + p[k + 2] * 0.0722
        p[k] = p[k + 1] = p[k + 2] = l
      }
      g.getContext('2d')!.putImageData(data, 0, 0)
      colour = c; grey = g
    }

    const xy = (i: number) => [(i % cols) * cell, Math.floor(i / cols) * cell] as const

    // One square, cleared and drawn as it is now
    const drawTile = (i: number, now: number) => {
      const [x, y] = xy(i)
      const X = x * dpr, Y = y * dpr, S = cell * dpr
      ctx.fillStyle = ink
      ctx.fillRect(X, Y, S + 1, S + 1)
      const pad = Math.max(1, cell * 0.05) * dpr // a hairline of ink between squares
      if (i === gap) {
        if (!arrived) return
        // The empty place, outlined in orange, breathing slowly
        const since = (now - t0) / 1000 - ARRIVAL
        const a = still ? 1 : Math.min(1, Math.max(0, since / 0.6)) * (0.75 + 0.25 * Math.cos(since * 2.2))
        ctx.globalAlpha = a
        ctx.strokeStyle = signal
        ctx.lineWidth = 1.5 * dpr
        ctx.strokeRect(X + pad + 0.75 * dpr, Y + pad + 0.75 * dpr, S - pad * 2 - 1.5 * dpr, S - pad * 2 - 1.5 * dpr)
        ctx.globalAlpha = 1
        return
      }
      if (!colour || !grey) return
      let k = 1
      if (!arrived) {
        const t = (now - t0) / 1000 - arrive[i]
        if (t <= 0) return
        k = Math.min(1, t / 0.45)
      }
      const s = Math.round(cell * dpr)
      const design = sent[i % sent.length]
      const sx = (design % atlasCols) * s
      const sy = Math.floor(design / atlasCols) * s
      const d = S - pad * 2
      const scale = 0.72 + 0.28 * (1 - (1 - k) ** 3)
      const o = (d * (1 - scale)) / 2
      ctx.globalAlpha = GREY * k
      ctx.drawImage(grey, sx, sy, s, s, X + pad + o, Y + pad + o, d * scale, d * scale)
      if (lift[i] > 0.01) {
        ctx.globalAlpha = Math.min(1, lift[i]) * k
        ctx.drawImage(colour, sx, sy, s, s, X + pad + o, Y + pad + o, d * scale, d * scale)
      }
      ctx.globalAlpha = 1
    }

    const drawAll = (now: number) => {
      ctx.fillStyle = ink
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < count; i++) drawTile(i, now)
    }

    // The pointer's pull on a square: full at the pointer, nothing past the radius
    const pull = (i: number) => {
      if (!pointer.active) return 0
      const [x, y] = xy(i)
      const dist = Math.hypot(x + cell / 2 - pointer.x, y + cell / 2 - pointer.y)
      return dist >= LIFT_RADIUS ? 0 : (1 - dist / LIFT_RADIUS) ** 1.5
    }

    let lastFlash = 0
    const frame = (now: number) => {
      raf = 0
      if (!alive || !visible || document.hidden || !count) return
      if (!arrived) {
        drawAll(now)
        if ((now - t0) / 1000 > ARRIVAL + 0.5) arrived = true
      } else {
        const dirty = new Set<number>([gap])
        // A few emails go out: a square lights up and settles back
        if (now - lastFlash > 700) {
          lastFlash = now
          for (let n = 0; n < 2; n++) {
            const i = Math.floor(Math.random() * count)
            if (i !== gap) flashes.push({ i, t0: now })
          }
        }
        for (let f = flashes.length - 1; f >= 0; f--) {
          const { i } = flashes[f]
          const age = (now - flashes[f].t0) / 1000
          lift[i] = age >= 1 ? pull(i) : Math.max(Math.sin(age * Math.PI) * 0.9, pull(i))
          if (age >= 1) flashes.splice(f, 1)
          dirty.add(i)
        }
        // The pointer: squares near it ease towards their pull
        if (fine) {
          const reach = Math.ceil(LIFT_RADIUS / cell) + 1
          const pc = Math.floor(pointer.x / cell), pr = Math.floor(pointer.y / cell)
          for (let i = 0; i < count; i++) {
            const near = Math.abs((i % cols) - pc) <= reach && Math.abs(Math.floor(i / cols) - pr) <= reach
            if (!near && lift[i] < 0.005) continue
            if (flashes.some((f) => f.i === i)) continue
            const target = pull(i)
            const next = Math.abs(target - lift[i]) < 0.004 ? target : lift[i] + (target - lift[i]) * 0.16
            if (next !== lift[i]) { lift[i] = next; dirty.add(i) }
          }
        }
        dirty.forEach((i) => drawTile(i, now))
      }
      if (!still) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf && !still && alive) raf = requestAnimationFrame(frame) }

    const layout = () => {
      const rect = host.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      cols = Math.max(1, Math.round(rect.width / cellFor(rect.width)))
      cell = rect.width / cols
      rows = Math.ceil(rect.height / cell)
      count = cols * rows
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rows * cell * dpr)
      canvas.style.height = `${rows * cell}px` // the last row runs past the opening, which clips it
      width = Math.round(rect.width)
      const [gx, gy] = gapAt(rect.width)
      gap = Math.floor(gy * rows) * cols + Math.floor(gx * cols)
      lift = new Float32Array(count)
      arrive = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        const c = (i % cols) / cols, r = Math.floor(i / cols) / rows
        arrive[i] = (c * 0.55 + r * 0.45) * (ARRIVAL - 0.55) + Math.random() * 0.25
      }
      bake()
    }

    Promise.all([
      fetch('/directions/mosaic/cells.json').then((r) => r.json() as Promise<Cells>),
      new Promise<HTMLImageElement>((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = '/directions/mosaic/atlas.webp' }),
    ]).then(([data, img]) => {
      if (!alive) return
      atlas = img
      atlasCols = data.atlasCols; atlasRows = data.atlasRows
      sent = data.cells.map((c) => c[3])
      layout()
      t0 = performance.now()
      if (still) drawAll(t0)
      else kick()
    }).catch(() => { /* the words carry the page without the wall */ })

    const sized = new ResizeObserver(([e]) => {
      // Before the wall is laid, or while it is still landing, the arrival draws it
      if (!atlas || !arrived) return
      if (Math.round(e.contentRect.width) === width && Math.ceil(e.contentRect.height / cell) === rows) return
      layout()
      drawAll(performance.now())
      kick()
    })
    sized.observe(host)

    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick() })
    seen.observe(canvas)
    const onVis = () => { if (!document.hidden) kick() }
    document.addEventListener('visibilitychange', onVis)

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true
      kick()
    }
    const leave = () => { pointer.active = false; kick() }
    if (fine && !still) { host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave) }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      sized.disconnect(); seen.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
