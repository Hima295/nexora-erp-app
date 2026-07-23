# Nexora ERP Design System
## Part 1: Visual Foundations
### Version 1.0 — Official Design Language

---

## 1. Brand Identity

### 1.1 Visual Personality

Nexora ERP is the intelligent operational layer for automotive spare parts enterprises. The interface must feel like a **precision instrument** — every element serves a purpose, nothing is decorative without reason.

**The Nexora interface should feel:**

- **Professional** — Enterprise-grade credibility in every pixel
- **Elegant** — Refined proportions, sophisticated restraint
- **Premium** — Luxurious without being ostentatious
- **Executive** — Designed for decision-makers who command respect
- **Minimal** — Maximum signal, minimum noise
- **Modern** — Contemporary language that avoids trend-chasing
- **Fast** — Visually responsive, no sluggish interactions
- **Clean** — Uncluttered spaces that invite focus
- **Comfortable** — Easy on the eyes during extended operational sessions
- **Trustworthy** — Stable, reliable, and predictable
- **Intelligent** — UI that anticipates before you ask

### 1.2 Brand Essence

**"Precision meets intelligence."**

Nexora Pulse is the heartbeat of the automotive spare parts enterprise. The design language should evoke:

- The engineering precision of German automotive manufacturing
- The intelligence of a modern AI command center
- The calm confidence of an executive dashboard
- The clarity of a luxury sedan's instrument cluster

### 1.3 Design Principles

1. **Function First, Form Follows** — Every visual choice must serve a functional purpose
2. **Breathing Room** — Generous whitespace creates clarity and premium feel
3. **Subtle Motion** — Animations inform, not entertain
4. **Consistent Rhythm** — Predictable patterns reduce cognitive load
5. **Arabic-First Bilingual** — IBM Plex Sans Arabic and Inter create harmonious bilingual harmony
6. **Accessible Luxury** — Premium feel without sacrificing usability or accessibility
7. **Timeless Over Trendy** — Designed to look appropriate for a decade, not just this year

---

## 2. Color System

### 2.1 Color Philosophy

Nexora's palette draws inspiration from automotive twilight — deep, sophisticated, and intentional. The primary spectrum combines **Deep Sapphire** (trust, intelligence) with **Cardinal Amber** (energy, automotive heritage). Together they create a unique identity that feels neither generic-blue nor aggressive-red.

### 2.2 Primary Palette — Deep Sapphire

The primary color represents intelligence, trust, and depth.

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `--nex-primary-50` | `#EFF6FF` | `239, 246, 255` | Tint backgrounds, active tint states |
| `--nex-primary-100` | `#DBEAFE` | `219, 234, 254` | Light backgrounds, subtle highlights |
| `--nex-primary-200` | `#BFDBFE` | `191, 219, 254` | Borders, dividers, hover borders |
| `--nex-primary-300` | `#93C5FD` | `147, 197, 253` | Secondary icons, helper elements |
| `--nex-primary-400` | `#60A5FA` | `96, 165, 250` | Tertiary text, muted accents |
| `--nex-primary-500` | `#3B82F6` | `59, 130, 246` | **Primary brand color** — links, active states |
| `--nex-primary-600` | `#2563EB` | `37, 99, 235` | Primary buttons, key actions |
| `--nex-primary-700` | `#1D4ED8` | `29, 78, 216` | Primary hover, pressed states |
| `--nex-primary-800` | `#1E40AF` | `30, 64, 175` | Dark surfaces, headers |
| `--nex-primary-900` | `#1E3A8A` | `30, 58, 138` | Deep backgrounds, dark mode core |
| `--nex-primary-950` | `#172554` | `23, 37, 84` | Darkest surfaces, near-black |

**Primary Application Rules:**
- `--nex-primary-600` is the **single primary action color** across the entire platform
- `--nex-primary-500` for interactive text elements (links, active nav)
- `--nex-primary-50` through `--nex-primary-100` for tinted backgrounds
- Never use `--nex-primary-900` or `--nex-primary-950` as text color on light backgrounds

---

### 2.3 Secondary Palette — Cardinal Amber

Warm, automotive-inspired energy. Used for highlights, AI features, and premium accents.

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `--nex-secondary-50` | `#FFF7ED` | `255, 247, 237` | Light tint backgrounds |
| `--nex-secondary-100` | `#FFEDD5` | `255, 237, 213` | Subtle backgrounds, warm tint |
| `--nex-secondary-200` | `#FED7AA` | `254, 215, 170` | Warm borders, dividers |
| `--nex-secondary-300` | `#FDBA74` | `253, 186, 116` | Secondary icons, warm accents |
| `--nex-secondary-400` | `#FB923C` | `251, 146, 60` | Accent highlights |
| `--nex-secondary-500` | `#F97316` | `249, 115, 22` | **Secondary brand color** — AI features, warnings |
| `--nex-secondary-600` | `#EA580C` | `234, 88, 12` | Secondary buttons, warm CTAs |
| `--nex-secondary-700` | `#C2410C` | `194, 65, 12` | Secondary hover states |
| `--nex-secondary-800` | `#9A3412` | `154, 52, 18` | Dark warm surfaces |
| `--nex-secondary-900` | `#7C2D12` | `124, 45, 18` | Deep warm backgrounds |
| `--nex-secondary-950` | `#431407` | `67, 20, 7` | Darkest warm surfaces |

**Secondary Application Rules:**
- `--nex-secondary-500` reserved for **AI features**, Nexora Pulse highlights, and premium accent elements
- `--nex-secondary-600` for warm action buttons
- Used **sparingly** — Cardinal Amber should surprise, not overwhelm
- Never pair primary blue and secondary orange at full saturation on the same element

---

### 2.4 Accent — Electric Teal

A vibrant accent for interactive elements and AI intelligence indicators.

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `--nex-accent-50` | `#F0FDFA` | `240, 253, 250` | Light tint |
| `--nex-accent-100` | `#CCFBF1` | `204, 251, 241` | Subtle backgrounds |
| `--nex-accent-400` | `#2DD4BF` | `45, 212, 191` | Accent icons, highlights |
| `--nex-accent-500` | `#14B8A6` | `20, 184, 166` | **Accent color** — AI active states, live indicators |
| `--nex-accent-600` | `#0D9488` | `13, 148, 136` | Accent buttons, active AI elements |

**Accent Application Rules:**
- Use exclusively for **AI-related** indicators and Nexora Pulse live states
- Paired with deep sapphire backgrounds for high contrast
- Never used as a primary action color

---

### 2.5 Semantic Colors

#### Success — Emerald Growth

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-success-50` | `#ECFDF5` | Light success backgrounds |
| `--nex-success-100` | `#D1FAE5` | Tint backgrounds |
| `--nex-success-200` | `#A7F3D0` | Success borders |
| `--nex-success-400` | `#34D399` | Success icons |
| `--nex-success-500` | `#10B981` | **Success primary** — confirmations, positive trends |
| `--nex-success-600` | `#059669` | Success buttons |
| `--nex-success-700` | `#047857` | Success hover |

**Purpose:** Profit margins, inventory health, confirmed actions, successful operations.

---

#### Warning — Amber Caution

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-warning-50` | `#FFFBEB` | Light warning backgrounds |
| `--nex-warning-100` | `#FEF3C7` | Tint backgrounds |
| `--nex-warning-200` | `#FDE68A` | Warning borders |
| `--nex-warning-400` | `#FBBF24` | Warning icons |
| `--nex-warning-500` | `#F59E0B` | **Warning primary** — attention needed |
| `--nex-warning-600` | `#D97706` | Warning buttons |
| `--nex-warning-700` | `#B45309` | Warning hover |

**Purpose:** Low stock alerts, pending approvals, forecast variances, attention indicators.

---

#### Danger — Cardinal Alert

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-danger-50` | `#FEF2F2` | Light danger backgrounds |
| `--nex-danger-100` | `#FEE2E2` | Tint backgrounds |
| `--nex-danger-200` | `#FECACA` | Danger borders |
| `--nex-danger-400` | `#F87171` | Danger icons |
| `--nex-danger-500` | `#EF4444` | **Danger primary** — errors, critical alerts |
| `--nex-danger-600` | `#DC2626` | Danger buttons |
| `--nex-danger-700` | `#B91C1C` | Danger hover |

**Purpose:** Stockouts, payment failures, system errors, destructive actions.

---

#### Info — Sky Clarity

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-info-50` | `#EFF6FF` | Light info backgrounds |
| `--nex-info-100` | `#DBEAFE` | Tint backgrounds |
| `--nex-info-200` | `#BFDBFE` | Info borders |
| `--nex-info-400` | `#60A5FA` | Info icons |
| `--nex-info-500` | `#3B82F6` | **Info primary** — informational content |
| `--nex-info-600` | `#2563EB` | Info buttons |
| `--nex-info-700` | `#1D4ED8` | Info hover |

**Purpose:** Help text, neutral notifications, tips, contextual information.

---

### 2.6 Neutral Palette — Titanium Gray

Warm, sophisticated grays that avoid the coldness of pure digital gray.

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `--nex-neutral-50` | `#FAFAFA` | `250, 250, 250` | Lightest backgrounds |
| `--nex-neutral-100` | `#F5F5F5` | `245, 245, 245` | Page backgrounds |
| `--nex-neutral-200` | `#E5E5E5` | `229, 229, 229` | Borders, dividers |
| `--nex-neutral-300` | `#D4D4D4` | `212, 212, 212` | Subtle borders |
| `--nex-neutral-400` | `#A3A3A3` | `163, 163, 163` | Disabled text, placeholders |
| `--nex-neutral-500` | `#737373` | `115, 115, 115` | Secondary text, captions |
| `--nex-neutral-600` | `#525252` | `82, 82, 82` | Body text, labels |
| `--nex-neutral-700` | `#404040` | `64, 64, 64` | Headings, emphasis |
| `--nex-neutral-800` | `#262626` | `38, 38, 38` | Primary headings |
| `--nex-neutral-900` | `#171717` | `23, 23, 23` | Highest emphasis text |
| `--nex-neutral-950` | `#0A0A0A` | `10, 10, 10` | Near-black, maximum contrast |

**Neutral Philosophy:**
- Warm undertones prevent the "cold clinical" feel
- `--nex-neutral-50` is the default page background
- `--nex-neutral-900` is the default heading color
- Never use pure black (`#000000`) or pure white (`#FFFFFF`) as primary surfaces

---

### 2.7 Surface Colors

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-surface-background` | `#FAFAFA` | Main page background |
| `--nex-surface-elevated` | `#FFFFFF` | Cards, modals, dropdowns, elevated panels |
| `--nex-surface-sunken` | `#F5F5F5` | Recessed areas, input backgrounds |
| `--nex-surface-overlay` | `rgba(10, 10, 10, 0.6)` | Modal backdrops, overlay screens |
| `--nex-surface-glass` | `rgba(255, 255, 255, 0.72)` | Glassmorphism effects (use sparingly) |

---

### 2.8 Border Colors

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-border-default` | `#E5E5E5` | Default input borders, card borders |
| `--nex-border-subtle` | `#F0F0F0` | Almost-invisible dividers |
| `--nex-border-strong` | `#D4D4D4` | Emphasized borders, active dividers |
| `--nex-border-focus` | `#3B82F6` | Focus rings, keyboard navigation |
| `--nex-border-error` | `#EF4444` | Error state borders |
| `--nex-border-success` | `#10B981` | Success state borders |

---

### 2.9 Interactive State Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--nex-hover-bg` | `#F5F5F5` | Button hover, row hover, dropdown hover |
| `--nex-hover-text` | `#171717` | Hover state text color |
| `--nex-selected-bg` | `#EFF6FF` | Selected row, active tab, active nav item |
| `--nex-selected-text` | `#1D4ED8` | Selected state text |
| `--nex-selected-border` | `#BFDBFE` | Selected item left border |
| `--nex-disabled-bg` | `#F5F5F5` | Disabled button background |
| `--nex-disabled-text` | `#A3A3A3` | Disabled text |
| `--nex-disabled-border` | `#E5E5E5` | Disabled border |

---

### 2.10 Text Colors

| Token | HEX | Usage |
|-------|-----|-------|
| `--nex-text-primary` | `#171717` | Primary text, headings, body |
| `--nex-text-secondary` | `#525252` | Secondary text, descriptions |
| `--nex-text-tertiary` | `#737373` | Tertiary text, captions, timestamps |
| `--nex-text-disabled` | `#A3A3A3` | Disabled labels, placeholders |
| `--nex-text-inverse` | `#FFFFFF` | Text on primary/danger/success buttons |
| `--nex-text-link` | `#2563EB` | Hyperlinks |
| `--nex-text-link-hover` | `#1D4ED8` | Hyperlink hover |
| `--nex-text-success` | `#059669` | Success messages |
| `--nex-text-warning` | `#D97706` | Warning messages |
| `--nex-text-danger` | `#DC2626` | Error messages |
| `--nex-text-info` | `#2563EB` | Informational text |
| `--nex-text-muted` | `#A3A3A3` | Muted, de-emphasized text |

---

### 2.11 Dark Mode Palette

Future-ready. Defined now for consistency. Not inverted colors — specially crafted dark surfaces.

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `--nex-dark-bg-base` | `#0F172A` | `15, 23, 42` | Base dark background (deep navy) |
| `--nex-dark-bg-elevated` | `#1E293B` | `30, 41, 59` | Elevated dark surfaces (slate) |
| `--nex-dark-bg-sunken` | `#020617` | `2, 6, 23` | Recessed dark areas (near-black navy) |
| `--nex-dark-bg-overlay` | `rgba(0, 0, 0, 0.7)` | — | Dark modal backdrops |
| `--nex-dark-border` | `rgba(255, 255, 255, 0.1)` | — | Dark mode borders |
| `--nex-dark-border-subtle` | `rgba(255, 255, 255, 0.05)` | — | Subtle dark dividers |
| `--nex-dark-text-primary` | `#F1F5F9` | `241, 245, 249` | Primary text in dark mode |
| `--nex-dark-text-secondary` | `#CBD5E1` | `203, 213, 225` | Secondary text in dark mode |
| `--nex-dark-text-tertiary` | `#94A3B8` | `148, 163, 184` | Tertiary text, captions |
| `--nex-dark-primary-glow` | `rgba(59, 130, 246, 0.2)` | — | Primary glow effects |
| `--nex-dark-secondary-glow` | `rgba(249, 115, 22, 0.15)` | — | Secondary/AI glow effects |

**Dark Mode Principles:**
- Uses deep navy (`#0F172A`) instead of pure black to reduce eye strain
- Surfaces have navy undertones, not gray undertones — maintains brand warmth
- Text is off-white (`#F1F5F9`), never pure white
- Primary colors are slightly desaturated in dark mode for comfort
- Borders use low-opacity white for subtle definition

---

## 3. Typography

### 3.1 Font Families

#### Arabic — IBM Plex Sans Arabic

Professional, contemporary Arabic typeface with excellent Latin harmony. Optimized for screen legibility with proper Arabic typography rules (kashida, lam-aleph ligatures).

```css
--nex-font-arabic: 'IBM Plex Sans Arabic', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Usage:** All Arabic text, bilingual interfaces, RTL layouts.

#### English & Numbers — Inter

The world's most refined UI font. Purpose-built for screens. Superior legibility at small sizes. Tabular numbers essential for financial and inventory data.

```css
--nex-font-english: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--nex-font-numbers: 'Inter', 'IBM Plex Sans Arabic', monospace;
```

**Usage:** English text, numbers, financial figures, inventory codes, dates.

#### Font Stack Priority

```css
/* Arabic-first environment */
--nex-font-family: 'IBM Plex Sans Arabic', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* English-first environment */
--nex-font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Numbers always in Inter */
--nex-font-numbers: 'Inter', monospace;
```

---

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 3.5rem / 56px | 800 | 1.0 | -0.025em | Nexora Pulse hero headlines |
| H1 | 2.5rem / 40px | 700 | 1.1 | -0.02em | Page titles |
| H2 | 2rem / 32px | 700 | 1.2 | -0.015em | Section headers |
| H3 | 1.5rem / 24px | 600 | 1.3 | -0.01em | Card titles, sub-sections |
| H4 | 1.25rem / 20px | 600 | 1.4 | -0.005em | Component headers |
| Body Large | 1.125rem / 18px | 400 | 1.6 | 0.001em | Emphasized body text |
| Body Medium | 1rem / 16px | 400 | 1.6 | 0.002em | **Default body text** |
| Body Small | 0.875rem / 14px | 400 | 1.5 | 0.004em | Secondary descriptions |
| Caption | 0.75rem / 12px | 400 | 1.4 | 0.008em | Timestamps, meta info |
| Numbers Large | 2rem / 32px | 700 | 1.1 | -0.01em | Dashboard hero numbers |
| Numbers Medium | 1.25rem / 20px | 600 | 1.3 | -0.005em | KPI values |
| Numbers Small | 0.875rem / 14px | 500 | 1.4 | 0.004em | Table numbers, inline metrics |

---

### 3.3 Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--nex-weight-regular` | 400 | Body text, captions, descriptions |
| `--nex-weight-medium` | 500 | Emphasized text, buttons, labels |
| `--nex-weight-semibold` | 600 | Headings, card titles, navigation |
| `--nex-weight-bold` | 700 | Page titles, section headers |
| `--nex-weight-extrabold` | 800 | Dashboard hero metrics, Pulse display |

---

### 3.4 Typography Rules

#### Hierarchy Rules
- **Never use more than 3 font weights on a single screen**
- **Never use more than 4 font sizes on a single component**
- Heading levels must progress sequentially — no skipping H1 to H3
- Body text never smaller than `0.875rem / 14px`
- Arabic body text minimum: `1rem / 16px` for readability

#### Line Length
- Maximum line length: **65 characters** for body text
- Dashboard metrics: centered, line length irrelevant
- Tables: no line length limit (tabular data exception)

#### Number Typography
- All numbers, dates, financial figures use `--nex-font-numbers` (Inter)
- Tabular figures prevent layout shift in tables and dashboards
- Thousands separators: comma for English, Arabic comma (،) for Arabic
- Decimal alignment in financial tables

#### Arabic Typography Specifics
- IBM Plex Sans Arabic handles mixed Arabic/English text elegantly
- Letter spacing slightly increased for Arabic headlines for breathing room
- Line height for Arabic: add `+0.1` to the standard value
- No text justification — left align Arabic, right align if needed for RTL

---

## 4. Spacing System

### 4.1 Base Scale

All spacing derives from a **4px base grid**. Every measurement is a multiple of 4.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--nex-space-1` | 0.25rem | 4px | Icon padding, tight inline gaps |
| `--nex-space-2` | 0.5rem | 8px | **Base unit** — component padding, gaps |
| `--nex-space-3` | 0.75rem | 12px | Compact spacing, dense UIs |
| `--nex-space-4` | 1rem | 16px | **Default spacing** — form fields, lists |
| `--nex-space-5` | 1.25rem | 20px | Card internal padding |
| `--nex-space-6` | 1.5rem | 24px | Component separation, medium gaps |
| `--nex-space-8` | 2rem | 32px | Section spacing, card grid gaps |
| `--nex-space-10` | 2.5rem | 40px | Major section breaks |
| `--nex-space-12` | 3rem | 48px | Page-level breathing room |
| `--nex-space-16` | 4rem | 64px | Hero spacing, full-width breaks |

---

### 4.2 Spacing Rules by Component

#### Buttons
- **Height:** `40px` (default), `32px` (compact), `48px` (prominent)
- **Horizontal padding:** `16px` (default), `12px` (compact), `24px` (prominent)
- **Icon + text gap:** `8px`
- **Button stack gap:** `12px`

#### Cards
- **Padding:** `20px` (default), `16px` (compact), `24px` (spacious)
- **Grid gap:** `24px`
- **Internal vertical rhythm:** `16px` between elements

#### Forms
- **Label-to-input gap:** `8px`
- **Input height:** `40px`
- **Input padding:** `10px 14px`
- **Field-to-field gap:** `20px`
- **Form section gap:** `32px`

#### Tables
- **Cell padding:** `12px 16px`
- **Header padding:** `14px 16px`
- **Row height:** `48px` (default), `40px` (compact)
- **Table-to-element gap:** `24px`

#### Modals / Dialogs
- **Dialog padding:** `24px`
- **Header padding:** `20px 24px`
- **Footer padding:** `16px 24px`
- **Dialog element gap:** `16px`

#### Sidebar
- **Item height:** `36px`
- **Item padding:** `8px 12px`
- **Nav group gap:** `24px`
- **Width:** `260px` (expanded), `72px` (collapsed)

#### Top Header
- **Height:** `56px`
- **Padding:** `0 24px`
- **Header element gap:** `16px`

#### Page Layout
- **Page margin:** `24px` (desktop), `16px` (tablet), `12px` (mobile)
- **Section gap:** `32px`
- **Page max-width:** `1440px` centered

---

### 4.3 Spacing Principles

- **Always even numbers** — never odd pixel values
- **Vertical = Horizontal** — same scale, no asymmetry
- **Consistent rhythm** — elements align visually to the grid
- **More space = more premium** — generous whitespace signals quality
- **Minimum padding:** `--nex-space-2` (8px) — never less

---

## 5. Border Radius

### 5.1 Radius Scale

| Token | Value | Visual | Usage |
|-------|-------|--------|-------|
| `--nex-radius-none` | `0` | Square | Data tables, dense lists, no rounding |
| `--nex-radius-sm` | `4px` | Slight round | Tags, chips, checkboxes, small controls |
| `--nex-radius-md` | `8px` | Moderate | **Default** — inputs, buttons, small cards |
| `--nex-radius-lg` | `12px` | Rounded | Cards, panels, dropdowns, alerts |
| `--nex-radius-xl` | `16px` | Highly rounded | Large cards, modals, AI insight cards |
| `--nex-radius-2xl` | `24px` | Pill-like | Floating panels, hero cards, recommendation cards |
| `--nex-radius-full` | `9999px` | Circle | Avatars, toggle switches, pill buttons |

---

### 5.2 Component Radius Mapping

| Component | Radius | Rationale |
|-----------|--------|-----------|
| Default Card | `12px` | Modern, friendly but professional |
| Statistics Card | `12px` | Consistent with card family |
| Analytics Card | `12px` | Data-focused, clean edges |
| AI Insight Card | `16px` | Distinctive — signals intelligence |
| Alert Card | `12px` | Softer than tables, more than documents |
| KPI Card | `12px` | Executive dashboard consistency |
| Recommendation Card | `24px` | Premium, floating feel |
| Buttons | `8px` | Touch-friendly, modern |
| Primary Buttons | `8px` | Same family |
| Icon Buttons | `8px` | Consistent with buttons |
| Input Fields | `8px` | Inputs and buttons share radius |
| Dropdowns | `8px` | Matches input family |
| Modals | `16px` | Distinct from cards, elevated |
| Tables | `0px` | Dense data — no rounding |
| Table Card Wrap | `12px` top-left/top-right | Softens table container |
| Badges / Chips | `9999px` | Pill-shaped for quick recognition |
| Tooltips | `8px` | Matches input rounding |
| Notifications | `12px` | Alert-adjacent family |

---

### 5.3 Radius Principles

- **Never mix radii randomly** — establish component families
- **Data density = less radius** — tables at `0px`, cards at `12px`
- **Importance/urgency = more radius** — AI cards at `24px` command attention
- **Consistency within families** — all inputs share `8px`, all cards share `12px`

---

## 6. Elevation & Shadows

### 6.1 Shadow Philosophy

Shadows create hierarchy without noise. Nexora shadows are **subtle, warm, and layered**. They should feel like natural light from above, not harsh digital drop-shadows.

### 6.2 Shadow Scale

| Token | Value | Blur | Spread | Opacity | Usage |
|-------|-------|------|--------|---------|-------|
| `--nex-shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | 2px | 0px | 4% | Subtle lift, dropdown items |
| `--nex-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 3px | 0px | 6% | **Cards, inputs** — default elevation |
| `--nex-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)` | 6px | -1px | 6% | **Hover cards, expanded rows** — interactive elevation |
| `--nex-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.04)` | 15px | -3px | 6% | **Floating panels, popovers, large dropdowns** |
| `--nex-shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)` | 25px | -5px | 8% | **Modals, dialogs, critical overlays** |
| `--nex-shadow-2xl` | `0 25px 50px -12px rgba(0,0,0,0.12)` | 50px | -12px | 12% | Full-screen modals, alerts demanding attention |
| `--nex-shadow-glow-primary` | `0 0 20px rgba(37, 99, 235, 0.15)` | 20px | 0px | 15% | Primary CTA focus, selected states |
| `--nex-shadow-glow-secondary` | `0 0 20px rgba(249, 115, 22, 0.12)` | 20px | 0px | 12% | AI elements, Nexora Pulse highlights |

---

### 6.3 Shadow Application Rules

#### Card Shadow
- **Rest state:** `--nex-shadow-sm` — barely perceptible lift
- Separates content from background without visual weight
- Applied to: default cards, input fields, list items

#### Hover Shadow
- **Hover state:** `--nex-shadow-md` — noticeable lift
- Creates "pressing down" metaphor on interactive cards
- Applied on: hover, focus, expanded state
- Transition: `150ms ease-out`

#### Dialog Shadow
- **Default:** `--nex-shadow-xl` — strong containment
- Creates clear visual hierarchy between dialog and background
- Applied to: modals, confirmations, critical forms
- Combined with `--nex-surface-overlay` backdrop

#### Dropdown Shadow
- **Default:** `--nex-shadow-lg` — floating feel
- Elevates above all other content
- Applied to: select dropdowns, autocomplete, context menus
- Combined with `--nex-surface-elevated` background

#### Floating Panel Shadow
- **Default:** `--nex-shadow-lg` minimum
- For draggable, resizable, or persistently visible panels
- Applied to: slide-out panels, docked widgets, floating toolbars

#### Glow Shadows
- Used **extremely sparingly** — once per screen maximum
- `--nex-shadow-glow-primary` for primary CTA or active AI element
- `--nex-shadow-glow-secondary` for Nexora Pulse, AI insights, live indicators
- Never stack glow on top of other shadows

---

### 6.4 Shadow Rules

- **Never stack more than 2 shadow layers** on a single element
- **Transition shadows** — `150ms ease-out` on all shadow changes
- **Dark mode shadows** — use `rgba(0,0,0,0.4)` base instead of `rgba(0,0,0,0.06)`
- **Elevation hierarchy:** Only one elevation level per component type
- **Consistency:** Same component type always uses same shadow token

---

## 7. Accessibility Foundations

### 7.1 Contrast Ratios

All text/background combinations meet or exceed **WCAG 2.1 AA** standards:

| Text Color | Background | Ratio | Passes |
|------------|-----------|-------|--------|
| `--nex-text-primary` (`#171717`) | `--nex-neutral-50` (`#FAFAFA`) | 16.1:1 | AAA |
| `--nex-text-secondary` (`#525252`) | `--nex-neutral-50` (`#FAFAFA`) | 7.2:1 | AA |
| `--nex-text-tertiary` (`#737373`) | `--nex-neutral-50` (`#FAFAFA`) | 4.5:1 | AA |
| `--nex-primary-600` text | `--nex-primary-50` bg | 4.8:1 | AA |
| `--nex-text-inverse` (`#FFFFFF`) | `--nex-primary-600` (`#2563EB`) | 4.6:1 | AA |
| `--nex-text-inverse` | `--nex-danger-600` (`#DC2626`) | 5.1:1 | AA |

### 7.2 Focus Indicators

All interactive elements require visible focus indicators:

- **Default focus:** `2px solid --nex-primary-500`
- **Focus offset:** `2px` from element edge
- **Focus style:** `outline: none` everywhere, replaced by `box-shadow` or `border` (never remove focus without replacement)
- **Keyboard-only focus:** Same style as mouse focus — no distinction

### 7.3 Touch Targets

- **Minimum touch target:** `40×40px`
- **Recommended:** `44×44px` for primary actions
- **Spacing between touch targets:** Minimum `8px`

---

## 8. Implementation Notes

### 8.1 CSS Custom Properties Strategy

All design tokens are defined as CSS custom properties (variables) at the `:root` level:

```css
:root {
  /* Color tokens */
  --nex-primary-600: #2563EB;
  --nex-neutral-50: #FAFAFA;
  /* ... */
  
  /* Typography tokens */
  --nex-font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
  --nex-text-base: 0.9375rem;
  /* ... */
  
  /* Spacing tokens */
  --nex-space-4: 1rem;
  /* ... */
}
```

### 8.2 Token Naming Convention

- All tokens prefixed with `--nex-`
- Color tokens: `--nex-{color}-{shade}` (e.g., `--nex-primary-600`)
- Spacing tokens: `--nex-space-{step}` (e.g., `--nex-space-8`)
- Typography tokens: `--nex-text-{size}` or `--nex-font-{property}`
- Radius tokens: `--nex-radius-{size}`
- Shadow tokens: `--nex-shadow-{elevation}`

### 8.3 RTL Considerations

- All spacing values remain identical in RTL
- Border radius unchanged
- Shadows unchanged
- Font sizes unchanged
- Flip margins/paddings: `margin-left` ↔ `margin-right`
- Logical properties preferred: `margin-inline-start`, `padding-inline-end`

---

## 9. Nexora Pulse Specific

### 9.1 Pulse Visual Language

Nexora Pulse is the intelligent home experience. Its visual treatment should feel like an **automotive command center**:

- Deep sapphire backgrounds with cardinal amber accents
- Large, confident numbers for metrics
- Subtle glow effects on live data indicators
- Breathing animations on AI processing states
- Clean, spacious layouts that reduce cognitive load

### 9.2 Pulse Color Application

| Pulse Element | Color Treatment |
|---------------|-----------------|
| Pulse Background | `--nex-dark-bg-base` (`#0F172A`) |
| Pulse Cards | `--nex-dark-bg-elevated` (`#1E293B`) |
| Live Indicator | `--nex-accent-500` with `--nex-shadow-glow-primary` |
| AI Processing | `--nex-secondary-500` pulse animation |
| Metric Values | `--nex-dark-text-primary` (`#F1F5F9`) |
| Metric Labels | `--nex-dark-text-tertiary` (`#94A3B8`) |
| Positive Trend | `--nex-success-400` |
| Negative Trend | `--nex-danger-400` |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial design system — Part 1: Visual Foundations |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ development must adhere to this document.

---

*This document is the single source of truth for Nexora ERP visual design. Any deviation requires written approval from Design System Architecture.*

---

# Official Status

This document is hereby designated as the official Nexora ERP Design System v1.0.

It serves as the single source of truth for the visual identity, user experience, and interface standards across the entire Nexora ERP platform.

Every future page, workspace, component, chart, dialog, table, AI interface, and mobile experience must strictly follow the rules defined in this document.

No future UI decision may override these standards unless the Design System itself is officially revised.

This document establishes long-term consistency, scalability, maintainability, and enterprise-grade quality across the Nexora ERP ecosystem.

Status: APPROVED

Version: 1.0

Foundation: Locked
