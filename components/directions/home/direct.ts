// Brings one directed recording (Directed.tsx) to life: captions and the clock follow playback,
// the camera eases to each cue's point (and cuts when the picture cuts: a loop, or a jump), the
// rail fills, the toggle plays and pauses, and each step mark plays from that step. Whether it
// plays on its own is the caller's decision (visibility, the stage, reduced motion).

import gsap from 'gsap'
import type { Cue } from './Directed'

export type DirectedControl = {
  video: HTMLVideoElement
  /** the part that never moves, for visibility checks (the video scales past it) */
  lens: HTMLElement
  /** set the source (if not yet) and play; a refused autoplay leaves the toggle on Play */
  play: () => void
  load: () => void
  /** paused by the visitor, so nothing should restart it on its own */
  held: () => boolean
  destroy: () => void
}

const clock = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function attachDirected(root: HTMLElement, reduce: boolean): DirectedControl {
  const video = root.querySelector<HTMLVideoElement>('[data-video]')!
  const lens = root.querySelector<HTMLElement>('[data-lens]')!
  const rail = root.querySelector<HTMLElement>('[data-rail]')!
  const toggle = root.querySelector<HTMLButtonElement>('[data-toggle]')!
  const time = root.querySelector<HTMLElement>('[data-time]')!
  const text = root.querySelector<HTMLElement>('[data-text]')!
  const cues: Cue[] = JSON.parse(video.dataset.cues || '[]')
  const label = video.dataset.label ?? 'the recording'
  let at = -1
  let last = 0
  let held = false
  let raf = 0

  const load = () => { if (!video.src && video.dataset.src) { video.preload = 'auto'; video.src = video.dataset.src } }
  const setToggle = (playing: boolean) => {
    toggle.textContent = playing ? 'Pause' : 'Play'
    toggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${label}`)
  }
  const play = () => { load(); video.play().catch(() => setToggle(false)) }

  // The camera puts the cue's point at the centre of the frame at its zoom, never past an edge
  const aim = (cue: Cue | undefined, cut: boolean) => {
    const [x, y, z] = cue?.[2] ?? [0.5, 0.5, 1]
    gsap.to(video, {
      scale: z,
      xPercent: clamp((0.5 - x * z) * 100, (1 - z) * 100, 0),
      yPercent: clamp((0.5 - y * z) * 100, (1 - z) * 100, 0),
      duration: reduce || cut ? 0 : 1.4, ease: 'power3.inOut', overwrite: true,
    })
  }
  const onTime = () => {
    time.textContent = clock(video.currentTime)
    // A jump back in time is the loop restarting (or an earlier step chosen): the picture has
    // already cut, so the camera cuts with it instead of easing across it
    const back = video.currentTime < last - 0.5
    last = video.currentTime
    let k = 0
    cues.forEach(([t], n) => { if (video.currentTime >= t) k = n })
    if (k === at) return
    const cut = back || Math.abs(k - at) > 1
    at = k
    if (text.textContent !== cues[k][1]) text.textContent = cues[k][1]
    aim(cues[k], cut)
  }
  // The rail follows playback every frame while it plays
  const fill = () => {
    if (video.duration) rail.style.setProperty('--p', String(video.currentTime / video.duration))
    raf = video.paused ? 0 : requestAnimationFrame(fill)
  }

  const offs: (() => void)[] = []
  const on = (el: EventTarget, type: string, fn: EventListener) => { el.addEventListener(type, fn); offs.push(() => el.removeEventListener(type, fn)) }
  on(video, 'timeupdate', onTime)
  on(video, 'seeked', onTime)
  on(video, 'play', () => { setToggle(true); if (!raf) raf = requestAnimationFrame(fill) })
  on(video, 'playing', () => video.setAttribute('data-playing', ''))
  on(video, 'pause', () => setToggle(false))
  on(toggle, 'click', () => {
    if (video.paused) { held = false; play() } else { held = true; video.pause() }
  })
  root.querySelectorAll<HTMLButtonElement>('[data-seek]').forEach((b) => on(b, 'click', () => {
    const to = Number(b.dataset.seek)
    held = false
    load()
    if (video.readyState >= 1) video.currentTime = to
    else video.addEventListener('loadedmetadata', () => { video.currentTime = to }, { once: true })
    play()
  }))

  // On a narrow rail, steps a moment apart would put their marks closer than a finger can tell
  // apart (24px). Those marks are hidden; playback still reaches the step and shows its caption.
  const marks = [...root.querySelectorAll<HTMLButtonElement>('[data-seek]')]
  const spaceMarks = () => {
    marks.forEach((b) => { b.hidden = false })
    let right = -Infinity
    marks.forEach((b) => {
      const r = b.getBoundingClientRect()
      const room = r.left >= right
      b.hidden = !room
      if (room) right = r.right
    })
  }
  const sized = new ResizeObserver(spaceMarks)
  sized.observe(rail)
  offs.push(() => sized.disconnect())

  return {
    video, lens, play, load,
    held: () => held,
    destroy: () => {
      cancelAnimationFrame(raf)
      offs.forEach((off) => off())
      gsap.killTweensOf(video)
    },
  }
}

export const prefersStill = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
