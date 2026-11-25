// A recording that shows its still until it plays. The still is a real image (sized for the screen,
// AVIF or WebP, lazy unless it is the first thing on the page), and the video sits over it, unseen
// until it is playing (playWhileSeen marks it). A video's own poster can't do this: it is one
// full-size file, fetched at once wherever the video is on the page.
// With reduced motion, Save-Data or no script the video never plays, and the still is the picture.
// The still carries the description; the moving copy of it is hidden from screen readers.

import Image from 'next/image'
import s from './recording.module.css'

export default function Recording({ name, width, height, label, sizes, first = false }: {
  /** the files in public/directions/rec: <name>.mp4 and <name>-poster.jpg */
  name: string
  width: number
  height: number
  label: string
  sizes: string
  /** the largest thing in the first view: fetched first */
  first?: boolean
}) {
  return (
    <div className={s.rec}>
      <Image
        src={`/directions/rec/${name}-poster.jpg`}
        alt={label}
        width={width}
        height={height}
        sizes={sizes}
        {...(first ? { priority: true, fetchPriority: 'high' as const } : {})}
      />
      <video className={s.moving} src={`/directions/rec/${name}.mp4`} width={width} height={height} muted loop playsInline preload="none" aria-hidden="true" data-auto="" />
    </div>
  )
}
