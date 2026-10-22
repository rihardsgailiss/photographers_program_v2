import { Link } from 'react-router-dom'
import { useProgram } from '../context/ProgramContext.jsx'
import { Check } from './icons/index.jsx'
import './ApplicationConfirmation.css'

/* Shown in place of the application form (landing card or pricing modal) after submit. */
export default function ApplicationConfirmation({ variant = 'card', onReset }) {
  const { reset } = useProgram()
  const handleReset = () => {
    reset()
    onReset?.()
  }
  return (
    <div className={`appConfirm appConfirm--${variant}`} role="status" aria-live="polite">
      <span className="appConfirm__icon" aria-hidden="true">
        <Check size={28} />
      </span>
      <h3 className="appConfirm__title">Thanks, your application is in</h3>
      <p className="appConfirm__lead">We'll check your details and call you within 2 working days.</p>

      <p className="appConfirm__label">What happens next</p>
      <ol className="appConfirm__steps">
        <li>We call you.</li>
        <li>If you're approved, we email you a sign-up link.</li>
        <li>Sign in, name your workspace and add your delivery address and card. Your camera ships and your 6 months start.</li>
      </ol>
      <p className="appConfirm__note">No account is created yet.</p>

      <div className="appConfirm__protoRow">
        <Link to="/email/approved" className="appConfirm__proto">
          Prototype: open the approval email →
        </Link>
        <button type="button" className="appConfirm__proto" onClick={handleReset}>
          Reset and apply again
        </button>
      </div>
    </div>
  )
}
