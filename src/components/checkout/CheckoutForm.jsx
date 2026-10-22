import { useState } from 'react'
import StudioField, { FloatInput } from '../studio/StudioField.jsx'
import AddressFields, { EMPTY_ADDRESS, validateAddress } from './AddressFields.jsx'
import { DEFAULT_APPLICATION, DEMO_ADDRESS, DEMO_CARD, INDUSTRIES } from '../../context/programDefaults.js'
import { digitsOnly, formatCard, formatExpiry, isEmail } from '../../utils/format.js'
import './CheckoutForm.css'

/* Mirrors subscribe.giraffe360.com/order-checkout: address → contact → company → payment on the
   left, order summary on the right. For the Content Studio & Camera plan the first item is the
   Agent / Photographer choice. Photographer turns the checkout into a $0 program request that
   Customer Support reviews first: only contact and company details are asked, the delivery
   address and card come later in onboarding (mode "activate"), once the request is approved. */

export const PLAN_INFO = {
  studio: { name: 'Content Studio subscription', price: 85, shipping: false },
  plus: { name: 'Content Studio Plus subscription', price: 175, shipping: false },
  camera: { name: 'Giraffe PRO Camera & Content Studio subscription', price: 360, shipping: true },
}

const AUDIENCES = [
  { id: 'agent', label: 'Real estate agent' },
  { id: 'photographer', label: 'Photographer' },
]

const money = (n) => `$ ${n.toFixed(2)}`

const EMPTY_CONTACT = { firstName: '', lastName: '', email: '', phone: '' }

export default function CheckoutForm({
  plan = 'camera',
  audienceSelectable = false,
  lockedAudience,
  prefill = {},
  showContact = true,
  showCompany = true,
  mode = 'request', // 'request' (apply, we call you) | 'activate' (already approved: order ships on submit)
  onDone,
}) {
  const activate = mode === 'activate'
  const info = PLAN_INFO[plan] ?? PLAN_INFO.camera
  const canSelect = audienceSelectable && plan === 'camera' && !lockedAudience
  const [audience, setAudience] = useState(lockedAudience ?? 'agent')
  const photographer = plan === 'camera' && audience === 'photographer'
  /* Photographer requests are reviewed first: no address, no card until approved (activate mode). */
  const requestOnly = photographer && !activate
  const collectPayment = !requestOnly

  const [contact, setContact] = useState({ ...EMPTY_CONTACT, ...pick(prefill, ['firstName', 'lastName', 'email', 'phone']) })
  const [delivery, setDelivery] = useState({ ...EMPTY_ADDRESS, ...(prefill.country ? { country: prefill.country } : {}) })
  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState(EMPTY_ADDRESS)
  const [industry, setIndustry] = useState(prefill.industry ?? '')
  const [license, setLicense] = useState(prefill.license ?? '')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [renew, setRenew] = useState(false)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState({})

  const setC = (k) => (e) => setContact({ ...contact, [k]: e.target.value })

  const autofill = () => {
    const { submittedAt, ...demo } = DEFAULT_APPLICATION
    setContact({ firstName: demo.firstName, lastName: demo.lastName, email: contact.email || demo.email, phone: demo.phone })
    setDelivery(DEMO_ADDRESS)
    setBillingSame(true)
    setIndustry(industry || demo.industry)
    setLicense(license || demo.license)
    setCard(DEMO_CARD)
    setRenew(true)
    setTerms(true)
    setErrors({})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!contact.firstName.trim()) errs.firstName = 'Enter your first name.'
    if (!contact.lastName.trim()) errs.lastName = 'Enter your last name.'
    if (collectPayment) {
      validateAddress(delivery, 'delivery', errs)
      if (!billingSame) validateAddress(billing, 'billing', errs)
    }
    if (showContact) {
      if (!isEmail(contact.email)) errs.email = 'Enter a valid email address.'
      if (!contact.phone.trim()) errs.phone = 'Enter your phone number.'
    }
    if (showCompany) {
      if (!industry) errs.industry = 'Select your industry.'
      if (photographer && !license.trim()) errs.license = 'Enter your license number.'
    }
    if (collectPayment) {
      const num = digitsOnly(card.number)
      if (num.length < 13) errs.number = 'Enter a valid card number.'
      const exp = digitsOnly(card.expiry)
      const mm = Number(exp.slice(0, 2))
      if (exp.length !== 4 || mm < 1 || mm > 12) errs.expiry = 'Use MM/YY.'
      if (digitsOnly(card.cvc).length < 3) errs.cvc = 'Enter the CVC.'
    }
    if (!photographer && !renew) errs.renew = 'Please confirm the automatic renewal.'
    if (!terms) errs.terms = 'Please accept the terms to continue.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    onDone?.({
      audience: photographer ? 'photographer' : 'agent',
      plan,
      contact,
      industry,
      license,
      address: delivery,
      billingSame,
      billing: billingSame ? delivery : billing,
    })
  }

  const nameRow = (
    <div className="co__row">
      <StudioField id="co-first" error={errors.firstName}>
        <FloatInput id="co-first" label="First name" autoComplete="given-name" value={contact.firstName} onChange={setC('firstName')} />
      </StudioField>
      <StudioField id="co-last" error={errors.lastName}>
        <FloatInput id="co-last" label="Last name" autoComplete="family-name" value={contact.lastName} onChange={setC('lastName')} />
      </StudioField>
    </div>
  )

  return (
    <div className="co">
      <form className="co__form" onSubmit={onSubmit} noValidate>
        {canSelect && (
          <section className="co__card" aria-labelledby="co-audience">
            <div className="co__audienceRow">
              <h2 id="co-audience" className="st-h3">I am a</h2>
              <div className="coToggle" role="tablist" aria-labelledby="co-audience">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    aria-selected={audience === a.id}
                    className={`coToggle__opt${audience === a.id ? ' is-active' : ''}`}
                    onClick={() => setAudience(a.id)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="co__hint">
              {photographer
                ? 'Photographers apply to the Photographer program: a free Gen5 camera and Content Studio & Camera subscription for approved partners in the US and Canada. Our Customer Support reviews every request and calls you. No address or card is needed now; we ask for them once you are approved.'
                : 'Real estate agents subscribe to Content Studio & Camera. Photographers can apply for the free Photographer program instead.'}
            </p>
          </section>
        )}

        {collectPayment && (
        <section className="co__card" aria-labelledby="co-address">
          <h2 id="co-address" className="st-h3">{photographer ? 'Billing / shipping address' : 'Delivery & contact information'}</h2>
          {nameRow}
          <AddressFields prefix="delivery" value={delivery} onChange={setDelivery} errors={errors} />
          <label className="st-check st-check--small">
            <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
            <span>Billing address is the same as {photographer ? 'shipping' : 'delivery'}</span>
          </label>
          {!billingSame && (
            <div className="co__sub">
              <h3 className="st-h3 co__subTitle">Billing address</h3>
              <AddressFields prefix="billing" value={billing} onChange={setBilling} errors={errors} />
            </div>
          )}
        </section>
        )}

        {showContact && (
          <section className="co__card" aria-labelledby="co-contact">
            <h2 id="co-contact" className="st-h3">Contact information</h2>
            {!collectPayment && nameRow}
            <StudioField id="co-email" error={errors.email}>
              <FloatInput id="co-email" type="email" label="Email" autoComplete="email" value={contact.email} onChange={setC('email')} />
            </StudioField>
            <StudioField id="co-phone" error={errors.phone}>
              <FloatInput id="co-phone" type="tel" label="Phone number" autoComplete="tel" value={contact.phone} onChange={setC('phone')} />
            </StudioField>
          </section>
        )}

        {showCompany && (
          <section className="co__card" aria-labelledby="co-company">
            <h2 id="co-company" className="st-h3">Company details</h2>
            <StudioField id="co-industry" error={errors.industry}>
              <div className="st-selectWrap">
                <span className="st-selectWrap__label">Industry</span>
                <select id="co-industry" className="st-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </StudioField>
            {photographer && (
              <StudioField id="co-license" error={errors.license} helper="Needed to review your Photographer program request">
                <FloatInput id="co-license" label="License number" value={license} onChange={(e) => setLicense(e.target.value)} />
              </StudioField>
            )}
          </section>
        )}

        <section className="co__card" aria-labelledby="co-payment">
          <h2 id="co-payment" className="st-h3">{requestOnly ? 'Your request' : 'Payment'}</h2>
          {photographer && collectPayment && (
            <p className="co__hint co__hint--strong">
              <strong>Your card stays on file. Nothing is charged today.</strong> It keeps the partnership on a
              proper contract and covers only extras you choose to add later, such as additional AI credits
              or accessories. The camera and your subscription are free while you are in the program.
            </p>
          )}
          {requestOnly && (
            <p className="co__hint co__hint--strong">
              <strong>No payment details now.</strong> Customer Support reviews your request and calls you within
              2 working days. If you are approved, you get an email link to sign in, name your workspace and add
              your delivery address and a card. Nothing is ever charged for the camera or the subscription.
            </p>
          )}
          {collectPayment && (
          <>
          <StudioField id="co-card" error={errors.number}>
            <FloatInput
              id="co-card"
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
            />
          </StudioField>
          <div className="co__row">
            <StudioField id="co-expiry" error={errors.expiry}>
              <FloatInput
                id="co-expiry"
                label="Expiry (MM/YY)"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              />
            </StudioField>
            <StudioField id="co-cvc" error={errors.cvc}>
              <FloatInput
                id="co-cvc"
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: digitsOnly(e.target.value).slice(0, 4) })}
              />
            </StudioField>
          </div>
          </>
          )}

          {!photographer && (
            <div className="co__legal">
              <p className="st-small"><strong>Subscription terms and automatic renewal.</strong> The initial subscription period is 1 month. Each subscription renews automatically for the same period unless you cancel in Content Studio (Billing) before the end of the current period.</p>
              <div className={`st-field${errors.renew ? ' st-field--invalid' : ''}`}>
                <label className="st-check st-check--small">
                  <input type="checkbox" checked={renew} onChange={(e) => setRenew(e.target.checked)} />
                  <span>I agree that my subscription will automatically renew and I will be charged the applicable subscription fees on a recurring basis until I cancel.</span>
                </label>
                {errors.renew && <span className="st-error" role="alert">{errors.renew}</span>}
              </div>
            </div>
          )}

          <div className={`st-field${errors.terms ? ' st-field--invalid' : ''}`}>
            <label className="st-check st-check--small">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <span>
                I have read and accept the{' '}
                {photographer && (
                  <>
                    <a className="st-link" href="#" onClick={(ev) => ev.preventDefault()}>Photographer program terms</a> and the{' '}
                  </>
                )}
                <a className="st-link" href="#" onClick={(ev) => ev.preventDefault()}>Terms of Service</a>.
              </span>
            </label>
            {errors.terms && <span className="st-error" role="alert">{errors.terms}</span>}
          </div>

          <button type="submit" className="st-btn st-btn--primary co__submit">
            {photographer ? (activate ? 'Order my camera · $0' : 'Submit request · $0') : 'Pay now'}
          </button>
          {collectPayment ? (
            <p className="co__stripe">
              Our card payments are processed by Stripe. Card details go straight to Stripe and are never stored by Giraffe360.
              See Stripe's Privacy Policy and our Privacy Policy for how your personal data is processed.
            </p>
          ) : (
            <p className="co__stripe">
              For information on how your personal data is processed, please see our Privacy Policy.
            </p>
          )}
          <button type="button" className="st-protoBtn" onClick={autofill}>
            Prototype: autofill with demo details
          </button>
        </section>
      </form>

      <aside className="co__summary" aria-label="Order summary">
        <h2 className="st-h3">Order summary</h2>
        <div className="co__line co__line--item">
          <div className="co__lineName">
            <span>{photographer ? 'Photographer program' : info.name}</span>
            <span className="co__tag">{photographer ? 'Content Studio & Camera' : 'Monthly'}</span>
          </div>
          <span>{money(photographer ? 0 : info.price)}</span>
        </div>
        {collectPayment && (
          <div className="co__rows">
            <div className="co__line"><span>Subtotal</span><span>{money(photographer ? 0 : info.price)}</span></div>
            {info.shipping && <div className="co__line"><span>Shipping</span><span>Free shipping</span></div>}
            <div className="co__line"><span>Tax</span><span>{money(0)}</span></div>
          </div>
        )}
        <div className={`co__total${collectPayment ? '' : ' co__total--top'}`}>
          <span>{requestOnly ? 'Due today' : 'Order total'}</span>
          <span>{photographer ? '$ 0.00' : `${money(info.price)} per month`}</span>
        </div>
        {photographer && (
          <div className="co__program">
            <strong>{activate ? 'What you get' : 'What you are applying for'}</strong>
            <ul>
              <li>Free Gen5 camera and Content Studio & Camera subscription (worth $360 / month)</li>
              <li>50 AI credits every month</li>
              <li>Your own partner link: reach 20 active agents within 6 months to stay in the program</li>
            </ul>
            <p>
              {activate
                ? 'When you submit, your camera ships and your 6 months start. Your card stays on file and is not charged.'
                : 'Customer Support reviews every request and calls you within 2 working days. Delivery address and card are asked only once you are approved.'}
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}

function pick(obj, keys) {
  const out = {}
  keys.forEach((k) => {
    if (obj[k] != null) out[k] = obj[k]
  })
  return out
}
