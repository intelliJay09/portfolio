// What a message can be about, for the contact form and its emails. The values are the ones the homepage's "What do you need?"
// sends (lib/directions/triage.ts) and the ones the contact API and GA4 already receive.

export const TOPICS = [
  { value: 'role-or-opportunity', label: 'A role or opportunity' },
  { value: 'lifecycle-automation', label: 'Lifecycle and automation' },
  { value: 'crm-setup', label: 'CRM setup' },
  { value: 'website', label: 'A website' },
  { value: 'teaching-mentorship', label: 'Teaching or mentorship' },
  { value: 'other', label: 'Something else' },
] as const

// Where an unsent message waits if sending fails, so "Try again" brings it back
export const DRAFT_KEY = 'contact-draft'
