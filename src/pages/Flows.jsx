import { useNavigate } from 'react-router-dom'
import { useProgram } from '../context/ProgramContext.jsx'
import { FLOW_LIST } from '../data/flows.js'
import { ArrowForward } from '../components/icons/index.jsx'
import './Flows.css'

/* Prototype entry point: pick one of the three flows. Each flow starts afresh from its first screen. */
export default function Flows() {
  const navigate = useNavigate()
  const { startFlow } = useProgram()

  const start = (flow) => {
    startFlow(flow.id)
    navigate(flow.start)
  }

  return (
    <div className="studio flows">
      <header className="flows__head">
        <p className="st-eyebrow">Giraffe360 · Photographer program prototype</p>
        <h1 className="st-h1 flows__title">Choose a flow</h1>
        <p className="st-p flows__lead">
          Three ways into the Photographer program. Each flow starts from its first screen; the
          yellow dot in the top-left corner lists the steps of the active flow so you can jump
          between them at any time.
        </p>
      </header>

      <div className="flows__grid">
        {FLOW_LIST.map((flow, i) => (
          <article className="flows__card" key={flow.id}>
            <span className="flows__num">Flow {i + 1}</span>
            <h2 className="flows__name">{flow.name}</h2>
            <p className="st-small flows__starts">Starts at: {flow.startsAt}.</p>
            <ol className="flows__steps">
              {flow.steps.map((s) => (
                <li key={s.label}>{s.label}</li>
              ))}
            </ol>
            <button type="button" className="st-btn st-btn--primary flows__start" onClick={() => start(flow)}>
              Start flow
              <ArrowForward size={18} />
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
