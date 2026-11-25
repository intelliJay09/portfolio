'use client'

// The redesign's header, on every page built in it.
// Desktop: her name on the left, the three links on the right. Phone: her name on one line and a
// Menu button in the corner, which opens a full-screen menu.
// Over the opening scene the header is transparent and blends with whatever is behind it. Past it,
// the header hides while you scroll down and returns on a paper backdrop when you scroll up, so it
// never sits on top of the page's text.
// The menu locks the page scroll (Lenis and the document), makes the page behind it inert, closes
// on Escape, on a link and when the window grows past the phone layout, and hands focus back to
// the button. The links are plain anchors, so everything works without the menu script on desktop.

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '../../LenisProvider'
import { CONTACT, HOME } from '../../../lib/directions/work'
import s from './nav.module.css'

const LINKS = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

const SOCIAL = [
  { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
  { href: CONTACT.linkedin, label: 'LinkedIn' },
  { href: CONTACT.github, label: 'GitHub' },
  { href: CONTACT.instagram, label: 'Instagram' },
] as const

// The header stays transparent over a page's opening (the homepage's scene is one viewport of
// scroll; a page without a scene passes `zone` so content never runs under bare type), then hides
// on the way down and returns on a backdrop on the way up
// Scroll distance that counts as a deliberate direction, so a small wobble never flickers it
const STEP = 6
const PHONE = '(max-width: 760px)'

function A({ href, className, children, onClick, current }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void; current?: 'page' }) {
  if (href.startsWith('/')) return <Link href={href} className={className} onClick={onClick} aria-current={current}>{children}</Link>
  const external = href.startsWith('http')
  return (
    <a href={href} className={className} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

// `ground` is what the header sits on at the top of the page: the homepage's scene (photo and ink,
// so the type blends with whatever is behind it) or plain paper (inner pages: plain ink type, which
// looks the same as the blend there and is a colour a contrast checker can read)
export default function SiteNav({ zone = 1, ground = 'scene' }: { zone?: number; ground?: 'scene' | 'paper' }) {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  const desktop = useRef<HTMLElement>(null)
  const ink = useRef<HTMLSpanElement>(null)
  const { stop, start } = useLenis()
  const path = usePathname()
  const current = (href: string) => (href === path ? ('page' as const) : undefined)

  // Hide on the way down, return on the way up. Written straight to the DOM so scrolling never re-renders.
  useEffect(() => {
    const el = header.current
    if (!el) return
    let last = window.scrollY
    let raf = 0
    const set = (state: string) => { if (el.dataset.state !== state) el.dataset.state = state }
    // The ground under the header (a section with data-tone="ink" is dark), so the backdrop matches it
    const tone = () => {
      const under = document.elementsFromPoint(window.innerWidth / 2, 2).find((n) => !el.contains(n))
      const next = under?.closest<HTMLElement>('[data-tone]')?.dataset.tone ?? 'paper'
      if (el.dataset.tone !== next) el.dataset.tone = next
    }
    const update = () => {
      raf = 0
      tone()
      const y = window.scrollY
      const dy = y - last
      if (y < window.innerHeight * zone) { set('top'); last = y }
      else if (dy > STEP) { set('hidden'); last = y }
      else if (dy < -STEP) { set('solid'); last = y }
      else if (el.dataset.state === 'top') set('solid') // landed past the scene (a link, a reload)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [zone])

  // Open menu: lock the scroll, make the page inert, move focus in, close on Escape
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const page = [...document.querySelectorAll('main, footer')]
    const overflow = html.style.overflow
    html.style.overflow = 'hidden'
    stop()
    page.forEach((el) => el.setAttribute('inert', ''))
    // The first link is not focusable on the opening frames (measured: it takes from the second
    // or third frame of the transition), so retry each frame until focus lands
    let focus = 0
    let tries = 0
    const focusFirst = () => {
      const first = menu.current?.querySelector<HTMLElement>('a')
      first?.focus()
      if (first && document.activeElement !== first && tries++ < 20) focus = requestAnimationFrame(focusFirst)
    }
    focus = requestAnimationFrame(focusFirst)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(focus)
      window.removeEventListener('keydown', onKey)
      page.forEach((el) => el.removeAttribute('inert'))
      html.style.overflow = overflow
      start()
    }
  }, [open, stop, start])

  // One underline for the desktop links: it rests under the current page and glides to the link
  // pointed at or focused, then back. Without this script each link keeps its own underline.
  useEffect(() => {
    const nav = desktop.current
    const line = ink.current
    if (!nav || !line) return
    const place = (a: Element | null, glide = true) => {
      line.style.transition = glide ? '' : 'none'
      if (!a) { line.style.opacity = '0'; return }
      const n = nav.getBoundingClientRect()
      const r = a.getBoundingClientRect()
      line.style.setProperty('--x', `${r.left - n.left}px`)
      line.style.setProperty('--w', `${r.width}px`)
      line.style.opacity = '1'
    }
    const rest = (glide = true) => place(nav.querySelector('a[aria-current="page"]'), glide)
    const over = (e: Event) => { const a = (e.target as Element).closest('a'); if (a) place(a) }
    const out = () => rest()
    const focusOut = (e: FocusEvent) => { if (!nav.contains(e.relatedTarget as Node)) rest() }
    nav.setAttribute('data-ink', '')
    rest(false)
    nav.addEventListener('pointerover', over)
    nav.addEventListener('pointerleave', out)
    nav.addEventListener('focusin', over)
    nav.addEventListener('focusout', focusOut)
    // The links move when the fonts load or the window changes size
    const sized = new ResizeObserver(() => rest(false))
    sized.observe(nav)
    return () => {
      sized.disconnect()
      nav.removeEventListener('pointerover', over)
      nav.removeEventListener('pointerleave', out)
      nav.removeEventListener('focusin', over)
      nav.removeEventListener('focusout', focusOut)
      nav.removeAttribute('data-ink')
    }
  }, [path])

  // Growing past the phone layout leaves the menu behind
  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const onChange = () => { if (!mq.matches) setOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header ref={header} className={s.nav} data-site-nav="" data-state="top" data-ground={ground} data-open={open ? '' : undefined}>
        <Link href={HOME} className={s.mark} onClick={close}>Jacqueline Amoako</Link>
        <nav ref={desktop} aria-label="Main" className={s.desktop} data-nav-desktop="">
          <ul>
            {LINKS.map((l) => <li key={l.label}><A href={l.href} current={current(l.href)}>{l.label}</A></li>)}
          </ul>
          <span ref={ink} className={s.ink} aria-hidden="true" />
        </nav>
        <button
          ref={toggle}
          type="button"
          className={s.toggle}
          data-nav-toggle=""
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <nav ref={menu} id="site-menu" aria-label="Menu" className={s.menu} data-open={open ? '' : undefined}>
        <ul className={s.menuList}>
          {LINKS.map((l, i) => (
            <li key={l.label} className={s.menuItem}>
              <A href={l.href} className={s.menuLink} onClick={close} current={current(l.href)}>
                <span style={{ '--i': i } as CSSProperties}>{l.label}</span>
              </A>
            </li>
          ))}
        </ul>
        <ul className={s.menuMeta}>
          {SOCIAL.map((l) => <li key={l.label}><A href={l.href} onClick={close}>{l.label}</A></li>)}
        </ul>
      </nav>
      <noscript>
        {/* Without the script the phone has no menu button, so the links show and wrap under the name */}
        <style>{`@media (max-width: 760px) { [data-site-nav] { flex-wrap: wrap; } [data-nav-desktop] { display: block !important; } [data-nav-toggle] { display: none !important; } }`}</style>
      </noscript>
    </>
  )
}
