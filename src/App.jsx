import { useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CountryToast from './components/CountryToast.jsx'
import ProtoNav from './components/ProtoNav.jsx'
import StudioLayout from './layouts/StudioLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import { useProgram } from './context/ProgramContext.jsx'
import Flows from './pages/Flows.jsx'
import Home from './pages/Home.jsx'
import Pricing from './pages/Pricing.jsx'
import PhotographerProgram from './pages/PhotographerProgram.jsx'
import Checkout from './pages/Checkout.jsx'
import ApprovalEmail from './pages/ApprovalEmail.jsx'
import Login from './pages/studio/Login.jsx'
import EmailCode from './pages/studio/EmailCode.jsx'
import Workspace from './pages/studio/Workspace.jsx'
import OnboardingCheckout from './pages/studio/OnboardingCheckout.jsx'
import Projects from './pages/studio/Projects.jsx'
import OrgSettings from './pages/studio/OrgSettings.jsx'
import ManagePlan from './pages/studio/ManagePlan.jsx'
import StudioCheckout from './pages/studio/StudioCheckout.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* Marketing site chrome: header, footer, country toast. */
function Chrome({ children }) {
  return (
    <>
      <Header />
      <main>{children ?? <Outlet />}</main>
      <Footer />
      <CountryToast />
    </>
  )
}

/* First visit (no flow chosen yet) lands on the flow picker; afterwards "/" is the website Home. */
function Root() {
  const { flow } = useProgram()
  if (!flow) return <Navigate to="/flows" replace />
  return (
    <Chrome>
      <Home />
    </Chrome>
  )
}

export default function App() {
  return (
    <div className="page">
      <ScrollToTop />
      <ProtoNav />
      <Routes>
        {/* Prototype entry point: pick one of the three flows */}
        <Route path="/flows" element={<Flows />} />
        <Route path="/" element={<Root />} />

        <Route element={<Chrome />}>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/photographer-program" element={<PhotographerProgram />} />
        </Route>

        {/* Prototype-only mock of the acceptance email */}
        <Route path="/email/approved" element={<ApprovalEmail />} />

        {/* Website checkout (own minimal chrome, like subscribe.giraffe360.com) */}
        <Route element={<StudioLayout />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Content Studio: log in / sign up / onboarding */}
        <Route element={<StudioLayout />}>
          <Route path="/signup/login" element={<Login />} />
          <Route path="/signup/code" element={<EmailCode />} />
          <Route path="/signup/workspace" element={<Workspace />} />
          <Route path="/signup/checkout" element={<OnboardingCheckout />} />
          <Route path="/signup/step/*" element={<Navigate to="/signup/workspace" replace />} />
          <Route path="/signup/order" element={<Navigate to="/signup/checkout" replace />} />
          <Route path="/signup" element={<Navigate to="/signup/login" replace />} />
        </Route>

        {/* Content Studio app shell */}
        <Route element={<DashboardLayout />}>
          <Route path="/studio/projects" element={<Projects />} />
          <Route path="/studio" element={<Navigate to="/studio/projects" replace />} />
        </Route>

        {/* Organisation settings (full-screen, no sidebar); Photographer program lives here */}
        <Route path="/studio/plan" element={<ManagePlan />} />
        <Route path="/studio/checkout" element={<StudioCheckout />} />
        <Route path="/studio/organisation/:tab" element={<OrgSettings />} />
        <Route path="/studio/organisation" element={<Navigate to="/studio/organisation/photographer-program" replace />} />
        <Route path="/studio/photographer-program" element={<Navigate to="/studio/organisation/photographer-program" replace />} />

        <Route path="*" element={<Navigate to="/flows" replace />} />
      </Routes>
    </div>
  )
}
