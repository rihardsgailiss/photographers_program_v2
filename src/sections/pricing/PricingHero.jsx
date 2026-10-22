import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PricingHero.css'

const PLANS = [
  {
    id: 'studio',
    variant: 'white',
    title: 'Content Studio',
    desc: 'Enhance your property photos & turn them into videos, web, and branded marketing.',
    price: '$85',
    cta: 'Subscribe now',
    ctaVariant: 'dark',
  },
  {
    id: 'plus',
    variant: 'accent',
    title: 'Content Studio Plus',
    desc: 'For teams creating more property marketing, with more capacity.',
    price: '$175',
    cta: 'Subscribe now',
    ctaVariant: 'dark',
  },
  {
    id: 'camera',
    variant: 'white',
    title: 'Content Studio & Camera',
    desc: 'Unlock all immersive contents yourself; photos, floor plans, virtual tours, and 3D videos with Giraffe360 capture.',
    price: '$360',
    cta: 'Subscribe now',
    ctaVariant: 'dark',
    toggle: true,
  },
  {
    id: 'enterprise',
    variant: 'white',
    title: 'Enterprise',
    desc: 'Get help choosing the right plan, or talk to us about an Enterprise subscription tailored to your business.',
    price: null,
    cta: 'Book a call',
    ctaVariant: 'secondary',
  },
]

function BillingToggle() {
  const [annual, setAnnual] = useState(false)
  return (
    <div className="planSwitch" role="tablist" aria-label="Billing period">
      <button
        type="button"
        role="tab"
        aria-selected={!annual}
        className={`planSwitch__opt${!annual ? ' is-active' : ''}`}
        onClick={() => setAnnual(false)}
      >
        Billed monthly
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={annual}
        className={`planSwitch__opt${annual ? ' is-active' : ''}`}
        onClick={() => setAnnual(true)}
      >
        Billed annually
        <span className="planSwitch__badge">save $360</span>
      </button>
    </div>
  )
}

function PlanCard({ plan, onSelect }) {
  return (
    <article className={`planCard planCard--${plan.variant}`}>
      <div className="planCard__title">
        <h3 className="planCard__name">{plan.title}</h3>
        <p className="planCard__desc">{plan.desc}</p>
      </div>

      {plan.toggle && <BillingToggle />}

      <div className="planCard__pricing">
        {plan.price && (
          <p className="planCard__price">
            <span className="planCard__priceValue">{plan.price}</span>
            <span className="planCard__priceUnit">/ month</span>
          </p>
        )}
      </div>

      <button
        type="button"
        className={`planCard__btn planCard__btn--${plan.ctaVariant}`}
        onClick={plan.price ? () => onSelect(plan.id) : undefined}
      >
        {plan.cta}
      </button>
    </article>
  )
}

/* Plan cards. "Subscribe now" opens the checkout; the Agent / Photographer choice lives there. */
export default function PricingHero() {
  const navigate = useNavigate()
  return (
    <section className="pricingHero">
      <div className="pricingHero__cards">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={(id) => navigate(`/checkout?plan=${id}`)} />
        ))}
      </div>
    </section>
  )
}
