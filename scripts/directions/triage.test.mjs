// Run: node --test scripts/directions/triage.test.mjs   (Node 22.18+ strips the TS types)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { triage, contactHref } from '../../lib/directions/triage.ts'

const cases = [
  ['Our website is slow and we get no bookings', 'site', [1]],
  ['I need a new site for my clinic', 'site', [1]],
  ['People sign up and then never buy', 'activation', [2]],
  ['Leads go cold after the first call', 'activation', [2]],
  ['So many abandoned carts on our store', 'checkout', [2]],
  ['How do I get past customers to come back?', 'retention', [2]],
  ['We copy every order into a spreadsheet by hand', 'automation', [2]],
  ['Customers paid but never got their confirmation email', 'support', [3]],
  ['Something broke on the booking form and nobody noticed', 'support', [3]],
  ['People sign up on our site but the confirmation email never arrives', 'support', [3, 2]],
  ['Mobile money payments don’t match our records', 'payments', [3]],
  ['Can you mentor our students?', 'teaching', []],
  ['asdfgh', 'other', []],
  ['', 'other', []],
]

for (const [text, id, layers] of cases) {
  test(`"${text}" → ${id}`, () => {
    const r = triage(text)
    assert.equal(r.id, id)
    for (const l of layers) assert.ok(r.layers.includes(l), `layer ${l} lit for "${text}" (got ${r.layers})`)
  })
}

test('a recruiter naming one skill lights only that layer', () => {
  const r = triage('We’re hiring a frontend developer, full-time')
  assert.equal(r.id, 'role')
  assert.deepEqual(r.layers, [1])
})

test('a lifecycle role lights the journey only', () => {
  const r = triage('We are hiring for a lifecycle marketing role')
  assert.equal(r.id, 'role')
  assert.deepEqual(r.layers, [2])
})

test('a customer success role lights the safety net', () => {
  const r = triage('Hiring a customer success manager, remote')
  assert.equal(r.id, 'role')
  assert.deepEqual(r.layers, [3])
})

test('a recruiter naming no skill lights all three', () => {
  const r = triage('We are hiring for a new role')
  assert.equal(r.id, 'role')
  assert.deepEqual(r.layers, [1, 2, 3])
})

test('a problem across two layers mentions the second', () => {
  const r = triage('People sign up but the confirmation email never arrives, something is broken')
  assert.ok(r.layers.includes(2) && r.layers.includes(3), `got ${r.layers}`)
  assert.ok(r.also, 'expected a second-layer note')
})

test('every answer and proof is free of em dashes', () => {
  for (const t of ['website', 'sign up', 'abandoned cart', 'come back', 'by hand', 'broken', 'payments', 'hiring', 'mentor', 'zzz']) {
    const r = triage(t)
    for (const s of [r.heading, r.answer, r.proof?.text ?? '', r.also?.heading ?? '']) assert.ok(!s.includes('—'), s)
  }
})

test('the contact link carries the words and the topic', () => {
  const href = contactHref('  People sign up, then go quiet  ', 'lifecycle-automation')
  const u = new URL(href, 'https://example.com')
  assert.equal(u.pathname, '/contact')
  assert.equal(u.searchParams.get('about'), 'lifecycle-automation')
  assert.equal(u.searchParams.get('message'), 'People sign up, then go quiet')
})
