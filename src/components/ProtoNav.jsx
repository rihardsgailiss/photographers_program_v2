import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProgram } from '../context/ProgramContext.jsx'
import { FLOWS, stepActive, stepPath } from '../data/flows.js'
import './ProtoNav.css'

/* Prototype-only navigator: a tiny dot in the top-left corner that expands into the step map
   of the active flow. Any step can be jumped to; the step prepares the state it needs. */
const STATUS_LABEL = {
  none: 'not applied',
  submitted: 'request sent',
  loggedIn: 'signed in',
  ordered: 'in the program',
}

export default function ProtoNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const ctx = useProgram()
  const { status, profile, flow: flowId, reset } = ctx
  const flow = FLOWS[flowId] ?? null
  const rootRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const goTo = (step) => {
    step.prepare?.(ctx)
    setOpen(false)
    navigate(stepPath(step, ctx))
  }

  const onRestart = () => {
    reset()
    setOpen(false)
    navigate(flow ? flow.start : '/flows')
  }

  return (
    <div className={`protoNav${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="protoNav__dot"
        aria-label={open ? 'Close prototype map' : 'Open prototype map'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <nav className="protoNav__panel" aria-label="Prototype map">
          <div className="protoNav__head">
            <span className="protoNav__title">{flow ? flow.name : 'Prototype map'}</span>
            <span className="protoNav__status">
              {flow ? `${profile.firstName} · ${STATUS_LABEL[status] ?? status}` : 'No flow selected'}
            </span>
          </div>

          {flow ? (
            <div className="protoNav__group">
              <span className="protoNav__groupTitle">Steps · click to jump</span>
              {flow.steps.map((step, i) => {
                const active = stepActive(step, pathname, ctx)
                return (
                  <button
                    type="button"
                    key={step.label}
                    className={`protoNav__item protoNav__step${active ? ' is-active' : ''}`}
                    aria-current={active ? 'step' : undefined}
                    onClick={() => goTo(step)}
                  >
                    <span className="protoNav__stepNum">{i + 1}</span>
                    <span>{step.label}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="protoNav__empty">Pick a flow to see its steps here.</p>
          )}

          <div className="protoNav__foot">
            <Link to="/flows" className="protoNav__reset">
              {flow ? 'Switch flow' : 'Choose a flow'}
            </Link>
            {flow && (
              <button type="button" className="protoNav__reset" onClick={onRestart}>
                Restart flow
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
