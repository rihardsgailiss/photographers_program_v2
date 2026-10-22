import { useState } from 'react'
import StudioField, { FloatInput } from '../studio/StudioField.jsx'
import { DEFAULT_APPLICATION } from '../../context/programDefaults.js'
import { isEmail } from '../../utils/format.js'

/* "I am a: Other" at checkout: neither an agent nor a photographer. Instead of an order, a short
   message so Customer Support can get in touch and find the right solution. */
export default function GetInTouch({ prefill = {}, onSend }) {
  const [values, setValues] = useState({
    firstName: prefill.firstName ?? '',
    lastName: prefill.lastName ?? '',
    email: prefill.email ?? '',
    message: '',
    consent: false,
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [k]: value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const complete =
    values.firstName.trim() && values.lastName.trim() && isEmail(values.email) && values.message.trim() && values.consent

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!values.firstName.trim()) errs.firstName = 'Enter your first name.'
    if (!values.lastName.trim()) errs.lastName = 'Enter your last name.'
    if (!isEmail(values.email)) errs.email = 'Enter a valid email address.'
    if (!values.message.trim()) errs.message = 'Tell us a little about what you need.'
    if (!values.consent) errs.consent = 'Please accept the Privacy Policy to continue.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const { consent, ...data } = values
    onSend?.(data)
  }

  const autofill = () => {
    setValues({
      firstName: DEFAULT_APPLICATION.firstName,
      lastName: DEFAULT_APPLICATION.lastName,
      email: values.email || DEFAULT_APPLICATION.email,
      message: 'We run a property management company with 40 units and would like to produce virtual tours in-house. Which plan fits us?',
      consent: true,
    })
    setErrors({})
  }

  return (
    <form className="co__card touch" onSubmit={onSubmit} noValidate>
      <div className="touch__head">
        <h2 className="st-h2">Get in touch</h2>
        <p className="st-p">
          Tell us about your business and what you want to create. Customer Support will get back to
          you and find the right solution.
        </p>
      </div>
      <div className="co__row">
        <StudioField id="touch-first" error={errors.firstName}>
          <FloatInput id="touch-first" label="First name" autoComplete="given-name" value={values.firstName} onChange={set('firstName')} />
        </StudioField>
        <StudioField id="touch-last" error={errors.lastName}>
          <FloatInput id="touch-last" label="Last name" autoComplete="family-name" value={values.lastName} onChange={set('lastName')} />
        </StudioField>
      </div>
      <StudioField id="touch-email" error={errors.email}>
        <FloatInput id="touch-email" type="email" label="E-mail address" autoComplete="email" value={values.email} onChange={set('email')} />
      </StudioField>
      <StudioField id="touch-message" error={errors.message}>
        <textarea
          id="touch-message"
          className="st-input touch__message"
          placeholder="Message"
          rows={6}
          value={values.message}
          onChange={set('message')}
        />
      </StudioField>
      <div className={`st-field${errors.consent ? ' st-field--invalid' : ''}`}>
        <label className="st-check st-check--small">
          <input type="checkbox" checked={values.consent} onChange={set('consent')} />
          <span>
            I accept Giraffe360{' '}
            <a className="st-link" href="#" onClick={(ev) => ev.preventDefault()}>Privacy Policy</a>
          </span>
        </label>
        {errors.consent && <span className="st-error" role="alert">{errors.consent}</span>}
      </div>
      <button type="submit" className={`st-btn st-btn--primary co__submit${complete ? '' : ' touch__send--idle'}`}>
        Send message
      </button>
      <button type="button" className="st-protoBtn" onClick={autofill}>
        Prototype: autofill with demo details
      </button>
    </form>
  )
}
