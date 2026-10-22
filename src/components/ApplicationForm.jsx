import { useState } from 'react'
import { useProgram } from '../context/ProgramContext.jsx'
import { COUNTRIES, DEFAULT_APPLICATION, INDUSTRIES } from '../context/programDefaults.js'
import { isEmail } from '../utils/format.js'
import ApplicationConfirmation from './ApplicationConfirmation.jsx'
import './ApplicationForm.css'

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  industry: '',
  license: '',
  country: 'United States',
  consent: false,
}

function validate(v) {
  const e = {}
  if (!v.firstName.trim()) e.firstName = 'Enter your first name.'
  if (!v.lastName.trim()) e.lastName = 'Enter your last name.'
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.'
  if (!v.phone.trim()) e.phone = 'Enter your phone number.'
  if (!v.industry) e.industry = 'Select your industry.'
  if (!v.license.trim()) e.license = 'Enter your license number.'
  if (!v.country) e.country = 'Select your country.'
  if (!v.consent) e.consent = 'Please agree to the terms to continue.'
  return e
}

function Field({ id, label, error, children, className = '' }) {
  return (
    <div className={`field${error ? ' field--invalid' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  )
}

/*
 * Photographer program application. Used inline on the landing page (variant "card")
 * and inside the pricing "Apply" modal (variant "modal"). On success it swaps itself
 * for the confirmation message.
 */
export default function ApplicationForm({ variant = 'card', title = 'Apply to the program', onSubmitted }) {
  const { submitApplication, account, profile, status } = useProgram()
  const fromAccount = account !== 'new'
  const [values, setValues] = useState(() =>
    fromAccount
      ? { ...EMPTY, firstName: profile.firstName, lastName: profile.lastName, email: profile.email, phone: profile.phone, country: profile.country }
      : EMPTY,
  )
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const { consent, ...data } = values
    submitApplication(data)
    onSubmitted?.(data)
  }

  const autofill = () => {
    const { submittedAt, ...demo } = DEFAULT_APPLICATION
    setValues({ ...demo, consent: true })
    setErrors({})
  }

  if (status !== 'none') {
    return (
      <ApplicationConfirmation
        variant={variant}
        onReset={() => {
          setValues(EMPTY)
          setErrors({})
        }}
      />
    )
  }

  const p = `app-${variant}`

  return (
    <form className={`appForm appForm--${variant}`} onSubmit={onSubmit} noValidate>
      <div className="appForm__head">
        <h3 className="appForm__title">{title}</h3>
        <p className="appForm__sub">
          {fromAccount
            ? 'Your account details are filled in. We check every application and call you.'
            : 'We check every application and call you. No account is created yet.'}
        </p>
      </div>

      <div className="appForm__grid">
        <Field id={`${p}-first`} label="First name" error={errors.firstName}>
          <input id={`${p}-first`} className="field__input" type="text" autoComplete="given-name" value={values.firstName} onChange={set('firstName')} />
        </Field>
        <Field id={`${p}-last`} label="Last name" error={errors.lastName}>
          <input id={`${p}-last`} className="field__input" type="text" autoComplete="family-name" value={values.lastName} onChange={set('lastName')} />
        </Field>
        <Field id={`${p}-email`} label="Email" error={errors.email} className="appForm__full">
          <input id={`${p}-email`} className="field__input" type="email" autoComplete="email" value={values.email} onChange={set('email')} />
        </Field>
        <Field id={`${p}-phone`} label="Phone" error={errors.phone}>
          <input id={`${p}-phone`} className="field__input" type="tel" autoComplete="tel" placeholder="+1" value={values.phone} onChange={set('phone')} />
        </Field>
        <Field id={`${p}-country`} label="Country" error={errors.country}>
          <select id={`${p}-country`} className="field__select" value={values.country} onChange={set('country')}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field id={`${p}-industry`} label="Industry" error={errors.industry} className="appForm__full">
          <select
            id={`${p}-industry`}
            className={`field__select${values.industry ? '' : ' is-placeholder'}`}
            value={values.industry}
            onChange={set('industry')}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
        <Field id={`${p}-license`} label="License number" error={errors.license} className="appForm__full">
          <input id={`${p}-license`} className="field__input" type="text" value={values.license} onChange={set('license')} />
        </Field>
      </div>

      <label className={`field field--check${errors.consent ? ' field--invalid' : ''}`}>
        <input type="checkbox" checked={values.consent} onChange={set('consent')} />
        <span>
          I agree to the <a href="#" onClick={(e) => e.preventDefault()}>partnership terms</a> and{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>privacy policy</a>.
          {errors.consent && <span className="field__error appForm__consentError">{errors.consent}</span>}
        </span>
      </label>

      <button type="submit" className="btn btn--primary appForm__submit">Submit application</button>

      <button type="button" className="appForm__autofill" onClick={autofill}>
        Prototype: autofill with demo details
      </button>
    </form>
  )
}
