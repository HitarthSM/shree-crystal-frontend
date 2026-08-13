# Frontend Design System
**Shree Crystal Co-op Credit and Consumers Society Limited**

## Design direction

The signature idea: **the passbook ledger row.** Every member already has a mental model for this — a ruled page, a stamped entry, a running balance in the right-hand column. The interface translates that object into the digital product instead of borrowing a generic SaaS-dashboard look. Ink-navy is the dominant surface (the passbook cover), ledger-paper cream is where content lives (the page), brass gold marks the accents and the literal "stamp" confirmation moment. This is deliberately not a bright fintech-blue gradient look — the audience is trusting a community institution with real money, and the visual language should feel like an institution, not a startup.

Spend the one real risk on the stamped-confirmation motion (Section 8). Everything else stays quiet and disciplined.

---

## 1. Color

| Token | Hex | Role |
|---|---|---|
| `ink-navy` | `#16283D` | Primary surface — header, footer, hero, admin sidebar |
| `ledger-paper` | `#F5EFE0` | Content background — cards, main content area |
| `brass` | `#B8862E` | Accent — CTAs, links, active states, the stamp motif |
| `banyan-green` | `#2E5B45` | Positive/success — active status, published, resolved |
| `stamp-red` | `#A13D2E` | Alerts — urgent notices, errors, suspended status |
| `charcoal` | `#2A2822` | Body text on ledger-paper surfaces |

Usage rule: **navy and paper never compete for dominance on the same screen.** Public/marketing sections (landing hero, footer) lean navy-dominant; in-app screens (dashboards, statements) lean paper-dominant with navy reserved for the header/nav bar. Brass is a genuine accent — used for maybe 5% of any given screen (primary button, active tab, the stamp), never as a background fill.

Contrast check before shipping any pairing: `charcoal` on `ledger-paper` and `ledger-paper` on `ink-navy` both need to clear WCAG AA (4.5:1) — both do at these values, but re-check if you adjust either.

---

## 2. Typography

| Role | Typeface | Where |
|---|---|---|
| Display | **Zilla Slab** (Semibold/Bold) | Headlines, section titles, the society name in the header |
| Body | **IBM Plex Sans** (Regular/Medium) | All UI text, body copy, labels, buttons |
| Data | **IBM Plex Mono** (Regular/Medium) | Member IDs, statement amounts, dates, anything tabular |

Why this pairing: Zilla Slab's sturdy, slightly engraved character reads like stamped/embossed lettering — institutional without being cold. IBM Plex Sans is highly legible at small sizes (important for older members) without being the generic Inter/Helvetica-everywhere default. Plex Mono gives every number a ledger-column feel — statement amounts and balances should visually align like a real passbook, which tabular figures make possible.

**Type scale** (rem, 16px base):
```
display-lg   3rem / 1.1     Zilla Slab Bold      — landing hero only
display-md   2rem / 1.15    Zilla Slab Semibold  — section headings
display-sm   1.5rem / 1.2   Zilla Slab Semibold  — card/page titles
body-lg      1.125rem / 1.5 Plex Sans Regular     — intro paragraphs
body         1rem / 1.5     Plex Sans Regular     — default UI text
body-sm      0.875rem / 1.4 Plex Sans Regular     — captions, meta
data-lg      1.25rem / 1.3  Plex Mono Medium      — balance figures
data         0.9375rem / 1.4 Plex Mono Regular    — table/ledger rows
```
Minimum body text anywhere in the member-facing app: 16px. Don't go smaller for "clean" UI reasons — this app has real older users.

---

## 3. The signature element: stamped ledger rows

Every statement, notice, and activity-log entry renders as a **ledger row**, not a generic card:
- A thin bottom rule (`border-bottom: 1px solid`, low-opacity charcoal) instead of a boxed card — pages of rows read as a ledger, not a stack of cards.
- Amount/date/ID columns right-align in `Plex Mono`, matching a real passbook's column layout.
- A small circular **stamp mark** (brass-gold ring, ~20px) sits to the left of any row with a confirmed/published/resolved status — a literal visual echo of a rubber stamp, used only for genuine state confirmations (published statement, resolved query), never decoratively.

This one pattern — ruled row + mono column + stamp mark — is the thread that ties Statements, Notices, Activity Log, and even the Members list together, instead of each screen inventing its own card style.

---

## 4. Spacing & Layout

- 8px base grid — all padding/margin values are multiples of 8 (Tailwind's default scale already aligns to this).
- Border radius: **small and consistent — 6px on cards/inputs, 4px on buttons/badges.** Not the trendy 20px+ blob-rounded look; a passbook has edges, not bubbles.
- Elevation: avoid heavy drop shadows. Where a card needs to lift off the page, use a **1px border + a very subtle single-direction shadow** (like a slightly raised paper edge), not a glossy floating-card shadow.
- Max content width: 1200px for admin tables/lists, 720px for reading-width content (notices, about page copy).

---

## 5. Iconography

- Line icons throughout the UI (Lucide, already available in this environment) — 1.5px stroke weight, never filled, for a consistent "drawn" quality that pairs with the slab-serif headlines.
- The one exception is the brass stamp mark (Section 3) — that's the single filled/solid graphic element in the whole system, which is exactly why it reads as significant rather than decorative.
- Every icon-only button gets a text label on hover/tooltip and an `aria-label` — never icon-only with no accessible name.

---

## 6. Animation & Motion

Restraint is the point — this is an institution people trust with money, not a product demo.

- **The one deliberate moment:** when an admin action completes (statement published, notice sent, query resolved), the brass stamp mark animates in with a quick, slightly weighted drop-and-settle (150ms ease-out scale from 1.15→1, plus a subtle rotate of a few degrees) — like a stamp coming down. This is the single orchestrated animation in the whole app; don't dilute it by reusing the effect elsewhere.
- Everything else is fast and functional: 120–150ms ease-out for hovers, focus rings, and tab switches. No page-transition choreography, no parallax, no scroll-triggered reveals on a financial dashboard — those read as decoration, not function, in this context.
- Loading states: skeleton rows using the ledger-row shape (thin rule + shimmering mono-column blocks), not generic spinners — keeps the "ledger" metaphor intact even while loading.
- **Respect `prefers-reduced-motion`** everywhere, including the stamp animation — fall back to an instant state change, no exceptions.

---

## 7. Component states

Every interactive element needs all of these defined, not just default + hover:
- **Default / Hover / Active / Focus** (visible focus ring — 2px brass outline, offset 2px — required for keyboard navigation, non-negotiable given this handles financial data)
- **Disabled** (reduced opacity, no pointer events, still meets 3:1 contrast for text so it's readable, not invisible)
- **Error** (stamp-red border + inline message below the field, never color alone — pair with an icon or text, for colorblind accessibility)
- **Loading** (button shows a small inline spinner + disables itself, never a silent frozen click)

---

## 8. Accessibility floor (non-negotiable, not aspirational)

- WCAG AA contrast minimum on all text/background pairings.
- Every form input has a visible label (not placeholder-as-label).
- Full keyboard navigability — tab order follows visual order, every action reachable without a mouse.
- Touch targets minimum 44×44px on mobile — real constraint given the older member base.
- `prefers-reduced-motion` respected globally.

---

## 9. Responsive breakpoints

```
sm   640px   — large phones
md   768px   — tablets / admin on iPad
lg   1024px  — small laptops
xl   1280px  — admin desktop (tables get full column set)
```
Design mobile-first: member-facing screens are built for `sm` first and enhanced upward, since most members will use this from a phone. Admin screens can assume `md`+ as the primary target but must not break below it.

---

## 10. Tailwind config (starting point)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'ink-navy': '#16283D',
        'ledger-paper': '#F5EFE0',
        brass: '#B8862E',
        'banyan-green': '#2E5B45',
        'stamp-red': '#A13D2E',
        charcoal: '#2A2822',
      },
      fontFamily: {
        display: ['"Zilla Slab"', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        data: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        btn: '4px',
      },
    },
  },
};
```
Load all three font families via `@fontsource` packages (self-hosted, not a Google Fonts CDN call) so the site doesn't depend on an external font host at runtime.

---

*This system feeds directly into the section-wise frontend build prompts — every prompt below assumes these tokens exist and references them by name rather than restating hex values each time.*
