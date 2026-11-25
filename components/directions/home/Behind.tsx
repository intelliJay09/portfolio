// "Behind the work": where she came from, and what she gives back. After three chapters of type
// and recordings, the one photograph on the page, full-bleed, as the breath before she asks what
// the visitor needs. It opens from an inset as it arrives (the shared [data-clip] reveal).

import Image from 'next/image'
import s from './behind.module.css'

export default function Behind() {
  return (
    <section className={s.root} aria-labelledby="behind-title">
      <figure className={s.photo} data-clip="">
        <Image
          src="/images/girlcode-teaching-1.jpg"
          alt="Jacqueline with students at a Girl Code Africa class"
          width={2560}
          height={1758}
          sizes="100vw"
        />
      </figure>
      <div className={s.copy}>
        <h2 id="behind-title" className={s.label}>Behind the work</h2>
        <p className={s.first}>Before I built systems I worked the support desk, and ran customer success at BLUETOWN, owning accounts from the first conversation with customer satisfaction at 90%.</p>
        <p className={s.second}>I mentor girls learning to code with Girl Code Africa, and I have trained more than 100 women entrepreneurs in digital skills.</p>
      </div>
    </section>
  )
}
