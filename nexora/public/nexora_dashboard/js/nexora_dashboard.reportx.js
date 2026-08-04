/*
 * Nexora Dashboard — ReportX analytics module.
 *
 * Presentation-only layer that turns any already-loaded ERPNext report into a
 * native Nexora analytics experience. ERPNext only provides the data; this
 * module computes and renders KPIs, interactive charts, insights, warnings, a
 * summary strip and an export/share panel.
 *
 * Pure functions + a tiny DOM layer. No ERPNext logic is touched.
 */
window.NexoraDashboard = window.NexoraDashboard || {};
window.NexoraDashboard.ReportX = (function () {
    "use strict";

    var NUMERIC_TYPES = ["Currency", "Float", "Int", "Percent", "Duration", "Rating"];

    // ------------------------------------------------------------------ data layer

    // Parse any value into a plain number. Handles formatted strings like
    // "1,234.50 SDG" as well as raw numbers/dates-are-not-parsed-here.
    function toNum(v) {
        if (v === null || v === undefined || v === "") return NaN;
        if (typeof v === "number") return isFinite(v) ? v : NaN;
        var s = String(v).replace(/[^\d.\-+]/g, "");
        if (!s || s === "-" || s === "." || s === "+") return NaN;
        var n = parseFloat(s);
        return isFinite(n) ? n : NaN;
    }

    function hasVal(v) {
        return v !== null && v !== undefined && String(v).trim() !== "";
    }

    // Normalize an ERPNext date (YYYY-MM-DD or Date) into a local Date.
    function toDate(v) {
        if (!v) return null;
        var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v).trim());
        if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
        var d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    }

    // Read the report table. Prefers the QueryReport model (qr.columns + qr.data)
    // and falls back to the rendered datatable's datamanager. Presentation only.
    function extract(qr) {
        var columns = [];
        var rows = [];
        if (!qr) return { columns: columns, rows: rows };

        var cols = (qr.columns || []).filter(function (c) {
            return c && !c.hidden && (c.fieldname || c.id);
        });
        var data = qr.data;

        if (!data && qr.datatable && qr.datatable.datamanager) {
            var dm = qr.datatable.datamanager;
            var dmCols = (dm.getColumns ? dm.getColumns() : null) || dm.columns || [];
            cols = dmCols.filter(function (c) {
                return c && !c.hidden && (c.fieldname || c.id);
            });
            var dmRows = (dm.getRows ? dm.getRows() : null) || dm.data || [];
            data = dmRows.map(function (r) {
                var o = {};
                cols.forEach(function (c, i) {
                    var cell = r[i];
                    o[c.id || c.fieldname] = cell && cell.raw_value !== undefined ? cell.raw_value : cell;
                });
                return o;
            });
        }

        if (!Array.isArray(data)) data = [];

        // Drop a trailing "Total" row added by the report engine.
        if (qr.raw_data && qr.raw_data.add_total_row && data.length) {
            data = data.slice(0, -1);
        }

        var cc = [];
        cols.forEach(function (c) {
            var ft = String(c.fieldtype || "Data");
            cc.push({
                fieldname: c.fieldname || c.id || "",
                label: c.name || c.label || c.id || c.fieldname || "",
                fieldtype: ft,
                numeric: NUMERIC_TYPES.indexOf(ft) !== -1
            });
        });

        var isTree = !!(qr.tree_report) || data.some(function (r) { return r && r.indent !== undefined; });

        // Tree reports carry aggregate parents; counting children double-counts.
        // Analytics therefore use top-level (summary) rows only.
        var aggRows = data;
        if (isTree) {
            aggRows = data.filter(function (r) {
                return r && (r.indent === undefined || r.indent === 0 || r.indent === null);
            });
        }

        return {
            columns: cc,
            rows: data,
            aggRows: aggRows,
            tree: isTree
        };
    }

    // Aggregations reused by KPIs / insights / warnings.
    function stats(columns, rows) {
        var total = rows.length;
        var st = {
            rowCount: total,
            colCount: columns.length,
            numeric: [],
            categorical: []
        };
        columns.forEach(function (col) {
            if (col.numeric) {
                var count = 0, sum = 0, min = Infinity, max = -Infinity, distinct = {};
                rows.forEach(function (r) {
                    var v = toNum(r[col.fieldname]);
                    if (isNaN(v)) return;
                    count++;
                    sum += v;
                    if (v < min) min = v;
                    if (v > max) max = v;
                    distinct[String(v)] = 1;
                });
                if (count) {
                    st.numeric.push({
                        fieldname: col.fieldname,
                        label: col.label,
                        fieldtype: col.fieldtype,
                        count: count,
                        sum: sum,
                        avg: sum / count,
                        min: count ? min : 0,
                        max: count ? max : 0,
                        distinct: Object.keys(distinct).length
                    });
                }
            } else {
                var counts = {}, blank = 0;
                rows.forEach(function (r) {
                    var v = r[col.fieldname];
                    if (!hasVal(v)) { blank++; return; }
                    var k = String(v);
                    counts[k] = (counts[k] || 0) + 1;
                });
                st.categorical.push({
                    fieldname: col.fieldname,
                    label: col.label,
                    fieldtype: col.fieldtype,
                    blank: blank,
                    distinct: Object.keys(counts).length,
                    counts: counts
                });
            }
        });
        return st;
    }

    // ------------------------------------------------------------------ series

    function pad2(n) { return n < 10 ? "0" + n : "" + n; }

    function dayKey(d) {
        return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    }

    function fmtDate(d) {
        try {
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch (e) { return String(d.getDate()); }
    }

    function fmtMonth(y, m) {
        try {
            return new Date(y, m, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } catch (e) { return String(y); }
    }

    function fmtPeriod(d) {
        try {
            return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } catch (e) { return String(d.getFullYear()); }
    }

    function buildTimeSeries(rows, dateCol, numCol) {
        var map = {};
        rows.forEach(function (r) {
            var d = toDate(r[dateCol.fieldname]);
            if (!d) return;
            var v = toNum(r[numCol.fieldname]);
            if (isNaN(v)) return;
            var k = dayKey(d);
            map[k] = (map[k] || 0) + v;
        });
        var keys = Object.keys(map).sort();
        if (!keys.length) return null;
        if (keys.length > 26) {
            var mm = {};
            keys.forEach(function (k) {
                var mk = k.slice(0, 7);
                mm[mk] = (mm[mk] || 0) + map[k];
            });
            var mKeys = Object.keys(mm).sort();
            return {
                kind: "line",
                title: numCol.label + " · " + dateCol.label,
                xLabel: dateCol.label,
                yLabel: numCol.label,
                isMoney: numCol.fieldtype === "Currency",
                points: mKeys.map(function (mk) {
                    var p = mk.split("-");
                    return { label: fmtMonth(+p[0], +p[1] - 1), value: mm[mk] };
                })
            };
        }
        return {
            kind: "line",
            title: numCol.label + " · " + dateCol.label,
            xLabel: dateCol.label,
            yLabel: numCol.label,
            isMoney: numCol.fieldtype === "Currency",
            points: keys.map(function (k) {
                var p = k.split("-");
                return { label: fmtDate(new Date(+p[0], +p[1] - 1, +p[2])), value: map[k] };
            })
        };
    }

    function buildCategorySeries(rows, catCol, numCol, countsOnly) {
        var map = {};
        rows.forEach(function (r) {
            var v = r[catCol.fieldname];
            var k = hasVal(v) ? String(v) : "(blank)";
            var val;
            if (countsOnly) {
                val = 1;
            } else {
                val = toNum(r[numCol.fieldname]);
                if (isNaN(val)) return;
            }
            map[k] = (map[k] || 0) + val;
        });
        var sorted = Object.keys(map).map(function (k) {
            return { label: k, value: map[k] };
        }).sort(function (a, b) { return b.value - a.value; }).slice(0, 12);
        if (sorted.length < 2) return null;
        return {
            kind: "bar",
            title: countsOnly
                ? catCol.label + " · " + "Frequency"
                : catCol.label + " by " + numCol.label,
            xLabel: catCol.label,
            yLabel: numCol ? numCol.label : null,
            isMoney: numCol ? numCol.fieldtype === "Currency" : false,
            points: sorted
        };
    }

    function buildSeries(nx, columns, st, rows) {
        var charts = [];
        var n = st.numeric[0];
        var dateCol = columns.filter(function (c) {
            return c.fieldtype === "Date";
        })[0];
        var catCol = st.categorical.filter(function (c) {
            return c.distinct >= 2 && c.distinct <= 40 &&
                (c.blank / Math.max(1, rows.length)) < 0.6;
        })[0];

        if (n && dateCol) {
            var ts = buildTimeSeries(rows, dateCol, n);
            if (ts && ts.points.length >= 2) charts.push(ts);
        }
        if (n && catCol && charts.length < 2) {
            var cs = buildCategorySeries(rows, catCol, n, false);
            if (cs) charts.push(cs);
        }
        if (!n && catCol && charts.length < 2) {
            var cs2 = buildCategorySeries(rows, catCol, null, true);
            if (cs2) charts.push(cs2);
        }
        return charts;
    }

    // ------------------------------------------------------------------ model builders

    function moneyOrNum(nx, col, v) {
        return col && col.fieldtype === "Currency" ? nx.money(v) : nx.num(v, 2);
    }

    function buildKpis(nx, st, charts) {
        var kpis = [];
        kpis.push({
            icon: "layers", tone: "indigo",
            label: nx.t("Records"),
            value: nx.num(st.rowCount, 0),
            sub: nx.t("{0} columns", [nx.num(st.colCount, 0)])
        });
        var n = st.numeric[0];
        var line = null;
        if (charts) {
            for (var i = 0; i < charts.length; i++) {
                if (charts[i].kind === "line") { line = charts[i]; break; }
            }
        }
        if (n) {
            kpis.push({
                icon: "wallet", tone: "green",
                label: nx.t("Total") + " · " + n.label,
                value: moneyOrNum(nx, n, n.sum),
                sub: nx.t("across {0} entries", [nx.num(n.count, 0)]),
                spark: line ? line.points.map(function (p) { return p.value; }) : null
            });
            kpis.push({
                icon: "chart", tone: "blue",
                label: nx.t("Average") + " · " + n.label,
                value: moneyOrNum(nx, n, n.avg),
                sub: nx.t("per entry")
            });
            kpis.push({
                icon: "arrow-up", tone: "teal",
                label: nx.t("Peak") + " · " + n.label,
                value: moneyOrNum(nx, n, n.max),
                sub: ""
            });
        } else if (st.categorical.length) {
            var c = st.categorical[0];
            kpis.push({
                icon: "tag", tone: "purple",
                label: nx.t("Distinct") + " · " + c.label,
                value: nx.num(c.distinct, 0),
                sub: nx.t("unique values")
            });
            if (c.blank) {
                kpis.push({
                    icon: "alert", tone: "yellow",
                    label: nx.t("Missing") + " · " + c.label,
                    value: nx.num(c.blank, 0),
                    sub: nx.t("blank values")
                });
            }
        }
        return kpis.slice(0, 4);
    }

    function buildInsights(nx, st, charts, table) {
        var list = [];
        var n = st.numeric[0];
        var s0 = charts[0];
        if (s0 && s0.points && s0.points.length) {
            var top = s0.points[0];
            var sum = 0;
            s0.points.forEach(function (p) { if (p.value > top.value) top = p; sum += p.value; });
            if (s0.kind === "bar") {
                list.push({
                    tone: "green", icon: "star",
                    title: nx.t("Top {0}", [s0.xLabel]),
                    text: top.label + " — " + moneyOrNum(nx, n, top.value)
                });
                if (sum > 0 && top.value > 0) {
                    var share = Math.round((top.value / sum) * 100);
                    if (share >= 20) {
                        list.push({
                            tone: "indigo", icon: "users",
                            title: nx.t("Concentration"),
                            text: nx.t("{0}% of {1} comes from a single {2}",
                                [share, s0.yLabel || nx.t("total"), s0.xLabel])
                        });
                    }
                }
            } else if (s0.kind === "line") {
                list.push({
                    tone: "green", icon: "zap",
                    title: nx.t("Peak period"),
                    text: top.label + " — " + moneyOrNum(nx, n, top.value)
                });
                var first = s0.points[0].value;
                var last = s0.points[s0.points.length - 1].value;
                if (first && last) {
                    var chg = ((last - first) / Math.abs(first)) * 100;
                    list.push({
                        tone: chg >= 0 ? "green" : "red",
                        icon: chg >= 0 ? "arrow-up" : "arrow-down",
                        title: nx.t("Trend over the period"),
                        text: nx.t("{0}% {1} from start to end",
                            [Math.abs(chg).toFixed(1), chg >= 0 ? nx.t("increase") : nx.t("decline")])
                    });
                }
            }
        }
        if (n) {
            list.push({
                tone: "blue", icon: "receipt",
                title: nx.t("Average value"),
                text: nx.t("Each record averages {0}", [moneyOrNum(nx, n, n.avg)])
            });
        }
        if (n && table && table.rows && table.rows.length) {
            var best = null, bestRow = null;
            table.rows.forEach(function (r) {
                var v = toNum(r[n.fieldname]);
                if (isNaN(v)) return;
                if (!best || v > best) { best = v; bestRow = r; }
            });
            if (bestRow) {
                var cat = null;
                for (var ci = 0; ci < table.columns.length; ci++) {
                    if (!table.columns[ci].numeric && table.columns[ci].fieldname !== n.fieldname) {
                        cat = table.columns[ci]; break;
                    }
                }
                var who = cat ? String(bestRow[cat.fieldname] || "") : "";
                if (who) {
                    list.push({
                        tone: "teal", icon: "star",
                        title: nx.t("Largest entry"),
                        text: trunc(who, 42) + " — " + moneyOrNum(nx, n, best)
                    });
                }
            }
        }
        if (st.categorical.length) {
            var c = st.categorical[0];
            list.push({
                tone: "purple", icon: "tag",
                title: nx.t("Spread"),
                text: nx.t("{0} distinct values across {1}",
                    [nx.num(c.distinct, 0), nx.num(st.rowCount, 0)])
            });
        }
        return list.slice(0, 5);
    }

    function buildWarnings(nx, st, qr) {
        var list = [];
        var total = Math.max(1, st.rowCount);
        st.numeric.forEach(function (c) {
            var blank = total - c.count;
            var pct = Math.round((blank / total) * 100);
            if (pct >= 40) {
                list.push({
                    tone: "yellow",
                    text: nx.t("{0}: {1}% of values are empty", [c.label, pct])
                });
            }
        });
        st.categorical.forEach(function (c) {
            if (!c.blank) return;
            var pct = Math.round((c.blank / total) * 100);
            if (pct >= 40) {
                list.push({
                    tone: "yellow",
                    text: nx.t("{0}: {1}% of values are empty", [c.label, pct])
                });
            }
        });
        if (qr && qr.tree_report) {
            list.push({
                tone: "blue",
                text: nx.t("Tree report — analytics reflect top-level rows only.")
            });
        }
        if (st.rowCount >= 90000) {
            list.push({
                tone: "yellow",
                text: nx.t("Very large dataset — charts may be sampled.")
            });
        }
        return list;
    }

    function buildPeriod(columns, rows) {
        var dateCol = null;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].fieldtype === "Date") { dateCol = columns[i]; break; }
        }
        if (!dateCol) return null;
        var min = null, max = null;
        rows.forEach(function (r) {
            var d = toDate(r[dateCol.fieldname]);
            if (!d) return;
            if (!min || d < min) min = d;
            if (!max || d > max) max = d;
        });
        if (!min || !max) return null;
        return { start: min, end: max };
    }

    function buildSummary(nx, st, qr, refreshedAt, period) {
        var items = [];
        items.push({ icon: "layers", label: nx.t("Records"), value: nx.num(st.rowCount, 0) });
        items.push({ icon: "grid", label: nx.t("Columns"), value: nx.num(st.colCount, 0) });
        if (st.numeric.length) {
            items.push({
                icon: "net",
                label: nx.t("Total value"),
                value: moneyOrNum(nx, st.numeric[0], st.numeric[0].sum)
            });
        }
        if (period) {
            items.push({
                icon: "clock",
                label: nx.t("Period"),
                value: fmtPeriod(period.start) + " – " + fmtPeriod(period.end)
            });
        }
        var name = (qr && (qr.report_name || (qr.report_doc && qr.report_doc.name))) ||
            (nx.state.embed && nx.state.embed.title) || "";
        if (name) items.push({ icon: "file", label: nx.t("Source"), value: name });
        var rel = refreshedAt ? nx.__relTime(refreshedAt) : nx.t("just now");
        items.push({ icon: "refresh", label: nx.t("Updated"), value: rel });
        return items;
    }

    function buildModel(nx, table, qr) {
        var st = stats(table.columns, table.aggRows);
        var charts = buildSeries(nx, table.columns, st, table.aggRows);
        var period = buildPeriod(table.columns, table.aggRows);
        return {
            stats: st,
            charts: charts,
            period: period,
            kpis: buildKpis(nx, st, charts),
            insights: buildInsights(nx, st, charts, table),
            warnings: buildWarnings(nx, st, qr),
            summary: buildSummary(nx, st, qr, nx.state.__reportRefreshedAt || new Date(), period)
        };
    }

    // ------------------------------------------------------------------ format helpers

    function niceCeil(v) {
        if (v <= 0) return 1;
        var exp = Math.floor(Math.log10(v));
        var base = Math.pow(10, exp);
        var f = v / base;
        var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
        return n * base;
    }

    function fmtShort(v) {
        if (v === null || v === undefined || isNaN(v)) return "";
        var abs = Math.abs(v);
        var sign = v < 0 ? "-" : "";
        if (abs >= 1e9) return sign + (abs / 1e9).toFixed(abs >= 1e10 ? 0 : 1) + "B";
        if (abs >= 1e6) return sign + (abs / 1e6).toFixed(abs >= 1e7 ? 0 : 1) + "M";
        if (abs >= 1e3) return sign + (abs / 1e3).toFixed(abs >= 1e5 ? 0 : 1) + "K";
        if (Number.isInteger(v)) return String(v);
        return sign + Math.round(abs * 100) / 100;
    }

    function trunc(s, n) {
        s = String(s == null ? "" : s);
        return s.length > n ? s.slice(0, n) + "…" : s;
    }

    // ------------------------------------------------------------------ renderers

    function renderSpark(vals) {
        if (!vals || vals.length < 2) return "";
        var w = 96, h = 32;
        var min = Math.min.apply(null, vals);
        var max = Math.max.apply(null, vals);
        var span = Math.max(1e-9, max - min);
        var pts = vals.map(function (v, i) {
            var x = 2 + (i / (vals.length - 1)) * (w - 8);
            var y = h - 5 - ((v - min) / span) * (h - 10);
            return x.toFixed(1) + "," + y.toFixed(1);
        }).join(" ");
        var last = pts.split(" ").pop().split(",");
        return '<svg class="nx-kpi-spark" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '">' +
            '<polyline class="nx-kpi-spark-line" points="' + pts + '"></polyline>' +
            '<circle class="nx-kpi-spark-dot" cx="' + last[0] + '" cy="' + last[1] + '" r="2"></circle>' +
            "</svg>";
    }

    function renderKpis(nx, kpis) {
        return '<div class="nx-an-kpis">' + kpis.map(function (k) {
            return '<div class="nx-an-kpi">' +
                '<span class="nx-an-kpi-ic nx-ic-' + k.tone + '">' + nx.ic(k.icon, 16) + "</span>" +
                "<div>" +
                '<div class="nx-an-kpi-label">' + nx.esc(k.label) + "</div>" +
                '<div class="nx-an-kpi-value">' + k.value + "</div>" +
                (k.sub ? '<div class="nx-an-kpi-sub">' + nx.esc(k.sub) + "</div>" : "") +
                "</div>" +
                (k.spark ? renderSpark(k.spark) : "") +
                "</div>";
        }).join("");
    }

    function renderCharts(nx, charts) {
        return '<section class="nx-an-sec nx-an-charts">' +
            '<div class="nx-an-sec-head">' +
            '<span class="nx-an-sec-ic nx-ic-indigo">' + nx.ic("chart", 15) + "</span>" +
            '<span class="nx-an-sec-title">' + nx.esc(nx.t("Trends & Breakdown")) + "</span>" +
            '<span class="nx-an-sec-note">' + nx.esc(nx.t("Interactive — hover for details")) + "</span>" +
            "</div>" +
            '<div class="nx-an-charts-grid">' +
            charts.map(function (c, i) {
                return '<div class="nx-an-chart">' +
                    '<div class="nx-an-chart-head">' +
                    '<div class="nx-an-chart-title">' + nx.esc(c.title) + "</div>" +
                    '<span class="nx-chart-tools">' +
                    '<button class="nx-chart-ctl" type="button" data-ct="line">' + nx.esc(nx.t("Line")) + "</button>" +
                    '<button class="nx-chart-ctl" type="button" data-ct="bar">' + nx.esc(nx.t("Bar")) + "</button>" +
                    "</span>" +
                    "</div>" +
                    '<div class="nx-chart-wrap" data-chart="' + i + '">' +
                    '<svg class="nx-chart"></svg>' +
                    '<div class="nx-chart-tip"></div>' +
                    "</div></div>";
            }).join("") +
            "</div></section>";
    }

    function renderInsights(nx, insights) {
        return '<section class="nx-an-sec">' +
            '<div class="nx-an-sec-head">' +
            '<span class="nx-an-sec-ic nx-ic-purple">' + nx.ic("star", 15) + "</span>" +
            '<span class="nx-an-sec-title">' + nx.esc(nx.t("Key Insights")) + "</span>" +
            '<span class="nx-an-sec-note">' + nx.esc(nx.t("Automatically derived from this report's data")) + "</span>" +
            "</div>" +
            '<div class="nx-an-insights">' +
            insights.map(function (i) {
                return '<div class="nx-an-insight">' +
                    '<span class="nx-an-insight-ic nx-ic-' + i.tone + '">' + nx.ic(i.icon, 14) + "</span>" +
                    "<div>" +
                    '<div class="nx-an-insight-title">' + nx.esc(i.title) + "</div>" +
                    '<div class="nx-an-insight-text">' + nx.esc(i.text) + "</div>" +
                    "</div></div>";
            }).join("") +
            "</div></section>";
    }

    function renderWarnings(nx, warnings) {
        return '<section class="nx-an-sec nx-an-warn">' +
            '<div class="nx-an-sec-head">' +
            '<span class="nx-an-sec-ic nx-ic-yellow">' + nx.ic("alert", 15) + "</span>" +
            '<span class="nx-an-sec-title">' + nx.esc(nx.t("Data Quality")) + "</span>" +
            '<span class="nx-an-sec-note">' + nx.esc(nx.t("Things to review before acting")) + "</span>" +
            "</div>" +
            '<div class="nx-an-warn-list">' +
            warnings.map(function (w) {
                return '<div class="nx-an-warn-item">' + nx.ic("alert", 13) +
                    "<span>" + nx.esc(w.text) + "</span></div>";
            }).join("") +
            "</div></section>";
    }

    function renderSummary(nx, items) {
        return '<section class="nx-an-sec">' +
            '<div class="nx-an-sec-head">' +
            '<span class="nx-an-sec-ic nx-ic-gray">' + nx.ic("layers", 15) + "</span>" +
            '<span class="nx-an-sec-title">' + nx.esc(nx.t("Overview")) + "</span>" +
            '<span class="nx-an-sec-note">' + nx.esc(nx.t("Report summary")) + "</span>" +
            "</div>" +
            '<div class="nx-an-summary">' +
            items.map(function (i) {
                return '<span class="nx-an-chip">' + nx.ic(i.icon, 13) +
                    "<b>" + nx.esc(i.value) + "</b>" +
                    nx.esc(i.label) + "</span>";
            }).join("") +
            "</div></section>";
    }

    function renderExportPanel(nx) {
        var btn = function (act, icon, label, extra) {
            return '<button class="nx-an-exp-btn' + (extra || "") + '" data-nx-exp="' + act +
                '" title="' + nx.esc(nx.t(label)) + '">' + nx.ic(icon, 14) +
                "<span>" + nx.esc(nx.t(label)) + "</span></button>";
        };
        return '<section class="nx-an-sec nx-an-exp">' +
            '<div class="nx-an-sec-head">' +
            '<span class="nx-an-sec-ic nx-ic-green">' + nx.ic("download", 15) + "</span>" +
            '<span class="nx-an-sec-title">' + nx.esc(nx.t("Export & Share")) + "</span>" +
            '<span class="nx-an-sec-note">' + nx.esc(nx.t("Send this report to Excel, PDF or a colleague")) + "</span>" +
            "</div>" +
            '<div class="nx-an-exp-btns">' +
            btn("export-excel", "download", "Export Excel") +
            btn("export-pdf", "file", "Export PDF") +
            btn("print", "print", "Print") +
            '<span class="nx-an-exp-sep"></span>' +
            btn("share", "share", "Share") +
            btn("save", "save", "Save View") +
            '<span class="nx-an-exp-sep"></span>' +
            btn("fullscreen", "maximize", "Fullscreen") +
            btn("reset", "rotate", "Reset", " nx-an-exp-btn-danger") +
            "</div></section>";
    }

    function buildHtml(nx, model) {
        var h = "";
        if (model.summary && model.summary.length) h += renderSummary(nx, model.summary);
        if (model.kpis && model.kpis.length) h += renderKpis(nx, model.kpis);
        if (model.charts && model.charts.length) h += renderCharts(nx, model.charts);
        if (model.insights && model.insights.length) h += renderInsights(nx, model.insights);
        if (model.warnings && model.warnings.length) h += renderWarnings(nx, model.warnings);
        return h;
    }

    // ------------------------------------------------------------------ SVG charts

    function drawChart(svg, chart) {
        var wrap = svg.parentNode;
        var width = Math.max(280, (wrap && wrap.clientWidth) || 560);
        var H = 216, PAD_L = 6, PAD_R = 8, PAD_T = 16, PAD_B = 30;
        var innerW = width - PAD_L - PAD_R;
        var innerH = H - PAD_T - PAD_B;
        var points = chart.points;
        if (!points || !points.length) return;

        var rawMax = 0, minV = Infinity;
        points.forEach(function (p) {
            var a = Math.abs(p.value);
            if (a > rawMax) rawMax = a;
            if (p.value < minV) minV = p.value;
        });
        if (minV > 0) minV = 0;
        var niceMax = rawMax === 0 ? 1 : niceCeil(rawMax);
        var niceMin = minV < 0 ? -niceCeil(-minV) : 0;
        var span = Math.max(1e-9, niceMax - niceMin);

        function yAt(v) { return PAD_T + (1 - (v - niceMin) / span) * innerH; }
        function xAt(i, pts) { return PAD_L + (i + 0.5) * (innerW / pts); }

        var out = "";
        for (var g = 0; g <= 4; g++) {
            var gv = niceMin + (span * g) / 4;
            var gy = yAt(gv);
            out += '<line class="nx-chart-grid" x1="' + PAD_L + '" y1="' + gy.toFixed(1) +
                '" x2="' + (width - PAD_R) + '" y2="' + gy.toFixed(1) + '"></line>';
            out += '<text class="nx-chart-ylabel" x="' + (PAD_L + 2) + '" y="' + (gy - 4).toFixed(1) +
                '">' + fmtShort(gv) + "</text>";
        }

        var n = points.length;
        var step = innerW / n;
        var zeroY = yAt(0);
        var every = Math.max(1, Math.ceil(n / 12));

        if (chart.kind === "bar") {
            var barW = Math.min(30, Math.max(6, step * 0.55));
            points.forEach(function (p, i) {
                var x = xAt(i, n) - barW / 2;
                var yv = yAt(p.value);
                var y = Math.min(yv, zeroY);
                var h = Math.max(1, Math.abs(zeroY - yv));
                out += '<rect class="nx-chart-bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
                    '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"' +
                    ' data-pt="' + i + '"></rect>';
            });
            points.forEach(function (p, i) {
                if (i % every !== 0) return;
                out += '<text class="nx-chart-xlabel" text-anchor="middle" x="' +
                    xAt(i, n).toFixed(1) + '" y="' + (H - 8) + '">' + trunc(p.label, 12) + "</text>";
            });
        } else {
            var poly = points.map(function (p, i) {
                return xAt(i, n).toFixed(1) + "," + yAt(p.value).toFixed(1);
            }).join(" ");
            out += '<polyline class="nx-chart-line" points="' + poly + '"></polyline>';
            out += '<polygon class="nx-chart-area" points="' +
                PAD_L + "," + zeroY.toFixed(1) + " " + poly + " " +
                (PAD_L + innerW).toFixed(1) + "," + zeroY.toFixed(1) + '"></polygon>';
            points.forEach(function (p, i) {
                var x = xAt(i, n);
                out += '<rect class="nx-chart-hit" x="' + (x - step / 2).toFixed(1) +
                    '" y="0" width="' + step.toFixed(1) + '" height="' + H + '"' +
                    ' data-pt="' + i + '"></rect>';
                out += '<circle class="nx-chart-dot" cx="' + x.toFixed(1) + '" cy="' +
                    yAt(p.value).toFixed(1) + '" r="3.5" data-pt="' + i + '"></circle>';
            });
            points.forEach(function (p, i) {
                if (i % every !== 0) return;
                out += '<text class="nx-chart-xlabel" text-anchor="middle" x="' +
                    xAt(i, n).toFixed(1) + '" y="' + (H - 8) + '">' + trunc(p.label, 10) + "</text>";
            });
        }

        svg.setAttribute("viewBox", "0 0 " + width + " " + H);
        svg.innerHTML = out;
    }

    function bindHover(nx, wrap, chart) {
        var tip = wrap.querySelector(".nx-chart-tip");
        var svg = wrap.querySelector("svg");
        if (!svg || !tip) return;
        var show = function (e, idx) {
            var pt = chart.points[idx];
            if (!pt) return;
            var rect = svg.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            tip.style.left = Math.min(Math.max(8, x), Math.max(8, rect.width - 130)) + "px";
            tip.style.top = (y - 34 < 0 ? y + 14 : y - 34) + "px";
            tip.style.opacity = "1";
            tip.innerHTML = "<b>" + nx.esc(pt.label) + "</b><span>" +
                (chart.isMoney ? nx.money(pt.value) : nx.num(pt.value, 2)) + "</span>";
        };
        svg.addEventListener("mousemove", function (e) {
            var t = e.target;
            if (!t || !t.getAttribute) { return; }
            var pi = t.getAttribute("data-pt");
            if (pi !== null && pi !== undefined && pi !== "") {
                var idx = +pi;
                svg.querySelectorAll(".nx-chart-bar.is-sel, .nx-chart-dot.is-sel")
                    .forEach(function (el) { el.classList.remove("is-sel"); });
                if (chart.kind === "bar") {
                    svg.querySelectorAll('.nx-chart-bar[data-pt="' + idx + '"]')
                        .forEach(function (el) { el.classList.add("is-sel"); });
                } else {
                    svg.querySelectorAll('.nx-chart-dot[data-pt="' + idx + '"]')
                        .forEach(function (el) { el.classList.add("is-sel"); });
                }
                show(e, idx);
            } else {
                tip.style.opacity = "0";
                svg.querySelectorAll(".is-sel").forEach(function (el) { el.classList.remove("is-sel"); });
            }
        });
        svg.addEventListener("mouseleave", function () {
            tip.style.opacity = "0";
            svg.querySelectorAll(".is-sel").forEach(function (el) { el.classList.remove("is-sel"); });
        });
    }

    // ------------------------------------------------------------------ DOM mount

    function bindExports(nx, rootEl, qr) {
        rootEl.querySelectorAll("[data-nx-exp]").forEach(function (b) {
            if (b.getAttribute("data-wired") === "1") return;
            b.setAttribute("data-wired", "1");
            b.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (nx.__runReportAction) {
                    nx.__runReportAction(qr || frappe.query_report, b.getAttribute("data-nx-exp"), b);
                }
            });
        });
    }

    function markChartKind(wrap, chart) {
        var bts = wrap.querySelectorAll(".nx-chart-ctl");
        for (var i = 0; i < bts.length; i++) {
            bts[i].classList.toggle("is-on", bts[i].getAttribute("data-ct") === chart.kind);
        }
    }

    function bindCharts(nx, section, model) {
        section.querySelectorAll("[data-chart]").forEach(function (wrap) {
            var idx = +wrap.getAttribute("data-chart");
            var chart = model.charts[idx];
            if (!chart) return;
            markChartKind(wrap, chart);
            bindHover(nx, wrap, chart);
            var bts = wrap.querySelectorAll(".nx-chart-ctl");
            for (var i = 0; i < bts.length; i++) {
                if (bts[i].getAttribute("data-wired") === "1") continue;
                bts[i].setAttribute("data-wired", "1");
                (function (b) {
                    b.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        chart.kind = b.getAttribute("data-ct");
                        var svg = wrap.querySelector("svg");
                        if (svg) drawChart(svg, chart);
                        markChartKind(wrap, chart);
                    });
                })(bts[i]);
            }
        });
    }

    // Right-align numeric columns in the underlying ERPNext datatable so the
    // native table reads like a report. Matches columns by header label.
    function styleNumeric(nx, qr, st) {
        try {
            var numCols = st.numeric;
            if (!numCols.length) return;
            var norm = {};
            numCols.forEach(function (c) {
                norm[String(c.label).toLowerCase().replace(/[^a-z0-9]/g, "")] = 1;
            });
            var dt = qr && qr.$report && qr.$report[0];
            if (!dt) return;
            var container = dt.querySelector(".dt-container");
            if (!container) return;
            var headers = container.querySelectorAll(".dt-header .dt-cell--header");
            if (!headers.length) return;
            var idxs = [];
            for (var i = 0; i < headers.length; i++) {
                var t = String(headers[i].textContent || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                if (norm[t]) idxs.push(i);
            }
            if (!idxs.length) return;
            container.querySelectorAll(".dt-body .dt-row").forEach(function (row) {
                var cells = row.querySelectorAll(".dt-cell");
                for (var j = 0; j < idxs.length; j++) {
                    var cell = cells[idxs[j]];
                    if (cell) cell.classList.add("dt-cell--right");
                }
            });
        } catch (e) { /* presentation nicety only */ }
    }

    // Re-render all analytics for the given QueryReport. Safe to call on every
    // data load / refresh; it replaces only the analytics containers in place.
    function update(nx, qr) {
        var root = nx && nx.main && nx.main.querySelector("[data-report-viewer]");
        if (!root || !qr) return;
        var body = root.querySelector("[data-report-body]");
        if (!body) return;
        var mount = body.querySelector(".nx-report-mount");

        var table = extract(qr);
        var hasData = table.rows.length && table.columns.length;

        if (!hasData) {
            var gone1 = root.querySelector(".nx-report-analytics");
            var gone2 = root.querySelector(".nx-report-exportpanel");
            var gone3 = root.querySelector(".nx-report-table");
            var gone4 = root.querySelector(".nx-dt-frame");
            if (gone1) gone1.remove();
            if (gone2) gone2.remove();
            if (gone3) gone3.remove();
            if (gone4) gone4.remove();
            return;
        }

        var model = buildModel(nx, table, qr);

        // Analytics section ALWAYS comes before the raw table ("table never first").
        var section = root.querySelector(".nx-report-analytics");
        if (!section) {
            section = document.createElement("div");
            section.className = "nx-report-analytics";
            if (mount) body.insertBefore(section, mount);
            else body.appendChild(section);
        }
        section.innerHTML = buildHtml(nx, model);
        bindCharts(nx, section, model);

        // Native "Detail Data" header that frames the ERPNext datatable below it.
        var tsec = root.querySelector(".nx-report-table");
        if (!tsec) {
            tsec = document.createElement("div");
            tsec.className = "nx-report-table";
            if (mount) body.insertBefore(tsec, mount);
            else body.appendChild(tsec);
        }
        tsec.innerHTML =
            '<span class="nx-an-table-ic nx-ic-indigo">' + nx.ic("grid", 14) + "</span>" +
            '<span class="nx-an-table-title">' + nx.esc(nx.t("Detail Data")) + "</span>" +
            '<span class="nx-an-table-note">' +
            nx.esc(nx.t("{0} records", [nx.num(table.rows.length, 0)])) +
            "</span>";

        // M4 — Nexora DataTable Framework. The Nexora table is the ONLY table
        // renderer; the native ERPNext datatable is never created (see
        // App.__disableNativeDatatable). We render straight from the report JSON.
        var dtFrame = root.querySelector(".nx-dt-frame");
        if (!dtFrame) {
            dtFrame = document.createElement("div");
            dtFrame.className = "nx-dt-frame";
            if (mount) body.insertBefore(dtFrame, mount);
            else body.appendChild(dtFrame);
        }
        dtFrame.innerHTML = "";
        if (window.NexoraDashboard.DataTable && window.NexoraDashboard.DataTable.mount) {
            try {
                window.NexoraDashboard.DataTable.mount({
                    nx: nx,
                    table: table,
                    el: dtFrame,
                    reportName: qr.report_name || qr.page_title || ""
                });
            } catch (e) {
                dtFrame.innerHTML = '<div class="nx-dt-frame-err">' +
                    nx.esc(nx.t("Could not render the table view")) + "</div>";
            }
        }

        var panel = root.querySelector(".nx-report-exportpanel");
        if (!panel) {
            panel = document.createElement("div");
            panel.className = "nx-report-exportpanel";
            if (dtFrame && dtFrame.nextSibling) body.insertBefore(panel, dtFrame.nextSibling);
            else body.appendChild(panel);
        }
        panel.innerHTML = renderExportPanel(nx);
        bindExports(nx, panel, qr);
    }

    return {
        update: update,
        extract: extract,
        stats: stats,
        buildModel: buildModel
    };
})();
