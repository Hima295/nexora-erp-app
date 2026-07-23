# Nexora ERP Header System UX Specification
## Official Top Navigation Component
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** All Nexora ERP v1.0+ interfaces  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## 1. Header Purpose & Principles

### 1.1 Purpose

The Nexora Header is the **command center of the workspace**. It provides:

- **Persistent context** — Company, branch, and warehouse always visible
- **Global access** — Search, create, and AI available from any screen
- **System awareness** — Notifications, tasks, connection status at a glance
- **User control** — Profile, language, theme, logout always accessible
- **Brand presence** — Nexora identity anchored at the top

### 1.2 Design Principles

1. **Context First** — Company/branch/warehouse are the primary elements, not afterthoughts
2. **Progressive Disclosure** — Show essentials, reveal more on interaction
3. **Instant Feedback** — Every action confirms within 100ms
4. **Keyboard Native** — Full keyboard access without mouse dependency
5. **RTL Symmetric** — Identical behavior in Arabic and English
6. **Responsive Graceful** — Content adapts, never breaks
7. **AI Prominent** — AI Assistant is a first-class citizen, not buried in menus

---

## 2. Header Anatomy

### 2.1 Structural Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] Company [▼]   Branch [▼]   Warehouse [●]   [Search............] [🔍]│
│                     [Quick Create ▾]   [AI] 🔴   🔔 (4)   ✓ Tasks   👤 ⚙️ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Zone Definitions

| Zone | Position | Content | Width Behavior |
|------|----------|---------|----------------|
| **Z1 — Brand & Context** | Left | Logo, Company, Branch, Warehouse | Fixed priority, flexible distribution |
| **Z2 — Global Actions** | Center/Right | Search, Quick Create, AI Assistant | Expands to fill available space |
| **Z3 — System & User** | Far Right | Notifications, Tasks, Profile, Theme, Lang, Connection | Fixed width, equal distribution |

### 2.3 Height & Padding

| Property | Value | Usage |
|----------|-------|-------|
| Height | `56px` | **Fixed** — never changes |
| Horizontal Padding | `24px` | Left and right edges |
| Zone Gap | `16px` | Between major zones |
| Item Gap | `8px` | Between items within a zone |
| Vertical Centering | Flexbox center | All items vertically centered |

---

## 3. Brand & Context Zone (Z1)

### 3.1 Company Switcher

**Purpose:** The single most important element in the header. Always visible, always active.

| Property | Value | Usage |
|----------|-------|-------|
| Width | `200px` min, `240px` max | Adapts to company name length |
| Icon | `building-2` (Lucide), `18px` | Left-aligned |
| Display | Company name, truncated with ellipsis | Full name on hover/expand |
| Active Indicator | `4px` left border, `--nex-primary-500` only when dropdown closed | Visual anchor |
| Font | `--nex-text-sm`, `--nex-weight-semibold` | Prominent but not dominant |
| Color | `--nex-text-primary` | Highest readability |

**Interaction:**
- **Click:** Opens company dropdown panel
- **Hover:** Background `--nex-hover-bg`, `120ms` transition
- **Focus:** `2px solid --nex-primary-500` outline, offset `-2px`
- **Keyboard:** `Ctrl+Shift+C` focuses, `Enter` opens, `↑↓` navigates, `Esc` closes
- **Loading:** Skeleton shimmer while companies load
- **Empty:** "No companies available" with `--nex-text-tertiary`

**Dropdown Panel:**
| Property | Value |
|----------|-------|
| Width | `280px` |
| Max Height | `360px` with scroll |
| Header | "Switch Company", `--nex-text-base`, `--nex-weight-semibold` |
| Search | Input field, `Ctrl+K` within panel |
| Item Height | `36px` |
| Item Padding | `8px 12px` |
| Hover | `--nex-hover-bg` |
| Selected | `--nex-selected-bg`, left `3px` border `--nex-primary-500` |
| Company Info | Name + "Active" badge with `--nex-success-500` dot |

**Multi-Company Rules:**
- Active company always has checkmark icon, `--nex-primary-600`
- Switching company instantly reloads workspace with loading state
- Cannot switch company during unsaved changes — prompt first
- Non-admin users see only assigned companies
- Company color indicator: optional `6px` circle, custom per company

### 3.2 Branch Switcher

**Purpose:** Secondary context layer. Depends on selected company.

| Property | Value | Usage |
|----------|-------|-------|
| Width | `160px` min, `200px` max | Adapts to branch name |
| Icon | `map-pin` (Lucide), `16px` | Left-aligned |
| Display | Branch name or "All Branches" | Truncated with ellipsis |
| Font | `--nex-text-sm`, `--nex-weight-medium` | Slightly less prominent than company |
| Color | `--nex-text-secondary` | Secondary emphasis |
| Separator | `1px solid --nex-border-subtle`, `16px` height | Visual break from company |

**Interaction:**
- **Click:** Opens branch dropdown
- **Dependency:** Options filter based on selected company
- **Loading:** Skeleton while branches load
- **Empty:** "No branches for this company" if company has none
- **Keyboard:** Same pattern as company switcher

**Multi-Branch Rules:**
- Active branch highlighted with `--nex-selected-bg`
- "All Branches" option shows aggregated data across all branches
- Changing branch never affects another company's data scope
- Branch change is instant, no full page reload for data refresh

### 3.3 Warehouse Indicator

**Purpose:** Lightweight context indicator. Not a switcher — just shows current selection.

| Property | Value | Usage |
|----------|-------|-------|
| Width | `120px` | Fixed, truncates if needed |
| Icon | `warehouse` (Lucide), `14px` | Left-aligned |
| Display | Warehouse name or "All Warehouses" | Compact |
| Font | `--nex-text-xs`, `--nex-weight-medium` | Smallest in context zone |
| Color | `--nex-text-secondary` | De-emphasized |
| Badge | Optional `live` indicator, `--nex-accent-500` dot, 8px | Real-time sync indicator |

**Interaction:**
- **Click:** Opens warehouse dropdown (same pattern as branch)
- **Hover:** Becomes clickable, background `--nex-hover-bg`, cursor pointer
- **Loading:** Skeleton if loading
- **Keyboard:** `Ctrl+Shift+W` focuses

**Warehouse Rules:**
- Warehouse scope applies after branch selection
- "Current" option highlights warehouse where user is physically located (if tracked)
- Warehouse change applies only to current session unless saved
- Disabled state: `--nex-neutral-400` text, no interaction

---

## 4. Global Search (Z2)

### 4.1 Search Input

**Purpose:** Universal access point to any page, record, or AI feature.

| Property | Value | Usage |
|----------|-------|-------|
| Width | `320px` min, `480px` max | Grows with content |
| Height | `36px` | Compact, fits header |
| Icon | `search` (Lucide), `16px` | Left side, `--nex-neutral-400` |
| Placeholder | "Search pages, records, AI..." (EN) / "بحث..." (AR) | `--nex-text-tertiary` |
| Background | `--nex-neutral-100` | Subtle contrast |
| Border | `1px solid transparent`, focus: `1px solid --nex-border-focus` | Minimal by default |
| Border Radius | `--nex-radius-md` (`8px`) | Matches input family |
| Font | `--nex-text-sm` | Small but readable |
| Padding | `6px 12px 6px 32px` | Icon space + comfort |

**Interaction:**
- **Click:** Focuses input, clears placeholder
- **Type:** Debounced `300ms`, results appear below
- **Results Dropdown:** `360px` wide, max-height `320px`, shadow `--nex-shadow-lg`
- **Keyboard:** `↑↓` navigate results, `Enter` select, `Esc` close
- **Shortcut:** `Ctrl+K` or `Cmd+K` focuses from anywhere
- **Loading:** Spinner `16px` right-aligned, replaces clear button

### 4.2 Search Results

| Element | Spec |
|---------|------|
| Group Header | "PAGES", `--nex-text-xs`, `--nex-weight-semibold`, `--nex-text-tertiary`, ALL CAPS |
| Page Result | Icon + Page Name + Workspace breadcrumb |
| Record Result | DocType icon + Record name + `#ID` |
| AI Suggestion | `sparkles` icon, `--nex-secondary-500`, "AI Suggested" label |
| Keyboard Nav | Roving tabindex, `aria-activedescendant` |
| Empty State | "No results found for '[query]'" |
| Footer | "Advanced Search" link, `--nex-text-sm`, `--nex-text-link` |

---

## 5. Quick Create Button (Z2)

**Purpose:** Fast creation of common records without navigation.

| Property | Value | Usage |
|----------|-------|-------|
| Label | "Quick Create" | With dropdown chevron |
| Height | `32px` | Compact in header |
| Padding | `8px 12px` | Comfortable but small |
| Font | `--nex-text-sm`, `--nex-weight-medium` | Matches search |
| Border Radius | `--nex-radius-md` (`8px`) | Input family |
| Border | `1px solid --nex-border-default` | Subtle definition |
| Background | `#FFFFFF` | Elevated |
| Hover | `--nex-hover-bg`, border `--nex-border-strong` | `120ms` |
| Focus | `2px solid --nex-primary-500` outline | Keyboard |
| Icon | `plus` (Lucide), `14px`, right side | Secondary indicator |

**Dropdown Panel:**

| Property | Value |
|----------|-------|
| Width | `240px` |
| Max Height | `320px` with scroll |
| Grouping | By module: "Sales", "Purchasing", "Inventory", "HR", etc. |
| Item | Icon + Record Type name |
| Keyboard | `↑↓` navigate, `Enter` open form, `Esc` close |
| Recent | "Recent" section at top with last 5 created records |

**Quick Create Rules:**
- Maximum 12 items in dropdown
- Items ordered by frequency of use
- Keyboard shortcut: `Ctrl+N` or `Cmd+N` opens dropdown
- Form opens in modal with `--nex-shadow-xl`

---

## 6. AI Assistant Button (Z2)

**Purpose:** Entry point to Nexora Pulse and AI features.

| Property | Value | Usage |
|----------|-------|-------|
| Icon | `sparkles` (Lucide), `18px` | Primary identifier |
| Shape | `32px` circle | Distinct from rectangular buttons |
| Background | `--nex-secondary-500` | Brand accent |
| Icon Color | `#FFFFFF` | High contrast |
| Hover | `--nex-secondary-600`, scale `1.05` | `150ms ease-out` |
| Focus | `ring 2px --nex-secondary-400`, offset `2px` | Keyboard |
| Active | `--nex-secondary-700` | Pressed state |
| Live Indicator | `3px` dot, `--nex-accent-500`, bottom-right | AI processing state |

**Interaction:**
- **Click:** Opens AI Assistant panel/drawer
- **Hover:** Tooltip "AI Assistant", `200ms` delay
- **Keyboard:** `Ctrl+Shift+A` focuses, `Enter` opens
- **Loading:** Spinner inside button when AI is processing

**AI Button Rules:**
- Always visible in header, never hidden in overflow
- Pulsing live indicator when Nexora Pulse is active
- Badge with new feature count, max `9+`
- Positioned between Search and Notifications for right-hand flow

---

## 7. Notifications (Z3)

### 7.1 Notification Bell

| Property | Value | Usage |
|----------|-------|-------|
| Icon | `bell` (Lucide), `18px` | Standard |
| Size | `36px` touch target | Square hit area |
| Hover | `--nex-hover-bg`, `--nex-radius-md` | `120ms` |
| Focus | `2px solid --nex-primary-500` outline | Keyboard |
| Unread Badge | `16px` circle, `--nex-danger-600`, white text | Top-right of icon |
| Badge Max | `99+` | Overflow indicator |

**Interaction:**
- **Click:** Opens notification panel
- **Keyboard:** `Ctrl+Shift+N` focuses, `Enter` opens
- **Badge Animation:** Scale pulse on new notification, `300ms`

### 7.2 Notification Panel

| Property | Value |
|----------|-------|
| Width | `380px` |
| Max Height | `520px` with scroll |
| Position | Right-aligned dropdown |
| Shadow | `--nex-shadow-xl` |
| Border Radius | `--nex-radius-xl` (`16px`) |
| Header | "Notifications", `--nex-text-base`, `--nex-weight-semibold`, "Mark all read" link |
| Tabs | "All", "Unread", "Mentioned" |
| Item Height | `64px` |
| Item Padding | `12px 16px` |
| Unread | `2px` left border `--nex-primary-500`, `--nex-primary-50` background |
| Hover | `--nex-hover-bg` |
| Timestamp | `--nex-text-xs`, `--nex-text-tertiary` |
| Grouping | "Today", "Yesterday", "This Week", "Older" |
| Footer | "View all notifications" |
| Empty State | `bell` icon, "No notifications", `--nex-text-sm`, `--nex-text-tertiary` |

---

## 8. Tasks (Z3)

### 8.1 Tasks Icon

| Property | Value | Usage |
|----------|-------|-------|
| Icon | `check-square` (Lucide), `18px` | Standard |
| Size | `36px` touch target | Square hit area |
| Hover | `--nex-hover-bg`, `--nex-radius-md` | `120ms` |
| Focus | `2px solid --nex-primary-500` outline | Keyboard |
| Badge | `16px` circle, `--nex-primary-600`, white text | Pending task count |
| Badge Max | `99+` | Overflow |

**Interaction:**
- **Click:** Opens tasks dropdown/panel
- **Keyboard:** `Ctrl+Shift+T` focuses, `Enter` opens

### 8.2 Tasks Panel

| Property | Value |
|----------|-------|
| Width | `360px` |
| Max Height | `480px` with scroll |
| Header | "My Tasks", count badge, "Add task" button |
| Tabs | "Pending", "Completed", "Overdue" |
| Item | Checkbox + Task title + Due date + Priority tag |
| Priority Colors | High: `--nex-danger-500`, Medium: `--nex-warning-500`, Low: `--nex-success-500` |
| Complete | Checkbox toggles task, strikethrough animation `200ms` |
| Overdue | Red text, clock icon |
| Empty State | `check-square` icon, "No pending tasks" |

---

## 9. User Profile (Z3)

### 9.1 Profile Trigger

| Property | Value | Usage |
|----------|-------|-------|
| Avatar | `32px` circle, `--nex-radius-full` | Initials or photo |
| Avatar Background | `--nex-primary-100` | Default |
| Avatar Text | `--nex-primary-700`, `--nex-text-sm`, `--nex-weight-semibold` | Initials |
| Name | `--nex-text-sm`, `--nex-weight-medium` | Expanded mode only |
| Role | `--nex-text-xs`, `--nex-text-tertiary` | Expanded mode only |
| Chevron | `chevron-down` (Lucide), `14px` | Right side, expands/collapses |

**Interaction:**
- **Click:** Opens profile dropdown
- **Hover:** Background `--nex-hover-bg`, `120ms`
- **Keyboard:** `Ctrl+Shift+U` focuses, `Enter` opens
- **Focus:** `2px solid --nex-primary-500` outline

### 9.2 Profile Dropdown

| Property | Value |
|----------|-------|
| Width | `240px` |
| Position | Right-aligned, below trigger |
| Shadow | `--nex-shadow-lg` |
| Border Radius | `--nex-radius-lg` (`12px`) |
| Header | Avatar + Name + Role + Company |
| Menu Items | Profile, Settings, Billing, Help Center |
| Separator | `1px solid --nex-border-subtle` |
| Footer | Logout button, `--nex-text-danger`, `log-out` icon |
| Logout Hover | `--nex-danger-50` background |

### 9.3 Profile Rules

- Active user always visible in header
- Avatar shows online status dot (green = online, gray = offline)
- User menu respects RTL (mirrors position)

---

## 10. Language Switcher (Z3)

### 10.1 Language Trigger

| Property | Value | Usage |
|----------|-------|-------|
| Display | Language code: "EN", "AR", or globe icon | Compact |
| Icon | `globe` (Lucide), `16px` | Alternative to text |
| Font | `--nex-text-xs`, `--nex-weight-medium` | Small, unobtrusive |
| Hover | `--nex-hover-bg`, `120ms` | |
| Focus | `2px solid --nex-primary-500` outline | Keyboard |

**Dropdown:**

| Language | Code | Display |
|----------|------|---------|
| English | EN | EN |
| Arabic | AR | AR |
| (Future) | FR | FR |
| (Future) | DE | DE |

**Rules:**
- Changing language reloads page with new locale
- Preference persisted per user
- Icon-only mode on mobile, text on desktop

---

## 11. Theme Switcher (Z3)

### 11.1 Theme Trigger

| Property | Value | Usage |
|----------|-------|-------|
| Icon | `sun` (light), `moon` (dark), `monitor` (system) | Cycles through states |
| Size | `18px` | Consistent with other icons |
| Tooltip | "Light theme", "Dark theme", "System theme" | On hover |
| Hover | `--nex-hover-bg`, `120ms` | |
| Focus | `2px solid --nex-primary-500` outline | Keyboard |

**States:**
| State | Icon | Behavior |
|-------|------|----------|
| Light | `sun` | Active, `--nex-primary-600` tint |
| Dark | `moon` | Active, `--nex-secondary-500` tint |
| System | `monitor` | Follows OS preference, neutral |

**Rules:**
- Theme applies instantly, no reload
- Persisted per user, per device
- Dark mode uses Design System dark palette

---

## 12. Connection Status (Z3)

### 12.1 Status Indicator

| Property | Value | Usage |
|----------|-------|-------|
| Icon | `wifi` (Lucide), `16px` | Connected |
| Icon | `wifi-off` (Lucide), `16px` | Disconnected |
| Icon | `refresh-cw` (Lucide), `16px` | Reconnecting (spinning) |
| Color | `--nex-success-500` | Connected |
| Color | `--nex-danger-500` | Disconnected |
| Color | `--nex-warning-500` | Reconnecting |
| Tooltip | "Connected", "Offline — changes saved locally", "Reconnecting..." | On hover |

**Behavior:**
- **Online:** Green dot/wifi icon, no interruption
- **Offline:** Red indicator, banner may appear, local saving enabled
- **Reconnecting:** Spinning icon, `1s` animation loop, retry countdown
- **Syncing:** Brief `sync` icon when re-established

---

## 13. Header States

### 13.1 Loading State

| Element | Loading Behavior |
|---------|------------------|
| Company Switcher | Skeleton shimmer, `--nex-neutral-200` |
| Branch Switcher | Skeleton shimmer |
| Search | Spinner `16px` right-aligned |
| Notifications | Skeleton bars in panel |
| AI Button | Spinner inside button, `16px` |
| Profile | Skeleton circle `32px` |

### 13.2 Empty States

| Element | Empty Behavior |
|---------|----------------|
| Notifications | "No notifications" with bell icon |
| Tasks | "No pending tasks" with check-square icon |
| Search | "Start typing to search..." |
| Quick Create | Disabled, tooltip "No record types available" |

### 13.3 Error States

| Element | Error Behavior |
|---------|----------------|
| Company Switch | Toast: "Failed to switch company. Please try again." |
| Search | "Search unavailable. Check connection." |
| Notifications | "Failed to load notifications." with retry button |

---

## 14. Interaction Design

### 14.1 Hover States

| Element | Hover Behavior | Transition |
|---------|----------------|------------|
| Company Switcher | Background `--nex-hover-bg` | `120ms ease-in` |
| Branch Switcher | Background `--nex-hover-bg` | `120ms ease-in` |
| Warehouse Indicator | Background `--nex-hover-bg`, cursor pointer | `120ms ease-in` |
| Search Input | Border `--nex-border-strong` | `120ms ease-in` |
| Quick Create | Background `--nex-hover-bg`, border `--nex-border-strong` | `120ms ease-in` |
| AI Button | Scale `1.05`, shadow `--nex-shadow-glow-secondary` | `150ms ease-out` |
| Icon Buttons | Background `--nex-hover-bg`, `--nex-radius-md` | `120ms ease-in` |
| Profile Avatar | Ring `2px solid --nex-primary-200` | `120ms ease-in` |

### 14.2 Click Interactions

| Element | Click Action | Feedback |
|---------|--------------|---------|
| Company Switcher | Open dropdown | Panel slides down `150ms` |
| Branch Switcher | Open dropdown | Panel slides down `150ms` |
| Warehouse | Open dropdown | Panel slides down `150ms` |
| Search Input | Focus, clear placeholder | Immediate |
| Quick Create | Open dropdown | Panel slides down `150ms` |
| AI Button | Open AI panel/drawer | Panel slides from right `200ms` |
| Notifications | Open notification panel | Panel slides down `150ms` |
| Tasks | Open tasks panel | Panel slides down `150ms` |
| Profile | Open profile dropdown | Panel slides down `150ms` |
| Language | Open language menu | Panel slides down `120ms` |
| Theme | Cycle theme | Immediate, toast confirmation |

### 14.3 Focus Management

| Element | Focus Style | Behavior |
|---------|-------------|----------|
| All interactive | `2px solid --nex-primary-500`, offset `-2px` | Roving tabindex |
| Dropdowns | Focus trap within open panel | `Tab` cycles within |
| Search Input | Focus + internal cursor | `Ctrl+K` global shortcut |
| Modals from header | Focus moves to modal, returns on close | Standard dialog pattern |

---

## 15. Keyboard Shortcuts

### 15.1 Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+K` / `Cmd+K` | Focus global search | Global |
| `Ctrl+N` / `Cmd+N` | Open quick create dropdown | Global |
| `Ctrl+Shift+C` | Focus company switcher | Global |
| `Ctrl+Shift+B` | Focus branch switcher | Global |
| `Ctrl+Shift+W` | Focus warehouse selector | Global |
| `Ctrl+Shift+A` | Open AI Assistant | Global |
| `Ctrl+Shift+N` | Open notifications | Global |
| `Ctrl+Shift+T` | Open tasks | Global |
| `Ctrl+Shift+U` | Open user profile | Global |
| `Ctrl+Shift+L` | Cycle language | Global |
| `Ctrl+Shift+T` | Cycle theme | Global |
| `0` (zero) | Toggle sidebar | Global (sidebar must be focused or hovered) |

### 15.2 Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close all open dropdowns/panels |
| `Tab` | Next interactive element |
| `Shift+Tab` | Previous interactive element |
| `↑` / `↓` | Navigate within open list (search, dropdown) |
| `Enter` / `Space` | Activate focused element |
| `→` | Expand section or move to next zone |
| `←` | Collapse section or move to previous zone |

---

## 16. RTL Behavior

### 16.1 Mirroring Rules

| Property | LTR | RTL |
|----------|-----|-----|
| Header Layout | Left to right | Right to left |
| Brand Position | Far left | Far right |
| System Actions | Far right | Far left |
| Zones Order | Z1 → Z2 → Z3 | Z1 → Z2 → Z3 (mirrored) |
| Dropdown Alignment | Left-aligned to trigger | Right-aligned to trigger |
| Search Icon | Left side of input | Right side of input |
| Chevron Direction | Right side (dropdown indicator) | Left side |
| Badge Position | Top-right of icon | Top-left of icon |
| Language Code | Left of globe | Right of globe (or unchanged) |

### 16.2 RTL Typography

- Font family: `'IBM Plex Sans Arabic', 'Inter', sans-serif`
- Text alignment: Right-aligned
- Number rendering: Inter for tabular alignment
- Line height: `+0.1` from standard for Arabic
- Letter spacing: `+0.01em` for Arabic headlines

### 16.3 RTL Spacing

- All spacing values remain identical
- Logical properties preferred: `margin-inline-start`, `padding-inline-end`
- Physical properties flipped: `margin-left` ↔ `margin-right`

### 16.4 RTL Icons

| Icon | LTR Meaning | RTL Meaning | Action |
|------|-------------|-------------|--------|
| `chevron-down` | Dropdown open | Dropdown open | Rotates same direction |
| `search` | Search | Search | No change |
| `external-link` | Opens new tab | Opens new tab | No change |
| `arrow-right` | Next | Next | No change (directional) |
| `arrow-left` | Back | Forward | Flip direction |

**Rule:** Directional arrows flip in RTL. All other icons remain identical.

---

## 17. Responsive Behavior

### 17.1 Breakpoints

| Breakpoint | Width | Header Behavior |
|------------|-------|-----------------|
| **Desktop** | `> 1280px` | Full header, all elements visible |
| **Laptop** | `1024px - 1280px` | Full header, slightly condensed search |
| **Tablet** | `768px - 1023px` | Condensed header, overflow menu |
| **Mobile** | `< 768px` | Minimal header, bottom bar for primary actions |

### 17.2 Desktop (>1280px)

- **Z1 Width:** `~600px` (logo + 3 context switchers)
- **Z2 Width:** Flexible (search `320-480px` + quick create + AI)
- **Z3 Width:** `~280px` (5-6 icons + labels)
- **All elements visible:** No overflow
- **Search:** Full width `480px`

### 17.3 Laptop (1024px-1280px)

- **Z1 Width:** `~500px`
- **Z2 Width:** Flexible (search `240-360px`)
- **Z3 Width:** `~240px` (icons only, tooltips)
- **Search:** Condensed to `240px`, expands on focus
- **Quick Create:** Icon only, label in tooltip
- **Profile:** Avatar only, name hidden

### 17.4 Tablet (768px-1023px)

- **Z1:** Company only (branch/warehouse in dropdown)
- **Z2:** Search icon only, expands on click
- **Z3:** Notifications, Tasks, Profile icons only
- **Overflow Menu:** `more-horizontal` icon opens dropdown with: Quick Create, AI, Language, Theme, Connection
- **Touch Targets:** `44px` minimum

### 17.5 Mobile (<768px)

- **Brand:** Logo + Company name only
- **Context:** Branch/warehouse in hamburger menu
- **Primary Actions:** Bottom navigation bar
  - Search
  - Quick Create
  - AI Assistant
  - Notifications (with badge)
  - Profile
- **Top Right:** Theme toggle + Connection status only
- **Height:** `48px` (mobile header) + `56px` (bottom bar)

---

## 18. Multi-Company Rules

### 18.1 Context Hierarchy

```
Company (Primary)
  └── Branch (Secondary)
       └── Warehouse (Tertiary)
```

### 18.2 Visual Rules

- **Company:** Largest text, leftmost, strongest visual weight
- **Branch:** Medium text, secondary divider
- **Warehouse:** Smallest text, muted color
- **Active company:** `--nex-primary-600` text, checkmark icon
- **Active branch:** `--nex-text-primary` text
- **Active warehouse:** `--nex-text-secondary` text, optional live dot

### 18.3 Behavior Rules

- **Company switch:** Triggers full workspace reload with loading state
- **Branch switch:** Updates data scope instantly, no reload
- **Warehouse switch:** Updates inventory context, no reload
- **Cascading:** Changing company resets branch and warehouse to default
- **Persistence:** All selections saved per user, per session
- **Validation:** Cannot switch company during active transaction — prompt to save

### 18.4 Data Isolation

| Rule | Implementation |
|------|----------------|
| Company data never mixes | Database-level tenant isolation |
| Branch filter applies after company | API query parameter `branch_id` |
| Warehouse filter applies after branch | API query parameter `warehouse_id` |
| Unauthorized access | Company/branch not listed in dropdown |
| Default selection | User's last selected or primary assignment |

---

## 19. Accessibility

### 19.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 minimum |
| Touch Target | Minimum `40×40px` for all interactive elements |
| Focus Indicator | `2px solid --nex-primary-500`, offset `-2px` |
| Keyboard Navigation | Full functionality without mouse |
| Screen Reader | `aria-label` on all icon-only elements |
| Semantic HTML | `<header>`, `<nav>`, `<button>`, `<select>` |

### 19.2 ARIA Attributes

| Element | ARIA |
|---------|------|
| Company switcher | `aria-label="Company switcher"`, `aria-haspopup="listbox"` |
| Branch switcher | `aria-label="Branch switcher"`, `aria-haspopup="listbox"` |
| Warehouse indicator | `aria-label="Warehouse selector"`, `aria-haspopup="listbox"` |
| Search input | `role="search"`, `aria-label="Global search"`, `aria-expanded` |
| Quick Create | `aria-label="Quick create"`, `aria-haspopup="menu"` |
| AI Button | `aria-label="AI Assistant"`, `aria-live="polite"` |
| Notifications | `aria-label="Notifications"`, `aria-badge="4"` |
| Tasks | `aria-label="Tasks"`, `aria-badge="2"` |
| Profile | `aria-label="User menu"`, `aria-haspopup="menu"` |
| Theme | `aria-label="Theme switcher"`, `aria-pressed` |
| Language | `aria-label="Language switcher"`, `aria-haspopup="menu"` |
| Connection | `aria-label="Connection status"`, `aria-live="polite"` |

### 19.3 Screen Reader Announcements

- Company change: "Switched to Al-Jawhara Motors, Riyadh Branch"
- New notification: "3 new notifications"
- AI status: "AI Assistant is ready"
- Connection loss: "You are offline. Changes will be saved locally."

---

## 20. Animation & Motion

### 20.1 Transitions

| Transition | Duration | Easing | Trigger |
|------------|----------|--------|---------|
| Dropdown open | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Click/Focus |
| Dropdown close | `100ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Blur/Esc |
| Hover states | `120ms` | `ease-in` | Mouse |
| AI panel | `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Click |
| Notification badge pulse | `300ms` | `ease-in-out` | New notification |
| Search expand | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Focus |
| Skeleton shimmer | `1200ms` | `ease-in-out` infinite | Loading |

### 20.2 Micro-interactions

| Interaction | Behavior |
|-------------|----------|
| AI Button hover | Subtle scale `1.05` + secondary glow |
| Notification badge | Scale pulse on new notification |
| Search focus | Border color transition, shadow addition |
| Profile hover | Subtle avatar ring appearance |
| Theme toggle | Immediate icon swap, `150ms` background fade |

### 20.3 Motion Rules

- **No bounce** — only `cubic-bezier(0.4, 0, 0.2, 1)` and `ease-in/out`
- **Respect `prefers-reduced-motion`** — disable non-essential animations
- **No layout shift** — Reserve space for dropdowns, badges, labels
- **Staggered reveals** — Dropdown items appear sequentially on open (`30ms` delay)

---

## 21. Implementation Notes

### 21.1 Component Structure

```
Header
├── BrandContext (Z1)
│   ├── Logo
│   ├── CompanySwitcher
│   ├── BranchSwitcher
│   └── WarehouseIndicator
├── GlobalActions (Z2)
│   ├── GlobalSearch
│   ├── QuickCreate
│   └── AIAssistant
└── SystemUser (Z3)
    ├── Notifications
    ├── Tasks
    ├── ThemeSwitcher
    ├── LanguageSwitcher
    ├── ConnectionStatus
    └── UserProfile
```

### 21.2 State Management

- **Active company/branch/warehouse:** Global state, synced with URL params
- **Open dropdowns:** Local state, close on `Esc` or outside click
- **Search query:** Local state, cleared on close
- **Notification count:** Derived from API, polled every `60s`
- **Task count:** Derived from API, real-time via WebSocket
- **Theme:** Persisted per user, applies on load
- **Language:** Persisted per user, requires reload

### 21.3 Performance

- **Debounce search:** `300ms`
- **Notification polling:** `60s` interval, immediate on focus
- **Dropdown virtualization:** Not required — max ~20 items per dropdown
- **Transition optimization:** Use `transform` and `opacity` only

---

## 22. Design Token Mapping

All tokens reference the official Nexora Design System v1.0:

| Token Category | Token Name | Value |
|----------------|------------|-------|
| Height | `--nex-header-height` | `56px` |
| Padding | `--nex-header-padding` | `0 24px` |
| Zone Gap | `--nex-header-zone-gap` | `16px` |
| Item Gap | `--nex-header-item-gap` | `8px` |
| Search Height | `--nex-header-search-height` | `36px` |
| Icon Size | `--nex-header-icon-size` | `18px` |
| Avatar Size | `--nex-header-avatar-size` | `32px` |
| Badge Size | `--nex-header-badge-size` | `16px` |
| Transition | `--nex-header-transition` | `120ms ease-in` |
| Dropdown Transition | `--nex-header-dropdown-transition` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial header UX specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ header implementations must adhere to this document.

---

*This document is the single source of truth for Nexora ERP header navigation. Any deviation requires written approval from Design System Architecture.*
