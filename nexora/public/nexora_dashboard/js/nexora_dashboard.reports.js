/*
 * Nexora Dashboard — Reports Engine (M5).
 *
 * Native Nexora Reports Center. ERPNext acts ONLY as a JSON backend:
 *   get_report_catalog()                       -> categories + registry + companies
 *   run_report(key, filters)                   -> normalized payload
 *
 * Every pixel of the UI is Nexora-owned and rendered with Nexora components:
 *   - DataTable.mount (nexora_dashboard.datatable.js) for the data grid
 *   - ApexCharts (vendor/apexcharts.min.js) for charts
 *   - Nexora design system for the hub, filter panel, KPI cards and exports
 *
 * ERPNext report objects, Report View, Query Report, Report Builder and the
 * native datatable are NEVER created by this module.
 */
window.NexoraDashboard = window.NexoraDashboard || {};
window.NexoraDashboard.Reports = (function () {
    "use strict";

    var CATALOG_API = "nexora.nexora_dashboard.api.reports.get_report_catalog";
    var RUN_API = "nexora.nexora_dashboard.api.reports.run_report";
    var LS_KEY = "nexora.reports.v1";
    var ASSET_DT = "/assets/nexora/nexora_dashboard/js/nexora_dashboard.datatable.js";
    var ASSET_APEX = "/assets/nexora/nexora_dashboard/vendor/apexcharts.min.js";
    var RECENT_CAP = 12;

    var PALETTE = ["#4f6ef7", "#2f9e6e", "#e8793c", "#9c6cf2", "#ef4444", "#0ea5e9", "#f59e0b", "#64748b"];

    var PRESETS = [
        ["this_month", "This month"], ["last_month", "Last month"],
        ["this_week", "This week"], ["last_week", "Last week"],
        ["this_quarter", "This quarter"], ["last_quarter", "Last quarter"],
        ["this_year", "This year"], ["last_year", "Last year"],
        ["last_30_days", "Last 30 days"], ["last_90_days", "Last 90 days"],
        ["last_12_months", "Last 12 months"], ["all_time", "All time"]
    ];
    var STATUSES = ["Draft", "Submitted", "Paid", "Unpaid", "Overdue", "Completed", "Closed", "Cancelled", "Pending", "Delivered", "Returned", "Received"];
    var ENTITY_LABELS = {
        customer: "Customer", supplier: "Supplier", warehouse: "Warehouse",
        item_group: "Item Group", brand: "Brand", status: "Status", item: "Item"
    };

    // Reports Center navigation. The backend catalog is the source of truth for
    // reports; this only defines the CENTER's category structure. Categories that
    // have no reports in the catalog yet render with an empty-state (never block
    // the UI on the backend). Reports whose category matches none of these are
    // surfaced under "Other".
    var CENTER_CATEGORIES = [
        { key: "Executive", label: "Executive", icon: "chart", color: "indigo", desc: "Top-level KPIs and the full picture" },
        { key: "Sales", label: "Sales", icon: "sales", color: "green", desc: "Revenue, customers and pipeline" },
        { key: "Purchasing", label: "Purchasing", icon: "cart", color: "orange", desc: "Vendors, purchase and spend" },
        { key: "Inventory", label: "Inventory", icon: "box", color: "teal", desc: "Stock levels, movement and valuation" },
        { key: "Finance", label: "Finance", icon: "bank", color: "purple", desc: "Cash, receivables and payables" },
        { key: "Accounting", label: "Accounting", icon: "wallet", color: "blue", desc: "Ledgers and bookkeeping" },
        { key: "Tax", label: "Tax", icon: "percent", color: "yellow", desc: "VAT and tax exposure" },
        { key: "Customers", label: "Customers", icon: "users", color: "blue", desc: "Customer ledger, credit and collections" },
        { key: "Suppliers", label: "Suppliers", icon: "truck", color: "purple", desc: "Supplier ledger and payables" },
        { key: "Warehouse", label: "Warehouse", icon: "grid", color: "orange", desc: "Warehouse-wise stock positions" },
        { key: "Profitability", label: "Profitability", icon: "trending-up", color: "red", desc: "Margins and profitability" },
        { key: "Management", label: "Management", icon: "settings", color: "gray", desc: "Management oversight and control" }
    ];

    var assetCache = {};
    var catalogCache = null;

    /* ------------------------------------------------------------------ helpers */

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function dstr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

    function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }

    function addMonths(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }

    // Mirrors reports.py _preset_range (Monday-based weeks).
    function presetRange(preset) {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var wd = (today.getDay() + 6) % 7;
        var y, m, q, start;
        switch (preset) {
            case "today": return [today, today];
            case "yesterday": start = addDays(today, -1); return [start, start];
            case "this_week": start = addDays(today, -wd); return [start, today];
            case "last_week": start = addDays(today, -(wd + 7)); return [start, addDays(start, 6)];
            case "this_month": return [new Date(today.getFullYear(), today.getMonth(), 1), today];
            case "last_month":
                m = today.getMonth() - 1; y = today.getFullYear();
                if (m < 0) { m = 11; y -= 1; }
                start = new Date(y, m, 1);
                return [start, new Date(y, m + 1, 0)];
            case "this_quarter":
                q = Math.floor(today.getMonth() / 3);
                start = new Date(today.getFullYear(), q * 3, 1);
                return [start, today];
            case "last_quarter":
                q = Math.floor(today.getMonth() / 3);
                start = new Date(today.getFullYear(), q * 3 - 3, 1);
                return [start, new Date(today.getFullYear(), q * 3, 0)];
            case "this_year": return [new Date(today.getFullYear(), 0, 1), today];
            case "last_year": return [new Date(today.getFullYear() - 1, 0, 1), new Date(today.getFullYear() - 1, 11, 31)];
            case "last_30_days": return [addDays(today, -29), today];
            case "last_90_days": return [addDays(today, -89), today];
            case "last_12_months": return [new Date(today.getFullYear(), today.getMonth() - 11, 1), today];
            case "all_time": return [new Date(2000, 0, 1), today];
        }
        return [new Date(today.getFullYear(), today.getMonth(), 1), today];
    }

    function monthEnd(ym) {
        var parts = ym.split("-");
        var y = +parts[0], m = +parts[1];
        var d = new Date(y, m, 0);
        return dstr(d);
    }

    function moneyOf(currency, v) {
        var cur = currency || "SDG";
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency", currency: cur, currencyDisplay: "code",
                maximumFractionDigits: 2, minimumFractionDigits: 0
            }).format(v || 0);
        } catch (e) { return String(Math.round((v || 0) * 100) / 100); }
    }

    function numOf(v, maxFrac) {
        maxFrac = maxFrac === undefined ? 2 : maxFrac;
        try {
            return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFrac }).format(v || 0);
        } catch (e) { return String(v || 0); }
    }

    function fmtValue(app, fmt, currency, v) {
        if (fmt === "money") return moneyOf(currency, v);
        if (fmt === "percent") return numOf(v, 1) + "%";
        if (fmt === "int") return numOf(v, 0);
        return numOf(v, 2);
    }

    function getRx(app) {
        if (!app.state.__rx) app.state.__rx = { token: 0, charts: [], dt: null, bound: false };
        return app.state.__rx;
    }

    /* ------------------------------------------------------------------ storage (saved / pinned / recent / favorites / shared) */

    function emptyPrefs() {
        return {
            pinned: [], recent: [], saved: [], favorites: [], shared: [], custom: [],
            settings: {
                show_empty: true, compact: false, time: "this_month",
                cats: {}, density: "comfortable", side_collapsed: false, recent_queries: []
            }
        };
    }

    function readPrefs() {
        try {
            var raw = window.localStorage.getItem(LS_KEY);
            if (!raw) return emptyPrefs();
            var o = JSON.parse(raw);
            return {
                pinned: o.pinned || [], recent: o.recent || [], saved: o.saved || [],
                favorites: o.favorites || [], shared: o.shared || [], custom: o.custom || [],
                settings: Object.assign({
                    show_empty: true, compact: false, time: "this_month",
                    cats: {}, density: "comfortable", side_collapsed: false
                }, o.settings || {})
            };
        } catch (e) { return emptyPrefs(); }
    }

    function writePrefs(o) {
        try { window.localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch (e) {}
    }

    function isPinned(key) {
        return readPrefs().pinned.indexOf(key) !== -1;
    }

    function togglePin(key, meta) {
        var p = readPrefs();
        var i = p.pinned.indexOf(key);
        if (i !== -1) p.pinned.splice(i, 1);
        else p.pinned.unshift(key);
        writePrefs(p);
        return p.pinned.indexOf(key) !== -1;
    }

    function isFavorite(key) {
        return readPrefs().favorites.indexOf(key) !== -1;
    }

    function toggleFavorite(key, meta) {
        var p = readPrefs();
        var i = p.favorites.indexOf(key);
        if (i !== -1) p.favorites.splice(i, 1);
        else p.favorites.unshift(key);
        writePrefs(p);
        return p.favorites.indexOf(key) !== -1;
    }

    function isShared(key) {
        return readPrefs().shared.some(function (s) { return s.key === key; });
    }

    function toggleShared(key, meta) {
        var p = readPrefs();
        var i = -1;
        for (var j = 0; j < p.shared.length; j++) { if (p.shared[j].key === key) { i = j; break; } }
        if (i !== -1) p.shared.splice(i, 1);
        else p.shared.unshift({ key: key, title: (meta && meta.title) || key, ts: Date.now() });
        writePrefs(p);
        return i === -1;
    }

    function addCustom(card) {
        var p = readPrefs();
        card.ts = Date.now();
        p.custom.unshift(card);
        writePrefs(p);
        return p.custom.length;
    }

    function removeCustom(id) {
        var p = readPrefs();
        p.custom = p.custom.filter(function (c) { return c.id !== id; });
        writePrefs(p);
        return p.custom.length;
    }

    function findCustom(id) {
        var p = readPrefs();
        for (var i = 0; i < p.custom.length; i++) { if (p.custom[i].id === id) return p.custom[i]; }
        return null;
    }

    function addRecent(key, meta) {
        var p = readPrefs();
        p.recent = p.recent.filter(function (r) { return r.key !== key; });
        p.recent.unshift({ key: key, title: (meta && meta.title) || key, ts: Date.now() });
        p.recent = p.recent.slice(0, RECENT_CAP);
        writePrefs(p);
    }

    function saveView(key, meta, filters) {
        var p = readPrefs();
        p.saved = p.saved.filter(function (s) { return s.key !== key; });
        p.saved.unshift({ key: key, title: (meta && meta.title) || key, filters: filters, ts: Date.now() });
        writePrefs(p);
        return p.saved.length;
    }

    function findSaved(key, ts) {
        var p = readPrefs();
        for (var i = 0; i < p.saved.length; i++) {
            if (p.saved[i].key === key && (ts === undefined || p.saved[i].ts === ts)) return p.saved[i];
        }
        return null;
    }

    /* ------------------------------------------------------------------ asset loading */

    function loadScript(url) {
        if (assetCache[url]) return assetCache[url];
        assetCache[url] = new Promise(function (resolve, reject) {
            if (document.querySelector('script[data-nexora-rx="' + url + '"]')) { resolve(); return; }
            var s = document.createElement("script");
            s.setAttribute("data-nexora-rx", url);
            s.src = url;
            s.onload = resolve;
            s.onerror = function () { delete assetCache[url]; reject(new Error("Failed to load " + url)); };
            document.head.appendChild(s);
        });
        return assetCache[url];
    }

    function ensureDataTable() {
        if (window.NexoraDashboard && window.NexoraDashboard.DataTable) return Promise.resolve();
        return loadScript(ASSET_DT);
    }

    function ensureApex() {
        if (window.ApexCharts) return Promise.resolve();
        return loadScript(ASSET_APEX);
    }

    /* ------------------------------------------------------------------ API */

    // frappe.call JSON-stringifies nested plain-object/array args (frappe.request.prepare),
    // which corrupts the run_report `filters` dict on the server. run_report is called via
    // the raw JSON API instead so nested objects reach the backend intact.
    function call(app, method, args) {
        if (method === RUN_API) {
            return callJson(method, args);
        }
        return frappe.call({ method: method, args: args }).then(function (r) { return r.message; });
    }

    function callJson(method, args) {
        var token = (window.csrf_token || (window.frappe && window.frappe.csrf_token) || "").toString();
        return fetch("/api/method/" + method, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Frappe-CSRF-Token": token
            },
            body: JSON.stringify(args || {})
        }).then(function (res) {
            return res.json().catch(function () { throw new Error("Bad response from " + method); }).then(function (j) {
                if (j && j.exc_type) throw new Error(apiErrorText(j));
                if (j && j.message && j.message.exc) throw new Error(apiErrorText(j.message));
                return j ? j.message : null;
            });
        });
    }

    function apiErrorText(j) {
        var msgs = j && j._server_messages;
        if (msgs && msgs.length) {
            try {
                var parsed = JSON.parse(msgs[0]);
                if (parsed && parsed.message) return parsed.message;
            } catch (e) {}
            return msgs.join(" ");
        }
        if (j && j.exception) return String(j.exception).slice(0, 500);
        if (j && j.message && typeof j.message === "string") return j.message;
        return String((j && j.exc_type) || "Request failed");
    }

    function getCatalog(app) {
        if (catalogCache) return catalogCache;
        catalogCache = call(app, CATALOG_API, {}).then(function (cat) {
            if (!cat || !cat.categories || !cat.categories.length) throw new Error("Empty report catalog");
            return cat;
        }).catch(function (err) {
            catalogCache = null;
            throw err;
        });
        return catalogCache;
    }

    function findReport(cat, key) {
        if (!cat) return null;
        for (var i = 0; i < cat.categories.length; i++) {
            var reps = cat.categories[i].reports || [];
            for (var j = 0; j < reps.length; j++) {
                if (reps[j].key === key) return reps[j];
            }
        }
        return null;
    }

    function findCategory(cat, key) {
        if (!cat) return null;
        for (var i = 0; i < cat.categories.length; i++) {
            if (cat.categories[i].key === key) return cat.categories[i];
        }
        return null;
    }

    function defaultFilters(app, cat, meta) {
        var preset = (readPrefs().settings && readPrefs().settings.time) || "this_month";
        var r = presetRange(preset);
        var f = {
            company: (app.state && app.state.company) || (cat && cat.default_company) || "",
            preset: preset,
            start: dstr(r[0]), end: dstr(r[1]),
            customer: "", supplier: "", warehouse: "", item_group: "", brand: "", status: "", item: ""
        };
        return f;
    }

    function filtersFromForm(rx) {
        var f = {
            company: val(rx, "company"), preset: val(rx, "preset") || "custom",
            start: val(rx, "start"), end: val(rx, "end"),
            customer: val(rx, "customer"), supplier: val(rx, "supplier"), warehouse: val(rx, "warehouse"),
            item_group: val(rx, "item_group"), brand: val(rx, "brand"), status: val(rx, "status"), item: val(rx, "item")
        };
        return f;
    }

    function val(rx, field) {
        var el = rx.app.main && rx.app.main.querySelector('[data-rx-field="' + field + '"]');
        return el ? (el.value || "").trim() : "";
    }

    /* ------------------------------------------------------------------ DOM / events */

    function bind(app, rx) {
        if (rx.bound) return;
        rx.bound = true;
        app.main.addEventListener("click", function (e) {
            var back = e.target.closest("[data-rx-back]");
            if (back) { if (app.renderHub) app.renderHub(); return; }

            var side = e.target.closest("[data-rx-side]");
            if (side) { openSide(app, side); return; }

            var del = e.target.closest("[data-rx-custom-del]");
            if (del) {
                removeCustom(del.getAttribute("data-rx-custom-del"));
                if (app.renderHub) app.renderHub();
                return;
            }

            var custom = e.target.closest("[data-rx-custom]");
            if (custom) { openCustom(app, custom); return; }

            var fav = e.target.closest("[data-rx-fav]");
            if (fav) {
                var fk = fav.getAttribute("data-rx-fav");
                var favOn = toggleFavorite(fk, reportMetaFor(app, fk));
                fav.classList.toggle("is-on", favOn);
                fav.setAttribute("title", app.t(favOn ? "Remove favorite" : "Favorite"));
                if (app.state.embed && app.state.embed.rx) { refreshPinBtn(app, rx, fk); }
                else if (app.renderHub) app.renderHub();
                return;
            }

            var share = e.target.closest("[data-rx-share]");
            if (share) {
                var sk = share.getAttribute("data-rx-share");
                var shareOn = toggleShared(sk, reportMetaFor(app, sk));
                share.classList.toggle("is-on", shareOn);
                share.setAttribute("title", app.t(shareOn ? "Unshare" : "Share"));
                if (app.state.embed && app.state.embed.rx) { refreshPinBtn(app, rx, sk); }
                else if (app.renderHub) app.renderHub();
                return;
            }

            var pin = e.target.closest("[data-rx-pin]");
            if (pin) {
                var key = pin.getAttribute("data-rx-pin");
                var meta = reportMetaFor(app, key);
                var pinOn = togglePin(key, meta);
                pin.classList.toggle("is-on", pinOn);
                pin.setAttribute("title", app.t(pinOn ? "Unpin" : "Pin"));
                if (app.state.embed && app.state.embed.rx) { refreshPinBtn(app, rx, key); }
                else if (app.renderHub) app.renderHub();
                return;
            }

            var toolbar = e.target.closest("[data-rx-tool]");
            if (toolbar) { runTool(app, rx, toolbar.getAttribute("data-rx-tool")); return; }

            var fab = e.target.closest("[data-rx-fab]");
            if (fab) {
                var menu = app.main.querySelector("[data-rx-fab-menu]");
                if (menu) menu.hidden = !menu.hidden;
                return;
            }
            var menu = app.main.querySelector("[data-rx-fab-menu]");
            if (menu && !menu.hidden && !e.target.closest("[data-rx-fab-menu]")) menu.hidden = true;

            var time = e.target.closest("[data-rx-time]");
            if (time) {
                var p = readPrefs();
                p.settings.time = time.getAttribute("data-rx-time");
                writePrefs(p);
                if (app.renderHub) app.renderHub();
                return;
            }

            var catToggle = e.target.closest("[data-rx-cat-toggle]");
            if (catToggle) {
                var p2 = readPrefs();
                var ck = catToggle.getAttribute("data-rx-cat-toggle");
                if (!p2.settings.cats) p2.settings.cats = {};
                p2.settings.cats[ck] = p2.settings.cats[ck] === false;
                writePrefs(p2);
                var sec = app.main.querySelector('[data-rx-cat="' + ck + '"]');
                if (sec) {
                    sec.classList.toggle("is-open", !!p2.settings.cats[ck]);
                    catToggle.setAttribute("aria-expanded", !!p2.settings.cats[ck]);
                }
                return;
            }

            var density = e.target.closest("[data-rx-density]");
            if (density) {
                var p3 = readPrefs();
                p3.settings.density = p3.settings.density === "compact" ? "comfortable" : "compact";
                writePrefs(p3);
                if (app.renderHub) app.renderHub();
                return;
            }

            var col = e.target.closest("[data-rx-side-collapse]");
            if (col) {
                var p4 = readPrefs();
                p4.settings.side_collapsed = !p4.settings.side_collapsed;
                writePrefs(p4);
                var hubEl = app.main.querySelector("[data-rx-hub]");
                if (hubEl) hubEl.classList.toggle("is-side-collapsed", !!p4.settings.side_collapsed);
                return;
            }

            var menu = e.target.closest("[data-rx-menu]");
            if (menu) {
                var hubEl = app.main.querySelector("[data-rx-hub]");
                if (hubEl) {
                    var menuOpen = !hubEl.classList.contains("is-side-open");
                    hubEl.classList.toggle("is-side-open", menuOpen);
                    if (!menuOpen) { var m = app.main.querySelector("[data-rx-fab-menu]"); if (m) m.hidden = true; }
                }
                return;
            }
            if (app.main.querySelector("[data-rx-hub].is-side-open") && !e.target.closest(".nx-rx-side") && !e.target.closest("[data-rx-menu]")) {
                app.main.querySelector("[data-rx-hub]").classList.remove("is-side-open");
            }
            if (app.main.querySelector("[data-rx-hub].is-side-open") && e.target.closest("[data-rx-side]")) {
                app.main.querySelector("[data-rx-hub]").classList.remove("is-side-open");
            }

            if (e.target.closest("[data-rx-collapseall]")) { setAllCats(false); return; }
            if (e.target.closest("[data-rx-expandall]")) { setAllCats(true); return; }

            var report = e.target.closest("[data-rx-report]");
            if (report) { open(app, report.getAttribute("data-rx-report")); return; }

            var saved = e.target.closest("[data-rx-saved]");
            if (saved) { openSaved(app, saved); return; }

            var clear = e.target.closest("[data-rx-clear]");
            if (clear) { clearList(app, clear.getAttribute("data-rx-clear")); return; }

            var act = e.target.closest("[data-rx-act]");
            if (act) { runAction(app, rx, act); return; }

            var vpill = e.target.closest("[data-rx-vpill]");
            if (vpill) {
                var preset = vpill.getAttribute("data-rx-vpill");
                var r = presetRange(preset);
                rx.filters = rx.filters || {};
                rx.filters.preset = preset;
                rx.filters.start = dstr(r[0]);
                rx.filters.end = dstr(r[1]);
                var ps = app.main.querySelector('[data-rx-field="preset"]');
                if (ps) ps.value = preset;
                var s = app.main.querySelector('[data-rx-field="start"]');
                var en = app.main.querySelector('[data-rx-field="end"]');
                if (s) s.value = rx.filters.start;
                if (en) en.value = rx.filters.end;
                renderVPills(app, rx);
                rx.token++;
                run(app, rx.lastKey, rx.filters, rx.meta, rx.token);
                return;
            }

            var apply = e.target.closest("[data-rx-apply]");
            if (apply) { applyFilters(app, rx); return; }
            var reset = e.target.closest("[data-rx-reset]");
            if (reset) { resetFilters(app, rx); return; }
        });
        app.main.addEventListener("change", function (e) {
            var t = e.target;
            if (t && t.getAttribute && t.getAttribute("data-rx-field") === "preset") {
                var r = presetRange(t.value);
                var s = app.main.querySelector('[data-rx-field="start"]');
                var en = app.main.querySelector('[data-rx-field="end"]');
                if (s) s.value = dstr(r[0]);
                if (en) en.value = dstr(r[1]);
            }
            if (t && t.getAttribute && t.getAttribute("data-rx-field")) {
                applyFilters(app, rx);
            }
        });
        app.main.addEventListener("dblclick", function (e) {
            var tr = e.target.closest("tr[data-row]");
            if (!tr || !rx.dt) return;
            var i = +tr.getAttribute("data-row");
            var row = rx.dt.all && rx.dt.all[i] && rx.dt.all[i].r;
            if (row) drillInto(app, rx, row);
        });
        app.main.addEventListener("keydown", function (e) {
            var tag = e.target && e.target.tagName;
            var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
            if (e.key === "/" && !typing) {
                e.preventDefault();
                var si = app.main.querySelector("[data-rx-search-input]");
                if (si) { si.focus(); si.select(); }
                return;
            }
            if (e.key === "Escape") {
                var menu = app.main.querySelector("[data-rx-fab-menu]");
                if (menu && !menu.hidden) { menu.hidden = true; e.preventDefault(); }
            }
        });
    }

    function setAllCats(open) {
        var p = readPrefs();
        if (!p.settings.cats) p.settings.cats = {};
        app.main.querySelectorAll("[data-rx-cat]").forEach(function (sec) {
            var k = sec.getAttribute("data-rx-cat");
            p.settings.cats[k] = open;
            sec.classList.toggle("is-open", open);
            var h = sec.querySelector("[data-rx-cat-toggle]");
            if (h) h.setAttribute("aria-expanded", open ? "true" : "false");
        });
        writePrefs(p);
    }

    function reportMetaFor(app, key) {
        var cat = catalogCache && catalogCache.value;
        return findReport(cat, key) || { key: key, title: key };
    }

    function clearList(app, kind) {
        var p = readPrefs();
        if (kind === "recent") p.recent = [];
        if (kind === "saved") p.saved = [];
        if (kind === "pinned") p.pinned = [];
        if (kind === "favorites") p.favorites = [];
        if (kind === "shared") p.shared = [];
        if (kind === "custom") p.custom = [];
        writePrefs(p);
        if (app.state.embed && app.state.embed.rx) return;
        if (app.renderHub) app.renderHub();
    }

    function openSide(app, sideEl) {
        var kind = sideEl.getAttribute("data-rx-side");
        var key = sideEl.getAttribute("data-rx-side-key");
        if (!key) return;
        if (kind === "saved") {
            var s = findSaved(key);
            if (s) { open(app, key, { prefill: s.filters }); }
            return;
        }
        if (kind === "custom") { openCustomById(app, key); return; }
        open(app, key);
    }

    function openCustomById(app, id) {
        var card = findCustom(id);
        if (!card) return;
        var meta = reportMetaFor(app, card.base || card.key || "");
        open(app, meta.key || card.key, {
            title: card.title, icon: card.icon || "file", color: card.color || "indigo",
            prefill: card.filters
        });
    }

    function openCustom(app, customEl) {
        openCustomById(app, customEl.getAttribute("data-rx-custom"));
    }

    /* ------------------------------------------------------------------ hub */

    function hub(app) {
        var rx = getRx(app);
        rx.token++;
        teardown(app, rx);
        app.state.embed = null;
        app.state.reportLoading = false;
        bind(app, rx);
        app.main.innerHTML = viewWrap(loadingHtml(app, app.t("Loading reports…")));
        getCatalog(app).then(function (cat) {
            if (app.state.view !== "reports" && !app.state.embed) { /* still render for other views */ }
            if (app.state.embed) return;
            renderHub(app, cat, rx);
        }).catch(function (err) {
            if (!app.state.embed) renderHubError(app, err, rx);
        });
    }

    function viewWrap(inner, cls) {
        return '<div class="nx-view' + (cls ? " " + cls : "") + '">' + inner + "</div>";
    }

    function loadingHtml(app, label) {
        return '<div class="nx-rx-loading">' + (app.ic ? app.ic("refresh", 20) : "") + " <span>" + app.esc(label) + "</span></div>";
    }

    function renderHub(app, cat, rx) {
        var p = readPrefs();
        var cats = renderCategories(app, cat, p);

        var html =
            '<div class="nx-rx-hub" data-rx-hub' + (p.settings.side_collapsed ? " is-side-collapsed" : "") + '>' +
            renderSidebar(app, cat, p) +
            '<div class="nx-rx-main">' +
            renderHubHead(app, cat, p) +
            renderHubToolbar(app, cat, p, cats.total) +
            cats.html +
            "</div>" +
            renderFab(app) +
            "</div>";

        app.main.innerHTML = viewWrap(html, "nx-rx-view");
        bindSearch(app, rx);
    }

    /* ---- hub header / toolbar / fab ---- */

    var HUB_TIME_PILLS = [
        ["this_month", "This month"], ["this_quarter", "This quarter"],
        ["this_year", "This year"], ["last_12_months", "Last 12 months"], ["all_time", "All time"]
    ];

    function renderHubHead(app, cat, p) {
        var time = (p.settings && p.settings.time) || "this_month";
        var pillHtml = HUB_TIME_PILLS.map(function (pr) {
            return '<button class="nx-rx-time-pill' + (pr[0] === time ? " is-on" : "") + '" data-rx-time="' + app.esc(pr[0]) + '" title="' + app.esc(app.t(pr[1])) + '">' + app.esc(app.t(pr[1])) + "</button>";
        }).join("");
        return '<div class="nx-rx-head">' +
            '<div class="nx-rx-head-top">' +
            '<button class="nx-rx-menu-btn" data-rx-menu title="' + app.esc(app.t("Toggle navigation")) + '">' + app.ic("menu", 16) + "</button>" +
            '<span class="nx-rx-eyebrow">' + app.esc(app.t("Analytics Hub")) + "</span>" +
            '<div class="nx-rx-head-timepills">' + pillHtml + "</div>" +
            '<button class="nx-rx-btn-new" data-rx-tool="new" title="' + app.esc(app.t("Create a new report")) + '">' + app.ic("plus", 15) + " " + app.esc(app.t("New Report")) + "</button>" +
            "</div>" +
            '<div class="nx-rx-title-row">' +
            '<div class="nx-rx-title-block">' +
            '<div class="nx-rx-title">' + app.esc(app.t("Reports Center")) + "</div>" +
            '<div class="nx-rx-sub">' + app.esc(app.t("Explore every report with live data — rendered by Nexora.")) + "</div>" +
            "</div>" +
            '<div class="nx-rx-search" role="search">' +
            '<span class="nx-rx-search-ic">' + app.ic("search", 15) + "</span>" +
            '<input class="nx-rx-search-input" type="text" autocomplete="off" spellcheck="false" placeholder="' + app.esc(app.t("Search reports…")) + '" aria-label="' + app.esc(app.t("Search reports")) + '" data-rx-search-input />' +
            '<span class="nx-rx-search-kbd">/</span>' +
            "</div>" +
            "</div>" +
            "</div>";
    }

    function renderHubToolbar(app, cat, p, total) {
        var compact = (p.settings && p.settings.density) === "compact";
        return '<div class="nx-rx-toolbar">' +
            '<span class="nx-rx-count"><b data-rx-total>' + app.num(total, 0) + "</b> " + app.esc(app.t("reports")) + "</span>" +
            '<span class="nx-rx-toolbar-spacer"></span>' +
            '<button class="nx-rx-tool" data-rx-collapseall title="' + app.esc(app.t("Collapse all categories")) + '">' + app.ic("chevron-up", 13) + " " + app.esc(app.t("Collapse all")) + "</button>" +
            '<button class="nx-rx-tool" data-rx-expandall title="' + app.esc(app.t("Expand all categories")) + '">' + app.ic("chevron-down", 13) + " " + app.esc(app.t("Expand all")) + "</button>" +
            '<button class="nx-rx-tool" data-rx-density title="' + app.esc(app.t("Toggle card density")) + '">' + app.ic(compact ? "layers" : "maximize", 13) + " " + app.esc(app.t(compact ? "Comfortable" : "Compact")) + "</button>" +
            "</div>";
    }

    function renderFab(app) {
        return '<button class="nx-rx-fab" data-rx-fab title="' + app.esc(app.t("Quick actions")) + '">' + app.ic("plus", 22) + "</button>" +
            '<div class="nx-rx-fab-menu" data-rx-fab-menu hidden>' +
            fabItem(app, "new", "plus", "New Report") +
            fabItem(app, "import", "download", "Import reports") +
            fabItem(app, "export", "share", "Export library") +
            fabItem(app, "settings", "settings", "Settings") +
            "</div>";
    }

    function fabItem(app, tool, icon, label) {
        return '<button class="nx-rx-fab-item" data-rx-tool="' + app.esc(tool) + '">' +
            '<span class="nx-rx-fab-item-ic">' + app.ic(icon, 15) + "</span>" + app.esc(app.t(label)) + "</button>";
    }

    // Category orchestration: walks the desired center categories, collects the
    // catalog + custom reports for each, and delegates card rendering.
    function renderCategories(app, cat, p) {
        var html = '<div class="nx-rx-cats" data-rx-cats>';
        var total = 0;
        var seen = {};
        var showEmpty = p.settings.show_empty !== false;

        CENTER_CATEGORIES.forEach(function (c, i) {
            var reps = collectCategoryReports(app, cat, p, c, seen);
            if (!reps.length && !showEmpty) return;
            total += reps.length;
            html += catSectionHtml(app, c, reps, i);
        });

        var others = collectOtherReports(app, cat, seen);
        if (others.length) {
            total += others.length;
            html += catSectionHtml(app, {
                key: "Other", label: app.t("Other"), icon: "file", color: "gray",
                desc: app.t("Reports that do not map to a Reports Center category yet")
            }, others, CENTER_CATEGORIES.length);
        }

        html += "</div>";
        return { html: html, total: total };
    }

    function collectCategoryReports(app, cat, p, c, seen) {
        var reps = [];
        (cat.categories || []).forEach(function (cc) {
            if (cc.key !== c.key) return;
            (cc.reports || []).forEach(function (r) { seen[r.key] = true; reps.push({ kind: "catalog", r: r, c: cc }); });
        });
        p.custom.forEach(function (card) {
            if ((card.category || "") === c.key) reps.push({ kind: "custom", r: card, c: c });
        });
        return reps;
    }

    function collectOtherReports(app, cat, seen) {
        var others = [];
        (cat.categories || []).forEach(function (cc) {
            (cc.reports || []).forEach(function (r) {
                if (!seen[r.key]) others.push({ kind: "catalog", r: r, c: cc });
            });
        });
        return others;
    }

    function catSectionHtml(app, c, reps, index) {
        var p = readPrefs();
        var settings = p.settings || {};
        var isOpen = settings.cats ? settings.cats[c.key] !== false : true;
        return '<section class="nx-rx-cat' + (isOpen ? " is-open" : "") + '" data-rx-cat="' + app.esc(c.key) + '" style="--i:' + (index || 0) + '">' +
            '<button class="nx-rx-cat-head" data-rx-cat-toggle="' + app.esc(c.key) + '" aria-expanded="' + (isOpen ? "true" : "false") + '">' +
            '<span class="nx-rx-cat-ic nx-ic-' + app.esc(c.color || "indigo") + '">' + app.ic(c.icon || "chart", 17) + "</span>" +
            '<span class="nx-rx-cat-txt">' +
            '<span class="nx-rx-cat-title">' + app.esc(app.t(c.label || c.key)) + "</span>" +
            '<span class="nx-rx-cat-desc">' + app.esc(app.t(c.desc || "")) + "</span>" +
            "</span>" +
            '<span class="nx-rx-cat-count">' + app.num(reps.length, 0) + "</span>" +
            '<span class="nx-rx-cat-chev">' + app.ic("chevron-down", 15) + "</span>" +
            "</button>" +
            '<div class="nx-rx-cat-body-wrap"><div class="nx-rx-cat-body-hold">' +
            '<div class="nx-rx-cat-body">' +
            renderReportCards(app, c, reps) +
            "</div></div></div></section>";
    }

    function renderReportCards(app, c, reps) {
        if (!reps.length) {
            return '<div class="nx-rx-cat-empty"><span class="nx-rx-cat-empty-ic">' + app.ic("plus", 13) + "</span>" +
                app.esc(app.t("No reports in this category yet — they appear here once published.")) + "</div>";
        }
        var html = "";
        reps.forEach(function (it, i) {
            html += it.kind === "custom" ? customCardHtml(app, it.r, i) : reportCardHtml(app, it.c, it.r, i);
        });
        return html;
    }

    function renderSidebar(app, cat, p) {
        var pinned = p.pinned.filter(function (k) { return findReport(cat, k); });
        var recent = p.recent.filter(function (r) { return findReport(cat, r.key); });
        var favorites = p.favorites.filter(function (k) { return findReport(cat, k); });
        var shared = p.shared.filter(function (s) { return findReport(cat, s.key); });

        var html = '<aside class="nx-rx-side">' +
            '<div class="nx-rx-side-brand">' +
            '<span class="nx-rx-side-logo">' + app.esc(app.t("N")) + "</span>" +
            '<span class="nx-rx-side-txt">' +
            '<span class="nx-rx-side-title">' + app.esc(app.t("Reports Center")) + "</span>" +
            '<span class="nx-rx-side-sub">' + app.esc(app.t("Analytics Hub")) + "</span>" +
            "</span>" +
            '<button class="nx-rx-side-collapsebtn" data-rx-side-collapse title="' + app.esc(app.t("Collapse rail")) + '">' + app.ic("chevron-left", 13) + "</button>" +
            "</div>" +
            '<div class="nx-rx-side-scroll">' +
            sideSection(app, app.t("Favorites"), "heart",
                favorites.map(function (k) { return { key: k, title: reportMetaFor(app, k).title, ts: 0 }; }),
                "favorites", !!favorites.length) +
            sideSection(app, app.t("Pinned"), "pin",
                pinned.map(function (k) { return { key: k, title: reportMetaFor(app, k).title, ts: 0 }; }),
                "pinned", !!pinned.length) +
            sideSection(app, app.t("Recent"), "clock",
                recent.map(function (r) { return { key: r.key, title: r.title, ts: r.ts }; }),
                "recent", !!recent.length) +
            sideSection(app, app.t("Saved"), "save",
                p.saved.map(function (s) { return { key: s.key, title: s.title || s.key, ts: s.ts }; }),
                "saved", !!p.saved.length) +
            sideSection(app, app.t("Shared"), "share",
                shared.map(function (s) { return { key: s.key, title: s.title || s.key, ts: s.ts }; }),
                "shared", !!shared.length) +
            "</div>" +
            '<div class="nx-rx-side-foot">' +
            '<button class="nx-rx-side-collapse" data-rx-side-collapse>' + app.ic("chevron-left", 13) + " " + app.esc(app.t("Collapse rail")) + "</button>" +
            "</div>" +
            "</aside>";
        return html;
    }

    function sideSection(app, label, icon, items, kind, hasItems) {
        var html = '<section class="nx-rx-side-sec">' +
            '<header class="nx-rx-side-sec-head">' +
            '<span>' + app.esc(label) + "</span>" +
            '<span class="nx-rx-side-sec-count">' + app.num(items.length, 0) + "</span>" +
            (hasItems ? '<button class="nx-rx-side-clear" data-rx-clear="' + app.esc(kind) + '" title="' + app.esc(app.t("Clear")) + '">' + app.ic("x", 11) + "</button>" : "") +
            "</header>" +
            '<div class="nx-rx-side-items">';
        if (!items.length) {
            html += '<div class="nx-rx-side-empty">' + app.esc(app.t("Nothing here yet")) + "</div>";
        } else {
            items.forEach(function (it) {
                html += '<button class="nx-rx-side-item" data-rx-side="' + app.esc(kind) + '" data-rx-side-key="' + app.esc(it.key) + '" title="' + app.esc(it.title) + '">' +
                    '<span class="nx-rx-side-item-ic">' + app.ic(kind === "saved" ? "save" : "file", 12) + "</span>" +
                    '<span class="nx-rx-side-item-txt">' + app.esc(it.title) + "</span>" +
                    (it.ts ? '<time class="nx-rx-side-item-ts">' + app.esc(relTime(app, it.ts)) + "</time>" : "") +
                    "</button>";
            });
        }
        html += "</div></section>";
        return html;
    }

    function reportCardHtml(app, c, r, idx) {
        var key = r.key;
        var tags = tagsForReport(app, r, c);
        var fav = isFavorite(key), pin = isPinned(key), share = isShared(key);
        var compact = (readPrefs().settings && readPrefs().settings.density === "compact") ? " is-compact" : "";
        var name = app.t(r.title), desc = app.t(r.desc || "");
        var tagsHtml = tags.length ? '<span class="nx-rx-card-tags">' + tags.map(function (t) { return '<span class="nx-rx-card-tag">' + app.esc(app.t(t)) + "</span>"; }).join("") + "</span>" : "";
        return '<div class="nx-rx-card' + compact + '" data-rx-report="' + app.esc(key) + '" data-name="' + app.esc(name) + '" data-desc="' + app.esc(desc) + '" style="--i:' + (idx || 0) + '">' +
            '<span class="nx-rx-card-ic nx-ic-' + app.esc(r.color || (c && c.color) || "indigo") + '">' + app.ic(r.icon || (c && c.icon) || "file", 17) + "</span>" +
            '<span class="nx-rx-card-txt">' +
            '<span class="nx-rx-card-name">' + app.esc(name) + "</span>" +
            '<span class="nx-rx-card-desc">' + app.esc(desc) + "</span>" +
            tagsHtml +
            "</span>" +
            '<span class="nx-rx-card-actions">' +
            '<button class="nx-rx-fav' + (fav ? " is-on" : "") + '" data-rx-fav="' + app.esc(key) + '" title="' + app.esc(fav ? app.t("Remove favorite") : app.t("Favorite")) + '">' + app.ic("heart", 14) + "</button>" +
            '<button class="nx-rx-pin' + (pin ? " is-on" : "") + '" data-rx-pin="' + app.esc(key) + '" title="' + app.esc(pin ? app.t("Unpin") : app.t("Pin")) + '">' + app.ic("pin", 14) + "</button>" +
            '<button class="nx-rx-share' + (share ? " is-on" : "") + '" data-rx-share="' + app.esc(key) + '" title="' + app.esc(share ? app.t("Unshare") : app.t("Share")) + '">' + app.ic("share", 14) + "</button>" +
            "</span>" +
            '<span class="nx-rx-card-arrow">' + app.ic("arrow-right", 14) + "</span>" +
            "</div>";
    }

    function customCardHtml(app, card, idx) {
        var tags = card.tags || [];
        var compact = (readPrefs().settings && readPrefs().settings.density === "compact") ? " is-compact" : "";
        var name = app.t(card.title || "Untitled report");
        var desc = app.t(card.desc || app.t("Custom report"));
        var tagsHtml = tags.length ? '<span class="nx-rx-card-tags">' + tags.map(function (t) { return '<span class="nx-rx-card-tag">' + app.esc(app.t(t)) + "</span>"; }).join("") + "</span>" : "";
        return '<div class="nx-rx-card is-custom' + compact + '" data-rx-custom="' + app.esc(card.id) + '" data-name="' + app.esc(name) + '" data-desc="' + app.esc(desc) + '" style="--i:' + (idx || 0) + '">' +
            '<span class="nx-rx-card-ic nx-ic-' + app.esc(card.color || "indigo") + '">' + app.ic(card.icon || "file", 17) + "</span>" +
            '<span class="nx-rx-card-txt">' +
            '<span class="nx-rx-card-name">' + app.esc(name) + "</span>" +
            '<span class="nx-rx-card-desc">' + app.esc(desc) + "</span>" +
            tagsHtml +
            "</span>" +
            '<span class="nx-rx-card-actions">' +
            '<button class="nx-rx-del" data-rx-custom-del="' + app.esc(card.id) + '" title="' + app.esc(app.t("Delete custom report")) + '">' + app.ic("x", 14) + "</button>" +
            "</span>" +
            '<span class="nx-rx-card-arrow">' + app.ic("arrow-right", 14) + "</span>" +
            "</div>";
    }

    function tagsForReport(app, r, c) {
        var tags = [];
        if (c && c.key) tags.push(c.key);
        (r.filters || []).forEach(function (f) {
            var label = ENTITY_LABELS[f];
            if (label && tags.indexOf(label) === -1) tags.push(label);
        });
        return tags.slice(0, 4);
    }

    function lastOpenedTs(app, key) {
        var p = readPrefs();
        for (var i = 0; i < p.recent.length; i++) {
            if (p.recent[i].key === key) return p.recent[i].ts;
        }
        return 0;
    }

    function relTime(app, ts) {
        if (!ts) return "";
        var s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
        if (s < 45) return app.t("just now");
        var m = Math.floor(s / 60);
        if (m < 60) return app.num(m, 0) + "m";
        var h = Math.floor(m / 60);
        if (h < 24) return app.num(h, 0) + "h";
        var d = Math.floor(h / 24);
        if (d < 30) return app.num(d, 0) + "d";
        return app.num(Math.floor(d / 30), 0) + "mo";
    }

    function runTool(app, rx, tool) {
        if (tool === "new") { newReportDialog(app, rx); return; }
        if (tool === "import") { importDialog(app, rx); return; }
        if (tool === "export") { exportLibrary(app); return; }
        if (tool === "settings") { settingsDialog(app, rx); return; }
    }

    function newReportDialog(app, rx) {
        getCatalog(app).then(function (cat) {
            var catOpts = "";
            CENTER_CATEGORIES.forEach(function (c, i) {
                catOpts += '<option value="' + app.esc(c.key) + '"' + (i === 1 ? " selected" : "") + ">" + app.esc(app.t(c.label)) + "</option>";
            });
            var baseOpts = "";
            var keys = [];
            (cat.categories || []).forEach(function (cc) {
                (cc.reports || []).forEach(function (r) {
                    if (keys.indexOf(r.key) === -1) {
                        keys.push(r.key);
                        baseOpts += '<option value="' + app.esc(r.key) + '">' + app.esc(app.t(r.title)) + "</option>";
                    }
                });
            });
            if (!baseOpts) { baseOpts = '<option value="">' + app.esc(app.t("No reports available")) + "</option>"; }

            app.showDialog({
                title: app.t("New Report"),
                width: 560,
                body:
                    '<div class="nx-form">' +
                    '<label class="nx-field-label">' + app.esc(app.t("Title")) + '</label>' +
                    '<input class="nx-input" type="text" data-nx-new-name placeholder="' + app.esc(app.t("e.g. Q3 Top Customers")) + '" />' +
                    '<label class="nx-field-label">' + app.esc(app.t("Description")) + '</label>' +
                    '<input class="nx-input" type="text" data-nx-new-desc placeholder="' + app.esc(app.t("Optional short description")) + '" />' +
                    '<label class="nx-field-label">' + app.esc(app.t("Category")) + '</label>' +
                    '<select class="nx-input" data-nx-new-cat>' + catOpts + "</select>" +
                    '<label class="nx-field-label">' + app.esc(app.t("Base report")) + '</label>' +
                    '<select class="nx-input" data-nx-new-base>' + baseOpts + "</select>" +
                    '<label class="nx-field-label">' + app.esc(app.t("Tags")) + '</label>' +
                    '<input class="nx-input" type="text" data-nx-new-tags placeholder="' + app.esc(app.t("Comma separated, optional")) + '" />' +
                    "</div>",
                actions: [
                    { label: app.t("Create"), variant: "primary", click: function (api) {
                        var name = (api.el.querySelector("[data-nx-new-name]").value || "").trim();
                        var base = api.el.querySelector("[data-nx-new-base]").value || "";
                        if (!name) { api.el.querySelector("[data-nx-new-name]").focus(); return; }
                        var desc = (api.el.querySelector("[data-nx-new-desc]").value || "").trim();
                        var catK = api.el.querySelector("[data-nx-new-cat]").value || "";
                        var tags = (api.el.querySelector("[data-nx-new-tags]").value || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 4);
                        var meta = reportMetaFor(app, base);
                        var now = Date.now();
                        addCustom({
                            id: "crx" + now, type: "custom", base: base,
                            title: name, desc: desc, category: catK, tags: tags,
                            icon: meta.icon || "file", color: meta.color || "indigo",
                            filters: {}, ts: now
                        });
                        api.close();
                        if (app.renderHub) app.renderHub();
                    } },
                    { label: app.t("Cancel"), click: function (api) { api.close(); } }
                ],
                onCreate: function (api) {
                    var n = api.el.querySelector("[data-nx-new-name]");
                    if (n) setTimeout(function () { try { n.focus(); } catch (e) {} }, 20);
                }
            });
        }).catch(function () {
            app.showDialog({
                title: app.t("New Report"),
                body: '<div class="nx-form"><div class="nx-report-error-msg">' + app.esc(app.t("Could not load the report catalog.")) + "</div></div>",
                actions: [{ label: app.t("Close"), click: function (api) { api.close(); } }]
            });
        });
    }

    function importDialog(app, rx) {
        var imported = { custom: [], saved: [] };
        app.showDialog({
            title: app.t("Import Reports"),
            width: 480,
            body:
                '<div class="nx-form">' +
                '<label class="nx-field-label">' + app.esc(app.t("Library file")) + '</label>' +
                '<input class="nx-input" type="file" accept="application/json,.json" data-nx-import-file />' +
                '<div class="nx-field-hint">' + app.esc(app.t("Import a JSON file previously exported from the Reports Center. Your library is merged, nothing is removed.")) + "</div>" +
                '<div class="nx-report-error-msg" data-nx-import-err hidden></div>' +
                "</div>",
            actions: [
                { label: app.t("Import"), variant: "primary", click: function (api) {
                    if (!imported.custom.length && !imported.saved.length) {
                        var err = api.el.querySelector("[data-nx-import-err]");
                        if (err) { err.textContent = app.t("Choose a valid library file first."); err.hidden = false; }
                        return;
                    }
                    var p = readPrefs();
                    imported.custom.forEach(function (c) { p.custom.unshift(c); });
                    imported.saved.forEach(function (s) { p.saved.unshift(s); });
                    p.custom = p.custom.slice(0, 60);
                    p.saved = p.saved.slice(0, 60);
                    writePrefs(p);
                    api.close();
                    if (app.renderHub) app.renderHub();
                } },
                { label: app.t("Cancel"), click: function (api) { api.close(); } }
            ],
            onCreate: function (api) {
                var input = api.el.querySelector("[data-nx-import-file]");
                if (!input) return;
                input.addEventListener("change", function () {
                    var file = input.files && input.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function () {
                        try {
                            var data = JSON.parse(reader.result || "{}");
                            var custom = Array.isArray(data.custom) ? data.custom : [];
                            var saved = Array.isArray(data.saved) ? data.saved : [];
                            var ok = 0;
                            custom.forEach(function (c) {
                                if (c && typeof c === "object" && c.title && c.base) { ok++; imported.custom.push(c); }
                            });
                            saved.forEach(function (s) {
                                if (s && typeof s === "object" && s.key && s.filters) { ok++; imported.saved.push(s); }
                            });
                            if (!ok) throw new Error("bad file");
                            var err = api.el.querySelector("[data-nx-import-err]");
                            if (err) err.hidden = true;
                        } catch (e) {
                            imported = { custom: [], saved: [] };
                            var errEl = api.el.querySelector("[data-nx-import-err]");
                            if (errEl) { errEl.textContent = app.t("This file does not look like a Reports Center export."); errEl.hidden = false; }
                        }
                    };
                    reader.readAsText(file);
                });
            }
        });
    }

    function exportLibrary(app) {
        var p = readPrefs();
        var payload = {
            app: "nexora-reports-center",
            version: 1,
            exportedAt: new Date().toISOString(),
            favorites: p.favorites, pinned: p.pinned,
            saved: p.saved, shared: p.shared, custom: p.custom
        };
        try {
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "nexora-report-library.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1000);
        } catch (e) { /* no-op */ }
    }

    function settingsDialog(app, rx) {
        var p = readPrefs();
        var densityOpts = [["comfortable", app.t("Comfortable")], ["compact", app.t("Compact")]].map(function (d) {
            return '<option value="' + d[0] + '"' + ((p.settings.density || "comfortable") === d[0] ? " selected" : "") + ">" + d[1] + "</option>";
        }).join("");
        var timeOpts = HUB_TIME_PILLS.map(function (pr) {
            return '<option value="' + pr[0] + '"' + ((p.settings.time || "this_month") === pr[0] ? " selected" : "") + ">" + app.esc(app.t(pr[1])) + "</option>";
        }).join("");
        app.showDialog({
            title: app.t("Reports Center Settings"),
            width: 460,
            body:
                '<div class="nx-form">' +
                '<label class="nx-field-label">' + app.esc(app.t("Display")) + '</label>' +
                '<label class="nx-check"><input type="checkbox" data-nx-set-empty' + (p.settings.show_empty !== false ? " checked" : "") + " /> " + app.esc(app.t("Show categories that have no reports yet")) + "</label>" +
                '<label class="nx-field-label">' + app.esc(app.t("Card density")) + '</label>' +
                '<select class="nx-input" data-nx-set-density>' + densityOpts + "</select>" +
                '<label class="nx-field-label">' + app.esc(app.t("Default time range")) + '</label>' +
                '<select class="nx-input" data-nx-set-time>' + timeOpts + "</select>" +
                '<hr class="nx-form-hr" />' +
                '<button class="nx-btn nx-btn-danger" data-nx-clear-all>' + app.esc(app.t("Clear all library data")) + "</button>" +
                '<div class="nx-field-hint">' + app.esc(app.t("Removes favorites, pins, recent, saved, shared and custom reports from this browser.")) + "</div>" +
                "</div>",
            actions: [
                { label: app.t("Save"), variant: "primary", click: function (api) {
                    var p2 = readPrefs();
                    var empty = api.el.querySelector("[data-nx-set-empty]");
                    var density = api.el.querySelector("[data-nx-set-density]");
                    var time = api.el.querySelector("[data-nx-set-time]");
                    if (empty) p2.settings.show_empty = empty.checked;
                    if (density) p2.settings.density = density.value;
                    if (time) p2.settings.time = time.value;
                    writePrefs(p2);
                    api.close();
                    if (app.renderHub) app.renderHub();
                } },
                { label: app.t("Cancel"), click: function (api) { api.close(); } }
            ],
            onCreate: function (api) {
                var clearBtn = api.el.querySelector("[data-nx-clear-all]");
                if (!clearBtn) return;
                clearBtn.addEventListener("click", function () {
                    try { window.localStorage.removeItem(LS_KEY); } catch (e) {}
                    api.close();
                    if (app.renderHub) app.renderHub();
                });
            }
        });
    }

    var SEARCH_DEBOUNCE = 160;
    var searchTimer = null;

    function bindSearch(app, rx) {
        var wrap = app.main.querySelector(".nx-rx-search");
        var input = app.main.querySelector("[data-rx-search-input]");
        if (!input || !wrap) return;
        var pop = null;

        function ensurePop() {
            if (!pop) {
                pop = document.createElement("div");
                pop.className = "nx-rx-search-pop";
                pop.hidden = true;
                wrap.appendChild(pop);
            }
            return pop;
        }
        function closePop() { if (pop) pop.hidden = true; }

        function renderRecentPop() {
            var p = readPrefs();
            var qs = (p.settings.recent_queries || []).filter(Boolean);
            if (input.value || !qs.length) { closePop(); return; }
            var el = ensurePop();
            el.innerHTML =
                '<div class="nx-rx-search-pop-label">' + app.esc(app.t("Recent searches")) + "</div>" +
                qs.map(function (q) { return '<button type="button" class="nx-rx-search-pop-item" data-rx-q="' + app.esc(q) + '">' + app.ic("clock", 12) + " " + app.esc(q) + "</button>"; }).join("") +
                '<button type="button" class="nx-rx-search-pop-clear" data-rx-qclear>' + app.esc(app.t("Clear history")) + "</button>";
            el.hidden = false;
        }

        input.addEventListener("input", function () {
            clearTimeout(searchTimer);
            var val = input.value;
            searchTimer = setTimeout(function () {
                doSearch(app, val);
                if (val.trim()) closePop(); else renderRecentPop();
            }, SEARCH_DEBOUNCE);
        });
        input.addEventListener("focus", renderRecentPop);
        input.addEventListener("blur", function () { setTimeout(closePop, 160); });
        input.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { e.stopPropagation(); input.value = ""; doSearch(app, ""); closePop(); input.blur(); }
        });
        wrap.addEventListener("click", function (e) {
            var clear = e.target.closest("[data-rx-qclear]");
            if (clear) {
                var p = readPrefs();
                p.settings.recent_queries = [];
                writePrefs(p);
                closePop();
                return;
            }
            var item = e.target.closest("[data-rx-q]");
            if (!item) return;
            input.value = item.getAttribute("data-rx-q");
            doSearch(app, input.value);
            closePop();
        });
    }

    function doSearch(app, raw) {
        var q = (raw || "").trim().toLowerCase();
        var qw = q ? q.split(/\s+/) : [];
        var hl = q ? escapeRe(q) : "";
        var visible = 0;
        app.main.querySelectorAll(".nx-rx-cat").forEach(function (sec) {
            var secVisible = 0;
            sec.querySelectorAll(".nx-rx-card").forEach(function (card) {
                var hay = ((card.getAttribute("data-name") || "") + " " + (card.getAttribute("data-desc") || "") + " " + card.textContent).toLowerCase();
                var show = !q || qw.every(function (w) { return hay.indexOf(w) !== -1; });
                card.style.display = show ? "" : "none";
                highlightCard(card, hl);
                if (show) secVisible++;
            });
            var showSec = !q || secVisible > 0;
            sec.style.display = showSec ? "" : "none";
            if (showSec) visible += secVisible;
        });
        var count = app.main.querySelector("[data-rx-total]");
        if (count) count.textContent = app.num(visible, 0);
        if (q) {
            var p = readPrefs();
            if (!p.settings.recent_queries) p.settings.recent_queries = [];
            p.settings.recent_queries = [q].concat(p.settings.recent_queries.filter(function (x) { return x !== q; })).slice(0, 6);
            writePrefs(p);
        }
    }

    function escapeRe(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function highlightCard(card, hl) {
        if (!hl) {
            card.querySelectorAll("mark").forEach(function (m) { m.replaceWith(document.createTextNode(m.textContent)); });
            return;
        }
        card.querySelectorAll(".nx-rx-card-name, .nx-rx-card-desc").forEach(function (el) {
            var orig = el.getAttribute("data-plain");
            if (orig === null) { orig = el.textContent; el.setAttribute("data-plain", orig); }
            el.textContent = "";
            var re = new RegExp("(" + hl + ")", "ig");
            orig.split(re).forEach(function (s) {
                if (!s) return;
                if (s.toLowerCase() === hl) {
                    var mk = document.createElement("mark");
                    mk.textContent = s;
                    el.appendChild(mk);
                } else {
                    el.appendChild(document.createTextNode(s));
                }
            });
        });
    }

    function renderHubError(app, err, rx) {
        app.main.innerHTML = viewWrap(
            '<div class="nx-report-error">' +
            '<div class="nx-report-error-ic">' + app.ic("alert", 26) + "</div>" +
            '<div class="nx-report-error-title">' + app.esc(app.t("Could not load the Reports Center")) + "</div>" +
            '<div class="nx-report-error-msg">' + app.esc((err && err.message) || String(err)) + "</div>" +
            '<button class="nx-btn nx-btn-secondary" data-rx-back>' + app.esc(app.t("Back")) + "</button>" +
            "</div>"
        );
    }

    /* ------------------------------------------------------------------ report shell */

    function open(app, key, opts) {
        opts = opts || {};
        var rx = getRx(app);
        rx.token++;
        var token = rx.token;
        rx.lastKey = key;
        rx.meta = null;
        rx.payload = null;
        rx.filters = null;
        rx.customTitle = opts.title || "";
        rx.customDesc = opts.desc || "";

        app.state.embed = {
            type: "report", rx: true, reportKey: key,
            title: opts.title || "", icon: opts.icon || "file",
            color: opts.color || "indigo", view: app.state.view
        };
        app.state.reportLoading = true;
        bind(app, rx);
        app.main.innerHTML = shellHtml(app, key, opts);

        getCatalog(app).then(function (cat) {
            if (token !== rx.token) return;
            var meta = findReport(cat, key);
            if (!meta) {
                throw new Error(app.t("Unknown report: {0}", [key]));
            }
            rx.meta = meta;
            var filters = defaultFilters(app, cat, meta);
            if (opts.prefill) filters = mergeFilters(filters, opts.prefill);
            rx.filters = filters;
            updateShellTitle(app, rx, meta);
            renderVPills(app, rx);
            renderFilterPanel(app, rx, meta);
            return run(app, key, filters, meta, token);
        }).catch(function (err) {
            if (token === rx.token) showError(app, err, rx);
        });
    }

    function mergeFilters(base, prefill) {
        var f = {};
        for (var k in base) f[k] = base[k];
        if (prefill) {
            for (var k2 in prefill) {
                if (prefill[k2] !== undefined && prefill[k2] !== null && String(prefill[k2]) !== "") f[k2] = String(prefill[k2]);
            }
        }
        return f;
    }

    function openSaved(app, savedEl) {
        var key = savedEl.getAttribute("data-rx-saved");
        var ts = +savedEl.getAttribute("data-rx-saved-ts");
        var s = findSaved(key, ts);
        open(app, key, { prefill: s ? s.filters : null });
    }

    function shellHtml(app, key, opts) {
        var color = opts.color || "indigo";
        var icon = opts.icon || "file";
        return '<div class="nx-report nx-rx-report" data-rx-report-root>' +
            '<div class="nx-rx-vhead">' +
            '<div class="nx-rx-vhead-top">' +
            '<button class="nx-rx-vback" data-rx-back title="' + app.esc(app.t("Back to Reports Center")) + '">' + app.ic("chevron-left", 16) + "</button>" +
            '<span class="nx-rx-vic nx-ic-' + color + '" data-rx-ic>' + app.ic(icon, 18) + "</span>" +
            '<div class="nx-rx-vtitles">' +
            '<div class="nx-rx-vcrumb"><span>' + app.esc(app.t("Reports Center")) + "</span><span>" + app.ic("chevron-right", 11) + '</span><span class="is-cur" data-rx-title>…</span></div>' +
            '<div class="nx-rx-vtitle" data-rx-title2>' + app.esc(opts.title || key) + "</div>" +
            '<div class="nx-rx-vdesc" data-rx-desc>' + app.esc(app.t("Loading report…")) + "</div>" +
            "</div>" +
            '<span class="nx-rx-vcat"><span class="nx-badge nx-badge-indigo nx-rx-vmeta-inline" data-rx-cat hidden></span></span>' +
            '<span class="nx-rx-vmeta" data-rx-meta></span>' +
            '<div class="nx-rx-vhead-actions">' +
            '<button class="nx-rx-vact" data-rx-act="filters" title="' + app.esc(app.t("Toggle filters")) + '">' + app.ic("sliders", 15) + "</button>" +
            '<button class="nx-rx-vact" data-rx-act="refresh" title="' + app.esc(app.t("Refresh report")) + '">' + app.ic("refresh", 15) + "</button>" +
            "</div>" +
            "</div>" +
            '<div class="nx-rx-vpills" data-rx-vpills></div>' +
            "</div>" +
            '<div class="nx-rx-vbar">' +
            '<button class="nx-rx-vaction" data-rx-act="save" title="' + app.esc(app.t("Save view")) + '">' + app.ic("save", 13) + " " + app.esc(app.t("Save")) + "</button>" +
            '<button class="nx-rx-vaction' + (isFavorite(key) ? " is-on" : "") + '" data-rx-fav="' + app.esc(key) + '" title="' + app.esc(isFavorite(key) ? app.t("Remove favorite") : app.t("Favorite")) + '">' + app.ic("heart", 13) + " " + app.esc(app.t("Favorite")) + "</button>" +
            '<button class="nx-rx-vaction' + (isShared(key) ? " is-on" : "") + '" data-rx-share="' + app.esc(key) + '" title="' + app.esc(isShared(key) ? app.t("Unshare") : app.t("Share")) + '">' + app.ic("share", 13) + " " + app.esc(app.t("Share")) + "</button>" +
            '<button class="nx-rx-vaction' + (isPinned(key) ? " is-on" : "") + '" data-rx-pin="' + app.esc(key) + '" title="' + app.esc(isPinned(key) ? app.t("Unpin") : app.t("Pin to dashboard")) + '">' + app.ic("star", 13) + " " + app.esc(app.t("Pin")) + "</button>" +
            '<span class="nx-rx-vaction-grow"></span>' +
            '<button class="nx-rx-vaction" data-rx-act="fullscreen" title="' + app.esc(app.t("Fullscreen")) + '">' + app.ic("maximize", 13) + " " + app.esc(app.t("Fullscreen")) + "</button>" +
            '<button class="nx-rx-vaction is-danger" data-rx-act="reset" title="' + app.esc(app.t("Reset filters")) + '">' + app.ic("rotate", 13) + " " + app.esc(app.t("Reset")) + "</button>" +
            "</div>" +
            '<div class="nx-rx-vfilters" data-rx-filterpanel hidden>' +
            '<div class="nx-rx-vfilters-head">' + app.ic("sliders", 13) + " " + app.esc(app.t("Report Filters")) +
            '<span class="nx-rx-vfilters-note"></span>' +
            '<button class="nx-rx-vact" data-rx-act="filters" title="' + app.esc(app.t("Close")) + '">' + app.ic("x", 14) + "</button></div>" +
            '<div class="nx-rx-vfilters-body" data-rx-filters></div>' +
            "</div>" +
            '<div class="nx-rx-vbody" data-rx-body>' +
            loadingHtml(app, app.t("Preparing report…")) +
            "</div>" +
            '<div class="nx-rx-vsticky">' +
            '<button class="nx-rx-vaction" data-rx-act="export" title="' + app.esc(app.t("Export")) + '">' + app.ic("download", 13) + " " + app.esc(app.t("Export")) + "</button>" +
            '<button class="nx-rx-vaction" data-rx-act="print" title="' + app.esc(app.t("Print")) + '">' + app.ic("print", 13) + " " + app.esc(app.t("Print")) + "</button>" +
            '<button class="nx-rx-vaction" data-rx-act="density" title="' + app.esc(app.t("Toggle density")) + '">' + app.ic("maximize", 13) + " " + app.esc(app.t("Density")) + "</button>" +
            '<span class="nx-rx-vaction-grow"></span>' +
            '<span class="nx-rx-vruninfo" data-rx-runinfo></span>' +
            "</div>" +
            "</div>";
    }

    function fmtDuration(ms) {
        if (ms < 1000) return Math.round(ms) + "ms";
        return (ms / 1000).toFixed(2) + "s";
    }

    function updateViewerMeta(app, rx) {
        var info = app.main.querySelector("[data-rx-runinfo]");
        if (!info) return;
        var bits = [];
        if (rx.elapsedMs !== undefined && rx.elapsedMs !== null) bits.push(app.ic("zap", 12) + " " + app.esc(app.t("Executed in {0}", [fmtDuration(rx.elapsedMs)])));
        if (rx.refreshedAt) bits.push(app.ic("refresh", 12) + " " + app.esc(app.t("Refreshed {0}", [fmtTime(rx.refreshedAt)])));
        if (rx.lastGenerated) bits.push(app.ic("calendar", 12) + " " + app.esc(app.t("Data as of {0}", [rx.lastGenerated])));
        info.innerHTML = bits.join('<span class="nx-rx-vruninfo-sep"></span>');
    }

    function fmtTime(d) {
        var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
        var hh = h < 10 ? "0" + h : String(h);
        var mm = m < 10 ? "0" + m : String(m);
        var ss = s < 10 ? "0" + s : String(s);
        return hh + ":" + mm + ":" + ss;
    }

    function updateShellTitle(app, rx, meta) {
        var root = app.main.querySelector("[data-rx-report-root]");
        if (!root) return;
        var title = rx.customTitle || app.t(meta.title);
        var t = root.querySelector("[data-rx-title]");
        var t2 = root.querySelector("[data-rx-title2]");
        var d = root.querySelector("[data-rx-desc]");
        var cat = root.querySelector("[data-rx-cat]");
        var ic = root.querySelector("[data-rx-ic]");
        if (t) t.textContent = title;
        if (t2) t2.textContent = title;
        if (d) d.textContent = rx.customDesc || app.t(meta.desc || "");
        if (cat) {
            cat.textContent = app.t(meta.category || "");
            cat.hidden = false;
        }
        if (ic) ic.innerHTML = app.ic(meta.icon || "file", 18);
        if (app.state.embed) { app.state.embed.title = title; app.state.embed.icon = meta.icon; app.state.embed.color = meta.color; }
        var pinBtn = root.querySelector('[data-rx-pin="' + app.esc(meta.key) + '"]');
        refreshPinBtn(app, rx, meta.key, pinBtn);
    }

    function refreshPinBtn(app, rx, key, btn) {
        var root = app.main.querySelector("[data-rx-report-root]");
        var b = btn || (root && root.querySelector('[data-rx-pin="' + app.esc(key) + '"]'));
        if (b) b.classList.toggle("is-on", isPinned(key));
    }

    function showError(app, err, rx) {
        var body = app.main.querySelector("[data-rx-body]");
        if (body) {
            body.innerHTML =
                '<div class="nx-report-error">' +
                '<div class="nx-report-error-ic">' + app.ic("alert", 26) + "</div>" +
                '<div class="nx-report-error-title">' + app.esc(app.t("Could not open report")) + "</div>" +
                '<div class="nx-report-error-msg">' + app.esc((err && err.message) || String(err)) + "</div>" +
                '<button class="nx-btn nx-btn-secondary" data-rx-back>' + app.esc(app.t("Back to Reports Center")) + "</button>" +
                "</div>";
        }
        app.state.reportLoading = false;
    }

    function run(app, key, filters, meta, token) {
        var rx = getRx(app);
        var t0 = Date.now();
        app.state.reportLoading = true;
        return call(app, RUN_API, { report: key, filters: filters }).then(function (payload) {
            if (token !== rx.token) return;
            rx.payload = payload;
            rx.filters = filters;
            rx.elapsedMs = Date.now() - t0;
            rx.refreshedAt = new Date();
            rx.lastGenerated = (payload.meta && payload.meta.generated_at) ? String(payload.meta.generated_at) : "";
            app.state.reportLoading = false;
            renderResults(app, rx, meta, payload);
            updateViewerMeta(app, rx);
            addRecent(key, meta);
        }).catch(function (err) {
            if (token === rx.token) showError(app, err, rx);
        });
    }

    /* ------------------------------------------------------------------ filter panel */

    function filterFields(meta) {
        var f = meta.filters || [];
        if (f.indexOf("company") === -1) f = ["company"].concat(f);
        return f;
    }

    function renderFilterPanel(app, rx, meta) {
        var panel = app.main.querySelector("[data-rx-filters]");
        if (!panel) return;
        var payload = rx.payload;
        var opts = payload && payload.filters && payload.filters.options ? payload.filters.options : {};
        var f = rx.filters || {};
        var fields = filterFields(meta);
        var html = "";

        html += '<div class="nx-rx-frow"><label class="nx-rx-flabel">' + app.esc(app.t("Company")) + "</label>" +
            '<select class="nx-rx-finput nx-rx-fselect" data-rx-field="company">' + selectOptions(opts.companies, "name", f.company) + "</select></div>";

        if (fields.indexOf("date") !== -1) {
            html += '<div class="nx-rx-frow"><label class="nx-rx-flabel">' + app.esc(app.t("Period")) + "</label>" +
                '<select class="nx-rx-finput nx-rx-fselect" data-rx-field="preset">' + presetOptions(f.preset) + "</select></div>";
            html += '<div class="nx-rx-frow nx-rx-frow-inline">' +
                '<label class="nx-rx-flabel">' + app.esc(app.t("From")) + "</label>" +
                '<input class="nx-rx-finput" type="date" data-rx-field="start" value="' + app.esc(f.start || "") + '" />' +
                '<label class="nx-rx-flabel">' + app.esc(app.t("To")) + "</label>" +
                '<input class="nx-rx-finput" type="date" data-rx-field="end" value="' + app.esc(f.end || "") + '" />' +
                "</div>";
        }

        fields.forEach(function (key) {
            if (key === "company" || key === "date") return;
            var label = ENTITY_LABELS[key] || key;
            if (key === "status") {
                html += '<div class="nx-rx-frow"><label class="nx-rx-flabel">' + app.esc(app.t(label)) + "</label>" +
                    '<select class="nx-rx-finput nx-rx-fselect" data-rx-field="status">' + optionList(STATUSES, f.status) + "</select></div>";
                return;
            }
            var list = key === "customer" ? opts.customers
                : key === "supplier" ? opts.suppliers
                : key === "warehouse" ? opts.warehouses
                : key === "item_group" ? opts.item_groups
                : key === "brand" ? opts.brands
                : [];
            html += '<div class="nx-rx-frow"><label class="nx-rx-flabel">' + app.esc(app.t(label)) + "</label>" +
                '<select class="nx-rx-finput nx-rx-fselect" data-rx-field="' + app.esc(key) + '">' + optionList(list || [], f[key] || "") + "</select></div>";
        });

        html += '<div class="nx-rx-frow nx-rx-frow-actions">' +
            '<button class="nx-rx-btn nx-rx-btn-primary" data-rx-apply>' + app.ic("refresh", 13) + " " + app.esc(app.t("Apply")) + "</button>" +
            '<button class="nx-rx-btn" data-rx-reset>' + app.esc(app.t("Reset")) + "</button>" +
            "</div>";

        panel.innerHTML = html;
        var note = app.main.querySelector(".nx-rx-vfilters-note");
        if (note) note.textContent = app.t("Changes apply automatically");
    }

    function renderVPills(app, rx) {
        var wrap = app.main.querySelector("[data-rx-vpills]");
        if (!wrap) return;
        var f = rx.filters || {};
        var cur = f.preset || "custom";
        var html = "";
        PRESETS.forEach(function (p) {
            html += '<button class="nx-rx-vpill' + (p[0] === cur ? " is-on" : "") + '" data-rx-vpill="' + p[0] + '">' + app.esc(p[1]) + "</button>";
        });
        wrap.innerHTML = html;
    }

    function selectOptions(list, labelField, current) {
        var html = '<option value="">' + "-- " + "</option>";
        (list || []).forEach(function (o) {
            var v = o.name;
            var lbl = labelField && labelField !== "name" && o[labelField] ? o[labelField] + " (" + o.name + ")" : o.name;
            html += '<option value="' + escAttr(v) + '"' + (v === current ? " selected" : "") + ">" + escAttr(lbl) + "</option>";
        });
        return html;
    }

    function optionList(list, current) {
        var html = '<option value="">' + "-- " + "</option>";
        (list || []).forEach(function (v) {
            html += '<option value="' + escAttr(v) + '"' + (v === current ? " selected" : "") + ">" + escAttr(v) + "</option>";
        });
        return html;
    }

    function presetOptions(current) {
        var html = "";
        PRESETS.forEach(function (p) {
            html += '<option value="' + p[0] + '"' + (p[0] === current ? " selected" : "") + ">" + p[1] + "</option>";
        });
        return html;
    }

    function escAttr(s) {
        return String(s === null || s === undefined ? "" : s).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function applyFilters(app, rx) {
        if (!rx.meta || !rx.lastKey) return;
        var f = filtersFromForm(rx);
        rx.filters = f;
        renderVPills(app, rx);
        rx.token++;
        run(app, rx.lastKey, f, rx.meta, rx.token);
    }

    function resetFilters(app, rx) {
        if (!rx.meta) return;
        var r = presetRange("this_month");
        var f = {
            company: rx.filters ? rx.filters.company : (app.state && app.state.company) || "",
            preset: "this_month", start: dstr(r[0]), end: dstr(r[1]),
            customer: "", supplier: "", warehouse: "", item_group: "", brand: "", status: "", item: ""
        };
        rx.filters = f;
        var panel = app.main.querySelector("[data-rx-filterpanel]");
        if (panel) panel.hidden = false;
        renderFilterPanel(app, rx, rx.meta);
        renderVPills(app, rx);
        rx.token++;
        run(app, rx.lastKey, f, rx.meta, rx.token);
    }

    /* ------------------------------------------------------------------ results */

    function renderResults(app, rx, meta, payload) {
        var body = app.main.querySelector("[data-rx-body]");
        if (!body) return;

        var currency = payload.meta && payload.meta.currency;
        var html = "";
        var kpis = payload.kpis || [];
        var charts = payload.charts || [];
        var insights = payload.insights || [];
        var cols = payload.columns || [];
        var rows = payload.rows || [];
        var totals = payload.totals || {};
        var pagination = payload.pagination || {};

        html += '<div class="nx-rx-meta">' +
            "<span>" + app.ic("building", 12) + " " + app.esc(payload.meta.company || "") + "</span>" +
            "<span>" + app.ic("calendar", 12) + " " + app.esc(payload.filters.applied.from_date) + " → " + app.esc(payload.filters.applied.to_date) + "</span>" +
            (pagination.limit ? "<span>" + app.ic("layers", 12) + " " + app.esc(app.t("Limit")) + " " + app.num(pagination.limit, 0) + " · " + app.num(pagination.total_rows || 0, 0) + " " + app.esc(app.t("rows")) + "</span>" : "") +
            "</div>";

        if (kpis.length) {
            html += '<div class="nx-rx-kpis">';
            kpis.forEach(function (k) {
                html += kpiHtml(app, k, currency);
            });
            html += "</div>";
        }

        if (insights.length) {
            html += '<div class="nx-rx-insights">';
            insights.forEach(function (ins) {
                var tone = ins.tone || "info";
                var toneCls = { info: "blue", success: "green", warning: "amber", danger: "red", up: "green", down: "red" }[tone] || "blue";
                html += '<div class="nx-rx-insight nx-rx-insight-' + toneCls + '">' +
                    app.ic(ins.icon || "info", 14) + "<span>" + app.esc(ins.text || "") + "</span></div>";
            });
            html += "</div>";
        }

        if (charts.length) {
            html += '<div class="nx-rx-charts">';
            charts.forEach(function (c) {
                html += '<div class="nx-rx-chart-card" data-rx-chartcard="' + app.esc(c.key) + '">' +
                    '<div class="nx-rx-chart-head">' +
                    '<div class="nx-rx-chart-title">' + app.esc(app.t(c.title)) + "</div>" +
                    '<span class="nx-rx-chart-sub">' + app.esc(app.t(c.subtitle || c.description || "")) + "</span>" +
                    '<span class="nx-rx-chart-acts">' +
                    '<button class="nx-rx-chart-act" data-rx-chart-act="type" title="' + app.esc(app.t("Switch chart type")) + '">' + app.ic("chart", 13) + "</button>" +
                    '<button class="nx-rx-chart-act" data-rx-chart-act="legend" title="' + app.esc(app.t("Toggle legend")) + '">' + app.ic("layers", 13) + "</button>" +
                    '<button class="nx-rx-chart-act" data-rx-chart-act="download" title="' + app.esc(app.t("Download PNG")) + '">' + app.ic("download", 13) + "</button>" +
                    '<button class="nx-rx-chart-act" data-rx-chart-act="fullscreen" title="' + app.esc(app.t("Fullscreen chart")) + '">' + app.ic("maximize", 13) + "</button>" +
                    "</span>" +
                    "</div>" +
                    '<div class="nx-rx-chart" data-rx-chart="' + app.esc(c.key) + '"></div>' +
                    "</div>";
            });
            html += "</div>";
        }

        if (cols.length && rows.length) {
            var totalKeys = Object.keys(totals);
            if (totalKeys.length) {
                html += '<div class="nx-rx-totals">';
                cols.forEach(function (c) {
                    if (totals[c.key] === undefined) return;
                    html += '<div class="nx-rx-total"><span>' + app.esc(app.t(c.label)) + "</span>" +
                        "<b>" + fmtCell(app, currency, c, totals[c.key]) + "</b></div>";
                });
                html += "</div>";
            }
            var drill = payload.drill || [];
            html += '<div class="nx-rx-grid" data-rx-grid>' +
                (drill.length ? '<div class="nx-rx-grid-hint">' + app.ic("move", 12) + " " + app.esc(app.t("Double-click a row to drill into " + drill.join(", "))) + "</div>" : "") +
                "</div>";
        } else if (cols.length) {
            html += '<div class="nx-report-empty"><div class="nx-report-empty-ic">' + app.ic("search", 24) + "</div>" +
                "<div>" + app.esc(app.t("No records for the selected filters.")) + "</div></div>";
        }

        body.innerHTML = html;

        if (charts.length) {
            ensureApex().then(function () {
                if (app.state.__rx !== rx) return;
                body.querySelectorAll("[data-rx-chart]").forEach(function (el) {
                    var key = el.getAttribute("data-rx-chart");
                    var c = null;
                    charts.forEach(function (cc) { if (cc.key === key) c = cc; });
                    if (c) renderChart(app, rx, el, c, currency);
                });
            }).catch(function (err) {
                body.querySelectorAll("[data-rx-chart]").forEach(function (el) {
                    el.innerHTML = '<div class="nx-rx-chart-fallback">' + app.esc((err && err.message) || "Chart unavailable") + "</div>";
                });
            });
        }

        if (cols.length && rows.length) {
            ensureDataTable().then(function () {
                if (app.state.__rx !== rx) return;
                var mount = app.main.querySelector("[data-rx-grid]");
                if (!mount) return;
                var dtNx = {
                    t: function (k, p) { return app.t(k, p); },
                    esc: function (s) { return app.esc(s); },
                    ic: function (n, s) { return app.ic(n, s); },
                    money: function (v) { return moneyOf(currency, v); },
                    num: function (v, f) { return numOf(v, f); }
                };
                var frame = document.createElement("div");
                frame.className = "nx-rx-dt";
                mount.appendChild(frame);
                rx.dt = window.NexoraDashboard.DataTable.mount({
                    nx: dtNx,
                    table: { columns: cols, rows: rows },
                    el: frame,
                    reportName: meta.key,
                    noFit: true
                });
                if (payload.drill && payload.drill.length) {
                    mount.classList.add("has-drill");
                }
            }).catch(function (err) {
                var mount = app.main.querySelector("[data-rx-grid]");
                if (mount) mount.innerHTML = '<div class="nx-report-error">' + app.esc((err && err.message) || "Grid unavailable") + "</div>";
            });
        }
    }

    function kpiHtml(app, k, currency) {
        var value = fmtValue(app, k.format || "money", currency, k.value);
        var deltaHtml = "";
        if (k.delta !== null && k.delta !== undefined) {
            var up = k.delta >= 0;
            var cls = k.tone === "down" ? "nx-badge-red" : (k.tone === "up" ? "nx-badge-green" : "nx-badge-muted");
            deltaHtml = '<span class="nx-rx-kpi-delta"><span class="nx-badge ' + cls + '">' +
                app.ic(up ? "arrow-up" : "arrow-down", 12) + " " + app.num(Math.abs(k.delta), 1) + "%</span></span>";
        }
        return '<div class="nx-rx-kpi nx-kpi-' + app.esc(k.color || "indigo") + '">' +
            '<div class="nx-rx-kpi-top">' +
            '<span class="nx-rx-kpi-ic nx-ic-' + app.esc(k.color || "indigo") + '">' + app.ic(k.icon || "circle", 13) + "</span>" +
            '<span class="nx-rx-kpi-label">' + app.esc(app.t(k.label)) + "</span>" +
            deltaHtml +
            "</div>" +
            '<div class="nx-rx-kpi-value">' + value + "</div>" +
            (k.delta_label ? '<div class="nx-rx-kpi-sub">' + app.esc(app.t(k.delta_label)) + "</div>" : "") +
            "</div>";
    }

    function fmtCell(app, currency, col, v) {
        if (col.fieldtype === "Currency") return moneyOf(currency, v);
        if (col.fieldtype === "Percent") return numOf(v, 1) + "%";
        if (col.fieldtype === "Int") return numOf(v, 0);
        if (v === null || v === undefined) return "";
        return String(v);
    }

    function renderChart(app, rx, el, c, currency) {
        var dark = app.state && app.state.theme === "dark";
        var isBar = c.type === "bar";
        var isColumn = c.type === "column";
        var isDonut = c.type === "donut";
        var isLine = c.type === "line";
        var apexType = isBar || isColumn ? "bar" : (isDonut ? "donut" : "line");
        var formats = Array.isArray(c.formats) ? c.formats : [c.formats || "money"];
        var series = (c.series || []).map(function (s) { return { name: s.name, data: (s.data || []).map(Number) }; });
        var formatter = function (v, i) {
            return fmtValue(app, formats[i] || formats[0], currency, v);
        };

        var config = {
            chart: {
                type: apexType, height: 280, background: "transparent",
                toolbar: { show: false },
                zoom: { enabled: true, type: "x", autoScaleYaxis: true, zoomedArea: { fill: { color: "#5b63f2", opacity: 0.08 } } },
                fontFamily: "inherit",
                foreColor: dark ? "#aab3c5" : "#5b6472",
                animations: { enabled: true, speed: 420, animateGradually: { enabled: true, delay: 90 } }
            },
            colors: PALETTE,
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 2 },
            grid: { borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", strokeDashArray: 4 },
            legend: { show: true, position: "bottom", labels: { colors: dark ? "#c6cdd9" : "#39424e" } },
            tooltip: { theme: dark ? "dark" : "light", shared: true, intersect: false, y: { formatter: formatter } },
            xaxis: { categories: c.categories || [], labels: { style: { colors: dark ? "#aab3c5" : "#5b6472" } } },
            yaxis: { labels: { formatter: formatter } }
        };

        if (isBar) config.plotOptions = { bar: { horizontal: true, borderRadius: 5, barHeight: "62%" } };
        if (isColumn) config.plotOptions = { bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 } };
        if (isDonut) {
            config.labels = c.categories || [];
            config.legend.position = "right";
            config.plotOptions = {
                pie: { donut: { size: "62%", labels: { show: true, total: { show: true, label: app.t("Total"), formatter: function (w) { return moneyOf(currency, w.globals.seriesTotals.reduce(function (a, b) { return a + b; }, 0)); } } } } }
            };
        }

        var chart = null;
        try {
            chart = new window.ApexCharts(el, { series: series, ...config });
            chart.render();
            rx.charts.push(chart);
            bindChartActs(app, rx, el, c, chart, currency);
        } catch (e) {
            if (el) el.innerHTML = '<div class="nx-rx-chart-fallback">' + app.esc((e && e.message) || "Chart error") + "</div>";
        }
    }

    function bindChartActs(app, rx, el, c, chart, currency) {
        var card = el.closest(".nx-rx-chart-card");
        if (!card) return;
        card.querySelectorAll("[data-rx-chart-act]").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                chartAct(app, rx, btn, c, chart, currency, card);
            });
        });
    }

    function chartAct(app, rx, btn, c, chart, currency, card) {
        var kind = btn.getAttribute("data-rx-chart-act");
        if (kind === "legend") {
            var show = chart.opts && chart.opts.legend ? chart.opts.legend.show : true;
            chart.updateOptions({ legend: { show: !show } });
            btn.classList.toggle("is-on", !show);
            return;
        }
        if (kind === "fullscreen") {
            var full = !card.classList.contains("is-fullscreen");
            card.classList.toggle("is-fullscreen", full);
            btn.classList.toggle("is-on", full);
            chart.updateOptions({ chart: { height: full ? 520 : 280 } });
            setTimeout(function () { try { chart.resize(); } catch (e) {} }, 60);
            return;
        }
        if (kind === "download") {
            if (chart.dataURI) {
                chart.dataURI().then(function (res) {
                    if (!res || !res.imgURI) return;
                    var a = document.createElement("a");
                    a.href = res.imgURI;
                    a.download = (c.key || "chart") + ".png";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }).catch(function () {});
            }
            return;
        }
        if (kind === "type") {
            var next = nextChartType(c.type);
            var isBar2 = next === "bar" || next === "column";
            chart.updateOptions({
                chart: { type: isBar2 ? "bar" : (next === "donut" ? "donut" : "line") },
                plotOptions: isBar2 ? { bar: { horizontal: next === "bar", columnWidth: "55%", borderRadius: 5 } } : undefined,
                labels: next === "donut" ? (c.categories || []) : undefined,
                legend: { position: next === "donut" ? "right" : "bottom" }
            });
            return;
        }
    }

    function nextChartType(cur) {
        var order = ["line", "column", "bar", "donut"];
        var i = order.indexOf(cur);
        return order[(i + 1) % order.length];
    }

    /* ------------------------------------------------------------------ drill */

    function drillField(rx, key) {
        var cols = (rx.payload && rx.payload.columns) || [];
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].fieldname === key || cols[i].key === key) return cols[i].fieldname || key;
        }
        return key;
    }

    function drillInto(app, rx, row) {
        var drill = (rx.payload && rx.payload.drill) || [];
        if (!drill.length || !rx.meta || !rx.lastKey) return;
        var next = mergeFilters(rx.filters || {}, {});
        var changed = false;
        drill.forEach(function (dk) {
            var field = drillField(rx, dk);
            var v = row[field];
            if (dk === "month") {
                var m = String(v || "").slice(0, 7);
                if (m) { next.start = m + "-01"; next.end = monthEnd(m); next.preset = "custom"; changed = true; }
                return;
            }
            if (dk === "party") {
                var pf = rx.meta.key && rx.meta.key.indexOf("payables") !== -1 ? "supplier" : "customer";
                if (v !== undefined && v !== null && String(v) !== "") { next[pf] = String(v); changed = true; }
                return;
            }
            if (v !== undefined && v !== null && String(v) !== "") { next[dk] = String(v); changed = true; }
        });
        if (!changed) return;
        rx.filters = next;
        rx.token++;
        renderFilterPanel(app, rx, rx.meta);
        run(app, rx.lastKey, next, rx.meta, rx.token);
    }

    /* ------------------------------------------------------------------ actions */

    function runAction(app, rx, btn) {
        var act = btn.getAttribute("data-rx-act");
        if (act === "refresh") {
            if (rx.lastKey && rx.meta && rx.filters) {
                rx.token++;
                run(app, rx.lastKey, rx.filters, rx.meta, rx.token);
            }
            return;
        }
        if (act === "filters") {
            var panel = app.main.querySelector("[data-rx-filterpanel]");
            if (panel) panel.hidden = !panel.hidden;
            return;
        }
        if (act === "save") {
            if (rx.lastKey && rx.meta && rx.filters) {
                saveView(rx.lastKey, rx.meta, rx.filters);
                flash(btn, app.t("Saved"));
            }
            return;
        }
        if (act === "fullscreen") {
            var root = app.main.querySelector("[data-rx-report-root]");
            if (root) {
                root.classList.toggle("is-fullscreen");
                btn.classList.toggle("is-active", root.classList.contains("is-fullscreen"));
            }
            return;
        }
        if (act === "export") { toggleExportPopover(app, btn, rx); return; }
        if (act === "density") {
            rx.dense = !rx.dense;
            btn.classList.toggle("is-on", rx.dense);
            var f = app.main.querySelector("[data-rx-report-root]");
            if (f) f.classList.toggle("is-dense", rx.dense);
            return;
        }
        if (act === "reset") { resetFilters(app, rx); return; }
        if (act === "export-csv" || act === "export-excel" || act === "export-json" || act === "print") {
            doExport(app, rx, act);
            return;
        }
    }

    function toggleExportPopover(app, btn, rx) {
        var old = document.querySelector("[data-rx-export-pop]");
        if (old) { old.remove(); return; }
        var rect = btn.getBoundingClientRect();
        var items = [
            { act: "export-csv", ic: "download", label: app.t("Export CSV") },
            { act: "export-excel", ic: "file", label: app.t("Export Excel") },
            { act: "export-json", ic: "file-text", label: app.t("Export JSON") },
            { act: "print", ic: "print", label: app.t("Print report") }
        ];
        var pop = document.createElement("div");
        pop.className = "nx-rx-pop";
        pop.setAttribute("data-rx-export-pop", "");
        pop.style.top = (rect.bottom + 8) + "px";
        pop.style.left = Math.max(8, Math.min(window.innerWidth - 230, rect.left)) + "px";
        pop.innerHTML = items.map(function (it) {
            return '<button type="button" class="nx-rx-pop-item" data-rx-act="' + it.act + '">' +
                '<span class="nx-rx-pop-item-ic">' + app.ic(it.ic, 14) + "</span>" + app.esc(it.label) + "</button>";
        }).join("");
        document.body.appendChild(pop);
        pop.addEventListener("click", function (ev) {
            var it = ev.target.closest("[data-rx-act]");
            if (!it) return;
            pop.remove();
            document.removeEventListener("click", close);
            document.removeEventListener("keydown", esc);
            doExport(app, rx, it.getAttribute("data-rx-act"));
        });
        function close(ev) {
            if (ev && (ev.target.closest("[data-rx-export-pop]") || ev.target === btn)) return;
            pop.remove();
            document.removeEventListener("click", close);
            document.removeEventListener("keydown", esc);
        }
        function esc(e) { if (e.key === "Escape") close(); }
        setTimeout(function () { document.addEventListener("click", close); document.addEventListener("keydown", esc); }, 0);
    }

    function flash(btn, label) {
        if (!btn) return;
        var prev = btn.innerHTML;
        btn.innerHTML = "<span>" + label + "</span>";
        setTimeout(function () { btn.innerHTML = prev; }, 1200);
    }

    function doExport(app, rx, kind) {
        var payload = rx.payload;
        if (!payload) return;
        var cols = payload.columns || [];
        var rows = payload.rows || [];
        var filename = (payload.export && payload.export.filename) || ("nexora_" + rx.lastKey);
        if (kind === "print") { exportPrint(app, rx, payload); return; }
        if (kind === "export-json") { download(filename + ".json", JSON.stringify(payload, null, 2), "application/json"); return; }
        if (kind === "export-csv") { download(filename + ".csv", "\ufeff" + csvOf(cols, rows), "text/csv;charset=utf-8;"); return; }
        if (kind === "export-excel") { download(filename + ".xls", htmlOf(cols, rows, payload), "application/vnd.ms-excel"); return; }
    }

    function download(name, content, mime) {
        var blob = new Blob([content], { type: mime });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
    }

    function csvOf(cols, rows) {
        var lines = [];
        lines.push(cols.map(function (c) { return '"' + String(c.label).replace(/"/g, '""') + '"'; }).join(","));
        rows.forEach(function (r) {
            lines.push(cols.map(function (c) {
                var v = r[c.fieldname];
                var s = v === null || v === undefined ? "" : String(v);
                return '"' + s.replace(/"/g, '""') + '"';
            }).join(","));
        });
        return lines.join("\r\n");
    }

    function htmlOf(cols, rows, payload) {
        var head = cols.map(function (c) { return "<th>" + escAttr(c.label) + "</th>"; }).join("");
        var body = rows.map(function (r) {
            return "<tr>" + cols.map(function (c) {
                var v = r[c.fieldname];
                var cell = v === null || v === undefined ? "" : String(v);
                if (c.fieldtype === "Currency" && v !== null && v !== undefined) {
                    return '<td style="mso-number-format:\'\\#\\#\\#0\\.00\'">' + cell + "</td>";
                }
                return "<td>" + escAttr(cell) + "</td>";
            }).join("") + "</tr>";
        }).join("");
        var meta = payload.meta || {};
        var applied = payload.filters && payload.filters.applied ? payload.filters.applied : {};
        return '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8">' +
            "<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Nexora</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->" +
            "</head><body>" +
            "<h3>" + escAttr(meta.title || "") + "</h3>" +
            "<p>" + escAttr(applied.company || "") + " · " + escAttr(applied.from_date || "") + " → " + escAttr(applied.to_date || "") + "</p>" +
            '<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse">' +
            "<thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody></table></body></html>";
    }

    function exportPrint(app, rx, payload) {
        var cols = payload.columns || [];
        var rows = payload.rows || [];
        var meta = payload.meta || {};
        var applied = payload.filters && payload.filters.applied ? payload.filters.applied : {};
        var head = cols.map(function (c) { return "<th>" + escAttr(c.label) + "</th>"; }).join("");
        var body = rows.map(function (r) {
            return "<tr>" + cols.map(function (c) {
                var v = r[c.fieldname];
                var cell = v === null || v === undefined ? "" : String(v);
                return "<td>" + escAttr(cell) + "</td>";
            }).join("") + "</tr>";
        }).join("");
        var w = window.open("", "_blank");
        if (!w) return;
        w.document.write("<!doctype html><html><head><meta charset=\"utf-8\"><title>" + escAttr(meta.title || "") + "</title>" +
            "<style>body{font-family:Inter,system-ui,sans-serif;color:#1f2733;padding:28px}h3{margin:0 0 4px}p{color:#5b6472;margin:0 0 18px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f3f5f9;text-align:left;padding:8px 10px;border:1px solid #dfe3ea}td{padding:6px 10px;border:1px solid #e6e9f0}@media print{@page{margin:14mm}}</style></head><body>" +
            "<h3>" + escAttr(meta.title || "") + "</h3>" +
            "<p>" + escAttr(applied.company || "") + " · " + escAttr(applied.from_date || "") + " → " + escAttr(applied.to_date || "") + "</p>" +
            '<table><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table>" +
            "<script>window.print();setTimeout(function(){window.close();},400);</scr" + "ipt></body></html>");
        w.document.close();
    }

    /* ------------------------------------------------------------------ teardown */

    function teardown(app, rx) {
        for (var i = 0; i < rx.charts.length; i++) {
            try { rx.charts[i].destroy(); } catch (e) {}
        }
        rx.charts = [];
        rx.dt = null;
    }

    function destroy(app) {
        var rx = getRx(app);
        rx.token++;
        teardown(app, rx);
        rx.payload = null;
        rx.meta = null;
        rx.filters = null;
    }

    return {
        hub: hub,
        open: open,
        destroy: destroy
    };
})();
