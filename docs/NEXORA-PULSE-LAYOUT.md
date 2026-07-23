# Nexora Pulse Layout UX Specification
## Official Business Command Center Structure
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** Nexora ERP v1.0+ home experience layout  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## 1. Pulse Layout Philosophy

### 1.1 The 5-Second Rule

Executives must understand business health within 5 seconds of opening Nexora Pulse.

**Scanning Pattern:**
```
Seconds 1-2:  Health Score + AI Executive Summary (top row)
Seconds 2-3:  KPI Cards (critical metrics)
Seconds 3-4:  Alerts + Inventory Intelligence (red/amber signals)
Seconds 4-5:  Sales + Purchasing overview (green signals)
Beyond 5s:    AI Insights, Recent Activity, Details on demand
```

### 1.2 Layout Principles

1. **Top-Down Intelligence** — Most critical information at the top
2. **Left-to-Right Priority** — Left columns are operational, right columns are strategic
3. **Progressive Disclosure** — Overview first, detail on click
4. **Visual Breathing Room** — No crowding, no clutter
5. **Consistent Rhythm** — All cards align to the grid
6. **Context Always Visible** — Company/branch never hidden

---

## 2. Grid System

### 2.1 Base Grid

**Base Unit:** 8px grid  
**Gutter:** 24px  
**Page Margin:** 24px  
**Max Content Width:** 1440px centered

### 2.2 Desktop Grid (>1280px)

**Columns:** 12 columns  
**Column Width:** ~88px each (1440px - margins - gutters)

```
|<-24px->|<--8 cols-->|<--24px->|<--4 cols->|<-24px->|
|        |  Main      |         |  Side     |        |
|        |  Content   |         |  Panels   |        |
|<-24px->|<--8 cols-->|<--24px->|<--4 cols->|<-24px->|
```

**Assignment:**
- Columns 1-8: Primary widgets (KPIs, charts, operational data)
- Columns 9-12: Secondary panels (Quick Actions, AI, Activity)

### 2.3 Laptop Grid (1024px-1280px)

**Columns:** 8 columns  
**Gutter:** 20px  
**Page Margin:** 20px

Main content takes full width. Side panels collapse below or become tabs.

### 2.4 Tablet Grid (768px-1023px)

**Columns:** 4 columns  
**Gutter:** 16px  
**Page Margin:** 16px

Single column flow. Cards stack vertically. Tabs replace side-by-side panels.

### 2.5 Mobile Grid (<768px)

**Columns:** 2 columns  
**Gutter:** 12px  
**Page Margin:** 12px

Horizontal scroll for KPI cards. Bottom tab navigation for sections.

---

## 3. Layout Hierarchy

### 3.1 Zone Priority

| Zone | Priority | Purpose | Height |
|------|----------|---------|--------|
| **Z1** | CRITICAL | Context + Health + AI Summary | 160px |
| **Z2** | CRITICAL | KPI Cards | 140px |
| **Z3** | HIGH | Operational Intelligence | 320px |
| **Z4** | HIGH | AI Section | 280px |
| **Z5** | MEDIUM | Recent Activity | 180px |

### 3.2 Reading Flow

```
LTR:  Z1 (left→right) → Z2 (left→right) → Z3 (left→center→right) → Z4 (left→right) → Z5 (left→right)

RTL:  Z1 (right→left) → Z2 (right→left) → Z3 (right→center→left) → Z4 (right→left) → Z5 (right→left)
```

---

## 4. Desktop Layout (>1280px)

### 4.1 Top Context Row (Z1)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Good morning, Ahmed                                                │
│ Al-Jawhara Motors • Riyadh Branch • Main Warehouse          [EN ▼]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐  │
│  │ Health Score     │  │  Executive Summary Area                 │  │
│  │   87/100         │  │  (AI or Text Summary)                   │  │
│  │  ▓▓▓▓▓▓▓▓▓▓░░  │  │                                        │  │
│  └──────────────────┘  └────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 160px |
| Health Score Card | 180px width, centered vertically |
| Executive Summary | Flex grow, fills remaining space |
| Gap | 24px between cards |
| Padding | 24px top/bottom |

---

### 4.2 KPI Row (Z2)

```
┌─────────────────────────────────────────────────────────────────────┐
│ KPI CARDS — Single Row, 8 Cards                                    │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Today's   │ │Monthly   │ │Monthly   │ │Cash      │              │
│  │Sales     │ │Revenue   │ │Profit    │ │Balance   │              │
│  │SAR 45K ▲ │ │SAR 2.1M ▲│ │SAR 380K ▲│ │SAR 850K ▼│              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Inventory │ │Accounts  │ │Accounts  │ │Purchase  │              │
│  │Value     │ │Receivable│ │Payable   │ │Orders    │              │
│  │SAR 4.2M  │ │SAR 320K  │ │SAR 180K  │ │12 open   │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 140px |
| Cards per Row | 8 |
| Card Width | 180px |
| Card Gap | 20px |
| Card Size | 180px × 140px |
| Scroll | None — fits in one row |

---

### 4.3 Middle Row (Z3)

```
┌─────────────────────────────────────────────────────────────────────┐
│ OPERATIONAL INTELLIGENCE — 3 Columns                                │
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────┐         │
│  │ Inventory Intelligence │  │ Purchasing               │         │
│  │                         │  │                         │         │
│  │ [Widget placeholder]    │  │ [Widget placeholder]    │         │
│  │                         │  │                         │         │
│  │                         │  │                         │         │
│  └─────────────────────────┘  └─────────────────────────┘         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Sales Intelligence                                            │ │
│  │ [Widget placeholder]                                          │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 320px |
| Column 1 (Inventory) | ~38% width |
| Column 2 (Purchasing) | ~31% width |
| Column 3 (Sales) | ~31% width |
| Gap | 24px between columns |

---

### 4.4 AI Section (Z4)

```
┌─────────────────────────────────────────────────────────────────────┐
│ NEXORA AI                                                 [View All]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────┐  ┌────────────────────────┐            │
│  │ AI Widget              │  │ AI Widget               │            │
│  │ [Placeholder]          │  │ [Placeholder]           │            │
│  └────────────────────────┘  └────────────────────────┘            │
│                                                                     │
│  ┌────────────────────────┐  ┌────────────────────────┐            │
│  │ AI Widget              │  │ AI Widget               │            │
│  │ [Placeholder]          │  │ [Placeholder]           │            │
│  └────────────────────────┘  └────────────────────────┘            │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ AI Category Scroll Row                                        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 280px |
| Layout | 2×2 grid + scrollable row |
| Cards per Row | 2 |
| Card Height | 120px |
| Bottom Row | Horizontal scroll for remaining categories |
| Gap | 20px |

---

### 4.5 Bottom Row (Z5)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐  ┌─────────────────┐    │
│ │ Recent Activity                         │  │ Quick Actions    │    │
│ │                                         │  │                 │    │
│ │ [Activity timeline placeholder]         │  │ [Quick action   │    │
│ │                                         │  │  placeholder]   │    │
│ │                                         │  │                 │    │
│ └─────────────────────────────────────────┘  └─────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 180px |
| Left Panel (Activity) | ~65% width |
| Right Panel (Quick Actions) | ~35% width |
| Gap | 24px |

---

## 5. Tablet Layout (768px-1023px)

### 5.1 Stacked Layout

```
┌─────────────────────────────────┐
│ Al-Jawhara Motors • Riyadh [EN▼]│
├─────────────────────────────────┤
│                                 │
│ [Health Score]                  │
│ [87/100]                        │
│                                 │
│ [AI Executive Summary]          │
│ "...sales 12% ahead..."         │
│                                 │
├─────────────────────────────────┤
│ KPI CARDS (2×2 grid)           │
│ ┌──────────┐ ┌──────────┐      │
│ │Today's   │ │Monthly   │      │
│ │Sales     │ │Revenue   │      │
│ └──────────┘ └──────────┘      │
│ ┌──────────┐ ┌──────────┐      │
│ │Cash      │ │Inventory │      │
│ │Balance   │ │Value     │      │
│ └──────────┘ └──────────┘      │
├─────────────────────────────────┤
│ TABS                            │
│ [Overview] [Inventory] [Sales]  │
│ [Purchasing] [AI] [Activity]    │
├─────────────────────────────────┤
│                                 │
│ Tab Content Area                │
│ (scrollable)                    │
│                                 │
└─────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Health Score | Full width, centered |
| AI Summary | Full width |
| KPI Grid | 2 columns × 4 rows |
| Content Tabs | 6 tabs, scrollable |
| Card Height | Auto, min 120px |
| Gap | 16px |

---

## 6. Mobile Layout (<768px)

### 6.1 Top Bar

```
┌─────────────────────────────┐
│ Al-Jawhara Motors        [☰]│
│ Warehouse: Main              │
├─────────────────────────────┤
│ [Search] [Create] [AI] [🔔] │
└─────────────────────────────┘
```

### 6.2 KPI Horizontal Scroll

```
┌───────────────────────────────────────────────────────┐
│ KPI CARDS (horizontal scroll)                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │Today's   │ │Monthly   │ │Monthly   │ │Cash      │  │
│ │Sales     │ │Revenue   │ │Profit    │ │Balance   │  │
│ │SAR 45K   │ │SAR 2.1M  │ │SAR 380K  │ │SAR 850K  │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│        ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│        │Accounts  │ │Accounts  │ │Purchase  │         │
│        │Receivable│ │Payable   │ │Orders    │         │
│        │SAR 320K  │ │SAR 180K  │ │12 open   │         │
│        └──────────┘ └──────────┘ └──────────┘         │
└───────────────────────────────────────────────────────┘
```

### 6.3 Content Tabs

```
┌───────────────────────────────────────────────────────┐
│ [Overview] [Inventory] [Sales] [AI] [Activity]       │
├───────────────────────────────────────────────────────┤
│                                                       │
│           Tab Content Area                            │
│           (scrollable)                                │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 6.4 Bottom Navigation (Alternative)

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│           Tab Content Area                            │
│                                                       │
├───────────────────────────────────────────────────────┤
│  [🏠]  [📦]  [🛒]  [📊]  [✨]  [⋯]                   │
│  Pulse Inv   Purch  Sales  AI     More                │
└───────────────────────────────────────────────────────┘
```

| Tab | Icon | Content |
|-----|------|---------|
| Pulse | `activity` | Health + AI Summary + KPIs |
| Inventory | `package-open` | Inventory widgets |
| Purchasing | `shopping-cart` | Purchasing widgets |
| Sales | `trending-up` | Sales widgets |
| AI | `sparkles` | AI Insights |
| More | `more-horizontal` | Activity + Settings |

---

## 7. Card Sizing Rules

### 7.1 Standard Card Sizes

| Card Type | Desktop | Laptop | Tablet | Mobile |
|-----------|---------|--------|--------|--------|
| Health Score | 180×160px | 160×140px | 200×180px | full-width×auto |
| AI Summary | Flex-grow | full-width | full-width | full-width |
| KPI Card | 180×140px | 160×120px | 50%×120px | 160×100px |
| Widget Card | 50%×auto | 50%×auto | full-width | full-width |
| Activity Panel | 65%×180px | full-width×180px | full-width×auto | full-width×auto |
| Quick Actions | 35%×180px | full-width×auto | full-width×auto | full-width×auto |

### 7.2 Card Padding

| Card Type | Padding | Rationale |
|-----------|---------|-----------|
| KPI Card | 20px | Standard executive card |
| Health Score | 24px | More breathing room for score |
| AI Summary | 20px | Matches KPI family |
| Widget Card | 16px | Dense data, still comfortable |
| Activity Panel | 20px | Timeline needs space |
| Quick Actions | 16px | Compact action grid |

---

## 8. Visual Hierarchy

### 8.1 Hierarchy Levels

| Level | Element | Visual Weight | Purpose |
|-------|---------|---------------|---------|
| **L1** | Business Health Score | Score number 3rem, eye-catching | "Is the business healthy?" |
| **L2** | AI Executive Summary | Full width, colored border | "What does AI say?" |
| **L3** | KPI Cards | Numbers 1.875rem, grid | "What are the key numbers?" |
| **L4** | Operational Widgets | Medium titles, data lists | "What needs attention?" |
| **L5** | AI Section | Section header, cards | "What are AI recommendations?" |
| **L6** | Recent Activity | Compact timeline | "What happened recently?" |

### 8.2 Visual Weight Rules

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Health Score Number | 3rem / 48px | 800 | Semantic (green/amber/red) |
| KPI Value | 1.875rem / 30px | 700 | `--nex-neutral-900` |
| Section Title | 1.25rem / 20px | 600 | `--nex-neutral-800` |
| Card Title | 1rem / 16px | 600 | `--nex-neutral-700` |
| Body Text | 0.9375rem / 15px | 400 | `--nex-neutral-600` |
| Caption | 0.75rem / 12px | 400 | `--nex-neutral-500` |

---

## 9. White Space Strategy

### 9.1 Spacing Rules

| Space | Value | Usage |
|-------|-------|-------|
| Page Margin | 24px | Desktop edges |
| Zone Gap | 24px | Between major zones |
| Card Gap | 20px | Between cards in grid |
| Card Padding | 16-24px | Inside cards |
| Element Gap | 12px | Between elements within card |

### 9.2 Breathing Room Principles

- **Never crowd** — If it feels full, it's too full
- **Generous margins** — Premium feel requires whitespace
- **Consistent rhythm** — All spacing derives from 8px grid
- **Visual rest** — Eyes need places to land between data points

---

## 10. Multi-Company Context

### 10.1 Context Display

Every screen element must clearly indicate data scope:

| Location | Display | Style |
|----------|---------|-------|
| Top-left | Company name + Branch + Warehouse | `--nex-text-sm`, `--nex-weight-medium` |
| Card corner | Company initial badge | `--nex-text-xs`, `--nex-neutral-400` |
| Loading | "Loading [Company] data..." | `--nex-text-sm`, `--nex-text-tertiary` |

### 10.2 Context Rules

- **Always visible** — Never hide company/branch context
- **Instant update** — Changing company refreshes all widgets within 200ms
- **Branch isolation** — Branch change never affects another company's data
- **Visual consistency** — Same context display on every widget

---

## 11. Responsive Breakpoints Summary

### 11.1 Desktop (>1280px)

| Property | Value |
|----------|-------|
| Layout | Full grid, 12 columns |
| KPI Row | 8 cards in single row |
| Middle Row | 3 columns (Inventory, Purchasing, Sales) |
| AI Section | 2×2 grid + scroll row |
| Bottom Row | Activity 65% + Quick Actions 35% |
| Card Sizes | Full size per spec |

### 11.2 Laptop (1024px-1280px)

| Property | Value |
|----------|-------|
| Layout | 8 columns |
| KPI Row | 4 cards per row, 2 rows |
| Middle Row | Single column, stacked widgets |
| AI Section | 2×2 grid |
| Bottom Row | Activity above, Quick Actions below |
| Card Sizes | Slightly reduced |

### 11.3 Tablet (768px-1023px)

| Property | Value |
|----------|-------|
| Layout | 4 columns, single column flow |
| KPI Row | 2 cards per row, 4 rows |
| Navigation | Tab-based |
| AI Section | Collapsible accordion |
| Bottom Row | Stacked vertically |
| Card Sizes | Full width |

### 11.4 Mobile (<768px)

| Property | Value |
|----------|-------|
| Layout | 2 columns, horizontal scroll |
| KPI Row | Horizontal scroll cards |
| Navigation | Bottom tab bar |
| AI Section | Full-screen tab |
| Bottom Row | Stacked vertically |
| Card Sizes | Full width, compact |

---

## 12. Interaction Design

### 12.1 Hover States

| Element | Hover Behavior | Transition |
|---------|----------------|------------|
| KPI Card | `--nex-shadow-md`, `translateY(-2px)` | 150ms ease-out |
| Widget Card | `--nex-shadow-md` | 150ms ease-out |
| Quick Action | `--nex-hover-bg`, border `--nex-border-strong` | 120ms ease-in |
| Activity Item | Background `--nex-hover-bg` | 120ms ease-in |

### 12.2 Click Interactions

| Element | Click Action | Feedback |
|---------|--------------|---------|
| KPI Card | Opens detailed report | Navigation |
| Widget Card | Expands or opens related list | Expand or navigate |
| Quick Action | Opens creation form in modal | Modal open |
| Activity Item | Opens related record | Navigation |

### 12.3 Loading Behavior

| Element | Loading State |
|---------|---------------|
| Health Score | Skeleton circle, 120px |
| KPI Cards | Skeleton rectangles, 180×140px |
| Widgets | Skeleton bars matching content |
| Activity | 3-4 skeleton timeline items |

---

## 13. Accessibility

### 13.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 minimum |
| Touch Target | Minimum 40×40px for all interactive elements |
| Focus Indicator | 2px solid `--nex-primary-500`, offset -2px |
| Keyboard Navigation | Full drill-down and action access |
| Screen Reader | `aria-label` on all icon-only elements |
| Semantic HTML | `<main>`, `<section>`, `<article>` for widgets |

### 13.2 ARIA Structure

| Element | ARIA |
|---------|------|
| Main container | `role="main"`, `aria-label="Nexora Pulse"` |
| Zone sections | `role="region"`, `aria-label` per zone |
| Widget cards | `role="article"`, `aria-label="Widget description"` |
| Activity timeline | `role="list"`, items `role="listitem"` |
| KPI values | `aria-live="polite"` for value updates |

---

## 14. Animation & Motion

### 14.1 Page Load

| Animation | Timing | Behavior |
|-----------|--------|----------|
| Zone reveal | Staggered 100ms | Top to bottom fade-in |
| KPI cards | Staggered 50ms | Fade-in, slight scale |
| Widgets | Staggered 80ms | Fade-in from bottom |

### 14.2 Interactions

| Interaction | Timing | Behavior |
|-------------|--------|----------|
| Card hover | 150ms | Shadow lift, translateY(-2px) |
| Card click | 100ms | Scale 0.98, then navigate |
| Value update | 200ms | Fade out old, fade in new |
| New activity | 150ms | Slide in from top |

### 14.3 Motion Rules

- **No bounce** — Use `cubic-bezier(0.4, 0, 0.2, 1)` only
- **Respect `prefers-reduced-motion`** — Disable non-essential animations
- **No layout shift** — Reserve space for all dynamic content

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial Pulse layout specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ Pulse implementations must adhere to this document.

---

*This document is the single source of truth for Nexora Pulse layout. Any deviation requires written approval from Design System Architecture.*
