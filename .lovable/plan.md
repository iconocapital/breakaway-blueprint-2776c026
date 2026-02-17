
# Breakaway Blueprint™ — Independence Readiness Assessment

A premium 42-question diagnostic assessment for financial advisors evaluating independence, rebuilt with modern minimal design, payment gating, and a comprehensive visual results report.

## Flow Overview
**Landing Page → Assessment (42 questions) → Payment Gate ($349 Stripe) → Lead Capture → Comprehensive Results Report**

---

## 1. Landing Page
- Clean, modern minimal design with generous whitespace and subtle entrance animations
- Hero section with clear value proposition and pricing badge
- "What you'll receive" feature grid
- Consultant bios (Chris & Jonathan) in elegant cards
- CTA button to begin the assessment

## 2. Assessment Experience (42 Questions)
- One question per screen with smooth slide transitions
- Progress bar showing completion (e.g., "12 / 42")
- Multiple-choice cards with hover states and selection animations
- Slider input for the comfort-with-volatility question (Q29)
- Section labels showing which dimension is being evaluated
- Keyboard navigation support (number keys, Enter, Backspace)
- Back button to revisit previous questions
- Mobile-responsive layout

## 3. Stripe Payment Gate ($349)
- After completing all 42 questions, users see a payment screen
- Summary of what they're unlocking (full report with charts, benchmarks, PDF)
- Stripe checkout integration for $349 one-time payment
- Upon successful payment, proceed to lead capture

## 4. Lead Capture Form
- Clean form collecting: Name, Email, Phone (optional), Firm (optional)
- Form validation with clear error states
- On submission: sends email notification with all answers, scores, and tier classification (via edge function email service)
- Proceed to full results report

## 5. Comprehensive Results Report
- **Overall Readiness Score** — large circular gauge with percentage and tier label (High Readiness / Moderate / Early Stage / Not Yet Ready)
- **Radar Chart** — visual spider/radar chart showing performance across all 9 dimensions at a glance
- **Dimension Breakdown Cards** — for each of the 9 sections:
  - Bar showing score percentage with color coding (green/yellow/orange/red)
  - Personalized recommendation text based on their score tier
- **Comparison Benchmarks** — show how their scores compare to "average advisor" baselines across key dimensions
- **90-Day Priority Roadmap** — top 3 action items based on their weakest areas
- **Primary Gap Identification** — callout highlighting their single biggest vulnerability
- **PDF Download** — button to generate and download a branded PDF report with all charts and recommendations
- **CTA** — contextual call-to-action based on their tier (e.g., "Schedule Your Readiness Audit" for high readiness)

---

## Design Direction: Modern Minimal
- Clean white backgrounds with subtle gray borders
- Professional typography (keeping Outfit + Newsreader fonts)
- Ample whitespace and breathing room
- Subtle, purposeful animations (fade-ins, smooth transitions)
- Color-coded scoring: green → yellow → orange → red
- Cards with light shadows and rounded corners
- Mobile-first responsive design throughout
