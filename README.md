# Giraffe360 Website Prototype — Photographer program v2

A responsive, 1:1 front-end prototype of the Giraffe360 marketing site, built from the
Figma design (`giraffe_website_design_v1`). Vite + React, desktop-first (1920px design
canvas, scaled to fit narrower windows).

## Pages
- `/` — Home (hero, trusted-by logo marquee, horizontal-scroll feature gallery,
  scroll-linked "How it works" accordion, testimonials, AI tools, video carousel, CTA band, footer)
- `/pricing` — Pricing (Agent / Photographer toggle, billing toggle + plan cards, sticky-header
  comparison table, FAQ accordion). In Photographer mode the Content Studio & Camera card becomes
  "$0 / photographers program" with an Apply modal.
- `/photographer-program` — Photographer Partner Program landing page (US / Canada) with the
  application form, "How the program works" and FAQ.

## Photographer program flow (prototype)
Clickable end to end; state lives in `sessionStorage` (`ProgramContext`), so every route can also be
opened directly with demo defaults.

1. `/photographer-program` or `/pricing` (Photographer → Apply) — application form → confirmation
2. `/email/approved` — mock approval email from customer support (prototype-only page)
3. `/signup/login` — Content Studio log in (email prefilled from the link) → `/signup/code` — email code (any 6 digits)
4. `/signup/order` — card on file ($0), delivery and billing address (comes first: the order starts the program)
5. `/signup/workspace` — new accounts only: name the workspace (everything else is known from the application)
6. `/studio/organisation/photographer-program` — Organisation settings → Photographer program tab (replaces Billing; day-one state)
7. `/studio/projects` — Content Studio dashboard, example project page

The site header "Log in" opens the same Content Studio log-in; once the camera is ordered it goes
straight to the Photographer program tab.

### Existing accounts (in-app upgrade)
The prototype map (yellow dot, top-left) switches the account type: new user (website path), demo
account (Free, no Billing tab; upgrades only via the sidebar's Manage plan) or Content Studio Plus
(paid; Organisation settings → Billing → Manage plan). `/studio/plan` shows the same Agent /
Photographer split as the website; Apply opens the application form prefilled from the account.
After the approval email, the log-in goes to the camera order; existing accounts skip the workspace step.
Once the camera is ordered, Photographer program replaces Billing in Organisation settings.

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
