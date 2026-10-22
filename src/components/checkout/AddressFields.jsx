import StudioField, { FloatInput } from '../studio/StudioField.jsx'
import { COUNTRIES } from '../../context/programDefaults.js'

export const EMPTY_ADDRESS = { street: '', apt: '', city: '', state: '', zip: '', country: 'United States' }

export function validateAddress(a, prefix, errs) {
  if (!a.street.trim()) errs[`${prefix}.street`] = 'Enter the street address.'
  if (!a.city.trim()) errs[`${prefix}.city`] = 'Enter the city.'
  if (!a.state.trim()) errs[`${prefix}.state`] = 'Enter the state.'
  if (!a.zip.trim()) errs[`${prefix}.zip`] = 'Enter the ZIP code.'
}

/* Country, street, apartment, city / state / ZIP. Used for delivery and billing addresses. */
export default function AddressFields({ prefix, value, onChange, errors }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value })
  return (
    <>
      <div className="st-selectWrap">
        <span className="st-selectWrap__label">Country / Region</span>
        <select id={`${prefix}-country`} className="st-select" aria-label="Country / Region" value={value.country} onChange={set('country')}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <StudioField id={`${prefix}-street`} error={errors[`${prefix}.street`]}>
        <FloatInput id={`${prefix}-street`} label="Street address" autoComplete="street-address" value={value.street} onChange={set('street')} />
      </StudioField>
      <FloatInput id={`${prefix}-apt`} label="Apartment, suite, unit, etc. (optional)" autoComplete="address-line2" value={value.apt} onChange={set('apt')} />
      <div className="co__row co__row--3">
        <StudioField id={`${prefix}-city`} error={errors[`${prefix}.city`]}>
          <FloatInput id={`${prefix}-city`} label="Town / City" autoComplete="address-level2" value={value.city} onChange={set('city')} />
        </StudioField>
        <StudioField id={`${prefix}-state`} error={errors[`${prefix}.state`]}>
          <FloatInput id={`${prefix}-state`} label="State" autoComplete="address-level1" value={value.state} onChange={set('state')} />
        </StudioField>
        <StudioField id={`${prefix}-zip`} error={errors[`${prefix}.zip`]}>
          <FloatInput id={`${prefix}-zip`} label="Postcode" autoComplete="postal-code" inputMode="numeric" value={value.zip} onChange={set('zip')} />
        </StudioField>
      </div>
    </>
  )
}
