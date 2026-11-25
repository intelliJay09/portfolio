'use client'

// The contact form. It posts to /api/contact exactly as the old page did: the six fields the API
// requires plus a reCAPTCHA v3 token, then goes to /contact/success or /contact/error.
// What changed for the visitor:
// - The homepage's words and topic arrive filled in (read on the server by the page).
// - If sending fails, the message is kept (sessionStorage), so "Try again" brings it back.
// - If the spam check has not loaded yet, the form says so instead of silently doing nothing.

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useRecaptcha } from '../../../hooks/useRecaptcha'
import { trackFormSubmit } from '../../../lib/analytics'
import { CONTACT } from '../../../lib/directions/work'
import { DRAFT_KEY, TOPICS } from '../../../lib/directions/contact'
import s from './contact.module.css'

type Fields = { service: string; message: string; name: string; email: string; organization: string; subject: string }

const saveDraft = (f: Fields) => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(f)) } catch {} }
const clearDraft = () => { try { sessionStorage.removeItem(DRAFT_KEY) } catch {} }
const readDraft = (): Partial<Fields> | null => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Partial<Fields>) : null
  } catch {
    return null
  }
}

export default function ContactForm({ initialMessage, initialAbout }: { initialMessage: string; initialAbout: string }) {
  const router = useRouter()
  const { executeRecaptcha, isReady } = useRecaptcha(true)
  const carried = Boolean(initialMessage)
  const [f, setF] = useState<Fields>({
    service: initialAbout, message: initialMessage, name: '', email: '', organization: '', subject: '',
  })
  const [sending, setSending] = useState(false)
  const [note, setNote] = useState('')

  // A message that failed to send comes back, unless the visitor arrived with new words from the homepage
  useEffect(() => {
    if (carried) return
    const draft = readDraft()
    if (!draft) return
    setF((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(prev) as (keyof Fields)[]) {
        if (typeof draft[k] === 'string') next[k] = draft[k] as string
      }
      return next
    })
  }, [carried])

  const set = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setF((prev) => ({ ...prev, [name]: value }))
  }

  const notReady = `The spam check hasn’t loaded yet. Give it a few seconds and send again, or email me at ${CONTACT.email}.`

  const submit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    if (!isReady) { setNote(notReady); return }
    setNote('')
    setSending(true)
    try {
      const recaptchaToken = await executeRecaptcha('contact_form')
      if (!recaptchaToken) { setNote(notReady); setSending(false); return }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, recaptchaToken }),
      })
      if (res.ok) {
        trackFormSubmit('Contact Form', { service: f.service, has_organization: !!f.organization })
        clearDraft()
        router.push('/contact/success')
      } else {
        saveDraft(f)
        router.push('/contact/error')
      }
    } catch {
      saveDraft(f)
      router.push('/contact/error')
    }
  }, [sending, isReady, notReady, executeRecaptcha, f, router])

  return (
    <form className={s.form} onSubmit={submit} aria-busy={sending}>
      <fieldset className={s.topics}>
        <legend className={s.legend}>What’s it about?</legend>
        <div className={s.topicList}>
          {TOPICS.map((t) => (
            <label key={t.value} className={s.topic}>
              <input type="radio" name="service" value={t.value} checked={f.service === t.value} onChange={set} required />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={s.field}>
        <label htmlFor="c-message" className={s.legend}>Your message</label>
        {carried && <p className={s.carried}>Filled in for you. Change anything you like.</p>}
        <textarea id="c-message" name="message" value={f.message} onChange={set} required maxLength={5000} rows={4} className={`${s.input} ${s.message}`} />
      </div>

      <div className={s.pair}>
        <div className={s.field}>
          <label htmlFor="c-name" className={s.legend}>Name</label>
          <input id="c-name" name="name" value={f.name} onChange={set} required maxLength={100} autoComplete="name" className={s.input} />
        </div>
        <div className={s.field}>
          <label htmlFor="c-email" className={s.legend}>Email</label>
          <input id="c-email" name="email" type="email" value={f.email} onChange={set} required maxLength={100} autoComplete="email" className={s.input} />
        </div>
      </div>

      <div className={s.pair}>
        <div className={s.field}>
          <label htmlFor="c-org" className={s.legend}>Company or organisation</label>
          <input id="c-org" name="organization" value={f.organization} onChange={set} required maxLength={150} autoComplete="organization" className={s.input} />
        </div>
        <div className={s.field}>
          <label htmlFor="c-subject" className={s.legend}>Subject</label>
          <input id="c-subject" name="subject" value={f.subject} onChange={set} required maxLength={200} className={s.input} />
        </div>
      </div>

      <div className={s.sendRow}>
        <button type="submit" className={s.send} disabled={sending}>
          {sending ? 'Sending' : 'Send message'}<span aria-hidden="true">→</span>
        </button>
        <p className={s.note} role="status">{note}</p>
      </div>

      <p className={s.legal}>
        Every field is needed. This form is protected by reCAPTCHA, and Google’s{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
      </p>
    </form>
  )
}
