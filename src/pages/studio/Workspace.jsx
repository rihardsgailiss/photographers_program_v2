import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudioBar } from '../../layouts/StudioLayout.jsx'
import StepFrame from '../../components/studio/StepFrame.jsx'
import StudioField, { FloatInput } from '../../components/studio/StudioField.jsx'
import { useProgram } from '../../context/ProgramContext.jsx'

/* Onboarding step 1 of 2 for new accounts: name the workspace. Everything else is already
   known from the application; the delivery address and card come next. */
export default function Workspace() {
  const navigate = useNavigate()
  const { profile, signup, updateSignup } = useProgram()
  const [org, setOrg] = useState(signup.orgName || `${profile.lastName} Photography`.trim())
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!org.trim()) {
      setError('Enter a name for your workspace.')
      return
    }
    updateSignup({ orgName: org.trim(), country: profile.country, phone: profile.phone })
    navigate('/signup/checkout')
  }

  return (
    <>
      <StudioBar />
      <StepFrame
        eyebrow="Step 1 of 2"
        title="Name your workspace"
        intro="Welcome to the program. Give your Content Studio workspace a name; your delivery address and card come next."
        onSubmit={onSubmit}
        nextLabel="Next"
      >
        <StudioField
          id="org"
          helper="Usually your company or team name"
          error={error}
          note="Suggested from your application – you can change it"
        >
          <FloatInput
            id="org"
            label="Organisation name"
            autoComplete="organization"
            value={org}
            onChange={(e) => {
              setOrg(e.target.value)
              if (error) setError('')
            }}
          />
        </StudioField>
      </StepFrame>
    </>
  )
}
