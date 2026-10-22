# Giraffe360 Website Prototype — Photographer program v2

A responsive, 1:1 front-end prototype of the Giraffe360 marketing site, built from the
Figma design (`giraffe_website_design_v1`). Vite + React, desktop-first (1920px design
canvas, scaled to fit narrower windows).

## Pages
- `/flows` — prototype entry point: pick one of the three flows (below)
- `/` — Home (hero, trusted-by logo marquee, horizontal-scroll feature gallery,
  scroll-linked "How it works" accordion, testimonials, AI tools, video carousel, CTA band, footer)
- `/pricing` — Pricing (billing toggle + plan cards, sticky-header comparison table, FAQ accordion).
  "Subscribe now" opens the checkout.
- `/checkout?plan=camera` — Checkout, modelled on subscribe.giraffe360.com/order-checkout. For the
  Content Studio & Camera plan the first item is "I am a: Real estate agent / Photographer" (Agent by
  default). Photographer turns it into a $0 Photographer program request: contact and company details
  only, no address and no card. Customer Support reviews the request first; the address and card are
  asked in onboarding once the photographer is approved. Other hides the order summary and shows a
  "Get in touch" message form (name, e-mail, message) so Customer Support can find the right solution.
  The same choice is on the in-app checkout (`/studio/checkout`, flow 3).
- `/photographer-program` — Photographer Partner Program landing page (US / Canada) with the
  application form, "How the program works" and FAQ.

## The three flows (prototype)
Each flow starts from `/flows` and shows its name and numbered steps in the prototype map (yellow dot,
top-left). Any step can be jumped to; the map puts the shared state (`ProgramContext`, in
`sessionStorage`) into the shape that step needs. "Switch flow" returns to `/flows`, "Restart flow"
starts the active flow over.

| # | Flow | Steps |
|---|---|---|
| 1 | New user, through Landing page | `/photographer-program` apply → request received → `/email/approved` → `/signup/login` → `/signup/code` → onboarding 1/2 `/signup/workspace` → onboarding 2/2 `/signup/checkout` (delivery address + card, $0) → `/studio/organisation/photographer-program` |
| 2 | New user, through Checkout page | `/` → `/pricing` → `/checkout?plan=camera` (Photographer: contact + company details, $0 request) → request received → `/email/approved` → sign in → code → onboarding 1/2 `/signup/workspace` → onboarding 2/2 `/signup/checkout` (delivery address + card) → Photographer program tab |
| 3 | Demo account, through Dashboard | `/studio/projects` (demo box → Manage plan) → `/studio/plan` → `/studio/checkout?plan=camera` (prefilled from the account, $0 request) → request received → `/email/approved` → sign in → code → `/signup/checkout` (delivery address + card, only step) → Photographer program tab |

In every flow the request is reviewed by Customer Support first. The delivery address and card are
asked only after approval, inside Content Studio (the email link leads to sign-in), with the Stripe
note and "nothing is charged today". Once the program is active, Photographer program replaces
Billing in Organisation settings.

## Highlights
- Sticky header with frosted background that fades in on scroll; CTA buttons reveal after the first fold
- Product mega-menu (hover), country/language toast (on load)
- Self-hosted variable fonts: Sora (display), Google Sans Flex (UI/body), Google Sans Code (mono)
- Icons from Google Material Symbols (Outlined, weight 300)
- On-load reveal animations; `prefers-reduced-motion` respected

## Getting started
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

Best viewed in a window ≥ 1920px wide (the design canvas); it scales down proportionally
on smaller desktop windows.
