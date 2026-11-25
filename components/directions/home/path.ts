// The visitor's chosen path: which of the three roles they are hiring for. Picked in "What I do"
// (a role name or a phrase of the sentence); remembered for the visit so the sections, "What do
// you need?" and the contact link can follow it. Nothing leaves the browser.

import { LAYER_NAMES, type Layer } from '../../../lib/directions/triage'

/** The three roles, in the sentence's order, and the section that proves each */
export const PATHS: { n: Layer; name: string; target: string }[] = [
  { n: 1, name: LAYER_NAMES[1], target: 'work' },
  { n: 2, name: LAYER_NAMES[2], target: 'run' },
  { n: 3, name: LAYER_NAMES[3], target: 'fix' },
]

const KEY = 'ja-path'
const EVENT = 'ja:path'

export function readPath(): Layer | null {
  try {
    const v = Number(sessionStorage.getItem(KEY))
    return v === 1 || v === 2 || v === 3 ? v : null
  } catch {
    return null
  }
}

export function choosePath(n: Layer) {
  try { sessionStorage.setItem(KEY, String(n)) } catch { /* private mode: the choice lasts this page */ }
  window.dispatchEvent(new CustomEvent<Layer>(EVENT, { detail: n }))
}

export function onPath(fn: (n: Layer) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Layer>).detail)
  window.addEventListener(EVENT, h)
  return () => window.removeEventListener(EVENT, h)
}
