// A directed recording (markup only; direct.ts brings it to life). Each cue says what is
// happening at that second and where the camera should look ([x, y, zoom], fractions of the
// frame), so a step is seen close to real size. The rail under it marks each step; any step can
// be played from, and the recording can be paused. Without JavaScript it is the still and the
// list of steps.
// The still is a real image under the video (sized for the screen, lazy unless `first`), not the
// video's poster (one full-size file fetched at once); the video shows once it is playing.

import type { CSSProperties } from 'react'
import Image from 'next/image'
import d from './directed.module.css'

/** [seconds, what is happening, camera: [x, y, zoom] centre of attention] */
export type Cue = [number, string, [number, number, number]]

type Props = {
  rec: string
  cues: Cue[]
  /** seconds, from ffprobe, so the step marks sit right before the file loads */
  duration: number
  /** what the recording is, for screen readers ("Orella in use") */
  label: string
  className?: string
  /** how wide the frame is drawn, for the still's sizes */
  sizes?: string
  /** the largest thing in the first view: its still is fetched first */
  first?: boolean
}

export default function Directed({ rec, cues, duration, label, className, sizes = '(min-width: 1024px) 60vw, 100vw', first = false }: Props) {
  // A step mark for each new caption (camera-only moves share their step's caption)
  const steps = cues.filter((c, k) => k === 0 || c[1] !== cues[k - 1][1])
  return (
    <div className={`${d.screen} ${className ?? ''}`} data-directed="">
      <div className={d.frame} data-frame="">
        <div className={d.lens} data-lens="">
          <Image
            className={d.still}
            src={`/directions/rec/${rec}-poster.jpg`}
            alt=""
            width={1440}
            height={900}
            sizes={sizes}
            {...(first ? { priority: true, fetchPriority: 'high' as const } : {})}
          />
          <video
            className={d.video}
            data-video=""
            data-src={`/directions/rec/${rec}.mp4`}
            data-cues={JSON.stringify(cues)}
            data-label={label}
            width={1440}
            height={900}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
          />
        </div>
      </div>
      <div className={d.player} data-player="">
        <div className={d.rail} style={{ '--p': 0 } as CSSProperties} data-rail="">
          {steps.map(([at, text]) => (
            <button
              key={at}
              type="button"
              className={d.step}
              style={{ left: `${(at / duration) * 100}%` }}
              data-seek={at}
              aria-label={`Play from: ${text}`}
            />
          ))}
        </div>
        <div className={d.controls}>
          <button type="button" className={d.toggle} data-toggle="" aria-label={`Play ${label}`}>Play</button>
          <p className={d.cue} aria-hidden="true">
            <span className={d.cueTime} data-time="">00:00</span>
            <span data-text="">{cues[0][1]}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
