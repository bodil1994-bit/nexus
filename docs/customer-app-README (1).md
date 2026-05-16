# Handoff: VeloPort — Digital Product Passport

## Overview

VeloPort is a consumer-facing **Digital Product Passport (DPP)** for e-bike
batteries, designed to comply with **EU Regulation 2023/1542** (mandatory from
18 February 2027).

The target user is an ESG-conscious 30-year-old standing in a bike shop and
choosing between several e-bikes. The product surfaces social-responsibility,
sourcing, emissions and end-of-life data in a Yuka / Nutri-Score style — at a
glance, never as a compliance dashboard.

Two screens:

1. **Bike overview** — emotional anchor. Hero shot of the bike + four
   component-passport cards (Frame · Battery · Wheels · Motor). Only Battery
   is interactive in this prototype.
2. **Battery passport** — the full transparency story in three sections:
   ESG flags → Vienna recycling network → 10-category deep-dive accordion.

## About the Design Files

The HTML files in this bundle are **design references** — high-fidelity
prototypes that show the intended look, behavior, copy and data.
**They are not production code to copy directly.**

The task is to **recreate these designs in the target codebase's environment**
— using the team's existing patterns, components, design tokens, routing and
icon library — or, if no codebase exists yet, to pick the most appropriate
framework (we'd suggest **Next.js + Tailwind + shadcn/ui + lucide-react**) and
implement them there.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, data points and
interactions are all locked. Reproduce pixel-perfectly within the target
codebase's component primitives.

## Files in this Bundle

```
design_handoff_digital_passport/
├── README.md                         (this file)
├── TransparentRide.html              (entry point — open this in a browser)
└── src/
    ├── icons.jsx                     (~30 Lucide-style inline SVG icons)
    ├── data.jsx                      (grade scale, all content, location data)
    ├── components.jsx                (GradePill, Pennant, OutcomeCard, Toast, etc.)
    ├── page-bike.jsx                 (Page 1 — bike overview)
    ├── page-battery.jsx              (Page 2 — battery passport)
    └── app.jsx                       (Root App + page routing)
```

The prototype is plain React 18 via Babel-in-the-browser + Tailwind CDN. There
is no build step.

## Tech Stack (Prototype vs Suggested Production)

| Concern | Prototype | Suggested production |
|---|---|---|
| Framework | React 18 via inline Babel | Next.js 14 App Router (or your stack) |
| Styling | Tailwind v4 CDN, utility classes | Tailwind + design tokens |
| Icons | Inline SVG (Lucide-style) | `lucide-react` |
| Routing | `useState('bike' \| 'battery')` | Real routes: `/bike/[id]` and `/bike/[id]/battery` |
| State | `useState` only — no storage | Same client-state shape is fine |
| Data | Hard-coded in `data.jsx` | Fetched from the DPP backend / EU Battery Pass API |
| Fonts | Instrument Serif + Inter Tight | Same (self-host via `next/font`) |

## Design Tokens

### Type

- **Display**: `Instrument Serif`, weight 400 — used for headlines, card titles,
  data values. Slight negative tracking (`letter-spacing: -0.005em` to `-0.01em`).
- **Body**: `Inter Tight`, weights 300–700 — UI, captions, body text.
- A `.caps` utility class applies `text-transform: uppercase` +
  `letter-spacing: 0.14em` for small labels.

Typical sizes (mobile, 448px container):
- Card headlines / display values: 17–22 px
- Section headlines: 26–28 px
- Body: 12.5 px
- Captions / data labels (caps): 9–10.5 px

### Color — Grade Scale (the core)

This 5-stop scale is the only saturated color in the system. All other UI is
stone-neutral.

| Grade | Hex (foreground / pill) | Soft (bg) | Ring | Meaning |
|---|---|---|---|---|
| **A** | `#166534` | `#dcfce7` | `#bbf7d0` | Excellent |
| **B** | `#65a30d` | `#ecfccb` | `#d9f99d` | Good |
| **C** | `#ca8a04` | `#fef9c3` | `#fde68a` | Average |
| **D** | `#ea580c` | `#ffedd5` | `#fed7aa` | Weak |
| **E** | `#991b1b` | `#fee2e2` | `#fecaca` | Critical |

### Color — Neutrals

Tailwind `stone` scale throughout. Page background `bg-stone-100/50`, cards
`bg-white`, borders `border-stone-200/60` to `/70`, body text `text-stone-900`,
captions `text-stone-500`, dividers `bg-stone-100`.

### Recycling location-type palette

- Buy-back: `#166534`
- Repair: `#ca8a04`
- Authorised: `#0c4a6e`
- Recycle: `#1e40af`

### Radii

- Cards: `rounded-2xl` (16 px), `rounded-3xl` (24 px) for hero/large cards
- Pills/chips: `rounded-full`
- Small icon tiles / inner tiles: `rounded-xl` (12 px)

### Spacing & Layout

- **Mobile-first**, fixed `max-w-md` (~448 px) container centered on a soft
  stone-100 surface — the page should feel like a phone preview.
- Section vertical rhythm: `space-y-10` between top-level sections,
  `space-y-7` inside the bike-overview screen.
- Side padding on the mobile container: `px-5`.
- Card inner padding: `p-5` to `p-7`.

### Motion

- Section fade-in: ~400 ms with 60 ms staggered delay (`fadeUp` keyframe —
  `translateY(8px) → 0`, opacity `0 → 1`, easing
  `cubic-bezier(0.22, 1, 0.36, 1)`).
- Page transition: same fade-in re-runs on `page` change. `window.scrollTo` to
  top with `behavior: 'smooth'`.
- Accordion expand: 220 ms fadeUp.
- Hover transitions: 200 ms color/border.

### Touch targets

Minimum 36 px (`minHeight: 36`); main interactive cards 88–92 px tall.

## Components

### `GradePill` (`components.jsx`)

Filled colored square with bold white letter. Four sizes:

| size | box | font | radius |
|---|---|---|---|
| `sm` | 28 px | 14 | 8 |
| `md` | 36 px | 18 | 10 |
| `lg` | 56 px | 28 | 14 |
| `xl` | 80 px | 42 | 18 |

`lg` and `xl` get a colored soft shadow:
`0 6px 16px -8px <grade>66`.

### `Pennant` (flag chip — `components.jsx`)

Tinted light chip with a 1.5-px color dot, no fill until tapped (active state
is solid color, white text). Uses `clip-path: polygon(...)` to cut the
right-side pennant tip. Borders match the dot color when inactive.

### `OutcomeCard` (3-card row — `components.jsx`)

White card, dot + caps label, then large display number, sub-text below. No
icon tile.

### `BrandRow`, `HeroPhoto`, `ComponentCard` (`page-bike.jsx`)

`ComponentCard` is the cell of the four-card list on Page 1. The Battery card
sits on a clean white background; the other three sit on `bg-white/60`. Each
shows: `GradePill (lg)` · name (caps) · `Soon` badge if unavailable ·
display-font headline · subtext · chevron only on the available one.

### `BatteryHeader` (`page-battery.jsx`)

White card with: caps label `Battery passport` · display title
`Bosch PowerTube 625 Wh` · specs row · `GradePill (lg) C` to the right · hairline
divider · summary paragraph.

### `FlagsSection`, `Pennant` group, detail card (`page-battery.jsx`)

10 pennants in `flex-wrap`: 5 green first, then 5 red. Only one tap-detail
card is open at a time; it appears below the wrap.

### `RecyclingSection`, `ViennaMap`, `LocationDetail` (`page-battery.jsx`)

- 3-up outcome cards (Sell / Repair / Recycle).
- Inline SVG Vienna map in Google-Maps style (warm beige land, blue Danube,
  green Wienerwald, yellow A22 motorway, white residential roads, dashed
  city outline + Ringstrasse).
- Animated "You are here" pulse at Stockerau (175, 95).
- 5 teardrop pins, color-coded by type, with drop shadow and white dot.
- Detail card for selected location + 2×2 grid of the other 4 below.

### `DeepDiveSection`, `CategoryRow` (`page-battery.jsx`)

10 collapsible rows, sorted **best → worst** (A on top, E at bottom). Each
row: stone icon tile · title (display) · summary · `GradePill (md)` · chevron.
Expanded body: hairline divider, then point list where each point has:
- Thin 1×36 colored bar (the grade color)
- Caps label
- Display value
- Reference benchmark text
- `GradePill (sm)` on the right

### `WhyFooter` (`page-battery.jsx`)

Dark `bg-stone-900` card, caps label, display headline, body paragraph,
divider, brand wordmark + version.

### `Toast` (`components.jsx`)

Auto-dismissing centered pill, 2.4 s. Triggered when tapping a non-available
component card on Page 1.

## Interactions & Behavior

State, all `useState`, no browser storage:

| Variable | Type | Notes |
|---|---|---|
| `page` | `'bike' \| 'battery'` | Top-level screen |
| `toast` | `string \| null` | Shown when tapping unavailable component |
| `activeIdx` | `number \| null` | Open flag pennant |
| `selectedId` | `string` (location id) | Selected Vienna location, default `'ad'` |
| `expanded` | `string \| null` (category id) | Open accordion row |

Rules:
- Tap Battery card → `setPage('battery')`.
- Tap any other component card → toast `"<Name> passport — coming soon"`.
- Back arrow → `setPage('bike')` and reset `activeIdx`/`expanded`.
- `useEffect` on `page` → `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- Only one flag detail open at a time. Tapping the same one closes it.
- Only one accordion category open at a time.
- Toast auto-dismisses after 2400 ms.

## Content

All copy and data is in `src/data.jsx`:

- `COMPONENT_PASSPORTS` — Page 1 four-card data (Frame B, Battery C, Wheels B, Motor A).
- `FLAGS` — the 10 ESG flags (5 green, 5 red) with `keyword` and `detail`.
- `VIENNA_LOCATIONS` — 5 Vienna locations with `x/y` for the SVG map.
- `CATEGORIES` — the 10 deep-dive categories, each with 3–5 data points
  including reference benchmarks for comparability.

For production, this data should come from the DPP backend. The shape of each
record is preserved by the prototype — drop in a fetch + match the keys.

## Assets

- **Hero photo** — KTM Macina Sport 720 (machine grey / black-orange) from
  e-action.at. For production, **replace with a licensed product asset**
  (e.g. licensed press image from the OEM). The standalone export ships with
  a generic Unsplash stand-in because the original host blocks hotlinking.
- **Icons** — Lucide-style inline SVGs in `icons.jsx`. In production, swap to
  `lucide-react`.
- **Map** — fully inline SVG, no external tile provider. For production with
  many locations, consider Mapbox / MapLibre vector tiles with a custom
  light style.

## Accessibility Notes

- All flag pennants are `<button aria-pressed>`. Map pin groups have
  cursor + onClick.
- Min 36 px touch targets; primary interactive cards 88–92 px.
- Color is **never** the only signal — every grade carries a letter, and
  every flag pennant carries a dot + textual keyword.
- Add proper focus rings (`focus-visible:ring-2 ring-stone-900/20`) when
  porting — the prototype omits them.

## Suggested Production Cleanup

1. Real routing instead of `useState('page')`.
2. Split copy from layout — move `data.jsx` to a typed schema (Zod) and load
   from the DPP API.
3. Use `lucide-react` for icons.
4. Self-host fonts via `next/font` for performance and offline.
5. Add proper focus rings + skip-to-content link.
6. Replace `cdn.tailwindcss.com` / `@tailwindcss/browser` with the real
   Tailwind build.
7. Internationalize copy. The prototype UI is English; the EU regulation
   itself requires consumer info in the language of the member state.
8. Replace the placeholder hero with a licensed bike photo.

---

*Generated as a developer handoff. Open `TransparentRide.html` directly in a
browser to preview the live prototype.*
