import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import Navigation from '../Navigation'
import PortfolioFooter from '../PortfolioFooter'
import Journey from './Journey'
import CoverReveal from './CoverReveal'
import ProjectViewTracker from './ProjectViewTracker'
import content from '../../content.json'
import type { CaseStudy as CaseStudyData } from '../../lib/case-studies'

const label = 'font-display text-xs uppercase tracking-[0.16em] text-ink-3'
const sectionHeading =
  'font-display font-medium text-ink text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.03em]'
const body = 'font-body text-[1.0625rem] leading-[1.7] text-ink-2'
const gutter = 'px-4 sm:px-8 lg:px-[6.5vw]'

// Table columns: a label, plain counts, then the rate the row exists to show
const cellClass = (i: number, count: number) =>
  i === 0
    ? 'pl-4 font-body text-ink'
    : i === count - 1
      ? 'pl-6 pr-4 text-right font-display text-xl font-medium text-ink'
      : 'pl-6 text-right font-body text-ink-2'

export default function CaseStudy({ study }: { study: CaseStudyData }) {
  const listing = content.portfolio.projects.find((p) => p.slug === study.slug)

  return (
    <>
      <Navigation preloaderComplete />
      {listing && <ProjectViewTracker slug={study.slug} title={listing.title} category={listing.category} />}

      <main className="bg-paper text-ink">
        {/* Hero: the client's name and one line, nothing else competing */}
        <header className={`${gutter} flex min-h-[100svh] flex-col justify-center pt-28 pb-16`}>
          <p className={`${label} cs-rise`} style={{ animationDelay: '0.1s' }}>
            Case study
          </p>
          <h1 className="mt-6 overflow-hidden font-display font-medium leading-[0.92] tracking-[-0.045em] text-[clamp(4rem,13vw,12.5rem)]">
            <span className="cs-rise block pb-[0.06em]">{study.title}</span>
          </h1>
          <p
            className="cs-fade mt-8 max-w-[34rem] font-body text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.5] text-ink-2"
            style={{ animationDelay: '0.45s' }}
          >
            {study.line}
          </p>

          <dl
            className="cs-fade mt-16 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4"
            style={{ animationDelay: '0.6s' }}
          >
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt className={label}>{fact.label}</dt>
                <dd className="mt-2 font-body text-base text-ink">{fact.value}</dd>
              </div>
            ))}
            {study.liveUrl && (
              <div>
                <dt className={label}>Live site</dt>
                <dd className="mt-2">
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cs-link inline-flex items-center gap-1 font-body text-base text-ink"
                  >
                    {study.liveUrl.replace(/^https?:\/\/(www\.)?/, '')}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>

        <CoverReveal image={study.cover} />

        {/* The situation before */}
        <section aria-labelledby="cs-situation" className={`${gutter} py-[clamp(6rem,14vw,12rem)]`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-[2em]">
            <h2 id="cs-situation" className={`${sectionHeading} lg:col-span-6`}>
              {study.situation.heading}
            </h2>
            <div className="space-y-6 lg:col-span-5 lg:col-start-8">
              {study.situation.body.map((p) => (
                <p key={p} className={body}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Journey heading={study.journey.heading} intro={study.journey.intro} stages={study.journey.stages} />

        <section className={`${gutter} pt-10 pb-[clamp(6rem,12vw,10rem)]`}>
          <p className="max-w-[34rem] pl-7 font-body text-[1.0625rem] leading-[1.7] text-ink-2 sm:pl-12">
            {study.journey.beyond}
          </p>
        </section>

        {/* What the data said */}
        <section
          aria-labelledby="cs-finding"
          className={`${gutter} bg-paper-2 py-[clamp(6rem,14vw,12rem)]`}
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-[2em]">
            <div className="lg:col-span-5">
              <h2 id="cs-finding" className={sectionHeading}>
                {study.finding.heading}
              </h2>
              <div className="mt-10 space-y-6">
                {study.finding.body.map((p) => (
                  <p key={p} className={body}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <table className="w-full border-collapse text-left">
                <caption className="mb-6 text-left font-body text-sm text-ink-3">
                  {study.finding.table.caption}
                </caption>
                <thead>
                  <tr>
                    {study.finding.table.headers.map((h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={`${label} pb-4 font-normal ${
                          i === 0 ? 'pl-4' : i === study.finding.table.headers.length - 1 ? 'pl-6 pr-4 text-right' : 'pl-6 text-right'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {study.finding.table.rows.map((row) => (
                    <tr key={row[0]} className="odd:bg-paper/40">
                      {row.map((cell, i) => (
                        <td key={i} className={`py-4 tabular-nums ${cellClass(i, row.length)}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-14 space-y-6">
                {study.finding.response.map((p) => (
                  <p key={p} className={body}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results, each traceable */}
        <section aria-labelledby="cs-results" className={`${gutter} py-[clamp(6rem,14vw,12rem)]`}>
          <h2 id="cs-results" className={sectionHeading}>
            {study.results.heading}
          </h2>
          <dl className="mt-16 grid gap-x-[2em] gap-y-14 sm:grid-cols-2">
            {study.results.items.map((item) => (
              <div key={item.value}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="block font-display font-medium leading-none tracking-[-0.04em] text-[clamp(3.25rem,7.5vw,7rem)] text-ink">
                    {item.value}
                  </span>
                  <span className="mt-4 block max-w-[22rem] font-body text-[1.0625rem] leading-[1.5] text-ink-2">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-16 font-body text-sm text-ink-3">{study.results.source}</p>
        </section>

        {/* What's still open */}
        <section aria-labelledby="cs-open" className={`${gutter} pb-[clamp(6rem,14vw,12rem)]`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-[2em]">
            <h2 id="cs-open" className={`${sectionHeading} lg:col-span-5`}>
              {study.open.heading}
            </h2>
            <div className="space-y-12 lg:col-span-6 lg:col-start-7">
              {study.open.items.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
                  <p className={`${body} mt-3`}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The website */}
        <section
          aria-labelledby="cs-site"
          className={`${gutter} bg-paper-2 py-[clamp(6rem,14vw,12rem)]`}
        >
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-[2em]">
            <div className="lg:col-span-5">
              <h2 id="cs-site" className={sectionHeading}>
                {study.site.heading}
              </h2>
              <p className={`${body} mt-8 max-w-[28rem]`}>{study.site.body}</p>
              {study.liveUrl && (
                <a
                  href={study.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-link mt-10 inline-flex w-fit items-center gap-1 font-display text-base font-medium text-ink"
                >
                  Visit the live site
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="flex justify-center gap-[2em] lg:col-span-6 lg:col-start-7">
              {study.site.images.map((img) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 22vw, 70vw"
                  className="h-auto w-[min(70vw,22rem)] rounded-[1.75rem]"
                />
              ))}
            </div>
          </div>
        </section>

        {/* In the client's words */}
        <section aria-labelledby="cs-testimonial" className={`${gutter} py-[clamp(6rem,14vw,12rem)]`}>
          <h2 id="cs-testimonial" className={label}>
            In her words
          </h2>
          <figure className="mt-10 max-w-[60rem]">
            <blockquote className="font-display font-medium leading-[1.25] tracking-[-0.02em] text-[clamp(1.5rem,2.8vw,2.5rem)] text-ink">
              <p>&ldquo;{study.testimonial.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-10 font-body text-base">
              <span className="text-ink">{study.testimonial.name}</span>
              <span className="text-ink-3">, {study.testimonial.role}</span>
            </figcaption>
          </figure>
        </section>
      </main>

      <PortfolioFooter currentSlug={study.slug} />
    </>
  )
}
