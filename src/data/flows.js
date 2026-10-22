import { DEFAULT_APPLICATION, DEMO_ADDRESS } from '../context/programDefaults.js'

/*
 * The three prototype flows. Each one starts from the /flows entry page and has an ordered
 * list of steps shown in the prototype map (yellow dot, top-left).
 *
 * step: { label, to | to(ctx), match?(pathname, ctx), prepare?(ctx) }
 *   - `prepare` puts the shared state into the shape the step expects, so any step can be
 *     jumped to directly (e.g. "Request received" needs a submitted application).
 */

const DEMO_ORDER = { delivery: DEMO_ADDRESS, billingSame: true, billing: DEMO_ADDRESS }
const RANK = { none: 0, submitted: 1, loggedIn: 2, ordered: 3 }

const applicationData = () => {
  const { submittedAt, ...data } = DEFAULT_APPLICATION
  return data
}

/* Application sent (landing form or checkout request). */
function ensureSubmitted(c) {
  if (RANK[c.status] < 1) c.submitApplication(applicationData())
}
/* Signed in after the acceptance email. */
function ensureLoggedIn(c) {
  ensureSubmitted(c)
  if (RANK[c.status] < 2) c.setStatus('loggedIn')
}
/* Enrolled: card on file and the program activated. */
function ensureOrdered(c) {
  ensureSubmitted(c)
  if (RANK[c.status] < 3) c.placeOrder(DEMO_ORDER)
}

const loginTo = (c) => `/signup/login?email=${encodeURIComponent(c.profile.email)}`
const PROGRAM_TAB = '/studio/organisation/photographer-program'

export const FLOWS = {
  landing: {
    id: 'landing',
    name: 'New user, through Landing page',
    short: 'Landing page',
    account: 'new',
    start: '/photographer-program',
    startsAt: 'Photographer program landing page, as a visitor without an account',
    steps: [
      { label: 'Photographer program landing · apply', to: '/photographer-program', match: (p, c) => p === '/photographer-program' && c.status === 'none' },
      { label: 'Request received', to: '/photographer-program', match: (p, c) => p === '/photographer-program' && c.status !== 'none', prepare: ensureSubmitted },
      { label: 'Acceptance email', to: '/email/approved', prepare: ensureSubmitted },
      { label: 'Sign in', to: loginTo, match: (p) => p === '/signup/login', prepare: ensureSubmitted },
      { label: 'Email code', to: '/signup/code', prepare: ensureSubmitted },
      { label: 'Onboarding 1 of 2 · Name your workspace', to: '/signup/workspace', prepare: ensureLoggedIn },
      { label: 'Onboarding 2 of 2 · Delivery address & card', to: '/signup/checkout', prepare: ensureLoggedIn },
      { label: 'Dashboard · Photographer program', to: PROGRAM_TAB, prepare: ensureOrdered },
    ],
  },
  checkout: {
    id: 'checkout',
    name: 'New user, through Checkout page',
    short: 'Checkout page',
    account: 'new',
    start: '/',
    startsAt: 'Website home page, as a visitor without an account',
    steps: [
      { label: 'Home', to: '/' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Checkout · Photographer request (no address, no card)', to: '/checkout?plan=camera', match: (p, c) => p === '/checkout' && c.status === 'none' },
      { label: 'Request received', to: '/checkout?plan=camera', match: (p, c) => p === '/checkout' && c.status !== 'none', prepare: ensureSubmitted },
      { label: 'Acceptance email', to: '/email/approved', prepare: ensureSubmitted },
      { label: 'Sign in', to: loginTo, match: (p) => p === '/signup/login', prepare: ensureSubmitted },
      { label: 'Email code', to: '/signup/code', prepare: ensureSubmitted },
      { label: 'Onboarding 1 of 2 · Name your workspace', to: '/signup/workspace', prepare: ensureLoggedIn },
      { label: 'Onboarding 2 of 2 · Delivery address & card', to: '/signup/checkout', prepare: ensureLoggedIn },
      { label: 'Dashboard · Photographer program', to: PROGRAM_TAB, prepare: ensureOrdered },
    ],
  },
  demo: {
    id: 'demo',
    name: 'Demo account, through Dashboard',
    short: 'Demo account',
    account: 'demo',
    start: '/studio/projects',
    startsAt: 'Content Studio dashboard, signed in to a demo account on the Free plan',
    steps: [
      { label: 'Dashboard · Projects (demo account)', to: '/studio/projects' },
      { label: 'Manage your plan', to: '/studio/plan' },
      { label: 'In-app checkout · Photographer request (no address, no card)', to: '/studio/checkout?plan=camera', match: (p, c) => p === '/studio/checkout' && c.status === 'none' },
      { label: 'Request received', to: '/studio/checkout?plan=camera', match: (p, c) => p === '/studio/checkout' && c.status !== 'none', prepare: ensureSubmitted },
      { label: 'Acceptance email', to: '/email/approved', prepare: ensureSubmitted },
      { label: 'Sign in', to: loginTo, match: (p) => p === '/signup/login', prepare: ensureSubmitted },
      { label: 'Email code', to: '/signup/code', prepare: ensureSubmitted },
      { label: 'Onboarding · Delivery address & card', to: '/signup/checkout', prepare: ensureLoggedIn },
      { label: 'Dashboard · Photographer program', to: PROGRAM_TAB, prepare: ensureOrdered },
    ],
  },
}

export const FLOW_LIST = Object.values(FLOWS)

/* Resolve a step's target path (some depend on state, e.g. the prefilled sign-in email). */
export const stepPath = (step, ctx) => (typeof step.to === 'function' ? step.to(ctx) : step.to)

/* Is this step the active one for the current location? */
export function stepActive(step, pathname, ctx) {
  if (step.match) return step.match(pathname, ctx)
  return pathname === stepPath(step, ctx).split('?')[0]
}
