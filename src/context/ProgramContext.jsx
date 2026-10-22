import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_APPLICATION,
  PARTNER_LINK_BASE,
  addDays,
  addMonths,
  slugify,
  startOfDay,
} from './programDefaults.js'
import { FLOWS } from '../data/flows.js'

/*
 * Prototype state for the Photographer program flows. Persisted to sessionStorage so a
 * refresh or a deep link keeps the submitted application; falls back to demo defaults
 * so every route renders cold.
 */
const KEY = 'g360.program.v2'

const EMPTY_ADDRESS = { street: '', apt: '', city: '', state: '', zip: '', country: 'United States' }

const INITIAL = {
  flow: null, // 'landing' | 'checkout' | 'demo' — chosen on the /flows entry page
  account: 'new', // 'new' (website visitor, no account) | 'demo' (Free plan, no billing)
  application: null,
  status: 'none', // 'none' | 'submitted' | 'loggedIn' | 'ordered'
  signup: { orgName: '', country: '', phone: '' },
  order: {
    delivery: EMPTY_ADDRESS,
    billingSame: true,
    billing: EMPTY_ADDRESS,
    cardCaptured: false, // card and address taken in onboarding (after approval)
    orderedAt: null, // program activated: camera ships, 6 months start
  },
}

function load() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return INITIAL
    const parsed = JSON.parse(raw)
    return { ...INITIAL, ...parsed, signup: { ...INITIAL.signup, ...parsed.signup }, order: { ...INITIAL.order, ...parsed.order } }
  } catch {
    return INITIAL
  }
}

const ProgramContext = createContext(null)

export function ProgramProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: keep in-memory state only */
    }
  }, [state])

  const submitApplication = useCallback((data) => {
    setState((s) => ({
      ...s,
      application: { ...data, submittedAt: new Date().toISOString() },
      status: 'submitted',
      signup: { ...s.signup, country: data.country, phone: data.phone },
    }))
  }, [])

  const setEmail = useCallback((email) => {
    setState((s) => ({
      ...s,
      application: { ...(s.application ?? DEFAULT_APPLICATION), email },
    }))
  }, [])

  const updateApplication = useCallback((patch) => {
    setState((s) => ({
      ...s,
      application: { ...(s.application ?? DEFAULT_APPLICATION), ...patch },
    }))
  }, [])

  const setStatus = useCallback((status) => setState((s) => ({ ...s, status })), [])

  const updateSignup = useCallback((patch) => {
    setState((s) => ({ ...s, signup: { ...s.signup, ...patch } }))
  }, [])

  /* The program starts: camera ships, partner link goes live, 6 months begin. */
  const activate = useCallback(() => {
    setState((s) => ({
      ...s,
      status: 'ordered',
      order: { ...s.order, orderedAt: s.order.orderedAt ?? new Date().toISOString() },
    }))
  }, [])

  /* Card captured and program activated in one go (onboarding step 2 in the landing flow). */
  const placeOrder = useCallback((order) => {
    setState((s) => ({
      ...s,
      status: 'ordered',
      order: { ...s.order, ...order, cardCaptured: true, orderedAt: new Date().toISOString() },
    }))
  }, [])

  /* Prototype: start one of the three flows from scratch. */
  const startFlow = useCallback((flow) => setState({ ...INITIAL, flow, account: FLOWS[flow]?.account ?? 'new' }), [])

  /* Restart the current flow (keeps the flow and its account type). */
  const reset = useCallback(() => setState((s) => ({ ...INITIAL, flow: s.flow, account: s.account })), [])

  const profile = useMemo(() => {
    const app = state.application ?? DEFAULT_APPLICATION
    const fullName = `${app.firstName} ${app.lastName}`.trim()
    const startDate = startOfDay(state.order.orderedAt ? new Date(state.order.orderedAt) : new Date())
    const endDate = addMonths(startDate, 6)
    const submitted = app.submittedAt ? new Date(app.submittedAt) : new Date()
    return {
      ...app,
      fullName,
      slug: slugify(fullName) || 'your-name',
      partnerLink: PARTNER_LINK_BASE + (slugify(fullName) || 'your-name'),
      startDate,
      endDate,
      linkExpiry: addDays(submitted, 14),
      signup: state.signup,
    }
  }, [state.application, state.order.orderedAt, state.signup])

  const value = useMemo(
    () => ({
      ...state,
      profile,
      submitApplication,
      setEmail,
      updateApplication,
      setStatus,
      updateSignup,
      activate,
      placeOrder,
      startFlow,
      reset,
    }),
    [state, profile, submitApplication, setEmail, updateApplication, setStatus, updateSignup, activate, placeOrder, startFlow, reset],
  )

  return <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
}

export function useProgram() {
  const ctx = useContext(ProgramContext)
  if (!ctx) throw new Error('useProgram must be used inside <ProgramProvider>')
  return ctx
}

/* The active flow definition (falls back to the landing flow for deep links without one). */
export function useFlow() {
  const { flow } = useProgram()
  return FLOWS[flow] ?? FLOWS.landing
}
