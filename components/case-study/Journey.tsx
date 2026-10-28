'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { JourneyStage } from '../../lib/case-studies'

const label = 'font-display text-xs uppercase tracking-[0.16em] text-ink-3'
const pad = (n: number) => String(n).padStart(2, '0')

interface JourneyProps {
  heading: string
  intro: string
  stages: JourneyStage[]
}

// The case study's signature: the customer journey read the way it runs.
// Each stage scrolls past normally while, on desktop, a sticky inbox shows the
// real emails that stage sends, when they send and what stops them. Before
// hydration (and without JS) every stage carries its own emails inline, so
// nothing depends on the script; the inbox only takes over once it can work.
export default function Journey({ heading, intro, stages }: JourneyProps) {
  const [enhanced, setEnhanced] = useState(false)
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState(0)
  const stageRefs = useRef<(HTMLLIElement | null)[]>([])
  const listRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  // The inbox exists only on wide screens, so phones never download its images
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const sync = () => setEnhanced(wide.matches)
    sync()
    wide.addEventListener('change', sync)
    return () => wide.removeEventListener('change', sync)
  }, [])

  // The stage crossing the middle of the viewport is the active one
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    stageRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => setPicked(0), [active])

  const previewRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    previewRef.current?.scrollTo({ top: 0 })
  }, [active, picked])

  // The rail fills as the reader moves through the journey
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ctx: { revert: () => void } | undefined
    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: listRef.current, start: 'top center', end: 'bottom center', scrub: true },
          }
        )
      })
    })()
    return () => ctx?.revert()
  }, [])

  const stage = stages[active]
  const email = stage.emails[picked]
  const warm = stages.slice(Math.max(0, active - 1), active + 2).flatMap((s) => s.emails)

  return (
    <section aria-labelledby="cs-journey" className="pt-[clamp(2rem,6vw,5rem)]">
      <div className="px-4 sm:px-8 lg:px-[6.5vw]">
        <p className={label}>The journey</p>
        <h2
          id="cs-journey"
          className="mt-6 max-w-[56rem] font-display font-medium text-ink text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.03em]"
        >
          {heading}
        </h2>
        <p className="mt-8 max-w-[38rem] font-body text-[1.0625rem] leading-[1.7] text-ink-2">{intro}</p>
      </div>

      <div className="mt-[clamp(3rem,8vw,7rem)] grid grid-cols-[minmax(0,1fr)] px-4 sm:px-8 lg:grid-cols-12 lg:gap-[2em] lg:px-[6.5vw]">
        <ol ref={listRef} className="relative min-w-0 lg:col-span-5">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-ink/15">
            <div ref={fillRef} className="h-full w-full origin-top bg-ink" />
          </div>

          {stages.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                stageRefs.current[i] = el
              }}
              data-index={i}
              className="relative py-14 pl-7 sm:pl-12 lg:flex lg:min-h-[88vh] lg:flex-col lg:justify-center lg:py-20"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[4.35rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-colors duration-500 lg:top-1/2 ${
                  i <= active ? 'bg-ink' : 'bg-paper-3'
                }`}
              />
              <p className={label}>
                {pad(i + 1)} / {pad(stages.length)}
              </p>
              <h3 className="mt-4 font-display font-medium text-ink text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] tracking-[-0.025em]">
                {s.name}
              </h3>

              <dl className="mt-8 space-y-5">
                <StageRow term="When" desc={s.when} />
                <StageRow term="What it sends" desc={s.says} />
                {s.stops && <StageRow term="Stops" desc={s.stops} />}
              </dl>

              {s.result && (
                <p className="mt-8 max-w-[30rem] font-display text-[1.375rem] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
                  {s.result}
                </p>
              )}

              {/* On wide screens the inbox shows one stage at a time, so every stage keeps its emails for screen readers */}
              {s.emails.length > 0 && enhanced && (
                <ul className="sr-only">
                  {s.emails.map((e) => (
                    <li key={e.src}>
                      {e.sentAt}: {e.subject}
                    </li>
                  ))}
                </ul>
              )}

              {s.emails.length > 0 && !enhanced && (
                <div className="-mr-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-4 sm:-mr-8 sm:pr-8">
                  {s.emails.map((e) => (
                    <figure key={e.src} className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
                      <Image
                        src={e.src}
                        alt={e.alt}
                        width={e.width}
                        height={e.height}
                        sizes="(min-width: 640px) 22rem, 78vw"
                        className="h-auto w-full rounded-xl"
                      />
                      <figcaption className="mt-4">
                        <span className="block font-body text-sm text-ink">{e.subject}</span>
                        <span className={`${label} mt-1 block`}>{e.sentAt}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        {enhanced && (
          <div className="lg:col-span-7">
            <div className="sticky top-[10vh] h-[80vh] overflow-hidden rounded-2xl bg-paper-2">
              {email ? (
                <div className="flex h-full">
                  <div className="flex w-[40%] flex-col p-7">
                    <p className={label}>
                      Stage {pad(active + 1)}, {stage.name}
                    </p>
                    <ul key={stage.id} className="mt-8 space-y-2">
                      {stage.emails.map((e, j) => (
                        <li key={e.src} className="cs-row" style={{ animationDelay: `${j * 0.08}s` }}>
                          <button
                            type="button"
                            onClick={() => setPicked(j)}
                            aria-pressed={j === picked}
                            className={`w-full rounded-xl px-4 py-3.5 text-left transition-colors duration-300 ${
                              j === picked ? 'bg-paper' : 'hover:bg-paper/50'
                            }`}
                          >
                            <span className={`${label} block`}>{e.sentAt}</span>
                            <span className="mt-1.5 block font-body text-[0.9375rem] leading-[1.4] text-ink">
                              {e.subject}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div ref={previewRef} className="flex-1 overflow-y-auto overscroll-contain p-7 pl-0" data-lenis-prevent>
                    {/* Neighbouring stages load ahead of time so each email is ready when its stage arrives */}
                    {warm.map((e) => (
                      <Image
                        key={e.src}
                        src={e.src}
                        alt={e.alt}
                        width={e.width}
                        height={e.height}
                        sizes="28vw"
                        loading="eager"
                        className={e.src === email.src ? 'cs-wipe h-auto w-full rounded-xl' : 'hidden'}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div key={stage.id} className="cs-row flex h-full flex-col justify-center p-12">
                  <p className={label}>
                    Stage {pad(active + 1)}, {stage.name}
                  </p>
                  <p className="mt-8 max-w-[34rem] font-display font-medium leading-[1.05] tracking-[-0.035em] text-[clamp(2.5rem,4.2vw,4.25rem)] text-ink">
                    {stage.result ?? stage.name}
                  </p>
                  <p className="mt-8 max-w-[26rem] font-body text-[1.0625rem] leading-[1.7] text-ink-2">
                    No email goes out at this stage.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function StageRow({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <dt className={`${label} sm:pt-1`}>{term}</dt>
      <dd className="max-w-[32rem] font-body text-[1.0625rem] leading-[1.7] text-ink-2">{desc}</dd>
    </div>
  )
}
