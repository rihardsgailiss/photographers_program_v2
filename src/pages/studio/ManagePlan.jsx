import { useNavigate } from 'react-router-dom'
import { useProgram } from '../../context/ProgramContext.jsx'
import { ACCOUNTS, PLANS } from '../../data/plans.js'
import { Check, Close } from '../../components/icons/index.jsx'
import './ManagePlan.css'

/* Figma "Manage your plan" (5697:9318). Demo accounts upgrade from here; "Upgrade" opens the
   in-app checkout, where photographers choose Photographer to apply for the free program. */

function Value({ v }) {
  return v === true ? <Check size={16} className="plan__check" /> : <span>{v}</span>
}

function PlanCard({ plan, current, rank, onUpgrade }) {
  const isCurrent = current === plan.id
  const isUpgrade = plan.rank > rank

  let action
  if (isCurrent) {
    action = null
  } else if (isUpgrade) {
    action = <button type="button" className="st-btn st-btn--primary st-btn--block" onClick={() => onUpgrade(plan.id)}>Upgrade</button>
  } else {
    action = <button type="button" className="st-btn st-btn--outline st-btn--block plan__downgrade">Downgrade</button>
  }

  return (
    <article className={`plan${isCurrent ? ' plan--current' : ''}`}>
      {isCurrent && <span className="plan__tag">Current plan</span>}
      <h2 className="plan__name">{plan.name}</h2>
      <p className="plan__price">
        <strong>${plan.price}</strong> <span>/ month</span>
      </p>
      <p className="plan__desc">{plan.desc}</p>
      {plan.program && <p className="plan__note">Photographer? Choose Photographer at checkout to apply for the free Photographer program.</p>}
      <div className="plan__action">{action}</div>

      {plan.cameras && (
        <div className="plan__group">
          <div className="plan__row"><span>Cameras included in plan</span><Value v={String(plan.cameras)} /></div>
          <button type="button" className="st-btn st-btn--outline st-btn--block plan__addCam">Add more cameras</button>
        </div>
      )}
      {plan.groups.map((rows, i) => (
        <div className="plan__group" key={i}>
          {rows.map(([label, v]) => (
            <div className="plan__row" key={label}>
              <span>{label}</span>
              <Value v={v} />
            </div>
          ))}
        </div>
      ))}
    </article>
  )
}

export default function ManagePlan() {
  const navigate = useNavigate()
  const { account } = useProgram()
  const acct = ACCOUNTS[account] ?? ACCOUNTS.demo

  return (
    <div className="studio managePlan">
      <button type="button" className="orgSettings__close" aria-label="Close" onClick={() => navigate(-1)}>
        <Close size={24} />
      </button>

      <header className="managePlan__head">
        <h1 className="managePlan__title">Manage your plan</h1>
        {acct.planId && acct.planId !== 'free' && (
          <button type="button" className="st-btn st-btn--outline">Cancel subscription</button>
        )}
      </header>

      <div className="managePlan__grid">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={acct.planId}
            rank={acct.rank}
            onUpgrade={(id) => navigate(`/studio/checkout?plan=${id}`)}
          />
        ))}
      </div>

      <section className="managePlan__enterprise">
        <div>
          <h2 className="st-h3">Enterprise</h2>
          <p className="st-p">For creating high-quality, versatile property media via repeatable workflows</p>
        </div>
        <button type="button" className="st-btn st-btn--primary">Book a call</button>
      </section>
    </div>
  )
}
