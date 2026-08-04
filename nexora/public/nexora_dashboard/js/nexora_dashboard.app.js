window.NexoraDashboard = window.NexoraDashboard || {};

window.NexoraDashboard.REPORT_HUB = [
    { key: "sales", label: "Sales", icon: "sales", color: "green", report: "Sales Register", sub: "Sales Invoice" },
    { key: "purchases", label: "Purchases", icon: "cart", color: "orange", report: "Purchase Register", sub: "Purchase Invoice" },
    { key: "inventory", label: "Inventory", icon: "box", color: "teal", report: "Stock Balance", sub: "Stock Ledger Entry" },
    { key: "finance", label: "Finance", icon: "file", color: "indigo", report: "General Ledger", sub: "GL Entry" },
    { key: "customers", label: "Customers", icon: "users", color: "blue", report: "Customer Ledger Summary", sub: "Sales Invoice" },
    { key: "suppliers", label: "Suppliers", icon: "truck", color: "purple", report: "Supplier Ledger Summary", sub: "Purchase Invoice" },
    { key: "pricing", label: "Pricing", icon: "tag", color: "green", report: "Item-wise Price List Rate", sub: "Item Price" },
    { key: "warehouse", label: "Warehouse", icon: "grid", color: "orange", report: "Warehouse Wise Stock Balance", sub: "Stock Ledger Entry" },
    { key: "cashflow", label: "Cash Flow", icon: "net", color: "teal", report: "Cash Flow", sub: "GL Entry" },
    { key: "profit", label: "Profit", icon: "profit", color: "indigo", report: "Profit and Loss Statement", sub: "GL Entry" },
    { key: "valuation", label: "Valuation", icon: "star", color: "blue", report: "Item Price Stock", sub: "Item" },
    { key: "margins", label: "Margins", icon: "chart", color: "purple", report: "Gross Profit", sub: "Sales Invoice" }
];

window.NexoraDashboard.REPORT_GROUPS = [
    { label: "Sales & Profitability", color: "green", icon: "sales", reports: [
        { name: "Sales Register", sub: "Sales Invoice" },
        { name: "Sales Analytics", sub: "Sales Order" },
        { name: "Item-wise Sales Register", sub: "Sales Invoice" },
        { name: "Gross Profit", sub: "Sales Invoice" },
        { name: "Customer Ledger Summary", sub: "Sales Invoice" },
        { name: "Accounts Receivable", sub: "Sales Invoice" }
    ]},
    { label: "Purchasing", color: "orange", icon: "cart", reports: [
        { name: "Purchase Register", sub: "Purchase Invoice" },
        { name: "Purchase Analytics", sub: "Purchase Order" },
        { name: "Item-wise Purchase Register", sub: "Purchase Invoice" },
        { name: "Supplier Ledger Summary", sub: "Purchase Invoice" },
        { name: "Accounts Payable", sub: "Purchase Invoice" },
        { name: "Purchase Order Analysis", sub: "Purchase Order" }
    ]},
    { label: "Inventory & Stock", color: "teal", icon: "box", reports: [
        { name: "Stock Balance", sub: "Stock Ledger Entry" },
        { name: "Stock Ledger", sub: "Stock Ledger Entry" },
        { name: "Stock Ageing", sub: "Item" },
        { name: "Item Balance (Simple)", sub: "Bin" },
        { name: "Warehouse Wise Stock Balance", sub: "Stock Ledger Entry" },
        { name: "Total Stock Summary", sub: "Stock Entry" }
    ]},
    { label: "Financial & Accounting", color: "indigo", icon: "file", reports: [
        { name: "Profit and Loss Statement", sub: "GL Entry" },
        { name: "Balance Sheet", sub: "GL Entry" },
        { name: "Cash Flow", sub: "GL Entry" },
        { name: "General Ledger", sub: "GL Entry" },
        { name: "Trial Balance", sub: "GL Entry" },
        { name: "Payment Ledger", sub: "Payment Ledger Entry" }
    ]},
    { label: "Pricing", color: "purple", icon: "tag", reports: [
        { name: "Item-wise Price List Rate", sub: "Item Price" },
        { name: "Item Price Stock", sub: "Item" },
        { name: "Customer-wise Item Price", sub: "Customer" }
    ]}
];

window.NexoraDashboard.REPORT_CATEGORIES = [
    { key: "sales", label: "Sales", icon: "sales", color: "green", desc: "Registers, analytics & invoices",
      reports: [
        { name: "Sales Register", sub: "Sales Invoice" },
        { name: "Sales Analytics", sub: "Sales Order" },
        { name: "Item-wise Sales Register", sub: "Sales Invoice" },
        { name: "Customer Ledger Summary", sub: "Sales Invoice" },
        { name: "Accounts Receivable", sub: "Sales Invoice" },
        { name: "Sales Order Analysis", sub: "Sales Order" }
      ]},
    { key: "inventory", label: "Inventory", icon: "box", color: "teal", desc: "Stock balance, ledgers & ageing",
      reports: [
        { name: "Stock Balance", sub: "Stock Ledger Entry" },
        { name: "Stock Ledger", sub: "Stock Ledger Entry" },
        { name: "Stock Ageing", sub: "Item" },
        { name: "Item Balance (Simple)", sub: "Bin" },
        { name: "Warehouse Wise Stock Balance", sub: "Stock Ledger Entry" },
        { name: "Total Stock Summary", sub: "Stock Entry" }
      ]},
    { key: "finance", label: "Finance & Accounting", icon: "file", color: "indigo", desc: "Ledgers, statements & cash flow",
      reports: [
        { name: "Profit and Loss Statement", sub: "GL Entry" },
        { name: "Balance Sheet", sub: "GL Entry" },
        { name: "Cash Flow", sub: "GL Entry" },
        { name: "General Ledger", sub: "GL Entry" },
        { name: "Trial Balance", sub: "GL Entry" },
        { name: "Payment Ledger", sub: "Payment Ledger Entry" }
      ]},
    { key: "customers", label: "Customers", icon: "users", color: "blue", desc: "Ledgers, credit & collections",
      reports: [
        { name: "Customer Ledger Summary", sub: "Sales Invoice" },
        { name: "Accounts Receivable", sub: "Sales Invoice" },
        { name: "Customer Credit Balance", sub: "Customer" }
      ]},
    { key: "suppliers", label: "Suppliers", icon: "truck", color: "purple", desc: "Ledgers & payables",
      reports: [
        { name: "Supplier Ledger Summary", sub: "Purchase Invoice" },
        { name: "Accounts Payable", sub: "Purchase Invoice" }
      ]},
    { key: "purchasing", label: "Purchasing", icon: "cart", color: "orange", desc: "Registers & analysis",
      reports: [
        { name: "Purchase Register", sub: "Purchase Invoice" },
        { name: "Purchase Analytics", sub: "Purchase Order" },
        { name: "Item-wise Purchase Register", sub: "Purchase Invoice" },
        { name: "Purchase Order Analysis", sub: "Purchase Order" }
      ]},
    { key: "warehouse", label: "Warehouse", icon: "grid", color: "orange", desc: "Warehouse-wise stock positions",
      reports: [
        { name: "Warehouse Wise Stock Balance", sub: "Stock Ledger Entry" },
        { name: "Stock Balance", sub: "Stock Ledger Entry" }
      ]},
    { key: "pricing", label: "Pricing & Margins", icon: "tag", color: "purple", desc: "Price lists, rates & gross profit",
      reports: [
        { name: "Item-wise Price List Rate", sub: "Item Price" },
        { name: "Item Price Stock", sub: "Item" },
        { name: "Customer-wise Item Price", sub: "Customer" },
        { name: "Gross Profit", sub: "Sales Invoice" }
      ]},
    { key: "cashflow", label: "Cash Flow", icon: "net", color: "teal", desc: "Bank & cash movement",
      reports: [
        { name: "Cash Flow", sub: "GL Entry" },
        { name: "Bank Clearance Summary", sub: "Payment Entry" },
        { name: "Payment Ledger", sub: "Payment Ledger Entry" }
      ]},
    { key: "top", label: "Top Performers", icon: "star", color: "blue", desc: "Top items, customers & suppliers",
      reports: [
        { name: "Item-wise Sales Register", sub: "Sales Invoice" },
        { name: "Customer Ledger Summary", sub: "Sales Invoice" },
        { name: "Supplier Ledger Summary", sub: "Purchase Invoice" }
      ]},
    { key: "slow", label: "Slow Moving", icon: "clock", color: "gray", desc: "Ageing & slow-moving stock",
      reports: [
        { name: "Stock Ageing", sub: "Item" },
        { name: "Item Balance (Simple)", sub: "Bin" }
      ]}
];

// Legacy ERPNext report names -> native catalog report keys. The native Reports
// Engine (nexora_dashboard.reports.js) only understands catalog keys, so legacy
// callers (quick links, dashboard widgets) resolve through this map. Names that
// are not listed here fall back to the embedded ERPNext report viewer.
window.NexoraDashboard.REPORT_KEY_MAP = {
    "Sales Register": "sales_dashboard",
    "Purchase Register": "purchasing_dashboard",
    "Stock Balance": "inventory_dashboard",
    "Stock Valuation": "stock_valuation",
    "Reorder Analysis": "reorder_analysis",
    "ABC Analysis": "abc_analysis",
    "Fast / Slow Moving Items": "fast_slow_moving",
    "Dead Stock": "dead_stock",
    "Receivables Aging": "receivables_aging",
    "Payables Aging": "payables_aging",
    "Cash Flow": "cash_flow",
    "VAT Analysis": "vat_analysis",
    "Expense Analysis": "expense_analysis",
    "Gross Profit": "gross_profit",
    "Accounts Receivable": "receivables_aging",
    "Accounts Payable": "payables_aging",
    "Customer Ledger Summary": "top_customers",
    "Supplier Ledger Summary": "top_suppliers",
    "Item-wise Sales Register": "top_items",
    "Profit and Loss Statement": "profitability_report",
    "Warehouse Wise Stock Balance": "inventory_dashboard",
    "executive_dashboard": "executive_dashboard",
    "sales_dashboard": "sales_dashboard",
    "top_customers": "top_customers",
    "top_items": "top_items",
    "gross_profit": "gross_profit",
    "purchasing_dashboard": "purchasing_dashboard",
    "top_suppliers": "top_suppliers",
    "expense_analysis": "expense_analysis",
    "inventory_dashboard": "inventory_dashboard",
    "stock_valuation": "stock_valuation",
    "reorder_analysis": "reorder_analysis",
    "abc_analysis": "abc_analysis",
    "fast_slow_moving": "fast_slow_moving",
    "dead_stock": "dead_stock",
    "finance_dashboard": "finance_dashboard",
    "receivables_aging": "receivables_aging",
    "payables_aging": "payables_aging",
    "cash_flow": "cash_flow",
    "vat_analysis": "vat_analysis",
    "profitability_report": "profitability_report"
};

window.NexoraDashboard.CENTERS = {
    barcode: { nav: "barcode", icon: "barcode", color: "purple", title: "Barcode Studio", subtitle: "Generate print-ready labels & QR codes" },
    pricing: { nav: "pricing", icon: "tag", color: "green", title: "Pricing Center", subtitle: "Price lists, rates & item pricing", embed: "/app/item-price" },
    shipments: { nav: "shipments", icon: "truck", color: "orange", title: "Shipment Center", subtitle: "Delivery notes & shipment tracking", embed: "/app/delivery-note" },
    exchange: { nav: "exchange", icon: "globe", color: "teal", title: "Exchange Center", subtitle: "Currency exchange rates", embed: "/app/currency-exchange" }
};

window.NexoraDashboard.SETTINGS_ROUTES = {
    "nexora-settings": "/app/nexora-settings",
    "barcode-settings": "/app/barcode-settings",
    "pricing-settings": "/app/item-price",
    "exchange-settings": "/app/currency-exchange",
    "company-settings": "/app/company",
    "notif-settings": "/app/notification-settings",
    "print-settings": "/app/print-settings",
    "stock-settings": "/app/stock-settings"
};

window.NexoraDashboard.SETTINGS_ITEMS = [
    { key: "nexora-settings", icon: "file", color: "blue", title: "Nexora Settings", desc: "Workspace preferences" },
    { key: "barcode-settings", icon: "barcode", color: "purple", title: "Barcode Settings", desc: "Labels, printers & templates" },
    { key: "pricing-settings", icon: "tag", color: "green", title: "Item Pricing", desc: "Price lists and rates" },
    { key: "exchange-settings", icon: "globe", color: "teal", title: "Currency Exchange", desc: "Exchange rates management" },
    { key: "company-settings", icon: "building", color: "orange", title: "Companies", desc: "Companies and defaults" },
    { key: "notif-settings", icon: "bell", color: "red", title: "Notification Settings", desc: "Email and notification rules" },
    { key: "print-settings", icon: "file", color: "indigo", title: "Print Settings", desc: "PDF, letterhead and pages" },
    { key: "stock-settings", icon: "box", color: "gray", title: "Stock Settings", desc: "Inventory behaviour" }
];

window.NexoraDashboard.App = class {
    constructor(wrapper) {
        this.wrapper = (typeof $ !== "undefined" && $(wrapper).get(0)) || wrapper || document.body;
        this.root = null;
        this.state = {
            company: null,
            currency: "SDG",
            companies: [],
            data: null,
            lang: "en",
            theme: (window.localStorage && window.localStorage.getItem("nx-theme")) || "light",
            loading: false,
            timer: null,
            view: "dashboard",
            bcPage: "dashboard",
            embed: null,
            collapsed: (window.localStorage && window.localStorage.getItem("nx-collapsed")) === "1",
            searchOpen: false,
            searchSel: 0,
            searchItems: [],
            notifOpen: false,
            userOpen: false,
            user: (frappe && frappe.boot && frappe.boot.user) || {}
        };
        this.searchDebounce = null;
    }

    init() {
        window.NexoraDashboard.activeApp = this;
        if (document.body) document.body.classList.add("nexora-standalone");
        this.buildShell();
        this.applyLang();
        this.applyTheme();
        this.setDatePill();
        this.bindTopbar();
        this.bindSearch();
        this.bindEsc();
        this.bindOutside();
        this.bindDashCustomize();
        this.setUser();
        this.loadCompanies().then(() => this.load());
        this.startAutoRefresh();
    }

    // ---------------------------------------------------------------- chrome
    t(key, params) {
        return window.NexoraDashboard.t(key, params);
    }

    buildShell() {
        const self = this;
        this.root = document.createElement("div");
        this.root.className = "nx-root";
        if (this.state.collapsed) this.root.classList.add("is-sidebar-collapsed");
        this.wrapper.appendChild(this.root);

        const navDefs = [
            ["dashboard", "chart", "blue", "1", "Executive Dashboard"],
            ["barcode", "barcode", "purple", "2", "Barcode Studio"],
            ["pricing", "tag", "green", "3", "Pricing Center"],
            ["shipments", "truck", "orange", "4", "Shipment Center"],
            ["exchange", "globe", "teal", "5", "Exchange Center"],
            ["reports", "file", "indigo", "6", "Reports Center"],
            ["settings", "settings", "gray", "7", "Settings"]
        ];

        let navHtml = "";
        navDefs.forEach((n, i) => {
            const tip = this.t(n[4]);
            navHtml += `<a class="nx-snav-item ${i === 0 ? "is-active" : ""}" data-nav="${n[0]}" data-tooltip="${this.esc(tip)}" title="${this.esc(tip)}">
                <span class="nx-snav-ic nx-ic-${n[2]}">${this.ic(n[1])}</span>
                <span class="nx-snav-label" data-i18n="${n[4]}">${this.t(n[4])}</span>
                <span class="nx-snav-hint">${n[3]}</span>
            </a>`;
        });

        this.root.innerHTML = `
            <aside class="nx-sidebar">
                <div class="nx-brand">
                    <span class="nx-brand-mark">N</span>
                    <span class="nx-brand-name">${this.t("Nexora")}</span>
                    <span class="nx-brand-tag">${this.t("Suite")}</span>
                </div>
                <nav class="nx-snav">${navHtml}</nav>
                <div class="nx-sidebar-foot">
                    <button class="nx-collapse-btn" data-action="toggle-sidebar">
                        ${this.ic("chevron-left", 15)}<span class="nx-collapse-text">${this.t("Collapse")}</span>
                    </button>
                </div>
            </aside>
            <div class="nx-shell">
                <header class="nx-topbar">
                    <button class="nx-icon-btn" data-action="open-sidebar" title="${this.t("Menu")}">${this.ic("menu")}</button>
                    <div class="nx-topbar-logo">
                        <span class="nx-logo-mark">N</span>
                        <span class="nx-logo-text"><b>Nexora</b><i>${this.t("Enterprise Suite")}</i></span>
                    </div>
                    <div class="nx-search-wrap">
                        <span class="nx-search-ic">${this.ic("search")}</span>
                        <input class="nx-search" type="text" autocomplete="off" spellcheck="false"
                            placeholder="${this.t("Search items, customers, invoices, reports…")}" />
                        <div class="nx-search-panel" hidden></div>
                    </div>
                    <div class="nx-topbar-right">
                        <span class="nx-live"><i class="nx-live-dot"></i><span class="nx-live-time">${this.t("As of")} —</span></span>
                        <span class="nx-currency-pill">${this.esc(this.state.currency)}</span>
                        <select class="nx-select nx-company" data-company></select>
                        <span class="nx-date-pill" data-nx-date></span>
                        <button class="nx-icon-btn" data-action="lang" title="${this.t("Language")}">${this.state.lang === "ar" ? "EN" : "ع"}</button>
                        <button class="nx-icon-btn" data-action="theme" title="${this.t("Theme")}">${this.ic("moon")}</button>
                        <span class="nx-trigger nx-notif-trigger">
                            <button class="nx-icon-btn" data-action="notifications" title="${this.t("Notifications")}">${this.ic("bell")}<span class="nx-notif-badge" hidden></span></button>
                            <div class="nx-popover nx-notif-pop" hidden></div>
                        </span>
                        <span class="nx-sync" data-nx-sync title="${this.esc(this.t("Last data sync"))}"><span class="nx-sync-ic">${this.ic("refresh", 12)}</span><span class="nx-sync-time">${this.esc(this.t("Synced"))} —</span></span>
                        <button class="nx-icon-btn nx-refresh" data-action="refresh" title="${this.t("Refresh")}">${this.ic("refresh")}</button>
                        <div class="nx-user">
                            <button class="nx-user-btn" data-action="user" title=""></button>
                            <div class="nx-popover nx-user-pop" hidden></div>
                        </div>
                    </div>
                </header>
                <main class="nx-main"><div class="nx-loading">${this.t("Loading dashboard")}</div></main>
                <footer class="nx-app-foot">
                    <span class="nx-app-foot-brand">Nexora Enterprise <b>v4.0</b></span>
                    <span class="nx-app-foot-right"><span>${this.t("Nexora")}</span><i class="nx-app-foot-dot"></i><span>${this.t("Powered by ERPNext")}</span></span>
                </footer>
            </div>
        `;

        this.sidebar = this.root.querySelector(".nx-sidebar");
        this.main = this.root.querySelector(".nx-main");
        if (this.state.collapsed) this.sidebar.classList.add("is-collapsed");
    }

    bindTopbar() {
        const self = this;
        this.root.addEventListener("click", (e) => {
            const actionEl = e.target.closest("[data-action]");
            if (actionEl) {
                const action = actionEl.getAttribute("data-action");
                if (action === "refresh") { this.closeAllOverlays(); this.load(); return; }
                if (action === "theme") { this.toggleTheme(); return; }
                if (action === "lang") { this.toggleLang(); return; }
                if (action === "toggle-sidebar") { this.toggleSidebar(); return; }
                if (action === "open-sidebar") { this.openSidebar(); return; }
                if (action === "notifications") { this.toggleNotifications(); return; }
                if (action === "user") { this.toggleUser(); return; }
                return;
            }
            const navEl = e.target.closest("[data-nav]");
            if (navEl) {
                this.goNav(navEl.getAttribute("data-nav"));
                return;
            }
            const hubEl = e.target.closest("[data-hub]");
            if (hubEl) {
                const key = hubEl.getAttribute("data-hub");
                const hub = window.NexoraDashboard.REPORT_HUB.find((h) => h.key === key);
                if (hub) this.openReportViewer(hub.report, { title: this.t(hub.label) + " · " + hub.report, icon: hub.icon, color: hub.color });
                return;
            }
            const catEl = e.target.closest("[data-cat]");
            if (catEl) {
                this.state.reportCat = catEl.getAttribute("data-cat");
                this.renderHub();
                return;
            }
            const backEl = e.target.closest("[data-hubback]");
            if (backEl) {
                this.state.reportCat = null;
                this.renderHub();
                return;
            }
            const reportEl = e.target.closest("[data-report]");
            if (reportEl) {
                const rname = reportEl.getAttribute("data-report");
                this.openReportViewer(rname, { title: rname, icon: "file", color: "indigo", reportCat: this.state.reportCat || undefined });
                return;
            }
            const embedEl = e.target.closest("[data-embedback]");
            if (embedEl) {
                this.closeEmbed();
                return;
            }
            const refreshEl = e.target.closest("[data-embedrefresh]");
            if (refreshEl) {
                if (this.state.embed && this.state.embed.type === "report" && !this.state.embed.rx) {
                    const qr = this.state.__report || frappe.query_report;
                    if (qr && qr.refresh) {
                        if (qr.setup_progress_bar) qr.setup_progress_bar();
                        qr.refresh();
                    }
                } else {
                    const frame = this.main && this.main.querySelector(".nx-embed-frame");
                    if (frame) frame.src = frame.src;
                }
                return;
            }
            const sEl = e.target.closest("[data-sroute]");
            if (sEl) {
                const src = window.NexoraDashboard.SETTINGS_ROUTES[sEl.getAttribute("data-sroute")];
                if (src) this.openEmbed({ src, title: this.t("Settings"), icon: "settings", color: "gray" });
                return;
            }
            const userEl = e.target.closest("[data-useraction]");
            if (userEl) {
                const ua = userEl.getAttribute("data-useraction");
                if (ua === "profile") {
                    this.toggleUser(true);
                    const uname = (this.state.user && this.state.user.name) || "Administrator";
                    this.openEmbed({ src: "/app/user/" + encodeURIComponent(uname), title: this.t("My Profile"), icon: "user", color: "blue" });
                } else if (ua === "desk") {
                    this.toggleUser(true);
                    if (frappe && frappe.set_route) frappe.set_route("home");
                } else if (ua === "logout") {
                    frappe.call({ method: "logout", callback: () => { window.location.href = "/login"; } });
                }
                return;
            }
            const clickEl = e.target.closest("[data-click]");
            if (clickEl) this.runClick(clickEl.getAttribute("data-click"));
        });

        this.root.addEventListener("click", (e) => {
            const rxBackEl = e.target.closest("[data-rx-back]");
            if (rxBackEl && this.state.__rxOrigin === "dashboard") {
                e.stopPropagation();
                e.preventDefault();
                const rx = this.state.__rx;
                if (rx) rx.token++;
                this.state.__rxOrigin = null;
                this.state.embed = null;
                this.state.reportLoading = false;
                this.renderDashboard();
            }
        }, true);

        const companySel = this.root.querySelector("[data-company]");
        if (companySel) {
            companySel.addEventListener("change", () => {
                if (!companySel.value) return;
                this.state.company = companySel.value;
                this.load();
            });
        }
    }

    bindOutside() {
        const self = this;
        this.root.addEventListener("mousedown", (e) => {
            const t = e.target;
            if (this.state.searchOpen && t.closest && !t.closest(".nx-search-wrap")) this.closeSearch();
            if (this.state.notifOpen && t.closest && !t.closest(".nx-notif-trigger")) this.toggleNotifications(true);
            if (this.state.userOpen && t.closest && !t.closest(".nx-user")) this.toggleUser(true);
        });
    }

    bindSearch() {
        const input = this.root.querySelector(".nx-search");
        if (!input) return;
        const panel = this.root.querySelector(".nx-search-panel");
        input.addEventListener("input", () => {
            this.state.searchValue = input.value;
            clearTimeout(this.searchDebounce);
            this.searchDebounce = setTimeout(() => this.runSearch(), 220);
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                this.closeSearch();
                input.blur();
                return;
            }
            if (e.key === "ArrowDown") { e.preventDefault(); this.moveSearch(1); return; }
            if (e.key === "ArrowUp") { e.preventDefault(); this.moveSearch(-1); return; }
            if (e.key === "Enter") { e.preventDefault(); this.openSelected(); return; }
        });
        input.addEventListener("focus", () => {
            if (this.state.searchOpen) return;
            this.openSearch();
        });
        if (panel) {
            panel.addEventListener("click", (e) => {
                const quick = e.target.closest("[data-quick]");
                if (quick) {
                    this.closeSearch();
                    input.blur();
                    this.runQuickAction(quick.getAttribute("data-quick"));
                    return;
                }
                const clear = e.target.closest("[data-searchclear]");
                if (clear) {
                    this.setSearchHistory([]);
                    this.openSearch();
                    return;
                }
                const rec = e.target.closest("[data-recent]");
                if (rec) {
                    const r = this.searchHistory()[parseInt(rec.getAttribute("data-recent"), 10)];
                    if (!r) return;
                    this.closeSearch();
                    input.blur();
                    this.openEmbed({ src: r.route, title: r.title, icon: r.icon || "file", color: r.color || "blue" });
                    return;
                }
                const si = e.target.closest("[data-si]");
                if (si) {
                    this.state.searchSel = parseInt(si.getAttribute("data-si"), 10);
                    this.openSelected();
                }
            });
        }
    }

    bindEsc() {
        if (window.NexoraDashboard.__escBound) return;
        window.NexoraDashboard.__escBound = true;
        document.addEventListener("keydown", (e) => {
            const app = window.NexoraDashboard.activeApp;
            if (!app) return;
            const root = app.root;
            const mounted = root && root.isConnected && root.getBoundingClientRect().width > 0;

            if (e.key === "Escape") {
                if (mounted) {
                    if (app.state.searchOpen) { e.stopPropagation(); e.preventDefault(); app.closeSearch(); return; }
                    if (app.state.notifOpen) { e.stopPropagation(); app.toggleNotifications(true); return; }
                    if (app.state.userOpen) { e.stopPropagation(); app.toggleUser(true); return; }
                    if (app.sidebar && app.sidebar.classList.contains("is-open")) { e.stopPropagation(); app.closeSidebar(); return; }
                    if (app.state.dialog) { e.stopPropagation(); e.preventDefault(); app.closeDialog(); return; }
                    if (app.state.embed) { e.stopPropagation(); e.preventDefault(); app.closeEmbed(); return; }
                    if (app.state.view !== "dashboard") { e.stopPropagation(); app.showView("dashboard"); return; }
                    return;
                }
                const overlayOpen = document.querySelector(".modal.show, .modal-backdrop");
                if (overlayOpen) return;
                e.stopPropagation();
                frappe.set_route("app/nexora");
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                if (!mounted) return;
                e.preventDefault();
                e.stopPropagation();
                const input = app.root.querySelector(".nx-search");
                if (input) { input.focus(); input.select(); }
            }
        });
    }

    setUser() {
        const u = this.state.user || {};
        const name = u.fullname || u.name || "";
        const initials = name.split(/[\s_]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
        const btn = this.root.querySelector(".nx-user-btn");
        if (btn) {
            btn.title = name;
            btn.innerHTML = `<span class="nx-user-avatar">${this.esc(initials)}</span>`;
        }
        const pop = this.root.querySelector(".nx-user-pop");
        if (pop) {
            pop.innerHTML = `<div class="nx-pop-head">
                    <span class="nx-user-avatar">${this.esc(initials)}</span>
                    <span style="display:flex;flex-direction:column;gap:2px;min-width:0">
                        <b style="font-size:13px">${this.esc(name)}</b>
                        <i style="font-style:normal;font-size:11px;color:var(--nx-text-3)">${this.esc(u.name || "")}</i>
                    </span>
                </div>
                <div class="nx-pop-body">
                    <button class="nx-pop-item" data-useraction="profile">${this.ic("user", 15)}<span>${this.t("My Profile")}</span></button>
                    <button class="nx-pop-item" data-useraction="desk">${this.ic("grid", 15)}<span>${this.t("Open ERPNext Desk")}</span></button>
                    <div class="nx-pop-sep"></div>
                    <button class="nx-pop-item is-danger" data-useraction="logout">${this.ic("out", 15)}<span>${this.t("Logout")}</span></button>
                </div>`;
        }
    }

    toggleSidebar() {
        if (window.innerWidth <= 760) {
            if (this.sidebar.classList.contains("is-open")) this.closeSidebar();
            else this.openSidebar();
            return;
        }
        this.state.collapsed = !this.state.collapsed;
        if (window.localStorage) window.localStorage.setItem("nx-collapsed", this.state.collapsed ? "1" : "0");
        this.sidebar.classList.toggle("is-collapsed", this.state.collapsed);
    }

    openSidebar() {
        this.sidebar.classList.add("is-open");
        if (!this.scrim) {
            this.scrim = document.createElement("div");
            this.scrim.className = "nx-sidebar-scrim";
            this.root.appendChild(this.scrim);
            this.scrim.addEventListener("click", () => this.closeSidebar());
        }
    }

    closeSidebar() {
        this.sidebar.classList.remove("is-open");
        if (this.scrim) { this.scrim.remove(); this.scrim = null; }
    }

    closeAllOverlays() {
        this.closeSearch();
        if (this.state.notifOpen) this.toggleNotifications(true);
        if (this.state.userOpen) this.toggleUser(true);
        this.closeDialog();
    }

    // ---------------------------------------------------------------- nav
    goNav(nav) {
        if (nav === "dashboard") { this.showView("dashboard"); return; }
        if (nav === "reports") { this.showView("reports"); return; }
        if (nav === "settings") { this.showView("settings"); return; }
        this.showView(nav);
    }

    showView(view) {
        if (this.state.embed && this.state.embed.view === view) {
            this.closeEmbed();
            return;
        }
        this.state.view = view;
        this.state.embed = null;
        this.closeAllOverlays();
        this.sidebar.querySelectorAll(".nx-snav-item").forEach((i) => {
            i.classList.toggle("is-active", i.getAttribute("data-nav") === view);
        });
        if (window.innerWidth <= 760) this.closeSidebar();
        if (view === "reports") this.renderHub();
        else if (view === "settings") this.renderSettings();
        else if (view === "barcode") this.renderBarcode();
        else if (view === "pricing" || view === "shipments" || view === "exchange") this.renderCenter(view);
        else this.render(this.state.data);
    }

    // ---------------------------------------------------------------- embedded ERPNext (inside Nexora)
    attachIframeStrip(frame) {
        if (!frame) return;
        frame.addEventListener("load", () => {
            try {
                const doc = frame.contentDocument;
                if (!doc) return;
                let st = doc.getElementById("nx-embed-strip");
                if (!st) {
                    st = doc.createElement("style");
                    st.id = "nx-embed-strip";
                    st.textContent = `
                        .desk-sidebar, .navbar, .layout-side-section, .form-sidebar, .form-sidebar-sticky, .modal-backdrop { display:none !important; }
                        body { background: transparent; }
                        .layout-main-section, .main-section { margin:0 !important; padding:0 !important; width:100% !important; max-width:none !important; }
                        .page-container { padding: 0 !important; }
                        #page-container { margin: 0 !important; }
                        .page-head { padding: 10px 14px !important; }
                        .listview-container { padding: 8px 14px !important; }
                        .widget { margin-bottom: 8px !important; }
                    `;
                    doc.head.appendChild(st);
                }
                if (!doc.__nxEscLinked) {
                    doc.__nxEscLinked = true;
                    doc.addEventListener("keydown", (ev) => {
                        if (ev.key === "Escape") {
                            ev.preventDefault();
                            ev.stopPropagation();
                            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
                        }
                    }, true);
                }
            } catch (e) {
                // cross-origin protection should never fire here (same origin)
            }
        });
    }

    openEmbed({ src, title, icon, color, view, reportCat }) {
        this.closeAllOverlays();
        this.state.embed = { src, title, icon: icon || "file", color: color || "blue", view: view || this.state.view, reportCat: reportCat || undefined };
        this.main.innerHTML = `
            <div class="nx-embed" data-report-viewer>
                <div class="nx-embed-bar">
                    <button class="nx-icon-btn nx-embed-back" data-embedback title="${this.esc(this.t("Back"))}">${this.ic("chevron-left", 16)}</button>
                    <span class="nx-embed-ic nx-ic-${color || "blue"}">${this.ic(icon || "file", 15)}</span>
                    <span class="nx-embed-title">${this.esc(title || "")}</span>
                    ${reportCat ? `<span class="nx-badge nx-badge-indigo nx-embed-cat">${this.esc(reportCat)}</span>` : ""}
                    <span class="nx-embed-note">${this.esc(this.t("Nexora") + " · " + this.t("Embedded ERPNext"))}</span>
                    <button class="nx-icon-btn nx-embed-refresh" data-embedrefresh title="${this.esc(this.t("Refresh report"))}">${this.ic("refresh", 15)}</button>
                </div>
                <iframe class="nx-embed-frame" src="${this.esc(src)}" loading="eager"></iframe>
            </div>`;
        this.attachIframeStrip(this.main.querySelector(".nx-embed-frame"));
    }

    closeEmbed() {
        const was = this.state.embed;
        this.state.embed = null;
        this.destroyReport();
        const v = this.state.view;
        if (v === "reports") {
            if (was && was.reportCat) this.state.reportCat = was.reportCat;
            this.renderHub();
        }
        else if (v === "settings") this.renderSettings();
        else if (v === "barcode") this.renderBarcode();
        else if (v === "pricing" || v === "shipments" || v === "exchange") this.renderCenter(v);
        else this.render(this.state.data);
    }

    // ---------------------------------------------------------------- native embedded report viewer
    __resolveReportKey(name) {
        const key = (name || "").trim();
        if (!key) return null;
        const map = window.NexoraDashboard.REPORT_KEY_MAP || {};
        return map[key] || key;
    }

    openReportViewer(reportName, opts) {
        opts = opts || {};
        const key = this.__resolveReportKey(reportName);
        const RX = window.NexoraDashboard && window.NexoraDashboard.Reports;
        if (RX && typeof RX.open === "function" && key && window.NexoraDashboard.REPORT_KEY_MAP && window.NexoraDashboard.REPORT_KEY_MAP[reportName]) {
            this.state.__rxOrigin = opts.view || this.state.view || "dashboard";
            RX.open(this, key, {
                title: opts.title || reportName,
                icon: opts.icon || "file",
                color: opts.color || "indigo",
                reportCat: opts.reportCat,
                view: opts.view || this.state.view
            });
            return;
        }
        const self = this;
        this.closeAllOverlays();
        this.state.embed = {
            type: "report",
            reportName: reportName,
            title: opts.title || reportName,
            icon: opts.icon || "file",
            color: opts.color || "indigo",
            reportCat: opts.reportCat || undefined,
            view: opts.view || this.state.view
        };
        this.state.__reportToken = (this.state.__reportToken || 0) + 1;
        const token = this.state.__reportToken;
        this.state.__report = null;
        this.state.reportLoading = true;
        this.state.__filtersOpen = true;
        this.state.__reportFullscreen = false;
        const rIcon = opts.icon || "file";
        const rColor = opts.color || "indigo";
        this.main.innerHTML = `
            <div class="nx-report" data-report-viewer>
                <div class="nx-report-head">
                    <div class="nx-report-crumb">
                        <button class="nx-icon-btn nx-report-back" data-embedback title="${this.esc(this.t("Back"))}">${this.ic("chevron-left", 17)}</button>
                        <span class="nx-report-crumb-txt">
                            <span data-embedcrumb>${this.esc(this.t("Reports"))}</span>
                            <span class="nx-report-crumb-sep">${this.ic("chevron-right", 12)}</span>
                            <span class="is-cur">${this.esc(this.state.embed.title)}</span>
                        </span>
                    </div>
                    <div class="nx-report-headrow">
                        <span class="nx-report-ic nx-ic-${rColor}">${this.ic(rIcon, 18)}</span>
                        <div class="nx-report-titles">
                            <div class="nx-report-title">${this.esc(this.state.embed.title)}</div>
                            <div class="nx-report-desc" data-report-desc>${this.esc(this.t("Loading report configuration…"))}</div>
                        </div>
                        ${opts.reportCat ? `<span class="nx-badge nx-badge-indigo nx-report-cat">${this.esc(opts.reportCat)}</span>` : ""}
                        <span class="nx-report-meta" data-report-meta></span>
                        <button class="nx-icon-btn nx-report-refresh" data-embedrefresh title="${this.esc(this.t("Refresh report"))}">${this.ic("refresh", 16)}</button>
                    </div>
                </div>
                <div class="nx-report-actions">
                    <button class="nx-raction" data-embedaction="refresh" title="${this.esc(this.t("Refresh report"))}">${this.ic("refresh", 14)}<span>${this.esc(this.t("Refresh"))}</span></button>
                    <button class="nx-raction is-active" data-embedaction="filters" title="${this.esc(this.t("Toggle filters"))}">${this.ic("filter", 14)}<span>${this.esc(this.t("Filters"))}</span></button>
                    <span class="nx-raction-sep"></span>
                    <button class="nx-raction" data-embedaction="export-excel" title="${this.esc(this.t("Export Excel"))}">${this.ic("download", 14)}<span>${this.esc(this.t("Export Excel"))}</span></button>
                    <button class="nx-raction" data-embedaction="export-pdf" title="${this.esc(this.t("Export PDF"))}">${this.ic("file", 14)}<span>${this.esc(this.t("Export PDF"))}</span></button>
                    <button class="nx-raction" data-embedaction="print" title="${this.esc(this.t("Print"))}">${this.ic("print", 14)}<span>${this.esc(this.t("Print"))}</span></button>
                    <span class="nx-raction-grow"></span>
                    <button class="nx-raction" data-embedaction="share" title="${this.esc(this.t("Share"))}">${this.ic("share", 14)}<span>${this.esc(this.t("Share"))}</span></button>
                    <button class="nx-raction" data-embedaction="save" title="${this.esc(this.t("Save View"))}">${this.ic("save", 14)}<span>${this.esc(this.t("Save View"))}</span></button>
                    <button class="nx-raction" data-embedaction="fullscreen" title="${this.esc(this.t("Fullscreen"))}">${this.ic("maximize", 14)}<span>${this.esc(this.t("Fullscreen"))}</span></button>
                    <button class="nx-raction nx-raction-danger" data-embedaction="reset" title="${this.esc(this.t("Reset"))}">${this.ic("rotate", 14)}<span>${this.esc(this.t("Reset"))}</span></button>
                </div>
                <div class="nx-report-filters" data-report-filters>
                    <div class="nx-report-filters-head">
                        <span class="nx-report-filters-title">${this.ic("sliders", 13)} ${this.esc(this.t("Report Filters"))}</span>
                        <span class="nx-report-filters-note" data-report-filters-note></span>
                        <button class="nx-icon-btn" data-embedaction="filters" title="${this.esc(this.t("Close"))}">${this.ic("x", 14)}</button>
                    </div>
                    <div class="nx-report-filters-body" data-report-filters-body></div>
                </div>
                <div class="nx-report-body" data-report-body>
                    <div class="nx-report-loading">${this.ic("refresh", 20)} <span>${this.esc(this.t("Preparing report…"))}</span></div>
                </div>
            </div>`;
        const body = this.main.querySelector("[data-report-body]");
        const fail = (err) => {
            if (token !== this.state.__reportToken) return;
            this.state.reportLoading = false;
            this.renderReportError(err);
        };
        frappe.require(["list.bundle.js", "report.bundle.js"]).then(() => {
            if (token !== this.state.__reportToken) return;
            try {
                const wrapper = document.createElement("div");
                wrapper.className = "nx-report-mount";
                body.appendChild(wrapper);
                const savedRoute = frappe.router.current_route;
                frappe.router.current_route = ["query-report", reportName];
                const page = frappe.ui.make_app_page({ parent: wrapper, title: reportName, single_column: true });
                const qr = new frappe.views.QueryReport({ parent: wrapper, page: page });
                qr.update_url_with_filters = function () {}; // never rewrite the Nexora URL
                frappe.query_report = qr;
                if (token !== this.state.__reportToken) { frappe.router.current_route = savedRoute; return; }
                this.state.__report = qr;
                this.__wireReportActions(qr);
                frappe.route_options = { ignore_prepared_report: true };
                qr.render_chart = function () {};
                const oSetup = qr.setup_filters;
                qr.setup_filters = function () {
                    const r = oSetup.apply(this, arguments);
                    if (token !== self.state.__reportToken) return r;
                    const fill = self.__fillMissingReqd(this, true);
                    if (fill && fill.then) return fill.then(() => r);
                    return r;
                };
                qr.init()
                    .then(() => {
                        if (token !== this.state.__reportToken) return;
                        this.__adoptReportUI(qr);
                        return qr.load();
                    })
                    .then(() => {
                        frappe.router.current_route = savedRoute;
                        if (token !== this.state.__reportToken) return;
                        this.state.reportLoading = false;
                        this.__adoptReportUI(qr);
                    })
                    .catch((err) => {
                        frappe.router.current_route = savedRoute;
                        fail(err);
                    });
                this.__autoReportReady(qr, token, savedRoute);
            } catch (err) {
                fail(err);
            }
        }).catch(fail);
    }

    __fillMissingReqd(qr, silent) {
        const self = this;
        if (!qr || !qr.filters || !qr.filters.length) return Promise.resolve(false);
        const missing = (qr.filters || []).filter((f) => (f.df.reqd || f.df.mandatory) && !f.get_value());
        if (!missing.length) return Promise.resolve(false);
        const jobs = missing.map((f) => {
            const df = f.df;
            if (df.fieldtype === "Link" && df.options) {
                if (df.options === "Company") {
                    const def = (frappe.defaults.get_user_default && frappe.defaults.get_user_default("company"))
                        || (frappe.boot && frappe.boot.sys_defaults && frappe.boot.sys_defaults.company);
                    if (def) return Promise.resolve([df.fieldname, def]);
                    return frappe.db.get_list("Company", { fields: ["name"], limit_page_length: 1 })
                        .then((r) => (r && r.length ? [df.fieldname, r[0].name] : null));
                }
                if (df.options === "Account") {
                    return frappe.db.get_list("Account", { fields: ["name"], filters: { is_group: 0, account_type: "Bank" }, limit_page_length: 1 })
                        .then((r) => (r && r.length
                            ? [df.fieldname, r[0].name]
                            : frappe.db.get_list("Account", { fields: ["name"], filters: { is_group: 0 }, limit_page_length: 1 })
                                .then((r2) => (r2 && r2.length ? [df.fieldname, r2[0].name] : null))));
                }
                return frappe.db.get_list(df.options, { fields: ["name"], limit_page_length: 1 })
                    .then((r) => (r && r.length ? [df.fieldname, r[0].name] : null));
            }
            if (df.fieldtype === "Date") {
                const v = /from_date/.test(df.fieldname)
                    ? frappe.datetime.add_months(frappe.datetime.get_today(), -12)
                    : frappe.datetime.get_today();
                return Promise.resolve([df.fieldname, v]);
            }
            if (df.fieldtype === "Fiscal Year") {
                let fy = (frappe.boot && frappe.boot.sys_defaults && frappe.boot.sys_defaults.fiscal_year);
                if (!fy) {
                    return frappe.db.get_list("Fiscal Year", { fields: ["name"], order_by: "creation desc", limit_page_length: 1 })
                        .then((r) => (r && r.length ? [df.fieldname, r[0].name] : null));
                }
                return Promise.resolve([df.fieldname, fy]);
            }
            return Promise.resolve(null);
        });
        return Promise.all(jobs).then((filled) => {
            const map = {};
            filled.forEach((kv) => { if (kv) map[kv[0]] = kv[1]; });
            if (!Object.keys(map).length) return false;
            qr.set_filter_value(map);
            if (!silent && qr.refresh) qr.refresh();
            return true;
        });
    }

    __autoReportReady(qr, token, savedRoute) {
        const self = this;
        const oShow = qr.show_loading_screen;
        const oHide = qr.hide_loading_screen;
        qr.show_loading_screen = function () { self.state.__reportLoadingShown = true; return oShow.apply(this, arguments); };
        qr.hide_loading_screen = function () {
            self.state.__reportLoadingShown = false;
            const r = oHide.apply(this, arguments);
            try { self.__updateReportMeta(); } catch (e) {}
            try { self.__reportAnalytics(qr); } catch (e) {}
            return r;
        };
        const done = () => {
            if (token !== self.state.__reportToken) return;
            self.__restoreReportRoute(savedRoute);
            self.state.reportLoading = false;
            const body = self.main && self.main.querySelector("[data-report-body]");
            const ld = body && body.querySelector(".nx-report-loading");
            if (ld) ld.style.display = "none";
            self.__adoptReportUI(qr);
            try { self.__reportAnalytics(qr); } catch (e) {}
        };
        let attempts = 0;
        const attempt = () => {
            if (token !== self.state.__reportToken) return;
            const body = self.main && self.main.querySelector("[data-report-body]");
            if (body && body.querySelector(".nx-report-error")) { done(); return; }
            const hasData = !!(qr.datatable) || (qr.$report && qr.$report.is(":visible"));
            let emptyState = false;
            try { emptyState = !!(qr.$nothing_to_show && qr.$nothing_to_show.is(":visible")); } catch (e) {}
            let msg = "";
            if (qr.$message && qr.$message.is(":visible")) {
                const p = qr.$message.find("p").last();
                if (p.length) msg = (p.text() || "").trim();
            }
            const emptyMsg = (typeof __ !== "undefined" ? __("Nothing to show") : "Nothing to show");
            let emptyShown = msg === emptyMsg || msg === "Nothing to show";
            if (!emptyShown) {
                try {
                    const el = body && body.querySelector(".msg-box.no-border p");
                    if (el && el.textContent) {
                        const t = el.textContent.trim();
                        emptyShown = t === "Nothing to show" || t === emptyMsg;
                    }
                } catch (e) {}
            }
            if (emptyShown) self.__markReportEmpty(qr);
            if (hasData || emptyState || emptyShown) { done(); return; }
            attempts++;
            if (attempts === 1) {
                self.__fillMissingReqd(qr, true).then(() => {
                    if (token !== self.state.__reportToken) return;
                    setTimeout(attempt, 7000);
                });
                return;
            }
            if (attempts === 2 || attempts === 3) {
                if (qr.setup_progress_bar) qr.setup_progress_bar();
                qr.refresh();
                setTimeout(attempt, 8000);
                return;
            }
            done();
            if (token === self.state.__reportToken) {
                self.renderReportError(new Error(self.t("Report is taking too long. Please set filters and try again.")));
            }
        };
        setTimeout(attempt, 6000);
    }

    __markReportEmpty(qr) {
        try {
            const body = this.main && this.main.querySelector("[data-report-body]");
            let el = (qr && qr.$message && qr.$message.length) ? qr.$message[0] : null;
            if (el) {
                const box = el.querySelector(".msg-box") || el;
                box.classList.add("nothing-to-show", "nx-report-empty");
            }
            const ld = body && body.querySelector(".nx-report-loading");
            if (ld) ld.style.display = "none";
        } catch (e) {}
    }

    __restoreReportRoute(savedRoute) {
        if (savedRoute) frappe.router.current_route = savedRoute;
    }

    // ------------------------------------------------ presentation-only report UI (no logic changes)
    __findReportFilterContainer(qr) {
        const candidates = [];
        if (qr.filter_area) candidates.push(qr.filter_area);
        if (qr.$filter_wrapper) candidates.push(qr.$filter_wrapper);
        if (qr.filters && qr.filters.wrapper) candidates.push(qr.filters.wrapper);
        if (qr.parent) {
            candidates.push(qr.parent.querySelector(".report-wrapper .filter-area"));
            candidates.push(qr.parent.querySelector(".filter-area"));
            candidates.push(qr.parent.querySelector(".page-form"));
        }
        for (let i = 0; i < candidates.length; i++) {
            let el = candidates[i];
            if (!el) continue;
            if (el.jquery) el = el[0];
            if (el && el.parentNode) return el;
        }
        return null;
    }

    __adoptReportUI(qr) {
        const root = this.main && this.main.querySelector("[data-report-viewer]");
        if (!root || !qr) return;
        const panelBody = this.main.querySelector("[data-report-filters-body]");
        if (panelBody) {
            const current = this.__findReportFilterContainer(qr);
            if (current && !panelBody.contains(current)) {
                const moved = panelBody.querySelector(".nx-adopted-form");
                if (moved && moved !== current) {
                    try { moved.remove(); } catch (e) {}
                }
                try {
                    panelBody.appendChild(current);
                    current.classList.add("nx-adopted-form");
                } catch (e) {}
            }
        }
        if (qr.filters && qr.filters.length === 0) {
            root.classList.add("nx-filters-empty");
        } else {
            root.classList.remove("nx-filters-empty");
        }
        const headContent = qr.parent && qr.parent.querySelector(".page-head-content");
        if (headContent && headContent.style.display !== "none") headContent.style.display = "none";
        const descEl = root.querySelector("[data-report-desc]");
        if (descEl) {
            const sub = qr.parent && qr.parent.querySelector(".page-head .sub-heading");
            const txt = sub && (sub.textContent || "").trim();
            if (txt) { descEl.textContent = txt; descEl.classList.add("has-text"); descEl.style.display = ""; }
            else if (!descEl.classList.contains("has-text")) descEl.style.display = "none";
        }
        this.__updateReportMeta();
        const filtersNote = root.querySelector("[data-report-filters-note]");
        if (filtersNote && qr.filters) {
            filtersNote.textContent = qr.filters.length
                ? this.num(qr.filters.length, 0) + " " + this.t(qr.filters.length === 1 ? "filter" : "filters")
                : "";
        }
    }

    __reportAnalytics(qr) {
        try {
            const RX = window.NexoraDashboard && window.NexoraDashboard.ReportX;
            if (RX && typeof RX.update === "function") RX.update(this, qr);
        } catch (e) {}
    }

    __updateReportMeta() {
        const root = this.main && this.main.querySelector("[data-report-viewer]");
        if (!root) return;
        const el = root.querySelector("[data-report-meta]");
        if (!el) return;
        const dt = this.state.__reportRefreshedAt || new Date();
        this.state.__reportRefreshedAt = dt;
        el.innerHTML = `${this.ic("clock", 12)} ${this.esc(this.t("Updated {0}", [this.__relTime(dt)]))}`;
    }

    __relTime(dt) {
        const s = Math.max(0, Math.round((Date.now() - dt.getTime()) / 1000));
        if (s < 45) return this.t("just now");
        const m = Math.floor(s / 60);
        if (m < 60) return this.t("{0} min ago", [m]);
        const h = Math.floor(m / 60);
        if (h < 24) return this.t("{0} hr ago", [h]);
        return this.t("{0} days ago", [Math.floor(h / 24)]);
    }

    __wireReportActions(qr) {
        const self = this;
        const root = this.main && this.main.querySelector("[data-report-viewer]");
        if (!root || !qr) return;
        root.querySelectorAll("[data-embedaction]").forEach((btn) => {
            if (btn.getAttribute("data-wired") === "1") return;
            btn.setAttribute("data-wired", "1");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.__runReportAction(qr, btn.getAttribute("data-embedaction"), btn);
            });
        });
    }

    __runReportAction(qr, act, btn) {
        const q = qr || frappe.query_report;
        switch (act) {
            case "refresh":
                if (q && q.refresh) {
                    if (q.setup_progress_bar) q.setup_progress_bar();
                    this.state.__reportRefreshedAt = new Date();
                    this.__updateReportMeta();
                    q.refresh();
                    setTimeout(() => this.__updateReportMeta(), 1500);
                }
                break;
            case "filters":
                this.__toggleReportFilters();
                break;
            case "export-excel":
                this.__reportExport(q, "Excel");
                break;
            case "export-pdf":
                this.__reportExport(q, "PDF");
                break;
            case "print":
                this.__reportPrint(q);
                break;
            case "fullscreen":
                this.__toggleReportFullscreen();
                break;
            case "share":
                this.__reportShare(q, btn);
                break;
            case "save":
                this.__reportSaveView(q);
                break;
            case "reset":
                this.__reportReset(q);
                break;
        }
    }

    __toggleReportFilters(force) {
        const root = this.main && this.main.querySelector("[data-report-viewer]");
        if (!root) return;
        const open = force === undefined ? !this.state.__filtersOpen : !!force;
        this.state.__filtersOpen = open;
        root.classList.toggle("nx-filters-collapsed", !open);
        root.querySelectorAll('[data-embedaction="filters"]').forEach((b) => b.classList.toggle("is-active", open));
    }

    __toggleReportFullscreen() {
        const root = this.main && this.main.querySelector("[data-report-viewer]");
        if (!root) return;
        this.state.__reportFullscreen = !this.state.__reportFullscreen;
        root.classList.toggle("nx-report-fullscreen", this.state.__reportFullscreen);
    }

    __reportExport(q, format) {
        if (q && typeof q.get_export_dialog === "function") {
            try { q.get_export_dialog(format); return; } catch (e) {}
        }
        const btn = this.__findReportBtn(format === "PDF" ? ["Print", "PDF"] : ["Export"]);
        if (btn) { try { btn.click(); } catch (e) {} }
    }

    __reportPrint(q) {
        if (q && typeof q.print_report === "function") {
            try { q.print_report(); return; } catch (e) {}
        }
        const btn = this.__findReportBtn(["Print"]);
        if (btn) { try { btn.click(); } catch (e) {} return; }
        window.print();
    }

    __reportSaveView(q) {
        const btn = this.__findReportBtn(["Save"]);
        if (btn) { try { btn.click(); } catch (e) {} return; }
        if (q && q.filters && typeof q.filters.save === "function") {
            try { q.filters.save(); } catch (e) {}
        }
    }

    __reportReset(q) {
        if (!q || !q.filters || !q.filters.length) return;
        q.filters.forEach((f) => {
            try {
                if (!f || !f.df) return;
                const def = f.df.default || (f.df.fieldtype === "Date" ? "" : "");
                f.set_value(def);
            } catch (e) {}
        });
        if (q.refresh) {
            if (q.setup_progress_bar) q.setup_progress_bar();
            q.refresh();
        }
    }

    __reportShare(q, btn) {
        const name = (q && q.report_name) || (this.state.embed && this.state.embed.title) || "Report";
        const url = window.location.origin + window.location.pathname + "?nexora_report=" + encodeURIComponent(name);
        const text = this.t("Open {0} in Nexora Reports", [name]) + " — " + url;
        const done = () => this.__flashReportAction(btn);
        const fallback = () => {
            try {
                const ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            } catch (e) {}
            done();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, fallback);
        } else {
            fallback();
        }
    }

    __flashReportAction(btn) {
        if (!btn) return;
        const prev = btn.innerHTML;
        btn.classList.add("is-flash");
        btn.innerHTML = `${this.ic("check", 14)}<span>${this.esc(this.t("Copied"))}</span>`;
        clearTimeout(this.state.__flashTimer);
        this.state.__flashTimer = setTimeout(() => {
            btn.innerHTML = prev;
            btn.classList.remove("is-flash");
        }, 1400);
    }

    __findReportBtn(labels) {
        const mount = this.main && this.main.querySelector(".nx-report-mount");
        if (!mount) return null;
        const nodes = mount.querySelectorAll("button, .btn, [data-action]");
        for (let i = 0; i < nodes.length; i++) {
            const b = nodes[i];
            const hay = ((b.textContent || "") + " " + (b.getAttribute("title") || "") + " " + (b.getAttribute("data-action") || "")).trim().toLowerCase();
            for (let j = 0; j < labels.length; j++) {
                const l = labels[j].toLowerCase();
                if (new RegExp("(^|[^a-z])" + l + "([^a-z]|$)", "i").test(hay)) return b;
            }
        }
        return null;
    }

    destroyReport() {
        const RX = window.NexoraDashboard && window.NexoraDashboard.Reports;
        if (RX && typeof RX.destroy === "function") {
            try { RX.destroy(this); } catch (e) {}
        }
        this.state.__reportToken = (this.state.__reportToken || 0) + 1;
        const qr = this.state.__report;
        this.state.__report = null;
        this.state.reportLoading = false;
        if (!qr) {
            if (frappe.query_report && frappe.query_report.report_name && frappe.query_report.parent) {
                const mount = frappe.query_report.parent;
                if (mount && mount.parentNode) mount.parentNode.removeChild(mount);
                frappe.query_report = null;
            }
            return;
        }
        try {
            if (qr.datatable) qr.datatable.destroy();
        } catch (e) {}
        const mount = qr.parent;
        if (mount && mount.parentNode) mount.parentNode.removeChild(mount);
        if (frappe.query_report === qr) frappe.query_report = null;
    }

    renderReportError(err) {
        const body = this.main && this.main.querySelector("[data-report-body]");
        if (!body) return;
        body.innerHTML = `
            <div class="nx-report-error">
                <div class="nx-report-error-ic">${this.ic("alert", 26)}</div>
                <div class="nx-report-error-title">${this.esc(this.t("Could not open report"))}</div>
                <div class="nx-report-error-msg">${this.esc((err && err.message) || String(err))}</div>
                <button class="nx-btn nx-btn-secondary" data-embedback>${this.esc(this.t("Back to Reports Center"))}</button>
            </div>`;
    }

    // ---------------------------------------------------------------- dialog (design system)
    showDialog(opts) {
        opts = opts || {};
        this.closeDialog();
        const wrap = document.createElement("div");
        wrap.className = "nx-dialog-overlay";
        const themeAttr = this.root ? this.root.getAttribute("data-nx-theme") : "";
        if (themeAttr) wrap.setAttribute("data-nx-theme", themeAttr);
        wrap.innerHTML = `
            <div class="nx-dialog" role="dialog" aria-modal="true" style="max-width:${Math.max(320, parseInt(opts.width, 10) || 520)}px">
                ${opts.title ? `<div class="nx-dialog-head">
                    <span class="nx-dialog-title">${this.esc(opts.title)}</span>
                    <button class="nx-icon-btn" data-dlgclose title="${this.esc(this.t("Close"))}">${this.ic("x", 15)}</button>
                </div>` : ""}
                <div class="nx-dialog-body">${opts.body || ""}</div>
                ${opts.actions && opts.actions.length ? `<div class="nx-dialog-actions">${opts.actions.map((a, i) =>
                    `<button class="nx-btn ${a.variant === "primary" ? "nx-btn-primary" : (a.variant === "danger" ? "nx-btn-danger" : (a.variant === "link" ? "nx-btn-link" : "nx-btn-secondary"))}" data-dlgact="${i}">${this.esc(a.label || "")}</button>`).join("")}</div>` : ""}
            </div>`;
        document.body.appendChild(wrap);
        this.state.dialog = { wrap, actions: opts.actions || [] };
        const api = {
            el: wrap,
            close: () => this.closeDialog()
        };
        const closeBtn = wrap.querySelector("[data-dlgclose]");
        if (closeBtn) closeBtn.addEventListener("click", () => this.closeDialog());
        wrap.addEventListener("mousedown", (e) => {
            if (e.target === wrap) this.closeDialog();
        });
        wrap.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { e.stopPropagation(); this.closeDialog(); }
            if (e.key === "Enter") {
                const primary = wrap.querySelector("[data-dlgact].nx-btn-primary");
                if (primary && e.target !== primary) { e.preventDefault(); primary.click(); }
            }
        });
        wrap.querySelectorAll("[data-dlgact]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.getAttribute("data-dlgact"), 10);
                const act = (opts.actions || [])[i];
                if (act && act.click) act.click(api);
            });
        });
        if (opts.onCreate) opts.onCreate(api);
        const first = wrap.querySelector("input, select, textarea, button:not([data-dlgclose])");
        if (first) setTimeout(() => { try { first.focus(); } catch (e) {} }, 20);
    }

    closeDialog() {
        if (this.state.dialog && this.state.dialog.wrap) {
            this.state.dialog.wrap.remove();
            this.state.dialog = null;
        }
    }

    pageHeader(opts) {
        return `<div class="nx-page">
            <div class="nx-breadcrumb"><span>${this.esc(opts.crumb[0])}</span><span class="nx-sep">/</span><span class="is-current">${this.esc(opts.crumb[1])}</span></div>
            <div class="nx-page-head">
                <span class="nx-page-accent" style="--nx-page-accent:var(--nx-${opts.color})"></span>
                <span class="nx-page-ic nx-ic-${opts.color}">${this.ic(opts.icon)}</span>
                <div>
                    <div class="nx-page-title">${this.esc(opts.title)}</div>
                    <div class="nx-page-subtitle">${this.esc(opts.subtitle)}</div>
                </div>
            </div>
        </div>`;
    }

    renderHub() {
        const RX = window.NexoraDashboard && window.NexoraDashboard.Reports;
        if (RX && typeof RX.hub === "function") {
            RX.hub(this);
            return;
        }
        const cat = this.state.reportCat
            ? window.NexoraDashboard.REPORT_CATEGORIES.find((c) => c.key === this.state.reportCat)
            : null;
        if (cat) {
            this.renderCategory(cat);
            return;
        }
        let html = this.pageHeader({
            icon: "file", color: "indigo",
            title: this.t("Reports Center"),
            subtitle: this.t("Enterprise Report Hub — every ERPNext report, rendered inside Nexora"),
            crumb: [this.t("Nexora"), this.t("Reports Center")]
        });
        html += `<div class="nx-hub-toolbar">
            <div class="nx-hub-search">
                <span class="nx-search-ic">${this.ic("search")}</span>
                <input class="nx-input nx-hub-filter" data-report-filter type="text" autocomplete="off" spellcheck="false"
                    placeholder="${this.esc(this.t("Filter reports by name…"))}" />
            </div>
            <span class="nx-hub-count" data-cat-count>${this.num(window.NexoraDashboard.REPORT_CATEGORIES.length, 0)} ${this.t("categories")}</span>
        </div>`;
        html += `<div class="nx-hub-grid" data-hub-grid>`;
        window.NexoraDashboard.REPORT_CATEGORIES.forEach((c) => {
            html += `<div class="nx-card nx-hub-card nx-hub-${c.color}" data-cat="${c.key}" data-cat-label="${this.esc(c.label)}" data-cat-desc="${this.esc(c.desc)}">
                <div class="nx-hub-top">
                    <span class="nx-hub-ic nx-ic-${c.color}">${this.ic(c.icon, 20)}</span>
                    <span class="nx-hub-open">${this.ic("arrow-right", 14)}</span>
                </div>
                <div class="nx-hub-name">${this.t(c.label)}</div>
                <div class="nx-hub-sub">${this.esc(c.desc)}</div>
                <div class="nx-hub-foot"><span class="nx-badge nx-badge-${c.color}">${this.num(c.reports.length, 0)} ${this.t("reports")}</span></div>
            </div>`;
        });
        html += `</div>`;

        html += `<details class="nx-allreports"><summary>${this.t("All reports")} (${this.t("advanced")})</summary>`;
        window.NexoraDashboard.REPORT_GROUPS.forEach((g) => {
            html += `<div class="nx-reports-group">
                <div class="nx-reports-group-title"><span class="nx-snav-ic nx-ic-${g.color}">${this.ic(g.icon, 15)}</span>${this.t(g.label)}</div>
                <div class="nx-reports">`;
            g.reports.forEach((r) => {
                html += `<div class="nx-report-card" data-report="${this.esc(r.name)}">
                    <span class="nx-snav-ic nx-ic-${g.color}">${this.ic(r.icon || g.icon, 17)}</span>
                    <span class="nx-report-txt">
                        <span class="nx-report-name">${this.esc(r.name)}</span>
                        <span class="nx-report-sub">${this.esc(r.sub)}</span>
                    </span>
                    <span class="nx-report-arrow">${this.ic("arrow-right", 14)}</span>
                </div>`;
            });
            html += `</div></div>`;
        });
        html += `</details>`;
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
        this.bindReportFilter();
    }

    renderCategory(cat) {
        let html = this.pageHeader({
            icon: cat.icon, color: cat.color,
            title: this.t(cat.label),
            subtitle: this.t(cat.desc),
            crumb: [this.t("Nexora"), this.t("Reports Center")]
        });
        html += `<div class="nx-cat-bar">
            <button class="nx-btn nx-btn-secondary nx-btn-sm" data-hubback>${this.ic("chevron-left", 14)} ${this.t("All categories")}</button>
            <span class="nx-badge nx-badge-${cat.color}">${this.num(cat.reports.length, 0)} ${this.t("reports")}</span>
            <span class="nx-cat-note">${this.esc(this.t("Reports open inside Nexora — no navigation away."))}</span>
        </div>`;
        html += `<div class="nx-reports nx-cat-reports">`;
        cat.reports.forEach((r) => {
            html += `<div class="nx-report-card" data-report="${this.esc(r.name)}" data-report-label="${this.esc(r.name)}" data-report-sub="${this.esc(r.sub)}">
                <span class="nx-snav-ic nx-ic-${cat.color}">${this.ic(r.icon || cat.icon, 17)}</span>
                <span class="nx-report-txt">
                    <span class="nx-report-name">${this.esc(r.name)}</span>
                    <span class="nx-report-sub">${this.esc(r.sub)}</span>
                </span>
                <span class="nx-report-arrow">${this.ic("arrow-right", 14)}</span>
            </div>`;
        });
        html += `</div>`;
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
    }

    bindReportFilter() {
        const input = this.root.querySelector("[data-report-filter]");
        if (!input) return;
        const apply = () => {
            const q = (input.value || "").trim().toLowerCase();
            this.root.querySelectorAll("[data-cat]").forEach((el) => {
                const hay = (el.getAttribute("data-cat-label") + " " + el.getAttribute("data-cat-desc")).toLowerCase();
                el.style.display = !q || hay.indexOf(q) !== -1 ? "" : "none";
            });
            const count = this.root.querySelector("[data-cat-count]");
            if (count) {
                const visible = [...this.root.querySelectorAll("[data-cat]")].filter((el) => el.style.display !== "none").length;
                count.textContent = this.num(visible, 0) + " " + this.t("categories");
            }
        };
        input.addEventListener("input", apply);
    }

    renderCenter(centerKey) {
        const c = window.NexoraDashboard.CENTERS[centerKey];
        if (!c) { this.render(this.state.data); return; }
        let html = this.pageHeader({
            icon: c.icon, color: c.color,
            title: this.t(c.title),
            subtitle: this.t(c.subtitle),
            crumb: [this.t("Nexora"), this.t(c.title)]
        });
        if (centerKey === "barcode") {
            this.renderBarcode();
            return;
        }
        html += `<div class="nx-embed nx-embed-inline">
            <div class="nx-embed-frame-wrap">
                <iframe class="nx-embed-frame" src="${this.esc(c.embed)}" loading="eager"></iframe>
            </div>
        </div>`;
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
        this.attachIframeStrip(this.main.querySelector(".nx-embed-frame"));
    }

    // ---------------------------------------------------------------- barcode studio
    bcPages() {
        return [
            { key: "dashboard", icon: "chart", color: "blue", label: "Barcode Dashboard" },
            { key: "print", icon: "barcode", color: "purple", label: "Print Studio" },
            { key: "browser", icon: "search", color: "teal", label: "Item Browser" },
            { key: "nobc", icon: "alert", color: "red", label: "Items Without Barcode" },
            { key: "pr", icon: "incoming", color: "orange", label: "PR Pending Barcode" },
            { key: "pi", icon: "outgoing", color: "orange", label: "PI Pending Barcode" },
            { key: "generated", icon: "star", color: "green", label: "Generated Barcodes" },
            { key: "templates", icon: "grid", color: "purple", label: "Label Templates" },
            { key: "batch", icon: "box", color: "indigo", label: "Batch Printing" },
            { key: "history", icon: "clock", color: "gray", label: "Print History" },
            { key: "scanner", icon: "zap", color: "blue", label: "Barcode Scanner" },
            { key: "import", icon: "download", color: "green", label: "Import / Export" },
            { key: "settings", icon: "settings", color: "gray", label: "Barcode Settings" }
        ];
    }

    renderBarcode() {
        if (!this.state.bcPage) this.state.bcPage = "dashboard";
        this.stopScanner();
        const c = window.NexoraDashboard.CENTERS.barcode;
        let html = this.pageHeader({
            icon: c.icon, color: c.color,
            title: this.t(c.title),
            subtitle: this.t(c.subtitle),
            crumb: [this.t("Nexora"), this.t(c.title)]
        });
        html += `<div class="nx-bc-subnav" data-bc-subnav>` +
            this.bcPages().map((p) =>
                `<button class="nx-bc-tab ${p.key === this.state.bcPage ? "is-active" : ""}" data-bcpage="${p.key}" title="${this.esc(this.t(p.label))}">
                    <span class="nx-bc-tab-ic nx-ic-${p.color}">${this.ic(p.icon, 14)}</span><span>${this.t(p.label)}</span>
                </button>`).join("") +
            `</div>`;
        html += `<div class="nx-bc-body" data-bc-body></div>`;
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
        this.bindBcSubnav();
        this.renderBcPage();
    }

    bindBcSubnav() {
        const sub = this.root.querySelector("[data-bc-subnav]");
        if (sub) {
            sub.addEventListener("click", (e) => {
                const tab = e.target.closest("[data-bcpage]");
                if (!tab || tab.getAttribute("data-bcpage") === this.state.bcPage) return;
                this.state.bcPage = tab.getAttribute("data-bcpage");
                this.renderBarcode();
            });
        }
        const body = this.root.querySelector("[data-bc-body]");
        if (body) {
            body.addEventListener("click", (e) => {
                const nav = e.target.closest("[data-bcpage]");
                if (!nav || nav.getAttribute("data-bcpage") === this.state.bcPage) return;
                this.state.bcPage = nav.getAttribute("data-bcpage");
                this.renderBarcode();
            });
        }
    }

    renderBcPage() {
        const map = {
            dashboard: "renderBcDashboard", print: "renderBcPrint", browser: "renderBcBrowser",
            nobc: "renderBcNoBarcode", pr: "renderBcPending", pi: "renderBcPending",
            generated: "renderBcGenerated", templates: "renderBcTemplatesPage", batch: "renderBcBatch",
            history: "renderBcHistory", scanner: "renderBcScanner", import: "renderBcImport",
            settings: "renderBcSettingsPage"
        };
        const fn = map[this.state.bcPage] || "renderBcDashboard";
        if (typeof this[fn] === "function") this[fn]();
    }

    bcBody() {
        return this.root && this.root.querySelector("[data-bc-body]");
    }

    renderBcPrint() {
        const body = this.bcBody();
        if (!body) return;
        let html = `<div class="nx-bc-toolbar">
            <div class="nx-bc-tpl-actions">
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-bctpl>${this.ic("grid", 14)} ${this.t("Template Manager")}</button>
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-bcpresets>${this.ic("star", 14)} ${this.t("Presets")}</button>
            </div>
            <span class="nx-bc-toolbar-note">${this.esc(this.t("One-page workspace — generate, print and manage labels without ever leaving Nexora."))}</span>
        </div>`;

        html += `<div class="nx-bc-wrap">
            <div class="nx-bc-left nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-purple">${this.ic("search", 14)}</span><span>${this.t("1 · Item & Value")}</span></div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Find Item")}</label>
                    <div class="nx-bc-pick">
                        <span class="nx-bc-pick-ic">${this.ic("search", 14)}</span>
                        <input class="nx-input nx-bc-item" type="text" autocomplete="off" spellcheck="false" placeholder="${this.esc(this.t("Type item code or name…"))}" />
                        <div class="nx-bc-results" hidden></div>
                    </div>
                    <div class="nx-bc-item-meta" hidden></div>
                </div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Barcode Value")}</label>
                    <input class="nx-input nx-bc-value" type="text" spellcheck="false" value="NEXORA-0001" />
                </div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Quantity / Units")}</label><input class="nx-input nx-bc-qty" type="number" min="1" value="1" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Copies")}</label><input class="nx-input nx-bc-copies" type="number" min="1" value="1" /></div>
                </div>

                <div class="nx-panel-head nx-panel-head-2"><span class="nx-panel-ic nx-ic-purple">${this.ic("zap", 14)}</span><span>${this.t("2 · Generate")}</span></div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Symbology")}</label>
                    <select class="nx-select nx-bc-type">
                        <option>Code128</option><option>Code39</option><option>EAN13</option><option>EAN8</option><option>UPC</option><option>QR Code</option>
                    </select>
                </div>
                <div class="nx-bc-actions">
                    <button class="nx-btn nx-btn-primary nx-bc-gen">${this.ic("zap", 14)} ${this.t("Generate Barcode")}</button>
                    <button class="nx-btn nx-btn-secondary nx-bc-qr">${this.ic("grid", 14)} ${this.t("Generate QR")}</button>
                </div>
                <div class="nx-bc-row nx-bc-row-batch">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Batch Count")}</label><input class="nx-input nx-bc-batch" type="number" min="2" max="50" value="5" /></div>
                    <div class="nx-bc-field"><button class="nx-btn nx-btn-secondary nx-bc-batchbtn">${this.ic("box", 14)} ${this.t("Generate Batch")}</button></div>
                </div>

                <div class="nx-panel-head nx-panel-head-2"><span class="nx-panel-ic nx-ic-purple">${this.ic("print", 14)}</span><span>${this.t("3 · Output")}</span></div>
                <div class="nx-bc-outrow">
                    <button class="nx-btn nx-btn-primary nx-bc-print">${this.ic("print", 14)} ${this.t("Print")}</button>
                    <button class="nx-btn nx-bc-png" disabled>${this.t("PNG")}</button>
                    <button class="nx-btn nx-bc-svg" disabled>${this.t("SVG")}</button>
                    <button class="nx-btn nx-bc-pdf" disabled>${this.t("PDF")}</button>
                </div>
                <button class="nx-btn nx-btn-link nx-bc-savebtn">${this.ic("tag", 14)} ${this.t("Save current as template")}</button>
            </div>

            <div class="nx-bc-center nx-card">
                <div class="nx-card-head">
                    <span class="nx-card-ic nx-ic-purple">${this.ic("barcode", 16)}</span><span class="nx-card-title">${this.t("Live Preview")}</span>
                    <span class="nx-bc-mode-badge" data-bc-mode>${this.t("Single")}</span>
                </div>
                <div class="nx-bc-canvas"><div class="nx-bc-empty">${this.esc(this.t("Pick an item or enter a value, then press Generate."))}</div></div>
                <div class="nx-bc-meta"></div>
            </div>

            <div class="nx-bc-right nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-purple">${this.ic("settings", 14)}</span><span>${this.t("Barcode Options")}</span></div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Size")}</label>
                    <select class="nx-select nx-bc-size">
                        <option value="128">128</option><option value="180">180</option><option value="256" selected>256</option><option value="360">360</option>
                    </select>
                </div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Foreground")}</label>
                        <div class="nx-color"><input type="color" class="nx-color-input nx-bc-fg" value="#000000" /><input class="nx-input nx-bc-fg-hex" value="#000000" spellcheck="false" /></div>
                    </div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Background")}</label>
                        <div class="nx-color"><input type="color" class="nx-color-input nx-bc-bg" value="#ffffff" /><input class="nx-input nx-bc-bg-hex" value="#ffffff" spellcheck="false" /></div>
                    </div>
                </div>
                <label class="nx-check"><input type="checkbox" class="nx-bc-text-toggle" checked /> ${this.t("Show text below")}</label>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Caption Below")}</label>
                    <input class="nx-input nx-bc-text" type="text" spellcheck="false" placeholder="${this.esc(this.t("Optional label text…"))}" />
                </div>

                <div class="nx-panel-head nx-panel-head-2"><span class="nx-panel-ic nx-ic-purple">${this.ic("tag", 14)}</span><span>${this.t("Label Options")}</span></div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Width (mm)")}</label><input class="nx-input nx-bc-lw" type="number" min="10" value="50" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Height (mm)")}</label><input class="nx-input nx-bc-lh" type="number" min="10" value="30" /></div>
                </div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Font Size (px)")}</label><input class="nx-input nx-bc-font" type="number" min="8" max="40" value="12" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Quiet Zone (px)")}</label><input class="nx-input nx-bc-quiet" type="number" min="0" max="20" value="10" /></div>
                </div>

                <div class="nx-panel-head nx-panel-head-2"><span class="nx-panel-ic nx-ic-purple">${this.ic("print", 14)}</span><span>${this.t("Print Settings")}</span></div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Printer")}</label><input class="nx-input nx-bc-printer" type="text" placeholder="${this.esc(this.t("Default printer…"))}" /></div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Label Sheet")}</label>
                    <select class="nx-select nx-bc-sheet">
                        <option>1 × 1 in (25×25 mm)</option><option selected>2 × 1 in (50×25 mm)</option><option>4 × 2 in (100×50 mm)</option><option>A4 Sheet</option>
                    </select>
                </div>
            </div>
        </div>`;

        html += `<div class="nx-bc-tray nx-card">
            <div class="nx-bc-tray-head">
                <button class="nx-tray-tab is-active" data-bctab="history">${this.ic("clock", 14)} ${this.t("Recent Labels")}</button>
                <button class="nx-tray-tab" data-bctab="queue">${this.ic("print", 14)} ${this.t("Print Queue")}<span class="nx-tray-count" data-queue-count>0</span></button>
                <span class="nx-tray-spacer"></span>
                <button class="nx-btn nx-btn-sm nx-btn-secondary nx-bc-clearhist">${this.t("Clear history")}</button>
            </div>
            <div class="nx-bc-tray-body" data-bctray-body></div>
        </div>`;

        body.innerHTML = html;
        this.bindBarcode();
    }

    bindBarcode() {
        const self = this;
        const root = this.root;

        const itemInput = root.querySelector(".nx-bc-item");
        const valueInput = root.querySelector(".nx-bc-value");
        const results = root.querySelector(".nx-bc-results");
        const itemMeta = root.querySelector(".nx-bc-item-meta");
        const typeSel = root.querySelector(".nx-bc-type");
        const sizeSel = root.querySelector(".nx-bc-size");
        const canvas = root.querySelector(".nx-bc-canvas");
        const meta = root.querySelector(".nx-bc-meta");
        const genBtn = root.querySelector(".nx-bc-gen");
        const qrBtn = root.querySelector(".nx-bc-qr");
        const batchBtn = root.querySelector(".nx-bc-batchbtn");
        const printBtn = root.querySelector(".nx-bc-print");
        const pngBtn = root.querySelector(".nx-bc-png");
        const svgBtn = root.querySelector(".nx-bc-svg");
        const pdfBtn = root.querySelector(".nx-bc-pdf");

        const setOutputEnabled = (on) => {
            pngBtn.disabled = !on;
            svgBtn.disabled = !on;
            pdfBtn.disabled = !on;
        };
        setOutputEnabled(false);
        this._bcSvg = null;
        this._bcSvgs = null;
        this._bcItem = null;
        this.applyBcSettingsToStudio();

        const refresh = () => {
            const mode = this._bcSvgs && this._bcSvgs.length ? this._bcSvgs.length : 1;
            const badge = root.querySelector("[data-bc-mode]");
            if (badge) badge.textContent = mode > 1 ? this.t("Batch") + " · " + this.num(mode, 0) : this.t("Single");
            const qty = root.querySelector(".nx-bc-qty");
            if (qty && this._bcItem) qty.value = this._bcItem.qty || 1;
        };

        this._bcDebounce = null;
        this._bcResults = [];
        this._bcSel = 0;
        const showResults = () => {
            if (!this._bcResults.length) { results.hidden = true; return; }
            results.innerHTML = this._bcResults.map((it, i) =>
                `<div class="nx-bc-result ${i === this._bcSel ? "is-selected" : ""}" data-bi="${i}">
                    <b>${this.esc(it.item_name || it.name)}</b><i>${this.esc(it.name)}${this.itemBarcode(it.name) ? " · " + this.esc(this.itemBarcode(it.name)) : ""}</i>
                </div>`).join("");
            results.hidden = false;
        };
        itemInput.addEventListener("input", () => {
            clearTimeout(this._bcDebounce);
            this._bcDebounce = setTimeout(() => {
                const q = itemInput.value.trim();
                if (q.length < 2) { results.hidden = true; return; }
                this.bcSearchItems(q).then((items) => {
                    this._bcResults = items;
                    this._bcSel = 0;
                    showResults();
                });
            }, 200);
        });
        itemInput.addEventListener("keydown", (e) => {
            if (!results.hidden && this._bcResults.length) {
                if (e.key === "ArrowDown") { e.preventDefault(); this._bcSel = (this._bcSel + 1) % this._bcResults.length; showResults(); return; }
                if (e.key === "ArrowUp") { e.preventDefault(); this._bcSel = (this._bcSel - 1 + this._bcResults.length) % this._bcResults.length; showResults(); return; }
                if (e.key === "Enter") { e.preventDefault(); this.bcLoadItem(this._bcResults[this._bcSel] || this._bcResults[0]); results.hidden = true; return; }
                if (e.key === "Escape") { e.preventDefault(); results.hidden = true; return; }
            }
        });
        results.addEventListener("click", (e) => {
            const el = e.target.closest(".nx-bc-result");
            if (!el) return;
            const it = this._bcResults[parseInt(el.getAttribute("data-bi"), 10)];
            if (!it) return;
            this.bcLoadItem(it);
            results.hidden = true;
        });
        itemInput.addEventListener("blur", () => setTimeout(() => { results.hidden = true; }, 200));

        genBtn.addEventListener("click", () => this.generateBarcode());
        qrBtn.addEventListener("click", () => {
            typeSel.value = "QR Code";
            this.generateBarcode();
        });
        batchBtn.addEventListener("click", () => this.generateBatch());
        printBtn.addEventListener("click", () => this.printBarcode());
        pngBtn.addEventListener("click", () => this.downloadBarcode("png"));
        svgBtn.addEventListener("click", () => this.downloadBarcode("svg"));
        pdfBtn.addEventListener("click", () => this.downloadBarcode("pdf"));

        root.querySelector(".nx-bc-savebtn").addEventListener("click", () => this.saveTemplatePrompt());
        root.querySelector("[data-bctpl]").addEventListener("click", () => this.openTemplateDialog());
        root.querySelector("[data-bcpresets]").addEventListener("click", () => this.openTemplateDialog(true));
        root.querySelector(".nx-bc-clearhist").addEventListener("click", () => {
            this.setBcHistory([]);
            this.renderBcTray("history");
        });

        root.querySelectorAll(".nx-tray-tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                root.querySelectorAll(".nx-tray-tab").forEach((t) => t.classList.remove("is-active"));
                tab.classList.add("is-active");
                this.renderBcTray(tab.getAttribute("data-bctab"));
            });
        });

        const liveEls = root.querySelectorAll(".nx-bc-type, .nx-bc-size, .nx-bc-fg, .nx-bc-fg-hex, .nx-bc-bg, .nx-bc-bg-hex, .nx-bc-text, .nx-bc-text-toggle, .nx-bc-font");
        liveEls.forEach((el) => {
            el.addEventListener("input", () => {
                clearTimeout(this._bcLive);
                this._bcLive = setTimeout(() => {
                    if (this._bcSvg) this.generateBarcode();
                }, 260);
            });
            if (el.type === "color") {
                const hex = el.classList.contains("nx-bc-fg")
                    ? root.querySelector(".nx-bc-fg-hex") : root.querySelector(".nx-bc-bg-hex");
                el.addEventListener("input", () => { if (hex) hex.value = el.value; });
            }
        });
        const syncHex = (colorEl, hexEl) => {
            hexEl.addEventListener("input", () => {
                const v = hexEl.value.trim();
                if (/^#[0-9a-fA-F]{6}$/.test(v)) colorEl.value = v;
            });
        };
        syncHex(root.querySelector(".nx-bc-fg"), root.querySelector(".nx-bc-fg-hex"));
        syncHex(root.querySelector(".nx-bc-bg"), root.querySelector(".nx-bc-bg-hex"));

        this.renderBcTray("history");

        const finishMount = () => {
            const tplId = this.state.bcTplToApply;
            if (tplId) {
                this.state.bcTplToApply = null;
                const tpl = this.templateList().find((x) => x.id === tplId);
                if (tpl) this.applyTemplate(tpl);
            }
            if (this.state.bcLoadCode) {
                const code = this.state.bcLoadCode;
                this.state.bcLoadCode = null;
                this.bcSearchItems(code).then((items) => {
                    const hit = items.find((i) => i.name === code) || items[0];
                    if (hit) this.bcLoadItem(hit);
                    else this.bcLoadItem({ name: code, item_name: code });
                });
            }
        };

        if (!this.barcodeEngine()) {
            this.setBtnLoading(genBtn, true, this.t("Loading…"));
            frappe.require("/assets/nexora/js/nexora_barcode_engine.js").then(() => {
                this.setBtnLoading(genBtn, false);
                this.generateBarcode();
                finishMount();
            });
        } else {
            this.generateBarcode();
            finishMount();
        }
    }

    barcodeEngine() {
        return window.NexoraBarcodeEngine || (typeof NexoraBarcodeEngine !== "undefined" ? NexoraBarcodeEngine : null);
    }

    bcOpts() {
        const root = this.root;
        return {
            value: (root.querySelector(".nx-bc-value").value || "NEXORA-0001").trim(),
            type: root.querySelector(".nx-bc-type").value,
            size: parseInt(root.querySelector(".nx-bc-size").value, 10) || 256,
            fg: root.querySelector(".nx-bc-fg").value || "#000000",
            bg: root.querySelector(".nx-bc-bg").value || "#ffffff",
            text: root.querySelector(".nx-bc-text").value.trim(),
            textOn: root.querySelector(".nx-bc-text-toggle").checked,
            font: parseInt(root.querySelector(".nx-bc-font").value, 10) || 12,
            quiet: parseInt(root.querySelector(".nx-bc-quiet").value, 10) || 10,
            lw: parseInt(root.querySelector(".nx-bc-lw").value, 10) || 50,
            lh: parseInt(root.querySelector(".nx-bc-lh").value, 10) || 30,
            copies: parseInt(root.querySelector(".nx-bc-copies").value, 10) || 1,
            qty: parseInt(root.querySelector(".nx-bc-qty").value, 10) || 1,
            printer: root.querySelector(".nx-bc-printer").value.trim(),
            sheet: root.querySelector(".nx-bc-sheet").value
        };
    }

    decorateSvg(svg, opts) {
        if (!svg) return svg;
        try {
            svg.querySelectorAll("[fill='#000']").forEach((el) => el.setAttribute("fill", opts.fg || "#000000"));
            svg.querySelectorAll("[fill='#000000']").forEach((el) => el.setAttribute("fill", opts.fg || "#000000"));
            const textEls = svg.querySelectorAll("text");
            textEls.forEach((el) => {
                el.setAttribute("fill", opts.fg || "#000000");
                el.setAttribute("font-size", opts.font || 12);
            });
            const vb = (svg.getAttribute("viewBox") || "").split(" ").map(Number);
            if (vb.length === 4 && opts.bg && opts.bg !== "#ffffff") {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", vb[0]); rect.setAttribute("y", vb[1]);
                rect.setAttribute("width", vb[2]); rect.setAttribute("height", vb[3]);
                rect.setAttribute("fill", opts.bg);
                svg.insertBefore(rect, svg.firstChild);
            }
            if (opts.textOn && opts.text) {
                const vb2 = (svg.getAttribute("viewBox") || "").split(" ").map(Number);
                if (vb2.length === 4) {
                    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    t.setAttribute("x", vb2[0] + vb2[2] / 2);
                    t.setAttribute("y", vb2[1] + vb2[3] - 2);
                    t.setAttribute("font-size", (opts.font || 12));
                    t.setAttribute("fill", opts.fg || "#000000");
                    t.setAttribute("text-anchor", "middle");
                    t.setAttribute("font-family", "Arial, sans-serif");
                    t.textContent = opts.text;
                    svg.appendChild(t);
                }
            }
        } catch (e) {}
        return svg;
    }

    generateBarcode() {
        const opts = this.bcOpts();
        const canvas = this.root.querySelector(".nx-bc-canvas");
        if (!canvas) return;
        canvas.innerHTML = "";
        this._bcSvgs = null;
        if (!this.barcodeEngine()) {
            canvas.innerHTML = `<div class="nx-bc-empty">${this.esc(this.t("Loading barcode engine…"))}</div>`;
            return;
        }
        try {
            const svg = this.decorateSvg(this.barcodeEngine().generate(opts.type, opts.value, { size: opts.size }), opts);
            svg.setAttribute("class", "nx-bc-svg-out");
            this._bcSvg = svg;
            canvas.appendChild(svg);
            const meta = this.root.querySelector(".nx-bc-meta");
            if (meta) meta.innerHTML = `<span>${this.esc(opts.type)}</span><span>${this.esc(opts.value)}</span><span>${this.t("print-ready")}</span>`;
            const out = this.root.querySelectorAll(".nx-bc-png, .nx-bc-svg, .nx-bc-pdf");
            out.forEach((b) => { b.disabled = false; });
            const mode = this.root.querySelector("[data-bc-mode]");
            if (mode) mode.textContent = this.t("Single");
            this.pushBcHistory({ value: opts.value, type: opts.type, size: opts.size, ts: Date.now(), item: this._bcItem ? this._bcItem.name : null });
            if (this._bcItem && this._bcItem.name && this.bcSettings().autoAssign && !this.itemBarcode(this._bcItem.name)) {
                this.setItemBarcode(this._bcItem.name, opts.value);
            }
        } catch (e) {
            canvas.innerHTML = `<div class="nx-bc-empty nx-bc-empty-err">${this.esc(this.t("Could not generate"))}: ${this.esc(String(e && e.message || e))}</div>`;
        }
    }

    generateBatch() {
        const opts = this.bcOpts();
        const count = Math.max(2, Math.min(50, parseInt((this.root.querySelector(".nx-bc-batch").value || 5), 10) || 5));
        const canvas = this.root.querySelector(".nx-bc-canvas");
        if (!canvas) return;
        if (!this.barcodeEngine()) {
            canvas.innerHTML = `<div class="nx-bc-empty">${this.esc(this.t("Loading barcode engine…"))}</div>`;
            return;
        }
        this._bcSvgs = [];
        const grid = document.createElement("div");
        grid.className = "nx-bc-batch-grid";
        for (let i = 1; i <= count; i++) {
            const val = count === 1 ? opts.value : opts.value + "-" + String(i).padStart(3, "0");
            try {
                const svg = this.decorateSvg(this.barcodeEngine().generate(opts.type, val, { size: opts.size }), opts);
                svg.setAttribute("class", "nx-bc-svg-out");
                this._bcSvgs.push(svg);
                const cell = document.createElement("div");
                cell.className = "nx-bc-batch-cell";
                cell.appendChild(svg);
                cell.appendChild(Object.assign(document.createElement("span"), { textContent: val }));
                grid.appendChild(cell);
            } catch (e) {}
        }
        canvas.innerHTML = "";
        canvas.appendChild(grid);
        this._bcSvg = this._bcSvgs[0];
        const meta = this.root.querySelector(".nx-bc-meta");
        if (meta) meta.innerHTML = `<span>${this.esc(opts.type)}</span><span>${this.num(count, 0)} ${this.t("labels")}</span><span>${this.t("batch")}</span>`;
        this.root.querySelectorAll(".nx-bc-png, .nx-bc-svg, .nx-bc-pdf").forEach((b) => { b.disabled = false; });
        const mode = this.root.querySelector("[data-bc-mode]");
        if (mode) mode.textContent = this.t("Batch") + " · " + this.num(count, 0);
        this.pushBcHistory({ value: opts.value, type: opts.type, size: opts.size, count: count, ts: Date.now(), item: this._bcItem ? this._bcItem.name : null });
    }

    downloadBarcode(kind) {
        if (!this._bcSvg) return;
        const opts = this.bcOpts();
        const value = (opts.value || "nexora").replace(/[^\w-]+/g, "-").toLowerCase();
        const engine = this.barcodeEngine();
        if (!engine) return;
        try {
            if (kind === "png") engine.downloadPNG(this._bcSvg, value + ".png");
            else if (kind === "svg") engine.downloadSVG(this._bcSvg, value + ".svg");
            else if (kind === "pdf") {
                this.printBarcode(true);
            }
        } catch (e) {
            console.warn("barcode download failed", e);
        }
    }

    openPrintWindow(html) {
        const f = document.createElement("iframe");
        f.setAttribute("aria-hidden", "true");
        f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
        document.body.appendChild(f);
        f.onload = () => {
            try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {}
            setTimeout(() => { if (f.parentNode) f.parentNode.removeChild(f); }, 120000);
        };
        const d = f.contentDocument;
        d.open(); d.write(html); d.close();
    }

    printBarcode(pdfMode) {
        const svgs = this._bcSvgs && this._bcSvgs.length ? this._bcSvgs : (this._bcSvg ? [this._bcSvg] : []);
        if (!svgs.length) return;
        const opts = this.bcOpts();
        const lw = Math.max(20, opts.lw || 50);
        const lh = Math.max(15, opts.lh || 30);
        let copies = Math.max(1, opts.copies || 1);
        let inner = "";
        const engine = this.barcodeEngine();
        const toStr = engine && engine.toSVGString ? (s) => engine.toSVGString(s) : (s) => s.outerHTML;
        for (let c = 0; c < copies; c++) {
            svgs.forEach((s) => {
                inner += `<div class="nx-plabel" style="width:${lw}mm;height:${lh}mm">${toStr(s)}</div>`;
            });
        }
        this.openPrintWindow(`<!doctype html><html><head><meta charset="utf-8"/><title>${this.esc(pdfMode ? "Labels (PDF)" : "Print Labels")}</title><style>
            body{margin:0;padding:8mm;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
            .nx-plabel{display:inline-flex;align-items:center;justify-content:center;border:1px dashed #bbb;margin:2mm;page-break-inside:avoid;overflow:hidden}
            .nx-plabel svg{max-width:100%;max-height:100%}
            @media print{.nx-plabel{border:none}body{padding:0}}
        </style></head><body>${inner}</body></html>`);
        this.pushBcQueue({ values: svgs.map((s) => s.querySelector ? (s.textContent.replace(/\s+/g, " ").trim() || "") : "").filter(Boolean), copies: copies, ts: Date.now() });
    }

    // ---- history / queue
    bcHistory() {
        if (!window.localStorage) return [];
        try { return JSON.parse(window.localStorage.getItem("nx-bc-history")) || []; } catch (e) { return []; }
    }
    setBcHistory(h) {
        if (window.localStorage) window.localStorage.setItem("nx-bc-history", JSON.stringify(h || []));
        this.renderBcTray("history");
    }
    pushBcHistory(entry) {
        const h = this.bcHistory();
        h.unshift(entry);
        this.setBcHistory(h.slice(0, 25));
    }
    bcQueue() {
        if (!window.localStorage) return [];
        try { return JSON.parse(window.localStorage.getItem("nx-bc-queue")) || []; } catch (e) { return []; }
    }
    setBcQueue(q) {
        if (window.localStorage) window.localStorage.setItem("nx-bc-queue", JSON.stringify(q || []));
        const el = this.root && this.root.querySelector("[data-queue-count]");
        if (el) el.textContent = (q || []).length;
        this.renderBcTray("queue");
    }
    pushBcQueue(entry) {
        const q = this.bcQueue();
        q.unshift(entry);
        this.setBcQueue(q.slice(0, 20));
    }
    renderBcTray(tab) {
        const body = this.root && this.root.querySelector("[data-bctray-body]");
        if (!body) return;
        if (tab === "history") {
            const h = this.bcHistory();
            if (!h.length) {
                body.innerHTML = `<div class="nx-tray-empty">${this.esc(this.t("No labels generated yet. Your recent labels will appear here."))}</div>`;
                return;
            }
            body.innerHTML = `<div class="nx-bc-tray-list">` + h.map((it, i) => `<div class="nx-bc-tray-item" data-bchist="${i}">
                <span class="nx-tray-ic nx-ic-purple">${this.ic(it.type === "QR Code" ? "grid" : "barcode", 14)}</span>
                <span class="nx-tray-txt"><b>${this.esc(it.value)}</b><i>${this.esc(it.type)}${it.item ? " · " + this.esc(it.item) : ""}${it.count ? " · " + this.num(it.count, 0) + " " + this.t("labels") : ""}</i></span>
                <span class="nx-tray-time">${this.esc(new Date(it.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</span>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-bchistdel="${i}">${this.ic("trash", 12)}</button>
            </div>`).join("") + `</div>`;
            body.querySelectorAll("[data-bchist]").forEach((el) => {
                el.addEventListener("click", (e) => {
                    if (e.target.closest("[data-bchistdel]")) return;
                    const it = h[parseInt(el.getAttribute("data-bchist"), 10)];
                    if (!it) return;
                    const v = this.root.querySelector(".nx-bc-value");
                    const t = this.root.querySelector(".nx-bc-type");
                    const s = this.root.querySelector(".nx-bc-size");
                    if (v) v.value = it.value;
                    if (t) t.value = it.type || "Code128";
                    if (s) s.value = String(it.size || 256);
                    this.generateBarcode();
                });
            });
            body.querySelectorAll("[data-bchistdel]").forEach((el) => {
                el.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const i = parseInt(el.getAttribute("data-bchistdel"), 10);
                    const hh = this.bcHistory();
                    hh.splice(i, 1);
                    this.setBcHistory(hh);
                });
            });
        } else {
            const q = this.bcQueue();
            if (!q.length) {
                body.innerHTML = `<div class="nx-tray-empty">${this.esc(this.t("Nothing queued yet. Printed labels are listed here for re-printing."))}</div>`;
                return;
            }
            body.innerHTML = `<div class="nx-bc-tray-list">` + q.map((it, i) => `<div class="nx-bc-tray-item">
                <span class="nx-tray-ic nx-ic-indigo">${this.ic("print", 14)}</span>
                <span class="nx-tray-txt"><b>${this.esc(it.values.join(", ") || this.t("Batch print"))}</b><i>${this.num(it.copies, 0)} ${this.t("copies")} · ${this.esc(new Date(it.ts).toLocaleString())}</i></span>
                <span class="nx-badge nx-badge-green">${this.t("done")}</span>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-bcqdel="${i}">${this.ic("trash", 12)}</button>
            </div>`).join("") + `</div>`;
            body.querySelectorAll("[data-bcqdel]").forEach((el) => {
                el.addEventListener("click", () => {
                    const qq = this.bcQueue();
                    qq.splice(parseInt(el.getAttribute("data-bcqdel"), 10), 1);
                    this.setBcQueue(qq);
                });
            });
        }
    }

    // ---- templates
    bcTemplates() {
        if (!window.localStorage) return [];
        try { return JSON.parse(window.localStorage.getItem("nx-bc-templates")) || []; } catch (e) { return []; }
    }
    setBcTemplates(list) {
        if (window.localStorage) window.localStorage.setItem("nx-bc-templates", JSON.stringify(list || []));
    }
    defaultTemplates() {
        return [
            { id: "nx-tpl-standard", name: "Standard Label", fav: true, preset: true, opts: { type: "Code128", size: 256, lw: 50, lh: 30, font: 12, textOn: true } },
            { id: "nx-tpl-small", name: "Small Tag", fav: false, preset: true, opts: { type: "Code39", size: 180, lw: 30, lh: 18, font: 10, textOn: true } },
            { id: "nx-tpl-qr-ship", name: "QR Shipping", fav: true, preset: true, opts: { type: "QR Code", size: 360, lw: 50, lh: 50, font: 12, textOn: false } },
            { id: "nx-tpl-price", name: "Price Tag", fav: false, preset: true, opts: { type: "EAN13", size: 256, lw: 50, lh: 25, font: 12, textOn: true } }
        ];
    }
    templateList() {
        const stored = this.bcTemplates();
        const presets = this.defaultTemplates().filter((p) => !stored.some((s) => s.id === p.id));
        return presets.concat(stored);
    }
    saveTemplatePrompt() {
        const self = this;
        const opts = this.bcOpts();
        this.showDialog({
            title: this.t("Save Template"),
            width: 420,
            body: `<div class="nx-form">
                <div class="nx-field"><label class="nx-field-label">${this.t("Template name")} <i class="nx-req">*</i></label>
                <input class="nx-input nx-dlg-name" type="text" value="${this.esc(this._bcItem ? this._bcItem.name + " — Label" : "My Label Template")}" spellcheck="false" /></div>
                <div class="nx-field-hint">${this.esc(this.t("Saves the current barcode, label and print settings for one-click reuse."))}</div>
            </div>`,
            actions: [
                { label: this.t("Cancel"), variant: "secondary", click: (d) => d.close() },
                { label: this.t("Save Template"), variant: "primary", primary: true, click: (d) => {
                    const name = (d.el.querySelector(".nx-dlg-name").value || "").trim();
                    if (!name) { d.el.querySelector(".nx-dlg-name").classList.add("is-invalid"); return; }
                    const list = this.bcTemplates();
                    list.unshift({ id: "nx-tpl-" + Date.now().toString(36), name: name, fav: false, preset: false, opts: opts });
                    this.setBcTemplates(list);
                    d.close();
                    if (frappe.show_alert) frappe.show_alert({ message: this.t("Template saved"), indicator: "green" });
                } }
            ]
        });
    }
    applyTemplate(tpl) {
        const root = this.root;
        const o = tpl.opts || {};
        const set = (sel, val) => { const el = root.querySelector(sel); if (el && val !== undefined && val !== null) el.value = val; };
        set(".nx-bc-type", o.type);
        set(".nx-bc-size", String(o.size));
        set(".nx-bc-lw", o.lw);
        set(".nx-bc-lh", o.lh);
        set(".nx-bc-font", o.font);
        set(".nx-bc-text-toggle", o.textOn ? "on" : "");
        if (o.fg) { set(".nx-bc-fg", o.fg); set(".nx-bc-fg-hex", o.fg); }
        if (o.bg) { set(".nx-bc-bg", o.bg); set(".nx-bc-bg-hex", o.bg); }
        this.generateBarcode();
    }
    openTemplateDialog(onlyPresets) {
        const self = this;
        const list = onlyPresets
            ? this.defaultTemplates()
            : this.templateList();
        const card = (t) => `<div class="nx-tpl-card" data-tpl="${t.id}" data-preset="${t.preset ? 1 : 0}">
            <div class="nx-tpl-top"><span class="nx-tpl-ic nx-ic-purple">${this.ic(t.opts && t.opts.type === "QR Code" ? "grid" : "barcode", 16)}</span>
            <button class="nx-tpl-fav" data-tplfav="${t.id}" title="${this.t("Favorite")}">${this.ic(t.fav ? "star" : "star", 14)}</button></div>
            <div class="nx-tpl-name">${this.esc(t.name)}</div>
            <div class="nx-tpl-meta">${this.esc((t.opts && t.opts.type) || "Code128")}${t.preset ? " · " + this.t("Preset") : ""}</div>
            <div class="nx-tpl-actions">
                <button class="nx-btn nx-btn-sm nx-btn-primary" data-tplapply="${t.id}">${this.t("Apply")}</button>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-tpldup="${t.id}">${this.t("Duplicate")}</button>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-tplexport="${t.id}">${this.t("Export")}</button>
                ${t.preset ? "" : `<button class="nx-btn nx-btn-sm nx-btn-danger" data-tpldel="${t.id}">${this.t("Delete")}</button>`}
            </div>
        </div>`;
        this.showDialog({
            title: onlyPresets ? this.t("Template Presets") : this.t("Template Manager"),
            width: 760,
            body: `<div class="nx-tpl-toolbar">
                <div class="nx-tpl-toolbar-left">
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-tplsave>${this.ic("tag", 13)} ${this.t("Save current")}</button>
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-tplimport>${this.ic("download", 13)} ${this.t("Import")}</button>
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-tplexportall>${this.ic("out", 13)} ${this.t("Export all")}</button>
                </div>
                <span class="nx-tpl-count">${this.num(list.length, 0)} ${this.t("templates")}</span>
            </div>
            <div class="nx-tpl-grid">${list.map(card).join("") || `<div class="nx-tray-empty">${this.t("No templates yet")}</div>`}</div>
            <input type="file" accept=".json,application/json" class="nx-tpl-file" hidden />`,
            actions: [
                { label: this.t("Close"), variant: "secondary", click: (d) => d.close() }
            ],
            onCreate: (d) => {
                d.el.addEventListener("click", (e) => {
                    const apply = e.target.closest("[data-tplapply]");
                    if (apply) { const t = self.templateList().find((x) => x.id === apply.getAttribute("data-tplapply")); if (t) self.applyTemplate(t); d.close(); return; }
                    const dup = e.target.closest("[data-tpldup]");
                    if (dup) {
                        const t = self.templateList().find((x) => x.id === dup.getAttribute("data-tpldup"));
                        if (t) { const list2 = self.bcTemplates(); list2.unshift(Object.assign({}, t, { id: "nx-tpl-" + Date.now().toString(36), name: t.name + " (copy)", preset: false })); self.setBcTemplates(list2); self.openTemplateDialog(); d.close(); }
                        return;
                    }
                    const del = e.target.closest("[data-tpldel]");
                    if (del) {
                        const id = del.getAttribute("data-tpldel");
                        const list2 = self.bcTemplates().filter((x) => x.id !== id);
                        self.setBcTemplates(list2);
                        self.openTemplateDialog();
                        d.close();
                        return;
                    }
                    const fav = e.target.closest("[data-tplfav]");
                    if (fav) {
                        const id = fav.getAttribute("data-tplfav");
                        const list2 = self.bcTemplates().map((x) => x.id === id ? Object.assign({}, x, { fav: !x.fav }) : x);
                        self.setBcTemplates(list2);
                        return;
                    }
                    const ex = e.target.closest("[data-tplexport]");
                    if (ex) {
                        const t = self.templateList().find((x) => x.id === ex.getAttribute("data-tplexport"));
                        if (t) self.exportTemplates([t]);
                        return;
                    }
                    const save = e.target.closest("[data-tplsave]");
                    if (save) { d.close(); self.saveTemplatePrompt(); return; }
                    const all = e.target.closest("[data-tplexportall]");
                    if (all) { self.exportTemplates(self.bcTemplates()); return; }
                    const imp = e.target.closest("[data-tplimport]");
                    if (imp) { d.el.querySelector(".nx-tpl-file").click(); return; }
                });
                const file = d.el.querySelector(".nx-tpl-file");
                file.addEventListener("change", () => self.importTemplates(file));
            }
        });
    }
    exportTemplates(list) {
        const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nexora-barcode-templates.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    importTemplates(file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                const arr = Array.isArray(data) ? data : [data];
                const list = this.bcTemplates();
                arr.forEach((t) => {
                    if (t && t.name && t.opts) list.unshift({ id: t.id || "nx-tpl-" + Date.now().toString(36), name: t.name, fav: !!t.fav, preset: false, opts: t.opts });
                });
                this.setBcTemplates(list);
                if (frappe.show_alert) frappe.show_alert({ message: this.t("Templates imported"), indicator: "green" });
            } catch (e) {
                if (frappe.show_alert) frappe.show_alert({ message: this.t("Import failed"), indicator: "red" });
            }
        };
        reader.readAsText(file.files[0]);
        file.value = "";
    }

    renderSettings() {
        let html = this.pageHeader({
            icon: "settings", color: "gray",
            title: this.t("Settings"),
            subtitle: this.t("Nexora & ERPNext preferences"),
            crumb: [this.t("Nexora"), this.t("Settings")]
        });
        html += `<div class="nx-settings-grid">`;
        window.NexoraDashboard.SETTINGS_ITEMS.forEach((s) => {
            html += `<div class="nx-card nx-setting-card" data-sroute="${s.key}">
                <div class="nx-setting-ic nx-ic-${s.color}">${this.ic(s.icon, 20)}</div>
                <div class="nx-setting-title">${this.t(s.title)}</div>
                <div class="nx-setting-desc">${this.t(s.desc)}</div>
                <div class="nx-setting-action"><button class="nx-btn nx-btn-sm nx-btn-link">${this.t("Open")} ${this.ic("arrow-right", 12)}</button></div>
            </div>`;
        });
        html += `</div>`;
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
    }

    runClick(key) {
        const self = this;
        const report = (name, title, icon, color) => this.openReportViewer(name, { title, icon, color, view: this.state.view });
        const embed = (src, title, icon, color) => this.openEmbed({ src, title, icon, color });
        const map = {
            "sales-today": () => report("Sales Register", this.t("Sales Register"), "sales", "green"),
            "sales-yesterday": () => report("Sales Register", this.t("Sales Register"), "sales", "green"),
            "profit-today": () => report("Gross Profit", this.t("Gross Profit"), "profit", "purple"),
            "profit-yesterday": () => report("Gross Profit", this.t("Gross Profit"), "profit", "purple"),
            "cash": () => report("Cash Flow", this.t("Cash Flow"), "wallet", "blue"),
            "cash-balance": () => report("Cash Flow", this.t("Cash Flow"), "wallet", "blue"),
            "receivables": () => report("Accounts Receivable", this.t("Accounts Receivable"), "incoming", "orange"),
            "payables": () => report("Accounts Payable", this.t("Accounts Payable"), "outgoing", "red"),
            "net-position": () => report("Cash Flow", this.t("Cash Flow"), "wallet", "purple"),
            "weekly-trend": () => report("Sales Register", this.t("Sales Register"), "chart", "blue"),
            "monthly-trend": () => report("Sales Register", this.t("Sales Register"), "chart", "purple"),
            "sales-performance": () => report("Sales Register", this.t("Sales Register"), "sales", "green"),
            "purchase-performance": () => report("Purchase Register", this.t("Purchase Register"), "cart", "orange"),
            "requests": () => embed("/app/purchase-request", this.t("Purchase Requests"), "cart", "orange"),
            "pending-pos": () => embed("/app/purchase-order", this.t("Purchase Orders"), "cart", "orange"),
            "sales-orders": () => embed("/app/sales-order", this.t("Sales Orders"), "file-text", "purple"),
            "low-stock": () => report("Stock Balance", this.t("Stock Balance"), "box", "orange"),
            "out-of-stock": () => report("Stock Balance", this.t("Stock Balance"), "box", "red"),
            "inventory-value": () => report("Stock Balance", this.t("Stock Balance"), "box", "teal"),
            "top-items": () => report("Item-wise Sales Register", this.t("Item-wise Sales Register"), "box", "teal"),
            "top-customers": () => report("Customer Ledger Summary", this.t("Customer Ledger Summary"), "users", "orange"),
            "top-suppliers": () => report("Supplier Ledger Summary", this.t("Supplier Ledger Summary"), "truck", "blue"),
            "warehouse": () => report("Warehouse Wise Stock Balance", this.t("Warehouse Wise Stock Balance"), "grid", "blue"),
            "exchange": () => embed("/app/currency-exchange", this.t("Exchange Center"), "globe", "teal"),
            "pricing": () => embed("/app/item-price", this.t("Pricing Center"), "tag", "green"),
            "notifications": () => report("Notification Log", this.t("Notification Log"), "bell", "orange")
        };
        const item = map[key];
        if (!item) return;
        item();
    }

    // ---------------------------------------------------------------- search
    runSearch() {
        const q = (this.state.searchValue || "").trim();
        if (q.length < 2) {
            this.state.searchItems = [];
            this.closeSearch();
            return;
        }
        const self = this;
        frappe.call({
            method: "nexora.nexora_dashboard.api.dashboard.global_search",
            args: { q, limit: 8 },
            callback: (r) => {
                const data = (r && r.message) || { groups: [] };
                const items = [];
                (data.groups || []).forEach((g) => {
                    (g.items || []).forEach((it) => {
                        items.push({ group: g, item: it });
                    });
                });
                self.state.searchItems = items;
                self.state.searchSel = 0;
                self.openSearch();
            },
            error: () => {
                self.state.searchItems = [];
                self.openSearch();
            }
        });
    }

    openSearch() {
        const panel = this.root.querySelector(".nx-search-panel");
        if (!panel) return;
        const q = (this.state.searchValue || "").trim();
        let html = "";
        if (q.length < 2) {
            const recent = this.searchHistory();
            html = `<div class="nx-search-quick">
                <div class="nx-search-group-label">${this.t("Quick Links")}</div>
                <div class="nx-search-quick-grid">` +
                this.quickEntries().map((e) =>
                    `<button class="nx-quick-item" data-quick="${e.action}" data-quick-label="${this.esc(e.label)}">
                        <span class="nx-search-item-ic nx-ic-${e.color}">${this.ic(e.icon, 14)}</span>
                        <span>${this.esc(e.label)}</span>
                    </button>`).join("") +
                `</div>` +
                (recent.length ? `<div class="nx-search-recent-head">
                    <span class="nx-search-group-label">${this.t("Recent")}</span>
                    <button class="nx-btn nx-btn-link nx-btn-xs" data-searchclear>${this.t("Clear")}</button>
                </div>
                <div class="nx-search-recent">` + recent.map((r, i) =>
                    `<div class="nx-search-item" data-recent="${i}">
                        <span class="nx-search-item-ic nx-ic-${r.color || "gray"}">${this.ic(r.icon || "clock", 13)}</span>
                        <span class="nx-search-item-txt"><b>${this.esc(r.title)}</b><i>${this.esc(r.subtitle || "")}</i></span>
                    </div>`).join("") + `</div>` : "") +
                `<div class="nx-search-foot">
                    <span><kbd>Esc</kbd> ${this.t("to close")}</span>
                    <span>${this.t("Search your ERP data")}</span>
                </div>
            </div>`;
        } else if (!this.state.searchItems.length) {
            html = `<div class="nx-search-empty">${this.t("No results for")} “${this.esc(q)}”</div>`;
        } else {
            let lastGroup = null;
            this.state.searchItems.forEach((s, i) => {
                if (s.group.label !== lastGroup) {
                    html += `<div class="nx-search-group-label"><span class="nx-snav-ic nx-ic-${s.group.color}" style="width:18px;height:18px;border-radius:5px">${this.ic(s.group.icon, 11)}</span>${this.esc(s.group.label)}</div>`;
                    lastGroup = s.group.label;
                }
                const it = s.item;
                html += `<div class="nx-search-item ${i === this.state.searchSel ? "is-selected" : ""}" data-si="${i}">
                    <span class="nx-search-item-ic nx-ic-${s.group.color}">${this.ic(s.group.icon, 13)}</span>
                    <span class="nx-search-item-txt"><b>${this.esc(it.title)}</b><i>${this.esc(it.subtitle || "")}</i></span>
                </div>`;
            });
            html += `<div class="nx-search-foot">
                <span><kbd>↑</kbd> <kbd>↓</kbd> ${this.t("to navigate")}</span>
                <span><kbd>Enter</kbd> ${this.t("to open")}</span>
                <span><kbd>Esc</kbd> ${this.t("to close")}</span>
            </div>`;
        }
        panel.innerHTML = html;
        panel.hidden = false;
        this.state.searchOpen = true;
    }

    closeSearch() {
        this.state.searchOpen = false;
        const panel = this.root.querySelector(".nx-search-panel");
        if (panel) panel.hidden = true;
    }

    moveSearch(dir) {
        if (!this.state.searchItems.length) return;
        this.state.searchSel = (this.state.searchSel + dir + this.state.searchItems.length) % this.state.searchItems.length;
        const panel = this.root.querySelector(".nx-search-panel");
        if (!panel) return;
        panel.querySelectorAll(".nx-search-item").forEach((el, i) => {
            el.classList.toggle("is-selected", i === this.state.searchSel);
        });
        const sel = panel.querySelector(`[data-si="${this.state.searchSel}"]`);
        if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
    }

    openSelected() {
        const s = this.state.searchItems[this.state.searchSel];
        if (!s) return;
        this.closeSearch();
        this.root.querySelector(".nx-search").blur();
        const route = s.item.route || "";
        const src = route.replace(/^\/?app\//, "/app/");
        this.pushSearchHistory({ title: s.item.title || route, subtitle: s.item.subtitle || (s.group && s.group.label) || "", route: src, icon: s.group.icon || "file", color: s.group.color || "blue" });
        this.openEmbed({ src, title: s.item.title || route, icon: s.group.icon || "file", color: s.group.color || "blue" });
    }

    searchHistory() {
        if (!window.localStorage) return [];
        try { return JSON.parse(window.localStorage.getItem("nx-search-history")) || []; } catch (e) { return []; }
    }
    setSearchHistory(h) {
        if (window.localStorage) window.localStorage.setItem("nx-search-history", JSON.stringify(h || []));
    }
    pushSearchHistory(entry) {
        if (!entry || !entry.route) return;
        const h = this.searchHistory().filter((x) => !(x.route === entry.route && x.title === entry.title));
        h.unshift(entry);
        this.setSearchHistory(h.slice(0, 8));
    }
    quickEntries() {
        return [
            { action: "nav:dashboard", icon: "chart", color: "blue", label: this.t("Executive Dashboard") },
            { action: "nav:barcode", icon: "barcode", color: "purple", label: this.t("Barcode Studio") },
            { action: "nav:pricing", icon: "tag", color: "green", label: this.t("Pricing Center") },
            { action: "nav:shipments", icon: "truck", color: "orange", label: this.t("Shipment Center") },
            { action: "nav:exchange", icon: "globe", color: "teal", label: this.t("Exchange Center") },
            { action: "nav:reports", icon: "file", color: "indigo", label: this.t("Reports Center") },
            { action: "nav:settings", icon: "settings", color: "gray", label: this.t("Settings") },
            { action: "desk", icon: "grid", color: "blue", label: this.t("Open ERPNext Desk") }
        ];
    }
    runQuickAction(action) {
        if (action === "desk") { if (frappe && frappe.set_route) frappe.set_route("home"); return; }
        if (action && action.indexOf("nav:") === 0) this.goNav(action.slice(4));
    }

    // ---------------------------------------------------------------- notifications / user
    updateNotifications() {
        const nt = (this.state.data && this.state.data.notifications) || { unread: 0, recent: [] };
        const badge = this.root.querySelector(".nx-notif-badge");
        if (badge) {
            badge.hidden = !nt.unread;
            badge.textContent = nt.unread || "";
        }
        const pop = this.root.querySelector(".nx-notif-pop");
        if (!pop) return;
        let body = "";
        if (!(nt.recent || []).length) {
            body = `<div class="nx-empty">${this.t("No notifications")}</div>`;
        } else {
            body = `<div class="nx-notify-item" data-click="notifications">
                <span class="nx-notify-dot ${nt.recent[0].read ? "" : "is-unread"}"></span>
                <span class="nx-notify-body"><b>${this.esc(nt.recent[0].subject)}</b><i>${this.esc(String(nt.recent[0].creation || "").slice(0, 16).replace("T", " "))}</i></span>
            </div>`;
            (nt.recent || []).slice(1, 6).forEach((n) => {
                body += `<div class="nx-notify-item ${n.read ? "is-read" : ""}" data-click="notifications">
                    <span class="nx-notify-dot ${n.read ? "" : "is-unread"}"></span>
                    <span class="nx-notify-body"><b>${this.esc(n.subject)}</b><i>${this.esc(String(n.creation || "").slice(0, 16).replace("T", " "))}</i></span>
                </div>`;
            });
        }
        pop.innerHTML = `<div class="nx-pop-head"><span>${this.t("Notifications")}</span>
                <span class="nx-badge ${nt.unread ? "nx-badge-red" : "nx-badge-muted"}">${nt.unread ? this.num(nt.unread, 0) : this.t("Up to date")}</span></div>
            <div class="nx-pop-body">${body}</div>
            <div style="border-top:1px solid var(--nx-border)">
                <button class="nx-pop-item" data-click="notifications">${this.ic("bell", 15)}<span>${this.t("View all notifications")}</span></button>
            </div>`;
    }

    toggleNotifications(forceClose) {
        if (forceClose) {
            this.state.notifOpen = false;
            const pop = this.root.querySelector(".nx-notif-pop");
            if (pop) pop.hidden = true;
            return;
        }
        this.closeSearch();
        if (this.state.userOpen) this.toggleUser(true);
        this.state.notifOpen = !this.state.notifOpen;
        const pop = this.root.querySelector(".nx-notif-pop");
        if (!pop) return;
        if (this.state.notifOpen) this.updateNotifications();
        pop.hidden = !this.state.notifOpen;
    }

    toggleUser(forceClose) {
        if (forceClose) {
            this.state.userOpen = false;
            const pop = this.root.querySelector(".nx-user-pop");
            if (pop) pop.hidden = true;
            return;
        }
        this.closeSearch();
        if (this.state.notifOpen) this.toggleNotifications(true);
        this.state.userOpen = !this.state.userOpen;
        const pop = this.root.querySelector(".nx-user-pop");
        if (!pop) return;
        pop.hidden = !this.state.userOpen;
    }

    // ---------------------------------------------------------------- theme / lang
    applyTheme() {
        const theme = this.state.theme === "dark" ? "dark" : "light";
        if (this.root) this.root.setAttribute("data-nx-theme", theme);
        if (document.documentElement) document.documentElement.setAttribute("data-nx-theme", theme);
        if (document.body) {
            document.body.setAttribute("data-nx-theme", theme);
            document.body.style.background = "";
            document.body.style.color = "";
        }
    }

    setDatePill() {
        const el = this.root && this.root.querySelector("[data-nx-date]");
        if (!el) return;
        try {
            const loc = this.state.lang === "ar" ? "ar-EG" : "en-US";
            el.textContent = new Intl.DateTimeFormat(loc, {
                weekday: "short", month: "short", day: "numeric", year: "numeric"
            }).format(new Date());
        } catch (e) {
            el.textContent = new Date().toDateString();
        }
    }

    toggleTheme() {
        this.state.theme = this.state.theme === "dark" ? "light" : "dark";
        if (window.localStorage) window.localStorage.setItem("nx-theme", this.state.theme);
        this.applyTheme();
    }

    applyLang() {
        const lang = "en";
        if (this.root) this.root.setAttribute("dir", "ltr");
        if (this.root) this.root.setAttribute("lang", "en");
        if (this.root) {
            this.root.querySelectorAll("[data-i18n]").forEach((el) => {
                el.textContent = this.t(el.getAttribute("data-i18n"));
            });
            const brand = this.root.querySelector(".nx-brand-name");
            if (brand) brand.textContent = this.t("Nexora");
            const tag = this.root.querySelector(".nx-brand-tag");
            if (tag) tag.textContent = this.t("Suite");
            const collapse = this.root.querySelector(".nx-collapse-text");
            if (collapse) collapse.textContent = this.t("Collapse");
            const search = this.root.querySelector(".nx-search");
            if (search) search.placeholder = this.t("Search items, customers, invoices, reports…");
            const langBtn = this.root.querySelector('[data-action="lang"]');
            if (langBtn) langBtn.textContent = lang === "ar" ? "EN" : "ع";
        }
        if (this.state.data) {
            if (this.state.embed) return;
            if (this.state.view === "reports") this.renderHub();
            else if (this.state.view === "settings") this.renderSettings();
            else if (this.state.view === "barcode") this.renderBarcode();
            else if (this.state.view === "pricing" || this.state.view === "shipments" || this.state.view === "exchange") this.renderCenter(this.state.view);
            else this.render(this.state.data);
        }
    }

    toggleLang() {
        this.state.lang = "en";
        if (window.localStorage) window.localStorage.setItem("nx-lang", "en");
        this.applyLang();
    }

    // ---------------------------------------------------------------- data
    loadCompanies() {
        const self = this;
        return frappe.call({
            method: "nexora.nexora_dashboard.api.dashboard.get_companies",
            callback: (r) => {
                self.state.companies = (r && r.message) || [];
                const sel = self.root.querySelector("[data-company]");
                if (!sel) return;
                sel.innerHTML = "";
                self.state.companies.forEach((c) => {
                    const opt = document.createElement("option");
                    opt.value = c.name;
                    opt.textContent = c.name + (c.default_currency ? " (" + c.default_currency + ")" : "");
                    sel.appendChild(opt);
                });
                if (!self.state.company && self.state.companies.length) {
                    self.state.company = self.state.companies[0].name;
                }
                if (sel && self.state.company) sel.value = self.state.company;
            }
        });
    }

    load(silent) {
        if (this.state.loading) return;
        this.state.loading = true;
        if (!silent) this.showLoading();
        const self = this;
        frappe.call({
            method: "nexora.nexora_dashboard.api.dashboard.get_executive_dashboard",
            args: { company: this.state.company || undefined },
            callback: (r) => {
                self.state.loading = false;
                if (!r || r.exc || !r.message) {
                    if (!silent) self.showError(self.t("Refresh failed"));
                    return;
                }
                self.state.data = r.message;
                self.state.currency = r.message.company_currency || self.state.currency;
                const pill = self.root.querySelector(".nx-currency-pill");
                if (pill) pill.textContent = self.state.currency;
                self.updateNotifications();
                self.setSyncTime();
                // P3 navigation stability: background/silent refreshes must NEVER
                // re-render the current page or yank the user back to the Dashboard.
                if (!silent && !self.state.embed && self.state.view === "dashboard" && !self.state.dashMode) {
                    self.render(r.message);
                }
            },
            error: () => {
                self.state.loading = false;
                if (!silent) self.showError(self.t("Refresh failed"));
            }
        });
    }

    startAutoRefresh() {
        const self = this;
        if (this.state.timer) clearInterval(this.state.timer);
        this.state.timer = setInterval(() => {
            if (document.hidden) return;
            if (this.root && this.root.isConnected && this.root.getBoundingClientRect().width > 0) this.load(true);
            else clearInterval(this.state.timer);
        }, 60000);
    }

    showLoading() {
        let html = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-bottom:16px">`;
        for (let i = 0; i < 4; i++) {
            html += `<div class="nx-skel-kpi"><div class="nx-skeleton"></div><div class="nx-skel-lines"><div class="nx-skeleton"></div><div class="nx-skeleton"></div></div></div>`;
        }
        html += `</div>`;
        for (let i = 0; i < 3; i++) {
            html += `<div class="nx-skel-card"><div class="nx-skeleton"></div><div class="nx-skeleton nx-skel-block"></div></div>`;
        }
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
    }

    showError(msg) {
        this.main.innerHTML = `<div class="nx-error">${this.ic("alert")}<div>${msg}</div><button class="nx-btn nx-btn-sm" data-action="refresh">${this.t("Refresh")}</button></div>`;
    }

    // ---------------------------------------------------------------- helpers
    setBtnLoading(btn, on, label) {
        if (!btn) return;
        if (on) {
            if (!btn.dataset.nxLabel) btn.dataset.nxLabel = btn.innerHTML;
            btn.classList.add("is-loading");
            btn.disabled = true;
            if (label) btn.innerHTML = `<span class="nx-btn-spin"></span>${this.esc(label)}`;
        } else {
            btn.classList.remove("is-loading");
            btn.disabled = false;
            if (btn.dataset.nxLabel) { btn.innerHTML = btn.dataset.nxLabel; delete btn.dataset.nxLabel; }
        }
    }

    esc(s) {
        if (s === null || s === undefined) return "";
        return String(s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    ic(name, size) {
        size = size || 17;
        const paths = {
            "sales": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
            "profit": '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
            "wallet": '<path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H6a2 2 0 0 0-2 2v2h12V3z"/><circle cx="16" cy="14" r="1"/>',
            "incoming": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
            "outgoing": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
            "net": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
            "box": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
            "alert": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
            "out": '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
            "zap": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
            "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
            "star": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
            "heart": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
            "pin": '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/>',
            "bank": '<polygon points="3 21 21 21 21 14 3 14 3 21"/><line x1="5" y1="18" x2="7" y2="18"/><line x1="10" y1="18" x2="12" y2="18"/><line x1="15" y1="18" x2="17" y2="18"/><polygon points="2 12 22 12 12 4 2 12"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/>',
            "trending-up": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
            "pie-chart": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
            "alert-triangle": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
            "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
            "percent": '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
            "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
            "truck": '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
            "cart": '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
            "refresh": '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
            "moon": '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
            "sun": '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
            "bell": '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
            "globe": '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
            "chart": '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
            "file": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
            "grid": '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
            "arrow-up": '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
            "arrow-down": '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
            "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
            "search": '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
            "menu": '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
            "chevron-left": '<polyline points="15 18 9 12 15 6"/>',
            "chevron-right": '<polyline points="9 18 15 12 9 6"/>',
            "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
            "tag": '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
            "barcode": '<path d="M3 6v12"/><path d="M7 6v9"/><path d="M11 6v12"/><path d="M15 6v7"/><path d="M19 6v12"/>',
            "x": '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
            "plus": '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
            "folder": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
            "trash": '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
            "print": '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
            "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
            "building": '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="10" x2="9" y2="6"/><line x1="15" y1="10" x2="15" y2="6"/><line x1="9" y1="14" x2="9" y2="12"/><line x1="15" y1="14" x2="15" y2="12"/>',
            "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
            "sliders": '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
            "save": '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
            "eye-off": '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
            "maximize": '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
            "rotate": '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
            "receipt": '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="16" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="16" y1="16" x2="8" y2="16"/>',
            "move": '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
            "share": '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
            "copy": '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
            "check": '<polyline points="20 6 9 17 4 12"/>',
            "chevron-down": '<polyline points="6 9 12 15 18 9"/>',
            "filter": '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
            "layers": '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
        };
        return `<svg class="nx-ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`;
    }

    money(v) {
        const loc = this.state.lang === "ar" ? "ar-EG-u-nu-latn" : "en-US";
        try {
            return new Intl.NumberFormat(loc, {
                style: "currency", currency: this.state.currency || "SDG",
                currencyDisplay: "code", maximumFractionDigits: 2, minimumFractionDigits: 0
            }).format(v || 0);
        } catch (e) {
            return String(Math.round((v || 0) * 100) / 100);
        }
    }

    num(v, maxFrac) {
        const loc = this.state.lang === "ar" ? "ar-EG-u-nu-latn" : "en-US";
        maxFrac = maxFrac === undefined ? 2 : maxFrac;
        try {
            return new Intl.NumberFormat(loc, { maximumFractionDigits: maxFrac }).format(v || 0);
        } catch (e) {
            return String(v || 0);
        }
    }

    deltaBadge(pct, good) {
        if (pct === null || pct === undefined || isNaN(pct)) return `<span class="nx-badge nx-badge-muted">—</span>`;
        const up = pct >= 0;
        const goodUp = good === undefined ? true : good;
        const pos = goodUp ? up : !up;
        const cls = pct === 0 ? "nx-badge-muted" : (pos ? "nx-badge-green" : "nx-badge-red");
        const arrow = this.ic(up ? "arrow-up" : "arrow-down", 12);
        return `<span class="nx-badge ${cls}">${arrow} ${this.num(Math.abs(pct), 1)}%</span>`;
    }

    // ---------------------------------------------------------------- rendering
    render(d) {
        if (!d) {
            this.showLoading();
            return;
        }
        const liveTime = this.root.querySelector(".nx-live-time");
        if (liveTime) liveTime.textContent = `${this.t("As of")} ${d.as_at} ${d.as_at_time}`;

        const ctx = this.dashContext(d);
        let html = this.pageHeader({
            icon: "chart", color: "blue",
            title: this.t("Executive Intelligence Center"),
            subtitle: this.t("Business Intelligence · Live ERP Analytics"),
            crumb: [this.t("Nexora"), this.t("Executive Intelligence Center")]
        });
        html += this.renderDashboardToolbar();
        html += this.renderDashboardBody(ctx);
        this.main.innerHTML = `<div class="nx-view">${html}</div>`;
        this.bindDashControls();
    }

    // ---------------------------------------------------------------- dashboard widget system (P4/P5)
    dashContext(d) {
        const s = d.sales || {};
        const c = d.cash || {};
        const p = d.purchasing || {};
        const inv = d.inventory || {};
        const fx = d.exchange_rates || {};
        const pr = d.pricing_alerts || {};
        const nt = d.notifications || {};
        const trend = s.trend || [];
        const last7 = trend.slice(-7);
        const y = s.yesterday || { amount: 0, count: 0, profit: 0 };
        const kpis = d.kpis || [];
        const kpiMap = {};
        kpis.forEach((k) => { kpiMap[k.key] = k; });
        let yDate = "";
        try { yDate = new Date(Date.now() - 86400000).toLocaleDateString(undefined, { month: "short", day: "numeric" }); } catch (e) {}
        return { d, s, c, p, inv, fx, pr, nt, trend, last7, y, yDate, avgInvoice: y.count ? y.amount / y.count : 0, kpis, kpiMap };
    }

    dashWidgetDefs() {
        return [
            { key: "yesterday-sales", kind: "kpi", kpi2: true, icon: "sales", color: "green", title: "Yesterday Sales", cols: 3 },
            { key: "yesterday-profit", kind: "kpi", kpi2: true, icon: "profit", color: "purple", title: "Yesterday Profit", cols: 3 },
            { key: "receivables", kind: "kpi", kpi2: true, icon: "incoming", color: "orange", title: "Open Receivables", cols: 3 },
            { key: "inventory-value", kind: "kpi", kpi2: true, icon: "box", color: "teal", title: "Inventory Value", cols: 3 },
            { key: "cash-balance", kind: "kpi", kpi2: true, icon: "wallet", color: "blue", title: "Cash Balance", cols: 3 },
            { key: "po-pending", kind: "kpi", kpi2: true, icon: "cart", color: "indigo", title: "Purchase Orders Pending", cols: 3 },
            { key: "so-pending", kind: "kpi", kpi2: true, icon: "file-text", color: "purple", title: "Sales Orders Pending", cols: 3 },
            { key: "low-stock", kind: "kpi", kpi2: true, icon: "alert", color: "red", title: "Low Stock Items", cols: 3 },
            { key: "sales-trend", kind: "chart", icon: "chart", color: "blue", title: "Sales & Profit Trend", cols: 6 },
            { key: "profit-trend", kind: "chart", icon: "profit", color: "purple", title: "Profit Trend", cols: 6 },
            { key: "inventory-analysis", kind: "chart", icon: "box", color: "teal", title: "Inventory Analysis", cols: 6 },
            { key: "top-items", kind: "list", icon: "box", color: "teal", title: "Top Selling Items", cols: 4 },
            { key: "top-customers", kind: "list", icon: "users", color: "orange", title: "Top Customers", cols: 4 },
            { key: "top-suppliers", kind: "list", icon: "truck", color: "blue", title: "Top Suppliers", cols: 4 },
            { key: "low-stock-alerts", kind: "list", icon: "alert", color: "orange", title: "Low Stock Alerts", cols: 4 },
            { key: "pricing-alerts", kind: "list", icon: "tag", color: "red", title: "Pricing Alerts", cols: 4 },
            { key: "fx-alerts", kind: "list", icon: "globe", color: "teal", title: "Exchange Rate Alerts", cols: 4 },
            { key: "notifications", kind: "list", icon: "bell", color: "orange", title: "Notification Center", cols: 4 }
        ];
    }

    dashPresets() {
        const defs = this.dashWidgetDefs();
        const all = defs.filter((w) => w.key !== "notifications").map((w) => ({ key: w.key, cols: w.cols }));
        const pick = (keys) => defs.filter((w) => keys.indexOf(w.key) !== -1).map((w) => ({ key: w.key, cols: w.cols }));
        return {
            executive: { name: "Executive", widgets: all },
            finance: { name: "Finance", widgets: pick(["yesterday-sales", "yesterday-profit", "cash-balance", "receivables", "po-pending", "so-pending", "sales-trend", "profit-trend"]) },
            inventory: { name: "Inventory", widgets: pick(["inventory-value", "inventory-analysis", "low-stock-alerts", "low-stock", "top-items", "pricing-alerts", "receivables", "cash-balance"]) },
            sales: { name: "Sales", widgets: pick(["yesterday-sales", "yesterday-profit", "so-pending", "sales-trend", "profit-trend", "top-items", "top-customers"]) },
            purchasing: { name: "Purchasing", widgets: pick(["po-pending", "receivables", "top-suppliers", "pricing-alerts", "low-stock-alerts", "inventory-value"]) }
        };
    }

    dashLayoutsKey() {
        return "nx-dash-layouts-" + (this.state.company || "default");
    }

    dashLayouts() {
        if (!window.localStorage) return { active: "executive", list: [] };
        try {
            const o = JSON.parse(window.localStorage.getItem(this.dashLayoutsKey()) || "null");
            if (o && typeof o === "object" && o.active && Array.isArray(o.list)) return o;
        } catch (e) {}
        return { active: "executive", list: [] };
    }

    setDashLayouts(o) {
        if (window.localStorage) window.localStorage.setItem(this.dashLayoutsKey(), JSON.stringify(o || { active: "executive", list: [] }));
    }

    dashLayout() {
        const s = this.dashLayouts();
        const presets = this.dashPresets();
        const copy = (ws) => ws.map((w) => ({ key: w.key, cols: w.cols, hidden: !!w.hidden }));
        if (s.active && presets[s.active]) return { id: s.active, name: presets[s.active].name, preset: true, widgets: copy(presets[s.active].widgets) };
        const found = (s.list || []).find((x) => x.id === s.active);
        if (found) return { id: found.id, name: found.name, preset: false, widgets: copy(found.widgets) };
        return { id: "executive", name: presets.executive.name, preset: true, widgets: copy(presets.executive.widgets) };
    }

    currentWidgets() {
        return this.state.dashDraft || this.dashLayout().widgets;
    }

    dashLayoutOptions() {
        const presets = this.dashPresets();
        const opts = Object.keys(presets).map((id) => ({ id, name: presets[id].name, preset: true }));
        this.dashLayouts().list.forEach((l) => opts.push({ id: l.id, name: l.name, preset: false }));
        return opts;
    }

    renderDashboardToolbar() {
        const mode = !!this.state.dashMode;
        const opts = this.dashLayoutOptions();
        const active = this.dashLayout();
        let html = `<div class="nx-dash-toolbar ${mode ? "is-mode" : ""}" data-dash-toolbar>
            <div class="nx-dash-toolbar-left">
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-dashtoggle>${this.ic("sliders", 13)} <span>${this.t("Customize Dashboard")}</span></button>
                <label class="nx-dash-layout-label">${this.t("Layout")}</label>
                <select class="nx-input nx-dash-layout" data-dashlayout title="${this.esc(this.t("Choose a dashboard layout"))}">
                    ${opts.map((o) => `<option value="${this.esc(o.id)}" ${o.id === active.id ? "selected" : ""}>${this.esc(this.t(o.name))}</option>`).join("")}
                </select>
                ${mode ? `
                <button class="nx-btn nx-btn-primary nx-btn-sm" data-dashsave>${this.ic("save", 13)} <span>${this.t("Save Layout")}</span></button>
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-dashrestore>${this.ic("rotate", 13)} <span>${this.t("Restore Default")}</span></button>` : ""}
            </div>
            <div class="nx-dash-toolbar-note">${mode
                ? this.t("Drag to reorder · resize to span · hide to remove · save to persist")
                : this.t("Executive Intelligence Center · Live ERP Analytics")}</div>
        </div>`;
        return html;
    }

    renderDashboardBody(ctx) {
        const defs = this.dashWidgetDefs();
        const widgets = this.state.dashDraft || this.dashLayout().widgets;
        const visible = widgets.filter((w) => !w.hidden);
        const hiddenKeys = defs.filter((def) => {
            const w = widgets.find((x) => x.key === def.key);
            return !w || w.hidden;
        });

        let html = `<div class="nx-dash-grid ${this.state.dashMode ? "is-dashmode" : ""}" data-dash-grid>`;
        visible.forEach((w) => { html += this.dashWidgetHtml(w, ctx); });
        html += `</div>`;

        if (this.state.dashMode && hiddenKeys.length) {
            html += `<div class="nx-dash-tray"><span class="nx-dash-tray-label">${this.t("Hidden")}</span>`;
            hiddenKeys.forEach((h) => {
                html += `<button class="nx-btn nx-btn-secondary nx-btn-sm" data-wadd="${h.key}">${this.ic(h.icon, 13)} ${this.esc(this.t(h.title))}</button>`;
            });
            html += `</div>`;
        }
        return html;
    }

    dashWidgetHtml(w, ctx) {
        const def = this.dashWidgetDefs().find((x) => x.key === w.key) || { key: w.key, kind: "kpi", icon: "chart", color: "blue", title: w.key, cols: 3 };
        const cols = w.cols || def.cols;
        const tools = this.state.dashMode ? `<span class="nx-widget-tools">
            <button class="nx-widget-tool" data-wdrag="${def.key}" title="${this.esc(this.t("Drag to reorder"))}">${this.ic("move", 13)}</button>
            <button class="nx-widget-tool" data-wresize="${def.key}" title="${this.esc(this.t("Resize"))}">${this.ic("maximize", 12)}</button>
            <button class="nx-widget-tool" data-whide="${def.key}" title="${this.esc(this.t("Hide"))}">${this.ic("eye-off", 13)}</button>
        </span>` : "";
        const body = this.dashWidgetBody(def, ctx);
        if (def.kind === "kpi") {
            if (def.kpi2) {
                const k = (ctx.kpiMap || {})[def.key];
                return `<div class="nx-dash-widget nx-dw-kpi" data-widget="${def.key}" style="--dw-cols:${cols}">
                    ${k ? this.icKpi(k) : this.emptyState("chart", "gray", this.t("No data"), "")}
                    ${tools ? `<div class="nx-kpi-tools">${tools}</div>` : ""}
                </div>`;
            }
            return `<div class="nx-dash-widget nx-dw-kpi" data-widget="${def.key}" style="--dw-cols:${cols}">
                <div class="nx-card nx-kpi-sm nx-kpi-${def.color}">${body}${tools ? `<div class="nx-kpi-tools">${tools}</div>` : ""}</div>
            </div>`;
        }
        return `<div class="nx-dash-widget" data-widget="${def.key}" style="--dw-cols:${cols}">
            <div class="nx-card">
                <div class="nx-card-head">
                    <span class="nx-card-ic nx-ic-${def.color}">${this.ic(def.icon, 15)}</span>
                    <span class="nx-card-title">${this.t(def.title)}</span>
                    ${tools}
                </div>
                <div class="nx-card-body">${body}</div>
            </div>
        </div>`;
    }

    dashWidgetBody(def, ctx) {
        const { s, c, p, inv, fx, pr, nt, trend, y, yDate, avgInvoice } = ctx;
        switch (def.key) {
            case "yesterday-sales":
                return this.kpiSm(this.money(y.amount), this.t("Yesterday Sales"), this.t("posted") + " " + yDate + " · " + this.num(y.count, 0) + " " + this.t("invoices"), "sales", "green");
            case "yesterday-profit":
                return this.kpiSm(this.money(y.profit), this.t("Yesterday Profit"), this.t("posted") + " " + yDate, "profit", "purple");
            case "yesterday-invoices":
                return this.kpiSm(this.num(y.count, 0), this.t("Yesterday Invoices"), this.t("posted") + " " + yDate, "file", "blue");
            case "avg-invoice":
                return this.kpiSm(this.money(avgInvoice), this.t("Average Invoice"), this.t("Yesterday") + " · " + this.num(y.count, 0) + " " + this.t("invoices"), "receipt", "teal");
            case "cash":
                return this.kpiSm(this.money(c.total), this.t("Cash Position"), this.t("Cash") + " " + this.money(c.cash) + " · " + this.t("Bank") + " " + this.money(c.bank), "wallet", "blue");
            case "inventory-value":
                return this.kpiSm(this.money(inv.total_value), this.t("Inventory Value"), this.num(inv.item_count, 0) + " " + this.t("items") + " · " + this.num(inv.total_qty, 0) + " " + this.t("units"), "box", "teal");
            case "receivables":
                return this.kpiSm(this.money(c.receivables), this.t("Accounts Receivable"), this.t("Payables") + " " + this.money(c.payables), "incoming", "orange");
            case "payables":
                return this.kpiSm(this.money(c.payables), this.t("Accounts Payable"), this.t("Receivables") + " " + this.money(c.receivables), "outgoing", "red");
            case "sales-trend":
                return this.svgArea(trend, "blue");
            case "profit-trend":
                return this.svgProfitArea(trend);
            case "inventory-analysis":
                return this.inventoryAnalysis(inv);
            case "top-items":
                return this.hbarRows((s.top_items || []).map((i) => ({ name: i.item_name || i.item_code, sub: this.num(i.qty, 0) + " " + this.t("unit(s)") + " " + this.t("sold"), value: i.amount })), "teal");
            case "top-customers":
                return this.hbarRows((s.top_customers || []).map((i) => ({ name: i.customer_name || i.customer, sub: i.count + " " + this.t("invoices"), value: i.amount })), "orange");
            case "top-suppliers":
                return this.hbarRows((p.top_suppliers || []).map((i) => ({ name: i.supplier_name || i.supplier, sub: i.count + " " + this.t("invoices"), value: i.amount })), "blue");
            case "low-stock-alerts":
                return this.lowStockBody(inv);
            case "pricing-alerts":
                return this.pricingAlertsBody(pr);
            case "fx-alerts":
                return this.exchangeAlertsBody(fx);
            case "notifications":
                return this.notificationBody(nt);
            default:
                return this.emptyState("chart", "gray", this.t("No data"), "");
        }
    }

    kpiMeta() {
        return {
            "yesterday-sales": { icon: "sales", color: "green", goodUp: true },
            "yesterday-profit": { icon: "profit", color: "purple", goodUp: true },
            "receivables": { icon: "incoming", color: "orange", goodUp: false },
            "inventory-value": { icon: "box", color: "teal", goodUp: true },
            "cash-balance": { icon: "wallet", color: "blue", goodUp: true },
            "po-pending": { icon: "cart", color: "indigo", goodUp: true },
            "so-pending": { icon: "file-text", color: "purple", goodUp: true },
            "low-stock": { icon: "alert", color: "red", goodUp: false }
        };
    }

    kpiIcon(name) {
        const map = { "activity": "profit", "package": "box", "shopping-cart": "cart", "alert-triangle": "alert" };
        return map[name] || name || "chart";
    }

    svgSpark(values, color) {
        if (!values || values.length < 2) values = [0, 0];
        const w = 96, h = 30, pl = 2, pr = 2, pt = 3, pb = 3;
        const vals = values.map((v) => Number(v) || 0);
        const max = Math.max.apply(null, vals.concat([1]));
        const min = Math.min.apply(null, vals.concat([0]));
        const range = (max - min) || 1;
        const n = vals.length;
        const iw = w - pl - pr, ih = h - pt - pb;
        const X = (i) => pl + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
        const Y = (v) => pt + ih - ((v - min) / range) * ih;
        const gid = "nxsp" + Math.floor(Math.random() * 1e6).toString(36);
        const line = vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
        const area = "M" + X(0).toFixed(1) + " " + Y(vals[0]).toFixed(1) + " " +
            vals.map((v, i) => "L" + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ") +
            " L" + X(n - 1).toFixed(1) + " " + (pt + ih) + " L" + pl.toFixed(1) + " " + (pt + ih) + " Z";
        return `<svg class="nx-kpi2-spark-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--nx-${color})" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="var(--nx-${color})" stop-opacity="0.02"/>
                </linearGradient>
            </defs>
            <path d="${area}" fill="url(#${gid})"/>
            <path class="nx-chart-line nx-line-${color}" d="${line}"/>
            <circle class="nx-chart-dot nx-dot-${color}" cx="${X(n - 1).toFixed(1)}" cy="${Y(vals[n - 1]).toFixed(1)}" r="2.4"/>
        </svg>`;
    }

    icKpi(k) {
        if (!k) return this.emptyState("chart", "gray", this.t("No data"), "");
        const meta = (this.kpiMeta() || {})[k.key] || { icon: "chart", color: "blue", goodUp: true };
        const color = meta.color;
        const value = k.currency ? this.money(k.value) : this.num(k.value, 0);
        const prev = k.currency ? this.money(k.prev) : this.num(k.prev, 0);
        const badge = this.deltaBadge(k.pct, meta.goodUp);
        const spark = this.svgSpark(k.spark || [], color);
        return `<div class="nx-kpi2 nx-kpi2-${color}" data-click="${this.esc(k.click || k.key)}">
            <div class="nx-kpi2-head">
                <span class="nx-card-ic nx-ic-${color}">${this.ic(this.kpiIcon(meta.icon), 15)}</span>
                <span class="nx-kpi2-title">${this.esc(this.t(k.title || ""))}</span>
            </div>
            <div class="nx-kpi2-value">${this.esc(value)}</div>
            <div class="nx-kpi2-foot">
                <span class="nx-kpi2-vs">${this.t("vs yesterday")} <b>${this.esc(prev)}</b></span>
                ${badge}
            </div>
            <div class="nx-kpi2-spark">${spark}</div>
        </div>`;
    }

    kpiSm(value, label, sub, icon, color) {
        return `<div class="nx-kpi-sm-top">
            <span class="nx-card-ic nx-ic-${color}">${this.ic(icon, 15)}</span>
            <span class="nx-kpi-sm-label">${this.esc(label)}</span>
        </div>
        <div class="nx-kpi-sm-value">${this.esc(value)}</div>
        <div class="nx-kpi-sm-sub">${this.esc(sub || "")}</div>`;
    }

    svgProfitArea(points) {
        if (!points || !points.length) return `<div class="nx-empty">${this.t("No sales this period")}</div>`;
        const w = 320, h = 120, pl = 8, pr = 8, pt = 10, pb = 8;
        const vals = points.map((p) => p.profit || 0);
        const max = Math.max.apply(null, vals.concat([1]));
        const n = points.length;
        const iw = w - pl - pr, ih = h - pt - pb;
        const X = (i) => pl + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
        const Y = (v) => pt + ih - (v / max) * ih;
        const gid = "nxgp" + Math.floor(Math.random() * 1e6).toString(36);
        let grid = "";
        for (let g = 0; g < 3; g++) {
            const gy = pt + (ih / 3) * g;
            grid += `<line x1="${pl}" y1="${gy}" x2="${w - pr}" y2="${gy}" class="nx-chart-grid"/>`;
        }
        const area = "M" + X(0) + " " + Y(vals[0]) + " " + vals.map((v, i) => "L" + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ") + " L" + X(n - 1).toFixed(1) + " " + (pt + ih) + " L" + pl + " " + (pt + ih) + " Z";
        const line = vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
        const total = vals.reduce((a, b) => a + b, 0);
        return `<div class="nx-chart">
            <svg class="nx-chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--nx-purple)" stop-opacity="0.32"/>
                        <stop offset="100%" stop-color="var(--nx-purple)" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>
                ${grid}
                <path d="${area}" fill="url(#${gid})"/>
                <path class="nx-chart-line nx-line-purple" d="${line}"/>
                <circle class="nx-chart-dot nx-dot-purple" cx="${X(n - 1).toFixed(1)}" cy="${Y(vals[n - 1]).toFixed(1)}" r="3.5"/>
            </svg>
            <div class="nx-chart-legend">
                <span><i class="nx-dot nx-dot-purple"></i>${this.t("Profit")} <b>${this.money(total)}</b></span>
            </div>
        </div>`;
    }

    inventoryAnalysis(inv) {
        const low = inv.low_stock || { count: 0, items: [] };
        const out = inv.out_of_stock || { count: 0, items: [] };
        const totalItems = Math.max(1, inv.item_count || 0);
        const healthy = Math.max(0, totalItems - low.count - out.count);
        const donut = this.svgDonut([
            { label: this.t("In Stock"), value: healthy, color: "green" },
            { label: this.t("Low Stock"), value: low.count, color: "orange" },
            { label: this.t("Out Of Stock"), value: out.count, color: "red" }
        ]);
        return `<div class="nx-inv-wrap">
            <div class="nx-inv-donut">${donut}
                <div class="nx-inv-legend">
                    <div class="nx-inv-stat"><span><i class="nx-dot nx-dot-green"></i>${this.t("In Stock")}</span><b>${this.num(healthy, 0)}</b></div>
                    <div class="nx-inv-stat" data-click="low-stock"><span><i class="nx-dot nx-dot-orange"></i>${this.t("Low Stock")}</span><b>${this.num(low.count, 0)}</b></div>
                    <div class="nx-inv-stat" data-click="out-of-stock"><span><i class="nx-dot nx-dot-red"></i>${this.t("Out Of Stock")}</span><b>${this.num(out.count, 0)}</b></div>
                </div>
            </div>
            <div class="nx-inv-value"><span class="nx-perf-label">${this.t("Inventory Value")}</span><b>${this.esc(this.money(inv.total_value))}</b>
                <div class="nx-inv-sub">${this.num(inv.item_count, 0)} ${this.t("items")} · ${this.num(inv.total_qty, 0)} ${this.t("units")}</div>
            </div>
        </div>`;
    }

    lowStockBody(inv) {
        const low = inv.low_stock || { count: 0, items: [] };
        if (!low.items || !low.items.length) {
            return this.emptyState("alert", "green", this.t("All stocked"), this.t("No items are below their reorder level."), this.t("Open Stock"), "low-stock");
        }
        let body = `<div class="nx-perf">
            <div class="nx-perf-row"><span>${this.t("items need reorder")}</span><b>${this.num(low.count, 0)}</b></div>
        </div>`;
        body += this.hbarRows(low.items.slice(0, 5).map((i) => ({ name: i.item_name || i.item_code, sub: this.t("low stock"), value: i.qty || 0 })), "orange");
        return body;
    }

    pricingAlertsBody(pr) {
        if (!pr.count) {
            return this.emptyState("alert", "green", this.t("No pricing alerts"), this.t("All items are priced above cost."), this.t("Open Pricing Center"), "pricing");
        }
        let body = `<div class="nx-perf">
            <div class="nx-perf-big"><span class="nx-perf-label">${this.t("Impact")}</span>${this.esc(this.money(pr.impact))}</div>
            <div class="nx-perf-row"><span>${this.t("items need price review")}</span><b>${this.num(pr.count, 0)}</b></div>
        </div>`;
        body += `<div class="nx-list-body nx-list-sm">`;
        (pr.items || []).slice(0, 5).forEach((i) => {
            body += `<div class="nx-rank" data-click="pricing">
                <span class="nx-rank-name">${this.esc(i.item_name || i.item_code)}<i>${this.esc(this.money(i.price_list_rate))} ≤ ${this.esc(this.money(i.valuation_rate))}</i></span>
            </div>`;
        });
        body += `</div>`;
        return body;
    }

    exchangeAlertsBody(fx) {
        const alerts = fx.alerts || [];
        const base = fx.base_currency || this.state.currency;
        if (!alerts.length) {
            return this.emptyState("globe", "teal", this.t("No rates configured"), this.t("Add exchange rates in the Exchange Center."), this.t("Open Exchange Center"), "exchange");
        }
        let body = `<div class="nx-list-body">`;
        alerts.slice(0, 6).forEach((a) => {
            const pct = a.change_pct;
            const cls = pct === null || pct === undefined ? "nx-badge-muted" : (pct >= 0 ? "nx-badge-green" : "nx-badge-red");
            const arrow = pct >= 0 ? this.ic("arrow-up", 12) : this.ic("arrow-down", 12);
            body += `<div class="nx-rank" data-click="exchange">
                <span class="nx-rank-name nx-fx-name"><b>${this.esc(a.from_currency)}</b><i>→ ${this.esc(base)}</i></span>
                <span class="nx-rank-value nx-fx-rate">${this.num(a.rate, 2)} <span class="nx-badge ${cls}">${pct === null || pct === undefined ? "—" : arrow + this.num(Math.abs(pct), 1) + "%"}</span></span>
            </div>`;
        });
        body += `</div>`;
        if (fx.missing && fx.missing.length) {
            body += `<div class="nx-card-foot">${this.t("Missing")}: ${fx.missing.join(", ")}</div>`;
        }
        return body;
    }

    notificationBody(nt) {
        const recent = nt.recent || [];
        if (!recent.length) {
            return this.emptyState("bell", "orange", this.t("All caught up"), this.t("You have no new notifications right now."), this.t("Open Notifications"), "notifications");
        }
        let body = `<div class="nx-list-body nx-list-sm">`;
        recent.slice(0, 6).forEach((n) => {
            const dt = String(n.creation || "").slice(0, 16).replace("T", " ");
            body += `<div class="nx-notify ${n.read ? "is-read" : ""}" data-click="notifications">
                <span class="nx-notify-dot ${n.read ? "" : "is-unread"}"></span>
                <span class="nx-notify-body"><b>${this.esc(n.subject)}</b><i>${this.esc(dt)}</i></span>
            </div>`;
        });
        body += `</div>`;
        return body;
    }

    // ---------------------------------------------------------------- customization controls (P5)
    bindDashControls() {
        const root = this.root;
        if (!root) return;
        const toggle = root.querySelector("[data-dashtoggle]");
        if (toggle) toggle.addEventListener("click", () => {
            if (this.state.dashMode) this.exitCustomize();
            else this.enterCustomize();
        });
        const save = root.querySelector("[data-dashsave]");
        if (save) save.addEventListener("click", () => this.saveLayout());
        const restore = root.querySelector("[data-dashrestore]");
        if (restore) restore.addEventListener("click", () => this.restoreDefault());
        const sel = root.querySelector("[data-dashlayout]");
        if (sel) sel.addEventListener("change", () => this.selectLayout(sel.value));
    }

    enterCustomize() {
        this.state.dashMode = true;
        this.state.dashDraft = this.dashLayout().widgets.map((w) => ({ key: w.key, cols: w.cols, hidden: !!w.hidden }));
        this.renderDashboard();
    }

    exitCustomize() {
        this.state.dashMode = false;
        this.state.dashDraft = null;
        this.renderDashboard();
    }

    renderDashboard() {
        if (this.state.embed || this.state.view !== "dashboard") return;
        if (this.state.data) this.render(this.state.data);
    }

    selectLayout(id) {
        const s = this.dashLayouts();
        s.active = id;
        this.setDashLayouts(s);
        const lay = this.dashLayout();
        this.state.dashDraft = this.state.dashMode ? lay.widgets.map((w) => ({ key: w.key, cols: w.cols, hidden: !!w.hidden })) : null;
        this.renderDashboard();
    }

    saveLayout() {
        const layout = this.dashLayout();
        const s = this.dashLayouts();
        const arr = (this.state.dashDraft || layout.widgets).map((w) => ({ key: w.key, cols: w.cols, hidden: !!w.hidden }));
        let activeId = layout.id;
        if (layout.preset) {
            let name = layout.name + " Custom";
            let n = s.list.filter((x) => x.name === name).length;
            if (n) name = name + " (" + (n + 1) + ")";
            const id = "custom-" + Date.now().toString(36);
            s.list.push({ id, name, preset: false, widgets: arr });
            activeId = id;
        } else {
            const idx = s.list.findIndex((x) => x.id === layout.id);
            const rec = { id: layout.id, name: layout.name, preset: false, widgets: arr };
            if (idx > -1) s.list[idx] = rec;
            else s.list.push(rec);
        }
        s.active = activeId;
        this.setDashLayouts(s);
        this.state.dashDraft = arr.map((w) => ({ ...w }));
        this.renderDashboard();
        if (frappe && frappe.show_alert) frappe.show_alert({ message: this.t("Dashboard layout saved"), indicator: "green" });
    }

    restoreDefault() {
        const s = this.dashLayouts();
        s.active = "executive";
        this.setDashLayouts(s);
        this.state.dashDraft = this.dashLayout().widgets.map((w) => ({ key: w.key, cols: w.cols, hidden: !!w.hidden }));
        this.renderDashboard();
    }

    cycleWidgetSize(key) {
        const arr = this.currentWidgets();
        const w = arr.find((x) => x.key === key);
        if (!w) return;
        const def = this.dashWidgetDefs().find((x) => x.key === key) || {};
        const allowed = def.kind === "kpi" ? [3, 6] : def.kind === "chart" ? [6, 12] : [4, 6, 12];
        const i = allowed.indexOf(w.cols);
        w.cols = allowed[(i + 1) % allowed.length];
        this.renderDashboard();
    }

    hideWidget(key) {
        const arr = this.currentWidgets();
        const w = arr.find((x) => x.key === key);
        if (w) w.hidden = true;
        this.renderDashboard();
    }

    showWidget(key) {
        const arr = this.currentWidgets();
        const w = arr.find((x) => x.key === key);
        if (w) w.hidden = false;
        this.renderDashboard();
    }

    bindDashCustomize() {
        if (this._dashCustomizeBound) return;
        this._dashCustomizeBound = true;
        const self = this;
        let dragging = null, dropTarget = null;

        this.root.addEventListener("pointerdown", (e) => {
            if (!this.state.dashMode) return;
            const grip = e.target.closest("[data-wdrag]");
            if (!grip) return;
            dragging = grip.getAttribute("data-wdrag");
            e.preventDefault();
            const grid = this.root.querySelector("[data-dash-grid]");
            if (grid) grid.classList.add("is-dragging");
        });

        window.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            const grid = this.root.querySelector("[data-dash-grid]");
            if (!grid) return;
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const w = el && el.closest("[data-widget]");
            grid.querySelectorAll(".is-drop-target").forEach((x) => x.classList.remove("is-drop-target"));
            if (w && w.getAttribute("data-widget") !== dragging) {
                w.classList.add("is-drop-target");
                dropTarget = w.getAttribute("data-widget");
            } else {
                dropTarget = null;
            }
        });

        window.addEventListener("pointerup", () => {
            if (!dragging) return;
            const grid = this.root.querySelector("[data-dash-grid]");
            if (grid) grid.classList.remove("is-dragging");
            if (grid) grid.querySelectorAll(".is-drop-target").forEach((x) => x.classList.remove("is-drop-target"));
            if (dropTarget && dropTarget !== dragging) {
                const arr = this.currentWidgets();
                const a = arr.findIndex((x) => x.key === dragging);
                const b = arr.findIndex((x) => x.key === dropTarget);
                if (a > -1 && b > -1) {
                    const [moved] = arr.splice(a, 1);
                    arr.splice(b, 0, moved);
                    this.renderDashboard();
                }
            }
            dragging = null;
            dropTarget = null;
        });

        this.root.addEventListener("click", (e) => {
            if (!this.state.dashMode) return;
            const rz = e.target.closest("[data-wresize]");
            if (rz) { e.preventDefault(); this.cycleWidgetSize(rz.getAttribute("data-wresize")); return; }
            const hd = e.target.closest("[data-whide]");
            if (hd) { e.preventDefault(); this.hideWidget(hd.getAttribute("data-whide")); return; }
            const ad = e.target.closest("[data-wadd]");
            if (ad) { this.showWidget(ad.getAttribute("data-wadd")); return; }
        });
    }

    sectionHead(icon, color, title, subtitle) {
        return `<div class="nx-section-head">
            <span class="nx-section-ic nx-ic-${color}">${this.ic(icon, 16)}</span>
            <div class="nx-section-txt">
                <b>${this.esc(title)}</b>
                <i>${this.esc(subtitle)}</i>
            </div>
            <span class="nx-section-accent nx-accent-${color}"></span>
        </div>`;
    }

    emptyState(icon, color, title, body, actionLabel, actionKey) {
        return `<div class="nx-empty-state">
            <span class="nx-empty-ic nx-ic-${color}">${this.ic(icon, 26)}</span>
            <b>${this.esc(title)}</b>
            <p>${this.esc(body)}</p>
            ${actionLabel && actionKey ? `<button class="nx-btn nx-btn-sm" data-click="${actionKey}">${this.esc(actionLabel)}</button>` : ""}
        </div>`;
    }

    kpiCard(label, value, icon, color, sub, delta, spark, click) {
        return `<div class="nx-card nx-kpi nx-kpi-${color}" ${click ? `data-click="${click}"` : ""}>
            <div class="nx-kpi-glow nx-glow-${color}"></div>
            <div class="nx-kpi-top">
                <span class="nx-card-ic nx-ic-${color}">${this.ic(icon)}</span>
                ${delta ? `<span class="nx-kpi-delta">${delta}</span>` : ""}
            </div>
            <div class="nx-kpi-value">${this.esc(value)}</div>
            <div class="nx-kpi-label">${this.esc(label)}</div>
            ${sub ? `<div class="nx-kpi-sub">${sub}</div>` : ""}
            ${spark && spark.length ? `<div class="nx-kpi-spark">${this.sparkline(spark)}</div>` : ""}
        </div>`;
    }

    card(title, icon, color, body, click, extra) {
        return `<div class="nx-card" ${click ? `data-click="${click}"` : ""}>
            <div class="nx-card-head">
                <span class="nx-card-ic nx-ic-${color}">${this.ic(icon)}</span>
                <span class="nx-card-title">${this.esc(title)}</span>
                ${extra || ""}
            </div>
            <div class="nx-card-body">${body}</div>
        </div>`;
    }

    sparkline(points) {
        const vals = points.map((p) => p.amount || 0);
        const max = Math.max.apply(null, vals.concat([1]));
        const min = Math.min.apply(null, vals);
        const range = (max - min) || 1;
        const w = 96, h = 30, pad = 3;
        const n = vals.length;
        const X = (i) => pad + (n <= 1 ? (w - 2 * pad) / 2 : (i / (n - 1)) * (w - 2 * pad));
        const Y = (v) => pad + (h - 2 * pad) - ((v - min) / range) * (h - 2 * pad);
        const line = vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
        return `<svg class="nx-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <path class="nx-spark-area" d="${line} L${X(n - 1).toFixed(1)} ${h - pad} L${pad} ${h - pad} Z"/>
            <path class="nx-spark-line" d="${line}"/>
        </svg>`;
    }

    svgArea(points, color) {
        if (!points || !points.length) return `<div class="nx-empty">${this.t("No sales this period")}</div>`;
        const w = 320, h = 120, pl = 8, pr = 8, pt = 10, pb = 8;
        const vals = points.map((p) => p.amount || 0);
        const prof = points.map((p) => p.profit || 0);
        const max = Math.max.apply(null, vals.concat(prof).concat([1]));
        const n = points.length;
        const iw = w - pl - pr, ih = h - pt - pb;
        const X = (i) => pl + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
        const Y = (v) => pt + ih - (v / max) * ih;
        const gid = "nxg" + Math.floor(Math.random() * 1e6).toString(36);
        let grid = "";
        for (let g = 0; g < 3; g++) {
            const gy = pt + (ih / 3) * g;
            grid += `<line x1="${pl}" y1="${gy}" x2="${w - pr}" y2="${gy}" class="nx-chart-grid"/>`;
        }
        const area = "M" + X(0) + " " + Y(vals[0]) + " " + vals.map((v, i) => "L" + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ") + " L" + X(n - 1).toFixed(1) + " " + (pt + ih) + " L" + pl + " " + (pt + ih) + " Z";
        const line = vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
        const pline = prof.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
        const total = vals.reduce((a, b) => a + b, 0);
        const tprofit = prof.reduce((a, b) => a + b, 0);
        return `<div class="nx-chart">
            <svg class="nx-chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--nx-${color})" stop-opacity="0.32"/>
                        <stop offset="100%" stop-color="var(--nx-${color})" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>
                ${grid}
                <path d="${area}" fill="url(#${gid})"/>
                <path class="nx-chart-line nx-line-${color}" d="${line}"/>
                <path class="nx-chart-line nx-line-indigo" d="${pline}"/>
                <circle class="nx-chart-dot nx-dot-${color}" cx="${X(n - 1).toFixed(1)}" cy="${Y(vals[n - 1]).toFixed(1)}" r="3.5"/>
            </svg>
            <div class="nx-chart-legend">
                <span><i class="nx-dot nx-dot-${color}"></i>${this.t("Revenue")} <b>${this.money(total)}</b></span>
                <span><i class="nx-dot nx-dot-indigo"></i>${this.t("Profit")} <b>${this.money(tprofit)}</b></span>
            </div>
        </div>`;
    }

    svgColumns(points, color) {
        if (!points || !points.length) return `<div class="nx-empty">${this.t("No sales this period")}</div>`;
        const w = 320, h = 130, pt = 10, pb = 18;
        const vals = points.map((p) => p.amount || 0);
        const max = Math.max.apply(null, vals.concat([1]));
        const n = points.length;
        const iw = w - 16;
        const bw = Math.min(34, iw / n * 0.6);
        const ih = h - pt - pb;
        const X = (i) => 8 + (n === 1 ? iw / 2 : (i / (n - 1)) * iw) - bw / 2;
        const Y = (v) => pt + ih - (v / max) * ih;
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let bars = "";
        points.forEach((p, i) => {
            const v = vals[i];
            const bh = Math.max(2, ih * (v / max));
            const d = new Date(p.date);
            const wd = days[d.getDay()];
            const isLast = i === n - 1;
            bars += `<rect class="nx-col${isLast ? " is-last" : ""}" x="${X(i).toFixed(1)}" y="${(pt + ih - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" title="${this.esc(this.money(v))} · ${this.esc(wd)}"/>
                <text class="nx-col-label" x="${(X(i) + bw / 2).toFixed(1)}" y="${h - 4}">${wd}</text>`;
        });
        const total = vals.reduce((a, b) => a + b, 0);
        return `<div class="nx-chart">
            <svg class="nx-chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="--nx-chart-c:var(--nx-${color})">
                <line x1="8" y1="${pt + ih}" x2="${w - 8}" y2="${pt + ih}" class="nx-chart-axis"/>
                ${bars}
            </svg>
            <div class="nx-chart-legend"><span><i class="nx-dot nx-dot-${color}"></i>${this.t("7-day revenue")} <b>${this.money(total)}</b></span></div>
        </div>`;
    }

    svgDonut(segments, size) {
        size = size || 108;
        const cx = size / 2, cy = size / 2, r = size / 2 - 9, sw = 14;
        const total = segments.reduce((a, s) => a + s.value, 0) || 1;
        const circ = 2 * Math.PI * r;
        let offset = 0;
        let arcs = "";
        segments.forEach((s) => {
            const frac = s.value / total;
            const dash = frac * circ;
            const gap = circ - dash;
            arcs += `<circle class="nx-donut-seg" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--nx-${s.color})" stroke-width="${sw}"
                stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" stroke-linecap="butt"/>
                <title>${this.esc(s.label)}: ${this.num(s.value, 0)}</title>`;
            offset += dash;
        });
        return `<div class="nx-donut">
            <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--nx-border)" stroke-width="${sw}"/>
                ${arcs}
            </svg>
            <div class="nx-donut-center"><b>${this.num(total, 0)}</b><i>${this.t("items")}</i></div>
        </div>`;
    }

    areaCard(title, color, trend) {
        return this.card(title, "chart", color, this.svgArea(trend, color), "weekly-trend");
    }

    columnCard(title, color, last7) {
        return this.card(title, "chart", color, this.svgColumns(last7, color), "monthly-trend");
    }

    cashMini(c) {
        const rows = [
            ["cash", this.t("Cash"), c.cash, "green", "cash"],
            ["bank", this.t("Bank"), c.bank, "blue", "cash"],
            ["total", this.t("Total"), c.total, "teal", "cash"],
            ["receivables", this.t("Receivables"), c.receivables, "orange", "receivables"],
            ["payables", this.t("Payables"), c.payables, "red", "payables"],
            ["net", this.t("Net Position"), c.net_position, "purple", "net-position"]
        ];
        const max = Math.max.apply(null, rows.map((r) => Math.abs(r[2]) || 0).concat([1]));
        let body = `<div class="nx-cash-grid">`;
        rows.forEach((r) => {
            const pct = Math.min(100, Math.round((Math.abs(r[2]) / max) * 100));
            body += `<div class="nx-cash-item" ${r[4] ? `data-click="${r[4]}"` : ""}>
                <div class="nx-cash-top"><span class="nx-cash-name"><i class="nx-dot nx-dot-${r[3]}"></i>${this.esc(r[1])}</span>
                <span class="nx-cash-value">${this.esc(this.money(r[2]))}</span></div>
                <div class="nx-cash-track"><i class="nx-cash-fill" style="width:${pct}%;background:var(--nx-${r[3]})"></i></div>
            </div>`;
        });
        body += `</div>`;
        return this.card(this.t("Cash Position"), "wallet", "blue", body, "cash");
    }

    salesPerformance(s) {
        const m = s.month || {};
        const prev = m.prev_amount || 0;
        const cur = m.amount || 0;
        const max = Math.max(prev, cur, 1);
        let body = `<div class="nx-perf">
            <div class="nx-perf-big"><span class="nx-perf-label">${this.t("This Month")}</span>${this.esc(this.money(m.amount))}</div>
            <div class="nx-compare">
                <div class="nx-compare-bar"><span class="nx-compare-txt">${this.t("This Month")}</span><div class="nx-compare-track"><i class="nx-fill" style="width:${Math.round((cur / max) * 100)}%;background:var(--nx-green)"></i></div></div>
                <div class="nx-compare-bar"><span class="nx-compare-txt">${this.t("Last Month")}</span><div class="nx-compare-track"><i class="nx-fill" style="width:${Math.round((prev / max) * 100)}%;background:var(--nx-blue)"></i></div></div>
            </div>
            <div class="nx-perf-row"><span>${this.t("Profit")}</span><b>${this.esc(this.money(m.profit))}</b></div>
            <div class="nx-perf-row"><span>${this.t("invoices")}</span><b>${this.num(m.count, 0)}</b></div>
        </div>`;
        body += `<div class="nx-card-foot">${this.deltaBadge(m.change_pct)} ${this.t("vs Last Month")}</div>`;
        return this.card(this.t("Sales Performance"), "sales", "green", body, "sales-performance");
    }

    purchasePerformance(p) {
        const m = p.month || {};
        const rw = p.requests_waiting || { available: false };
        let body = `<div class="nx-perf">
            <div class="nx-perf-big"><span class="nx-perf-label">${this.t("This Month")}</span>${this.esc(this.money(m.amount))}</div>
            <div class="nx-perf-row"><span>${this.t("Last Month")}</span><b>${this.esc(this.money(m.prev_amount))}</b></div>
            <div class="nx-perf-row">
                <span>${this.t("Purchase Requests Waiting Approval")}</span>
                <b ${rw.available ? `data-click="requests"` : ""}>${rw.available ? this.num(rw.count, 0) : "—"}</b>
            </div>
            <div class="nx-perf-row">
                <span>${this.t("Pending Purchase Orders")}</span><b data-click="pending-pos">${this.num((p.pending_pos || {}).count, 0)}</b>
            </div>
        </div>`;
        body += `<div class="nx-card-foot">${this.deltaBadge(m.change_pct)} ${this.t("vs Last Month")}</div>`;
        return this.card(this.t("Purchase Performance"), "cart", "orange", body, "purchase-performance");
    }

    inventoryHealth(inv) {
        const low = inv.low_stock || { count: 0, items: [] };
        const out = inv.out_of_stock || { count: 0, items: [] };
        const totalItems = Math.max(1, inv.item_count || 0);
        const healthy = Math.max(0, totalItems - low.count - out.count);
        const donut = this.svgDonut([
            { label: this.t("In Stock"), value: healthy, color: "green" },
            { label: this.t("Low Stock"), value: low.count, color: "orange" },
            { label: this.t("Out Of Stock"), value: out.count, color: "red" }
        ]);
        let body = `<div class="nx-inv-wrap">
            <div class="nx-inv-donut">${donut}
                <div class="nx-inv-legend">
                    <div class="nx-inv-stat"><span><i class="nx-dot nx-dot-green"></i>${this.t("In Stock")}</span><b>${this.num(healthy, 0)}</b></div>
                    <div class="nx-inv-stat" data-click="low-stock"><span><i class="nx-dot nx-dot-orange"></i>${this.t("Low Stock")}</span><b>${this.num(low.count, 0)}</b></div>
                    <div class="nx-inv-stat" data-click="out-of-stock"><span><i class="nx-dot nx-dot-red"></i>${this.t("Out Of Stock")}</span><b>${this.num(out.count, 0)}</b></div>
                </div>
            </div>
            <div class="nx-inv-value"><span class="nx-perf-label">${this.t("Inventory Value")}</span><b>${this.esc(this.money(inv.total_value))}</b>
                <div class="nx-inv-sub">${this.num(inv.item_count, 0)} ${this.t("items")} · ${this.num(inv.total_qty, 0)} ${this.t("units")}</div>
            </div>
        </div>`;
        if (low.items.length) {
            body += `<div class="nx-list-body nx-list-sm">${this.hbarRows(low.items.slice(0, 5).map((i) => ({
                name: i.item_name || i.item_code, sub: this.t("low stock"), value: i.qty || 0
            })), "orange")}</div>`;
        }
        return this.card(this.t("Inventory Health"), "box", "teal", body, "low-stock");
    }

    warehouseStatus(inv) {
        const ws = (inv.warehouses || []).slice(0, 6);
        if (!ws.length) return this.card(this.t("Warehouse Status"), "grid", "blue",
            this.emptyState("grid", "blue", this.t("No warehouses"), this.t("Create a warehouse to start tracking stock locations.")));
        const max = Math.max.apply(null, ws.map((w) => w.value || 0).concat([1]));
        let body = `<div class="nx-list-body">`;
        ws.forEach((w) => {
            const pct = Math.round((w.value / max) * 100);
            body += `<div class="nx-hbar" data-click="warehouse">
                <div class="nx-hbar-txt">
                    <span class="nx-hbar-name">${this.esc(w.warehouse)}<i>${this.num(w.items, 0)} ${this.t("items")} · ${this.num(w.qty, 0)} ${this.t("units")}</i></span>
                    <b class="nx-hbar-val">${this.esc(this.money(w.value))}</b>
                </div>
                <div class="nx-hbar-track"><i style="width:${pct}%;background:var(--nx-blue)"></i></div>
            </div>`;
        });
        body += `</div>`;
        return this.card(this.t("Warehouse Status"), "grid", "blue", body, "warehouse");
    }

    hbarCard(title, icon, color, rows, click) {
        let body;
        if (!rows || !rows.length) {
            body = this.emptyState(icon, color, this.t("No data yet"), this.t("Nothing recorded for this period."));
        } else {
            body = this.hbarRows(rows, color);
        }
        return this.card(title, icon, color, body, click);
    }

    hbarRows(rows, color) {
        if (!rows || !rows.length) return this.emptyState("alert", "gray", this.t("No data yet"), this.t("Nothing recorded for this period."));
        const max = Math.max.apply(null, rows.map((r) => Math.abs(r.value || 0)).concat([1]));
        let html = "";
        rows.forEach((r) => {
            const pct = Math.max(4, Math.round((Math.abs(r.value || 0) / max) * 100));
            html += `<div class="nx-hbar">
                <div class="nx-hbar-txt">
                    <span class="nx-hbar-name">${this.esc(r.name)}${r.sub ? `<i>${this.esc(r.sub)}</i>` : ""}</span>
                    <b class="nx-hbar-val">${this.esc(r.value !== undefined && r.value !== null ? this.money(r.value) : "")}</b>
                </div>
                <div class="nx-hbar-track"><i style="width:${pct}%;background:var(--nx-${color})"></i></div>
            </div>`;
        });
        return `<div class="nx-list-body">${html}</div>`;
    }

    exchangeCard(fx) {
        const alerts = fx.alerts || [];
        const base = fx.base_currency || this.state.currency;
        let body = "";
        if (!alerts.length) {
            body = this.emptyState("globe", "teal", this.t("No rates configured"), this.t("Add exchange rates in the Exchange Center to track currency movements."), this.t("Open Exchange Center"), "exchange");
        } else {
            body = `<div class="nx-list-body">`;
            alerts.slice(0, 6).forEach((a) => {
                const pct = a.change_pct;
                const cls = pct === null || pct === undefined ? "nx-badge-muted" : (pct >= 0 ? "nx-badge-green" : "nx-badge-red");
                const arrow = pct >= 0 ? this.ic("arrow-up", 12) : this.ic("arrow-down", 12);
                body += `<div class="nx-rank" data-click="exchange">
                    <span class="nx-rank-name nx-fx-name"><b>${this.esc(a.from_currency)}</b><i>→ ${this.esc(base)}</i></span>
                    <span class="nx-rank-value nx-fx-rate">${this.num(a.rate, 2)} <span class="nx-badge ${cls}">${pct === null || pct === undefined ? "—" : arrow + this.num(Math.abs(pct), 1) + "%"}</span></span>
                </div>`;
            });
            body += `</div>`;
            if (fx.missing && fx.missing.length) {
                body += `<div class="nx-card-foot">${this.t("Missing")}: ${fx.missing.join(", ")}</div>`;
            }
        }
        return this.card(this.t("Exchange Rate Alerts"), "globe", "teal", body, "exchange");
    }

    pricingCard(pr) {
        let body = "";
        if (!pr.count) {
            body = this.emptyState("alert", "green", this.t("No pricing alerts"), this.t("All items are priced above cost. Nothing needs review."), this.t("Open Pricing Center"), "pricing");
        } else {
            body = `<div class="nx-perf">
                <div class="nx-perf-big"><span class="nx-perf-label">${this.t("Impact")}</span>${this.esc(this.money(pr.impact))}</div>
                <div class="nx-perf-row"><span>${this.t("items need price review")}</span><b>${this.num(pr.count, 0)}</b></div>
            </div>
            <div class="nx-list-body nx-list-sm">`;
            (pr.items || []).slice(0, 5).forEach((i) => {
                body += `<div class="nx-rank" data-click="pricing">
                    <span class="nx-rank-name">${this.esc(i.item_name || i.item_code)}<i>${this.esc(this.money(i.price_list_rate))} ≤ ${this.esc(this.money(i.valuation_rate))}</i></span>
                </div>`;
            });
            body += `</div>`;
        }
        return this.card(this.t("Pricing Alerts"), "alert", "red", body, "pricing");
    }

    notificationCard(nt) {
        const recent = nt.recent || [];
        let body = "";
        if (!recent.length) {
            body = this.emptyState("bell", "orange", this.t("All caught up"), this.t("You have no new notifications right now."), this.t("Open Notifications"), "notifications");
        } else {
            body = `<div class="nx-list-body nx-list-sm">`;
            recent.slice(0, 6).forEach((n) => {
                const dt = String(n.creation || "").slice(0, 16).replace("T", " ");
                body += `<div class="nx-notify ${n.read ? "is-read" : ""}" data-click="notifications">
                    <span class="nx-notify-dot ${n.read ? "" : "is-unread"}"></span>
                    <span class="nx-notify-body"><b>${this.esc(n.subject)}</b><i>${this.esc(dt)}</i></span>
                </div>`;
            });
            body += `</div>`;
        }
        const badge = nt.unread ? `<span class="nx-badge nx-badge-red">${this.num(nt.unread, 0)}</span>` : "";
        return this.card(this.t("Notification Center"), "bell", "orange", body, "notifications", badge);
    }

    // ---------------------------------------------------------------- barcode registry (client-side)
    bcRegistry() {
        if (!window.localStorage) return {};
        try { return JSON.parse(window.localStorage.getItem("nx-bc-registry")) || {}; } catch (e) { return {}; }
    }
    setBcRegistry(map) {
        if (window.localStorage) window.localStorage.setItem("nx-bc-registry", JSON.stringify(map || {}));
    }
    itemBarcode(code) {
        if (!code) return "";
        const r = this.bcRegistry();
        return r[code] || "";
    }
    setItemBarcode(code, val) {
        if (!code) return;
        const r = this.bcRegistry();
        if (val && String(val).trim()) r[code] = String(val).trim();
        else delete r[code];
        this.setBcRegistry(r);
    }
    bcSettings() {
        const d = { type: "Code128", size: 256, lw: 50, lh: 30, font: 12, quiet: 10, textOn: true, printer: "", sheet: "2 × 1 in (50×25 mm)", autoAssign: false, prefix: "NEXORA-" };
        if (!window.localStorage) return d;
        try { return Object.assign({}, d, JSON.parse(window.localStorage.getItem("nx-bc-settings")) || {}); } catch (e) { return d; }
    }
    setBcSettings(s) {
        if (window.localStorage) window.localStorage.setItem("nx-bc-settings", JSON.stringify(s || {}));
    }
    applyBcSettingsToStudio() {
        const root = this.root;
        if (!root || !root.querySelector(".nx-bc-value")) return;
        const set = this.bcSettings();
        const setVal = (sel, val) => { const el = root.querySelector(sel); if (el && val !== undefined && val !== null) el.value = val; };
        setVal(".nx-bc-type", set.type);
        setVal(".nx-bc-size", String(set.size));
        setVal(".nx-bc-lw", set.lw);
        setVal(".nx-bc-lh", set.lh);
        setVal(".nx-bc-font", set.font);
        setVal(".nx-bc-quiet", set.quiet);
        setVal(".nx-bc-text-toggle", set.textOn ? "on" : "");
        setVal(".nx-bc-printer", set.printer);
        setVal(".nx-bc-sheet", set.sheet);
    }
    bcSearchItems(q) {
        return new Promise((resolve) => {
            const query = (q || "").trim();
            if (query.length < 1) return resolve([]);
            frappe.call({
                method: "nexora.nexora_dashboard.api.dashboard.item_search",
                args: { q: query, limit: 12 },
                callback: (r) => resolve((r && r.message && r.message.items) || []),
                error: () => resolve([])
            });
        });
    }
    loadBcData() {
        const self = this;
        if (this._bcDataPromise && Date.now() - (this._bcDataAt || 0) < 30000) return this._bcDataPromise;
        this._bcDataPromise = new Promise((resolve) => {
            frappe.call({
                method: "nexora.nexora_dashboard.api.dashboard.barcode_studio",
                args: { company: this.state.company || undefined },
                callback: (r) => { self._bcDataAt = Date.now(); resolve((r && r.message) || null); },
                error: () => resolve(null)
            });
        });
        return this._bcDataPromise;
    }
    bcLoadItem(item) {
        if (!item) return;
        const root = this.root;
        const code = item.name || item.item_code || "";
        const reg = this.itemBarcode(code);
        const val = item.barcode || reg || code;
        const itemInput = root.querySelector(".nx-bc-item");
        const valueInput = root.querySelector(".nx-bc-value");
        if (itemInput) { itemInput.value = code; itemInput.title = code; }
        if (valueInput) valueInput.value = val;
        this._bcItem = { name: code, item_name: item.item_name || code, uom: item.stock_uom || item.uom || "", qty: item.qty || 1, stock_qty: item.stock_qty, price: item.price };
        const meta = root.querySelector(".nx-bc-item-meta");
        if (meta) {
            meta.hidden = false;
            const price = item.price && item.price.rate ? this.money(item.price.rate) : "—";
            const stock = item.stock_qty !== undefined && item.stock_qty !== null ? this.num(item.stock_qty, 0) + " " + this.esc(item.stock_uom || item.uom || "") : "";
            meta.innerHTML = `<span class="nx-badge nx-badge-purple">${this.esc(code)}</span><span class="nx-bc-item-name">${this.esc(item.item_name || code)}</span>
                <span class="nx-bc-item-sub">${stock ? this.esc(this.t("Stock") + ": ") + stock + " · " : ""}${this.esc(this.t("Price") + ": ")}${price}</span>`;
        }
        const qty = root.querySelector(".nx-bc-qty");
        if (qty && item.qty) qty.value = item.qty;
        this.generateBarcode();
    }
    goToPrint(item) {
        this.state.bcPage = "print";
        this.state.bcLoadCode = (item && (item.name || item.item_code)) || "";
        this.renderBarcode();
    }
    promptAssignBarcode(code, name) {
        const self = this;
        const cur = this.itemBarcode(code) || "";
        this.showDialog({
            title: this.t("Assign Barcode") + " · " + (name || code),
            width: 430,
            body: `<div class="nx-form">
                <div class="nx-field"><label class="nx-field-label">${this.t("Item Code")}</label><input class="nx-input" type="text" value="${this.esc(code)}" disabled /></div>
                <div class="nx-field"><label class="nx-field-label">${this.t("Barcode Value")}</label><input class="nx-input nx-dlg-bcval" type="text" value="${this.esc(cur)}" spellcheck="false" placeholder="e.g. 6291234567890" /></div>
                <div class="nx-field-hint">${this.esc(this.t("Stored in your local barcode registry — ERPNext items are not modified."))}</div>
            </div>`,
            actions: [
                { label: this.t("Cancel"), variant: "secondary", click: (d) => d.close() },
                { label: this.t("Save Barcode"), variant: "primary", primary: true, click: (d) => {
                    const v = (d.el.querySelector(".nx-dlg-bcval").value || "").trim();
                    if (!v) { d.el.querySelector(".nx-dlg-bcval").classList.add("is-invalid"); return; }
                    self.setItemBarcode(code, v);
                    d.close();
                    if (frappe.show_alert) frappe.show_alert({ message: self.t("Barcode assigned"), indicator: "green" });
                    self.renderBcPage();
                } }
            ]
        });
    }

    // ---------------------------------------------------------------- barcode dashboard
    bcSkel() {
        return `<div class="nx-card nx-skel-card" style="min-height:118px"><div class="nx-skeleton"></div><div class="nx-skeleton nx-skel-block"></div></div>`;
    }
    bcKpi(label, value, icon, color, sub, page) {
        return `<div class="nx-card nx-kpi nx-kpi-${color}" ${page ? `data-bcpage="${page}"` : ""}>
            <div class="nx-kpi-top"><span class="nx-card-ic nx-ic-${color}">${this.ic(icon, 18)}</span>
            ${page ? `<span class="nx-badge nx-badge-${color}">${this.t("Open")}</span>` : ""}</div>
            <div class="nx-kpi-value">${this.esc(value)}</div>
            <div class="nx-kpi-label">${this.esc(label)}</div>
            ${sub ? `<div class="nx-kpi-sub">${sub}</div>` : ""}
        </div>`;
    }
    renderBcDashboard() {
        const body = this.bcBody();
        if (!body) return;
        body.innerHTML = `<div class="nx-bc-dash">
            <div class="nx-kpi-row" data-bc-kpis>
                <div class="nx-card nx-skel-card" style="min-height:118px"><div class="nx-skeleton"></div><div class="nx-skeleton nx-skel-block"></div></div>
                <div class="nx-card nx-skel-card" style="min-height:118px"><div class="nx-skeleton"></div><div class="nx-skeleton nx-skel-block"></div></div>
                <div class="nx-card nx-skel-card" style="min-height:118px"><div class="nx-skeleton"></div><div class="nx-skeleton nx-skel-block"></div></div>
            </div>
            <div class="nx-bc-dash-grid">
                <div class="nx-card"><div class="nx-card-head"><span class="nx-card-ic nx-ic-purple">${this.ic("zap", 15)}</span><span class="nx-card-title">${this.t("Quick Actions")}</span></div><div class="nx-bc-actions-grid" data-bc-actions></div></div>
                <div class="nx-card"><div class="nx-card-head"><span class="nx-card-ic nx-ic-teal">${this.ic("alert", 15)}</span><span class="nx-card-title">${this.t("Next Steps")}</span></div><div class="nx-bc-steps" data-bc-steps></div></div>
            </div>
        </div>`;
        this.loadBcData().then((d) => this.renderBcDashboardHtml(d));
    }
    renderBcDashboardHtml(d) {
        const wrap = this.root.querySelector("[data-bc-kpis]");
        if (!wrap) return;
        const items = (d && d.items) || [];
        const k = (d && d.kpis) || {};
        const total = k.total_items || items.length;
        const withBc = items.filter((i) => this.itemBarcode(i.name)).length;
        const without = Math.max(0, total - withBc);
        const pr = k.pending_receipts || 0;
        const pi = k.pending_invoices || 0;
        const labels = this.bcHistory().length;
        const templates = this.templateList().length;
        wrap.innerHTML =
            this.bcKpi(this.t("Total Items"), this.num(total, 0), "box", "blue", this.t("catalog items tracked"), "browser") +
            this.bcKpi(this.t("Items With Barcode"), this.num(withBc, 0), "star", "green", this.t("assigned in your registry"), "generated") +
            this.bcKpi(this.t("Items Without Barcode"), this.num(without, 0), "alert", "red", this.t("need a barcode assigned"), "nobc") +
            this.bcKpi(this.t("PR Pending Barcode"), this.num(pr, 0), "incoming", "orange", this.t("receipt lines to label"), "pr") +
            this.bcKpi(this.t("PI Pending Barcode"), this.num(pi, 0), "outgoing", "orange", this.t("invoice lines to label"), "pi") +
            this.bcKpi(this.t("Labels Printed"), this.num(labels, 0), "print", "purple", this.num(templates, 0) + " " + this.t("templates ready"), "history");
        const actions = this.root.querySelector("[data-bc-actions]");
        if (actions) {
            actions.innerHTML = [
                ["print", "barcode", "purple", "Print Studio", "Print Studio", "Generate a label for any item"],
                ["browser", "search", "teal", "Item Browser", "Browse items", "Search by code, name or barcode"],
                ["nobc", "alert", "red", "Items Without Barcode", "Fix coverage", "Assign barcodes to missing items"],
                ["templates", "grid", "purple", "Label Templates", "Templates", "Manage reusable label templates"],
                ["batch", "box", "indigo", "Batch Printing", "Batch", "Print many labels at once"],
                ["scanner", "zap", "blue", "Barcode Scanner", "Scanner", "Scan or look up any barcode"]
            ].map((a) => `<button class="nx-bc-action" data-bcpage="${a[0]}">
                <span class="nx-bc-tab-ic nx-ic-${a[2]}">${this.ic(a[1], 16)}</span>
                <span class="nx-bc-action-txt"><b>${this.t(a[3])}</b><i>${this.t(a[5])}</i></span>
                <span class="nx-bc-action-go">${this.ic("arrow-right", 14)}</span>
            </button>`).join("");
        }
        const steps = this.root.querySelector("[data-bc-steps]");
        if (steps) {
            const rows = [];
            if (without > 0) rows.push(["nobc", "red", this.t("Assign barcodes to") + " " + this.num(without, 0) + " " + this.t("items"), "alert"]);
            if (pr > 0) rows.push(["pr", "orange", this.t("Label") + " " + this.num(pr, 0) + " " + this.t("purchase receipt lines"), "incoming"]);
            if (pi > 0) rows.push(["pi", "orange", this.t("Label") + " " + this.num(pi, 0) + " " + this.t("purchase invoice lines"), "outgoing"]);
            if (!rows.length) rows.push(["print", "green", this.t("All items have barcodes — generate new labels anytime."), "star"]);
            steps.innerHTML = rows.map((r) => `<div class="nx-bc-step" data-bcpage="${r[0]}">
                <span class="nx-dot nx-dot-${r[1]}"></span><span>${this.esc(r[2])}</span><span class="nx-bc-step-go">${this.ic("arrow-right", 13)}</span>
            </div>`).join("");
        }
    }

    // ---------------------------------------------------------------- item browser
    renderBcBrowser() {
        const body = this.bcBody();
        if (!body) return;
        let html = `<div class="nx-bc-toolbar">
            <div class="nx-bc-search"><span class="nx-search-ic">${this.ic("search")}</span>
                <input class="nx-input nx-bc-browse" type="text" autocomplete="off" spellcheck="false" placeholder="${this.esc(this.t("Search by item code, name or barcode…"))}" /></div>
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Live item registry — ERPNext items with price, stock and assigned barcodes."))}</span>
        </div>
        <div class="nx-card">
            <div class="nx-card-head">
                <span class="nx-card-ic nx-ic-teal">${this.ic("search", 15)}</span>
                <span class="nx-card-title">${this.t("Item Browser")}</span>
                <span class="nx-badge nx-badge-teal" data-browse-count>0</span>
            </div>
            <div class="nx-bc-table-wrap" data-browse-results>${this.bcSkel()}</div>
        </div>`;
        body.innerHTML = html;
        const input = body.querySelector(".nx-bc-browse");
        const self = this;
        const run = () => {
            const q = input.value.trim();
            if (q.length < 2) { self.bcBrowseShow(this._bcBrowseAll || [], q); return; }
            self.bcSearchItems(q).then((items) => self.bcBrowseShow(items, q));
        };
        input.addEventListener("input", () => { clearTimeout(this._bcBrowseT); this._bcBrowseT = setTimeout(run, 220); });
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); this.bcBrowseMove(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); this.bcBrowseMove(-1); }
            else if (e.key === "Enter") { e.preventDefault(); this.bcBrowseOpenSelected(); }
        });
        this.loadBcData().then((d) => {
            this._bcBrowseAll = (d && d.items) || [];
            this.bcBrowseShow(this._bcBrowseAll, "");
        });
    }
    bcBrowseShow(items, q) {
        this._bcBrowseItems = items || [];
        this._bcBrowseSel = 0;
        const wrap = this.root.querySelector("[data-browse-results]");
        const count = this.root.querySelector("[data-browse-count]");
        if (count) count.textContent = this.num(this._bcBrowseItems.length, 0);
        if (!wrap) return;
        if (!this._bcBrowseItems.length) {
            wrap.innerHTML = this.emptyState("search", "teal", this.t("No items found"), this.t("Try a different code, name or barcode."));
            return;
        }
        let rows = `<table class="nx-table"><thead><tr>
            <th>${this.t("Item Code")}</th><th>${this.t("Item Name")}</th><th>${this.t("Barcode")}</th><th>${this.t("UOM")}</th>
            <th>${this.t("Stock")}</th><th>${this.t("Price")}</th><th>${this.t("Actions")}</th>
        </tr></thead><tbody>`;
        this._bcBrowseItems.forEach((it, i) => {
            const bc = this.itemBarcode(it.name);
            rows += `<tr data-browse-row="${i}" class="${i === this._bcBrowseSel ? "is-selected" : ""}">
                <td class="nx-td-main">${this.esc(it.name)}</td>
                <td>${this.esc(it.item_name || it.name)}</td>
                <td>${bc ? `<span class="nx-badge nx-badge-green">${this.esc(bc)}</span>` : `<span class="nx-badge nx-badge-muted">${this.t("none")}</span>`}</td>
                <td>${this.esc(it.stock_uom || it.uom || "")}</td>
                <td>${it.stock_qty !== undefined && it.stock_qty !== null ? this.num(it.stock_qty, 0) : "—"}</td>
                <td>${it.price && it.price.rate ? this.esc(this.money(it.price.rate)) : "—"}</td>
                <td class="nx-bc-row-actions">
                    <button class="nx-btn nx-btn-sm nx-btn-primary" data-bcbrowse="load" data-bi="${i}">${this.t("Label")}</button>
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-bcbrowse="assign" data-bi="${i}">${this.t("Assign")}</button>
                </td>
            </tr>`;
        });
        rows += `</tbody></table>`;
        wrap.innerHTML = rows;
        const self = this;
        if (!wrap.__nxBrowseBound) {
            wrap.__nxBrowseBound = true;
            wrap.addEventListener("click", (e) => {
                const act = e.target.closest("[data-bcbrowse]");
                if (!act) return;
                const it = self._bcBrowseItems[parseInt(act.getAttribute("data-bi"), 10)];
                if (!it) return;
                if (act.getAttribute("data-bcbrowse") === "assign") self.promptAssignBarcode(it.name, it.item_name);
                else self.goToPrint(it);
            });
        }
    }
    bcBrowseMove(dir) {
        if (!this._bcBrowseItems || !this._bcBrowseItems.length) return;
        this._bcBrowseSel = (this._bcBrowseSel + dir + this._bcBrowseItems.length) % this._bcBrowseItems.length;
        const wrap = this.root.querySelector("[data-browse-results]");
        if (!wrap) return;
        wrap.querySelectorAll("[data-browse-row]").forEach((el, i) => el.classList.toggle("is-selected", i === this._bcBrowseSel));
        const sel = wrap.querySelector(`[data-browse-row="${this._bcBrowseSel}"]`);
        if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
    }
    bcBrowseOpenSelected() {
        const it = this._bcBrowseItems && this._bcBrowseItems[this._bcBrowseSel];
        if (it) this.goToPrint(it);
    }

    // ---------------------------------------------------------------- items without barcode
    renderBcNoBarcode() {
        const body = this.bcBody();
        if (!body) return;
        body.innerHTML = `<div class="nx-card">
            <div class="nx-card-head"><span class="nx-card-ic nx-ic-red">${this.ic("alert", 15)}</span>
            <span class="nx-card-title">${this.t("Items Without Barcode")}</span>
            <span class="nx-badge nx-badge-red" data-nobc-count>0</span></div>
            <div class="nx-bc-toolbar-inline">
                <div class="nx-bc-search"><span class="nx-search-ic">${this.ic("search")}</span>
                <input class="nx-input nx-bc-browse" type="text" autocomplete="off" spellcheck="false" placeholder="${this.esc(this.t("Filter items…"))}" /></div>
                <span class="nx-bc-toolbar-note">${this.esc(this.t("Items without an assigned barcode in your local registry."))}</span>
            </div>
            <div class="nx-bc-table-wrap" data-nobc-results>${this.bcSkel()}</div>
        </div>`;
        this.loadBcData().then((d) => {
            const all = (d && d.items) || [];
            const without = all.filter((i) => !this.itemBarcode(i.name));
            this._bcNobc = without;
            this.bcNobcShow(without, "");
        });
        const input = body.querySelector(".nx-bc-browse");
        if (input) {
            input.addEventListener("input", () => {
                clearTimeout(this._bcNobcT);
                this._bcNobcT = setTimeout(() => {
                    const q = input.value.trim().toLowerCase();
                    const list = (this._bcNobc || []).filter((i) => (i.name || "").toLowerCase().indexOf(q) >= 0 || (i.item_name || "").toLowerCase().indexOf(q) >= 0);
                    this.bcNobcShow(list, q);
                }, 180);
            });
        }
    }
    bcNobcShow(items, q) {
        const wrap = this.root.querySelector("[data-nobc-results]");
        const count = this.root.querySelector("[data-nobc-count]");
        if (count) count.textContent = this.num(items.length, 0);
        if (!wrap) return;
        if (!items.length) {
            wrap.innerHTML = this.emptyState("star", "green", this.t("All items have barcodes"), this.t("Great job — every catalog item has an assigned barcode."));
            return;
        }
        let rows = `<table class="nx-table"><thead><tr>
            <th>${this.t("Item Code")}</th><th>${this.t("Item Name")}</th><th>${this.t("UOM")}</th><th>${this.t("Stock")}</th><th>${this.t("Price")}</th><th>${this.t("Actions")}</th>
        </tr></thead><tbody>`;
        items.forEach((it) => {
            rows += `<tr>
                <td class="nx-td-main">${this.esc(it.name)}</td>
                <td>${this.esc(it.item_name || it.name)}</td>
                <td>${this.esc(it.stock_uom || it.uom || "")}</td>
                <td>${it.stock_qty !== undefined && it.stock_qty !== null ? this.num(it.stock_qty, 0) : "—"}</td>
                <td>${it.price && it.price.rate ? this.esc(this.money(it.price.rate)) : "—"}</td>
                <td class="nx-bc-row-actions">
                    <button class="nx-btn nx-btn-sm nx-btn-primary" data-nobc="assign" data-code="${this.esc(it.name)}" data-name="${this.esc(it.item_name || it.name)}">${this.t("Assign")}</button>
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-nobc="label" data-code="${this.esc(it.name)}" data-name="${this.esc(it.item_name || it.name)}">${this.t("Label")}</button>
                </td>
            </tr>`;
        });
        rows += `</tbody></table>`;
        wrap.innerHTML = rows;
        if (!wrap.__nxNobcBound) {
            wrap.__nxNobcBound = true;
            wrap.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-nobc]");
                if (!btn) return;
                const code = btn.getAttribute("data-code");
                const name = btn.getAttribute("data-name");
                if (btn.getAttribute("data-nobc") === "assign") this.promptAssignBarcode(code, name);
                else this.goToPrint({ name: code, item_name: name });
            });
        }
    }

    // ---------------------------------------------------------------- purchase pending (PR / PI)
    renderBcPending() {
        const isPr = this.state.bcPage === "pr";
        const title = isPr ? "Purchase Receipts Pending Barcode" : "Purchase Invoices Pending Barcode";
        const icon = isPr ? "incoming" : "outgoing";
        const body = this.bcBody();
        if (!body) return;
        body.innerHTML = `<div class="nx-card">
            <div class="nx-card-head"><span class="nx-card-ic nx-ic-orange">${this.ic(icon, 15)}</span>
            <span class="nx-card-title">${this.t(title)}</span>
            <span class="nx-badge nx-badge-orange" data-pend-count>0</span></div>
            <div class="nx-bc-toolbar-inline">
                <div class="nx-bc-search"><span class="nx-search-ic">${this.ic("search")}</span>
                <input class="nx-input nx-bc-browse" type="text" autocomplete="off" spellcheck="false" placeholder="${this.esc(this.t("Filter by document or item…"))}" /></div>
                <span class="nx-bc-toolbar-note">${this.esc(this.t(isPr ? "Posted purchase receipts whose lines need labels." : "Posted purchase invoices whose lines need labels."))}</span>
            </div>
            <div class="nx-bc-table-wrap" data-pend-results>${this.bcSkel()}</div>
        </div>`;
        this.loadBcData().then((d) => {
            const rows = (d && (isPr ? d.pending_receipts : d.pending_invoices)) || [];
            this._bcPend = rows;
            this.bcPendShow(rows, "");
        });
        const input = body.querySelector(".nx-bc-browse");
        if (input) {
            input.addEventListener("input", () => {
                clearTimeout(this._bcPendT);
                this._bcPendT = setTimeout(() => {
                    const q = input.value.trim().toLowerCase();
                    const list = (this._bcPend || []).filter((r) => (r.docname || "").toLowerCase().indexOf(q) >= 0 || (r.item_code || "").toLowerCase().indexOf(q) >= 0 || (r.item_name || "").toLowerCase().indexOf(q) >= 0);
                    this.bcPendShow(list, q);
                }, 180);
            });
        }
    }
    bcPendShow(rows, q) {
        const wrap = this.root.querySelector("[data-pend-results]");
        const count = this.root.querySelector("[data-pend-count]");
        if (count) count.textContent = this.num(rows.length, 0);
        if (!wrap) return;
        if (!rows.length) {
            wrap.innerHTML = this.emptyState("star", "green", this.t("Nothing pending"), this.t("Every purchase line already has a label assigned."));
            return;
        }
        let html = `<table class="nx-table"><thead><tr>
            <th>${this.t("Document")}</th><th>${this.t("Date")}</th><th>${this.t("Supplier")}</th><th>${this.t("Item Code")}</th>
            <th>${this.t("Item Name")}</th><th>${this.t("Qty")}</th><th>${this.t("Barcode")}</th><th>${this.t("Actions")}</th>
        </tr></thead><tbody>`;
        rows.forEach((r) => {
            const bc = this.itemBarcode(r.item_code);
            html += `<tr>
                <td class="nx-td-main">${this.esc(r.docname)}</td>
                <td>${this.esc(String(r.date || "").slice(0, 10))}</td>
                <td>${this.esc(r.supplier || "")}</td>
                <td>${this.esc(r.item_code)}</td>
                <td>${this.esc(r.item_name || r.item_code)}</td>
                <td>${this.num(r.qty, 0)} ${this.esc(r.uom || "")}</td>
                <td>${bc ? `<span class="nx-badge nx-badge-green">${this.esc(bc)}</span>` : `<span class="nx-badge nx-badge-muted">${this.t("none")}</span>`}</td>
                <td class="nx-bc-row-actions">
                    ${bc ? `<button class="nx-btn nx-btn-sm nx-btn-primary" data-pend="label" data-code="${this.esc(r.item_code)}" data-name="${this.esc(r.item_name)}">${this.t("Label")}</button>` :
                          `<button class="nx-btn nx-btn-sm nx-btn-secondary" data-pend="assign" data-code="${this.esc(r.item_code)}" data-name="${this.esc(r.item_name)}">${this.t("Assign")}</button>`}
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
        wrap.innerHTML = html;
        if (!wrap.__nxPendBound) {
            wrap.__nxPendBound = true;
            wrap.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-pend]");
                if (!btn) return;
                const code = btn.getAttribute("data-code");
                const name = btn.getAttribute("data-name");
                if (btn.getAttribute("data-pend") === "assign") this.promptAssignBarcode(code, name);
                else this.goToPrint({ name: code, item_name: name });
            });
        }
    }

    // ---------------------------------------------------------------- generated barcodes
    renderBcGenerated() {
        const body = this.bcBody();
        if (!body) return;
        body.innerHTML = `<div class="nx-card">
            <div class="nx-card-head"><span class="nx-card-ic nx-ic-green">${this.ic("star", 15)}</span>
            <span class="nx-card-title">${this.t("Generated Barcodes")}</span>
            <span class="nx-badge nx-badge-green" data-gen-count>0</span></div>
            <div class="nx-bc-toolbar-inline">
                <div class="nx-bc-search"><span class="nx-search-ic">${this.ic("search")}</span>
                <input class="nx-input nx-bc-browse" type="text" autocomplete="off" spellcheck="false" placeholder="${this.esc(this.t("Filter barcodes…"))}" /></div>
                <span class="nx-bc-toolbar-note">${this.esc(this.t("Barcodes assigned in your local registry, merged with recent label runs."))}</span>
            </div>
            <div class="nx-bc-table-wrap" data-gen-results></div>
        </div>`;
        this.loadBcData().then((d) => {
            const items = (d && d.items) || [];
            const reg = this.bcRegistry();
            const names = {};
            items.forEach((i) => { names[i.name] = i.item_name || i.name; });
            const list = Object.keys(reg).map((code) => ({
                code, barcode: reg[code], name: names[code] || code
            }));
            this._bcGen = list;
            this.bcGenShow(list, "");
        });
        const input = body.querySelector(".nx-bc-browse");
        if (input) {
            input.addEventListener("input", () => {
                clearTimeout(this._bcGenT);
                this._bcGenT = setTimeout(() => {
                    const q = input.value.trim().toLowerCase();
                    const list = (this._bcGen || []).filter((r) => (r.code || "").toLowerCase().indexOf(q) >= 0 || (r.barcode || "").toLowerCase().indexOf(q) >= 0 || (r.name || "").toLowerCase().indexOf(q) >= 0);
                    this.bcGenShow(list, q);
                }, 180);
            });
        }
    }
    bcGenShow(list, q) {
        const wrap = this.root.querySelector("[data-gen-results]");
        const count = this.root.querySelector("[data-gen-count]");
        if (count) count.textContent = this.num(list.length, 0);
        if (!wrap) return;
        if (!list.length) {
            wrap.innerHTML = this.emptyState("barcode", "green", this.t("No barcodes assigned"), this.t("Assign barcodes from the Item Browser or Items Without Barcode pages."));
            return;
        }
        let html = `<table class="nx-table"><thead><tr>
            <th>${this.t("Barcode")}</th><th>${this.t("Item Code")}</th><th>${this.t("Item Name")}</th><th>${this.t("Actions")}</th>
        </tr></thead><tbody>`;
        list.forEach((r) => {
            html += `<tr>
                <td><span class="nx-badge nx-badge-green" style="font-size:11px;font-family:monospace">${this.esc(r.barcode)}</span></td>
                <td class="nx-td-main">${this.esc(r.code)}</td>
                <td>${this.esc(r.name)}</td>
                <td class="nx-bc-row-actions">
                    <button class="nx-btn nx-btn-sm nx-btn-primary" data-gen="print" data-code="${this.esc(r.code)}">${this.t("Print Label")}</button>
                    <button class="nx-btn nx-btn-sm nx-btn-secondary" data-gen="unassign" data-code="${this.esc(r.code)}">${this.t("Remove")}</button>
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
        wrap.innerHTML = html;
        if (!wrap.__nxGenBound) {
            wrap.__nxGenBound = true;
            wrap.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-gen]");
                if (!btn) return;
                const code = btn.getAttribute("data-code");
                if (btn.getAttribute("data-gen") === "unassign") {
                    this.setItemBarcode(code, "");
                    if (frappe.show_alert) frappe.show_alert({ message: this.t("Barcode removed"), indicator: "orange" });
                    this.renderBcPage();
                } else {
                    this.goToPrint({ name: code });
                }
            });
        }
    }

    // ---------------------------------------------------------------- label templates page
    renderBcTemplatesPage() {
        const body = this.bcBody();
        if (!body) return;
        const list = this.templateList();
        const card = (t) => `<div class="nx-tpl-card" data-tpl="${t.id}">
            <div class="nx-tpl-top"><span class="nx-tpl-ic nx-ic-purple">${this.ic(t.opts && t.opts.type === "QR Code" ? "grid" : "barcode", 16)}</span>
            <button class="nx-tpl-fav" data-bctplfav="${t.id}" title="${this.t("Favorite")}">${this.ic("star", 14)}</button></div>
            <div class="nx-tpl-name">${this.esc(t.name)}</div>
            <div class="nx-tpl-meta">${this.esc((t.opts && t.opts.type) || "Code128")}${t.preset ? " · " + this.t("Preset") : ""}</div>
            <div class="nx-tpl-actions">
                <button class="nx-btn nx-btn-sm nx-btn-primary" data-bctplapply="${t.id}">${this.t("Apply")}</button>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-bctpldup="${t.id}">${this.t("Duplicate")}</button>
                <button class="nx-btn nx-btn-sm nx-btn-secondary" data-bctplexport="${t.id}">${this.t("Export")}</button>
                ${t.preset ? "" : `<button class="nx-btn nx-btn-sm nx-btn-danger" data-bctpldel="${t.id}">${this.t("Delete")}</button>`}
            </div>
        </div>`;
        let html = `<div class="nx-bc-toolbar">
            <div class="nx-bc-tpl-actions">
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-bctplsave>${this.ic("tag", 14)} ${this.t("Save current as template")}</button>
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-bctplpresets>${this.ic("star", 14)} ${this.t("Presets")}</button>
            </div>
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Reusable label templates for one-click printing."))}</span>
        </div>
        <div class="nx-tpl-grid">${list.map(card).join("") || `<div class="nx-tray-empty">${this.t("No templates yet")}</div>`}</div>`;
        body.innerHTML = html;
        if (!body.__nxTplBound) {
            body.__nxTplBound = true;
            body.addEventListener("click", (e) => {
                const self = this;
                const apply = e.target.closest("[data-bctplapply]");
                if (apply) { const t = self.templateList().find((x) => x.id === apply.getAttribute("data-bctplapply")); if (t) { self.state.bcPage = "print"; self.state.bcTplToApply = t.id; self.renderBarcode(); } return; }
                const dup = e.target.closest("[data-bctpldup]");
                if (dup) {
                    const t = self.templateList().find((x) => x.id === dup.getAttribute("data-bctpldup"));
                    if (t) { const l = self.bcTemplates(); l.unshift(Object.assign({}, t, { id: "nx-tpl-" + Date.now().toString(36), name: t.name + " (copy)", preset: false })); self.setBcTemplates(l); self.renderBcTemplatesPage(); }
                    return;
                }
                const del = e.target.closest("[data-bctpldel]");
                if (del) {
                    const l = self.bcTemplates().filter((x) => x.id !== del.getAttribute("data-bctpldel"));
                    self.setBcTemplates(l);
                    self.renderBcTemplatesPage();
                    return;
                }
                const fav = e.target.closest("[data-bctplfav]");
                if (fav) {
                    const id = fav.getAttribute("data-bctplfav");
                    const l = self.bcTemplates().map((x) => x.id === id ? Object.assign({}, x, { fav: !x.fav }) : x);
                    self.setBcTemplates(l);
                    self.renderBcTemplatesPage();
                    return;
                }
                const ex = e.target.closest("[data-bctplexport]");
                if (ex) {
                    const t = self.templateList().find((x) => x.id === ex.getAttribute("data-bctplexport"));
                    if (t) self.exportTemplates([t]);
                    return;
                }
                const save = e.target.closest("[data-bctplsave]");
                if (save) { self.saveTemplatePrompt(); return; }
                const presets = e.target.closest("[data-bctplpresets]");
                if (presets) { self.openTemplateDialog(true); return; }
            });
        }
    }

    // ---------------------------------------------------------------- batch printing
    renderBcBatch() {
        const body = this.bcBody();
        if (!body) return;
        let html = `<div class="nx-bc-toolbar">
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Generate a sequential batch of labels in one click."))}</span>
        </div>
        <div class="nx-bc-wrap nx-bc-wrap-batch">
            <div class="nx-bc-left nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-indigo">${this.ic("box", 14)}</span><span>${this.t("Batch Configuration")}</span></div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Base Value")}</label><input class="nx-input nx-bcb-value" type="text" spellcheck="false" value="NEXORA-B001" /></div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Symbology")}</label>
                    <select class="nx-select nx-bcb-type"><option>Code128</option><option>Code39</option><option>EAN13</option><option>EAN8</option><option>UPC</option><option>QR Code</option></select></div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Labels")}</label><input class="nx-input nx-bcb-count" type="number" min="2" max="50" value="5" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Start At")}</label><input class="nx-input nx-bcb-start" type="number" min="1" value="1" /></div>
                </div>
                <div class="nx-bc-actions">
                    <button class="nx-btn nx-btn-primary nx-bcb-gen">${this.ic("box", 14)} ${this.t("Generate Batch")}</button>
                </div>
                <div class="nx-bc-outrow">
                    <button class="nx-btn nx-btn-primary nx-bcb-print" disabled>${this.ic("print", 14)} ${this.t("Print")}</button>
                    <button class="nx-btn nx-bcb-svg" disabled>${this.t("SVG")}</button>
                </div>
            </div>
            <div class="nx-bc-center nx-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-indigo">${this.ic("box", 16)}</span><span class="nx-card-title">${this.t("Batch Preview")}</span></div>
                <div class="nx-bc-canvas nx-bcb-canvas"><div class="nx-bc-empty">${this.esc(this.t("Configure and press Generate Batch."))}</div></div>
            </div>
        </div>`;
        body.innerHTML = html;
        const self = this;
        const gen = () => {
            const value = (body.querySelector(".nx-bcb-value").value || "NEXORA-B001").trim();
            const type = body.querySelector(".nx-bcb-type").value;
            const count = Math.max(2, Math.min(50, parseInt(body.querySelector(".nx-bcb-count").value, 10) || 5));
            const start = Math.max(1, parseInt(body.querySelector(".nx-bcb-start").value, 10) || 1);
            const canvas = body.querySelector(".nx-bcb-canvas");
            const engine = this.barcodeEngine();
            if (!engine) {
                frappe.require("/assets/nexora/js/nexora_barcode_engine.js").then(() => self.generateBatchFrom(value, type, count, start, canvas));
                return;
            }
            this.generateBatchFrom(value, type, count, start, canvas);
        };
        body.querySelector(".nx-bcb-gen").addEventListener("click", gen);
        body.querySelector(".nx-bcb-print").addEventListener("click", () => this.printBatchFrom());
        body.querySelector(".nx-bcb-svg").addEventListener("click", () => this.downloadBatchSvg());
    }
    generateBatchFrom(value, type, count, start, canvas) {
        const s = this.bcSettings();
        const opts = Object.assign({}, s, { value: value, type: type, size: s.size || 256 });
        this._bcSvgs = [];
        const grid = document.createElement("div");
        grid.className = "nx-bc-batch-grid";
        for (let i = 0; i < count; i++) {
            const full = value + "-" + String(start + i).padStart(3, "0");
            try {
                const svg = this.decorateSvg(this.barcodeEngine().generate(type, full, { size: opts.size }), opts);
                svg.setAttribute("class", "nx-bc-svg-out");
                this._bcSvgs.push(svg);
                const cell = document.createElement("div");
                cell.className = "nx-bc-batch-cell";
                cell.appendChild(svg);
                cell.appendChild(Object.assign(document.createElement("span"), { textContent: full }));
                grid.appendChild(cell);
            } catch (e) {}
        }
        canvas.innerHTML = "";
        canvas.appendChild(grid);
        this._bcSvg = this._bcSvgs[0];
        this._bcBatchPrint = { type: type, size: opts.size, lw: opts.lw, lh: opts.lh, font: opts.font, textOn: opts.textOn, text: opts.text };
        const printBtn = this.root.querySelector(".nx-bcb-print");
        const svgBtn = this.root.querySelector(".nx-bcb-svg");
        if (printBtn) printBtn.disabled = false;
        if (svgBtn) svgBtn.disabled = false;
        this.pushBcHistory({ value: value, type: type, size: opts.size, count: count, ts: Date.now(), item: null });
    }
    printBatchFrom() {
        const svgs = this._bcSvgs || [];
        if (!svgs.length) return;
        const opts = this._bcBatchPrint || this.bcSettings();
        const lw = Math.max(20, opts.lw || 50);
        const lh = Math.max(15, opts.lh || 30);
        const engine = this.barcodeEngine();
        const toStr = engine && engine.toSVGString ? (s) => engine.toSVGString(s) : (s) => s.outerHTML;
        let inner = "";
        svgs.forEach((s) => { inner += `<div class="nx-plabel" style="width:${lw}mm;height:${lh}mm">${toStr(s)}</div>`; });
        this.openPrintWindow(`<!doctype html><html><head><meta charset="utf-8"/><title>Batch Labels</title><style>body{margin:0;padding:8mm;font-family:system-ui,sans-serif}.nx-plabel{display:inline-flex;align-items:center;justify-content:center;border:1px dashed #bbb;margin:2mm;page-break-inside:avoid;overflow:hidden}.nx-plabel svg{max-width:100%;max-height:100%}@media print{.nx-plabel{border:none}body{padding:0}}</style></head><body>${inner}</body></html>`);
        this.pushBcQueue({ values: svgs.map((s) => (s.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean), copies: 1, ts: Date.now() });
    }
    downloadBatchSvg() {
        if (this._bcSvg && this.barcodeEngine()) {
            try { this.barcodeEngine().downloadSVG(this._bcSvg, "nexora-batch.svg"); } catch (e) {}
        }
    }

    // ---------------------------------------------------------------- print history page
    renderBcHistory() {
        const body = this.bcBody();
        if (!body) return;
        const q = this.bcQueue();
        let html = `<div class="nx-bc-toolbar">
            <div class="nx-bc-tpl-actions">
                <button class="nx-btn nx-btn-secondary nx-btn-sm" data-bcclrh>${this.ic("trash", 14)} ${this.t("Clear history")}</button>
            </div>
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Every label run you generated and printed — ready to reprint."))}</span>
        </div>
        <div class="nx-bc-tray nx-card">
            <div class="nx-bc-tray-head">
                <button class="nx-tray-tab is-active" data-bctab="history">${this.ic("clock", 14)} ${this.t("Recent Labels")}</button>
                <button class="nx-tray-tab" data-bctab="queue">${this.ic("print", 14)} ${this.t("Print Queue")}<span class="nx-tray-count">${this.num(q.length, 0)}</span></button>
            </div>
            <div class="nx-bc-tray-body nx-bc-tray-body-lg" data-bctray-body></div>
        </div>`;
        body.innerHTML = html;
        body.querySelector("[data-bcclrh]").addEventListener("click", () => {
            this.setBcHistory([]);
            this.renderBcTray("history");
        });
        body.querySelectorAll(".nx-tray-tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                body.querySelectorAll(".nx-tray-tab").forEach((t) => t.classList.remove("is-active"));
                tab.classList.add("is-active");
                this.renderBcTray(tab.getAttribute("data-bctab"));
            });
        });
        this.renderBcTray("history");
    }

    // ---------------------------------------------------------------- barcode scanner
    renderBcScanner() {
        const body = this.bcBody();
        if (!body) return;
        const hasDetector = typeof window !== "undefined" && "BarcodeDetector" in window;
        let html = `<div class="nx-bc-toolbar">
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Scan a barcode with your camera, or type a barcode to look it up."))}</span>
        </div>
        <div class="nx-bc-wrap nx-bc-wrap-scanner">
            <div class="nx-bc-center nx-card nx-scanner-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-blue">${this.ic("zap", 16)}</span><span class="nx-card-title">${this.t("Camera Scanner")}</span>
                ${hasDetector ? `<button class="nx-btn nx-btn-sm nx-btn-primary" data-scan-start>${this.ic("zap", 13)} ${this.t("Start Camera")}</button>` : ""}</div>
                <div class="nx-scanner-stage">
                    <video class="nx-scanner-video" playsinline muted hidden></video>
                    <div class="nx-bc-empty nx-scanner-empty">${this.esc(this.t(hasDetector ? "Camera scanner ready — press Start Camera." : "Camera scanning is not supported in this browser. Use manual lookup below."))}</div>
                </div>
            </div>
            <div class="nx-bc-right nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-blue">${this.ic("search", 14)}</span><span>${this.t("Manual Lookup")}</span></div>
                <div class="nx-bc-field">
                    <label class="nx-field-label">${this.t("Barcode Value")}</label>
                    <input class="nx-input nx-scan-input" type="text" spellcheck="false" placeholder="${this.esc(this.t("Type or scan a barcode…"))}" />
                </div>
                <div class="nx-bc-actions"><button class="nx-btn nx-btn-primary nx-scan-go">${this.ic("search", 14)} ${this.t("Look Up")}</button></div>
                <div class="nx-bc-scan-result" data-scan-result></div>
            </div>
        </div>`;
        body.innerHTML = html;
        const input = body.querySelector(".nx-scan-input");
        const resultBox = body.querySelector("[data-scan-result]");
        const self = this;
        const doLookup = (val) => {
            val = (val || "").trim();
            if (!val) return;
            const reg = this.bcRegistry();
            const hit = Object.keys(reg).find((k) => reg[k] === val || k === val);
            const show = (item) => {
                if (!resultBox) return;
                if (!item) {
                    resultBox.innerHTML = `<div class="nx-tray-empty">${this.t("No item found for")} “${this.esc(val)}”</div>`;
                    return;
                }
                const code = item.name || item.item_code;
                const bc = this.itemBarcode(code) || val;
                resultBox.innerHTML = `<div class="nx-bc-result-card">
                    <div class="nx-bc-result-top"><span class="nx-badge nx-badge-green" style="font-family:monospace">${this.esc(bc)}</span>
                    <span class="nx-badge nx-badge-purple">${this.esc(code)}</span></div>
                    <div class="nx-bc-item-name" style="font-size:13px">${this.esc(item.item_name || item.name)}</div>
                    <div class="nx-bc-item-sub">${this.t("Stock")}: ${item.stock_qty !== undefined && item.stock_qty !== null ? this.num(item.stock_qty, 0) + " " + this.esc(item.stock_uom || "") : "—"} · ${this.t("Price")}: ${item.price && item.price.rate ? this.esc(this.money(item.price.rate)) : "—"}</div>
                    <div class="nx-bc-outrow"><button class="nx-btn nx-btn-sm nx-btn-primary" data-scanlabel>${this.t("Generate Label")}</button></div>
                </div>`;
                resultBox.querySelector("[data-scanlabel]").addEventListener("click", () => self.goToPrint(item));
            };
            if (hit) {
                this.bcSearchItems(hit).then((items) => show(items[0] || { name: hit, item_name: hit }));
            } else {
                this.bcSearchItems(val).then((items) => {
                    const match = items.find((i) => i.name === val || this.itemBarcode(i.name) === val) || items[0];
                    show(match || null);
                });
            }
        };
        body.querySelector(".nx-scan-go").addEventListener("click", () => doLookup(input.value));
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doLookup(input.value); } });
        const startBtn = body.querySelector("[data-scan-start]");
        if (startBtn && hasDetector) {
            startBtn.addEventListener("click", () => this.startScanner(body));
        }
    }
    startScanner(body) {
        const video = body.querySelector(".nx-scanner-video");
        const empty = body.querySelector(".nx-scanner-empty");
        if (!video) return;
        const self = this;
        if (this._scannerStream) {
            this.stopScanner();
            video.hidden = true;
            if (empty) empty.hidden = false;
            const btn = body.querySelector("[data-scan-start]");
            if (btn) btn.textContent = this.t("Start Camera");
            return;
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((stream) => {
                this._scannerStream = stream;
                video.srcObject = stream;
                video.hidden = false;
                if (empty) empty.hidden = true;
                const btn = body.querySelector("[data-scan-start]");
                if (btn) btn.textContent = this.t("Stop Camera");
                video.play();
                this._scanLoop = window.setInterval(() => {
                    try {
                        if (!window.BarcodeDetector) return;
                        const detector = new window.BarcodeDetector();
                        detector.detect(video).then((codes) => {
                            const first = codes && codes[0];
                            if (first && first.rawValue) {
                                const inp = body.querySelector(".nx-scan-input");
                                if (inp) inp.value = first.rawValue;
                                if (this._scanLastValue !== first.rawValue) {
                                    this._scanLastValue = first.rawValue;
                                    const go = body.querySelector(".nx-scan-go");
                                    if (go) go.click();
                                }
                            }
                        }).catch(() => {});
                    } catch (e) {}
                }, 1200);
            }).catch(() => {
                if (empty) { empty.hidden = false; empty.textContent = this.t("Camera permission denied or unavailable."); }
            });
        }
    }
    stopScanner() {
        if (this._scannerStream) {
            try { this._scannerStream.getTracks().forEach((t) => t.stop()); } catch (e) {}
            this._scannerStream = null;
        }
        if (this._scanLoop) { clearInterval(this._scanLoop); this._scanLoop = null; }
        this._scanLastValue = null;
    }

    // ---------------------------------------------------------------- import / export
    renderBcImport() {
        const body = this.bcBody();
        if (!body) return;
        const reg = this.bcRegistry();
        const regCount = Object.keys(reg).length;
        let html = `<div class="nx-bc-toolbar">
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Backup, restore and bulk-assign barcodes in your local registry."))}</span>
        </div>
        <div class="nx-bc-grid nx-bc-grid-2">
            <div class="nx-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-green">${this.ic("download", 15)}</span><span class="nx-card-title">${this.t("Export Registry")}</span></div>
                <div class="nx-card-body">
                    <p class="nx-muted">${this.esc(this.t("Download your assigned barcodes as JSON or CSV for backup or reuse."))}</p>
                    <div class="nx-bc-outrow">
                        <button class="nx-btn nx-btn-primary nx-imp-json">${this.ic("download", 14)} ${this.t("Export JSON")}</button>
                        <button class="nx-btn nx-btn-secondary nx-imp-csv">${this.ic("download", 14)} ${this.t("Export CSV")}</button>
                    </div>
                    <div class="nx-field-hint">${this.num(regCount, 0)} ${this.t("barcodes in registry")}</div>
                </div>
            </div>
            <div class="nx-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-purple">${this.ic("download", 15)}</span><span class="nx-card-title">${this.t("Import Registry")}</span></div>
                <div class="nx-card-body">
                    <p class="nx-muted">${this.esc(this.t("Import barcodes from a JSON file. Existing values are merged."))}</p>
                    <button class="nx-btn nx-btn-primary nx-imp-file">${this.ic("download", 14)} ${this.t("Choose JSON file")}</button>
                    <input type="file" accept=".json,application/json" class="nx-imp-input" hidden />
                </div>
            </div>
            <div class="nx-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-blue">${this.ic("box", 15)}</span><span class="nx-card-title">${this.t("Bulk Assign")}</span></div>
                <div class="nx-card-body">
                    <p class="nx-muted">${this.esc(this.t("Assign a barcode to every item that does not have one yet. Uses item code by default."))}</p>
                    <button class="nx-btn nx-btn-primary nx-imp-bulk">${this.ic("zap", 14)} ${this.t("Assign missing barcodes")}</button>
                </div>
            </div>
            <div class="nx-card">
                <div class="nx-card-head"><span class="nx-card-ic nx-ic-red">${this.ic("trash", 15)}</span><span class="nx-card-title">${this.t("Danger Zone")}</span></div>
                <div class="nx-card-body">
                    <p class="nx-muted">${this.esc(this.t("Clear the entire local barcode registry. This cannot be undone."))}</p>
                    <button class="nx-btn nx-btn-danger nx-imp-clear">${this.ic("trash", 14)} ${this.t("Clear registry")}</button>
                </div>
            </div>
        </div>`;
        body.innerHTML = html;
        const self = this;
        body.querySelector(".nx-imp-json").addEventListener("click", () => {
            const blob = new Blob([JSON.stringify(this.bcRegistry(), null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "nexora-barcode-registry.json";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        body.querySelector(".nx-imp-csv").addEventListener("click", () => {
            const reg2 = this.bcRegistry();
            const lines = ["item_code,barcode"];
            Object.keys(reg2).forEach((k) => lines.push("\"" + k + "\",\"" + reg2[k] + "\""));
            const blob = new Blob([lines.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "nexora-barcode-registry.csv";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        const fileInput = body.querySelector(".nx-imp-input");
        body.querySelector(".nx-imp-file").addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", () => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    const map = this.bcRegistry();
                    Object.keys(data).forEach((k) => { if (data[k]) map[k] = String(data[k]).trim(); });
                    this.setBcRegistry(map);
                    if (frappe.show_alert) frappe.show_alert({ message: this.t("Registry imported"), indicator: "green" });
                    this.renderBcImport();
                } catch (e) {
                    if (frappe.show_alert) frappe.show_alert({ message: this.t("Import failed"), indicator: "red" });
                }
            };
            reader.readAsText(fileInput.files[0]);
            fileInput.value = "";
        });
        body.querySelector(".nx-imp-bulk").addEventListener("click", () => {
            this.loadBcData().then((d) => {
                const items = (d && d.items) || [];
                let added = 0;
                items.forEach((i) => {
                    if (!this.itemBarcode(i.name)) { this.setItemBarcode(i.name, i.name); added++; }
                });
                if (frappe.show_alert) frappe.show_alert({ message: this.num(added, 0) + " " + this.t("barcodes assigned"), indicator: "green" });
                this.renderBcImport();
            });
        });
        body.querySelector(".nx-imp-clear").addEventListener("click", () => {
            this.showDialog({
                title: this.t("Clear registry"),
                width: 400,
                body: `<div class="nx-form"><p class="nx-muted">${this.esc(this.t("Remove all assigned barcodes from the local registry?"))}</p></div>`,
                actions: [
                    { label: this.t("Cancel"), variant: "secondary", click: (d) => d.close() },
                    { label: this.t("Clear registry"), variant: "danger", click: (d) => {
                        this.setBcRegistry({});
                        d.close();
                        if (frappe.show_alert) frappe.show_alert({ message: this.t("Registry cleared"), indicator: "orange" });
                        this.renderBcImport();
                    } }
                ]
            });
        });
    }

    // ---------------------------------------------------------------- barcode settings page
    renderBcSettingsPage() {
        const body = this.bcBody();
        if (!body) return;
        const s = this.bcSettings();
        const on = (v) => (v ? "checked" : "");
        let html = `<div class="nx-bc-toolbar">
            <div class="nx-bc-tpl-actions">
                <button class="nx-btn nx-btn-primary nx-btn-sm" data-bcsettingsave>${this.ic("tag", 14)} ${this.t("Save Settings")}</button>
            </div>
            <span class="nx-bc-toolbar-note">${this.esc(this.t("Defaults applied every time you open the Print Studio."))}</span>
        </div>
        <div class="nx-bc-wrap nx-bc-wrap-settings">
            <div class="nx-bc-left nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-gray">${this.ic("barcode", 14)}</span><span>${this.t("Barcode Defaults")}</span></div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Symbology")}</label>
                    <select class="nx-select nx-bcset-type">${["Code128","Code39","EAN13","EAN8","UPC","QR Code"].map((o) => `<option ${s.type === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Size (px)")}</label><input class="nx-input nx-bcset-size" type="number" min="80" max="720" value="${this.esc(s.size)}" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Font Size")}</label><input class="nx-input nx-bcset-font" type="number" min="8" max="40" value="${this.esc(s.font)}" /></div>
                </div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Quiet Zone")}</label><input class="nx-input nx-bcset-quiet" type="number" min="0" max="20" value="${this.esc(s.quiet)}" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Prefix")}</label><input class="nx-input nx-bcset-prefix" type="text" value="${this.esc(s.prefix || "NEXORA-")}" spellcheck="false" /></div>
                </div>
                <label class="nx-check"><input type="checkbox" class="nx-bcset-texton" ${on(s.textOn)} /> ${this.t("Show text below")}</label>
            </div>
            <div class="nx-bc-right nx-card">
                <div class="nx-panel-head"><span class="nx-panel-ic nx-ic-gray">${this.ic("print", 14)}</span><span>${this.t("Label & Printing")}</span></div>
                <div class="nx-bc-row">
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Width (mm)")}</label><input class="nx-input nx-bcset-lw" type="number" min="10" value="${this.esc(s.lw)}" /></div>
                    <div class="nx-bc-field"><label class="nx-field-label">${this.t("Height (mm)")}</label><input class="nx-input nx-bcset-lh" type="number" min="10" value="${this.esc(s.lh)}" /></div>
                </div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Printer")}</label><input class="nx-input nx-bcset-printer" type="text" value="${this.esc(s.printer || "")}" placeholder="${this.esc(this.t("Default printer…"))}" /></div>
                <div class="nx-bc-field"><label class="nx-field-label">${this.t("Label Sheet")}</label>
                    <select class="nx-select nx-bcset-sheet">
                        ${["1 × 1 in (25×25 mm)", "2 × 1 in (50×25 mm)", "4 × 2 in (100×50 mm)", "A4 Sheet"].map((o) => `<option ${s.sheet === o ? "selected" : ""}>${o}</option>`).join("")}
                    </select></div>
                <label class="nx-check"><input type="checkbox" class="nx-bcset-autoassign" ${on(s.autoAssign)} /> ${this.t("Auto-assign barcode when generating labels")}</label>
            </div>
        </div>`;
        body.innerHTML = html;
        body.querySelector("[data-bcsettingsave]").addEventListener("click", () => {
            const type = body.querySelector(".nx-bcset-type").value;
            const size = parseInt(body.querySelector(".nx-bcset-size").value, 10) || 256;
            const font = parseInt(body.querySelector(".nx-bcset-font").value, 10) || 12;
            const quiet = parseInt(body.querySelector(".nx-bcset-quiet").value, 10) || 10;
            const lw = parseInt(body.querySelector(".nx-bcset-lw").value, 10) || 50;
            const lh = parseInt(body.querySelector(".nx-bcset-lh").value, 10) || 30;
            const textOn = body.querySelector(".nx-bcset-texton").checked;
            const autoAssign = body.querySelector(".nx-bcset-autoassign").checked;
            this.setBcSettings({
                type: type, size: size, font: font, quiet: quiet, lw: lw, lh: lh, textOn: textOn, autoAssign: autoAssign,
                prefix: body.querySelector(".nx-bcset-prefix").value.trim() || "NEXORA-",
                printer: body.querySelector(".nx-bcset-printer").value.trim(),
                sheet: body.querySelector(".nx-bcset-sheet").value
            });
            if (frappe.show_alert) frappe.show_alert({ message: this.t("Settings saved"), indicator: "green" });
        });
    }

    setSyncTime() {
        const el = this.root && this.root.querySelector(".nx-sync-time");
        if (!el) return;
        el.textContent = this.t("Synced") + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
};
