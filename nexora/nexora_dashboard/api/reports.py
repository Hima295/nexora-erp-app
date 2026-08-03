# -*- coding: utf-8 -*-
"""
Nexora Reporting Engine (v4.0)
=============================
ERPNext acts ONLY as a JSON data backend. Every report in this module is
built by Nexora (config-driven registry, query layer, aggregation engine)
and rendered 100% by the Nexora frontend. ERPNext report objects, Report
View, Query Report, Report Builder and DataTable are NEVER used.

Architecture
------------
Report Registry   -> REPORT_CATALOG + CATEGORIES
API Layer         -> get_report_catalog(), run_report()
Query Layer       -> _q(), _sales_where(), _purchase_where(), _item_where()
Filters Engine    -> _filters() (company / date preset / entity filters)
Aggregation Engine-> per-report builders returning a normalized payload
Cache             -> frappe.cache, keyed by report + filters hash
"""
from __future__ import annotations

import hashlib
import json

import frappe
from frappe import _
from frappe.utils import add_days, add_months, flt, getdate, nowdate

from .dashboard import (
    ALLOWED_ROLES,
    _company_currency,
    _resolve_company,
)

REPORT_TTL = 60  # seconds

# ---------------------------------------------------------------------------
# Registry (config-driven: adding a report = a dict + a builder function)
# ---------------------------------------------------------------------------
CATEGORIES = [
    {"key": "Executive", "label": "Executive", "icon": "chart", "color": "indigo",
     "desc": "Company-wide performance at a glance"},
    {"key": "Sales", "label": "Sales", "icon": "sales", "color": "green",
     "desc": "Revenue, customers, items and margins"},
    {"key": "Purchasing", "label": "Purchasing", "icon": "cart", "color": "orange",
     "desc": "Spend, suppliers and procurement"},
    {"key": "Inventory", "label": "Inventory", "icon": "box", "color": "teal",
     "desc": "Stock, valuation, movement and coverage"},
    {"key": "Finance", "label": "Finance", "icon": "bank", "color": "purple",
     "desc": "Cash, receivables, payables and taxes"},
    {"key": "Profitability", "label": "Profitability", "icon": "trending-up", "color": "red",
     "desc": "Profit and cost analysis"},
]

REPORT_CATALOG = [
    # Executive
    {"key": "executive_dashboard", "title": "Executive Dashboard", "category": "Executive",
     "icon": "chart", "color": "indigo",
     "desc": "Revenue, profit, cash, receivables, payables and inventory in one view.",
     "filters": ["company"]},
    # Sales
    {"key": "sales_dashboard", "title": "Sales Dashboard", "category": "Sales",
     "icon": "sales", "color": "green",
     "desc": "Revenue, orders, profit, trend and top movers for the selected period.",
     "filters": ["company", "date", "customer", "status"]},
    {"key": "top_customers", "title": "Top Customers", "category": "Sales",
     "icon": "users", "color": "blue",
     "desc": "Customers ranked by revenue with order counts and period comparison.",
     "filters": ["company", "date", "customer", "status"]},
    {"key": "top_items", "title": "Top Selling Items", "category": "Sales",
     "icon": "box", "color": "teal",
     "desc": "Items ranked by quantity and revenue sold in the period.",
     "filters": ["company", "date", "item_group", "brand"]},
    {"key": "gross_profit", "title": "Gross Profit", "category": "Sales",
     "icon": "trending-up", "color": "green",
     "desc": "Revenue, cost of goods sold and gross profit per invoice.",
     "filters": ["company", "date", "customer", "status"]},
    # Purchasing
    {"key": "purchasing_dashboard", "title": "Purchasing Dashboard", "category": "Purchasing",
     "icon": "cart", "color": "orange",
     "desc": "Purchase spend, suppliers, pending orders and requests.",
     "filters": ["company", "date", "supplier", "status"]},
    {"key": "top_suppliers", "title": "Top Suppliers", "category": "Purchasing",
     "icon": "truck", "color": "purple",
     "desc": "Suppliers ranked by spend with order counts.",
     "filters": ["company", "date", "supplier", "status"]},
    {"key": "expense_analysis", "title": "Expense Analysis", "category": "Purchasing",
     "icon": "file-text", "color": "orange",
     "desc": "Operating expenses by GL account and month.",
     "filters": ["company", "date"]},
    # Inventory
    {"key": "inventory_dashboard", "title": "Inventory Dashboard", "category": "Inventory",
     "icon": "box", "color": "teal",
     "desc": "Stock value, warehouse distribution, low and out-of-stock items.",
     "filters": ["company", "warehouse"]},
    {"key": "stock_valuation", "title": "Stock Valuation", "category": "Inventory",
     "icon": "grid", "color": "orange",
     "desc": "Items and warehouses ranked by inventory value.",
     "filters": ["company", "warehouse", "item_group", "brand"]},
    {"key": "reorder_analysis", "title": "Reorder Analysis", "category": "Inventory",
     "icon": "alert-triangle", "color": "yellow",
     "desc": "Items at or below their reorder level, with required quantities.",
     "filters": ["company", "warehouse", "item_group"]},
    {"key": "abc_analysis", "title": "ABC Analysis", "category": "Inventory",
     "icon": "pie-chart", "color": "indigo",
     "desc": "Items classified A/B/C by annual consumption value (Pareto).",
     "filters": ["company", "date", "item_group"]},
    {"key": "fast_slow_moving", "title": "Fast / Slow Moving Items", "category": "Inventory",
     "icon": "zap", "color": "green",
     "desc": "Items ranked by sales velocity; slow and non-moving items flagged.",
     "filters": ["company", "date", "item_group"]},
    {"key": "dead_stock", "title": "Dead Stock", "category": "Inventory",
     "icon": "eye-off", "color": "gray",
     "desc": "Stock with no sales movement, tying up capital.",
     "filters": ["company", "date", "item_group"]},
    # Finance
    {"key": "finance_dashboard", "title": "Finance Dashboard", "category": "Finance",
     "icon": "bank", "color": "purple",
     "desc": "Cash position, receivables, payables and monthly cash flow.",
     "filters": ["company"]},
    {"key": "receivables_aging", "title": "Receivables Aging", "category": "Finance",
     "icon": "clock", "color": "red",
     "desc": "Outstanding customer receivables split into aging buckets.",
     "filters": ["company", "customer"]},
    {"key": "payables_aging", "title": "Payables Aging", "category": "Finance",
     "icon": "clock", "color": "orange",
     "desc": "Outstanding supplier payables split into aging buckets.",
     "filters": ["company", "supplier"]},
    {"key": "cash_flow", "title": "Cash Flow", "category": "Finance",
     "icon": "refresh", "color": "teal",
     "desc": "Payments received and paid by month, plus cash accounts balance.",
     "filters": ["company", "date"]},
    {"key": "vat_analysis", "title": "VAT Analysis", "category": "Finance",
     "icon": "percent", "color": "purple",
     "desc": "Output and input VAT by month from sales and purchase taxes.",
     "filters": ["company", "date"]},
    # Profitability
    {"key": "profitability_report", "title": "Profitability Report", "category": "Profitability",
     "icon": "trending-up", "color": "red",
     "desc": "Revenue, cost, gross and net profit trends with margins.",
     "filters": ["company", "date", "customer", "status"]},
]


def _report_meta(key):
    for r in REPORT_CATALOG:
        if r["key"] == key:
            return r
    return None


# ---------------------------------------------------------------------------
# Permission + cache
# ---------------------------------------------------------------------------
def _check_permission():
    if frappe.session.user == "Administrator":
        return
    roles = set(frappe.get_roles())
    if not roles.intersection(ALLOWED_ROLES):
        frappe.throw(_("Not permitted to view Nexora reports."), frappe.PermissionError)


def _cache_key(report, filters):
    blob = json.dumps(filters or {}, sort_keys=True, default=str)
    h = hashlib.sha1(blob.encode("utf-8")).hexdigest()[:16]
    return "nexora:report:{0}:{1}".format(report, h)


def _cached(report, filters, generator):
    key = _cache_key(report, filters)
    try:
        val = frappe.cache().get_value(key)
        if val is not None:
            return val
    except Exception:
        pass
    val = generator()
    try:
        cache = frappe.cache()
        cache.set_value(key, val, expires_in_sec=REPORT_TTL)
        mk = cache.make_key(key)
        if mk in frappe.local.cache:
            frappe.local.cache.pop(mk, None)
    except Exception:
        pass
    return val


# ---------------------------------------------------------------------------
# Query layer
# ---------------------------------------------------------------------------
def _q(sql, params):
    return frappe.db.sql(sql, params, as_dict=True)


def _num(v, d=2):
    return flt(v, d)


def _sales_where(f, t="si", with_company=True, with_date=True):
    parts, params = [], []
    if with_company:
        parts.append("{0}.company = %s".format(t))
        params.append(f["company"])
    if with_date and f.get("start") and f.get("end"):
        parts.append("{0}.posting_date BETWEEN %s AND %s".format(t))
        params.extend([f["start"], f["end"]])
    if f.get("customer"):
        parts.append("{0}.customer = %s".format(t))
        params.append(f["customer"])
    if f.get("status"):
        parts.append("{0}.status = %s".format(t))
        params.append(f["status"])
    return " AND ".join(parts), params


def _purchase_where(f, t="pi", with_company=True, with_date=True):
    parts, params = [], []
    if with_company:
        parts.append("{0}.company = %s".format(t))
        params.append(f["company"])
    if with_date and f.get("start") and f.get("end"):
        parts.append("{0}.posting_date BETWEEN %s AND %s".format(t))
        params.extend([f["start"], f["end"]])
    if f.get("supplier"):
        parts.append("{0}.supplier = %s".format(t))
        params.append(f["supplier"])
    if f.get("status"):
        parts.append("{0}.status = %s".format(t))
        params.append(f["status"])
    return " AND ".join(parts), params


def _item_where(f, t="it"):
    parts, params = [], []
    if f.get("item_group"):
        parts.append("{0}.item_group = %s".format(t))
        params.append(f["item_group"])
    if f.get("brand"):
        parts.append("{0}.brand = %s".format(t))
        params.append(f["brand"])
    return " AND ".join(parts), params


def _month_keys(start, end):
    out = []
    cur = getdate(start).replace(day=1)
    end_d = getdate(end)
    while cur <= end_d:
        out.append(cur.strftime("%Y-%m"))
        cur = add_months(cur, 1)
    return out


def _month_series(f):
    keys = _month_keys(f["start"], f["end"])
    axis = []
    for k in keys:
        y, m = int(k[:4]), int(k[5:7])
        axis.append({"key": k, "label": "{0:04d}-{1:02d}".format(y, m)})
    return axis


def _pct(cur, prev):
    prev = flt(prev)
    if prev:
        return _num((flt(cur) - prev) / abs(prev) * 100, 1)
    return _num(100, 1) if flt(cur) else 0


def _profit_sql(f, t="si", sii="sii", it="it", si="si"):
    """Revenue-based gross profit using item valuation rate (company currency)."""
    return """
        SELECT IFNULL(SUM(
            CASE WHEN IFNULL({it}.is_stock_item, 1) = 1
                 THEN IFNULL({sii}.qty, 0) * (IFNULL({sii}.base_net_rate, IFNULL({sii}.net_rate, 0)) - IFNULL({it}.valuation_rate, 0))
                 ELSE 0 END
        ), 0) AS profit
        FROM `tabSales Invoice Item` {sii}
        INNER JOIN `tabSales Invoice` {si} ON {si}.name = {sii}.parent
        LEFT JOIN `tabItem` {it} ON {it}.name = {sii}.item_code
    """.format(t=t, sii=sii, it=it, si=si)


def _period_sales(f):
    """{revenue, invoices, profit} for the filtered period."""
    where, params = _sales_where(f)
    row = _q(
        """
        SELECT IFNULL(SUM(si.grand_total), 0) AS revenue, COUNT(DISTINCT si.name) AS invoices
        FROM `tabSales Invoice` si
        WHERE {0}
        """.format(where or "1=1"), params
    )[0]
    profit = _q(
        _profit_sql(f) + " WHERE {0}".format(where or "1=1"),
        params,
    )[0]["profit"]
    return {"revenue": _num(row["revenue"]), "invoices": int(row["invoices"] or 0), "profit": _num(profit)}


def _prev_period(f):
    span = flt((getdate(f["end"]) - getdate(f["start"])).days, 0) + 1
    pstart = add_days(getdate(f["start"]), -span)
    pend = add_days(getdate(f["start"]), -1)
    pf = dict(f, start=pstart, end=pend)
    return _period_sales(pf)


# ---------------------------------------------------------------------------
# Filters Engine
# ---------------------------------------------------------------------------
def _preset_range(preset):
    """Return (start, end) date tuple for a named preset."""
    today = getdate(nowdate())
    if preset == "today":
        return today, today
    if preset == "yesterday":
        y = add_days(today, -1)
        return y, y
    if preset == "this_week":
        return add_days(today, -(today.weekday())), today
    if preset == "last_week":
        start = add_days(today, -(today.weekday() + 7))
        return start, add_days(start, 6)
    if preset == "this_month":
        return today.replace(day=1), today
    if preset == "last_month":
        end = add_days(today.replace(day=1), -1)
        return end.replace(day=1), end
    if preset == "this_quarter":
        q = (today.month - 1) // 3
        start = getdate("{0}-{1:02d}-01".format(today.year, q * 3 + 1))
        return start, today
    if preset == "last_quarter":
        q = (today.month - 1) // 3
        cur_start = getdate("{0}-{1:02d}-01".format(today.year, q * 3 + 1))
        return add_months(cur_start, -3), add_days(cur_start, -1)
    if preset == "this_year":
        return getdate("{0}-01-01".format(today.year)), today
    if preset == "last_year":
        return getdate("{0}-01-01".format(today.year - 1)), getdate("{0}-12-31".format(today.year - 1))
    if preset == "last_30_days":
        return add_days(today, -29), today
    if preset == "last_90_days":
        return add_days(today, -89), today
    if preset == "last_12_months":
        return add_months(today, -11).replace(day=1), today
    if preset == "all_time":
        return getdate("2000-01-01"), today
    return today.replace(day=1), today


def _filters(raw):
    """Normalize raw API filters into the canonical `f` dict used by builders.

    Always guarantees a company and an inclusive (start, end) date range.
    Accepts explicit dates via start/end (or from_date/to_date) and named presets.
    """
    raw = dict(raw or {})
    company = raw.get("company") or _resolve_company()
    if not company:
        frappe.throw(_("No company is available for reports."))
    preset = raw.get("preset") or "this_month"
    start = raw.get("start") or raw.get("from_date")
    end = raw.get("end") or raw.get("to_date")
    if not (start and end):
        s, e = _preset_range(preset)
        start, end = s, e
    try:
        limit = max(1, min(int(raw.get("limit") or 100), 500))
    except (TypeError, ValueError):
        limit = 100
    return {
        "company": company,
        "preset": preset,
        "start": str(getdate(start)),
        "end": str(getdate(end)),
        "limit": limit,
        "customer": (raw.get("customer") or "").strip(),
        "supplier": (raw.get("supplier") or "").strip(),
        "warehouse": (raw.get("warehouse") or "").strip(),
        "item_group": (raw.get("item_group") or "").strip(),
        "brand": (raw.get("brand") or "").strip(),
        "status": (raw.get("status") or "").strip(),
        "item": (raw.get("item") or "").strip(),
    }


def _filter_options(company):
    def names(doctype, field="name"):
        try:
            return [r["name"] for r in frappe.get_all(doctype, fields=[field], order_by=field, limit_page_length=2000)]
        except Exception:
            return []
    return {
        "companies": frappe.get_all("Company", fields=["name", "default_currency", "abbr"], order_by="creation"),
        "customers": names("Customer", "name"),
        "suppliers": names("Supplier", "name"),
        "warehouses": names("Warehouse", "name"),
        "item_groups": names("Item Group", "name"),
        "brands": names("Brand", "name"),
    }


# ---------------------------------------------------------------------------
# Aggregation engine -> normalized payload
# ---------------------------------------------------------------------------
def _payload(f, meta, kpis=None, charts=None, columns=None, rows=None, totals=None, insights=None, drill=None):
    currency = _company_currency(f["company"])
    return {
        "meta": {
            "key": meta["key"], "title": meta["title"], "category": meta["category"],
            "icon": meta["icon"], "color": meta["color"], "desc": meta["desc"],
            "company": f["company"], "currency": currency,
            "generated_at": str(nowdate()),
        },
        "filters": {
            "applied": {
                "company": f["company"], "date_preset": f.get("preset") or "this_month",
                "from_date": str(f["start"]), "to_date": str(f["end"]),
                "customer": f.get("customer") or "", "supplier": f.get("supplier") or "",
                "warehouse": f.get("warehouse") or "", "item_group": f.get("item_group") or "",
                "brand": f.get("brand") or "", "status": f.get("status") or "",
            },
            "options": _filter_options(f["company"]),
        },
        "kpis": kpis or [],
        "charts": charts or [],
        "columns": columns or [],
        "rows": rows or [],
        "totals": totals or {},
        "pagination": {"limit": f["limit"], "total_rows": len(rows or [])},
        "export": {"formats": ["csv", "excel", "json", "print"],
                   "filename": "nexora_{0}_{1}_{2}_{3}".format(meta["key"], f["company"], f["start"], f["end"])},
        "insights": insights or [],
        "drill": drill or [],
    }


def _kpi(key, label, value, fmt="money", delta=None, delta_label="", icon="circle", color="indigo", tone=None):
    if tone is None:
        tone = "neutral" if delta is None else ("up" if delta >= 0 else "down")
    return {"key": key, "label": label, "value": value, "format": fmt,
            "delta": delta, "delta_label": delta_label, "icon": icon, "color": color, "tone": tone}


def _chart(key, title, ctype, categories, series, formats="money", stacked=False, colors=None):
    return {"key": key, "title": title, "type": ctype, "categories": categories,
            "series": series, "formats": formats, "stacked": stacked, "colors": colors}


def _money_col(key, label, fieldname=None):
    return {"key": key, "label": label, "fieldname": fieldname or key, "fieldtype": "Currency", "numeric": True}


def _int_col(key, label, fieldname=None):
    return {"key": key, "label": label, "fieldname": fieldname or key, "fieldtype": "Int", "numeric": True}


def _data_col(key, label, fieldname=None):
    return {"key": key, "label": label, "fieldname": fieldname or key, "fieldtype": "Data", "numeric": False}


def _pct_col(key, label, fieldname=None):
    return {"key": key, "label": label, "fieldname": fieldname or key, "fieldtype": "Percent", "numeric": True}


# ---------------------------------------------------------------------------
# Report builders
# ---------------------------------------------------------------------------
def _executive_dashboard(f):
    from .dashboard import _cash_position, _inventory_health, _series12
    meta = _report_meta("executive_dashboard")
    series = _series12(f["company"])
    cash = _cash_position(f["company"])
    inv = _inventory_health(f["company"])
    months = series["months"] or []
    cur = months[-1] if months else {}

    kpis = [
        _kpi("revenue", "Revenue (MTD)", _num(cur.get("sales", 0)), "money", icon="sales", color="green"),
        _kpi("profit", "Profit (MTD)", _num(cur.get("profit", 0)), "money", icon="trending-up", color="indigo"),
        _kpi("cash", "Cash Position", _num(cash["total"]), "money", icon="bank", color="teal"),
        _kpi("receivables", "Receivables", _num(cash["receivables"]), "money", icon="arrow-up-left", color="red"),
        _kpi("payables", "Payables", _num(cash["payables"]), "money", icon="arrow-down-left", color="orange"),
        _kpi("inventory", "Inventory Value", _num(inv["total_value"]), "money", icon="box", color="purple"),
    ]
    charts = [
        _chart("monthly", "Revenue & Profit (12 months)", "line",
               [m["label"] for m in months],
               [{"name": "Revenue", "data": [_num(m.get("sales")) for m in months]},
                {"name": "Profit", "data": [_num(m.get("profit")) for m in months]}],
               "money"),
        _chart("cashflow", "Cash In / Out (12 months)", "bar",
               [m["label"] for m in months],
               [{"name": "Cash In", "data": [_num(m.get("cash_in")) for m in months]},
                {"name": "Cash Out", "data": [_num(m.get("cash_out")) for m in months]}],
               "money", stacked=True),
    ]
    columns = [_data_col("month", "Month", "label"), _money_col("sales", "Revenue"),
               _money_col("profit", "Profit"), _int_col("invoices", "Invoices"),
               _money_col("purchases", "Purchases"), _money_col("cash_flow", "Net Cash"),
               _money_col("inventory_value", "Inventory Value")]
    rows = [
        {"month": m["label"], "label": m["label"], "sales": _num(m.get("sales")),
         "profit": _num(m.get("profit")), "invoices": int(m.get("invoices") or 0),
         "purchases": _num(m.get("purchases")), "cash_flow": _num(m.get("cash_flow")),
         "inventory_value": _num(m.get("inventory_value"))}
        for m in months
    ]
    insights = []
    if cur.get("sales"):
        insights.append({"tone": "good", "icon": "sales", "text": _("MTD revenue is {0} across {1} invoices.").format(_num(cur.get("sales")), int(cur.get("invoices") or 0))})
    if _num(cash["receivables"]) > 0:
        insights.append({"tone": "warn", "icon": "arrow-up-left", "text": _("Open receivables of {0} are outstanding.").format(_num(cash["receivables"]))})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={"revenue": _num(cur.get("sales")), "profit": _num(cur.get("profit"))},
                    insights=insights, drill=["month"])


def _sales_dashboard(f):
    meta = _report_meta("sales_dashboard")
    cur = _period_sales(f)
    prev = _prev_period(f)
    axis = _month_series(f)
    keys = [m["key"] for m in axis]

    trend = _q(
        """
        SELECT DATE_FORMAT(si.posting_date, '%%Y-%%m') AS ym,
               IFNULL(SUM(si.grand_total), 0) AS revenue,
               COUNT(DISTINCT si.name) AS invoices
        FROM `tabSales Invoice` si
        WHERE {0}
        GROUP BY ym ORDER BY ym
        """.format(_sales_where(f)[0]),
        _sales_where(f)[1],
    )
    tmap = {r["ym"]: r for r in trend}

    by_item = _q(
        """
        SELECT IFNULL(sii.item_code, '-') AS label, SUM(IFNULL(sii.amount, 0)) AS value
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        WHERE {0}
        GROUP BY sii.item_code ORDER BY value DESC LIMIT 8
        """.format(_sales_where(f)[0]),
        _sales_where(f)[1],
    )
    by_customer = _q(
        """
        SELECT IFNULL(si.customer, '-') AS label, SUM(IFNULL(si.grand_total, 0)) AS value
        FROM `tabSales Invoice` si
        WHERE {0}
        GROUP BY si.customer ORDER BY value DESC LIMIT 8
        """.format(_sales_where(f)[0]),
        _sales_where(f)[1],
    )

    kpis = [
        _kpi("revenue", "Revenue", cur["revenue"], "money", delta=cur["revenue"] - prev["revenue"],
             delta_label=_("vs previous period"), icon="sales", color="green"),
        _kpi("invoices", "Invoices", cur["invoices"], "int", delta=cur["invoices"] - prev["invoices"],
             delta_label=_("vs previous period"), icon="file", color="blue"),
        _kpi("profit", "Gross Profit", cur["profit"], "money",
             delta=cur["profit"] - prev["profit"], delta_label=_("vs previous period"),
             icon="trending-up", color="indigo"),
        _kpi("avg", "Avg Invoice", _num(cur["revenue"] / cur["invoices"]) if cur["invoices"] else 0,
             "money", icon="calculator", color="teal"),
    ]
    charts = [
        _chart("trend", "Revenue Trend", "column",
               [m["label"] for m in axis],
               [{"name": "Revenue", "data": [_num(tmap.get(k, {}).get("revenue")) for k in keys]}],
               "money"),
        _chart("items", "Top Items", "bar",
               [r["label"] for r in by_item],
               [{"name": "Amount", "data": [_num(r["value"]) for r in by_item]}],
               "money"),
        _chart("customers", "Top Customers", "donut",
               [r["label"] for r in by_customer],
               [{"name": "Amount", "data": [_num(r["value"]) for r in by_customer]}],
               "money"),
    ]
    rows = [
        {"month": m["label"], "label": m["label"], "revenue": _num(tmap.get(k, {}).get("revenue", 0)),
         "invoices": int(tmap.get(k, {}).get("invoices") or 0)}
        for m, k in zip(axis, keys)
    ]
    columns = [_data_col("month", "Month", "label"), _money_col("revenue", "Revenue"),
               _int_col("invoices", "Invoices")]
    insights = []
    if cur["revenue"]:
        insights.append({"tone": "good", "icon": "sales",
                         "text": _("{0} revenue from {1} invoices in the period.").format(_num(cur["revenue"]), cur["invoices"])})
    if prev["revenue"]:
        insights.append({"tone": "info", "icon": "activity",
                         "text": _("Revenue {0}% vs the previous comparable period.").format(_pct(cur["revenue"], prev["revenue"]))})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={"revenue": cur["revenue"], "profit": cur["profit"]},
                    insights=insights, drill=["month"])


def _purchasing_dashboard(f):
    meta = _report_meta("purchasing_dashboard")
    where, params = _purchase_where(f)
    cur = _q(
        "SELECT IFNULL(SUM(pi.grand_total), 0) AS spend, COUNT(DISTINCT pi.name) AS orders "
        "FROM `tabPurchase Invoice` pi WHERE {0}".format(where or "1=1"), params)[0]
    span = flt((getdate(f["end"]) - getdate(f["start"])).days, 0) + 1
    pstart = add_days(getdate(f["start"]), -span)
    pend = add_days(getdate(f["start"]), -1)
    prev_row = _q(
        "SELECT IFNULL(SUM(pi.grand_total), 0) AS spend FROM `tabPurchase Invoice` pi "
        "WHERE pi.company = %s AND pi.posting_date BETWEEN %s AND %s",
        (f["company"], pstart, pend))[0]
    prev_spend = _num(prev_row["spend"])
    by_supplier = _q(
        """
        SELECT IFNULL(pi.supplier, '-') AS label, SUM(IFNULL(pi.grand_total, 0)) AS value
        FROM `tabPurchase Invoice` pi WHERE {0} GROUP BY pi.supplier ORDER BY value DESC LIMIT 8
        """.format(where or "1=1"), params)
    by_month = _q(
        """
        SELECT DATE_FORMAT(pi.posting_date, '%%Y-%%m') AS ym, IFNULL(SUM(pi.grand_total), 0) AS value,
               COUNT(DISTINCT pi.name) AS orders
        FROM `tabPurchase Invoice` pi WHERE {0} GROUP BY ym ORDER BY ym
        """.format(where or "1=1"), params)
    pending = _q(
        "SELECT IFNULL(SUM(grand_total), 0) AS amount, COUNT(*) AS count "
        "FROM `tabPurchase Order` WHERE docstatus = 0 AND company = %s", (f["company"],))[0]

    spend = _num(cur["spend"])
    kpis = [
        _kpi("spend", "Spend", spend, "money", delta=spend - prev_spend,
             delta_label=_("vs previous period"), icon="cart", color="orange"),
        _kpi("orders", "Invoices", int(cur["orders"] or 0), "int", icon="file", color="blue"),
        _kpi("avg", "Avg Invoice", _num(spend / cur["orders"]) if cur["orders"] else 0, "money",
             icon="calculator", color="teal"),
        _kpi("pending", "Pending POs", int(pending["count"] or 0), "int",
             delta=None, delta_label=_("{0} open value").format(_num(pending["amount"])),
             icon="alert-triangle", color="red"),
    ]
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    mmap = {r["ym"]: r for r in by_month}
    charts = [
        _chart("trend", "Spend by Month", "column", [m["label"] for m in axis],
               [{"name": "Spend", "data": [_num(mmap.get(k, {}).get("value")) for k in keys]}], "money"),
        _chart("suppliers", "Top Suppliers", "donut", [r["label"] for r in by_supplier],
               [{"name": "Spend", "data": [_num(r["value"]) for r in by_supplier]}], "money"),
    ]
    rows = [{"month": m["label"], "label": m["label"], "spend": _num(mmap.get(k, {}).get("value", 0)),
             "orders": int(mmap.get(k, {}).get("orders") or 0)} for m, k in zip(axis, keys)]
    columns = [_data_col("month", "Month", "label"), _money_col("spend", "Spend"),
               _int_col("orders", "Invoices")]
    insights = []
    if spend:
        insights.append({"tone": "good", "icon": "cart", "text": _("Total purchase spend of {0}.").format(spend)})
    if int(pending["count"] or 0):
        insights.append({"tone": "warn", "icon": "alert-triangle",
                         "text": _("{0} purchase orders are still draft.").format(int(pending["count"]))})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={"spend": spend}, insights=insights, drill=["month"])


def _inventory_dashboard(f):
    meta = _report_meta("inventory_dashboard")
    from .dashboard import _inventory_health
    inv = _inventory_health(f["company"])
    wf = _q(
        """
        SELECT b.warehouse AS label, SUM(IFNULL(b.actual_qty, 0) * IFNULL(it.valuation_rate, 0)) AS value,
               COUNT(DISTINCT b.item_code) AS items
        FROM `tabBin` b INNER JOIN `tabItem` it ON it.name = b.item_code
        WHERE b.warehouse = IF(%s = '', b.warehouse, %s)
        GROUP BY b.warehouse ORDER BY value DESC LIMIT 10
        """,
        (f.get("warehouse") or "", f.get("warehouse") or ""))
    kpis = [
        _kpi("value", "Stock Value", _num(inv["total_value"]), "money", icon="box", color="teal"),
        _kpi("qty", "Total Qty", _num(inv["total_qty"], 0), "int", icon="layers", color="blue"),
        _kpi("items", "Stock Items", inv["item_count"], "int", icon="grid", color="purple"),
        _kpi("low", "Low Stock", inv["low_stock"]["count"], "int", icon="alert-triangle", color="yellow"),
        _kpi("out", "Out of Stock", inv["out_of_stock"]["count"], "int", icon="x-circle", color="red"),
    ]
    charts = [
        _chart("warehouses", "Value by Warehouse", "bar", [r["label"] for r in wf],
               [{"name": "Value", "data": [_num(r["value"]) for r in wf]}], "money"),
    ]
    wrows = [{"warehouse": r["label"], "value": _num(r["value"]), "items": int(r["items"] or 0)} for r in wf]
    columns = [_data_col("warehouse", "Warehouse"), _money_col("value", "Value"),
               _int_col("items", "Items")]
    rows = wrows
    insights = []
    if inv["out_of_stock"]["count"]:
        insights.append({"tone": "bad", "icon": "x-circle",
                         "text": _("{0} items are out of stock.").format(inv["out_of_stock"]["count"])})
    if inv["low_stock"]["count"]:
        insights.append({"tone": "warn", "icon": "alert-triangle",
                         "text": _("{0} items are below their reorder level.").format(inv["low_stock"]["count"])})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={"value": _num(inv["total_value"])}, insights=insights, drill=["warehouse"])


def _finance_dashboard(f):
    meta = _report_meta("finance_dashboard")
    from .dashboard import _cash_position
    cash = _cash_position(f["company"])
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    rows = _q(
        """
        SELECT DATE_FORMAT(posting_date, '%%Y-%%m') AS ym,
               SUM(IF(payment_type = 'Receive', IFNULL(base_paid_amount, 0), 0)) AS c_in,
               SUM(IF(payment_type = 'Pay', IFNULL(base_paid_amount, 0), 0)) AS c_out
        FROM `tabPayment Entry`
        WHERE docstatus = 1 AND company = %s AND posting_date BETWEEN %s AND %s
        GROUP BY ym ORDER BY ym
        """, (f["company"], f["start"], f["end"]))
    mmap = {r["ym"]: r for r in rows}
    kpis = [
        _kpi("cash", "Cash", _num(cash["total"]), "money", icon="bank", color="teal"),
        _kpi("bank", "Bank", _num(cash["bank"]), "money", icon="landmark", color="blue"),
        _kpi("receivables", "Receivables", _num(cash["receivables"]), "money", icon="arrow-up-left", color="red"),
        _kpi("payables", "Payables", _num(cash["payables"]), "money", icon="arrow-down-left", color="orange"),
        _kpi("net", "Net Position", _num(cash["net_position"]), "money", icon="scale", color="green"),
    ]
    charts = [
        _chart("cash", "Cash Flow", "bar", [m["label"] for m in axis],
               [{"name": "In", "data": [_num(mmap.get(k, {}).get("c_in")) for k in keys]},
                {"name": "Out", "data": [_num(mmap.get(k, {}).get("c_out")) for k in keys]}],
               "money", stacked=True),
        _chart("accounts", "Cash & Bank Accounts", "bar", [a["name"] for a in cash["accounts"]][:10],
               [{"name": "Balance", "data": [_num(a["balance"]) for a in cash["accounts"]][:10]}], "money"),
    ]
    acols = [_data_col("name", "Account"), _money_col("balance", "Balance")]
    arows = [{"name": a["name"], "balance": _num(a["balance"])} for a in cash["accounts"]]
    insights = []
    if _num(cash["receivables"]) > 0:
        insights.append({"tone": "warn", "icon": "arrow-up-left",
                         "text": _("{0} is collectible from customers.").format(_num(cash["receivables"]))})
    if _num(cash["payables"]) > 0:
        insights.append({"tone": "warn", "icon": "arrow-down-left",
                         "text": _("{0} is payable to suppliers.").format(_num(cash["payables"]))})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=acols, rows=arows,
                    totals={"cash": _num(cash["total"])}, insights=insights, drill=["name"])


def _top_customers_report(f):
    meta = _report_meta("top_customers")
    where, params = _sales_where(f)
    rows = _q(
        """
        SELECT IFNULL(si.customer, '-') AS customer,
               IFNULL(c.customer_name, si.customer) AS customer_name,
               COUNT(DISTINCT si.name) AS invoices,
               SUM(IFNULL(si.grand_total, 0)) AS revenue,
               SUM(IFNULL(si.base_grand_total, si.grand_total)) AS base_revenue
        FROM `tabSales Invoice` si
        LEFT JOIN `tabCustomer` c ON c.name = si.customer
        WHERE {0}
        GROUP BY si.customer, c.customer_name
        ORDER BY revenue DESC
        LIMIT %s
        """.format(where or "1=1"), params + [f["limit"]])
    total = sum(_num(r["revenue"]) for r in rows)
    kpis = [
        _kpi("customers", "Customers", len(rows), "int", icon="users", color="blue"),
        _kpi("revenue", "Revenue (Top)", _num(total), "money", icon="sales", color="green"),
    ]
    charts = [
        _chart("top", "Top Customers", "bar", [r["customer_name"] for r in rows],
               [{"name": "Revenue", "data": [_num(r["revenue"]) for r in rows]}], "money"),
    ]
    columns = [_data_col("customer", "Customer"), _int_col("invoices", "Invoices"),
               _money_col("revenue", "Revenue")]
    crows = [{"customer": r["customer_name"], "invoices": int(r["invoices"] or 0),
              "revenue": _num(r["revenue"])} for r in rows]
    insights = []
    if rows:
        insights.append({"tone": "info", "icon": "users",
                         "text": _("Top customer is {0} at {1}.").format(rows[0]["customer_name"], _num(rows[0]["revenue"]))})
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=crows,
                    totals={"revenue": _num(total)}, insights=insights, drill=["customer"])


def _top_items_report(f):
    meta = _report_meta("top_items")
    base_where, base_params = _sales_where(f)
    item_where, item_params = _item_where(f)
    where = " AND ".join(x for x in [base_where, item_where] if x)
    params = base_params + item_params
    rows = _q(
        """
        SELECT sii.item_code, IFNULL(it.item_name, sii.item_name) AS item_name,
               SUM(IFNULL(sii.qty, 0)) AS qty,
               SUM(IFNULL(sii.base_net_amount, sii.amount)) AS revenue
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE {0}
        GROUP BY sii.item_code, it.item_name, sii.item_name
        ORDER BY revenue DESC
        LIMIT %s
        """.format(where or "1=1"), params + [f["limit"]])
    total_qty = sum(_num(r["qty"]) for r in rows)
    kpis = [
        _kpi("items", "Items", len(rows), "int", icon="box", color="teal"),
        _kpi("qty", "Qty Sold", _num(total_qty, 0), "int", icon="layers", color="blue"),
    ]
    charts = [
        _chart("top", "Top Items by Revenue", "bar", [r["item_name"] for r in rows],
               [{"name": "Revenue", "data": [_num(r["revenue"]) for r in rows]}], "money"),
    ]
    columns = [_data_col("item", "Item"), _int_col("qty", "Qty", "qty"),
               _money_col("revenue", "Revenue")]
    irows = [{"item": r["item_name"], "qty": _num(r["qty"]), "revenue": _num(r["revenue"])} for r in rows]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=irows,
                    totals={"qty": _num(total_qty, 0)}, insights=[], drill=["item"])


def _gross_profit_report(f):
    meta = _report_meta("gross_profit")
    where, params = _sales_where(f, t="si")
    rows = _q(
        """
        SELECT si.name AS invoice, si.posting_date AS date, IFNULL(si.customer, '-') AS customer,
               IFNULL(si.base_net_total, si.net_total) AS revenue,
               IFNULL(SUM(
                   CASE WHEN IFNULL(it.is_stock_item, 1) = 1
                        THEN IFNULL(sii.qty, 0) * IFNULL(it.valuation_rate, 0)
                        ELSE 0 END
               ), 0) AS cogs
        FROM `tabSales Invoice` si
        LEFT JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE {0}
        GROUP BY si.name, si.posting_date, si.customer, si.base_net_total, si.net_total
        ORDER BY si.posting_date DESC
        LIMIT %s
        """.format(where or "1=1"), params + [min(f["limit"] * 3, 500)])
    out = []
    for r in rows:
        profit = _num(_num(r["revenue"]) - _num(r["cogs"]))
        margin = _num(profit / r["revenue"] * 100, 1) if _num(r["revenue"]) else 0
        out.append({"invoice": r["invoice"], "date": str(r["date"]), "customer": r["customer"],
                    "revenue": _num(r["revenue"]), "cogs": _num(r["cogs"]), "profit": profit, "margin": margin})
    total_rev = sum(r["revenue"] for r in out)
    total_cogs = sum(r["cogs"] for r in out)
    total_profit = total_rev - total_cogs
    total_margin = _num(total_profit / total_rev * 100, 1) if total_rev else 0
    kpis = [
        _kpi("revenue", "Revenue", _num(total_rev), "money", icon="sales", color="green"),
        _kpi("cogs", "COGS", _num(total_cogs), "money", icon="box", color="orange"),
        _kpi("profit", "Gross Profit", _num(total_profit), "money", icon="trending-up", color="indigo"),
        _kpi("margin", "Margin", _num(total_margin), "percent", icon="percent", color="teal"),
    ]
    charts = [
        _chart("monthly", "Monthly Profit", "line", [r["date"][:7] for r in out],
               [{"name": "Profit", "data": [_num(r["profit"]) for r in out]}], "money"),
    ]
    columns = [_data_col("invoice", "Invoice"), _data_col("date", "Date", "date"),
               _data_col("customer", "Customer"), _money_col("revenue", "Revenue"),
               _money_col("cogs", "COGS"), _money_col("profit", "Profit"),
               _pct_col("margin", "Margin")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out[: f["limit"] * 3],
                    totals={"revenue": _num(total_rev), "profit": _num(total_profit)},
                    insights=[{"tone": "info", "icon": "percent",
                               "text": _("Overall gross margin is {0}%.").format(total_margin)}],
                    drill=["customer"])


def _top_suppliers_report(f):
    meta = _report_meta("top_suppliers")
    where, params = _purchase_where(f)
    rows = _q(
        """
        SELECT IFNULL(pi.supplier, '-') AS supplier, IFNULL(s.supplier_name, pi.supplier) AS supplier_name,
               COUNT(DISTINCT pi.name) AS orders, SUM(IFNULL(pi.grand_total, 0)) AS spend
        FROM `tabPurchase Invoice` pi
        LEFT JOIN `tabSupplier` s ON s.name = pi.supplier
        WHERE {0}
        GROUP BY pi.supplier, s.supplier_name, pi.supplier
        ORDER BY spend DESC
        LIMIT %s
        """.format(where or "1=1"), params + [f["limit"]])
    total = sum(_num(r["spend"]) for r in rows)
    kpis = [
        _kpi("suppliers", "Suppliers", len(rows), "int", icon="truck", color="purple"),
        _kpi("spend", "Spend (Top)", _num(total), "money", icon="cart", color="orange"),
    ]
    charts = [
        _chart("top", "Top Suppliers", "bar", [r["supplier_name"] for r in rows],
               [{"name": "Spend", "data": [_num(r["spend"]) for r in rows]}], "money"),
    ]
    columns = [_data_col("supplier", "Supplier"), _int_col("orders", "Invoices"),
               _money_col("spend", "Spend")]
    srows = [{"supplier": r["supplier_name"], "orders": int(r["orders"] or 0),
              "spend": _num(r["spend"])} for r in rows]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=srows,
                    totals={"spend": _num(total)}, insights=[], drill=["supplier"])


def _expense_analysis_report(f):
    meta = _report_meta("expense_analysis")
    rows = _q(
        """
        SELECT a.name AS account,
               DATE_FORMAT(gle.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(gle.debit, 0) - IFNULL(gle.credit, 0)) AS amount
        FROM `tabGL Entry` gle
        INNER JOIN `tabAccount` a ON a.name = gle.account
        WHERE gle.docstatus < 2 AND IFNULL(gle.is_cancelled, 0) = 0
          AND gle.company = %s AND gle.posting_date BETWEEN %s AND %s
          AND a.account_type IN ('Expense Account', 'Chargeable', 'Fixed Asset')
          AND a.is_group = 0
        GROUP BY a.name, ym
        ORDER BY a.name, ym
        """, (f["company"], f["start"], f["end"]))
    acct_rows = _q(
        """
        SELECT a.name AS account, SUM(IFNULL(gle.debit, 0) - IFNULL(gle.credit, 0)) AS total
        FROM `tabGL Entry` gle
        INNER JOIN `tabAccount` a ON a.name = gle.account
        WHERE gle.docstatus < 2 AND IFNULL(gle.is_cancelled, 0) = 0
          AND gle.company = %s AND gle.posting_date BETWEEN %s AND %s
          AND a.account_type IN ('Expense Account', 'Chargeable', 'Fixed Asset')
          AND a.is_group = 0
        GROUP BY a.name HAVING total <> 0 ORDER BY total DESC LIMIT 12
        """, (f["company"], f["start"], f["end"]))
    total_exp = sum(_num(r["total"]) for r in acct_rows)
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    pivot = {}
    for r in rows:
        pivot.setdefault(r["account"], {})[r["ym"]] = _num(r["amount"])
    charts = [
        _chart("expenses", "Expenses by Account", "bar", [r["account"] for r in acct_rows],
               [{"name": "Expense", "data": [_num(r["total"]) for r in acct_rows]}], "money"),
        _chart("trend", "Monthly Expense", "line", [m["label"] for m in axis],
               [{"name": "Expense", "data": [
                   _num(sum(pivot.get(a["account"], {}).get(k, 0) for a in acct_rows)) for k in keys]}],
               "money"),
    ]
    columns = [_data_col("account", "Account"), _money_col("total", "Total")]
    erows = [{"account": r["account"], "total": _num(r["total"])} for r in acct_rows]
    return _payload(f, meta, kpis=[_kpi("total", "Total Expenses", _num(total_exp), "money",
                                        icon="file-text", color="orange")],
                    charts=charts, columns=columns, rows=erows,
                    totals={"total": _num(total_exp)}, insights=[], drill=["account"])


def _stock_valuation_report(f):
    meta = _report_meta("stock_valuation")
    item_where, item_params = _item_where(f)
    wh = f.get("warehouse") or ""
    params = [wh, wh]
    where = ["it.disabled = 0 AND IFNULL(it.is_stock_item, 1) = 1 AND b.warehouse = IF(%s = '', b.warehouse, %s)"]
    if item_where:
        where.append(item_where)
        params += item_params
    rows = _q(
        """
        SELECT it.item_code, it.item_name, IFNULL(it.valuation_rate, 0) AS rate,
               SUM(IFNULL(b.actual_qty, 0)) AS qty,
               SUM(IFNULL(b.actual_qty, 0) * IFNULL(it.valuation_rate, 0)) AS value
        FROM `tabBin` b INNER JOIN `tabItem` it ON it.name = b.item_code
        WHERE {0}
        GROUP BY it.item_code, it.item_name, it.valuation_rate
        ORDER BY value DESC
        LIMIT %s
        """.format(" AND ".join(where)), params + [min(f["limit"] * 4, 500)])
    total = sum(_num(r["value"]) for r in rows)
    total_qty = sum(_num(r["qty"]) for r in rows)
    kpis = [
        _kpi("value", "Valuation", _num(total), "money", icon="box", color="teal"),
        _kpi("qty", "Units", _num(total_qty, 0), "int", icon="layers", color="blue"),
        _kpi("items", "Items", len(rows), "int", icon="grid", color="purple"),
    ]
    charts = [
        _chart("top", "Top by Value", "bar", [r["item_name"][:24] for r in rows[:10]],
               [{"name": "Value", "data": [_num(r["value"]) for r in rows[:10]]}], "money"),
    ]
    columns = [_data_col("item", "Item"), _money_col("rate", "Rate", "rate"),
               _int_col("qty", "Qty", "qty"), _money_col("value", "Value")]
    srows = [{"item": r["item_name"], "rate": _num(r["rate"]), "qty": _num(r["qty"]),
              "value": _num(r["value"])} for r in rows]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=srows,
                    totals={"value": _num(total)}, insights=[], drill=["item"])


def _reorder_analysis_report(f):
    meta = _report_meta("reorder_analysis")
    wh = f.get("warehouse") or ""
    item_where, item_params = _item_where(f)
    where = ["it.disabled = 0 AND IFNULL(it.is_stock_item, 1) = 1"]
    if wh:
        where.append("b.warehouse = %s")
    if item_where:
        where.append(item_where)
    qparams = []
    if wh:
        qparams.append(wh)  # correlated subquery: r.warehouse = %s
    if wh:
        qparams.append(wh)  # main WHERE: b.warehouse = %s
    qparams += item_params
    qparams.append(min(f["limit"] * 4, 500))
    rows = _q(
        """
        SELECT t.item_code, t.item_name, t.rate, t.qty, t.threshold,
               (t.threshold - t.qty) AS shortage
        FROM (
            SELECT it.item_code, it.item_name, IFNULL(it.valuation_rate, 0) AS rate,
                   IFNULL(SUM(b.actual_qty), 0) AS qty,
                   IFNULL((
                       SELECT MIN(IFNULL(r.warehouse_reorder_level, 0)) FROM `tabItem Reorder` r
                       WHERE r.parent = it.item_code {wh}
                   ), IFNULL(it.safety_stock, 0)) AS threshold
            FROM `tabBin` b INNER JOIN `tabItem` it ON it.name = b.item_code
            WHERE {0}
            GROUP BY it.item_code, it.item_name, it.valuation_rate, it.safety_stock
        ) t
        WHERE t.qty <= t.threshold
        ORDER BY shortage DESC
        LIMIT %s
        """.format(" AND ".join(where), wh=("AND r.warehouse = %s" if wh else "")),
        qparams)
    out = []
    low = 0
    for r in rows:
        shortage = _num(_num(r["threshold"]) - _num(r["qty"]))
        if _num(r["qty"]) <= 0:
            low += 1
        out.append({"item": r["item_name"], "qty": _num(r["qty"]), "threshold": _num(r["threshold"]),
                    "shortage": shortage, "value": _num(shortage * r["rate"])})
    kpis = [
        _kpi("items", "Below Reorder", len(out), "int", icon="alert-triangle", color="yellow"),
        _kpi("out", "Out of Stock", low, "int", icon="x-circle", color="red"),
    ]
    charts = [
        _chart("shortage", "Shortage Value", "bar", [r["item"][:24] for r in out[:10]],
               [{"name": "Shortage Value", "data": [_num(r["value"]) for r in out[:10]]}], "money"),
    ]
    columns = [_data_col("item", "Item", "item"), _int_col("qty", "On Hand", "qty"),
               _int_col("threshold", "Reorder Level", "threshold"), _int_col("shortage", "Shortage", "shortage"),
               _money_col("value", "Shortage Value", "value")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out,
                    totals={}, insights=[], drill=["item"])


def _abc_analysis_report(f):
    meta = _report_meta("abc_analysis")
    item_where, item_params = _item_where(f)
    where = ["si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s"]
    if item_where:
        where.append(item_where.replace("it.", "it."))
    rows = _q(
        """
        SELECT sii.item_code, IFNULL(it.item_name, sii.item_name) AS item_name,
               SUM(IFNULL(sii.qty, 0)) AS qty,
               SUM(IFNULL(sii.qty, 0) * IFNULL(it.valuation_rate, 0)) AS value
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE {0}
        GROUP BY sii.item_code, it.item_name, sii.item_name
        HAVING value > 0
        ORDER BY value DESC
        LIMIT %s
        """.format(" AND ".join(where)),
        [f["company"], f["start"], f["end"]] + item_params + [min(f["limit"] * 4, 500)])
    total = sum(_num(r["value"]) for r in rows)
    out = []
    cum = 0
    abc = {"A": 0, "B": 0, "C": 0}
    for r in rows:
        cum += _num(r["value"])
        pct = _num(cum / total * 100, 1) if total else 0
        cls = "A" if pct <= 70 else ("B" if pct <= 95 else "C")
        abc[cls] += 1
        out.append({"item": r["item_name"], "qty": _num(r["qty"]), "value": _num(r["value"]),
                    "cum_pct": pct, "class": cls})
    kpis = [_kpi("a", "A Items", abc["A"], "int", icon="a", color="green"),
            _kpi("b", "B Items", abc["B"], "int", icon="b", color="yellow"),
            _kpi("c", "C Items", abc["C"], "int", icon="c", color="red"),
            _kpi("value", "Consumption Value", _num(total), "money", icon="box", color="teal")]
    charts = [
        _chart("abc", "ABC Split", "donut", ["A", "B", "C"],
               [{"name": "Items", "data": [abc["A"], abc["B"], abc["C"]]}], "int"),
        _chart("cum", "Cumulative Value", "line", [r["item"][:20] for r in out[:15]],
               [{"name": "Cum %", "data": [r["cum_pct"] for r in out[:15]]}], "percent"),
    ]
    columns = [_data_col("item", "Item", "item"), _int_col("qty", "Qty", "qty"),
               _money_col("value", "Value"), _pct_col("cum_pct", "Cumulative %", "cum_pct"),
               _data_col("class", "Class")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out,
                    totals={"value": _num(total)}, insights=[], drill=["item"])


def _fast_slow_moving_report(f):
    meta = _report_meta("fast_slow_moving")
    from .dashboard import _fast_slow_moving
    data = _fast_slow_moving(f["company"], getdate(nowdate()))
    fast = data["fast"] or []
    slow = data["slow"] or []
    fast.sort(key=lambda r: _num(r["qty"]), reverse=True)
    kpis = [
        _kpi("fast", "Fast Movers", len(fast), "int", icon="zap", color="green"),
        _kpi("slow", "Slow Movers", len(slow), "int", icon="clock", color="orange"),
    ]
    charts = [
        _chart("fast", "Fast Movers (Qty)", "bar", [r["item_code"] for r in fast[:10]],
               [{"name": "Qty", "data": [_num(r["qty"]) for r in fast[:10]]}], "int"),
    ]
    columns = [_data_col("item", "Item", "item_code"), _int_col("qty", "Qty Sold", "qty")]
    rows = [{"item": r["item_code"], "qty": _num(r["qty"]), "item_code": r["item_code"]} for r in fast]
    slow_rows = [{"item": r.get("item_name") or r.get("item_code"), "qty": _num(r["qty"]),
                  "item_code": r.get("item_code")} for r in slow]
    rows += slow_rows
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={}, insights=[], drill=["item"])


def _dead_stock_report(f):
    meta = _report_meta("dead_stock")
    days = 180
    cutoff = add_days(getdate(nowdate()), -days)
    item_where, item_params = _item_where(f)
    where = ["it.disabled = 0 AND IFNULL(it.is_stock_item, 1) = 1"]
    if item_where:
        where.append(item_where.replace("it.", "it."))
    rows = _q(
        """
        SELECT t.item_code, t.item_name, t.rate, t.qty, (t.qty * t.rate) AS value
        FROM (
            SELECT it.item_code, it.item_name, IFNULL(it.valuation_rate, 0) AS rate,
                   SUM(IFNULL(b.actual_qty, 0)) AS qty
            FROM `tabBin` b INNER JOIN `tabItem` it ON it.name = b.item_code
            WHERE {0}
            GROUP BY it.item_code, it.item_name, it.valuation_rate
        ) t
        WHERE t.qty > 0 AND t.item_code NOT IN (
            SELECT sii.item_code FROM `tabSales Invoice Item` sii
            INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
            WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date >= %s
        )
        ORDER BY value DESC
        LIMIT %s
        """.format(" AND ".join(where)),
        item_params + [f["company"], cutoff] + [min(f["limit"] * 4, 500)])
    out = [{"item": r["item_name"], "qty": _num(r["qty"]), "rate": _num(r["rate"]),
            "value": _num(_num(r["qty"]) * _num(r["rate"]))} for r in rows]
    total = sum(r["value"] for r in out)
    kpis = [
        _kpi("items", "Dead Stock Items", len(out), "int", icon="eye-off", color="gray"),
        _kpi("value", "Tied-up Value", _num(total), "money", icon="box", color="red"),
    ]
    charts = [
        _chart("dead", "Dead Stock Value", "bar", [r["item"][:24] for r in out[:10]],
               [{"name": "Value", "data": [r["value"] for r in out[:10]]}], "money"),
    ]
    columns = [_data_col("item", "Item", "item"), _int_col("qty", "Qty", "qty"),
               _money_col("rate", "Rate", "rate"), _money_col("value", "Value")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out,
                    totals={"value": _num(total)}, insights=[], drill=["item"])


def _aging_report(f, direction):
    meta_key = "receivables_aging" if direction == "out" else "payables_aging"
    meta = _report_meta(meta_key)
    doctype = "Sales Invoice" if direction == "out" else "Purchase Invoice"
    party_label = "Customer" if direction == "out" else "Supplier"
    if direction == "out":
        joins = "LEFT JOIN `tabCustomer` c ON c.name = si.customer"
        party_sel = "IFNULL(c.customer_name, si.customer)"
        party_key = "si.customer"
        filter_col = "si.customer"
        fval = f.get("customer")
    else:
        joins = "LEFT JOIN `tabSupplier` s ON s.name = si.supplier"
        party_sel = "IFNULL(s.supplier_name, si.supplier)"
        party_key = "si.supplier"
        filter_col = "si.supplier"
        fval = f.get("supplier")
    today = getdate(nowdate())
    params = [f["company"]]
    fwhere = "si.company = %s"
    if fval:
        fwhere += " AND {0} = %s".format(filter_col)
        params.append(fval)
    rows = _q(
        """
        SELECT t.party, t.docs, t.b90, t.b61_90, t.b31_60, t.b1_30, t.current,
               (t.b90 + t.b61_90 + t.b31_60 + t.b1_30 + t.current) AS outstanding
        FROM (
            SELECT {0} AS party, COUNT(DISTINCT si.name) AS docs,
                   SUM(IF(si.posting_date < DATE_SUB(%s, INTERVAL 90 DAY), IFNULL(si.outstanding_amount, 0), 0)) AS b90,
                   SUM(IF(si.posting_date BETWEEN DATE_SUB(%s, INTERVAL 90 DAY) AND DATE_SUB(%s, INTERVAL 61 DAY), IFNULL(si.outstanding_amount, 0), 0)) AS b61_90,
                   SUM(IF(si.posting_date BETWEEN DATE_SUB(%s, INTERVAL 60 DAY) AND DATE_SUB(%s, INTERVAL 31 DAY), IFNULL(si.outstanding_amount, 0), 0)) AS b31_60,
                   SUM(IF(si.posting_date BETWEEN DATE_SUB(%s, INTERVAL 30 DAY) AND DATE_SUB(%s, INTERVAL 1 DAY), IFNULL(si.outstanding_amount, 0), 0)) AS b1_30,
                   SUM(IF(si.posting_date >= %s, IFNULL(si.outstanding_amount, 0), 0)) AS current
            FROM `tab{1}` si {2}
            WHERE {3} AND si.docstatus = 1 AND IFNULL(si.outstanding_amount, 0) > 0
            GROUP BY {4}
        ) t
        ORDER BY outstanding DESC
        LIMIT %s
        """.format(party_sel, doctype, joins, fwhere, party_key),
        [today, today, today, today, today, today, today, today] + params + [min(f["limit"] * 2, 300)])
    out = []
    total = {"current": 0, "b1_30": 0, "b31_60": 0, "b61_90": 0, "b90": 0}
    for r in rows:
        total["current"] += _num(r["current"])
        total["b1_30"] += _num(r["b1_30"])
        total["b31_60"] += _num(r["b31_60"])
        total["b61_90"] += _num(r["b61_90"])
        total["b90"] += _num(r["b90"])
        out.append({"party": r["party"], "docs": int(r["docs"] or 0),
                    "current": _num(r["current"]), "b1_30": _num(r["b1_30"]),
                    "b31_60": _num(r["b31_60"]), "b61_90": _num(r["b61_90"]),
                    "b90": _num(r["b90"]),
                    "total": _num(_num(r["current"]) + _num(r["b1_30"]) + _num(r["b31_60"]) + _num(r["b61_90"]) + _num(r["b90"]))})
    grand = sum(r["total"] for r in out)
    kpis = [
        _kpi("total", "Outstanding", _num(grand), "money", icon="clock", color="red"),
        _kpi("b90", "90+ Days", _num(total["b90"]), "money", icon="alert-triangle", color="red"),
        _kpi("current", "Current", _num(total["current"]), "money", icon="check-circle", color="green"),
    ]
    charts = [
        _chart("aging", "Aging Buckets", "bar", ["Current", "1-30", "31-60", "61-90", "90+"],
               [{"name": "Outstanding", "data": [_num(total["current"]), _num(total["b1_30"]),
                                                 _num(total["b31_60"]), _num(total["b61_90"]), _num(total["b90"])]}],
               "money"),
    ]
    columns = [_data_col("party", party_label.title()), _int_col("docs", "Docs", "docs"),
               _money_col("current", "Current"), _money_col("b1_30", "1-30"),
               _money_col("b31_60", "31-60"), _money_col("b61_90", "61-90"),
               _money_col("b90", "90+"), _money_col("total", "Total")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out,
                    totals={"total": _num(grand)},
                    insights=[{"tone": "bad", "icon": "alert-triangle",
                               "text": _("{0} is over 90 days past due.").format(_num(total["b90"]))} if _num(total["b90"]) else
                              {"tone": "good", "icon": "check-circle", "text": _("No amounts are over 90 days old.")}],
                    drill=["party"])


def _cash_flow_report(f):
    meta = _report_meta("cash_flow")
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    rows = _q(
        """
        SELECT DATE_FORMAT(posting_date, '%%Y-%%m') AS ym,
               SUM(IF(payment_type = 'Receive', IFNULL(base_paid_amount, 0), 0)) AS c_in,
               SUM(IF(payment_type = 'Pay', IFNULL(base_paid_amount, 0), 0)) AS c_out
        FROM `tabPayment Entry`
        WHERE docstatus = 1 AND company = %s AND posting_date BETWEEN %s AND %s
        GROUP BY ym ORDER BY ym
        """, (f["company"], f["start"], f["end"]))
    mmap = {r["ym"]: r for r in rows}
    detail = _q(
        """
        SELECT name, party_type, party, payment_type, base_paid_amount AS amount,
               posting_date AS date, mode_of_payment
        FROM `tabPayment Entry`
        WHERE docstatus = 1 AND company = %s AND posting_date BETWEEN %s AND %s
        ORDER BY posting_date DESC LIMIT 100
        """, (f["company"], f["start"], f["end"]))
    total_in = sum(_num(mmap.get(k, {}).get("c_in")) for k in keys)
    total_out = sum(_num(mmap.get(k, {}).get("c_out")) for k in keys)
    kpis = [
        _kpi("in", "Received", _num(total_in), "money", icon="arrow-down-left", color="green"),
        _kpi("out", "Paid", _num(total_out), "money", icon="arrow-up-right", color="red"),
        _kpi("net", "Net Flow", _num(total_in - total_out), "money", icon="scale", color="teal"),
    ]
    charts = [
        _chart("flow", "Cash Flow", "bar", [m["label"] for m in axis],
               [{"name": "In", "data": [_num(mmap.get(k, {}).get("c_in")) for k in keys]},
                {"name": "Out", "data": [_num(mmap.get(k, {}).get("c_out")) for k in keys]}],
               "money", stacked=True),
    ]
    columns = [_data_col("name", "Payment", "name"), _data_col("party", "Party"),
               _data_col("type", "Type", "payment_type"), _data_col("mode", "Mode", "mode_of_payment"),
               _data_col("date", "Date", "date"), _money_col("amount", "Amount")]
    drows = [{"name": r["name"], "party": r["party"], "payment_type": r["payment_type"],
              "mode_of_payment": r.get("mode_of_payment") or "", "date": str(r["date"] or ""),
              "amount": _num(r["amount"])} for r in detail]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=drows,
                    totals={"in": _num(total_in), "out": _num(total_out)}, insights=[], drill=["party"])


def _vat_analysis_report(f):
    meta = _report_meta("vat_analysis")
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    st_rows = _q(
        """
        SELECT DATE_FORMAT(si.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(st.base_tax_amount_after_discount_amount, 0)) AS amount
        FROM `tabSales Taxes and Charges` st
        INNER JOIN `tabSales Invoice` si ON si.name = st.parent
        WHERE st.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
          AND (UPPER(st.account_head) LIKE '%%VAT%%' OR UPPER(st.account_head) LIKE '%%TAX%%')
        GROUP BY ym
        """, (f["company"], f["start"], f["end"]))
    pt_rows = _q(
        """
        SELECT DATE_FORMAT(pi.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(pt.base_tax_amount_after_discount_amount, 0)) AS amount
        FROM `tabPurchase Taxes and Charges` pt
        INNER JOIN `tabPurchase Invoice` pi ON pi.name = pt.parent
        WHERE pt.docstatus = 1 AND pi.company = %s AND pi.posting_date BETWEEN %s AND %s
          AND (UPPER(pt.account_head) LIKE '%%VAT%%' OR UPPER(pt.account_head) LIKE '%%TAX%%')
        GROUP BY ym
        """, (f["company"], f["start"], f["end"]))
    smap = {r["ym"]: _num(r["amount"]) for r in st_rows}
    pmap = {r["ym"]: _num(r["amount"]) for r in pt_rows}
    total_out = sum(smap.values())
    total_in = sum(pmap.values())
    kpis = [
        _kpi("output", "Output VAT", _num(total_out), "money", icon="percent", color="purple"),
        _kpi("input", "Input VAT", _num(total_in), "money", icon="percent", color="blue"),
        _kpi("net", "Net VAT", _num(total_out - total_in), "money", icon="scale", color="teal"),
    ]
    charts = [
        _chart("vat", "VAT by Month", "bar", [m["label"] for m in axis],
               [{"name": "Output", "data": [_num(smap.get(k, 0)) for k in keys]},
                {"name": "Input", "data": [_num(pmap.get(k, 0)) for k in keys]}],
               "money", stacked=True),
    ]
    rows = [{"month": m["label"], "label": m["label"], "output": _num(smap.get(k, 0)),
             "input": _num(pmap.get(k, 0)), "net": _num(smap.get(k, 0) - pmap.get(k, 0))}
            for m, k in zip(axis, keys)]
    columns = [_data_col("month", "Month", "label"), _money_col("output", "Output"),
               _money_col("input", "Input"), _money_col("net", "Net")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=rows,
                    totals={"net": _num(total_out - total_in)}, insights=[], drill=["month"])


def _profitability_report(f):
    meta = _report_meta("profitability_report")
    axis = _month_series(f)
    keys = [m["key"] for m in axis]
    srows = _q(
        """
        SELECT DATE_FORMAT(si.posting_date, '%%Y-%%m') AS ym,
               IFNULL(SUM(IFNULL(si.base_net_total, si.net_total)), 0) AS revenue,
               IFNULL(SUM(
                   CASE WHEN IFNULL(it.is_stock_item, 1) = 1
                        THEN IFNULL(sii.qty, 0) * IFNULL(it.valuation_rate, 0)
                        ELSE 0 END
               ), 0) AS cogs
        FROM `tabSales Invoice` si
        LEFT JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY ym ORDER BY ym
        """, (f["company"], f["start"], f["end"]))
    smap = {r["ym"]: r for r in srows}
    out = []
    total_rev = total_cogs = 0
    for m, k in zip(axis, keys):
        r = smap.get(k) or {}
        rev = _num(r.get("revenue"))
        cogs = _num(r.get("cogs"))
        gp = _num(rev - cogs)
        margin = _num(gp / rev * 100, 1) if rev else 0
        total_rev += rev
        total_cogs += cogs
        out.append({"month": m["label"], "label": m["label"], "revenue": rev, "cogs": cogs,
                    "profit": gp, "margin": margin})
    total_gp = _num(total_rev - total_cogs)
    total_margin = _num(total_gp / total_rev * 100, 1) if total_rev else 0
    kpis = [
        _kpi("revenue", "Revenue", _num(total_rev), "money", icon="sales", color="green"),
        _kpi("cogs", "COGS", _num(total_cogs), "money", icon="box", color="orange"),
        _kpi("gross", "Gross Profit", total_gp, "money", icon="trending-up", color="indigo"),
        _kpi("margin", "Gross Margin", total_margin, "percent", icon="percent", color="teal"),
    ]
    charts = [
        _chart("profit", "Revenue vs COGS", "column", [m["label"] for m in axis],
               [{"name": "Revenue", "data": [r["revenue"] for r in out]},
                {"name": "COGS", "data": [r["cogs"] for r in out]}], "money"),
        _chart("margin", "Margin Trend", "line", [m["label"] for m in axis],
               [{"name": "Margin %", "data": [r["margin"] for r in out]}], "percent"),
    ]
    columns = [_data_col("month", "Month", "label"), _money_col("revenue", "Revenue"),
               _money_col("cogs", "COGS"), _money_col("profit", "Gross Profit"),
               _pct_col("margin", "Margin")]
    return _payload(f, meta, kpis=kpis, charts=charts, columns=columns, rows=out,
                    totals={"revenue": _num(total_rev), "profit": total_gp},
                    insights=[{"tone": "info", "icon": "percent",
                               "text": _("Gross margin is {0}% on {1} revenue.").format(total_margin, _num(total_rev))}],
                    drill=["month"])


BUILDERS = {
    "executive_dashboard": _executive_dashboard,
    "sales_dashboard": _sales_dashboard,
    "top_customers": _top_customers_report,
    "top_items": _top_items_report,
    "gross_profit": _gross_profit_report,
    "purchasing_dashboard": _purchasing_dashboard,
    "top_suppliers": _top_suppliers_report,
    "expense_analysis": _expense_analysis_report,
    "inventory_dashboard": _inventory_dashboard,
    "stock_valuation": _stock_valuation_report,
    "reorder_analysis": _reorder_analysis_report,
    "abc_analysis": _abc_analysis_report,
    "fast_slow_moving": _fast_slow_moving_report,
    "dead_stock": _dead_stock_report,
    "finance_dashboard": _finance_dashboard,
    "receivables_aging": lambda f: _aging_report(f, "out"),
    "payables_aging": lambda f: _aging_report(f, "in"),
    "cash_flow": _cash_flow_report,
    "vat_analysis": _vat_analysis_report,
    "profitability_report": _profitability_report,
}


# ---------------------------------------------------------------------------
# Public API (whitelisted)
# ---------------------------------------------------------------------------
@frappe.whitelist()
def get_report_catalog():
    _check_permission()
    company = _resolve_company()
    categories = []
    for c in CATEGORIES:
        reports = [r for r in REPORT_CATALOG if r["category"] == c["key"]]
        categories.append({"key": c["key"], "label": c["label"], "icon": c["icon"],
                           "color": c["color"], "desc": c["desc"], "reports": reports})
    return {
        "categories": categories,
        "companies": frappe.get_all("Company", fields=["name", "default_currency", "abbr"], order_by="creation"),
        "default_company": company,
    }


@frappe.whitelist()
def run_report(report=None, filters=None):
    _check_permission()
    if not report:
        frappe.throw(_("No report specified."))
    meta = _report_meta(report)
    if not meta:
        frappe.throw(_("Unknown report: {0}").format(report))
    if report not in BUILDERS:
        frappe.throw(_("Report {0} is not implemented yet.").format(report))
    f = _filters(filters or {})
    return _cached(report, filters or {}, lambda: BUILDERS[report](f))
