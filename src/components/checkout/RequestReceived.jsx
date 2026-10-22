import { Link } from 'react-router-dom'
import { useProgram } from '../../context/ProgramContext.jsx'
import { Check } from '../icons/index.jsx'
import { PLAN_INFO } from './CheckoutForm.jsx'

/* Shown in place of the checkout form after a Photographer program request. */
export function RequestReceived({ existing = false }) {
  const { reset, profile } = useProgram()
  return (
    <div className="coDone" role="status" aria-live="polite">
      <span className="coDone__icon" aria-hidden="true"><Check size={28} /></span>
      <h2 className="st-h2">Thanks, your request is in</h2>
      <p className="st-p">
        Our Customer Support checks your details and calls you within 2 working days.
      </p>
      <p className="coDone__label">What happens next</p>
      <ol className="coDone__steps">
        <li>We call you.</li>
        <li>If you're approved, we email <strong>{profile.email}</strong> a sign-in link.</li>
        {existing ? (
          <li>Sign in and add your delivery address and card. Your camera ships and your 6 months start.</li>
        ) : (
          <li>Sign in, name your workspace and add your delivery address and card. Your camera ships and your 6 months start.</li>
        )}
      </ol>
      <p className="coDone__note">
        {existing
          ? 'No payment details were taken. We ask for a delivery address and card only once you are approved.'
          : 'No account is created yet and no payment details were taken. We ask for them only once you are approved.'}
      </p>
      <div className="coDone__proto">
        <Link to="/email/approved" className="st-protoBtn">Prototype: open the acceptance email →</Link>
        <button type="button" className="st-protoBtn" onClick={reset}>Reset and try again</button>
      </div>
    </div>
  )
}

/* Paid (agent) path: prototype dead end. */
export function OrderPlaced({ plan = 'camera' }) {
  const info = PLAN_INFO[plan] ?? PLAN_INFO.camera
  return (
    <div className="coDone" role="status" aria-live="polite">
      <span className="coDone__icon" aria-hidden="true"><Check size={28} /></span>
      <h2 className="st-h2">Order placed</h2>
      <p className="st-p">Your {info.name} is active. A receipt is on its way to your inbox.</p>
      <p className="coDone__note">Prototype: the paid path ends here. The Photographer program flows continue via the Photographer choice.</p>
      <div className="coDone__proto">
        <Link to="/studio/projects" className="st-protoBtn">Open Content Studio →</Link>
      </div>
    </div>
  )
}
