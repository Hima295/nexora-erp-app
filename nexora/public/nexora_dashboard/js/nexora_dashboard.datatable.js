/*
 * Nexora Dashboard — DataTable Framework (M4).
 *
 * Self-owned, self-rendered table engine for QueryReport data. This is the ONLY
 * table renderer in Nexora: it consumes the report JSON (qr.columns + qr.data)
 * produced by ERPNext and renders a Notion/Linear/Airtable/Stripe-style table:
 * sticky header, global search, quick filters, column chooser, column freeze,
 * density switch, grouping, pagination, row selection, copy, CSV export,
 * context menu and keyboard shortcuts. The native ERPNext datatable is never
 * created (see App.__disableNativeDatatable); export/print/share keep working
 * because they read the raw report data, not the datatable DOM.
 */
window.NexoraDashboard = window.NexoraDashboard || {};
window.NexoraDashboard.DataTable = (function () {
    "use strict";

    var STATUS_LIKE = /(status|state|indicator|stage|type|mode|priority|level|kind)/i;
    var LINK_RE = /^(https?:\/\/|www\.|\/app\/)/i;
    var PAGE_OPTIONS = [25, 50, 100, 250, 0]; // 0 == all
    var COPY_CAP = 5000;

    /* ------------------------------------------------------------------ helpers */

    function toNum(v) {
        if (v === null || v === undefined || v === "") return null;
        if (typeof v === "number") return isFinite(v) ? v : null;
        var s = String(v).replace(/[^\d.\-+]/g, "");
        if (!s || s === "-" || s === "." || s === "+") return null;
        var n = parseFloat(s);
        return isFinite(n) ? n : null;
    }

    function fmt(nx, col, v) {
        var n = toNum(v);
        if (col.numeric) {
            if (n === null) return { text: "", num: null };
            if (col.fieldtype === "Currency") return { text: nx.money(n), num: n };
            if (col.fieldtype === "Percent") return { text: nx.num(n, 1) + "%", num: n };
            if (col.fieldtype === "Int") return { text: nx.num(n, 0), num: n };
            if (col.fieldtype === "Duration") return { text: String(v), num: n };
            return { text: nx.num(n, 2), num: n };
        }
        if (v === null || v === undefined) return { text: "", num: null };
        return { text: String(v), num: null };
    }

    function cmpValue(S, col, a, b) {
        if (col.numeric) {
            var na = toNum(a);
            var nb = toNum(b);
            if (na !== null && nb !== null) return na - nb;
            if (na === null && nb === null) return String(a).localeCompare(String(b));
            return na === null ? 1 : -1;
        }
        var sa = a === null || a === undefined ? "" : String(a);
        var sb = b === null || b === undefined ? "" : String(b);
        return sa.localeCompare(sb);
    }

    function statusTone(v) {
        var s = String(v).toLowerCase();
        if (/(paid|completed|delivered|success|active|approved|posted|submitted|enabled|available|resolved|done|good|in stock|in-stock|normal|settled|confirmed)/.test(s)) return "green";
        if (/(overdue|failed|expired|cancelled|canceled|rejected|closed|out of stock|out-of-stock|error|unpaid|returned|danger|void|blocked|stopped)/.test(s)) return "red";
        if (/(pending|processing|in progress|on hold|partial|awaiting|hold|draft|queued|review|estimate)/.test(s)) return "amber";
        if (/(info|new|noted|note|opened)/.test(s)) return "blue";
        return "gray";
    }

    function visibleCols(S) {
        var out = [];
        for (var i = 0; i < S.columns.length; i++) if (S.columns[i].visible) out.push(S.columns[i]);
        return out;
    }

    function distinctCols(S) {
        var out = [];
        for (var i = 0; i < S.columns.length; i++) {
            var c = S.columns[i];
            if (c.numeric || c.isCheck) continue;
            var set = {};
            var n = 0;
            for (var j = 0; j < S.rows.length; j++) {
                var v = S.rows[j][c.fieldname];
                if (v === null || v === undefined || String(v) === "") continue;
                var k = String(v);
                if (!set[k]) { set[k] = 1; n++; }
            }
            if (n > 40) continue;
            out.push({ col: c, n: n });
        }
        out.sort(function (a, b) {
            var as = a.col.statusLike ? 0 : 1;
            var bs = b.col.statusLike ? 0 : 1;
            if (as !== bs) return as - bs;
            return a.n - b.n;
        });
        return out.slice(0, 5);
    }

    /* ------------------------------------------------------------------ pipeline */

    function compute(S) {
        var items = S.all;
        var q = S.search.trim().toLowerCase();
        if (q) {
            items = [];
            for (var i = 0; i < S.all.length; i++) {
                var it = S.all[i];
                var hit = false;
                for (var k = 0; k < S.columns.length; k++) {
                    var c = S.columns[k];
                    if (!c.visible) continue;
                    var v = it.r[c.fieldname];
                    if (v !== null && v !== undefined && String(v).toLowerCase().indexOf(q) !== -1) { hit = true; break; }
                }
                if (hit) items.push(it);
            }
        }
        var qkeys = Object.keys(S.quick);
        if (qkeys.length) {
            var kept = [];
            for (var j = 0; j < items.length; j++) {
                var itj = items[j];
                var ok = true;
                for (var m = 0; m < qkeys.length; m++) {
                    var f = qkeys[m];
                    var fv = String(S.quick[f]).toLowerCase();
                    if (!fv) continue;
                    var rv = itj.r[f];
                    var sv = rv === null || rv === undefined ? "" : String(rv).toLowerCase();
                    if (sv !== fv) { ok = false; break; }
                }
                if (ok) kept.push(itj);
            }
            items = kept;
        }
        if (S.sort.key) {
            var col = S.colByKey[S.sort.key];
            var dir = S.sort.dir;
            items = items.slice().sort(function (a, b) { return cmpValue(S, col, a.r[col.fieldname], b.r[col.fieldname]) * dir; });
        }
        var groups = null;
        if (S.groupKey) groups = groupBy(S, items);
        return { items: items, groups: groups, total: items.length };
    }

    function groupBy(S, items) {
        var col = S.colByKey[S.groupKey];
        if (!col) return null;
        var map = {};
        var order = [];
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            var label = it.r[col.fieldname] === null || it.r[col.fieldname] === undefined ? "" : String(it.r[col.fieldname]);
            if (!map[label]) { map[label] = { label: label, items: [] }; order.push(label); }
            map[label].items.push(it);
        }
        var out = [];
        for (var j = 0; j < order.length; j++) out.push(map[order[j]]);
        out.sort(function (a, b) { return String(a.label).localeCompare(String(b.label)); });
        return out;
    }

    function pageCount(S, groups, total) {
        var size = S.pageSize;
        if (!size) return 1;
        return groups ? Math.max(1, Math.ceil(groups.length / size)) : Math.max(1, Math.ceil(total / size));
    }

    function pageSlice(S, groups, items) {
        var size = S.pageSize;
        if (!size) return groups || items;
        var start = S.page * size;
        if (groups) return groups.slice(start, start + size);
        return items.slice(start, start + size);
    }

    function flattenGroups(groups) {
        var out = [];
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].items.length; j++) out.push(groups[i].items[j]);
        }
        return out;
    }

    function currentItems(S) {
        if (!S.res) return [];
        return S.res.groups ? flattenGroups(S.res.groups) : S.res.items;
    }

    function activeQuickCount(S) {
        var n = 0;
        var keys = Object.keys(S.quick);
        for (var i = 0; i < keys.length; i++) if (S.quick[keys[i]]) n++;
        return n;
    }

    /* ------------------------------------------------------------------ rendering */

    function selSpan(S, i, checked) {
        return '<span class="nx-dt-cbx' + (checked ? " on" : "") + '" data-sel="' + i + '">' +
            (checked ? S.nx.ic("check", 12) : "") + "</span>";
    }

    function cellHtml(S, col, r, f) {
        var raw = r[col.fieldname];
        if (col.isCheck) {
            var on = raw === true || raw === 1 || String(raw).toLowerCase() === "yes" ||
                String(raw).toLowerCase() === "true" || String(raw).toLowerCase() === "1";
            return on
                ? '<span class="nx-dt-check">' + S.nx.ic("check", 14) + "</span>"
                : '<span class="nx-dt-dash">&mdash;</span>';
        }
        if (col.statusLike && f.text) {
            return '<span class="nx-dt-pill pill-' + statusTone(f.text) + '">' + S.nx.esc(f.text) + "</span>";
        }
        if (!col.numeric && LINK_RE.test(f.text)) {
            return '<a class="nx-dt-link" href="' + S.nx.esc(f.text) + '" target="_blank" rel="noopener">' + S.nx.esc(f.text) + "</a>";
        }
        return S.nx.esc(f.text);
    }

    function rowHtml(S, it) {
        var cols = visibleCols(S);
        var sel = S.selected.has(it.i);
        var h = '<tr class="nx-dt-row' + (sel ? " nx-dt-selected" : "") + '" data-row="' + it.i + '">';
        h += '<td class="nx-dt-cell nx-dt-sel">' + selSpan(S, it.i, sel) + "</td>";
        for (var k = 0; k < cols.length; k++) {
            var c = cols[k];
            var f = fmt(S.nx, c, it.r[c.fieldname]);
            var indent = (k === 0 && S.tree && it.r.indent) ? (it.r.indent || 0) : 0;
            var indentHtml = indent ? '<span class="nx-dt-indent" style="width:' + (indent * 18) + 'px"></span>' : "";
            h += '<td class="nx-dt-cell' + (c.numeric ? " nx-dt-num" : "") + '" data-row="' + it.i + '">' +
                indentHtml + cellHtml(S, c, it.r, f) + "</td>";
        }
        h += "</tr>";
        return h;
    }

    function theadHtml(S) {
        var cols = visibleCols(S);
        var h = "<tr>";
        h += '<th class="nx-dt-th nx-dt-sel" data-col-all>' + selSpan(S, -1, false) + "</th>";
        for (var k = 0; k < cols.length; k++) {
            var c = cols[k];
            var sorted = S.sort.key === c.fieldname;
            var icon = sorted
                ? S.nx.ic(S.sort.dir > 0 ? "arrow-up" : "arrow-down", 13)
                : S.nx.ic("chevron-down", 12);
            h += '<th class="nx-dt-th' + (c.numeric ? " nx-dt-num" : "") + '" title="' + S.nx.esc(c.label) + '">' +
                '<div class="nx-dt-th-inner"><span class="nx-dt-th-label">' + S.nx.esc(c.label) + "</span>" +
                '<span class="nx-dt-sort' + (sorted ? " is-on" : "") + '">' + icon + "</span></div></th>";
        }
        h += "</tr>";
        return h;
    }

    function totalCells(S, items) {
        var cols = visibleCols(S);
        var html = "";
        var any = false;
        for (var k = 0; k < cols.length; k++) {
            var c = cols[k];
            if (c.numeric) {
                var sum = 0;
                for (var i = 0; i < items.length; i++) {
                    var n = toNum(items[i].r[c.fieldname]);
                    if (n !== null) sum += n;
                }
                if (!any && sum !== 0) any = true;
                html += '<td class="nx-dt-cell nx-dt-num">' + S.nx.esc(fmt(S.nx, c, sum).text) + "</td>";
            } else {
                html += '<td class="nx-dt-cell"></td>';
            }
        }
        if (!any) return "";
        return '<td class="nx-dt-cell nx-dt-total-label">' + S.nx.esc(S.nx.t("Total")) + "</td>" + html;
    }

    function totalSums(S, items) {
        var cols = visibleCols(S);
        var chips = [];
        for (var k = 0; k < cols.length; k++) {
            var c = cols[k];
            if (!c.numeric) continue;
            var sum = 0;
            var has = false;
            for (var i = 0; i < items.length; i++) {
                var n = toNum(items[i].r[c.fieldname]);
                if (n !== null) { sum += n; has = true; }
            }
            if (!has) continue;
            chips.push({ label: c.label, html: S.nx.esc(fmt(S.nx, c, sum).text) });
            if (chips.length >= 4) break;
        }
        return chips;
    }

    function distinctOptions(S, fname) {
        var set = {};
        var out = [];
        for (var i = 0; i < S.rows.length; i++) {
            var v = S.rows[i][fname];
            if (v === null || v === undefined || String(v) === "") continue;
            var k = String(v);
            if (!set[k]) { set[k] = 1; out.push(k); }
        }
        return out.sort(function (a, b) { return a.localeCompare(b); });
    }

    function groupableCols(S) {
        var out = [];
        if (S.tree) return out;
        var cols = visibleCols(S);
        for (var i = 0; i < cols.length; i++) {
            if (!cols[i].numeric && !cols[i].isCheck) out.push(cols[i]);
        }
        return out;
    }

    function shellHtml(S) {
        var t = S.nx.t;
        var ic = S.nx.ic;
        var quick = S.quickCols;

        var html = '<div class="nx-dt" data-density="' + S.density + '" tabindex="-1">';

        html += '<div class="nx-dt-toolbar">' +
            '<div class="nx-dt-search">' +
            '<span class="nx-dt-search-ic">' + ic("search", 14) + "</span>" +
            '<input class="nx-dt-search-input" type="text" autocomplete="off" spellcheck="false" placeholder="' + S.nx.esc(t("Search…")) + '" data-dt-search value="' + S.nx.esc(S.search) + '">' +
            '<button class="nx-dt-search-clear" type="button" data-dt-search-clear title="' + S.nx.esc(t("Clear")) + '"' + (S.search ? "" : " hidden") + ">" + ic("x", 12) + "</button>" +
            "<kbd>/</kbd></div>";

        html += '<div class="nx-dt-tools">' +
            '<button class="nx-dt-btn' + (S.filterOpen ? " is-on" : "") + '" type="button" data-dt-act="filters" title="' + S.nx.esc(t("Quick filters")) + '">' +
            ic("filter", 14) + "<span>" + S.nx.esc(t("Filters")) + "</span>" +
            (quick.length ? '<span class="nx-dt-badge">' + activeQuickCount(S) + "</span>" : "") + "</button>" +
            '<button class="nx-dt-btn" type="button" data-dt-act="columns" title="' + S.nx.esc(t("Choose columns")) + '">' +
            ic("grid", 14) + "<span>" + S.nx.esc(t("Columns")) + "</span><span class=\"nx-dt-badge\">" + visibleCols(S).length + "</span></button>" +
            '<button class="nx-dt-btn' + (S.groupKey ? " is-on" : "") + '" type="button" data-dt-act="group" title="' + S.nx.esc(t("Group by")) + '">' +
            ic("layers", 14) + "<span>" + (S.groupKey && S.colByKey[S.groupKey] ? S.nx.esc(S.colByKey[S.groupKey].label) : S.nx.esc(t("Group"))) + "</span></button>" +
            '<button class="nx-dt-btn" type="button" data-dt-act="density" title="' + S.nx.esc(t(S.density === "compact" ? "Comfortable" : "Compact")) + '">' +
            ic("maximize", 14) + "</button>" +
            '<button class="nx-dt-btn" type="button" data-dt-act="copy" title="' + S.nx.esc(t("Copy selected")) + '">' +
            ic("copy", 14) + "<span>" + S.nx.esc(t("Copy")) + "</span></button>" +
            '<button class="nx-dt-btn" type="button" data-dt-act="export" title="' + S.nx.esc(t("Export CSV")) + '">' +
            ic("download", 14) + "<span>" + S.nx.esc(t("Export")) + "</span></button>" +
            "</div></div>";

        html += '<div class="nx-dt-filters" data-dt-filters' + (S.filterOpen ? "" : " hidden") + ">";
        for (var f = 0; f < quick.length; f++) {
            var fname = quick[f];
            var fcol = S.colByKey[fname];
            var cur = S.quick[fname] || "";
            var opts = distinctOptions(S, fname);
            html += '<div class="nx-dt-filter"><label>' + S.nx.esc(fcol.label) + "</label>" +
                '<select data-q="' + S.nx.esc(fname) + '"><option value="">' + S.nx.esc(t("All")) + "</option>";
            for (var o = 0; o < opts.length; o++) {
                html += '<option value="' + S.nx.esc(opts[o]) + '"' + (cur === opts[o] ? " selected" : "") + ">" + S.nx.esc(opts[o]) + "</option>";
            }
            html += "</select></div>";
        }
        var manualKeys = Object.keys(S.quick).filter(function (f) { return quick.indexOf(f) === -1; });
        for (var m = 0; m < manualKeys.length; m++) {
            var mk = manualKeys[m];
            var mcol = S.colByKey[mk];
            html += '<div class="nx-dt-chip">' + S.nx.esc((mcol ? mcol.label + ": " : "") + S.quick[mk]) +
                '<button type="button" data-chip-x="' + S.nx.esc(mk) + '" title="' + S.nx.esc(t("Clear")) + '">' + ic("x", 11) + "</button></div>";
        }
        html += "</div>";

        html += '<div class="nx-dt-scroll" data-dt-scroll>' +
            '<table class="nx-dt-table"><thead data-dt-thead></thead><tbody data-dt-tbody></tbody></table>' +
            "</div>";

        html += '<div class="nx-dt-footer">' +
            '<span class="nx-dt-info" data-dt-info></span>' +
            '<span class="nx-dt-sel" data-dt-sel hidden></span>' +
            '<span class="nx-dt-summary" data-dt-summary hidden></span>' +
            '<span class="nx-dt-grow"></span>' +
            '<span class="nx-dt-page" data-dt-page></span>' +
            '<select class="nx-dt-pagesize" data-dt-pagesize title="' + S.nx.esc(t("per page")) + '">';
        for (var p = 0; p < PAGE_OPTIONS.length; p++) {
            var pv = PAGE_OPTIONS[p];
            var pl = pv ? String(pv) : t("All");
            html += '<option value="' + (pv || "all") + '">' + S.nx.esc(pl) + "</option>";
        }
        html += "</select>" +
            '<button class="nx-dt-btn nx-dt-nav" type="button" data-dt-prev title="' + S.nx.esc(t("Previous")) + '">' + ic("chevron-left", 14) + "</button>" +
            '<button class="nx-dt-btn nx-dt-nav" type="button" data-dt-next title="' + S.nx.esc(t("Next")) + '">' + ic("chevron-right", 14) + "</button>" +
            "</div></div>";

        html += '<div class="nx-dt-pop" data-dt-pop="columns" hidden>' +
            '<div class="nx-dt-pop-head"><span>' + S.nx.esc(t("Columns")) + "</span><span class=\"nx-dt-grow\"></span>" +
            '<button type="button" class="nx-dt-pop-link" data-col-all2>' + S.nx.esc(t("All")) + "</button>" +
            '<button type="button" class="nx-dt-pop-link" data-col-none>' + S.nx.esc(t("Reset")) + "</button></div>" +
            '<div class="nx-dt-pop-list">';
        for (var c2 = 0; c2 < S.columns.length; c2++) {
            var cc = S.columns[c2];
            html += '<label class="nx-dt-crow"><input type="checkbox" data-col-toggle="' + S.nx.esc(cc.fieldname) + '"' + (cc.visible ? " checked" : "") + ">" +
                "<span>" + S.nx.esc(cc.label) + "</span>" +
                '<span class="nx-dt-cnum">' + (cc.numeric ? "123" : "abc") + "</span></label>";
        }
        html += "</div>" +
            '<div class="nx-dt-pop-foot"><span>' + S.nx.esc(t("Freeze")) + ":</span>";
        for (var fr = 0; fr <= 3; fr++) {
            var frLabel = fr === 0 ? t("None") : String(fr);
            html += '<button type="button" class="nx-dt-btn' + (S.freeze === fr ? " is-on" : "") + '" data-freeze="' + fr + '">' + S.nx.esc(frLabel) + "</button>";
        }
        html += "</div></div>";

        html += '<div class="nx-dt-pop" data-dt-pop="group" hidden><div class="nx-dt-pop-head"><span>' +
            S.nx.esc(t("Group by")) + "</span></div><div class=\"nx-dt-pop-list\">";
        var groupable = groupableCols(S);
        if (!groupable.length) {
            html += '<div class="nx-dt-crow" style="color:var(--nx-text-3)">' + S.nx.esc(t("No categorical columns")) + "</div>";
        }
        for (var g2 = 0; g2 < groupable.length; g2++) {
            var gc = groupable[g2];
            var on = S.groupKey === gc.fieldname;
            html += '<button type="button" class="nx-dt-crow" data-group="' + S.nx.esc(gc.fieldname) + '">' +
                "<span>" + (on ? S.nx.ic("check", 13) : "") + "</span>" + S.nx.esc(gc.label) + "</button>";
        }
        html += "</div></div>";

        return html;
    }

    function renderTable(S) {
        var frame = S.frame;
        var res = compute(S);
        S.res = res;
        var pc = pageCount(S, res.groups, res.total);
        if (S.page >= pc) S.page = Math.max(0, pc - 1);

        var thead = frame.querySelector("[data-dt-thead]");
        var tbody = frame.querySelector("[data-dt-tbody]");
        var cols = visibleCols(S);
        var colspan = cols.length + 1;

        thead.innerHTML = theadHtml(S);
        thead.onclick = function (e) {
            var selTh = e.target.closest("th[data-col-all]");
            if (selTh) return;
            var inner = e.target.closest(".nx-dt-th-inner");
            if (!inner) return;
            var thEl = inner.closest("th");
            var labelEl = thEl && thEl.querySelector(".nx-dt-th-label");
            if (!labelEl) return;
            var cols2 = visibleCols(S);
            var target = null;
            for (var i = 0; i < cols2.length; i++) if (cols2[i].label === labelEl.textContent) { target = cols2[i]; break; }
            if (!target) return;
            var key = target.fieldname;
            if (S.sort.key === key) {
                if (S.sort.dir > 0) S.sort.dir = -1;
                else S.sort = { key: null, dir: 1 };
            } else S.sort = { key: key, dir: 1 };
            S.page = 0;
            renderTable(S);
        };

        var html = "";
        if (!res.total) {
            html += '<tr class="nx-dt-empty-row"><td class="nx-dt-empty" colspan="' + colspan + '">' +
                '<div class="nx-dt-empty-ic">' + S.nx.ic("search", 22) + "</div>" +
                S.nx.esc(S.nx.t("No matches")) +
                '<button type="button" class="nx-dt-btn" data-dt-clear>' + S.nx.esc(S.nx.t("Clear")) + "</button></td></tr>";
        } else if (res.groups) {
            var gl = pageSlice(S, res.groups, null);
            for (var g = 0; g < gl.length; g++) {
                var gr = gl[g];
                html += '<tr class="nx-dt-group"><td class="nx-dt-cell nx-dt-sel"></td>' +
                    '<td class="nx-dt-cell" colspan="' + cols.length + '">' +
                    S.nx.esc(gr.label || S.nx.t("(empty)")) +
                    '<span class="nx-dt-gcount">' + S.nx.num(gr.items.length, 0) + "</span></td></tr>";
                for (var gi = 0; gi < gr.items.length; gi++) html += rowHtml(S, gr.items[gi]);
            }
        } else {
            var vl = pageSlice(S, null, res.items);
            for (var ri = 0; ri < vl.length; ri++) html += rowHtml(S, vl[ri]);
        }
        if (res.total && !res.groups) {
            var tc = totalCells(S, res.items);
            if (tc) html += '<tr class="nx-dt-total"><td class="nx-dt-cell nx-dt-sel"></td>' + tc + "</tr>";
        }
        tbody.innerHTML = html;

        bindRowEvents(S);
        refreshSelection(S, false);
        updateFooter(S, res, pc);
        applyFreeze(S);
        setTimeout(function () { if (frame.isConnected) applyFreeze(S); }, 60);
    }

    function bindRowEvents(S) {
        var frame = S.frame;
        var tbody = frame.querySelector("[data-dt-tbody]");
        if (!tbody) return;
        tbody.onclick = function (e) {
            var cbx = e.target.closest("[data-sel]");
            if (cbx) {
                var i = +cbx.getAttribute("data-sel");
                if (i === -1) {
                    var idxs = pageIndices(S);
                    var anyUnsel = false;
                    for (var k = 0; k < idxs.length; k++) if (!S.selected.has(idxs[k])) { anyUnsel = true; break; }
                    if (anyUnsel) { for (var j = 0; j < idxs.length; j++) S.selected.add(idxs[j]); }
                    else { for (var l = 0; l < idxs.length; l++) S.selected.delete(idxs[l]); }
                } else {
                    if (S.selected.has(i)) S.selected.delete(i);
                    else S.selected.add(i);
                }
                refreshSelection(S, false);
                return;
            }
            var clearBtn = frame.querySelector("[data-dt-clear]");
            if (clearBtn && e.target.closest("[data-dt-clear]")) {
                S.search = "";
                S.quick = {};
                S.page = 0;
                renderAll(S);
                var inp = frame.querySelector("[data-dt-search]");
                if (inp) inp.focus();
                return;
            }
            var tr = e.target.closest("tr[data-row]");
            if (!tr) return;
            var rowI = +tr.getAttribute("data-row");
            if (e.shiftKey) {
                var idxs2 = pageIndices(S);
                var last = S.lastSelected;
                var from = idxs2.indexOf(last >= 0 ? last : rowI);
                var to = idxs2.indexOf(rowI);
                if (from < 0) from = 0;
                if (to < 0) to = 0;
                var lo = Math.min(from, to);
                var hi = Math.max(from, to);
                for (var m = lo; m <= hi; m++) S.selected.add(idxs2[m]);
            } else {
                if (S.selected.has(rowI)) S.selected.delete(rowI);
                else S.selected.add(rowI);
                S.lastSelected = rowI;
            }
            refreshSelection(S, false);
        };
        tbody.oncontextmenu = function (e) {
            var tr = e.target.closest("tr[data-row]");
            if (!tr) return;
            e.preventDefault();
            var rowI = +tr.getAttribute("data-row");
            var td = e.target.closest("td[data-row]");
            var col = null;
            if (td) {
                var k = Array.prototype.indexOf.call(tr.children, td) - 1;
                var cols = visibleCols(S);
                if (k >= 0 && k < cols.length) col = cols[k];
            }
            if (!col) col = visibleCols(S)[0];
            openMenu(S, e, rowI, col);
        };
    }

    function pageIndices(S) {
        var out = [];
        var rows = S.frame.querySelectorAll("[data-dt-tbody] tr[data-row]");
        for (var i = 0; i < rows.length; i++) out.push(+rows[i].getAttribute("data-row"));
        return out;
    }

    function refreshSelection(S, updateFooterFlag) {
        var frame = S.frame;
        var idxs = pageIndices(S);
        var sel = 0;
        for (var i = 0; i < idxs.length; i++) if (S.selected.has(idxs[i])) sel++;
        var header = frame.querySelector("[data-col-all] .nx-dt-cbx");
        if (header) {
            var checked = idxs.length > 0 && sel === idxs.length;
            var indet = !checked && sel > 0;
            header.className = "nx-dt-cbx" + (checked ? " on" : indet ? " indet" : "");
            header.innerHTML = checked
                ? S.nx.ic("check", 12)
                : indet ? '<span class="nx-dt-cbx-dash"></span>' : "";
        }
        if (updateFooterFlag && S.res) {
            updateFooter(S, S.res, pageCount(S, S.res.groups, S.res.total));
        }
    }

    function updateFooter(S, res, pc) {
        var frame = S.frame;
        var size = S.pageSize;
        var info = frame.querySelector("[data-dt-info]");
        if (info) {
            if (!res.total) info.textContent = S.nx.t("No records");
            else if (res.groups) {
                var vis = pageSlice(S, res.groups, null).length;
                info.textContent = S.nx.t("Showing {0} of {1} groups", [S.nx.num(vis, 0), S.nx.num(res.groups.length, 0)]);
            } else {
                var start = size ? S.page * size + 1 : 1;
                var end = size ? Math.min(res.total, (S.page + 1) * size) : res.total;
                info.textContent = S.nx.t("Showing {0}\u2013{1} of {2}", [S.nx.num(start, 0), S.nx.num(end, 0), S.nx.num(res.total, 0)]);
            }
        }
        var n = S.selected.size;
        var selEl = frame.querySelector("[data-dt-sel]");
        if (selEl) {
            selEl.hidden = !n;
            if (n) selEl.textContent = S.nx.t("{0} selected", [S.nx.num(n, 0)]);
        }
        var sums = totalSums(S, res.items);
        var sumEl = frame.querySelector("[data-dt-summary]");
        if (sumEl) {
            sumEl.hidden = !sums.length;
            if (sums.length) {
                var sh = "";
                for (var i = 0; i < sums.length; i++) {
                    sh += '<span class="nx-dt-sumchip">' + S.nx.esc(sums[i].label) + ": <b>" + sums[i].html + "</b></span>";
                }
                sumEl.innerHTML = sh;
            }
        }
        var prev = frame.querySelector("[data-dt-prev]");
        var next = frame.querySelector("[data-dt-next]");
        var ps = frame.querySelector("[data-dt-pagesize]");
        if (prev) prev.disabled = pc <= 1 || S.page <= 0;
        if (next) next.disabled = pc <= 1 || S.page >= pc - 1;
        if (ps) ps.value = size ? String(size) : "all";
        var pageEl = frame.querySelector("[data-dt-page]");
        if (pageEl) {
            if (pc <= 1) pageEl.hidden = true;
            else {
                pageEl.hidden = false;
                pageEl.textContent = S.nx.num(S.page + 1, 0) + " / " + S.nx.num(pc, 0);
            }
        }
    }

    function refreshPopState(S) {
        var frame = S.frame;
        var cols = visibleCols(S);
        var groupBtn = frame.querySelector('[data-dt-act="group"]');
        if (groupBtn) {
            var label = S.groupKey && S.colByKey[S.groupKey] ? S.colByKey[S.groupKey].label : S.nx.t("Group");
            groupBtn.innerHTML = S.nx.ic("layers", 14) + "<span>" + S.nx.esc(label) + "</span>";
            groupBtn.classList.toggle("is-on", !!S.groupKey);
        }
        var colBtn = frame.querySelector('[data-dt-act="columns"] .nx-dt-badge');
        if (colBtn) colBtn.textContent = cols.length;
        var filBtn = frame.querySelector('[data-dt-act="filters"] .nx-dt-badge');
        if (filBtn) filBtn.textContent = activeQuickCount(S);
        var groupList = frame.querySelector('[data-dt-pop="group"] .nx-dt-pop-list');
        if (groupList) {
            var html = "";
            var groupable = groupableCols(S);
            if (!groupable.length) {
                html += '<div class="nx-dt-crow" style="color:var(--nx-text-3)">' + S.nx.esc(S.nx.t("No categorical columns")) + "</div>";
            }
            for (var i = 0; i < groupable.length; i++) {
                var gc = groupable[i];
                var on = S.groupKey === gc.fieldname;
                html += '<button type="button" class="nx-dt-crow" data-group="' + S.nx.esc(gc.fieldname) + '">' +
                    "<span>" + (on ? S.nx.ic("check", 13) : "") + "</span>" + S.nx.esc(gc.label) + "</button>";
            }
            groupList.innerHTML = html;
        }
        frame.querySelectorAll("[data-freeze]").forEach(function (b) {
            b.classList.toggle("is-on", +b.getAttribute("data-freeze") === S.freeze);
        });
    }

    /* ------------------------------------------------------------------ freeze */

    function applyFreeze(S) {
        var frame = S.frame;
        var fz = S.freeze;
        var theadRow = frame.querySelector("[data-dt-thead] tr");
        var rows = frame.querySelectorAll("[data-dt-tbody] tr[data-row], [data-dt-tbody] tr.nx-dt-total");
        var cols = visibleCols(S);
        var n = Math.min(cols.length, fz);

        if (theadRow) {
            var ths = theadRow.children;
            var x = 42;
            for (var k = 0; k < n; k++) {
                var th = ths[k + 1];
                if (th) {
                    th.classList.add("is-frozen");
                    th.style.left = x + "px";
                    x += th.offsetWidth || 120;
                }
            }
            for (var r = n + 1; r < ths.length; r++) {
                ths[r].classList.remove("is-frozen");
                ths[r].style.left = "";
            }
        }
        for (var i = 0; i < rows.length; i++) {
            var tr = rows[i];
            var tds = tr.children;
            var y = 42;
            for (var c = 0; c < n; c++) {
                var td = tds[c + 1];
                if (td) {
                    td.classList.add("is-frozen");
                    td.style.left = y + "px";
                    y += td.offsetWidth || 120;
                }
            }
            for (var u = n + 1; u < tds.length; u++) {
                tds[u].classList.remove("is-frozen");
                tds[u].style.left = "";
            }
        }
    }

    /* ------------------------------------------------------------------ copy / export */

    function tsvOf(S, items) {
        var cols = visibleCols(S);
        var head = [];
        for (var h = 0; h < cols.length; h++) head.push(cols[h].label);
        var lines = [head.join("\t")];
        for (var i = 0; i < items.length; i++) {
            var cells = [];
            for (var k = 0; k < cols.length; k++) {
                var v = items[i].r[cols[k].fieldname];
                cells.push(v === null || v === undefined ? "" : String(v).replace(/[\t\r\n]+/g, " "));
            }
            lines.push(cells.join("\t"));
        }
        return lines.join("\n");
    }

    function writeClipboard(S, text, ok) {
        var done = function () { if (ok) ok(); };
        var fallback = function () {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.cssText = "position:fixed;opacity:0;left:-9999px;";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            document.body.removeChild(ta);
            done();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, fallback);
        } else fallback();
    }

    function flashBtn(btn, html, ms) {
        var old = btn.innerHTML;
        btn.innerHTML = html;
        clearTimeout(btn.__nxFlash);
        btn.__nxFlash = setTimeout(function () { btn.innerHTML = old; }, ms || 1400);
    }

    function copyAction(S) {
        var frame = S.frame;
        var items = currentItems(S);
        if (S.selected.size) {
            items = items.filter(function (it) { return S.selected.has(it.i); });
        }
        var btn = frame.querySelector('[data-dt-act="copy"]');
        if (items.length > COPY_CAP) {
            if (btn) flashBtn(btn, '<span style="color:var(--nx-red)">' + S.nx.esc(S.nx.t("Too many rows to copy")) + "</span>");
            return;
        }
        var text = tsvOf(S, items);
        writeClipboard(S, text, function () {
            if (btn) flashBtn(btn, '<span class="nx-dt-copy-ok">' + S.nx.ic("check", 13) + " " + S.nx.esc(S.nx.t("Copied")) + "</span>");
        });
    }

    function exportCsv(S) {
        var items = currentItems(S);
        var cols = visibleCols(S);
        var lines = [];
        var head = [];
        for (var h = 0; h < cols.length; h++) head.push('"' + String(cols[h].label).replace(/"/g, '""') + '"');
        lines.push(head.join(","));
        for (var i = 0; i < items.length; i++) {
            var cells = [];
            for (var k = 0; k < cols.length; k++) {
                var v = items[i].r[cols[k].fieldname];
                var s = v === null || v === undefined ? "" : String(v);
                cells.push('"' + s.replace(/"/g, '""') + '"');
            }
            lines.push(cells.join(","));
        }
        var blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = (S.reportName || "nexora-report") + "-" + new Date().toISOString().slice(0, 10) + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
    }

    /* ------------------------------------------------------------------ context menu */

    function openMenu(S, e, rowIdx, col) {
        closeMenu(S);
        var menu = document.createElement("div");
        menu.className = "nx-dt-menu";
        var items = [];
        if (rowIdx >= 0) {
            items.push({ icon: "copy", label: S.nx.t("Copy row"), act: "copy-row", idx: rowIdx });
            items.push({ icon: "tag", label: S.nx.t("Copy value"), act: "copy-cell", idx: rowIdx, col: col });
            items.push(null);
        }
        items.push({ icon: "arrow-up", label: S.nx.t("Sort ascending"), act: "sort", col: col, dir: 1 });
        items.push({ icon: "arrow-down", label: S.nx.t("Sort descending"), act: "sort", col: col, dir: -1 });
        items.push(null);
        items.push({ icon: "incoming", label: S.nx.t("Freeze column"), act: "freeze", col: col });
        items.push({ icon: "filter", label: S.nx.t("Filter by this value"), act: "filterby", col: col, idx: rowIdx });
        items.push({ icon: "x", label: S.nx.t("Hide column"), act: "hide", col: col });

        var html = "";
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it) { html += '<div class="nx-dt-menu-sep"></div>'; continue; }
            html += '<button type="button" data-cm="' + it.act + '" data-cmi="' + i + '">' +
                S.nx.ic(it.icon, 14) + S.nx.esc(it.label) + "</button>";
        }
        menu.innerHTML = html;
        document.body.appendChild(menu);
        menu.addEventListener("click", function (ev) {
            var b = ev.target.closest("[data-cm]");
            if (!b) return;
            var entry = items[+b.getAttribute("data-cmi")];
            if (entry) runMenuAction(S, entry);
        });
        var x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 10);
        var y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 10);
        menu.style.left = Math.max(6, x) + "px";
        menu.style.top = Math.max(6, y) + "px";
        S.menu = menu;
    }

    function runMenuAction(S, entry) {
        closeMenu(S);
        if (entry.act === "copy-row") {
            var it = findItem(S, entry.idx);
            if (it) writeClipboard(S, tsvOf(S, [it]));
        } else if (entry.act === "copy-cell") {
            var it2 = findItem(S, entry.idx);
            if (it2) {
                var v = it2.r[entry.col.fieldname];
                writeClipboard(S, v === null || v === undefined ? "" : String(v));
            }
        } else if (entry.act === "sort") {
            S.sort = { key: entry.col.fieldname, dir: entry.dir };
            S.page = 0;
            renderTable(S);
        } else if (entry.act === "freeze") {
            var cols = visibleCols(S);
            var pos = cols.indexOf(entry.col);
            S.freeze = pos >= 0 ? pos + 1 : S.freeze;
            renderTable(S);
            refreshPopState(S);
        } else if (entry.act === "filterby") {
            var it3 = entry.idx >= 0 ? findItem(S, entry.idx) : null;
            var val = it3 && entry.col ? String(it3.r[entry.col.fieldname]) : "";
            if (val) {
                S.quick[entry.col.fieldname] = val;
                S.page = 0;
                renderAll(S);
            }
        } else if (entry.act === "hide") {
            entry.col.visible = false;
            if (S.groupKey === entry.col.fieldname) S.groupKey = null;
            S.page = 0;
            renderTable(S);
            refreshPopState(S);
        }
    }

    function findItem(S, i) {
        var items = S.res ? currentItems(S) : S.all;
        for (var k = 0; k < items.length; k++) if (items[k].i === i) return items[k];
        return null;
    }

    function closeMenu(S) {
        if (S.menu) {
            if (S.menu.parentNode) S.menu.parentNode.removeChild(S.menu);
            S.menu = null;
        }
    }

    /* ------------------------------------------------------------------ shell + binds */

    function bindShell(S) {
        var frame = S.frame;
        var t = S.nx.t;

        var search = frame.querySelector("[data-dt-search]");
        var searchDebounce = null;
        search.addEventListener("input", function () {
            S.search = search.value;
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(function () {
                S.page = 0;
                renderTable(S);
                frame.querySelector("[data-dt-search-clear]").hidden = !S.search;
            }, 140);
        });
        search.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                S.search = "";
                search.value = "";
                S.page = 0;
                renderTable(S);
                frame.querySelector("[data-dt-search-clear]").hidden = true;
            }
            e.stopPropagation();
        });
        frame.querySelector("[data-dt-search-clear]").addEventListener("click", function () {
            S.search = "";
            search.value = "";
            S.page = 0;
            renderTable(S);
            frame.querySelector("[data-dt-search-clear]").hidden = true;
            search.focus();
        });

        frame.querySelectorAll("[data-dt-act]").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var act = btn.getAttribute("data-dt-act");
                if (act === "filters") {
                    S.filterOpen = !S.filterOpen;
                    var strip = frame.querySelector("[data-dt-filters]");
                    if (strip) strip.hidden = !S.filterOpen;
                    btn.classList.toggle("is-on", S.filterOpen);
                } else if (act === "columns") {
                    togglePop(S, "columns");
                } else if (act === "group") {
                    togglePop(S, "group");
                } else if (act === "density") {
                    S.density = S.density === "compact" ? "comfortable" : "compact";
                    var dt = frame.querySelector(".nx-dt");
                    if (dt) dt.setAttribute("data-density", S.density);
                    btn.title = t(S.density === "compact" ? "Comfortable" : "Compact");
                } else if (act === "copy") {
                    copyAction(S);
                } else if (act === "export") {
                    exportCsv(S);
                }
            });
        });

        frame.querySelectorAll("[data-q]").forEach(function (sel) {
            sel.addEventListener("change", function () {
                var f = sel.getAttribute("data-q");
                var v = sel.value;
                if (v) S.quick[f] = v;
                else delete S.quick[f];
                S.page = 0;
                renderTable(S);
                refreshPopState(S);
            });
        });

        frame.querySelectorAll("[data-chip-x]").forEach(function (b) {
            b.addEventListener("click", function () {
                delete S.quick[b.getAttribute("data-chip-x")];
                S.page = 0;
                renderAll(S);
            });
        });

        frame.querySelector("[data-col-all2]").addEventListener("click", function () {
            S.columns.forEach(function (c) { c.visible = true; });
            renderTable(S);
            refreshPopState(S);
        });
        frame.querySelector("[data-col-none]").addEventListener("click", function () {
            S.columns.forEach(function (c) { c.visible = false; });
            renderTable(S);
            refreshPopState(S);
        });
        frame.querySelectorAll("[data-col-toggle]").forEach(function (cb) {
            cb.addEventListener("change", function () {
                var f = cb.getAttribute("data-col-toggle");
                var col = S.colByKey[f];
                if (col) col.visible = cb.checked;
                if (!cb.checked && S.groupKey === f) S.groupKey = null;
                renderTable(S);
                refreshPopState(S);
            });
        });
        frame.querySelectorAll("[data-freeze]").forEach(function (b) {
            b.addEventListener("click", function () {
                S.freeze = +b.getAttribute("data-freeze");
                renderTable(S);
                refreshPopState(S);
            });
        });
        frame.querySelectorAll("[data-group]").forEach(function (b) {
            b.addEventListener("click", function () {
                var f = b.getAttribute("data-group");
                S.groupKey = S.groupKey === f ? null : f;
                S.page = 0;
                renderAll(S);
            });
        });

        frame.querySelector("[data-dt-prev]").addEventListener("click", function () {
            if (S.page > 0) { S.page--; renderTable(S); }
        });
        frame.querySelector("[data-dt-next]").addEventListener("click", function () {
            var res = S.res || compute(S);
            var pc = pageCount(S, res.groups, res.total);
            if (S.page < pc - 1) { S.page++; renderTable(S); }
        });
        frame.querySelector("[data-dt-pagesize]").addEventListener("change", function (e) {
            var v = e.target.value;
            S.pageSize = v === "all" ? 0 : +v;
            S.page = 0;
            renderTable(S);
        });
    }

    function togglePop(S, name) {
        var frame = S.frame;
        var pop = frame.querySelector('[data-dt-pop="' + name + '"]');
        if (!pop) return;
        var wasOpen = !pop.hidden;
        frame.querySelectorAll(".nx-dt-pop").forEach(function (p) { p.hidden = true; });
        pop.hidden = wasOpen;
    }

    function closePops(S) {
        S.frame.querySelectorAll(".nx-dt-pop").forEach(function (p) { p.hidden = true; });
    }

    function fitScroll(S) {
        var sc = S.frame.querySelector("[data-dt-scroll]");
        if (!sc) return;
        var top = S.frame.getBoundingClientRect().top;
        var h = window.innerHeight - top - 56;
        sc.style.height = Math.max(180, Math.floor(h)) + "px";
    }

    function bindGlobal(S) {
        var frame = S.frame;
        var popWatcher = function (ev) {
            if (!frame.isConnected) { document.removeEventListener("mousedown", popWatcher, true); return; }
            if (frame.contains(ev.target)) return;
            closePops(S);
            closeMenu(S);
        };
        document.addEventListener("mousedown", popWatcher, true);

        var keyHandler = function (ev) {
            if (!frame.isConnected) { document.removeEventListener("keydown", keyHandler, true); return; }
            var tgt = ev.target;
            var typing = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.tagName === "SELECT" || tgt.isContentEditable);
            if (ev.key === "Escape") {
                if (S.menu) { closeMenu(S); return; }
                if (frame.querySelector(".nx-dt-pop:not([hidden])")) { closePops(S); return; }
                if (S.selected.size) {
                    S.selected.clear();
                    S.lastSelected = -1;
                    refreshSelection(S, true);
                }
                return;
            }
            if (typing) return;
            if (ev.key === "/") {
                ev.preventDefault();
                var inp = frame.querySelector("[data-dt-search]");
                if (inp) inp.focus();
                return;
            }
            if (ev.key === "f" || ev.key === "F") {
                ev.preventDefault();
                var fbtn = frame.querySelector('[data-dt-act="filters"]');
                if (fbtn) fbtn.click();
                return;
            }
            if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "a") {
                ev.preventDefault();
                S.selected.clear();
                var items = currentItems(S);
                for (var i = 0; i < items.length; i++) S.selected.add(items[i].i);
                refreshSelection(S, true);
                return;
            }
            if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "c") {
                copyAction(S);
                return;
            }
        };
        document.addEventListener("keydown", keyHandler, true);

        var fit = function () {
            if (frame.isConnected) fitScroll(S);
        };
        window.addEventListener("resize", fit);
        if (typeof ResizeObserver !== "undefined") {
            var ro = new ResizeObserver(fit);
            ro.observe(frame);
        }
    }

    function renderAll(S) {
        var frame = S.frame;
        frame.innerHTML = shellHtml(S);
        bindShell(S);
        renderTable(S);
        fitScroll(S);
    }

    /* ------------------------------------------------------------------ mount */

    function mount(opts) {
        var nx = opts.nx;
        var table = opts.table;
        var frame = opts.el;
        if (!nx || !table || !frame) return null;
        frame.innerHTML = "";

        var columns = [];
        var seen = {};
        table.columns.forEach(function (c) {
            var key = c.fieldname || c.label || "col";
            if (seen[key]) key = key + "_" + columns.length;
            seen[key] = 1;
            var isCheck = c.fieldtype === "Check";
            var label = c.label || key;
            columns.push({
                fieldname: key,
                label: label,
                fieldtype: c.fieldtype || "Data",
                numeric: !!c.numeric,
                isCheck: isCheck,
                statusLike: !isCheck && !c.numeric && STATUS_LIKE.test(label),
                visible: true
            });
        });

        var S = {
            nx: nx,
            frame: frame,
            reportName: opts.reportName || "",
            rows: table.rows,
            all: table.rows.map(function (r, i) { return { r: r, i: i }; }),
            columns: columns,
            colByKey: {},
            search: "",
            quick: {},
            sort: { key: null, dir: 1 },
            groupKey: null,
            pageSize: 50,
            page: 0,
            freeze: 0,
            density: "compact",
            filterOpen: false,
            selected: new Set(),
            lastSelected: -1,
            tree: !!table.tree,
            res: null,
            menu: null,
            quickCols: []
        };
        columns.forEach(function (c) { S.colByKey[c.fieldname] = c; });
        S.quickCols = distinctCols(S).map(function (d) { return d.col.fieldname; });

        frame.__nxdt = S;
        bindGlobal(S);
        renderAll(S);
        return S;
    }

    return { mount: mount };
})();
