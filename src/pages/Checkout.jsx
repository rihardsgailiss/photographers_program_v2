import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { StudioBar } from '../layouts/StudioLayout.jsx'
import CheckoutForm, { PLAN_INFO } from '../components/checkout/CheckoutForm.jsx'
import { OrderPlaced, RequestReceived } from '../components/checkout/RequestReceived.jsx'
import { useProgram } from '../context/ProgramContext.jsx'

/* Website checkout (subscribe.giraffe360.com/order-checkout). For the Content Studio & Camera
   plan the Agent / Photographer choice sits on top; Photographer sends a $0 program request
   (contact and company details only, reviewed by Customer Support before anything else). */
export default function Checkout() {
  const [params] = useSearchParams()
  const plan = PLAN_INFO[params.get('plan')] ? params.get('plan') : 'camera'
  const { status, submitApplication } = useProgram()
  const [placed, setPlaced] = useState(false)
  const requested = status !== 'none'

  const onDone = (r) => {
    if (r.audience === 'photographer') {
      // Request only: Customer Support reviews it first; address and card come in onboarding.
      submitApplication({ ...r.contact, industry: r.industry, license: r.license, country: r.address.country })
      window.scrollTo(0, 0)
    } else {
      setPlaced(true)
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <StudioBar />
      <div className="checkoutPage">
        <div className="checkoutPage__inner">
          <header className="checkoutPage__head">
            <h1 className="st-h1 checkoutPage__title">Checkout</h1>
          </header>
          {requested ? (
            <RequestReceived />
          ) : placed ? (
            <OrderPlaced plan={plan} />
          ) : (
            <CheckoutForm key={plan} plan={plan} audienceSelectable onDone={onDone} />
          )}
        </div>
      </div>
    </>
  )
}
