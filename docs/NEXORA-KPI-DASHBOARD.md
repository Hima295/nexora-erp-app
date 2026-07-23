# Nexora Executive KPI Dashboard UX Specification
## Official KPI Card Standards
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** Nexora ERP v1.0+ Pulse KPI dashboard  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## 1. KPI Dashboard Philosophy

### 1.1 Purpose

The Executive KPI Dashboard is the **single-screen view** for business health. It strips away complexity and presents only the numbers that matter — clear, comparative, and actionable.

**Design Philosophy:**
- **5-Second Scan** — Executives understand business health in under 5 seconds
- **One Number, One Story** — Each KPI tells exactly one story
- **Instant Comparison** — Current vs. target, vs. last period, visible at a glance
- **Visual Priority** — Color and size signal importance without words

### 1.2 KPI Card Anatomy

Every KPI card follows a consistent structure:

```
┌─────────────────────────────────────────┐
│ ICON  Label                     [Action] │
│ ─────────────────────────────────────── │
│                                         │
│           Primary Value                 │
│           SAR 45,230                    │
│                                         │
│   ▲ 12% vs yesterday                   │
│   Target: SAR 50,000                    │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  ██ 90%      │
└─────────────────────────────────────────┘
```

| Element | Specification |
|---------|---------------|
| **Background** | `#FFFFFF` |
| **Border** | `1px solid --nex-border-default` |
| **Border Radius** | `--nex-radius-lg` (`12px`) |
| **Shadow** | `--nex-shadow-sm` (rest), `--nex-shadow-md` (hover) |
| **Padding** | `20px` |
| **Hover Transition** | `150ms ease-out` |
| **Min Height** | `140px` |
| **Max Height** | `180px` |

---

## 2. Financial KPI Cards

### 2.1 Today's Sales

#### Purpose
Shows total sales revenue for the current business day. Answers: "How much did we sell today?"

#### Priority
**CRITICAL** — Primary health indicator, always visible

#### Visualization
```
┌─────────────────────────────────────────┐
│ 💰 Today's Sales                  [→]   │
│                                         │
│           SAR 45,230                    │
│           ▲ 12% vs yesterday            │
│                                         │
│   Target: SAR 50,000                    │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  ██ 90%       │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `dollar-sign` (Lucide), `16px`, `--nex-success-500` |
| Label | `--nex-text-xs`, `--nex-weight-medium`, `--nex-text-tertiary`, ALL CAPS |
| Value | `--nex-text-3xl` / `1.875rem`, `--nex-weight-bold`, `--nex-neutral-900` |
| Trend | `--nex-text-sm`, `--nex-weight-medium` |
| Trend Positive | `--nex-success-600`, `arrow-up` icon |
| Trend Negative | `--nex-danger-600`, `arrow-down` icon |
| Target | `--nex-text-xs`, `--nex-text-tertiary` |
| Progress Bar | `6px` height, `--nex-neutral-200` bg, `--nex-primary-600` fill |
| Progress Text | `--nex-text-xs`, `--nex-text-tertiary`, right-aligned |

#### Status Colors
| Condition | Value Color | Trend Color | Progress Color |
|-----------|-------------|-------------|----------------|
| Above target | `--nex-neutral-900` | `--nex-success-600` | `--nex-success-500` |
| At target (90-100%) | `--nex-neutral-900` | `--nex-neutral-600` | `--nex-primary-500` |
| Below target (<90%) | `--nex-neutral-900` | `--nex-warning-600` | `--nex-warning-500` |
| Critical (<70%) | `--nex-danger-600` | `--nex-danger-600` | `--nex-danger-500` |

#### Comparison Period
- **Primary:** Today vs. yesterday same day
- **Secondary:** vs. daily target
- **Trend Arrow:** ▲ positive, ▼ negative

#### Empty State
- "No sales today" in `--nex-text-tertiary`
- Icon grayscale, reduced opacity

#### Loading State
- Skeleton rectangle matching card size
- Shimmer animation, `1.5s` loop

---

### 2.2 Monthly Revenue

#### Purpose
Total revenue for the current month. Answers: "How much revenue did we generate this month?"

#### Priority
**CRITICAL** — Core financial health metric

#### Visualization
```
┌─────────────────────────────────────────┐
│ 📊 Monthly Revenue                  [→]  │
│                                         │
│           SAR 2,145,000                 │
│           ▲ 8% vs last month            │
│                                         │
│   Target: SAR 2,500,000                 │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░  ██ 86%          │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `trending-up` (Lucide), `16px`, `--nex-primary-500` |
| Value Format | `SAR X,XXX,XXX` with thousands separator |
| Trend | vs same period last month |
| Target | Monthly target from settings |

#### Status Colors
| Condition | Value Color | Trend Color |
|-----------|-------------|-------------|
| Above target | `--nex-neutral-900` | `--nex-success-600` |
| At target (80-100%) | `--nex-neutral-900` | `--nex-neutral-600` |
| Below target (<80%) | `--nex-neutral-900` | `--nex-warning-600` |
| Critical (<60%) | `--nex-danger-600` | `--nex-danger-600` |

#### Comparison Period
- **Primary:** Month-to-date vs. last month same period
- **Secondary:** vs. monthly revenue target
- **Trend Arrow:** ▲ positive, ▼ negative

#### Empty State
- "No revenue this month" — check sales setup

#### Loading State
- Skeleton with large number placeholder

---

### 2.3 Monthly Profit

#### Purpose
Net profit for the current month. Answers: "How profitable are we this month?"

#### Priority
**CRITICAL** — Bottom-line health indicator

#### Visualization
```
┌─────────────────────────────────────────┐
│ 📈 Monthly Profit                   [→]  │
│                                         │
│           SAR 380,000                   │
│           ▲ 15% vs last month           │
│                                         │
│   Margin: 17.7%                         │
│   vs Target: 15%                        │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  ██ Above       │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `pie-chart` (Lucide), `16px`, `--nex-success-500` |
| Secondary | Profit margin percentage, bold |
| Comparison | vs last month margin |
| Target Line | Target margin % |

#### Status Colors
| Condition | Value Color | Margin Color |
|-----------|-------------|--------------|
| Above target margin | `--nex-neutral-900` | `--nex-success-600` |
| At target (10-15%) | `--nex-neutral-900` | `--nex-neutral-600` |
| Below target (<10%) | `--nex-danger-600` | `--nex-warning-600` |
| Loss (negative) | `--nex-danger-600` | `--nex-danger-600` |

#### Comparison Period
- **Primary:** Month-to-date vs. last month
- **Secondary:** vs. profit margin target
- **Trend Arrow:** ▲ positive, ▼ negative

#### Empty State
- "No profit data available" — ensure costs are recorded

#### Loading State
- Skeleton with dual placeholder (value + margin)

---

### 2.4 Cash Balance

#### Purpose
Total available cash across all bank and cash accounts. Answers: "How much cash do we have?"

#### Priority
**CRITICAL** — Liquidity indicator

#### Visualization
```
┌─────────────────────────────────────────┐
│ 💵 Cash Balance                     [→]  │
│                                         │
│           SAR 850,000                   │
│           ▼ 5% vs last week             │
│                                         │
│   Bank: SAR 720K • Cash: SAR 130K       │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  ██ Healthy    │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `wallet` (Lucide), `16px`, `--nex-info-500` |
| Secondary | Bank + Cash breakdown |
| Health Indicator | Text label: Healthy / Fair / Critical |

#### Status Colors
| Condition | Value Color | Indicator |
|-----------|-------------|-----------|
| Healthy (>3 months expenses) | `--nex-neutral-900` | Green |
| Fair (1-3 months expenses) | `--nex-neutral-900` | Amber |
| Critical (<1 month expenses) | `--nex-danger-600` | Red |

#### Comparison Period
- **Primary:** Current vs. last week
- **Secondary:** vs. 3-month expense reserve
- **Trend Arrow:** ▲ positive, ▼ negative

#### Empty State
- "No bank accounts configured"

#### Loading State
- Skeleton with value placeholder

---

### 2.5 Accounts Receivable

#### Purpose
Total outstanding customer invoices. Answers: "Who owes us money?"

#### Priority
**HIGH** — Cash flow impact

#### Visualization
```
┌─────────────────────────────────────────┐
│ 🧾 Accounts Receivable              [→]   │
│                                         │
│           SAR 320,000                   │
│           12 invoices outstanding       │
│                                         │
│   Overdue: SAR 45K (3 invoices)         │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░  ██ Fair        │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `user-check` (Lucide), `16px`, `--nex-primary-500` |
| Secondary | Invoice count, overdue amount |
| Health Indicator | Green/Amber/Red based on days outstanding |

#### Status Colors
| Condition | Value Color | Health |
|-----------|-------------|--------|
| Healthy (<30 days avg) | `--nex-neutral-900` | Green |
| Fair (30-60 days avg) | `--nex-neutral-900` | Amber |
| Critical (>60 days avg) | `--nex-danger-600` | Red |

#### Comparison Period
- **Primary:** Current outstanding vs. last month
- **Secondary:** vs. 30-day target
- **Trend Arrow:** ▲ increasing (bad), ▼ decreasing (good)

#### Empty State
- "No outstanding invoices"

#### Loading State
- Skeleton with value + count placeholders

---

### 2.6 Accounts Payable

#### Purpose
Total outstanding supplier invoices. Answers: "What do we owe?"

#### Priority
**HIGH** — Cash outflow visibility

#### Visualization
```
┌─────────────────────────────────────────┐
│ 💳 Accounts Payable                 [→]   │
│                                         │
│           SAR 180,000                   │
│           8 invoices due                │
│                                         │
│   Due this week: SAR 95K                │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  ██ Good         │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `credit-card` (Lucide), `16px`, `--nex-neutral-600` |
| Secondary | Invoice count, due this week |
| Health Indicator | Green/Amber/Red based on due dates |

#### Status Colors
| Condition | Value Color | Health |
|-----------|-------------|--------|
| Healthy (>7 days until due) | `--nex-neutral-900` | Green |
| Fair (1-7 days until due) | `--nex-neutral-900` | Amber |
| Critical (overdue) | `--nex-danger-600` | Red |

#### Comparison Period
- **Primary:** Current outstanding vs. last month
- **Secondary:** vs. payment capacity
- **Trend Arrow:** ▲ increasing (watch), ▼ decreasing (good)

#### Empty State
- "No pending payables"

#### Loading State
- Skeleton with value + count placeholders

---

## 3. Operations KPI Cards

### 3.1 Inventory Value

#### Purpose
Total monetary value of inventory on hand. Answers: "What is our inventory worth?"

#### Priority
**HIGH** — Asset health indicator

#### Visualization
```
┌─────────────────────────────────────────┐
│ 📦 Inventory Value                  [→]   │
│                                         │
│           SAR 4,250,000                 │
│           ▲ 3% vs last month             │
│                                         │
│   Items: 2,450 SKUs                     │
│   Warehouses: 3                         │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `package` (Lucide), `16px`, `--nex-warning-500` |
| Secondary | SKU count, warehouse count |
| Valuation Note | "At cost" or "At market" tooltip |

#### Status Colors
| Condition | Value Color | Trend |
|-----------|-------------|-------|
| Normal | `--nex-neutral-900` | Neutral |
| Increasing (seasonal) | `--nex-neutral-900` | `--nex-info-600` |
| Decreasing fast | `--nex-neutral-900` | `--nex-warning-600` |

#### Comparison Period
- **Primary:** Current vs. last month
- **Secondary:** vs. budgeted inventory value
- **Trend Arrow:** ▲ increasing, ▼ decreasing

#### Empty State
- "No inventory recorded"

#### Loading State
- Skeleton with large number placeholder

---

### 3.2 Inventory Turnover

#### Purpose
How many times inventory is sold and replaced. Answers: "How fast are we selling?"

#### Priority
**HIGH** — Efficiency metric

#### Visualization
```
┌─────────────────────────────────────────┐
│ 🔄 Inventory Turnover               [→]   │
│                                         │
│           6.8x/year                     │
│           ▲ 0.8x vs last quarter        │
│                                         │
│   Target: 6x/year                        │
│   Days: 54 days                         │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `refresh-cw` (Lucide), `16px`, `--nex-info-500` |
| Secondary | Target turnover, average days |
| Calculation | COGS / Average Inventory Value |

#### Status Colors
| Condition | Value Color | Indicator |
|-----------|-------------|-----------|
| Above target | `--nex-neutral-900` | Green |
| At target | `--nex-neutral-900` | Amber |
| Below target | `--nex-warning-600` | Red |

#### Comparison Period
- **Primary:** Current quarter vs. last quarter
- **Secondary:** vs. industry benchmark or target
- **Trend Arrow:** ▲ positive (faster turnover), ▼ negative (slower)

#### Empty State
- "No inventory transactions this period"

#### Loading State
- Skeleton with value + "x/year" placeholder

---

### 3.3 Purchase Orders

#### Purpose
Number of open purchase orders. Answers: "How many POs are active?"

#### Priority
**MEDIUM** — Operational visibility

#### Visualization
```
┌─────────────────────────────────────────┐
│ 🛒 Purchase Orders                  [→]   │
│                                         │
│           12 Open                       │
│           SAR 450,000 value             │
│                                         │
│   Pending approval: 3                   │
│   Expected delivery: 8 this week        │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `shopping-cart` (Lucide), `16px`, `--nex-primary-500` |
| Count | `--nex-text-3xl`, `--nex-weight-bold` |
| Secondary | Total value, pending approval, delivery count |

#### Status Colors
| Condition | Count Color | Indicator |
|-----------|-------------|-----------|
| Normal | `--nex-neutral-900` | Green |
| High (>20 open) | `--nex-neutral-900` | Amber |
| Critical (>50 open) | `--nex-warning-600` | Red |

#### Comparison Period
- **Primary:** Current open count vs. last week
- **Secondary:** vs. average open count
- **Trend Arrow:** ▲ increasing, ▼ decreasing

#### Empty State
- "No purchase orders"

#### Loading State
- Skeleton with large number placeholder

---

### 3.4 Sales Orders

#### Purpose
Number of open sales orders. Answers: "How many sales are pending?"

#### Priority
**MEDIUM** — Revenue pipeline visibility

#### Visualization
```
┌─────────────────────────────────────────┐
│ 📋 Sales Orders                      [→]   │
│                                         │
│           8 Open                        │
│           SAR 320,000 value             │
│                                         │
│   Pending delivery: 5                   │
│   Expected shipment: 3 this week        │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `file-text` (Lucide), `16px`, `--nex-primary-500` |
| Count | `--nex-text-3xl`, `--nex-weight-bold` |
| Secondary | Total value, pending delivery, shipment count |

#### Status Colors
| Condition | Count Color | Indicator |
|-----------|-------------|-----------|
| Normal | `--nex-neutral-900` | Green |
| High (>15 open) | `--nex-neutral-900` | Amber |
| Critical (>30 open) | `--nex-warning-600` | Red |

#### Comparison Period
- **Primary:** Current open count vs. last week
- **Secondary:** vs. average open count
- **Trend Arrow:** ▲ increasing, ▼ decreasing

#### Empty State
- "No sales orders"

#### Loading State
- Skeleton with large number placeholder

---

### 3.5 Open Quotations

#### Purpose
Number of open sales quotations awaiting response. Answers: "How many quotes are pending?"

#### Priority
**MEDIUM** — Sales pipeline health

#### Visualization
```
┌─────────────────────────────────────────┐
│ 📝 Open Quotations                   [→]   │
│                                         │
│           15 Open                       │
│           SAR 890,000 potential         │
│                                         │
│   Expiring this week: 4                 │
│   Oldest: 12 days                       │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `message-square` (Lucide), `16px`, `--nex-secondary-500` |
| Count | `--nex-text-3xl`, `--nex-weight-bold` |
| Secondary | Potential value, expiring soon count, age |

#### Status Colors
| Condition | Count Color | Urgency |
|-----------|-------------|---------|
| Normal | `--nex-neutral-900` | None |
| Warning (>10 expiring soon) | `--nex-warning-600` | Amber |
| Critical (>5 expiring this week) | `--nex-danger-600` | Red |

#### Comparison Period
- **Primary:** Current open count vs. last month
- **Secondary:** vs. conversion target
- **Trend Arrow:** ▲ increasing (more pipeline), ▼ decreasing

#### Empty State
- "No open quotations"

#### Loading State
- Skeleton with large number placeholder

---

## 4. KPI Card Interaction Standards

### 4.1 Hover Behavior

| Property | Value |
|----------|-------|
| Shadow | `--nex-shadow-md` |
| Transform | `translateY(-2px)` |
| Transition | `150ms ease-out` |
| Border | `1px solid --nex-border-strong` |

### 4.2 Click Behavior

| Action | Feedback |
|--------|----------|
| Click card | Navigate to detailed report |
| Click arrow icon | Same as card click |
| Click progress bar | Opens target settings (future) |

### 4.3 Focus Behavior

| Property | Value |
|----------|-------|
| Outline | `2px solid --nex-primary-500` |
| Offset | `-2px` |
| Tab | Included in keyboard navigation |

---

## 5. KPI Card Layout Rules

### 5.1 Card Grid

| Breakpoint | Cards per Row | Card Size | Layout |
|------------|---------------|-----------|--------|
| Desktop (>1280px) | 8 | 180×140px | Single row, no scroll |
| Laptop (1024-1280px) | 4 | 160×120px | 2 rows |
| Tablet (768-1023px) | 2 | 50%×120px | 4 rows |
| Mobile (<768px) | 1 | full-width×100px | Horizontal scroll |

### 5.2 Card Spacing

| Property | Value |
|----------|-------|
| Card Gap | 20px |
| Row Gap | 20px |
| Section Gap (below KPIs) | 24px |

### 5.3 Card Priority Order

| Row | Cards | Rationale |
|-----|-------|-----------|
| Row 1 | Today's Sales, Monthly Revenue, Monthly Profit, Cash Balance | Financial health first |
| Row 2 | Accounts Receivable, Accounts Payable, Inventory Value, Purchase Orders | Operations second |

---

## 6. Data Refresh Standards

### 6.1 Refresh Frequency

| KPI Category | Frequency | Method |
|--------------|-----------|--------|
| Financial KPIs | Every 15 minutes | Auto-refresh |
| Sales KPIs | Every 5 minutes | Auto-refresh |
| Inventory KPIs | Every 10 minutes | Auto-refresh |
| Operations KPIs | Every 10 minutes | Auto-refresh |

### 6.2 Refresh Behavior

| Element | Behavior |
|---------|----------|
| Value Update | Previous value fades out, new fades in (`200ms`) |
| Trend Change | Arrow animates to new direction |
| Progress Bar | Smooth width transition (`300ms`) |
| Context Change | All cards show loading skeleton, then refresh |

---

## 7. Empty & Error States

### 7.1 Empty State

| Property | Value |
|----------|-------|
| Icon | Same as normal, but grayscale, `--nex-neutral-300` |
| Value Text | "No data" in `--nex-text-tertiary` |
| Secondary | Helpful suggestion in `--nex-text-sm`, `--nex-neutral-500` |
| Background | `#FFFFFF` (unchanged) |

### 7.2 Error State

| Property | Value |
|----------|-------|
| Border | `1px solid --nex-border-error` |
| Background | `--nex-danger-50` |
| Icon | `alert-circle`, `--nex-danger-500` |
| Value Text | "Unable to load" in `--nex-danger-700` |
| Retry | "Retry" link, `--nex-primary-600` |

---

## 8. Accessibility

### 8.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 minimum |
| Touch Target | Minimum 40×40px for entire card |
| Focus Indicator | 2px solid `--nex-primary-500`, offset -2px |
| Keyboard Navigation | Full card clickable via keyboard |
| Screen Reader | `aria-label="Today's Sales: SAR 45,230, up 12% vs yesterday"` |

### 8.2 ARIA Attributes

| Element | ARIA |
|---------|------|
| Card container | `role="article"`, `aria-label="KPI description with value and trend"` |
| Value | `aria-live="polite"` for dynamic updates |
| Trend | `aria-label="Trend: up 12% vs yesterday"` |
| Loading | `aria-busy="true"` during load |

---

## 9. Design Token Mapping

All tokens reference Nexora Design System v1.0:

| Token Category | Token Name | Value |
|----------------|------------|-------|
| Card Background | `--nex-surface-elevated` | `#FFFFFF` |
| Card Border | `--nex-border-default` | `#E5E5E5` |
| Card Radius | `--nex-radius-lg` | `12px` |
| Card Shadow | `--nex-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` |
| Card Hover Shadow | `--nex-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.06)` |
| KPI Value | `--nex-text-3xl` | `1.875rem / 30px` |
| KPI Label | `--nex-text-xs` | `0.75rem / 12px` |
| Trend Positive | `--nex-success-600` | `#059669` |
| Trend Negative | `--nex-danger-600` | `#DC2626` |
| Progress Fill | `--nex-primary-600` | `#2563EB` |
| Progress Background | `--nex-neutral-200` | `#E5E5E5` |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial Executive KPI specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ KPI implementations must adhere to this document.

---

*This document is the single source of truth for Nexora Pulse KPI cards. Any deviation requires written approval from Design System Architecture.*
