import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Close } from '../../components/icons/index.jsx'
import CheckoutForm, { PLAN_INFO } from '../../components/checkout/CheckoutForm.jsx'
import { MessageSent, OrderPlaced, RequestReceived } from '../../components/checkout/RequestReceived.jsx'
import { useProgram } from '../../context/ProgramContext.jsx'

/* In-app checkout reached from Manage your plan. Same form as the website checkout, prefilled
   from the account; Photographer sends the $0 program request from inside Content Studio. */
export default function StudioCheckout() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const plan = PLAN_INFO[params.get('plan')] ? params.get('plan') : 'camera'
  const { status, profile, submitApplication } = useProgram()
  const [placed, setPlaced] = useState(false)
  const [sent, setSent] = useState(null) // 'Other': message sent to Customer Support
  const requested = status !== 'none'

  const onDone = (r) => {
    if (r.audience === 'other') {
      setSent(r.email)
    } else if (r.audience === 'photographer') {
      // Request only: Customer Support reviews it first; address and card come in onboarding.
      submitApplication({ ...r.contact, industry: r.industry, license: r.license, country: r.address.country })
    } else {
      setPlaced(true)
    }
    window.scrollTo(0, 0)
  }

  const prefill = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    industry: profile.industry,
    license: profile.license,
  }

  return (
    <div className="studio studioCheckout">
      <button type="button" className="orgSettings__close" aria-label="Close" onClick={() => navigate('/studio/plan')}>
        <Close size={24} />
      </button>
      <div className="checkoutPage">
        <div className="checkoutPage__inner">
          <header className="checkoutPage__head">
            <p className="st-eyebrow">Manage your plan</p>
            <h1 className="st-h1 checkoutPage__title">Checkout</h1>
            {!requested && !placed && (
              <p className="st-p checkoutPage__lead">Your account details are filled in from your profile.</p>
            )}
          </header>
          {requested ? (
            <RequestReceived existing />
          ) : sent ? (
            <MessageSent email={sent} backTo="/studio/plan" backLabel="Back to Manage your plan →" />
          ) : placed ? (
            <OrderPlaced plan={plan} />
          ) : (
            <CheckoutForm key={plan} plan={plan} audienceSelectable prefill={prefill} onDone={onDone} />
          )}
        </div>
      </div>
    </div>
  )
}
