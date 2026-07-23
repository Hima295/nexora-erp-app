# Nexora Operational Intelligence UX Specification
## Official Widget Standards
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** Nexora ERP v1.0+ Pulse operational intelligence widgets  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## 1. Operational Intelligence Philosophy

### 1.1 Purpose

Operational Intelligence transforms raw ERP data into actionable operational clarity. These widgets answer the daily questions warehouse managers, purchasers, and sales teams ask every morning.

**Design Philosophy:**
- **Action-Oriented** — Every widget suggests or enables next action
- **Scannable** — Critical signals visible in 2 seconds
- **Contextual** — Always filtered by company and branch
- **Consistent** — Same anatomy, same interaction, same hierarchy

### 1.2 Widget Anatomy

```
┌─────────────────────────────────────────┐
│ ICON  Title                    [Action] │
├─────────────────────────────────────────┤
│                                         │
│           Primary Value / Count         │
│           ▲ 12% vs yesterday            │
│                                         │
│   [Secondary data / chart / list]       │
│                                         │
│   Footer: timestamp or detail           │
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
| **Min Height** | `160px` |
| **Max Height** | `auto` (content-driven) |

### 1.3 Multi-Company Context Indicator

Every widget displays its data scope clearly:

| Position | Display | Style |
|----------|---------|-------|
| Top-right corner | Company initial badge | `--nex-text-xs`, `--nex-neutral-400` |
| Or bottom-left | "Data for: Al-Jawhara Motors • Riyadh" | `--nex-text-xs`, `--nex-neutral-400` |

**Rules:**
- All widgets filter by selected company automatically
- Changing company refreshes all widgets with loading skeleton
- Changing branch updates widget data instantly
- No widget shows cross-company aggregated data unless explicitly selected

---

## 2. Widget Priority & Hierarchy

### 2.1 Priority Matrix

| Priority | Level | Visual Treatment | Examples |
|----------|-------|------------------|----------|
| **P1** | Critical | Colored left border, alert icon, bold count | Out of Stock, Late Suppliers |
| **P2** | Warning | Yellow left border, caution icon | Low Stock, Pending POs |
| **P3** | Informational | Neutral icon, standard layout | Fast Moving, Top Customers |
| **P4** | Reference | Minimal icon, compact layout | Warehouse Performance, Top Brands |

### 2.2 Visual Hierarchy Rules

| Element | P1 (Critical) | P2 (Warning) | P3 (Info) | P4 (Reference) |
|---------|---------------|--------------|-----------|----------------|
| Left Border | `3px solid --nex-danger-500` | `3px solid --nex-warning-500` | `1px solid --nex-border-default` | `1px solid --nex-border-default` |
| Icon Color | `--nex-danger-500` | `--nex-warning-500` | `--nex-primary-500` | `--nex-neutral-500` |
| Title Weight | `--nex-weight-bold` | `--nex-weight-semibold` | `--nex-weight-medium` | `--nex-weight-medium` |
| Count Badge | `--nex-danger-50` bg, `--nex-danger-700` text | `--nex-warning-50` bg, `--nex-warning-700` text | None | None |

---

## 3. Inventory Intelligence Widgets

### 3.1 Low Stock

**Question Answered:** What items need reordering?

**Priority:** P2 — Warning

```
┌─────────────────────────────────────────┐
│ ⚠️ Low Stock (5 items)            [→]   │
│                                         │
│   • Brake Pad BP-5678 — 12 left         │
│     Min: 50 • Reorder: 100 units        │
│                                         │
│   • Oil Filter OF-1234 — 8 left         │
│     Min: 20 • Reorder: 50 units         │
│                                         │
│   • Spark Plug SP-9012 — 3 left         │
│     Min: 30 • Reorder: 50 units         │
│                                         │
│   [View All Low Stock Items]            │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `alert-triangle`, `--nex-warning-500` |
| Title | `--nex-text-sm`, `--nex-weight-semibold`, `--nex-text-tertiary` |
| Count Badge | `--nex-warning-50` bg, `--nex-warning-700` text, `--nex-radius-full` |
| List Item | Item name, current stock, minimum, suggested reorder |
| Max Visible | 3 items, "View All" link |
| Color Treatment | `--nex-warning-50` left border `3px solid --nex-warning-500` |
| Data Scope | Current warehouse only (or all warehouses) |

**Interaction:**
- Click card → Opens low stock report with filters
- Click item → Opens item detail
- "View All" → Full filtered list

**States:**
- Default: Yellow warning treatment
- Hover: `--nex-shadow-md`, `translateY(-2px)`
- Loading: Skeleton bars, 3 placeholder rows
- Empty: "No low stock items — inventory is healthy" with green check icon

---

### 3.2 Out of Stock

**Question Answered:** What items are completely unavailable?

**Priority:** P1 — Critical

```
┌─────────────────────────────────────────┐
│ ❌ Out of Stock (2 items)          [→]   │
│                                         │
│   • Spark Plug SP-9012                  │
│     Last stocked: 5 days ago            │
│     Suggested reorder: 100 units         │
│                                         │
│   • Air Filter AC-3456                   │
│     Last stocked: 12 days ago           │
│     Suggested reorder: 50 units          │
│                                         │
│   [Create Purchase Order]               │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `x-circle`, `--nex-danger-500` |
| Title | `--nex-text-sm`, `--nex-weight-semibold`, `--nex-text-tertiary` |
| Count Badge | `--nex-danger-50` bg, `--nex-danger-700` text |
| List Item | Item name, last stocked, suggested reorder |
| Action Button | "Create PO" if user has permission |
| Color Treatment | `--nex-danger-50` left border `3px solid --nex-danger-500` |

**Interaction:**
- Click card → Opens out of stock report
- Click "Create PO" → Opens PO creation form with pre-filled items
- Click item → Opens item detail

**States:**
- Default: Red critical treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "All items in stock" with green check

---

### 3.3 Dead Stock

**Question Answered:** What inventory is sitting idle?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 🕐 Dead Stock (SAR 45,000)         [→]   │
│                                         │
│   23 SKUs with no sales in 90+ days      │
│                                         │
│   • Engine Oil EO-100 — 50 units         │
│     Value: SAR 5,000 • 180 days idle     │
│                                         │
│   • Belt BL-200 — 30 units               │
│     Value: SAR 3,000 • 120 days idle     │
│                                         │
│   [Review Dead Stock]                    │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `clock`, `--nex-neutral-500` |
| Title | `--nex-text-sm`, `--nex-weight-semibold`, `--nex-neutral-500` |
| Primary Value | Total value locked in dead stock |
| Secondary | SKU count, average idle days |
| Definition | No sales in 90+ days (configurable) |
| Action | "Review" opens list for discount/disposal |

**Interaction:**
- Click card → Opens dead stock report
- Click "Review" → Bulk action interface
- Click item → Opens item detail

**States:**
- Default: Neutral gray treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton with value placeholder
- Empty: "No dead stock detected" with neutral icon

---

### 3.4 Slow Moving Items

**Question Answered:** What inventory is not selling?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 📉 Slow Moving Items (15 SKUs)      [→]   │
│                                         │
│   • Engine Oil EO-100 — 2/month          │
│     Stock: 50 • 25 months supply         │
│                                         │
│   • Belt BL-200 — 1/month                │
│     Stock: 30 • 30 months supply         │
│                                         │
│   [Review Slow Moving Items]             │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `trending-down`, `--nex-neutral-500` |
| Title | `--nex-text-sm`, `--nex-weight-semibold`, `--nex-neutral-500` |
| List | Item, velocity/month, stock, months of supply |
| Threshold | <X units/month (configurable) |
| Action | "Review" for discount/bundling |

**Interaction:**
- Click card → Opens slow moving report
- Click "Review" → Bulk discount/bundle interface

**States:**
- Default: Neutral treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "All items are moving at expected velocity"

---

### 3.5 Fast Moving Items

**Question Answered:** What is selling the fastest?

**Priority:** P3 — Positive signal

```
┌─────────────────────────────────────────┐
│ 🚀 Fast Moving Items (8 SKUs)       [→]   │
│                                         │
│   • Brake Pad BP-5678 — 340/week         │
│     Revenue: SAR 68,000 • Margin: 45%    │
│                                         │
│   • Oil Filter OF-1234 — 280/week        │
│     Revenue: SAR 42,000 • Margin: 38%    │
│                                         │
│   • Spark Plug SP-9012 — 190/week        │
│     Revenue: SAR 28,500 • Margin: 42%    │
│                                         │
│   [View Fast Moving Report]              │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `trending-up`, `--nex-success-500` |
| Title | `--nex-text-sm`, `--nex-weight-semibold`, `--nex-success-700` |
| Count | SKU count above threshold |
| List | Item, velocity/week, revenue, margin |
| Threshold | >X units/week (configurable) |
| Color Treatment | `--nex-success-50` left border |

**Interaction:**
- Click card → Opens fast moving report
- Click item → Opens item detail

**States:**
- Default: Green positive treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No fast moving items this period"

---

### 3.6 Warehouse Performance

**Question Answered:** Which warehouses are performing well?

**Priority:** P4 — Reference

```
┌─────────────────────────────────────────────────────────────┐
│ 🏭 Warehouse Performance                            [→]    │
│                                                             │
│   Main Warehouse                             94% ▓▓▓▓▓▓▓▓ │
│   Riyadh Warehouse                           78% ▓▓▓▓▓▓   │
│   Jeddah Warehouse                           82% ▓▓▓▓▓▓▓  │
│                                                             │
│   Avg Utilization: 85%                                      │
│   Total Capacity: 50,000 sqm                                │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `warehouse` (Lucide), `16px`, `--nex-primary-500` |
| Visualization | Horizontal progress bars per warehouse |
| Color Coding | Green (>90%), Amber (70-89%), Red (<70%) |
| Secondary | Average utilization, total capacity |
| Drill-down | Opens warehouse detail page |

**Interaction:**
- Click card → Opens warehouse performance report
- Click warehouse bar → Opens warehouse-specific inventory

**States:**
- Default: Neutral with colored bars
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars per warehouse
- Empty: "No warehouse data available"

---

## 4. Purchasing Intelligence Widgets

### 4.1 Pending Purchase Orders

**Question Answered:** What POs need attention?

**Priority:** P2 — Warning

```
┌─────────────────────────────────────────┐
│ 📋 Pending Purchase Orders (12)    [→]   │
│                                         │
│   • PO-2024-045 — AutoParts Co.         │
│     SAR 45,000 • Due: 2 days             │
│     Status: Approved                     │
│                                         │
│   • PO-2024-046 — Gulf Spare Parts       │
│     SAR 28,000 • Due: 5 days             │
│     Status: Pending Approval             │
│                                         │
│   • PO-2024-047 — Toyota Parts           │
│     SAR 32,000 • Due: 1 day              │
│     Status: Draft                        │
│                                         │
│   [View All Pending POs]                 │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `shopping-cart`, `--nex-primary-500` |
| Title | Includes count badge |
| List | PO number, supplier, amount, due in X days, status |
| Priority | Sort by due date (soonest first) |
| Max Visible | 3 items |
| Status Colors | Draft: `--nex-neutral-500`, Pending: `--nex-warning-500`, Approved: `--nex-success-500` |

**Interaction:**
- Click card → Opens pending POs report
- Click PO → Opens PO detail
- "View All" → Full PO list with filters

**States:**
- Default: Warning treatment (amber left border)
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No pending purchase orders" with green check

---

### 4.2 Supplier Performance

**Question Answered:** How are our suppliers performing?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 🚚 Supplier Performance            [→]    │
│                                         │
│   🏆 Top Performer: AutoParts Co.       │
│   On-time: 96% • Quality: 98%           │
│                                         │
│   ⚠️ Needs Attention: Al-Jawhara        │
│   On-time: 72% • Quality: 85%           │
│   5 days late on current PO              │
│                                         │
│   [View Supplier Report]                 │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `truck`, `--nex-info-500` |
| Top Performer | Name, on-time %, quality % |
| At-Risk | Name, metrics, reason |
| Scoring | On-time delivery, quality rate, response time |
| Drill-down | Supplier performance report |

**Interaction:**
- Click card → Opens supplier performance dashboard
- Click supplier name → Opens supplier detail

**States:**
- Default: Neutral treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No supplier data available"

---

### 4.3 Late Suppliers

**Question Answered:** Which suppliers are late?

**Priority:** P1 — Critical

```
┌─────────────────────────────────────────┐
│ ⚠️ Late Deliveries (2)             [→]   │
│                                         │
│   • Al-Jawhara Trading                  │
│     5 days late • PO-045 • 3 POs        │
│     Impact: SAR 120,000                  │
│                                         │
│   • Toyota Parts                         │
│     2 days late • PO-047 • 1 PO         │
│     Impact: SAR 32,000                   │
│                                         │
│   [Contact Suppliers]                    │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `alert-triangle`, `--nex-danger-500` |
| Count Badge | `--nex-danger-50` bg, `--nex-danger-700` text |
| List | Supplier, days late, PO count, financial impact |
| Action | "Contact" opens email template |

**Interaction:**
- Click card → Opens late deliveries report
- Click "Contact" → Opens email client with template
- Click supplier → Opens supplier detail

**States:**
- Default: Red critical treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No late deliveries — all suppliers on time" with green check

---

### 4.4 Incoming Shipments

**Question Answered:** What inventory is arriving soon?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 📦 Incoming Shipments (3 today)     [→]   │
│                                         │
│   • SHP-2024-089 — Jeddah Port          │
│     200 units brake pads • ETA: Today   │
│     From: AutoParts Co.                  │
│                                         │
│   • SHP-2024-090 — Riyadh Warehouse     │
│     50 units oil filters • ETA: Tomorrow │
│     From: Gulf Spare Parts               │
│                                         │
│   [View All Shipments]                   │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `truck`, `--nex-success-500` |
| Title | Includes count and date |
| List | Shipment ID, destination, units, ETA, supplier |
| Max Visible | 3 items |

**Interaction:**
- Click card → Opens shipments report
- Click shipment → Opens shipment detail
- "View All" → Full shipment tracker

**States:**
- Default: Green treatment (positive signal)
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No incoming shipments scheduled"

---

### 4.5 Containers

**Question Answered:** What containers are in transit?

**Priority:** P4 — Reference

```
┌─────────────────────────────────────────┐
│ 🚢 Containers in Transit (2)        [→]   │
│                                         │
│   • CN-2024-089 — From Germany          │
│     ETA: 5 Aug • 45 days remaining      │
│     Contents: 5,000 units brake pads    │
│                                         │
│   • CN-2024-091 — From Japan            │
│     ETA: 12 Aug • 52 days remaining     │
│     Contents: 2,000 units spark plugs   │
│                                         │
│   [Track Containers]                     │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `ship` (Lucide), `16px`, `--nex-info-500` |
| Title | Count of containers |
| List | Container ID, origin, ETA, days remaining, contents |
| Alert | Red if >35 days remaining |
| Action | "Track" opens tracking page |

**Interaction:**
- Click card → Opens container tracker
- Click container → Opens container detail
- "Track" → Full tracking view

**States:**
- Default: Neutral treatment
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No containers in transit"

---

## 5. Sales Intelligence Widgets

### 5.1 Sales Trend

**Question Answered:** How are sales performing over time?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────────────────────────┐
│ 📈 Sales Trend (30 days)                        [→]        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │     [Line Chart — 160px height]                      │   │
│   │                                                     │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   Total: SAR 1.2M • Avg/day: SAR 40,000                     │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `trending-up`, `--nex-primary-500` |
| Chart Type | Line chart, 30-day view |
| Height | `160px` |
| Primary Line | `--nex-primary-600`, `2px` stroke |
| Target Line | `--nex-neutral-400`, `1px` dashed |
| Fill | `--nex-primary-50` gradient under line |
| Data Points | Daily sales totals |
| Drill-down | Opens sales analytics page |

**Interaction:**
- Click card → Opens full sales analytics
- Hover chart → Tooltip with date, amount, vs target

**States:**
- Default: Clean chart with subtle grid
- Hover: `--nex-shadow-md`
- Loading: Skeleton rectangle with shimmer
- Empty: "No sales data for this period"

---

### 5.2 Top Customers

**Question Answered:** Who are our best customers?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 🏆 Top Customers (30 days)          [→]   │
│                                         │
│   1. AutoParts Co.                   28%  │
│      SAR 600,000 • 45 orders            │
│      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░            │
│                                         │
│   2. Gulf Spare Parts                22%  │
│      SAR 470,000 • 32 orders            │
│      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░             │
│                                         │
│   3. Toyota Parts                    18%  │
│      SAR 385,000 • 28 orders            │
│      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░              │
│                                         │
│   [View Customer Ranking]               │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `users`, `--nex-primary-500` |
| List | Rank, name, revenue, order count, % of total |
| Visualization | Horizontal bar per customer |
| Max Items | Top 5 |
| Drill-down | Customer analytics |

**Interaction:**
- Click card → Opens customer ranking report
- Click customer → Opens customer detail

**States:**
- Default: Clean list with bars
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No customer data available"

---

### 5.3 Top Products

**Question Answered:** What are our best-selling products?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────┐
│ 📦 Top Products (30 days)            [→]   │
│                                         │
│   1. Brake Pad BP-5678                8%  │
│      340 units • SAR 68,000             │
│                                         │
│   2. Oil Filter OF-1234               7%  │
│      280 units • SAR 42,000             │
│                                         │
│   3. Spark Plug SP-9012               5%  │
│      190 units • SAR 28,500             │
│                                         │
│   [View Product Ranking]                │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `package`, `--nex-success-500` |
| List | Rank, item name, part number, units, revenue, % |
| Max Items | Top 5 |
| Drill-down | Product analytics |

**Interaction:**
- Click card → Opens product ranking report
- Click product → Opens item detail

**States:**
- Default: Clean list
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No product sales this period"

---

### 5.4 Top Brands

**Question Answered:** Which brands sell best?

**Priority:** P4 — Reference

```
┌─────────────────────────────────────────┐
│ 🏷️ Top Brands (30 days)              [→]   │
│                                         │
│   1. Bosch                           28%  │
│      SAR 600,000 • 1,240 units          │
│                                         │
│   2. Continental                      22%  │
│      SAR 470,000 • 980 units            │
│                                         │
│   3. Denso                           18%  │
│      SAR 385,000 • 820 units            │
│                                         │
│   [View Brand Analysis]                 │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `tag`, `--nex-secondary-500` |
| List | Rank, brand name, revenue, units sold, % |
| Max Items | Top 5 |
| Drill-down | Brand performance report |

**Interaction:**
- Click card → Opens brand analysis
- Click brand → Opens brand-specific report

**States:**
- Default: Clean list
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars
- Empty: "No brand data available"

---

### 5.5 Sales by Branch

**Question Answered:** How are branches performing?

**Priority:** P3 — Informational

```
┌─────────────────────────────────────────────────────────────┐
│ 🏢 Sales by Branch (30 days)                    [→]        │
│                                                             │
│   Main Branch — Riyadh                     45%             │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  SAR 540K                     │
│                                                             │
│   Riyadh Branch                            32%             │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  SAR 384K                           │
│                                                             │
│   Jeddah Branch                            23%             │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  SAR 276K                             │
│                                                             │
│   Total: SAR 1.2M                                           │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Icon | `map-pin`, `--nex-primary-500` |
| Visualization | Horizontal bar chart |
| Data | Revenue, order count, avg order value per branch |
| Max Items | All branches |
| Drill-down | Branch-specific sales report |

**Interaction:**
- Click card → Opens branch performance report
- Click branch bar → Opens branch-specific dashboard

**States:**
- Default: Clean horizontal bars
- Hover: `--nex-shadow-md`
- Loading: Skeleton bars per branch
- Empty: "No branch data available"

---

## 6. Recent Activity Timeline

### 6.1 Purpose

Show the latest business events in chronological order. Gives users confidence that the system is alive and operational.

### 6.2 Design

```
┌───────────────────────────────────────────────────────────────┐
│ Recent Activity                                     [View All] │
├───────────────────────────────────────────────────────────────┤
│                                                              │
│  ● New Sales Order SO-001 — AutoParts Co.                    │
│    SAR 12,400 • Created by Ahmed • 2 minutes ago            │
│                                                              │
│  ── ● PO-045 Approved by Manager                            │
│    SAR 45,000 • AutoParts Co. • 15 minutes ago              │
│                                                              │
│  ── ✨ AI: Supplier delay risk detected                       │
│    Al-Jawhara Trading • 3 hours ago                          │
│                                                              │
│  ── ● Stock Entry: 120 brake pads received                   │
│    Warehouse: Main • 1 hour ago                              │
│                                                              │
└───────────────────────────────────────────────────────────────┘
```

### 6.3 Timeline Anatomy

| Element | Specification |
|---------|---------------|
| Container | Full-width card, `--nex-radius-lg`, `--nex-shadow-sm` |
| Header | `--nex-text-base`, `--nex-weight-semibold`, "View All" link |
| Timeline Line | `2px solid --nex-border-subtle`, left-aligned, `24px` from left |
| Timeline Dot | `12px` circle, `--nex-radius-full`, centered on line |
| Dot Colors | `--nex-primary-500` (sales), `--nex-success-500` (purchase), `--nex-warning-500` (inventory), `--nex-secondary-500` (AI) |
| Item Title | `--nex-text-sm`, `--nex-weight-medium` |
| Item Description | `--nex-text-sm`, `--nex-text-secondary` |
| Timestamp | `--nex-text-xs`, `--nex-text-tertiary` |
| Separator | `1px solid --nex-border-subtle` between items |
| Max Items | 5 visible, "View All" link |

### 6.4 Activity Type Matrix

| Type | Dot Color | Icon | Priority | Display Format |
|------|-----------|------|----------|----------------|
| Sales | `--nex-primary-500` | `file-text` | Medium | "New Sales Order SO-001 — Customer Name • Amount • Time" |
| Purchase | `--nex-success-500` | `shopping-cart` | Medium | "PO-045 Approved • Supplier • Amount • Time" |
| Inventory | `--nex-warning-500` | `package` | Medium | "Stock Entry: X units received • Warehouse • Time" |
| Approval | `--nex-primary-400` | `check-circle` | High | "Document approved by User • Type • Time" |
| System | `--nex-neutral-400` | `settings` | Low | "System event description • Time" |
| Error | `--nex-danger-500` | `alert-octagon` | Critical | "Error: description • Time" |

### 6.5 Activity Rules
- **Ordering:** Most recent first
- **Grouping:** By day (Today, Yesterday, This Week)
- **Time Format:** "2 minutes ago", "1 hour ago", "yesterday"
- **Click:** Opens related record
- **Drill-down:** "View All" opens full activity log with filters
- **Real-time:** New items appear via WebSocket with slide-in animation

---

## 7. Quick Actions Panel

### 7.1 Purpose

One-tap access to the most common operational tasks without navigating through menus.

### 7.2 Design

```
┌───────────────────────────────────────────┐
│  Quick Actions                             │
├───────────────────────────────────────────┤
│  [ + New Invoice] [ + PO] [ + Receive]    │
│  [ + Transfer] [ + Customer] [ + Supplier]│
│  [ 🖨 Barcode] [ 📊 Reports]              │
└───────────────────────────────────────────┘
```

### 7.3 Panel Specification

| Property | Value |
|----------|-------|
| Card Size | `240px` width, `auto` height |
| Layout | Horizontal scroll on mobile, 2×4 grid on desktop |
| Button Height | `36px` |
| Button Padding | `8px 14px` |
| Font | `--nex-text-sm`, `--nex-weight-medium` |
| Border Radius | `--nex-radius-md` (`8px`) |
| Border | `1px solid --nex-border-default` |
| Background | `#FFFFFF` |
| Hover | `--nex-hover-bg`, border `--nex-border-strong` |
| Icon Size | `14px` |
| Icon-Text Gap | `6px` |

### 7.4 Quick Actions List

| Action | Icon | Module | Shortcut |
|--------|------|--------|----------|
| New Sales Invoice | `file-plus` | Sales | `Ctrl+Alt+I` |
| New Purchase Order | `shopping-cart` | Purchasing | `Ctrl+Alt+P` |
| Receive Stock | `package` | Inventory | `Ctrl+Alt+R` |
| Transfer Inventory | `arrow-right-left` | Inventory | `Ctrl+Alt+T` |
| Add Customer | `user-plus` | Sales | `Ctrl+Alt+C` |
| Add Supplier | `truck` | Purchasing | `Ctrl+Alt+S` |
| Print Barcode | `barcode` | Inventory | `Ctrl+Alt+B` |
| View Reports | `bar-chart-3` | Analytics | `Ctrl+Alt+V` |

### 7.5 Quick Actions Rules
- **Max 8 actions** visible, "More" overflow if needed
- **Ordered by frequency** of use per user role
- **Permission-aware:** Actions filtered by user permissions
- **Context-aware:** Actions adapt to selected company/branch
- **Loading:** Form/modal opens immediately, loading state inside form

---

## 8. Layout & Priority Rules

### 8.1 Desktop Layout (>1280px)

| Zone | Priority | Content | Height |
|------|----------|---------|--------|
| Row 1 — Left | HIGH | Inventory Intelligence | 320px |
| Row 1 — Center | HIGH | Purchasing Intelligence | 320px |
| Row 1 — Right | HIGH | Sales Intelligence | 320px |
| Row 2 — Left | MEDIUM | Recent Activity | 180px |
| Row 2 — Right | MEDIUM | Quick Actions | 180px |

### 8.2 Laptop Layout (1024px-1280px)

| Zone | Priority | Content | Height |
|------|----------|---------|--------|
| Row 1 | HIGH | Inventory + Purchasing stacked | auto |
| Row 2 | HIGH | Sales Intelligence | auto |
| Row 3 | MEDIUM | Activity + Quick Actions side by side | 180px |

### 8.3 Tablet Layout (768px-1023px)

| Zone | Priority | Content | Height |
|------|----------|---------|--------|
| Tabs | ALL | [Inventory] [Purchasing] [Sales] [Activity] | auto |
| Content | ALL | Tab content, stacked | auto |
| Quick Actions | MEDIUM | Bottom of active tab | auto |

### 8.4 Mobile Layout (<768px)

| Zone | Priority | Content | Height |
|------|----------|---------|--------|
| Tabs | ALL | [Inventory] [Purchasing] [Sales] [More] | 48px |
| Content | ALL | Full-width stacked cards | auto |
| Quick Actions | MEDIUM | Bottom sheet or horizontal scroll | auto |

---

## 9. Interaction Standards

### 9.1 Hover Behavior

| Widget Type | Hover Effect | Transition |
|-------------|--------------|------------|
| List Widget | `--nex-shadow-md`, `translateY(-2px)` | 150ms ease-out |
| Chart Widget | `--nex-shadow-md` | 150ms ease-out |
| Timeline Item | Background `--nex-hover-bg` | 120ms ease-in |
| Quick Action | `--nex-hover-bg`, border `--nex-border-strong` | 120ms ease-in |

### 9.2 Click Behavior

| Widget Type | Click Action | Feedback |
|-------------|--------------|---------|
| List Widget | Expands list or opens related page | Expand or navigate |
| Chart Widget | Opens full analytics page | Navigation |
| Timeline Item | Opens related record | Navigation |
| Quick Action | Opens creation form in modal | Modal open |

### 9.3 Loading Behavior

| Widget Type | Loading State |
|-------------|---------------|
| List Widget | Skeleton bars matching list item height |
| Chart Widget | Skeleton rectangle with shimmer |
| Timeline | 3-4 skeleton timeline items |
| Quick Actions | Dimmed, disabled state |

---

## 10. Data Refresh Standards

### 10.1 Refresh Frequency

| Widget Category | Frequency | Method |
|-----------------|-----------|--------|
| Inventory | Every 10 minutes | Auto-refresh |
| Purchasing | Every 10 minutes | Auto-refresh |
| Sales | Every 5 minutes | Auto-refresh |
| Activity | Real-time | WebSocket push |
| Quick Actions | On-demand | Click only |

### 10.2 Refresh Behavior

| Element | Behavior |
|---------|----------|
| Value Update | Previous value fades out, new fades in (200ms) |
| New Activity | Slides in from top with 150ms animation |
| List Update | New items append to bottom |
| Context Change | All widgets show loading skeleton, then refresh |

---

## 11. Accessibility

### 11.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 minimum |
| Touch Target | Minimum 40×40px for all interactive elements |
| Focus Indicator | 2px solid `--nex-primary-500`, offset -2px |
| Keyboard Navigation | Full drill-down and action access |
| Screen Reader | `aria-label` on all icon-only elements |

### 11.2 ARIA Structure

| Element | ARIA |
|---------|------|
| Widget container | `role="article"`, `aria-label="Widget description"` |
| Activity timeline | `role="list"`, items `role="listitem"` |
| Drill-down link | `aria-label="View detailed [type] report"` |
| Loading state | `aria-busy="true"`, `aria-live="polite"` |

---

## 12. Error Handling

### 12.1 Error States

| Scenario | Behavior |
|----------|----------|
| Data load fail | "Unable to load [widget]. [Retry]" in `--nex-danger-700` |
| Partial data | Show available data, "Some data unavailable" note |
| Timeout | Previous data remains visible, "Updating..." indicator |
| Permission denied | "You don't have permission to view this data" |

### 12.2 Error Display

| Property | Value |
|----------|-------|
| Border | `1px solid --nex-border-error` |
| Background | `--nex-danger-50` |
| Icon | `alert-circle`, `--nex-danger-500` |
| Retry Button | `--nex-text-sm`, `--nex-primary-600` |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial operational intelligence specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ operational intelligence implementations must adhere to this document.

---

*This document is the single source of truth for Nexora Pulse operational intelligence widgets. Any deviation requires written approval from Design System Architecture.*
