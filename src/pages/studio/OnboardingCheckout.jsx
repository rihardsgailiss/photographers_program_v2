import { useNavigate } from 'react-router-dom'
import { StudioBar } from '../../layouts/StudioLayout.jsx'
import CheckoutForm from '../../components/checkout/CheckoutForm.jsx'
import { Check } from '../../components/icons/index.jsx'
import { useFlow, useProgram } from '../../context/ProgramContext.jsx'

const PERKS = [
  'Your Gen5 camera ships to you',
  'Your partner link goes live today',
  '6 months to reach 20 active agents',
]

/* Onboarding after approval: the photographer adds the delivery address and a card ($0, nothing
   charged) inside Content Studio. Contact and company details are already known from the request.
   New accounts reach it as step 2 of 2 (after naming the workspace); demo accounts as the only step. */
export default function OnboardingCheckout() {
  const navigate = useNavigate()
  const { profile, placeOrder } = useProgram()
  const flow = useFlow()
  const onlyStep = flow.id === 'demo'

  const onDone = (r) => {
    placeOrder({ delivery: r.address, billingSame: r.billingSame, billing: r.billing })
    navigate('/studio/organisation/photographer-program')
  }

  return (
    <>
      <StudioBar />
      <div className="checkoutPage">
        <div className="checkoutPage__inner">
          <header className="checkoutPage__head">
            <p className="st-eyebrow">{onlyStep ? 'One last thing' : 'Step 2 of 2'}</p>
            <h1 className="st-h1 checkoutPage__title">Add your delivery address and card</h1>
            <p className="st-p checkoutPage__lead">
              Welcome to the Photographer program, {profile.firstName}. Nothing is charged today; when you
              submit, your camera ships and your partner link goes live.
            </p>
            <ul className="checkoutPage__perks">
              {PERKS.map((p) => (
                <li key={p}>
                  <Check size={18} />
                  {p}
                </li>
              ))}
            </ul>
          </header>
          <CheckoutForm
            plan="camera"
            lockedAudience="photographer"
            showContact={false}
            showCompany={false}
            mode="activate"
            prefill={{ firstName: profile.firstName, lastName: profile.lastName, country: profile.country }}
            onDone={onDone}
          />
        </div>
      </div>
    </>
  )
}
