'use client'

import { useReveals } from '../shared/useReveals'

// Everything outside the signature scene: the shared line, clip and parallax reveals only.
export default function HomeMotion() {
  useReveals('[data-direction="home"]')
  return null
}
