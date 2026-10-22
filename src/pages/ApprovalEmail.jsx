import { Link } from 'react-router-dom'
import { useFlow, useProgram } from '../context/ProgramContext.jsx'
import { fmtDate } from '../context/programDefaults.js'
import { ArrowBack } from '../components/icons/index.jsx'
import './ApprovalEmail.css'

const NEXT = {
  landing: {
    intro: 'Sign in with this email to finish setting up:',
    steps: ['Name your Content Studio workspace', 'Add your delivery address and a card. Nothing is charged.'],
    outro: 'When you submit, your camera ships and your partner link goes live. Your 6 months start that day.',
    cta: 'Complete sign-up',
  },
  checkout: {
    intro: 'Sign in with this email to finish setting up:',
    steps: ['Name your Content Studio workspace', 'Add your delivery address and a card. Nothing is charged.'],
    outro: 'When you submit, your camera ships and your partner link goes live. Your 6 months start that day.',
    cta: 'Complete sign-up',
  },
  demo: {
    intro: 'Sign in to your account and:',
    steps: ['Add your delivery address and a card. Nothing is charged.'],
    outro: 'When you submit, your camera ships and your partner link goes live. Your 6 months start that day.',
    cta: 'Sign in',
  },
}

/* Prototype-only: the acceptance email customer support sends after the call. */
export default function ApprovalEmail() {
  const { profile } = useProgram()
  const flow = useFlow()
  const next = NEXT[flow.id] ?? NEXT.landing
  const loginHref = `/signup/login?email=${encodeURIComponent(profile.email)}`

  return (
    <div className="email">
      <Link to={flow.start} className="email__back">
        <ArrowBack size={20} />
        Back to site
      </Link>

      <p className="email__proto">Prototype · This is the email the photographer receives after approval</p>

      <article className="email__frame">
        <header className="email__meta">
          <div className="email__metaRow">
            <span className="email__metaLabel">From</span>
            <span>Giraffe360 &lt;partners@giraffe360.com&gt;</span>
          </div>
          <div className="email__metaRow">
            <span className="email__metaLabel">To</span>
            <span>{profile.email}</span>
          </div>
          <div className="email__metaRow">
            <span className="email__metaLabel">Subject</span>
            <span className="email__subject">You're approved! Order your free Gen5 camera</span>
          </div>
        </header>

        <div className="email__body">
          <img className="email__logo" src="/assets/logo-giraffe360.svg" alt="Giraffe360" width={91} height={12} />
          <h1 className="email__title">Welcome to the program, {profile.firstName}!</h1>
          <p>{next.intro}</p>
          <ol className="email__list">
            {next.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>{next.outro}</p>
          <Link to={loginHref} className="btn btn--primary email__cta">{next.cta}</Link>
          <p className="email__fine">This link works once and is valid until {fmtDate(profile.linkExpiry)}.</p>
        </div>
      </article>
    </div>
  )
}
