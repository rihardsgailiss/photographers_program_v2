import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFlow, useProgram } from '../../context/ProgramContext.jsx'
import { diffDays, fmtDate } from '../../context/programDefaults.js'
import { PROGRAM_STEPS } from '../../data/programSteps.js'
import { DAY_ONE, STATUS_LABEL, STATUS_TONE, summarise } from '../../data/dashboardDemo.js'
import { ContentCopy, InfoCircle, Lightbulb, QrCode } from '../../components/icons/index.jsx'
import './Dashboard.css'

const TARGET = 20
const TOTAL_DAYS = 182

/* ---------- small building blocks ---------- */

function ProgressBar({ value, max, tone = 'yellow' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="dashBar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={`dashBar__fill dashBar__fill--${tone}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatTile({ label, value, sub, tone = 'neutral' }) {
  return (
    <div className="dashTile">
      <span className="dashTile__label">{label}</span>
      <span className={`dashTile__value dashTile__value--${tone}`}>{value}</span>
      <span className="dashTile__sub">{sub}</span>
    </div>
  )
}

function PartnerLink({ url, live }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard may be unavailable in the preview; still show feedback */
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="dashLink" aria-labelledby="dash-link">
      <h2 id="dash-link" className="st-h3 dashLink__title">
        {live && <span className="dashLink__dot" aria-hidden="true" />}
        {live ? 'Your partner link is live' : 'Your partner link'}
      </h2>
      <p className="st-p dashLink__sub">
        {live
          ? 'Share it with agents now. They can sign up while your camera ships.'
          : 'Send this link to agents. They join Giraffe360 through it, and each subscription is added to your count.'}
      </p>
      <label className="dashLink__label" htmlFor="partner-link">Partner link</label>
      <div className="dashLink__row">
        <input id="partner-link" className="st-input dashLink__input" readOnly value={url} onFocus={(e) => e.target.select()} />
        <button type="button" className="st-btn st-btn--primary" onClick={copy}>
          <ContentCopy size={18} />
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button type="button" className="st-btn st-btn--outline">
          <QrCode size={18} />
          Download QR
        </button>
      </div>
    </section>
  )
}

/* ---------- page ---------- */

export default function Dashboard({ embedded = false }) {
  const { profile, status, reset } = useProgram()
  const flow = useFlow()
  const data = DAY_ONE
  const [filter, setFilter] = useState('all')

  const today = new Date()
  const { startDate, endDate } = profile
  const daysElapsed = Math.max(0, diffDays(today, startDate))
  const daysLeft = Math.max(0, diffDays(endDate, today))
  const month = Math.min(6, Math.floor(daysElapsed / 30.4) + 1)
  const isDayOne = daysElapsed === 0

  const stats = summarise(data.agents)
  const needed = Math.max(0, TARGET - stats.active)
  const expectedShare = daysElapsed / TOTAL_DAYS
  const behind = daysElapsed > 14 && stats.active / TARGET < expectedShare - 0.1
  const pill = stats.active >= TARGET
    ? { tone: 'ok', label: 'Target reached' }
    : behind
      ? { tone: 'accent', label: 'Behind target' }
      : { tone: 'ok', label: 'On track' }

  const agents = filter === 'all' ? data.agents : data.agents.filter((a) => a.status === filter)

  const cameraRows = [
    { label: 'Camera', value: data.cameraStatus },
    { label: 'Subscription', value: 'Free – partner plan' },
    { label: 'AI credits', value: '50 every month' },
    { label: 'Camera access', value: 'Active', tone: 'ok' },
    { label: 'Next check', value: fmtDate(endDate) },
  ]

  return (
    <div className="dashPage">
      <header className="dashHead">
        <div>
          {embedded ? (
            <h2 className="dashHead__title dashHead__title--sm">Photographer program</h2>
          ) : (
            <h1 className="dashHead__title">Photographer program</h1>
          )}
          <p className="st-p dashHead__sub">
            Invite agents to subscribe to Giraffe360 with your partner link. Reach {TARGET} subscriptions in
            your first 6 months and keep {TARGET} active to continue using your free Gen5 camera.
          </p>
        </div>
        <button type="button" className="st-btn st-btn--outline">Program terms</button>
      </header>

      <section className="dashBanner" role="status" aria-label="Camera and program status">
        <div className="dashBanner__lead">
          <InfoCircle size={20} />
          <p>
            <strong>Your camera is on its way.</strong> Your 6 months{' '}
            {isDayOne ? 'started today' : 'started on'}, {fmtDate(startDate)}. Your partner link is live.
          </p>
        </div>
        <dl className="dashBanner__facts">
          {cameraRows.map((r) => (
            <div className="dashBanner__fact" key={r.label}>
              <dt>{r.label}</dt>
              <dd className={r.tone ? `dashBanner__value--${r.tone}` : undefined}>{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="dashCard dashQual" aria-label="Qualifying period">
        <div className="dashQual__head">
          <div>
            <h2 className="st-h3">Qualifying period</h2>
            <p className="st-small">
              Month {month} of 6 · {fmtDate(startDate)} – {fmtDate(endDate)}
            </p>
          </div>
          <span className={`st-pill st-pill--${pill.tone}`}>{pill.label}</span>
        </div>

        <div className="dashMetric">
          <div className="dashMetric__row">
            <span className="dashMetric__label">Active subscriptions</span>
            <span className="dashMetric__big">
              {stats.active} <small>of {TARGET}</small>
            </span>
          </div>
          <ProgressBar value={stats.active} max={TARGET} />
          <p className="st-small">
            {needed > 0
              ? `${needed} more needed to keep your camera after the qualifying period`
              : 'Target reached. Keep 20 active to continue after the qualifying period.'}
          </p>
        </div>

        <div className="dashMetric">
          <div className="dashMetric__row">
            <span className="dashMetric__label">Time left</span>
            <span className="dashMetric__value">{daysLeft} days</span>
          </div>
          <ProgressBar value={Math.max(daysElapsed, 1)} max={TOTAL_DAYS} tone="dark" />
        </div>

        <p className="st-small dashQual__foot">
          After {fmtDate(endDate)}, active subscriptions are checked every quarter. Below {TARGET}, you get a
          grace period of up to 3 months.
        </p>
      </section>

      <PartnerLink url={profile.partnerLink} live />

      <section className="dashKitchen" aria-label="Join Kitchen">
        <span className="dashKitchen__icon" aria-hidden="true">
          <Lightbulb size={24} />
        </span>
        <div className="dashKitchen__copy">
          <h2 className="dashKitchen__title">Help shape Giraffe360 – join Kitchen</h2>
          <p>
            Try new features before anyone else and share feedback directly with our product team. As a
            partner, your input matters most.
          </p>
        </div>
        <button type="button" className="st-btn st-btn--primary">Join Kitchen</button>
      </section>

      <div className="dashTiles">
        <StatTile label="Total sign-ups" value={stats.total} sub="All statuses" />
        <StatTile label="Active now" value={stats.active} sub="Counts toward goal" tone="ok" />
        <StatTile label="Suspended" value={stats.suspended} sub="Not counted" tone="warn" />
        <StatTile label="Cancelled" value={stats.cancelled} sub="Not counted" tone="bad" />
      </div>

      <section className="dashAgents" aria-labelledby="dash-agents">
        <div className="dashAgents__head">
          <h2 id="dash-agents" className="st-h2">Subscribed agents</h2>
          <select className="st-select dashAgents__filter" aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="dashCard dashTableWrap">
          <table className="dashTable">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Agency</th>
                <th>Status</th>
                <th>Subscribed ↓</th>
                <th>Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="dashTable__empty">
                    {data.agents.length === 0
                      ? 'No agents yet. Share your link to start counting.'
                      : 'No agents with this status.'}
                  </td>
                </tr>
              ) : (
                agents.map((a) => (
                  <tr key={a.email}>
                    <td>
                      <span className="dashTable__name">{a.name}</span>
                      <span className="dashTable__email">{a.email}</span>
                    </td>
                    <td>{a.agency}</td>
                    <td>
                      <span className={`st-pill st-pill--${STATUS_TONE[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                    </td>
                    <td>{fmtDate(a.subscribed)}</td>
                    <td>{a.cancelled ? fmtDate(a.cancelled) : '–'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashHow" aria-labelledby="dash-how">
        <h2 id="dash-how" className="st-h2">How the program works</h2>
        <div className="dashHow__grid">
          {PROGRAM_STEPS.map((s) => (
            <article className="dashHow__card" key={s.title}>
              <span className="dashHow__label">{s.label}</span>
              <h3 className="dashHow__title">{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="dashProto">
        Prototype · signed in as {profile.fullName} ({profile.email}) · status: {status}.{' '}
        <Link to={flow.start} onClick={reset}>Restart this flow</Link>
      </p>
    </div>
  )
}
