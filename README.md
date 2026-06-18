# Tomo School OS

A high-fidelity **UI/UX prototype** of the operating system for *Tomo School* — an AI-native
K–12 school whose mission is to help every child find their **Mojo**. This is a front-end-only
mock: no backend, no real AI, no auth. Every screen renders from a typed, centralized
**seed-data layer** populated with believable (fictional) Indian school data, so it can be
"filled in" or swapped for a real backend later.

> Built from three source briefs — the Broad Concept, the PRD Overview, and the Tech
> Architecture PRD — as a design-first prototype that precedes implementation.

## The six surfaces

Open `/` (the OS launcher) and step into any interface — each is a view onto one shared
stack, shaped for one person's job:

| Surface | Who | The job |
| --- | --- | --- |
| **Teacher OS** | Ms. Lakshmi Krishnan | The daily driver — week · block-prep (the hero) · class-health · capture · PATH blocks |
| **Executive Coach** | Rohan D'Souza | The sense-maker — caseload · student 360 · check-ins · insight digest |
| **Principal OS** | Dr. Meera Nambiar | The cockpit — school health · scalability · compliance · early-warning |
| **Parent App** | Shobha Iyer | Honest, month-on-month growth (mobile) |
| **Student AI Tutor** | Mahira Qureshi (Class 6) | A guard-railed self-work partner (mobile) |

A worked story threads through every surface: **Riya Iyer**'s equivalent-fractions gap — the
root cause of her addition errors — surfaced as the teacher's *one move*, walked back on the
competency map, explained honestly to her parent, and contextualised by her coach.

## Design language

"Calm Editorial / Premium Institutional" — warm paper canvas, a literary serif (Fraunces) for
display over a clean grotesque (Inter) for UI and a mono (Geist Mono) for data, a single
restrained indigo accent with a sparing saffron "Mojo" spark, hairline borders, soft shadows,
and gentle motion. The UI embodies the product's six non-negotiable rules — most of all
**"one move, not a to-do list: calm surface, depth one tap away."**

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (CSS-first tokens) ·
framer-motion · bespoke SVG data-viz · lucide-react.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run lint     # eslint
```

## Project structure

```
app/         routes — one folder per persona (+ the OS launcher at /)
components/  ui · shell · patterns · viz
data/        the typed seed-data layer (the only place facts live)
lib/         utils, design-status helpers, nav + icon config
```

## Note

All students, families, educators, and metrics are **fictional but representative** of an
Indian CBSE context. This is a design prototype, not a production system.
