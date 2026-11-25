'use client'

import { useReveals } from '../shared/useReveals'

// Direction B outside its signature: the shared line, clip and parallax reveals only.
export default function LayersMotion() {
  useReveals('[data-direction="layers"]')
  return null
}
