# Nexora ERP Sidebar UX Specification
## Official Navigation Component
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** All Nexora ERP v1.0+ interfaces  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## 1. Sidebar Purpose & Principles

### 1.1 Purpose

The Nexora Sidebar is the **primary navigation spine** of the platform. It provides:

- **Spatial orientation** — Users always know where they are
- **Efficient access** — Core workflows one click away
- **Contextual awareness** — Company, branch, warehouse switchers at the top
- **AI entry point** — Nexora Pulse and AI features prominently placed
- **Scalability** — Supports multi-entity, multi-warehouse, future mobile

### 1.2 Design Principles

1. **Breathing Room** — Generous padding, never cramped
2. **Progressive Disclosure** — Show workspaces, reveal pages on expansion
3. **Persistent Context** — Company/branch/warehouse always visible
4. **AI Prominence** — Nexora Pulse and AI Center are first-class citizens, not buried
5. **Graceful Collapse** — Collapsed mode must remain fully functional
6. **Keyboard First** — Full keyboard navigation without mouse
7. **RTL Native** — Symmetric behavior in Arabic and English

---

## 2. Sidebar Anatomy

### 2.1 Structural Zones

```
┌─────────────────────────────┐
│  🏢 Company Switcher        │  <- Zone A: Context Switchers
│  🏠 Branch Selector         │
│  📦 Warehouse Selector      │
├─────────────────────────────┤
│  🔍 Search (optional)       │  <- Zone B: Quick Access
│  ⭐ Favorites                │
│  🕐 Recent Pages             │
├─────────────────────────────┤
│                             │
│  ▸ Workspace Groups          │  <- Zone C: Main Navigation
│    ▸ Dashboard               │
│    ▸ Inventory               │
│    ▸ Purchasing              │
│    ▸ ...                    │
│                             │
├─────────────────────────────┤
│  🔔 Notifications (4)       │  <- Zone D: System Actions
│  ⚙️ Settings                │
│  👤 User Profile             │
│  🚪 Logout                   │
└─────────────────────────────┘
```

### 2.2 Zone Definitions

| Zone | Purpose | Height Behavior | Interaction |
|------|---------|-----------------|-------------|
| **A — Context Switchers** | Multi-company, branch, warehouse selection | Fixed top | Dropdown selectors |
| **B — Quick Access** | Search, pinned favorites, recent pages | Fixed below context | Expandable panels |
| **C — Main Navigation** | Workspace groups and pages | Scrollable middle | Accordion expansion |
| **D — System Actions** | Notifications, settings, profile, logout | Fixed bottom | Icon actions |

---

## 3. Dimensions & States

### 3.1 Expanded Mode (Default)

| Property | Value | Usage |
|----------|-------|-------|
| Width | `260px` | Desktop default |
| Item Height | `36px` | Navigation items |
| Icon Size | `18px` | Lucide icons |
| Icon-Text Gap | `8px` | Space between icon and label |
| Left Padding | `12px` | Item content padding |
| Right Padding | `12px` | Item content padding |
| Group Header Height | `28px` | Workspace group label |
| Badge Size | `16px` height | Notification counters |

**Expanded Mode Content:**
- Full workspace group labels
- Page names visible
- Badges fully visible
- Context switcher labels visible
- User name and role visible

---

### 3.2 Collapsed Mode

| Property | Value | Usage |
|----------|-------|-------|
| Width | `72px` | Collapsed sidebar |
| Item Height | `36px` | Navigation items |
| Icon Size | `20px` | Slightly larger for touch |
| Centering | Flex center | Icons centered in width |
| Tooltip | On hover | Shows item name |
| Badge Position | Top-right of icon | Notification dot/badge |

**Collapsed Mode Content:**
- Icons only, no text
- Context switchers show abbreviated initials or flags
- Notifications show dot indicator
- User shows avatar initial
- Tooltips on all interactive elements (400ms delay)

---

### 3.3 Icon-Only / Mobile Mode

| Property | Value | Usage |
|----------|-------|-------|
| Width | `64px` | Mobile bottom nav or icon rail |
| Item Height | `48px` | Larger touch target |
| Icon Size | `22px` | Prominent icons |
| Label Position | Below icon | Only for active item |
| Badges | Right side | Notification badges |

---

## 4. Context Switchers (Zone A)

### 4.1 Purpose

Nexora ERP supports multi-entity operations. Context switchers maintain spatial awareness across companies, branches, and warehouses.

### 4.2 Components

#### Company Switcher
- **Position:** Top of sidebar, always visible
- **Icon:** `building-2` (Lucide)
- **Display:** Company name in expanded mode, company initial in collapsed mode
- **Interaction:** Dropdown with search
- **Badge:** None by default, optional dot for "has unread alerts"
- **Keyboard:** `Ctrl+Shift+C` to focus
- **RTL:** Icon stays left, text aligns right

#### Branch Selector
- **Position:** Below company switcher
- **Icon:** `map-pin` (Lucide)
- **Display:** Branch name or "All Branches"
- **Dependency:** Filters based on selected company
- **Interaction:** Dropdown, max-height 280px with scroll

#### Warehouse Selector
- **Position:** Below branch selector
- **Icon:** `warehouse` (Lucide)
- **Display:** Warehouse name or "All Warehouses"
- **Dependency:** Filters based on selected company and branch
- **Special:** "Current" option highlights active warehouse

### 4.3 Context Switcher Rules

- **Never hide** in collapsed mode — use initials or icons
- **Always show active selection** — never blank or "Select..."
- **Cascading filters** — Company → Branch → Warehouse
- **Persist selection** per user, per session
- **Loading state:** Skeleton placeholder while data loads

---

## 5. Workspace Groups (Zone C)

### 5.1 Group Definitions

| Group | Purpose | Icon | Expansion | Default Open | Badge Support |
|-------|---------|------|-----------|--------------|---------------|
| **Dashboard** | Nexora Pulse, overview widgets, KPI summary | `layout-dashboard` | Accordion | Yes | Live data indicator |
| **Inventory** | Stock management, bin tracking, stock entries | `package-open` | Accordion | No | Item count badge |
| **Purchasing** | Purchase orders, suppliers, receiving | `shopping-cart` | Accordion | No | PO count badge |
| **Sales** | Sales orders, customers, deliveries | `trending-up` | Accordion | No | SO count badge |
| **Suppliers** | Supplier management, contracts, performance | `truck` | Accordion | No | Active supplier count |
| **Customers** | Customer profiles, pricing tiers, loyalty | `users` | Accordion | No | Customer count |
| **Pricing** | Price lists, margins, promotions | `tag` | Accordion | No | Update badge |
| **Analytics** | Reports, dashboards, AI insights | `bar-chart-3` | Accordion | No | New insight badge |
| **Reports** | Standard and custom reports | `file-text` | Accordion | No | Scheduled report count |
| **AI Center** | AI recommendations, decision support, training | `brain` | Accordion | Yes | Pulse indicator |
| **Administration** | Users, roles, settings, integrations | `settings` | Accordion | No | Update badge |

### 5.2 Group Structure

Each workspace group contains:

```
▼ Dashboard                                    <- Group Header
  ─────────────────────────────────           <- Divider
  ◆ Nexora Pulse                               <- Page Link (active)
  ◇ Executive Overview                         <- Page Link
  ◇ Operational Summary                        <- Page Link
  ◆ Analytics                                   <- Nested Group (optional)
    ◇ Inventory Analytics
    ◇ Sales Analytics
    ◇ Supplier Performance
```

### 5.3 Group Behavior

#### Expansion Rules
- **Click:** Toggle expand/collapse
- **Keyboard:** `Enter` or `Space` toggles, `→` opens group, `←` closes group
- **Hover:** Slight highlight on group header
- **Active Group:** Group containing active page stays expanded
- **Single Group Open:** Optional — allow multiple groups open simultaneously (recommended for power users)

#### Group Headers
- **Height:** `28px`
- **Padding:** `0 12px`
- **Font:** `--nex-text-sm`, `--nex-weight-medium`
- **Color:** `--nex-text-secondary` (`#525252`)
- **Hover Color:** `--nex-text-primary` (`#171717`)
- **Chevron:** `8px` Lucide `chevron-right`, rotates `90deg` when expanded
- **Divider:** `1px solid --nex-border-subtle` below header

---

## 6. Page Links

### 6.1 Page Link Anatomy

```
┌──────────────────────────┐
│ ◆ Nexora Pulse            │  <- Icon (16px) + Label + Active Indicator
└──────────────────────────┘
```

| Element | Expanded | Collapsed |
|---------|----------|-----------|
| Icon | `16px`, left-aligned | `20px`, centered |
| Label | Full page name | Tooltip on hover |
| Active Indicator | `3px` left border, `--nex-primary-500` | Bottom `3px` border, `--nex-primary-500` |
| Hover Background | `--nex-hover-bg` | None (tooltip only) |
| Height | `36px` | `36px` |
| Padding | `0 12px` | `0` |

### 6.2 Page Link States

#### Default
- Background: transparent
- Text: `--nex-text-secondary`
- Icon: `--nex-neutral-600`
- Active indicator: none

#### Hover
- Background: `--nex-hover-bg` (`#F5F5F5`)
- Text: `--nex-text-primary`
- Icon: `--nex-text-primary`
- Transition: `120ms ease-in`

#### Focus
- Background: transparent
- Outline: `2px solid --nex-primary-500`, offset `-2px`
- Text: `--nex-text-primary`
- Keyboard-only: same as hover + outline

#### Selected / Active
- Background: `--nex-selected-bg` (`#EFF6FF`)
- Text: `--nex-selected-text` (`#1D4ED8`)
- Icon: `--nex-primary-600`
- Active indicator: `3px solid --nex-primary-500` on left edge
- Font weight: `--nex-weight-medium` (500)

#### Disabled
- Background: transparent
- Text: `--nex-text-disabled`
- Icon: `--nex-neutral-400`
- Opacity: `0.5`
- Cursor: `not-allowed`

### 6.3 Page Link Rules

- **Maximum visible items per group:** 7 before "Show More" overflow
- **Active page:** Always visible, group auto-expands
- **External links:** Open in new tab, icon changes to `external-link`
- **Divider:** `1px solid --nex-border-subtle` between groups within a workspace

---

## 7. Pinned Pages & Favorites

### 7.1 Pinned Pages

- **Location:** Top of sidebar, below context switchers
- **Section Label:** "PINNED" (all caps), `--nex-text-xs`, `--nex-weight-medium`, `--nex-neutral-500`
- **Display:** Horizontal row of icon buttons (when collapsed) or vertical list (when expanded)
- **Ordering:** User-draggable, persisted per user
- **Maximum:** 8 pinned items
- **Icon:** `pin` icon on hover for remove option

### 7.2 Favorites

- **Location:** Below pinned pages in Zone B
- **Section Label:** "FAVORITES" (all caps)
- **Add to favorites:** Star icon on any page link
- **Remove from favorites:** Click star again
- **Empty state:** "No favorites yet" text, `--nex-text-sm`, `--nex-neutral-400`

### 7.3 Recent Pages

- **Location:** Below favorites in Zone B
- **Section Label:** "RECENT" (all caps)
- **Ordering:** Most recently visited first, max 10 items
- **Duration:** Last 7 days
- **Clear:** "Clear all" link on hover
- **Current page:** Excluded from recent list

---

## 8. Notifications (Zone D)

### 8.1 Notification Badge

- **Position:** Top-right of bell icon
- **Shape:** `16px` circle, `--nex-radius-full`
- **Background:** `--nex-danger-600`
- **Text:** White, `--nex-text-xs`, `--nex-weight-bold`
- **Maximum display:** `99+`
- **Animation:** Subtle pulse when count changes

### 8.2 Notification Panel

Clicking the bell opens a dropdown panel:

| Property | Value |
|----------|-------|
| Width | `360px` |
| Max Height | `480px` with scroll |
| Header | "Notifications", `--nex-text-base`, `--nex-weight-semibold` |
| Item Height | `56px` |
| Item Padding | `12px 16px` |
| Unread Indicator | `3px` left border, `--nex-primary-500` |
| Hover | `--nex-hover-bg` |
| Timestamp | `--nex-text-xs`, `--nex-text-tertiary` |
| Empty State | Bell icon + "No notifications" |

---

## 9. User Profile & Logout

### 9.1 User Profile Card

- **Position:** Bottom of sidebar, above logout
- **Expanded Mode:** Avatar (32px) + Full Name + Role + Company
- **Collapsed Mode:** Avatar only (32px), tooltip on hover
- **Avatar:** Circular, `--nex-radius-full`, background `--nex-primary-100`, text `--nex-primary-700`
- **Initials:** First letter of first name + first letter of last name
- **Dropdown:** Click opens profile menu (Profile, Settings, Billing, Logout)

### 9.2 Logout

- **Position:** Very bottom of sidebar, below user profile
- **Separator:** `1px solid --nex-border-default` above
- **Icon:** `log-out` (Lucide)
- **Label:** "Logout" in expanded mode, tooltip in collapsed
- **Hover:** `--nex-danger-50` background, `--nex-text-danger` text
- **Confirmation:** No inline confirmation — logout is immediate with session timeout safety

---

## 10. Search (Zone B)

### 10.1 Global Search

- **Position:** Top of Zone B, always visible
- **Expanded Mode:** Full text input with magnifying glass icon
- **Collapsed Mode:** Search icon button only, expands on click
- **Placeholder:** "Search pages, records, AI..." (English), "بحث..." (Arabic)
- **Shortcut:** `Ctrl+K` or `Cmd+K` to focus
- **Results dropdown:** Below search, max-height `320px`

### 10.2 Search Results

| Element | Spec |
|---------|------|
| Result Item | Icon + Page Name + Path breadcrumb |
| Group Header | "Pages", "Records", "AI Suggestions" |
| AI Suggestions | Special section with sparkles icon |
| Keyboard Nav | `↑↓` browse, `Enter` select, `Esc` close |
| Empty State | "No results found" |

---

## 11. Interaction Design

### 11.1 Hover States

| Element | Hover Behavior | Transition |
|---------|----------------|------------|
| Page Link | Background `--nex-hover-bg`, text `--nex-text-primary` | `120ms ease-in` |
| Group Header | Text darkens to `--nex-text-primary` | `120ms ease-in` |
| Context Switcher | Background `--nex-hover-bg` | `120ms ease-in` |
| Icon Button | Background `--nex-hover-bg` | `120ms ease-in` |
| Notification Bell | Subtle scale `1.05` | `150ms ease-out` |

### 11.2 Click Behavior

| Element | Click Action | Feedback |
|---------|--------------|---------|
| Page Link | Navigate to page, update active state | Immediate, no animation |
| Group Header | Toggle expand/collapse | Chevron rotates `180ms` |
| Context Switcher | Open dropdown | Dropdown slides down `150ms` |
| Notification Bell | Open notification panel | Panel fades in `120ms` |
| Pinned Item | Navigate to page | Same as page link |
| Favorite Star | Toggle favorite | Star fills/unfills with `200ms` transition |

### 11.3 Focus States

| Element | Focus Style | Keyboard Equivalent |
|---------|-------------|---------------------|
| Page Link | `2px solid --nex-primary-500` outline, offset `-2px` | `Tab` |
| Group Header | Same as page link | `Tab` |
| Context Switcher | Same as page link | `Ctrl+Shift+C` |
| Icon Button | Same as page link | `Tab` |
| Search Input | Same as page link, plus internal cursor | `Ctrl+K` |

**Focus Rules:**
- Only one element has focus at a time (roving tabindex pattern)
- Focus wraps within the sidebar (`Tab` cycles, `Shift+Tab` reverse)
- Collapsed mode: `Tab` cycles through icons only
- Expanded mode: `Tab` cycles through all interactive elements

### 11.4 Selected / Active States

- **Active page:** `--nex-selected-bg` background, `--nex-selected-text` color, `3px` left border `--nex-primary-500`
- **Active group:** Chevron points down, group stays expanded
- **Context persistence:** Active page updates when navigating
- **Deep linking:** URL parameter updates active state on page load
- **Browser history:** Back/forward updates active indicator without sidebar reload

---

## 12. Keyboard Navigation

### 12.1 Keyboard Map

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Move focus to next interactive element | Global |
| `Shift+Tab` | Move focus to previous element | Global |
| `Enter` / `Space` | Activate focused element (link, button, group) | Global |
| `↑` / `↓` | Navigate within list (pages, search results) | Lists |
| `←` / `→` | Collapse/expand focused group, browse tabs | Groups/Tabs |
| `Ctrl+Shift+C` | Focus company switcher | Global |
| `Ctrl+K` / `Cmd+K` | Focus global search | Global |
| `Esc` | Close dropdowns, collapse expanded groups, clear search | Global |
| `Home` | Move focus to first item | Lists |
| `End` | Move focus to last item | Lists |
| `0` (zero) | Toggle sidebar collapse/expand | Global |

### 12.2 Roving Tabindex

- Sidebar uses **roving tabindex** pattern
- Only visible/active items in tab sequence
- Arrow keys move focus within container
- `Tab` exits sidebar to main content
- Collapsed mode: only icons in tab sequence

---

## 13. RTL Behavior

### 13.1 Mirroring Rules

| Property | LTR | RTL |
|----------|-----|-----|
| Sidebar Position | Left | Right |
| Active Indicator | Left border (`border-left`) | Right border (`border-right`) |
| Chevron Direction | Points right when collapsed | Points left when collapsed |
| Icon Alignment | Left of text | Right of text |
| Context Switcher Chevron | Right side | Left side |
| Search Input | Magnifying glass left | Magnifying glass right |
| Notification Badge | Top-right of icon | Top-left of icon |

### 13.2 RTL Typography

- Font family: `'IBM Plex Sans Arabic', 'Inter', sans-serif`
- Text alignment: Right-aligned
- Line height: `+0.1` from standard
- Letter spacing: `+0.01em` for headlines
- No justification — left align allowed for mixed content

### 13.3 RTL Spacing

- All spacing values unchanged
- Logical properties preferred: `margin-inline-start`, `padding-inline-end`
- Physical properties flipped: `margin-left` ↔ `margin-right`

---

## 14. Responsive Behavior

### 14.1 Breakpoints

| Breakpoint | Width | Sidebar Behavior |
|------------|-------|------------------|
| **Desktop** | `> 1280px` | Expanded by default, collapsible |
| **Laptop** | `1024px - 1280px` | Expanded by default, collapsible |
| **Tablet** | `768px - 1023px` | Collapsed by default, icon-only rail |
| **Mobile** | `< 768px` | Bottom navigation bar, hidden sidebar |

### 14.2 Desktop (>1280px)

- **Default:** Expanded (`260px`)
- **Collapse trigger:** Hamburger menu or `0` key
- **Overlay:** None — sidebar pushes content
- **Hover effects:** Full

### 14.3 Laptop (1024px-1280px)

- **Default:** Expanded (`260px`)
- **Collapse trigger:** Hamburger menu or `0` key
- **Overlay:** Optional — sidebar pushes content
- **Group labels:** Visible but slightly smaller text

### 14.4 Tablet (768px-1023px)

- **Default:** Collapsed (`72px` icon rail)
- **Expand trigger:** Hamburger menu, expands as overlay
- **Overlay:** Semi-transparent backdrop, sidebar slides over content
- **Touch targets:** `44×44px` minimum
- **Pinned pages:** Horizontal scroll if needed

### 14.5 Mobile (<768px)

- **Sidebar:** Hidden by default
- **Navigation:** Bottom tab bar (5 most used items)
- **More menu:** Bottom bar "More" opens full sidebar overlay
- **Context switchers:** Moved to top header, not in sidebar
- **Touch targets:** `48px` height, `44px` minimum
- **Swipe:** Swipe from left edge (LTR) / right edge (RTL) opens sidebar

### 14.6 Mobile Bottom Tab Bar

| Tab | Icon | Purpose |
|-----|------|---------|
| Pulse | `activity` | Nexora Pulse home |
| Inventory | `package-open` | Inventory |
| Purchasing | `shopping-cart` | Purchasing |
| Analytics | `bar-chart-3` | Analytics |
| More | `more-horizontal` | Full menu |

---

## 15. Animation & Motion

### 15.1 Sidebar Transitions

| Transition | Duration | Easing | Trigger |
|------------|----------|--------|---------|
| Expand/Collapse width | `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Toggle |
| Group expand/collapse | `150ms` | `ease-out` | Click/Keyboard |
| Dropdown open | `120ms` | `ease-out` | Click |
| Dropdown close | `100ms` | `ease-in` | Blur/Esc |
| Notification panel | `120ms` | `ease-out` | Click |
| Tooltip appear | `200ms` | `ease-out` | Hover (400ms delay) |
| Badge pulse | `600ms` | `ease-in-out` | Count change |

### 15.2 Micro-interactions

| Interaction | Behavior |
|-------------|----------|
| Page link hover | Background fill `120ms`, text color `120ms` |
| Group header hover | Text color `120ms`, chevron subtle movement |
| Active indicator | Appears on page load, no animation |
| Notification badge | Subtle scale pulse on new notification |
| Context switcher | Chevron rotate `180ms` on toggle |
| Collapse/expand | Width animates, icons fade/scale |

### 15.3 Motion Rules

- **No bounce effects** — use `cubic-bezier(0.4, 0, 0.2, 1)` only
- **Respect `prefers-reduced-motion`** — disable all animations if user preference set
- **Staggered reveals** — Group items appear sequentially on expand (`40ms` delay between items)
- **No layout shift** — Reserve space for badges, labels, tooltips

---

## 16. Accessibility

### 16.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 minimum against background |
| Focus Indicator | `2px solid --nex-primary-500`, offset `-2px` |
| Touch Target Size | Minimum `40×40px` |
| Keyboard Navigation | Full functionality without mouse |
| Screen Reader | `aria-label` on all icon-only elements |
| Semantic HTML | `<nav>`, `<ul>`, `<li>`, `<button>`, `<a>` |
| RTL Support | Logical properties, directional icons |

### 16.2 ARIA Attributes

| Element | ARIA |
|---------|------|
| Sidebar container | `role="navigation"`, `aria-label="Main"` |
| Workspace group | `role="group"`, `aria-expanded="true/false"` |
| Page link | `aria-current="page"` when active |
| Context switcher | `aria-label="Company switcher"` |
| Search input | `role="search"`, `aria-label="Global search"` |
| Notification bell | `aria-label="Notifications"`, `aria-badge="4"` |
| Collapse button | `aria-label="Collapse sidebar"`, `aria-expanded="true/false"` |
| Favorite button | `aria-label="Pin to favorites"`, `aria-pressed="true/false"` |

### 16.3 Screen Reader Announcements

- Group expansion: "Dashboard expanded, 6 pages"
- Notification count: "4 unread notifications"
- Context change: "Switched to Al-Jawhara Company, Riyadh Branch"
- Page navigation: "Navigated to Nexora Pulse"

---

## 17. AI Modules in Sidebar

### 17.1 AI Center Group

The AI Center workspace group gets special visual treatment:

| Element | Treatment |
|---------|-----------|
| Group Icon | `brain` with subtle `--nex-secondary-500` tint |
| Active Page Background | Gradient: `--nex-secondary-50` to transparent |
| Live Indicator | Pulsing dot, `--nex-accent-500`, 2s animation loop |
| New Feature Badge | "NEW" pill, `--nex-secondary-100` bg, `--nex-secondary-700` text |

### 17.2 AI Features List

| Page | Purpose | Icon |
|------|---------|------|
| Nexora Pulse | Intelligent home experience | `activity` |
| AI Recommendations | Actionable insights | `lightbulb` |
| Decision Support | AI-assisted decisions | `brain` |
| Predictive Analytics | Forecasting, demand planning | `trending-up` |
| Supplier Intelligence | AI-powered supplier insights | `truck` |
| Pricing Optimizer | AI-driven pricing suggestions | `tag` |
| Anomaly Detection | Unusual pattern alerts | `alert-triangle` |

---

## 18. Future Mobile Considerations

### 18.1 Mobile-First Adaptations

- **Bottom Navigation:** 5-tab bar for core workflows
- **Swipe Gestures:** Left/right to reveal sidebar overlay
- **Context Switchers:** Moved to top header dropdowns
- **AI Features:** Prominent in bottom nav ("Pulse" tab)
- **Notifications:** Badge on bell icon in top header

### 18.2 Tablet Adaptations

- **Icon Rail:** Collapsed sidebar as default
- **Hover Expansion:** Hovering over icon reveals tooltip with label
- **Touch Optimization:** Larger hit areas, `44px` minimum
- **Keyboard:** Reduced — touch primary, keyboard secondary

---

## 19. Implementation Notes

### 19.1 Component Structure

```
Sidebar
├── ContextSwitchers (Zone A)
│   ├── CompanySwitcher
│   ├── BranchSwitcher
│   └── WarehouseSwitcher
├── QuickAccess (Zone B)
│   ├── SearchInput
│   ├── PinnedPages
│   └── RecentPages
├── WorkspaceNavigation (Zone C)
│   └── WorkspaceGroup[] (accordion)
│       └── PageLink[]
└── SystemActions (Zone D)
    ├── Notifications
    ├── Settings
    ├── UserProfile
    └── Logout
```

### 19.2 State Management

- **Active page:** Derived from current route
- **Expanded groups:** Persisted per user, stored in user preferences
- **Pinned pages:** Persisted per user
- **Favorites:** Persisted per user
- **Recent pages:** Session-based + stored history (7 days)
- **Context selection:** Persisted per user, per session

### 19.3 Performance

- **Virtualization:** Not required — Max ~200 items, well within DOM limits
- **Lazy loading:** Expand group content only when needed
- **Search indexing:** Client-side debounced search (300ms), indices preloaded
- **Transition optimization:** Use `transform` and `opacity` only, avoid layout properties

---

## 20. Design Token Mapping

All tokens reference the official Nexora Design System v1.0:

| Token Category | Token Name | Value |
|----------------|------------|-------|
| Width (expanded) | `--nex-sidebar-width` | `260px` |
| Width (collapsed) | `--nex-sidebar-width-collapsed` | `72px` |
| Item Height | `--nex-sidebar-item-height` | `36px` |
| Icon Size | `--nex-sidebar-icon-size` | `18px` |
| Badge Size | `--nex-sidebar-badge-size` | `16px` |
| Active Indicator Width | `--nex-sidebar-active-width` | `3px` |
| Page Item Padding | `--nex-sidebar-item-padding` | `0 12px` |
| Transition Duration | `--nex-sidebar-transition` | `200ms` |
| Transition Easing | `--nex-sidebar-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial sidebar UX specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ sidebar implementations must adhere to this document.

---

*This document is the single source of truth for Nexora ERP sidebar navigation. Any deviation requires written approval from Design System Architecture.*
