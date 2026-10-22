/* Shared lists, demo defaults and date helpers for the Photographer program flow. */

export const INDUSTRIES = [
  'Estate agency or brokerage firm/team',
  'Independent real estate agent',
  'Photographer (Real Estate / Estate Agent)',
  'Real estate developer',
  'Construction',
  'Architecture',
  'Asset/property management',
  'Appraiser',
  'Short-term rentals',
  'Prop-tech platform',
  'Insurance',
  'Other',
]

export const HEARD_ABOUT = [
  'Youtube',
  'Socials (Facebook, Instagram)',
  'Search engine',
  'Referrals',
  'Live event',
  'Other',
]

export const COUNTRIES = ['United States', 'Canada']

export const PHOTOGRAPHER_INDUSTRY = 'Photographer (Real Estate / Estate Agent)'

export const PARTNER_LINK_BASE = 'https://giraffe360.com/partner/'

/* Used when a route is opened without an application having been submitted. */
export const DEFAULT_APPLICATION = {
  firstName: 'Jamie',
  lastName: 'Rivera',
  email: 'jamie.rivera@example.com',
  phone: '(415) 555-0132',
  industry: PHOTOGRAPHER_INDUSTRY,
  license: 'CA-DRE-02114578',
  country: 'United States',
  submittedAt: null,
}

/* ---- dates ---- */
export function startOfDay(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
export function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
export function addMonths(d, n) {
  const x = new Date(d)
  x.setMonth(x.getMonth() + n)
  return x
}
export function diffDays(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / 86400000)
}
export function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* Demo values for the prototype autofill on checkout screens (published test card, sample address). */
export const DEMO_CARD = { number: '4242 4242 4242 4242', expiry: '12/29', cvc: '123' }
export const DEMO_ADDRESS = { street: '128 Market Street', apt: '', city: 'San Francisco', state: 'CA', zip: '94105', country: 'United States' }
