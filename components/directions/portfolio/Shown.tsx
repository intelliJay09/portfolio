// One piece of work, as one part of the sentence shows it: a recording, a site's own homepage, the
// emails a journey sends, or the incidents that were fixed. Used twice per piece: inline in the
// list (phones, reduced motion, no script) and on the desktop stage beside the list.
// Recordings never load until they play (preload none); images are lazy, and a hidden one is
// never fetched.

import Image from 'next/image'
import type { Layer } from '../../../lib/directions/triage'
import type { Piece } from '../../../lib/directions/portfolio'
import { CASES } from '../home/Cases'
import s from './shown.module.css'

export default function Shown({ piece, lens, where }: { piece: Piece; lens: Layer; where: 'row' | 'stage' }) {
  const show = piece.show[lens]
  if (!show) return null
  const m = show.media
  const tag = { 'data-for': lens, 'data-primary': lens === piece.lenses[0] ? '' : undefined }
  const sizes = where === 'stage' ? '(min-width: 1024px) 52vw, 100vw' : '100vw'

  if (m.kind === 'video') {
    const tall = m.h > m.w
    return (
      <figure className={`${s.frame} ${tall ? s.tall : ''}`} data-where={where} {...tag}>
        <video
          className={s.video}
          src={m.src}
          poster={m.poster}
          width={m.w}
          height={m.h}
          muted
          loop
          playsInline
          preload="none"
          aria-label={m.label}
          data-video=""
        />
      </figure>
    )
  }

  if (m.kind === 'image') {
    return (
      <figure className={s.frame} data-where={where} {...tag}>
        <Image className={`${s.img} ${m.phone ? s.desk : ''}`} src={m.img.src} width={m.img.w} height={m.img.h} alt={m.img.alt} sizes={sizes} />
        {m.phone && where === 'row' && (
          <Image className={`${s.img} ${s.phone}`} src={m.phone.src} width={m.phone.w} height={m.phone.h} alt={m.phone.alt} sizes="100vw" />
        )}
      </figure>
    )
  }

  if (m.kind === 'emails') {
    return (
      <figure className={`${s.frame} ${s.emails}`} data-where={where} {...tag}>
        {m.items.map((e) => (
          <Image key={e.src} className={s.email} src={e.src} width={e.w} height={e.h} alt={e.alt} sizes={where === 'stage' ? '18vw' : '40vw'} />
        ))}
      </figure>
    )
  }

  // The incidents, by their own headlines, on the ink ground
  return (
    <figure className={`${s.frame} ${s.cases}`} data-where={where} data-tone="ink" {...tag}>
      <ol className={s.caseList}>
        {CASES.map((c, i) => (
          <li key={c.title[1]}>
            <span className={s.caseNum}>Case {String(i + 1).padStart(2, '0')}</span>
            <span className={s.caseTitle}>{c.title[0]}{c.title[1]}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
