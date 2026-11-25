import SiteNav from '../components/directions/home/SiteNav'
import SignatureScene from '../components/directions/home/SignatureScene'
import Skills from '../components/directions/home/Skills'
import Featured from '../components/directions/home/Featured'
import Journey from '../components/directions/home/Journey'
import Cases from '../components/directions/home/Cases'
import Behind from '../components/directions/home/Behind'
import SiteFooter from '../components/directions/home/SiteFooter'
import Ask from '../components/directions/home/Ask'
import HomeMotion from '../components/directions/home/HomeMotion'
import { sans, mono } from '../components/directions/home/fonts'
import theme from '../components/directions/home/theme.module.css'
import s from './home.module.css'

// The homepage. Its title, description, canonical and structured data come from the root layout.
export default function Home() {

  return (
    <div data-direction="home" className={`${sans.variable} ${mono.variable} ${s.root}`}>
      <a href="#main" className={theme.skip}>Skip to content</a>
      <SiteNav />

      <main id="main">
        {/* ---------- The signature: her portrait drawn by the emails, which burst as you scroll ---------- */}
        <section className={s.scene} data-scene="" aria-labelledby="hero-title">
          {/* data-entrance holds the hero text back until the portrait arrives with it.
              Reduced motion and no-JS see it at once (CSS below and the noscript rule). */}
          <div className={s.stage} data-stage="" data-entrance="pending">
            <div className={s.ink} data-ink="" aria-hidden="true" />
            <div className={s.slot} data-face-slot="" aria-hidden="true" />
            <canvas className={s.canvas} data-scene-canvas="" aria-hidden="true" />
            <div className={s.heroText} data-hero-text="">
              <h1 id="hero-title" className={s.h1}>
                <span className={s.line}><span data-rise="">Jacqueline</span></span>{' '}
                <span className={s.line}><span data-rise="">Amoako</span></span>
              </h1>
              <p className={s.role} data-fade="">Frontend developer, lifecycle marketer and technical support, in Accra.</p>
              <p className={s.caption} data-fade=""><span data-count="">1,695</span> squares, one for every email my system sent for one client. None by hand.</p>
            </div>
          </div>
        </section>

        {/* ---------- What she does: the sentence, which is also the way in ---------- */}
        <Skills />

        {/* ---------- The sentence, played out: build, run, fix ---------- */}
        <Featured />
        <Journey />
        <Cases />

        {/* ---------- Who is behind it: where she came from, and what she gives back ---------- */}
        <Behind />

        {/* ---------- What do you need? The closing chapter, on ink like the page's opening ---------- */}
        <section id="ask" data-tone="ink" className={s.askSection} aria-labelledby="ask-title">
          <p className={s.kicker}>Ask</p>
          <Ask />
        </section>
      </main>

      <SiteFooter />
      <noscript>
        <style>{`[data-entrance] [data-rise], [data-entrance] [data-fade] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <SignatureScene intro="fly" />
      <HomeMotion />
    </div>
  )
}
