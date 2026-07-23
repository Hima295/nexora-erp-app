# Nexora ERP Search & Notification Experience
## Official UX Specification
### Version 1.0 — Design System v1.0

**Status:** OFFICIAL  
**Authority:** Chief Product Designer  
**Scope:** All Nexora ERP v1.0+ interfaces  
**Constraint:** Must adhere exclusively to Nexora Design System v1.0

---

## Section 1: Global Search

### 1.1 Purpose

Global Search is the **universal access point** to every entity, record, page, and AI capability in Nexora ERP. It eliminates navigation friction by allowing users to find anything in 2-3 keystrokes.

**Design Philosophy:**
- **Instant** — Results appear before user finishes typing
- **Intelligent** — Ranks by relevance, recency, and user behavior
- **Omniscient** — Searches across all modules simultaneously
- **Actionable** — Results lead directly to the record or action

---

### 1.2 Search Bar

#### Placement
- **Primary Location:** Header (Z2), always visible
- **Secondary Location:** Sidebar Zone B, collapsed mode
- **Overlay:** Full-screen search on mobile

#### Anatomy

```
┌─────────────────────────────────────────────┐
│ 🔍  Search spare parts, invoices, AI...     │  <- Input field
│                              [↓ Enter]      │  <- Keyboard hint
└─────────────────────────────────────────────┘
```

| Property | Value | Usage |
|----------|-------|-------|
| Width (desktop) | `320px` min, `480px` max | Expands on focus |
| Width (tablet) | `240px` min, `320px` max | Condensed by default |
| Height | `36px` | Matches header height |
| Border Radius | `--nex-radius-md` (`8px`) | Input family |
| Background | `--nex-neutral-100` | Light mode |
| Border | `1px solid transparent`, focus: `1px solid --nex-border-focus` | Minimal default |
| Padding | `6px 12px 6px 32px` | Icon space |
| Font | `--nex-text-sm`, `--nex-font-family` | Readable, compact |
| Placeholder | "Search spare parts, invoices, AI..." (EN) / "بحث عن قطع غيار، فواتير، ذكاء..." (AR) | `--nex-text-tertiary` |

#### States

| State | Background | Border | Shadow | Text Color |
|-------|-----------|--------|--------|------------|
| Default | `--nex-neutral-100` | `1px solid transparent` | None | `--nex-text-tertiary` (placeholder) |
| Hover | `--nex-neutral-100` | `1px solid --nex-neutral-300` | None | — |
| Focus | `#FFFFFF` | `1px solid --nex-primary-500` | `--nex-shadow-sm` | `--nex-text-primary` |
| Filled | `#FFFFFF` | `1px solid --nex-border-default` | `--nex-shadow-sm` | `--nex-text-primary` |
| Disabled | `--nex-neutral-100` | `1px solid --nex-border-disabled` | None | `--nex-text-disabled` |
| Loading | `#FFFFFF` | `1px solid --nex-border-default` | `--nex-shadow-sm` | `--nex-text-primary` |

#### Loading State
- **Spinner:** `16px`, right-aligned within input
- **Placeholder:** "Searching..."
- **Debounce:** `300ms` after last keystroke
- **Skeleton:** None — spinner sufficient

---

### 1.3 Search Results Dropdown

#### Layout

```
┌──────────────────────────────────────────────┐
│ Search Results                        [Esc]  │
├──────────────────────────────────────────────┤
│ PAGES                                        │
│   📊 Nexora Pulse                            │
│   📦 Inventory Dashboard                     │
│   🛒 Purchase Orders                         │
├──────────────────────────────────────────────┤
│ SPARE PARTS                                  │
│   🔧 Oil Filter — OF-1234                    │  <- Exact match
│   🔧 Brake Pad — BP-5678                     │  <- OEM match
│   🔧 Spark Plug — SP-9012                    │
├──────────────────────────────────────────────┤
│ DOCUMENTS                                    │
│   📄 SO-2024-001 — Al-Jawhara Trading        │
│   📄 PO-2024-045 — AutoParts Co.             │
├──────────────────────────────────────────────┤
│ AI SUGGESTIONS                      ✨       │
│   "Show spare parts needing reorder"          │  <- AI command
│   "Compare Q3 vs Q2 sales"                   │
├──────────────────────────────────────────────┤
│ Advanced Search →                             │
└──────────────────────────────────────────────┘
```

#### Dimensions

| Property | Value |
|----------|-------|
| Width | `480px` |
| Max Height | `520px` with scroll |
| Shadow | `--nex-shadow-xl` |
| Border Radius | `--nex-radius-xl` (`16px`) |
| Header Padding | `12px 16px` |
| Item Height | `36px` |
| Item Padding | `8px 12px` |
| Group Header Height | `28px` |
| Divider | `1px solid --nex-border-subtle` |

#### Result Categories

| Category | Icon | Priority | Sorting |
|----------|------|----------|---------|
| **Pages** | `layout` | High | By frequency |
| **Spare Parts** | `wrench` | High | By relevance + stock level |
| **OEM Numbers** | `hash` | High | Exact match first |
| **Part Numbers** | `barcode` | High | Exact match first |
| **Customers** | `users` | Medium | By name match |
| **Suppliers** | `truck` | Medium | By name match |
| **Sales Invoices** | `file-text` | Medium | By date + relevance |
| **Purchase Orders** | `shopping-cart` | Medium | By date + relevance |
| **Stock Entries** | `package` | Medium | By date |
| **Warehouses** | `warehouse` | Medium | By proximity |
| **Employees** | `user` | Low | By name |
| **Reports** | `bar-chart` | Low | By frequency |
| **AI Commands** | `sparkles` | High | By suggestion confidence |

---

### 1.4 Autocomplete & Smart Suggestions

#### Autocomplete Behavior
- **Trigger:** After 2+ characters typed
- **Debounce:** `300ms`
- **Max Suggestions:** 8 per category
- **Highlight:** Matching text in bold, `--nex-primary-600`
- **Keyboard:** `↑↓` navigate, `Tab` accepts first suggestion, `Enter` selects, `Esc` closes

#### Smart Suggestions
AI-powered suggestions appear when:
- User types 3+ characters matching common patterns
- User has history of similar searches
- System detects user intent (e.g., typing "oil" → "Show low stock oil filters")

| Suggestion Type | Example | Icon |
|-----------------|---------|------|
| Completion | "Oil Filter" | `wrench` |
| Correction | "Did you mean: Oil Filtr?" | `alert-circle` |
| AI Command | "Reorder low stock items" | `sparkles` |
| Recent | "Last search: Brake pads" | `clock` |
| Trending | "Popular: Spark plugs this week" | `trending-up` |

---

### 1.5 Recent Searches

#### Behavior
- **Storage:** Local storage + server sync
- **Duration:** Last 30 days
- **Max Items:** 20
- **Display:** Below search input, above results
- **Grouping:** "Recent searches" section with clock icon
- **Remove:** Individual `×` button on hover, "Clear all" at bottom
- **Reorder:** Most recent first

#### Recent Search Item
```
🕐  Oil filter OF-1234                    ×
    Spare Parts • 2 hours ago
```

---

### 1.6 Search Filters

#### Filter Panel
Accessible via "Filters" button in search dropdown header.

| Filter | Type | Options |
|--------|------|---------|
| **Date Range** | Date picker | Last 7 days, 30 days, custom |
| **Entity Type** | Multi-select | Pages, Spare Parts, Documents, AI |
| **Warehouse** | Dropdown | All warehouses, specific |
| **Category** | Dropdown | Spare part category |
| **Status** | Multi-select | Active, Discontinued, Draft |
| **Supplier** | Autocomplete | Supplier name |
| **Price Range** | Range slider | Min — Max |

#### Filter Application
- **Real-time:** Results update as filters change
- **Persist:** Filters persist within session
- **Clear:** "Clear all" link resets to defaults
- **Save:** "Save filter" for recurring searches (future)

---

### 1.7 Search Ranking Algorithm

#### Ranking Factors (in order of weight)

| Factor | Weight | Description |
|--------|--------|-------------|
| Exact Match | 100 | Part number, OEM, invoice number exact match |
| Category Match | 80 | Result type matches inferred category |
| Text Relevance | 60 | TF-IDF scoring on name/description |
| Recency | 40 | Recently viewed/created records rank higher |
| User Behavior | 30 | Frequently accessed by user |
| Business Priority | 20 | High-value items, critical stock |
| AI Confidence | 25 | AI suggestion confidence score |

#### Ranking Rules
- **Exact matches always win** regardless of other factors
- **Active records** rank higher than archived
- **Current warehouse** items rank higher than others
- **Pending approvals** boosted for approvers only
- **No paid promotion** — ranking is purely relevance-based

---

### 1.8 Keyboard Navigation

#### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+K` / `Cmd+K` | Focus search input | Global |
| `Ctrl+K` / `Cmd+K` (again) | Clear and refocus | When search focused |
| `Esc` | Close search dropdown | When search open |
| `↑` / `↓` | Navigate results | When results visible |
| `Enter` | Open selected result | When result highlighted |
| `Tab` | Accept first suggestion | When autocomplete visible |
| `Shift+Tab` | Move to previous element | Global |

#### Search Flow
```
Idle State: [Ctrl+K] → Search focused
Typing: "oil f" → Debounce 300ms → Results appear
Results shown: [↑↓] navigate, [Enter] select, [Esc] close
Autocomplete: [Tab] accept first, [→] accept highlighted
No results: "No results" + "Try AI Search" button
```

---

### 1.9 Loading State

#### During Search

| Element | Behavior |
|---------|----------|
| Search Input | Spinner `16px` right-aligned |
| Placeholder | "Searching..." |
| Results Dropdown | Hidden until results ready |
| Skeleton | None — dropdown simply doesn't appear until ready |
| Timeout | 2s max, then "Search taking long..." message |

#### Debounce Visualization
- No debounce indicator (feels instant)
- If >500ms, subtle shimmer on results area before reveal

---

### 1.10 Empty State

#### First Use (No History)

```
┌──────────────────────────────────────────────┐
│                                              │
│              🔍                             │
│                                              │
│     Start typing to search                   │
│     Spare parts, invoices, AI commands...    │
│                                              │
│     ─────────────────────                   │
│                                              │
│     TRENDING SEARCHES                        │
│     • Oil filter OF-1234                     │
│     • Q3 sales report                        │
│     • Low stock items                        │
│                                              │
└──────────────────────────────────────────────┘
```

#### Returning User (Has History)

```
┌──────────────────────────────────────────────┐
│ RECENT SEARCHES                      [Clear] │
│   🕐 Oil filter OF-1234              ×      │
│   🕐 Brake pads BP-5678              ×      │
│   🕐 Q3 sales report                 ×      │
│                                              │
│ TRENDING                                     │
│   • Spark plugs this week                    │
│   • Supplier performance                     │
└──────────────────────────────────────────────┘
```

---

### 1.11 No Results State

```
┌──────────────────────────────────────────────┐
│                                              │
│     No results found for "xyz123"            │
│                                              │
│     Suggestions:                             │
│     • Check spelling                         │
│     • Try fewer keywords                     │
│     • Use AI Search ✨                       │
│                                              │
│     [Try AI Search]                          │
│                                              │
└──────────────────────────────────────────────┘
```

#### No Results Rules
- Show category breakdown: "Found 0 spare parts, 0 documents..."
- Always offer AI Search as fallback
- Preserve search query for easy retry
- "Clear search" link to reset

---

### 1.12 Search History

#### Storage
- **Client:** `localStorage` for recent searches
- **Server:** User preferences table for cross-device sync
- **Retention:** 30 days
- **Max Items:** 20 per user
- **Privacy:** Search history is private per user

#### Management
- **Clear All:** Available in search dropdown footer
- **Clear Individual:** `×` on each recent item
- **Auto-clear:** Items older than 30 days removed automatically
- **Sync:** Cross-device sync on login/logout

---

### 1.13 Responsive Behavior

#### Desktop (>1280px)
- **Search Bar:** Full `480px` width in header
- **Dropdown:** `480px` wide, right-aligned to search input
- **Results:** 5-8 visible per category, scroll for more
- **Keyboard:** Full navigation support

#### Laptop (1024px-1280px)
- **Search Bar:** `240px` min, expands to `360px` on focus
- **Dropdown:** `360px` wide
- **Results:** 4-6 visible per category
- **Keyboard:** Full navigation support

#### Tablet (768px-1023px)
- **Trigger:** Search icon button in header
- **Overlay:** Full-screen search modal on activation
- **Results:** Full-width, card-based layout
- **Filters:** Full-screen filter panel
- **Touch:** `44px` touch targets, swipe to close

#### Mobile (<768px)
- **Trigger:** Search icon in bottom navigation bar
- **Overlay:** Full-screen search experience
- **Input:** Full-width at top, sticky
- **Results:** Full-width cards with icons
- **Categories:** Horizontal scrollable chips at top
- **Filters:** Bottom sheet
- **Voice:** Microphone icon for voice search (future)
- **Camera:** Barcode scanner button for spare parts (future)

---

### 1.14 AI Search

#### AI Search Trigger
- "Try AI Search" button in no-results state
- `sparkles` icon in search dropdown header
- Voice command: "Hey Nexora..." (future)

#### AI Search Behavior
- **Interpretation:** Natural language to structured query
- **Examples:**
  - "Show me brake pads that are low stock" → Filtered spare parts list
  - "Compare sales this month vs last month" → Analytics report
  - "Which suppliers are delayed?" → Supplier performance report
- **Response:** Text answer + data table + chart
- **Follow-up:** "Show more", "Export", "Schedule report"

#### AI Search Panel
| Property | Value |
|----------|-------|
| Width | `480px` (desktop), full-screen (mobile) |
| Header | "AI Search", sparkles icon, close button |
| Input | Natural language, multiline capable |
| Response | Rich content: text + table + chart |
| History | Previous AI queries in session |
| Feedback | "Was this helpful?" thumbs up/down |

---

## Section 2: Notification Center

### 2.1 Purpose

The Notification Center is the **system awareness hub** for Nexora ERP. It aggregates alerts, updates, approvals, AI recommendations, and tasks into a single, scannable interface.

**Design Philosophy:**
- **Scannable** — Critical information visible in 2 seconds
- **Actionable** — Every notification leads to action
- **Respectful** — Smart grouping, no notification spam
- **Intelligent** — AI prioritizes based on user role and context

---

### 2.2 Notification Center Architecture

#### Trigger Points
| Trigger | Location | Open Behavior |
|---------|----------|---------------|
| Bell icon | Header右上角 | Dropdown panel, `380px` wide |
| Bell icon (mobile) | Bottom nav | Full-screen overlay |
| Badge click | Anywhere badge visible | Opens center filtered to unread |
| Keyboard | `Ctrl+Shift+N` | Opens center, focuses first unread |

#### Panel Structure

```
┌──────────────────────────────────────────────┐
│ Notifications (12 unread)         [Settings] │
├──────────────────────────────────────────────┤
│ [All] [Unread] [AI Insights]   [Mark all read]│
├──────────────────────────────────────────────┤
│ TODAY                                        │
│ ● Low Stock Alert                   2m ago   │  <- Unread
│   Brake pads BP-5678 below minimum           │
│   Warehouse: Main • Inventory                │
│                                              │
│ ○ Purchase Order Approved               1h   │  <- Read
│   PO-2024-045 approved by Ahmed               │
│                                              │
│ ── AI INSIGHTS ──                            │
│ ● Supplier Delay Risk                 3h     │  <- AI
│   Al-Jawhara Trading — 5 days overdue        │
│   [View Details] [Dismiss]                   │
│                                              │
│ YESTERDAY                                    │
│ ○ New Sales Order Created             5h     │
│   SO-2024-001 — AutoParts Co.               │
│                                              │
│ ○ Task Assigned: Review Pricing        1d     │
│   Price list PL-2024 updated                 │
│                                              │
├──────────────────────────────────────────────┤
│ View all notifications →                     │
└──────────────────────────────────────────────┘
```

#### Panel Dimensions

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Width | `380px` | `360px` | Full-screen |
| Max Height | `520px` | `480px` | Full-screen |
| Border Radius | `--nex-radius-xl` (`16px`) | `--nex-radius-xl` | `0` |
| Shadow | `--nex-shadow-xl` | `--nex-shadow-xl` | None |
| Position | Right-aligned dropdown | Right-aligned dropdown | Fixed overlay |

---

### 2.3 Notification Types

| Type | Icon | Color | Purpose | Examples |
|------|------|-------|---------|----------|
| **Info** | `info` | `--nex-info-500` | General information | System updates, new features |
| **Success** | `check-circle` | `--nex-success-500` | Completed actions | Order approved, payment received |
| **Warning** | `alert-triangle` | `--nex-warning-500` | Attention needed | Low stock, pending approval |
| **Danger** | `alert-octagon` | `--nex-danger-500` | Critical alerts | Stockout, system error |
| **AI Insight** | `sparkles` | `--nex-secondary-500` | AI-generated | Recommendations, forecasts |
| **Task** | `check-square` | `--nex-primary-500` | Task assignment | Review request, approval task |
| **Mention** | `at-sign` | `--nex-primary-500` | User mentioned | Comment, tag in document |
| **System** | `settings` | `--nex-neutral-500` | System events | Backup complete, update available |

#### Notification Type Rules
- **Max 1 icon per notification** — no stacked icons
- **Icon size:** `16px` in dropdown, `18px` in full view
- **Icon position:** Left side, `12px` from edge
- **Color application:** Icon only, not background (except AI Insights section)

---

### 2.4 Priority Levels

| Priority | Indicator | Sorting | Sound | Persistence |
|----------|-----------|---------|-------|-------------|
| **Critical** | Red dot + pulse | Top of list | Yes (optional) | Until dismissed |
| **High** | Orange dot | Top of section | No | 7 days |
| **Medium** | No dot | By timestamp | No | 30 days |
| **Low** | No indicator | By timestamp | No | 30 days |

#### Priority Rules
- **Critical:** Stockout, system down, payment failed — requires action
- **High:** Low stock, approval pending, delivery delayed — attention needed soon
- **Medium:** New order, report ready, task assigned — informational
- **Low:** System tips, feature updates — optional

---

### 2.5 Unread Counter

#### Badge Design
| Property | Value |
|----------|-------|
| Shape | Circle, `--nex-radius-full` |
| Background | `--nex-danger-600` |
| Text | White, `--nex-text-xs`, `--nex-weight-bold` |
| Size | `18px` diameter, `12px` font |
| Min Count | `1` |
| Max Display | `99+` |
| Position | Top-right of bell icon, `-2px` offset |
| Animation | Scale pulse on new notification, `300ms` |

#### Counter Behavior
- **Increment:** Immediate on new notification
- **Decrement:** On mark-as-read, archive, or click
- **Reset:** All read → badge hides
- **Badge Animation:** `scale(1.2)` → `scale(1)` on new notification

---

### 2.6 Notification Actions

#### Per-Notification Actions

| Action | Icon | Behavior |
|--------|------|----------|
| Mark as Read | `check` | Removes unread dot, moves to read section |
| Archive | `archive` | Moves to archived, removed from active list |
| Dismiss | `x` | Removes notification permanently |
| Open | (click notification body) | Navigates to related record |
| Quick Action | Contextual button | "Approve", "Reject", "View", "Reorder" |

#### Bulk Actions
- **Select Mode:** Checkbox on each notification activates bulk bar
- **Bulk Actions:** Mark as read, Archive, Delete
- **Select All:** In current filter (All/Unread/AI)
- **Deselect All:** Clears selection

---

### 2.7 Filters & Tabs

#### Tabs
| Tab | Count | Filter | Default |
|------|-------|--------|---------|
| **All** | Total | No filter | No |
| **Unread** | Unread count | `is_read = false` | **Yes** |
| **AI Insights** | AI count | `type = AI Insight` | No |
| **Mentions** | Mention count | `type = Mention` | No |
| **Tasks** | Task count | `type = Task` | No |

#### Advanced Filters
Accessible via "Filters" button:

| Filter | Type | Options |
|--------|------|---------|
| **Date Range** | Presets + Custom | Today, Yesterday, Last 7 days, Last 30 days, Custom |
| **Type** | Multi-select chips | Info, Success, Warning, Danger, AI, Task, Mention |
| **Priority** | Multi-select | Critical, High, Medium, Low |
| **Module** | Multi-select | Inventory, Purchasing, Sales, HR, System |
| **Read Status** | Radio | All, Unread, Read |
| **Branch** | Dropdown | Specific branch |
| **Warehouse** | Dropdown | Specific warehouse |

---

### 2.8 Notification Grouping

#### Time-Based Grouping

| Group | Time Range | Header |
|-------|-----------|--------|
| **Just Now** | 0-5 minutes | "Just now" |
| **Today** | 5 minutes - 24 hours | "Today" with date |
| **Yesterday** | 24-48 hours | "Yesterday" |
| **This Week** | 48 hours - 7 days | "This week" |
| **Older** | 7+ days | "Older" |

#### Smart Grouping (AI-Powered)
- **Project-based:** "Project Alpha" groups related notifications
- **Thread-based:** "Conversation with Ahmed" groups mentions
- **Workflow-based:** "Purchase Order PO-2024-045" groups approval chain
- **User control:** Toggle smart grouping on/off in settings

---

### 2.9 Mark as Read & Archive

#### Mark as Read
- **Single:** Click notification body or checkmark icon
- **Bulk:** Select notifications → "Mark as read" button
- **Auto-read:** Opening notification from link marks as read
- **Keyboard:** `Space` toggles read/unread when focused

#### Archive
- **Single:** Archive icon or `A` key when focused
- **Bulk:** Select → "Archive" button
- **Auto-archive:** Low priority notifications after 30 days
- **View Archived:** "Archived" tab in full notification center
- **Restore:** From archived tab, restore to active

---

### 2.10 Push Notifications (Desktop)

#### Browser Push
- **Permission:** Requested on first critical notification
- **Types:** Critical, High priority only
- **Sound:** Configurable per type
- **Action Buttons:** "Approve", "Reject", "Snooze" on push
- **Badge:** Unread count on app icon

#### Native Notifications
- **OS Integration:** Uses OS notification system
- **Grouping:** By app, then by category
- **Sound:** System sound or custom
- **Do Not Disturb:** Respects OS DND settings

---

### 2.11 Mobile Notifications

#### Mobile Behavior

| Type | Badge | Sound | Action |
|------|-------|-------|--------|
| Critical | Red badge + count | Default | Immediate alert |
| High | Badge + count | Default | Banner |
| Medium | Badge only | Silent | In-app on open |
| Low | No badge | Silent | In-app only |

#### Mobile Notification Center
- **Access:** Bell icon in bottom nav or top header
- **View:** Full-screen list, swipeable groups
- **Actions:** Swipe left for quick actions (Read, Archive, Delete)
- **Pull to Refresh:** Updates notification list
- **Empty State:** "You're all caught up!" with illustration

---

### 2.12 Notification Settings

#### Per-Type Settings
| Setting | Options |
|---------|---------|
| **Enable** | On/Off per notification type |
| **Sound** | Default, Custom, None |
| **Badge** | Show/Hide count |
| **Desktop** | On/Off |
| **Mobile** | On/Off |
| **Email Digest** | Real-time, Hourly, Daily, Weekly |

#### Quiet Hours
- **Start/End:** User-defined time range
- **Behavior:** Notifications queued, delivered after quiet hours
- **Exceptions:** Critical only during quiet hours

---

## Section 3: Nexora AI Insights

### 3.1 Purpose

Nexora AI Insights is a **dedicated section** within the Notification Center that surfaces AI-generated intelligence. It is visually distinct from ordinary notifications to signal higher value and actionability.

**Design Philosophy:**
- **Prominent** — Impossible to miss, but not annoying
- **Actionable** — Every insight has a clear next step
- **Trustworthy** — Confidence scores explain AI certainty
- **Intelligent** — Learns from user interactions

---

### 3.2 AI Insights Visual Treatment

#### Section Header
```
─── ✨ NEXORA AI INSIGHTS (3) ───
```
| Property | Value |
|----------|-------|
| Separator | `1px solid --nex-secondary-200` |
| Icon | `sparkles` (Lucide), `14px`, `--nex-secondary-500` |
| Label | "NEXORA AI INSIGHTS", `--nex-text-xs`, `--nex-weight-semibold`, `--nex-secondary-700`, ALL CAPS |
| Count | Badge, `--nex-secondary-100` bg, `--nex-secondary-700` text |
| Divider | Below header, `1px solid --nex-border-subtle` |

#### AI Notification Card
```
┌──────────────────────────────────────────────┐
│ ✨ Supplier Delay Risk                3h ago  │
│                                              │
│ Al-Jawhara Trading is 5 days overdue on      │
│ 3 pending purchase orders. AI recommends:    │
│ • Contact supplier immediately                │
│ • Consider alternative supplier for PO-045   │
│ • Review credit limit exposure               │
│                                              │
│ Confidence: ▓▓▓▓▓▓▓░░░ 78%                   │
│                                              │
│ [View Details]  [Dismiss]  [Snooze 1 day]    │
└──────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `--nex-secondary-50` (light mode), `--nex-dark-bg-elevated` with `--nex-dark-secondary-glow` (dark) |
| Border | `1px solid --nex-secondary-200` |
| Border Radius | `--nex-radius-lg` (`12px`) |
| Left Accent | `3px solid --nex-secondary-500` |
| Padding | `16px` |
| Icon | `sparkles`, `16px`, `--nex-secondary-600` |
| Title | `--nex-text-sm`, `--nex-weight-semibold` |
| Body | `--nex-text-sm`, `--nex-neutral-600` |
| Timestamp | `--nex-text-xs`, `--nex-text-tertiary` |

---

### 3.3 AI Insight Categories

| Category | Icon | Color | Examples |
|----------|------|-------|----------|
| **Business Risks** | `alert-triangle` | `--nex-danger-500` | Supplier delay, stockout, cash flow |
| **Profit Opportunities** | `trending-up` | `--nex-success-500` | Pricing gap, bulk discount, cross-sell |
| **Purchasing Suggestions** | `shopping-cart` | `--nex-primary-500` | Bulk buy, alternative supplier, timing |
| **Inventory Warnings** | `package-open` | `--nex-warning-500` | Low stock, dead stock, overstock |
| **Executive Insights** | `brain` | `--nex-secondary-500` | Strategic trends, market shifts |
| **Operational Alerts** | `settings` | `--nex-info-500` | System efficiency, process gaps |

---

### 3.4 AI Insight Actions

Every AI insight has contextual actions:

| Action | Label | Behavior |
|--------|-------|----------|
| **Primary** | "View Details" | Navigates to detailed analysis |
| **Secondary** | "Apply" / "Approve" | Executes recommended action |
| **Tertiary** | "Dismiss" | Removes insight, logs feedback |
| **Quaternary** | "Snooze" | Reminds later: 1h, 1d, 1w |
| **Feedback** | 👍 / 👎 | Learns from user agreement |

#### Action Rules
- **Max 4 actions** per insight
- **Primary action** always `--nex-primary-600`
- **Danger actions** (like "Discontinue supplier") in `--nex-danger-600`
- **Apply action** requires confirmation for irreversible actions

---

### 3.5 Confidence Score

Every AI insight displays a confidence score:

| Display | Value | Meaning |
|---------|-------|---------|
| **High** | `≥ 85%` | Strong evidence, recommend action |
| **Medium** | `60-84%` | Likely, review before action |
| **Low** | `< 60%` | Uncertain, informational only |

#### Visualization
```
Confidence: ▓▓▓▓▓▓▓░░░ 78%
```
| Property | Value |
|----------|-------|
| Bar Width | `120px` |
| Bar Height | `6px` |
| Bar Background | `--nex-neutral-200` |
| Fill | `--nex-success-500` (≥85%), `--nex-warning-500` (60-84%), `--nex-danger-500` (<60%) |
| Text | `--nex-text-xs`, `--nex-weight-medium` |
| Label | "Confidence:", `--nex-text-xs`, `--nex-text-secondary` |

---

### 3.6 AI Insight Lifecycle

#### States

| State | Visual | Behavior |
|-------|--------|----------|
| **New** | `--nex-secondary-500` dot, slide-in animation | User notified |
| **Unread** | Subtle `--nex-secondary-50` background | Highlighted in list |
| **Read** | Neutral background | Dimmed slightly |
| **Actioned** | Green checkmark overlay | Shows outcome |
| **Dismissed** | Removed from list, archived | Logged for AI learning |
| **Snoozed** | Clock icon, shows return time | Reappears at scheduled time |

#### Lifecycle Rules
- **New insights:** Slide in from right with `200ms` animation
- **Unread timeout:** Auto-mark as read after 24h if not opened
- **Action tracking:** Outcome linked to insight for AI learning
- **Dismiss feedback:** Optional "Why?" mini-survey (1 click)
- **Snooze options:** 1 hour, 1 day, 1 week, until changed

---

### 3.7 AI Insight Prioritization

#### AI Ranking Algorithm

| Signal | Weight | Description |
|--------|--------|-------------|
| Business Impact | 40 | Revenue, cost, risk magnitude |
| Urgency | 25 | Time-sensitivity, deadlines |
| User Role | 15 | Relevance to user's function |
| History | 10 | User has acted on similar before |
| Confidence | 10 | AI model certainty |

#### Display Order
1. **Critical Risk** — Stockout, payment failure, compliance
2. **High-Impact Opportunity** — Revenue gap, cost savings
3. **Urgent Action** — Pending approvals, overdue items
4. **Routine Optimization** — Efficiency improvements
5. **Informational** — Trends, predictions

---

### 3.8 AI Insights Panel (Full View)

#### Access
- "AI Insights" tab in notification center
- AI Assistant button in header
- Nexora Pulse dashboard widget

#### Panel Layout

```
┌──────────────────────────────────────────────┐
│ AI Insights                          [Close] │
├──────────────────────────────────────────────┤
│ Summary: 3 action items, 1 informational      │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🔴 CRITICAL RISK                         │ │
│ │                                          │ │
│ │ Brake pads BP-5678 stockout in 3 days   │ │
│ │ Warehouse: Main • Current: 12 units      │ │
│ │ Min required: 50 units                   │ │
│ │                                          │ │
│ │ Suggested: Create PO for 100 units       │ │
│ │ Confidence: 92%                          │ │
│ │                                          │ │
│ │ [Create Purchase Order] [View Details]   │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🟡 OPPORTUNITY                           │ │
│ │                                          │ │
│ │ Bulk discount available: Order 200+      │ │
│ │ oil filters for 15% savings              │ │
│ │ Savings: ~SAR 2,400                      │ │
│ │                                          │ │
│ │ Confidence: 87%                          │ │
│ │                                          │ │
│ │ [Create Bulk Order] [Dismiss]            │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [Load more insights]                          │
└──────────────────────────────────────────────┘
```

---

### 3.9 AI Insight Detail View

#### Detail Page Anatomy

```
┌──────────────────────────────────────────────┐
│ ← Back    Supplier Delay Risk — AI Insight   │
├──────────────────────────────────────────────┤
│                                              │
│ [Supply Chain Visualization]                  │
│ (Network diagram showing affected POs)        │
│                                              │
│ Impact Assessment                             │
│ ┌──────────┬──────────┬──────────┐          │
│ │ Affected  │ Delay    │ Cost     │          │
│ │ POs       │ Days     │ Impact   │          │
│ │ 3         │ 5        │ SAR 12K  │          │
│ └──────────┴──────────┴──────────┘          │
│                                              │
│ Root Cause Analysis                           │
│ • Historical delay pattern (3x in 6 months)  │
│ • External: port congestion reported         │
│ • Internal: no backup supplier assigned      │
│                                              │
│ Recommended Actions                           │
│ 1. Contact supplier — [Draft Email]          │
│ 2. Activate backup supplier — [View]         │
│ 3. Adjust inventory buffer — [Update]        │
│                                              │
│ Confidence: 78% ▓▓▓▓▓▓▓░░░                  │
│ Model: Supply Chain v2.1 • Updated: 2h ago   │
│                                              │
│ [Execute All] [Save Draft] [Dismiss]          │
└──────────────────────────────────────────────┘
```

---

### 3.10 AI Insights Settings

#### User Controls
| Setting | Options |
|---------|---------|
| **Enable AI Insights** | On/Off |
| **Insight Frequency** | Real-time, Hourly, Daily digest |
| **Categories** | Toggle each category on/off |
| **Minimum Confidence** | 60%, 75%, 90% |
| **Quiet Hours** | Suppress non-critical during set hours |
| **Sound** | On/Off for AI notifications |
| **Auto-action** | Allow AI to execute low-risk actions |

#### Learning Feedback
- **Thumbs up/down** on each insight
- **"Was this useful?"** periodic survey
- **"Never show this type"** option
- **"More like this"** positive reinforcement

---

## Section 4: Shared Experience

### 4.1 Empty States

#### No Notifications (All Caught Up)
```
┌──────────────────────────────────────────────┐
│                                              │
│              🔔                             │
│                                              │
│     You're all caught up!                    │
│     No notifications right now.              │
│                                              │
│     ─────────────────────                   │
│                                              │
│     RECOMMENDED FOR YOU                      │
│     • Review Q3 sales performance            │
│     • Check pending purchase orders          │
│     • Nexora AI insights available ✨        │
│                                              │
└──────────────────────────────────────────────┘
```

#### No Search Results
(See Section 1.11)

---

### 4.2 Loading States

#### Search Loading
| Element | Behavior |
|---------|----------|
| Search Input | Spinner `16px` right-aligned |
| Dropdown | Hidden until results ready |
| Skeleton | None — no dropdown until ready |

#### Notification Panel Loading
| Element | Behavior |
|---------|----------|
| Panel | Skeleton bars: 3-4 placeholder rows |
| Badge | Previous count visible until refresh |

---

### 4.3 Error States

| Scenario | Behavior |
|----------|----------|
| Search timeout | "Search is taking longer than expected. Please try again." |
| Search error | "Couldn't load results. Check your connection." with retry |
| Notifications load fail | "Couldn't load notifications." with retry button |
| Notifications offline | "You're offline. Notifications will load when connected." |

---

### 4.4 Accessibility

#### Search Accessibility
| Requirement | Implementation |
|-------------|----------------|
| Label | `aria-label="Global search"` on input |
| Role | `role="search"` on container |
| Results | `role="listbox"`, items `role="option"` |
| Keyboard | Full `↑↓` navigation, `Enter` select, `Esc` close |
| Screen Reader | Result count announced, category headers |

#### Notification Accessibility
| Requirement | Implementation |
|-------------|----------------|
| Bell | `aria-label="Notifications"`, `aria-badge="12"` |
| Panel | `role="dialog"`, `aria-label="Notification center"` |
| Items | `role="listitem"`, `aria-readonly="true/false"` |
| Tabs | `role="tablist"`, `aria-selected` |
| Actions | `role="button"`, descriptive `aria-label` |

---

### 4.5 RTL Behavior

#### Search RTL
| Property | LTR | RTL |
|----------|-----|-----|
| Search Icon | Left side | Right side |
| Input Text | Left-aligned | Right-aligned |
| Dropdown | Left-aligned to input | Right-aligned to input |
| Keyboard Hint | `↓ Enter` (right side) | `Enter ↓` (left side) |
| Results Icons | Left of text | Right of text |

#### Notification RTL
| Property | LTR | RTL |
|----------|-----|-----|
| Panel Position | Right-aligned | Left-aligned |
| Badge Position | Top-right of bell | Top-left of bell |
| Timestamp | Right-aligned | Left-aligned |
| Actions | Right-aligned | Left-aligned |
| AI Insights Section | Left-to-right | Right-to-left |

---

### 4.6 Responsive Summary

| Breakpoint | Search | Notifications |
|------------|--------|---------------|
| **Desktop** (>1280px) | Inline header input, `480px` dropdown | Right dropdown, `380px` |
| **Laptop** (1024-1280px) | Expandable input, `360px` dropdown | Right dropdown, `360px` |
| **Tablet** (768-1023px) | Icon trigger, full-screen overlay | Full-screen overlay |
| **Mobile** (<768px) | Bottom nav icon, full-screen | Bottom nav icon, full-screen |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial Search & Notification specification — official |

**Approved By:** Chief Product Designer  
**Status:** Official — All Nexora ERP v1.0+ search and notification implementations must adhere to this document.

---

*This document is the single source of truth for Nexora ERP search and notification experiences. Any deviation requires written approval from Design System Architecture.*
