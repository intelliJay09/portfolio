'use client'

// "Say hello": a plain mailto link that, once the visitor has picked a role in "What I do",
// carries it as the subject, so the email arrives already saying what it's about.

import { useEffect, useState } from 'react'
import type { Layer } from '../../../lib/directions/triage'
import { PATHS, onPath, readPath } from './path'

export default function Hello({ email, className }: { email: string; className?: string }) {
  const [path, setPath] = useState<Layer | null>(null)
  useEffect(() => {
    setPath(readPath())
    return onPath(setPath)
  }, [])
  const subject = path ? `?subject=${encodeURIComponent(`About the ${PATHS[path - 1].name.toLowerCase()} role`)}` : ''
  return <a className={className} href={`mailto:${email}${subject}`}>Say hello</a>
}
