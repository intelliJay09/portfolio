// The two emails the contact form sends (lib/email-queue.ts sends them):
// - notification: to Jacqueline, the message first, a reply button, then the details
// - confirmation: to the sender, a short thank-you with what they sent
// Drawn in the site's look: paper ground, ink type, Plex Mono labels, no boxes or cards.
// Email clients ignore most CSS, so it is tables and inline styles; the web fonts load where
// a client allows (Apple Mail) and fall back to Helvetica/Arial and Menlo elsewhere.
// Dark mode flips to the site's ink ground. Every value from the form is escaped.

import { TOPICS } from './directions/contact'
import type { ContactFormData } from './email-queue'

const SITE = 'https://jacquelineamoako.com'
const SITE_NAME = 'jacquelineamoako.com'
const HER_EMAIL = 'hello@jacquelineamoako.com'

const C = {
  paper: '#ecebe6', ink: '#161614', ink2: '#55554f', ink3: '#676764', line: '#cfcdc6', signal: '#c23006',
}
const SANS = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'IBM Plex Mono', Menlo, Consolas, 'Courier New', monospace"

const esc = (t: string) => t
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

// Line breaks the sender typed become <br>; nothing else is added around the text
const paragraphs = (t: string) => esc(t.trim()).replace(/\r?\n/g, '<br>')

export const topicLabel = (value: string) => TOPICS.find((t) => t.value === value)?.label ?? value
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name

// "Tuesday 25 November 2026, 12:53 GMT": Accra time, whatever the server's clock zone
export function accraTime(d = new Date()) {
  const date = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  return `${date}, ${time} GMT`
}

const label = (text: string) =>
  `<p class="ink3" style="margin:0;font-family:${MONO};font-size:11px;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:${C.ink3};">${text}</p>`

const rule = `<tr><td class="rule" style="border-top:1px solid ${C.line};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>`

function page(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=IBM+Plex+Mono&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
  a { color:${C.ink}; }
  @media (prefers-color-scheme: dark) {
    .bg { background:#121210 !important; }
    .ink { color:#ece9e2 !important; }
    .ink2 { color:#bdbab2 !important; }
    .ink3 { color:#8f8c85 !important; }
    .rule { border-color:#3b3a36 !important; }
    .btn { background:#ece9e2 !important; }
    .btn a { color:#121210 !important; }
    .quote { border-color:#3b3a36 !important; }
  }
  @media only screen and (max-width: 600px) {
    .wrap { padding:36px 22px 44px !important; }
    .title { font-size:24px !important; }
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg" style="background:${C.paper};">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
<tr><td class="wrap" style="padding:56px 44px 60px;text-align:left;">
${body}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

// ---------- To Jacqueline ----------

export function notificationEmail(d: ContactFormData, at = new Date()) {
  const topic = topicLabel(d.service)
  const first = firstName(d.name)
  const reply = `mailto:${encodeURIComponent(d.email)}?subject=${encodeURIComponent(`Re: ${d.subject}`)}`
  const row = (k: string, v: string) => `
    <tr>
      <td valign="top" style="padding:12px 16px 12px 0;width:132px;">${label(k)}</td>
      <td valign="top" class="ink" style="padding:10px 0;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink};">${v}</td>
    </tr>`

  const html = page(`New message: ${d.subject}`, `${d.name}: ${d.message.slice(0, 120)}`, `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr><td style="padding-bottom:22px;">${label(`<span style="color:${C.signal};">&#9679;</span>&nbsp; New message from your site`)}</td></tr>
  <tr><td class="ink title" style="font-family:${SANS};font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-0.02em;color:${C.ink};padding-bottom:12px;">${esc(d.subject)}</td></tr>
  <tr><td class="ink2" style="font-family:${SANS};font-size:16px;line-height:1.5;color:${C.ink2};padding-bottom:32px;">${esc(d.name)}, ${esc(d.organization)} &middot; ${esc(topic)}</td></tr>
  ${rule}
  <tr><td class="ink" style="padding:32px 0 36px;font-family:${SANS};font-size:17px;line-height:1.65;color:${C.ink};">${paragraphs(d.message)}</td></tr>
  <tr><td style="padding-bottom:44px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
      <td class="btn" style="background:${C.ink};border-radius:2px;">
        <a href="${reply}" style="display:inline-block;padding:15px 26px;font-family:${MONO};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${C.paper};text-decoration:none;">Reply to ${esc(first)} &rarr;</a>
      </td>
    </tr></table>
  </td></tr>
  ${rule}
  <tr><td style="padding:14px 0 30px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      ${row('Name', esc(d.name))}
      ${row('Email', `<a href="mailto:${esc(d.email)}" class="ink" style="color:${C.ink};text-decoration:underline;">${esc(d.email)}</a>`)}
      ${row('Organisation', esc(d.organization))}
      ${row('About', esc(topic))}
      ${row('Received', esc(accraTime(at)))}
    </table>
  </td></tr>
  ${rule}
  <tr><td class="ink3" style="padding-top:20px;font-family:${SANS};font-size:12px;line-height:1.5;color:${C.ink3};">Sent from the contact form on ${SITE_NAME}. Replying to this email goes to ${esc(d.email)}.</td></tr>
</table>`)

  const text = [
    `New message from your site`,
    ``,
    d.subject,
    `${d.name}, ${d.organization} · ${topic}`,
    ``,
    d.message.trim(),
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Organisation: ${d.organization}`,
    `About: ${topic}`,
    `Received: ${accraTime(at)}`,
    ``,
    `Sent from the contact form on ${SITE_NAME}. Replying to this email goes to ${d.email}.`,
  ].join('\n')

  return { html, text }
}

// ---------- To the sender ----------

export const CONFIRMATION_SUBJECT = 'I got your message'

export function confirmationEmail(d: ContactFormData) {
  const first = firstName(d.name)

  const html = page(CONFIRMATION_SUBJECT, `Thanks, ${first}. Your message reached me.`, `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr><td style="padding-bottom:22px;">${label('Jacqueline Amoako')}</td></tr>
  <tr><td class="ink title" style="font-family:${SANS};font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-0.02em;color:${C.ink};padding-bottom:18px;">Thanks, ${esc(first)}. Your message reached me.</td></tr>
  <tr><td class="ink2" style="font-family:${SANS};font-size:17px;line-height:1.6;color:${C.ink2};padding-bottom:36px;">I&rsquo;ll read it properly and reply to this address. Here&rsquo;s what you sent, for your records.</td></tr>
  ${rule}
  <tr><td style="padding:28px 0 40px;">
    ${label('What you sent')}
    <p class="ink" style="margin:14px 0 0;font-family:${SANS};font-size:17px;line-height:1.4;font-weight:600;color:${C.ink};">${esc(d.subject)}</p>
    <p class="ink2 quote" style="margin:12px 0 0;padding-left:16px;border-left:2px solid ${C.line};font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink2};">${paragraphs(d.message)}</p>
  </td></tr>
  ${rule}
  <tr><td style="padding-top:28px;">
    <p class="ink" style="margin:0;font-family:${SANS};font-size:17px;line-height:1.5;color:${C.ink};">Jacqueline</p>
    <p style="margin:6px 0 0;font-family:${SANS};font-size:14px;line-height:1.5;">
      <a href="${SITE}" class="ink2" style="color:${C.ink2};text-decoration:none;">${SITE_NAME} &rarr;</a>
    </p>
  </td></tr>
</table>`)

  const text = [
    `Thanks, ${first}. Your message reached me.`,
    ``,
    `I'll read it properly and reply to this address. Here's what you sent, for your records.`,
    ``,
    d.subject,
    ``,
    d.message.trim(),
    ``,
    `Jacqueline`,
    `${SITE_NAME} · ${HER_EMAIL}`,
  ].join('\n')

  return { html, text }
}
