# -*- coding: utf-8 -*-
"""
Nexora Executive Dashboard (v3.0 Phase 1)
Read-only aggregate layer over live ERPNext data.
No ERPNext core modifications. Company-isolated, permission-checked.
"""
from __future__ import annotations

import frappe
from frappe import _
from frappe.utils import add_days, add_months, flt, getdate, nowdate

ALLOWED_ROLES = ("System Manager", "Stock Manager", "Accounts Manager", "Stock User", "Auditor", "Desk User")

DASH_CACHE_TTL = 45  # seconds


def _check_permission():
    if frappe.session.user == "Administrator":
        return
    roles = set(frappe.get_roles())
    if not roles.intersection(ALLOWED_ROLES):
        frappe.throw(_("Not permitted to view the Executive Dashboard."), frappe.PermissionError)


def _resolve_company(company=None):
    if company:
        return company
    default = frappe.defaults.get_user_default("company")
    if default:
        return default
    comps = frappe.get_all("Company", limit=1, order_by="creation", pluck="name")
    return comps[0] if comps else None


def _company_currency(company):
    return frappe.db.get_value("Company", company, "default_currency") or frappe.get_default("currency") or "SDG"


@frappe.whitelist()
def get_companies():
    _check_permission()
    return frappe.get_all(
        "Company",
        fields=["name", "default_currency", "abbr"],
        order_by="creation",
    )


def _safe(fn, default, key):
    """Run a section, log the error once, return default on failure."""
    try:
        return fn()
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Nexora Dashboard - {0}").format(key))
        return default


def _pct(cur, prev):
    """Percentage change helper (avoids division by zero)."""
    if prev:
        return flt((cur - prev) / abs(prev) * 100, 1)
    return flt(100, 1) if cur else 0


# ---------------------------------------------------------------------------
# Sales / Profit
# ---------------------------------------------------------------------------
def _build_sales(company, today, yesterday):
    month_start = getdate(today).replace(day=1)
    prev_month_start = getdate(add_months(month_start, -1))
    prev_month_end = getdate(add_days(month_start, -1))

    trend90 = _daily_trend(company, add_days(today, -89), today)
    by_date = {r["date"]: r for r in trend90}

    def day(d):
        r = by_date.get(str(d)) or {}
        return {"amount": flt(r.get("amount")), "count": int(r.get("count") or 0),
                "profit": flt(r.get("profit")), "qty": flt(r.get("qty"))}

    today_s = day(today)
    yesterday_s = day(yesterday)
    prev_day_s = day(add_days(yesterday, -1))

    def range_sum(start, end):
        amt = count = profit = qty = 0.0
        cur = getdate(start)
        end_d = getdate(end)
        while cur <= end_d:
            r = by_date.get(str(cur))
            if r:
                amt += flt(r.get("amount"))
                count += int(r.get("count") or 0)
                profit += flt(r.get("profit"))
                qty += flt(r.get("qty"))
            cur = add_days(cur, 1)
        return {"amount": flt(amt, 2), "count": count, "profit": flt(profit, 2), "qty": flt(qty, 2)}

    month_s = range_sum(month_start, today)
    prev_s = range_sum(prev_month_start, prev_month_end)

    avg7 = range_sum(add_days(yesterday, -7), add_days(yesterday, -1))
    avg7_amt = flt(avg7["amount"] / 7, 2)
    avg7_profit = flt(avg7["profit"] / 7, 2)
    avg7_count = flt(avg7["count"] / 7, 1)
    avg7_qty = flt(avg7["qty"] / 7, 2)

    trend = trend90[-30:]
    top_items = _top_items(company, add_days(today, -29), today)
    top_customers = _top_customers(company, add_days(today, -29), today)

    def pct(cur, prev):
        if prev:
            return flt((cur - prev) / abs(prev) * 100, 1)
        return flt(100, 1) if cur else 0

    def avg(d):
        return flt(d["amount"] / d["count"], 2) if d["count"] else 0

    return {
        "today": today_s,
        "yesterday": yesterday_s,
        "prev_day": prev_day_s,
        "today_vs_yesterday": {
            "change_pct": pct(today_s["amount"], yesterday_s["amount"]),
            "profit_change_pct": pct(today_s["profit"], yesterday_s["profit"]),
        },
        "yesterday_change": {
            "amount_pct": pct(yesterday_s["amount"], prev_day_s["amount"]),
            "count_pct": pct(yesterday_s["count"], prev_day_s["count"]),
            "profit_pct": pct(yesterday_s["profit"], prev_day_s["profit"]),
            "qty_pct": pct(yesterday_s["qty"], prev_day_s["qty"]),
            "avg_pct": pct(avg(yesterday_s), avg(prev_day_s)),
        },
        "avg_7d": {"amount": avg7_amt, "profit": avg7_profit, "count": avg7_count, "qty": avg7_qty},
        "yesterday_vs_7d": {
            "amount_pct": pct(yesterday_s["amount"], avg7_amt),
            "profit_pct": pct(yesterday_s["profit"], avg7_profit),
            "count_pct": pct(yesterday_s["count"], avg7_count),
            "qty_pct": pct(yesterday_s["qty"], avg7_qty),
        },
        "yesterday_avg_invoice": avg(yesterday_s),
        "prev_avg_invoice": avg(prev_day_s),
        "month": {
            "amount": month_s["amount"],
            "count": month_s["count"],
            "profit": month_s["profit"],
            "qty": month_s["qty"],
            "prev_amount": prev_s["amount"],
            "prev_profit": prev_s["profit"],
            "prev_qty": prev_s["qty"],
            "change_pct": pct(month_s["amount"], prev_s["amount"]),
        },
        "trend": trend,
        "top_items": top_items,
        "top_customers": top_customers,
    }


def _daily_trend(company, start, end):
    rows = frappe.db.sql(
        """
        SELECT si.posting_date AS d,
               COUNT(DISTINCT si.name) AS count,
               IFNULL(SUM(si.grand_total), 0) AS amount,
               IFNULL(SUM(x.profit), 0) AS profit,
               IFNULL(SUM(x.qty), 0) AS qty
        FROM `tabSales Invoice` si
        LEFT JOIN (
            SELECT sii.parent,
                   SUM(CASE WHEN IFNULL(it.is_stock_item, 1) = 1
                            THEN IFNULL(sii.qty, 0) * (IFNULL(sii.net_rate, 0) - IFNULL(it.valuation_rate, 0))
                            ELSE 0 END) AS profit,
                   SUM(IFNULL(sii.qty, 0)) AS qty
            FROM `tabSales Invoice Item` sii
            LEFT JOIN `tabItem` it ON it.name = sii.item_code
            WHERE sii.parent IN (
                SELECT name FROM `tabSales Invoice`
                WHERE docstatus = 1 AND company = %s AND posting_date BETWEEN %s AND %s
            )
            GROUP BY sii.parent
        ) x ON x.parent = si.name
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY si.posting_date
        ORDER BY si.posting_date
        """,
        (company, start, end, company, start, end),
        as_dict=True,
    )
    by_date = {r["d"]: r for r in rows}
    out = []
    cur = getdate(start)
    end_d = getdate(end)
    while cur <= end_d:
        r = by_date.get(cur)
        out.append({
            "date": str(cur),
            "amount": flt(r["amount"], 2) if r else 0,
            "count": int(r["count"]) if r else 0,
            "profit": flt(r["profit"], 2) if r else 0,
            "qty": flt(r["qty"], 2) if r else 0,
        })
        cur = add_days(cur, 1)
    return out


def _top_items(company, start, end, limit=10):
    rows = frappe.db.sql(
        """
        SELECT sii.item_code, IFNULL(it.item_name, sii.item_name) AS item_name,
               SUM(IFNULL(sii.qty, 0)) AS qty, SUM(IFNULL(sii.amount, 0)) AS amount
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY sii.item_code, it.item_name, sii.item_name
        ORDER BY amount DESC
        LIMIT %s
        """,
        (company, start, end, limit),
        as_dict=True,
    )
    return [
        {"item_code": r["item_code"], "item_name": r["item_name"], "qty": flt(r["qty"], 2), "amount": flt(r["amount"], 2)}
        for r in rows
    ]


def _top_customers(company, start, end, limit=10):
    rows = frappe.db.sql(
        """
        SELECT si.customer, IFNULL(c.customer_name, si.customer_name) AS customer_name,
               COUNT(DISTINCT si.name) AS count, SUM(IFNULL(si.grand_total, 0)) AS amount
        FROM `tabSales Invoice` si
        LEFT JOIN `tabCustomer` c ON c.name = si.customer
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY si.customer, c.customer_name, si.customer_name
        ORDER BY amount DESC
        LIMIT %s
        """,
        (company, start, end, limit),
        as_dict=True,
    )
    return [
        {"customer": r["customer"], "customer_name": r["customer_name"], "count": int(r["count"] or 0), "amount": flt(r["amount"], 2)}
        for r in rows
    ]


# ---------------------------------------------------------------------------
# Cash / Receivables / Payables
# ---------------------------------------------------------------------------
def _gl_series_map(company, today, groups, days=14):
    """Consolidated daily running-balance series for GL account-type groups.

    groups: list of (label, (account_type, ...)) e.g. [("cash", ("Cash", "Bank"))].
    Returns {label: [{"date": "YYYY-MM-DD", "amount": float}, ...]}.
    Runs exactly three queries regardless of the number of groups (no N+1).
    """
    start = getdate(add_days(today, -(days - 1)))
    conds = []
    params = [company]
    for _, ts in groups:
        conds.append("a.account_type IN ({0})".format(",".join(["%s"] * len(ts))))
        params.extend(ts)
    rows = frappe.db.sql(
        """
        SELECT a.name, a.account_type
        FROM `tabAccount` a
        WHERE a.company = %s AND a.is_group = 0 AND a.disabled = 0 AND ({0})
        """.format(" OR ".join(conds)),
        tuple(params),
        as_dict=True,
    )
    label_of = {}
    accs = []
    for label, ts in groups:
        for r in rows:
            if r["account_type"] in ts and r["name"] not in label_of:
                label_of[r["name"]] = label
                accs.append(r["name"])
    result = {label: [] for label, _ in groups}
    if not accs:
        return result
    ph = ",".join(["%s"] * len(accs))
    base_rows = frappe.db.sql(
        """
        SELECT account, SUM(IFNULL(debit, 0) - IFNULL(credit, 0)) AS bal
        FROM `tabGL Entry`
        WHERE company = %s AND account IN ({0}) AND posting_date < %s
          AND docstatus < 2 AND IFNULL(is_cancelled, 0) = 0
        GROUP BY account
        """.format(ph),
        (company,) + tuple(accs) + (start,),
        as_dict=True,
    )
    base_by_acc = {r["account"]: flt(r["bal"]) for r in base_rows}
    daily_rows = frappe.db.sql(
        """
        SELECT account, posting_date AS d, SUM(IFNULL(debit, 0) - IFNULL(credit, 0)) AS net
        FROM `tabGL Entry`
        WHERE company = %s AND account IN ({0}) AND posting_date BETWEEN %s AND %s
          AND docstatus < 2 AND IFNULL(is_cancelled, 0) = 0
        GROUP BY account, posting_date
        """.format(ph),
        (company,) + tuple(accs) + (start, today),
        as_dict=True,
    )
    nets = {}
    for r in daily_rows:
        nets.setdefault(r["account"], {})[r["d"]] = flt(r["net"])
    for label, ts in groups:
        laccs = [a for a in accs if label_of[a] == label]
        running = sum(base_by_acc.get(a, 0) for a in laccs)
        out = []
        cur = getdate(start)
        while cur <= getdate(today):
            for a in laccs:
                running += nets.get(a, {}).get(cur, 0)
            out.append({"date": str(cur), "amount": flt(running, 2)})
            cur = add_days(cur, 1)
        result[label] = out
    return result


def _receivables_detail(company):
    rows = frappe.db.sql(
        """
        SELECT si.name, si.customer, IFNULL(c.customer_name, si.customer_name) AS customer_name,
               si.posting_date, si.due_date, IFNULL(si.outstanding_amount, 0) AS outstanding
        FROM `tabSales Invoice` si
        LEFT JOIN `tabCustomer` c ON c.name = si.customer
        WHERE si.docstatus = 1 AND si.company = %s AND IFNULL(si.outstanding_amount, 0) > 0
        ORDER BY si.due_date
        """,
        (company,),
        as_dict=True,
    )
    today = getdate(nowdate())
    total = flt(sum(flt(r["outstanding"]) for r in rows), 2)
    overdue_rows = [r for r in rows if r.get("due_date") and getdate(r["due_date"]) < today]
    overdue = flt(sum(flt(r["outstanding"]) for r in overdue_rows), 2)
    aging = {"current": 0.0, "1_30": 0.0, "31_60": 0.0, "61_90": 0.0, "90_plus": 0.0}
    for r in rows:
        days_ = (today - getdate(r["due_date"])).days if r.get("due_date") else 0
        o = flt(r["outstanding"])
        if days_ <= 0:
            aging["current"] += o
        elif days_ <= 30:
            aging["1_30"] += o
        elif days_ <= 60:
            aging["31_60"] += o
        elif days_ <= 90:
            aging["61_90"] += o
        else:
            aging["90_plus"] += o
    top = {}
    for r in rows:
        t = top.setdefault(r["customer"], {
            "customer": r["customer"],
            "customer_name": r.get("customer_name") or r["customer"],
            "amount": 0.0, "overdue": 0.0, "count": 0,
        })
        t["amount"] += flt(r["outstanding"])
        t["count"] += 1
        if r.get("due_date") and getdate(r["due_date"]) < today:
            t["overdue"] += flt(r["outstanding"])
    top5 = [
        {"customer": v["customer"], "customer_name": v["customer_name"],
         "amount": flt(v["amount"], 2), "overdue": flt(v["overdue"], 2), "count": v["count"]}
        for v in sorted(top.values(), key=lambda v: v["amount"], reverse=True)[:5]
    ]
    return {
        "total": total,
        "overdue": overdue,
        "overdue_pct": flt(overdue / total * 100, 1) if total else 0,
        "count": len(rows),
        "overdue_count": len(overdue_rows),
        "aging": {k: flt(v, 2) for k, v in aging.items()},
        "top": top5,
    }


def _payables_detail(company):
    rows = frappe.db.sql(
        """
        SELECT pi.name, pi.supplier, IFNULL(s.supplier_name, pi.supplier_name) AS supplier_name,
               pi.posting_date, pi.due_date, IFNULL(pi.outstanding_amount, 0) AS outstanding
        FROM `tabPurchase Invoice` pi
        LEFT JOIN `tabSupplier` s ON s.name = pi.supplier
        WHERE pi.docstatus = 1 AND pi.company = %s AND IFNULL(pi.outstanding_amount, 0) > 0
        ORDER BY pi.due_date
        """,
        (company,),
        as_dict=True,
    )
    today = getdate(nowdate())
    total = flt(sum(flt(r["outstanding"]) for r in rows), 2)
    overdue_rows = [r for r in rows if r.get("due_date") and getdate(r["due_date"]) < today]
    overdue = flt(sum(flt(r["outstanding"]) for r in overdue_rows), 2)
    return {
        "total": total,
        "overdue": overdue,
        "overdue_pct": flt(overdue / total * 100, 1) if total else 0,
        "count": len(rows),
        "overdue_count": len(overdue_rows),
    }


def _cash_position(company, today=None, series=None):
    today = today or nowdate()
    series = series or {}
    accounts = frappe.db.sql(
        """
        SELECT a.name, a.account_type, a.account_currency,
               IFNULL((SELECT SUM(IFNULL(gle.debit, 0) - IFNULL(gle.credit, 0))
                       FROM `tabGL Entry` gle WHERE gle.account = a.name AND gle.company = %s
                         AND gle.docstatus < 2 AND IFNULL(gle.is_cancelled, 0) = 0), 0) AS balance
        FROM `tabAccount` a
        WHERE a.company = %s AND a.is_group = 0 AND a.disabled = 0
          AND a.account_type IN ('Cash', 'Bank')
        ORDER BY a.account_type, a.name
        """,
        (company, company),
        as_dict=True,
    )
    cash = sum(flt(a["balance"]) for a in accounts if a["account_type"] == "Cash")
    bank = sum(flt(a["balance"]) for a in accounts if a["account_type"] == "Bank")

    recv_detail = _receivables_detail(company)
    pay_detail = _payables_detail(company)
    recv = recv_detail["total"]
    pay = pay_detail["total"]

    cash_series = series.get("cash") or (_gl_series_map(company, today, [("cash", ("Cash", "Bank"))], 14).get("cash") or [])
    ar_series = series.get("ar") or (_gl_series_map(company, today, [("ar", ("Receivable",))], 14).get("ar") or [])
    ap_series = series.get("ap") or (_gl_series_map(company, today, [("ap", ("Payable",))], 14).get("ap") or [])
    total = flt(cash + bank, 2)
    prev_total = cash_series[0]["amount"] if len(cash_series) > 1 else None
    change_pct_7d = flt((total - prev_total) / abs(prev_total) * 100, 1) if prev_total else None
    yesterday_total = cash_series[-2]["amount"] if len(cash_series) >= 2 else total

    return {
        "cash": flt(cash, 2),
        "bank": flt(bank, 2),
        "total": total,
        "receivables": recv,
        "payables": pay,
        "net_position": flt(cash + bank - pay + recv, 2),
        "prev_total": flt(prev_total, 2) if prev_total is not None else 0,
        "change_pct_7d": change_pct_7d,
        "yesterday": flt(yesterday_total, 2),
        "series": cash_series,
        "ar_series": ar_series,
        "ap_series": ap_series,
        "receivables_detail": recv_detail,
        "payables_detail": pay_detail,
        "overdue_receivables": recv_detail["overdue"],
        "overdue_payables": pay_detail["overdue"],
        "accounts": [
            {"name": a["name"], "account_type": a["account_type"], "balance": flt(a["balance"], 2)}
            for a in accounts
        ],
    }


# ---------------------------------------------------------------------------
# Purchasing
# ---------------------------------------------------------------------------
def _purchase_performance(company, today):
    month_start = getdate(today).replace(day=1)
    prev_month_start = getdate(add_months(month_start, -1))
    prev_month_end = getdate(add_days(month_start, -1))

    def pi_stats(start, end):
        row = frappe.db.sql(
            """
            SELECT IFNULL(SUM(grand_total), 0) AS amount, COUNT(*) AS count
            FROM `tabPurchase Invoice`
            WHERE docstatus = 1 AND company = %s AND posting_date BETWEEN %s AND %s
            """,
            (company, start, end),
            as_dict=True,
        )
        return {"amount": flt(row[0]["amount"], 2), "count": int(row[0]["count"] or 0)}

    month = pi_stats(month_start, today)
    prev = pi_stats(prev_month_start, prev_month_end)

    requests = _purchase_requests(company)
    top_suppliers = _top_suppliers(company, add_days(today, -29), today)
    pending_pos = {"count": 0, "amount": 0, "avg_age_days": 0, "avg_delay_days": 0}
    if frappe.db.table_exists("Purchase Order"):
        row = frappe.db.sql(
            """
            SELECT IFNULL(SUM(grand_total), 0) AS amount, COUNT(*) AS count,
                   IFNULL(AVG(DATEDIFF(%s, IFNULL(transaction_date, creation))), 0) AS avg_age
            FROM `tabPurchase Order`
            WHERE docstatus = 0 AND company = %s
            """,
            (today, company),
            as_dict=True,
        )
        pending_pos = {
            "count": int(row[0]["count"] or 0),
            "amount": flt(row[0]["amount"], 2),
            "avg_age_days": flt(row[0]["avg_age"] or 0, 1),
            "avg_delay_days": _po_delay_days(company, today),
        }

    return {
        "month": {"amount": month["amount"], "count": month["count"],
                  "prev_amount": prev["amount"], "change_pct":
                  flt((month["amount"] - prev["amount"]) / abs(prev["amount"]) * 100, 1) if prev["amount"] else (100 if month["amount"] else 0)},
        "requests_waiting": requests,
        "pending_pos": pending_pos,
        "top_suppliers": top_suppliers,
    }


def _purchase_requests(company):
    if not frappe.db.table_exists("Purchase Request"):
        return {"available": False, "count": 0, "amount": 0}
    row = frappe.db.sql(
        """
        SELECT IFNULL(SUM(total), 0) AS amount, COUNT(*) AS count
        FROM `tabPurchase Request`
        WHERE docstatus = 0 AND company = %s
        """,
        (company,),
        as_dict=True,
    )
    return {"available": True, "count": int(row[0]["count"] or 0), "amount": flt(row[0]["amount"], 2)}


def _sales_orders_pending(company, today=None):
    today = today or nowdate()
    if not frappe.db.table_exists("Sales Order"):
        return {"count": 0, "amount": 0, "avg_age_days": 0}
    row = frappe.db.sql(
        """
        SELECT IFNULL(SUM(grand_total), 0) AS amount, COUNT(*) AS count,
               IFNULL(AVG(DATEDIFF(%s, IFNULL(transaction_date, creation))), 0) AS avg_age
        FROM `tabSales Order`
        WHERE docstatus = 0 AND company = %s
        """,
        (today, company),
        as_dict=True,
    )
    return {
        "count": int(row[0]["count"] or 0),
        "amount": flt(row[0]["amount"], 2),
        "avg_age_days": flt(row[0]["avg_age"] or 0, 1),
    }


def _po_delay_days(company, today):
    """Average days past expected delivery for open (not fully received) POs."""
    if not frappe.db.field_exists("Purchase Order", "per_received"):
        return 0
    try:
        row = frappe.db.sql(
            """
            SELECT IFNULL(AVG(DATEDIFF(%s, IFNULL(schedule_date, transaction_date))), 0) AS d
            FROM `tabPurchase Order`
            WHERE docstatus = 1 AND company = %s AND IFNULL(per_received, 0) < 100
              AND IFNULL(schedule_date, transaction_date) IS NOT NULL
              AND IFNULL(schedule_date, transaction_date) < %s
            """,
            (today, company, today),
            as_dict=True,
        )
        return flt(row[0]["d"] or 0, 1)
    except Exception:
        return 0


def _doc_series(company, today, doctype, days=14, docstatus=0):
    """Daily creation count series for a doctype (draft by default)."""
    if not frappe.db.table_exists(doctype):
        return []
    start = add_days(today, -(days - 1))
    rows = frappe.db.sql(
        """
        SELECT DATE(creation) AS d, COUNT(*) AS count
        FROM `tab{0}`
        WHERE docstatus = %s AND company = %s AND creation >= %s
        GROUP BY DATE(creation)
        """.format(doctype),
        (docstatus, company, str(start)),
        as_dict=True,
    )
    by_date = {r["d"]: int(r["count"]) for r in rows}
    out = []
    cur = getdate(start)
    while cur <= getdate(today):
        out.append({"date": str(cur), "count": by_date.get(cur, 0)})
        cur = add_days(cur, 1)
    return out


def _stockout_series(company, today, days=14):
    """Daily count of negative stock-ledger movements (stockout events)."""
    start = add_days(today, -(days - 1))
    rows = frappe.db.sql(
        """
        SELECT posting_date AS d, COUNT(*) AS count
        FROM `tabStock Ledger Entry`
        WHERE company = %s AND actual_qty < 0 AND posting_date BETWEEN %s AND %s
          AND docstatus < 2 AND IFNULL(is_cancelled, 0) = 0
        GROUP BY posting_date ORDER BY posting_date
        """,
        (company, start, today),
        as_dict=True,
    )
    by_date = {r["d"]: int(r["count"]) for r in rows}
    out = []
    cur = getdate(start)
    while cur <= getdate(today):
        out.append({"date": str(cur), "count": by_date.get(cur, 0)})
        cur = add_days(cur, 1)
    return out


def _inventory_value_series(company, today, days=14):
    """Daily inventory value reconstructed backwards from current Bin valuation."""
    start = add_days(today, -(days - 1))
    current = flt(frappe.db.sql(
        """
        SELECT IFNULL(SUM(IFNULL(b.actual_qty, 0) * IFNULL(it.valuation_rate, 0)), 0)
        FROM `tabBin` b
        INNER JOIN `tabItem` it ON it.name = b.item_code
        WHERE it.disabled = 0 AND IFNULL(it.is_stock_item, 1) = 1
        """,
    )[0][0])
    rows = frappe.db.sql(
        """
        SELECT posting_date AS d, SUM(IFNULL(actual_qty, 0) * IFNULL(valuation_rate, 0)) AS delta
        FROM `tabStock Ledger Entry`
        WHERE company = %s AND posting_date BETWEEN %s AND %s
          AND docstatus < 2 AND IFNULL(is_cancelled, 0) = 0
        GROUP BY posting_date ORDER BY posting_date
        """,
        (company, start, today),
        as_dict=True,
    )
    by_date = {r["d"]: flt(r["delta"]) for r in rows}
    days_list = []
    cur = getdate(today)
    while cur >= getdate(start):
        days_list.append(cur)
        cur = add_days(cur, -1)
    rev = []
    bal = current
    for d in reversed(days_list):
        rev.append((d, bal))
        bal -= by_date.get(d, 0)
    return [{"date": str(d), "amount": flt(v, 2)} for d, v in reversed(rev)]


def _top_suppliers(company, start, end, limit=10):
    rows = frappe.db.sql(
        """
        SELECT pi.supplier, IFNULL(s.supplier_name, pi.supplier_name) AS supplier_name,
               COUNT(DISTINCT pi.name) AS count, SUM(IFNULL(pi.grand_total, 0)) AS amount
        FROM `tabPurchase Invoice` pi
        LEFT JOIN `tabSupplier` s ON s.name = pi.supplier
        WHERE pi.docstatus = 1 AND pi.company = %s AND pi.posting_date BETWEEN %s AND %s
        GROUP BY pi.supplier, s.supplier_name, pi.supplier_name
        ORDER BY amount DESC
        LIMIT %s
        """,
        (company, start, end, limit),
        as_dict=True,
    )
    return [
        {"supplier": r["supplier"], "supplier_name": r["supplier_name"], "count": int(r["count"] or 0), "amount": flt(r["amount"], 2)}
        for r in rows
    ]


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------
def _stock_by_item(company):
    """Single snapshot of every stock item's current Bin quantity and value."""
    return frappe.db.sql(
        """
        SELECT b.item_code, it.item_name, IFNULL(it.safety_stock, 0) AS safety_stock,
               IFNULL(it.valuation_rate, 0) AS valuation_rate,
               SUM(IFNULL(b.actual_qty, 0)) AS qty,
               SUM(IFNULL(b.actual_qty, 0) * IFNULL(it.valuation_rate, 0)) AS value
        FROM `tabBin` b
        INNER JOIN `tabItem` it ON it.name = b.item_code
        WHERE it.disabled = 0 AND IFNULL(it.is_stock_item, 1) = 1
        GROUP BY b.item_code, it.item_name, it.safety_stock, it.valuation_rate
        """,
        as_dict=True,
    )


def _consumption_map(company, days, end=None):
    """Units sold per item in the last `days` days (Sales Invoice based)."""
    end = end or nowdate()
    start = add_days(end, -(days - 1))
    rows = frappe.db.sql(
        """
        SELECT sii.item_code, SUM(IFNULL(sii.qty, 0)) AS qty, SUM(IFNULL(sii.amount, 0)) AS amount
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY sii.item_code
        """,
        (company, start, end),
        as_dict=True,
    )
    return {r["item_code"]: {"qty": flt(r["qty"]), "amount": flt(r["amount"])} for r in rows}


def _item_urgency(qty, threshold):
    if flt(qty) <= 0:
        return "critical"
    if flt(threshold) > 0 and flt(qty) <= flt(threshold):
        return "low"
    return "ok"


def _inventory_health(company, today=None, bins=None, series=None):
    today = today or nowdate()
    bins = bins if bins is not None else _stock_by_item(company)
    reorder = frappe.db.sql(
        "SELECT parent AS item_code, MIN(IFNULL(warehouse_reorder_level, 0)) AS level "
        "FROM `tabItem Reorder` GROUP BY parent",
        as_dict=True,
    )
    reorder_map = {r["item_code"]: flt(r["level"]) for r in reorder}
    cons30 = _consumption_map(company, 30, today)

    low_stock = []
    out_of_stock = []
    for r in bins:
        qty = flt(r["qty"])
        threshold = reorder_map.get(r["item_code"], flt(r["safety_stock"] or 0))
        consumed = cons30.get(r["item_code"], {}).get("qty", 0)
        daily = consumed / 30.0 if consumed else 0
        days_left = flt(qty / daily, 1) if daily > 0 else None
        rec = {
            "item_code": r["item_code"],
            "item_name": r["item_name"],
            "qty": qty,
            "threshold": threshold,
            "valuation_rate": flt(r["valuation_rate"], 2),
            "days_of_stock": days_left,
            "urgency": _item_urgency(qty, threshold),
        }
        if qty <= 0:
            out_of_stock.append(rec)
        elif threshold > 0 and qty <= threshold:
            low_stock.append(rec)

    low_stock.sort(key=lambda x: flt(x["qty"]) / x["threshold"] if x["threshold"] else 1)
    out_of_stock.sort(key=lambda x: x["valuation_rate"], reverse=True)
    critical = [r for r in out_of_stock if r["urgency"] == "critical"]

    warehouses = frappe.db.sql(
        """
        SELECT b.warehouse, COUNT(DISTINCT b.item_code) AS items,
               SUM(IFNULL(b.actual_qty, 0)) AS qty,
               SUM(IFNULL(b.actual_qty, 0) * IFNULL(it.valuation_rate, 0)) AS value
        FROM `tabBin` b
        INNER JOIN `tabItem` it ON it.name = b.item_code
        GROUP BY b.warehouse
        ORDER BY value DESC
        """,
        as_dict=True,
    )
    total_value = flt(sum(flt(r["value"]) for r in bins), 2)
    total_qty = flt(sum(flt(r["qty"]) for r in bins), 2)

    series = series or _inventory_value_series(company, today, 14)
    prev_value = series[-2]["amount"] if len(series) >= 2 else None
    change_pct = flt((total_value - prev_value) / abs(prev_value) * 100, 1) if prev_value else None

    return {
        "total_value": total_value,
        "total_qty": total_qty,
        "item_count": len(bins),
        "low_stock": {"count": len(low_stock), "items": low_stock[:10]},
        "out_of_stock": {"count": len(out_of_stock), "items": out_of_stock[:10]},
        "critical_count": len(critical),
        "prev_value": flt(prev_value, 2) if prev_value is not None else 0,
        "change_pct": change_pct,
        "series": series,
        "warehouses": [
            {"warehouse": w["warehouse"], "items": int(w["items"] or 0), "qty": flt(w["qty"], 2), "value": flt(w["value"], 2)}
            for w in warehouses
        ],
    }


def _inventory_intelligence(company, today, bins=None):
    """Real inventory classification: top moving / dead / fast / slow / fast-growing."""
    today = today or nowdate()
    bins = bins if bins is not None else _stock_by_item(company)
    in_stock = {r["item_code"]: r for r in bins if flt(r["qty"]) > 0}

    cons30 = _consumption_map(company, 30, today)
    cons_prev = _consumption_map(company, 30, add_days(today, -30))

    moved = []
    for code, r in in_stock.items():
        c = cons30.get(code) or {"qty": 0, "amount": 0}
        qty = flt(r["qty"])
        sold = flt(c["qty"])
        rec = {
            "item_code": code,
            "item_name": r["item_name"],
            "qty": qty,
            "sold_30d": sold,
            "value_30d": flt(c["amount"]),
            "stock_value": flt(r["value"]),
            "days_of_stock": flt(qty / (sold / 30.0), 1) if sold else None,
            "turnover": flt(sold / qty, 3) if qty > 0 else 0,
        }
        moved.append(rec)
    moved.sort(key=lambda x: (x["sold_30d"], x["value_30d"]), reverse=True)

    top_moving = moved[:10]
    dead_stock = sorted([r for r in moved if r["sold_30d"] == 0],
                        key=lambda x: x["stock_value"], reverse=True)
    sellable = [r for r in moved if r["sold_30d"] > 0]
    fast_moving = sorted(sellable, key=lambda x: x["turnover"], reverse=True)[:10]
    slow_moving = sorted(sellable, key=lambda x: x["turnover"])[:10]

    growing = []
    for r in sellable:
        prev = flt(cons_prev.get(r["item_code"], {}).get("qty", 0))
        if prev > 0:
            pct_g = flt((r["sold_30d"] - prev) / prev * 100, 1)
            if pct_g >= 10:
                growing.append(dict(r, growth_pct=pct_g, prev_30d_qty=flt(prev, 2)))
    growing.sort(key=lambda x: x["growth_pct"], reverse=True)
    growing = growing[:10]

    def slim(rows):
        return [
            {"item_code": r["item_code"], "item_name": r["item_name"], "qty": flt(r["qty"], 2),
             "sold_30d": flt(r["sold_30d"], 2), "value_30d": flt(r["value_30d"], 2),
             "stock_value": flt(r["stock_value"], 2),
             "days_of_stock": r["days_of_stock"], "turnover": flt(r["turnover"], 3)}
            for r in rows
        ]

    return {
        "top_moving": slim(top_moving),
        "dead_stock": slim(dead_stock[:10]),
        "dead_stock_count": len(dead_stock),
        "fast_moving": slim(fast_moving),
        "slow_moving": slim(slow_moving),
        "slow_moving_count": len(slow_moving),
        "fast_growing": [
            {"item_code": r["item_code"], "item_name": r["item_name"], "qty": flt(r["qty"], 2),
             "sold_30d": flt(r["sold_30d"], 2), "prev_30d_qty": r["prev_30d_qty"],
             "growth_pct": r["growth_pct"]}
            for r in growing
        ],
    }


# ---------------------------------------------------------------------------
# Exchange rates / Pricing alerts / Notifications
# ---------------------------------------------------------------------------
def _exchange_rates(company):
    base = _company_currency(company)
    rows = frappe.db.sql(
        """
        SELECT from_currency, to_currency, exchange_rate, date
        FROM `tabCurrency Exchange`
        WHERE to_currency = %s
        ORDER BY date DESC, creation DESC
        """,
        (base,),
        as_dict=True,
    )
    majors = ["USD", "EUR", "GBP", "AED", "SAR", "TRY", "CNY"]
    alerts = []
    seen = set()
    for r in rows:
        if r["from_currency"] in seen:
            continue
        seen.add(r["from_currency"])
        prev = None
        for r2 in rows:
            if r2["from_currency"] == r["from_currency"] and getdate(r2["date"]) <= getdate(add_days(r["date"], -6)):
                prev = r2
                break
        rate = flt(r["exchange_rate"])
        prev_rate = flt(prev["exchange_rate"]) if prev else None
        change_pct = flt((rate - prev_rate) / prev_rate * 100, 2) if prev_rate else None
        alerts.append({
            "from_currency": r["from_currency"],
            "to_currency": base,
            "rate": rate,
            "date": str(r["date"]),
            "prev_rate": prev_rate,
            "change_pct": change_pct,
        })
    missing = [m for m in majors if m not in seen]
    return {"base_currency": base, "alerts": alerts, "missing": missing}


def _pricing_alerts(company):
    rows = frappe.db.sql(
        """
        SELECT ip.item_code, it.item_name, it.valuation_rate, ip.price_list, ip.price_list_rate
        FROM `tabItem Price` ip
        INNER JOIN `tabItem` it ON it.name = ip.item_code
        INNER JOIN `tabPrice List` pl ON pl.name = ip.price_list
        WHERE pl.selling = 1 AND it.valuation_rate > 0 AND ip.price_list_rate <= it.valuation_rate
        ORDER BY it.valuation_rate - ip.price_list_rate DESC
        LIMIT 25
        """,
        as_dict=True,
    )
    total_loss = sum(flt(r["valuation_rate"] - r["price_list_rate"]) * 1 for r in rows)
    return {
        "count": len(rows),
        "items": [
            {"item_code": r["item_code"], "item_name": r["item_name"],
             "valuation_rate": flt(r["valuation_rate"], 2), "price_list_rate": flt(r["price_list_rate"], 2)}
            for r in rows
        ],
        "impact": flt(total_loss, 2),
    }


def _notifications():
    if not frappe.db.table_exists("Notification Log"):
        return {"unread": 0, "recent": []}
    user = frappe.session.user
    unread = frappe.db.count("Notification Log", {"for_user": user, "read": 0})
    recent = frappe.db.sql(
        """
        SELECT subject, creation, `read`
        FROM `tabNotification Log`
        WHERE for_user = %s
        ORDER BY creation DESC
        LIMIT 10
        """,
        (user,),
        as_dict=True,
    )
    return {
        "unread": int(unread or 0),
        "recent": [
            {"subject": r["subject"], "creation": str(r["creation"]), "read": bool(r["read"])}
            for r in recent
        ],
    }


# ---------------------------------------------------------------------------
# Global search
# ---------------------------------------------------------------------------
def _search_group(label, rows, route_fmt, color="blue", icon=None):
    out = []
    for r in rows:
        out.append({
            "name": r.get("name"),
            "title": r.get("title") or r.get("name"),
            "subtitle": r.get("subtitle") or "",
            "route": route_fmt.format(name=r.get("name")),
        })
    return {"label": label, "color": color, "icon": icon or "box", "items": out}


@frappe.whitelist()
def global_search(q, company=None, limit=10):
    _check_permission()
    q = (q or "").strip()
    if len(q) < 2:
        return {"query": q, "groups": []}
    limit = max(1, min(int(limit or 10), 30))
    like = "%{0}%".format(q)
    groups = []

    def get_list(doctype, fields, or_filters, limit_page_length=limit, order_by="modified desc"):
        try:
            return frappe.get_all(
                doctype,
                fields=fields,
                or_filters=or_filters,
                limit_page_length=limit_page_length,
                order_by=order_by,
            )
        except Exception:
            return []

    # Items
    items = get_list("Item", ["name", "item_name", "stock_uom", "disabled"],
                     [["name", "like", like], ["item_name", "like", like]])
    if items:
        groups.append(_search_group(
            _("Items"), items, "/app/item/{name}", "teal", "box",
        ))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r.get("item_name") or r["name"],
             "subtitle": "{0} · {1}".format(r["name"], r.get("stock_uom") or ""),
             "route": "/app/item/{0}".format(r["name"])} for r in items
        ]

    # Customers
    custs = get_list("Customer", ["name", "customer_name"],
                     [["name", "like", like], ["customer_name", "like", like]])
    if custs:
        groups.append(_search_group(
            _("Customers"), custs, "/app/customer/{name}", "blue", "users",
        ))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r.get("customer_name") or r["name"],
             "subtitle": r["name"], "route": "/app/customer/{0}".format(r["name"])} for r in custs
        ]

    # Suppliers
    supps = get_list("Supplier", ["name", "supplier_name"],
                     [["name", "like", like], ["supplier_name", "like", like]])
    if supps:
        groups.append(_search_group(
            _("Suppliers"), supps, "/app/supplier/{name}", "green", "truck",
        ))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r.get("supplier_name") or r["name"],
             "subtitle": r["name"], "route": "/app/supplier/{0}".format(r["name"])} for r in supps
        ]

    # Sales Invoices
    sis = get_list("Sales Invoice", ["name", "customer", "grand_total", "status"],
                   [["name", "like", like]])
    if sis:
        groups.append(_search_group(_("Sales Invoices"), sis, "/app/sales-invoice/{name}", "purple", "file"))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r["name"],
             "subtitle": "{0} · {1}".format(r.get("customer") or "", r.get("grand_total") or ""),
             "route": "/app/sales-invoice/{0}".format(r["name"])} for r in sis
        ]

    # Purchase Invoices
    pis = get_list("Purchase Invoice", ["name", "supplier", "grand_total", "status"],
                   [["name", "like", like]])
    if pis:
        groups.append(_search_group(_("Purchase Invoices"), pis, "/app/purchase-invoice/{name}", "orange", "file"))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r["name"],
             "subtitle": "{0} · {1}".format(r.get("supplier") or "", r.get("grand_total") or ""),
             "route": "/app/purchase-invoice/{0}".format(r["name"])} for r in pis
        ]

    # Purchase Orders
    pos = get_list("Purchase Order", ["name", "supplier", "grand_total", "status"],
                   [["name", "like", like]])
    if pos:
        groups.append(_search_group(_("Purchase Orders"), pos, "/app/purchase-order/{name}", "yellow", "cart"))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r["name"],
             "subtitle": "{0} · {1}".format(r.get("supplier") or "", r.get("grand_total") or ""),
             "route": "/app/purchase-order/{0}".format(r["name"])} for r in pos
        ]

    # Barcodes
    if frappe.db.table_exists("Barcode"):
        bcs = get_list("Barcode", ["barcode", "item_code"],
                       [["barcode", "like", like], ["item_code", "like", like]])
        if bcs:
            items_map = {}
            codes = [r.get("item_code") for r in bcs if r.get("item_code")]
            if codes:
                try:
                    items_map = {i["name"]: i.get("item_name") or i["name"] for i in
                                 frappe.get_all("Item", filters={"name": ["in", codes]},
                                                fields=["name", "item_name"])}
                except Exception:
                    items_map = {}
            groups.append({
                "label": _("Barcodes"),
                "color": "purple",
                "icon": "zap",
                "items": [{
                    "name": r.get("barcode") or r.get("item_code"),
                    "title": r.get("barcode") or r.get("item_code"),
                    "subtitle": (r.get("item_code") or "") + (" · " + items_map.get(r.get("item_code"), "") if items_map.get(r.get("item_code")) else ""),
                    "route": "/app/item/{0}".format(r.get("item_code") or ""),
                } for r in bcs],
            })

    # Reports
    reps = get_list("Report", ["name", "ref_doctype"],
                    [["name", "like", like]], limit_page_length=limit, order_by="name asc")
    if reps:
        groups.append(_search_group(_("Reports"), reps, "/app/query-report/{name}", "indigo", "chart"))
        groups[-1]["items"] = [
            {"name": r["name"], "title": r["name"],
             "subtitle": r.get("ref_doctype") or "", "route": "/app/query-report/{0}".format(r["name"])} for r in reps
        ]

    # Settings
    if "settings" in q.lower() or "setting" in q.lower():
        groups.append({
            "label": _("Settings"),
            "color": "gray",
            "icon": "file",
            "items": [{
                "name": "Nexora Settings",
                "title": _("Nexora Settings"),
                "subtitle": _("Workspace preferences"),
                "route": "/app/nexora-settings",
            }],
        })

    return {"query": q, "groups": groups}


# ---------------------------------------------------------------------------
# Barcode lifecycle API
# ---------------------------------------------------------------------------
def _default_selling_price_list():
    pl = frappe.db.get_single_value("Selling Settings", "selling_price_list")
    if pl:
        return pl
    row = frappe.get_all("Price List", filters=[["enabled", "=", 1], ["selling", "=", 1]], limit=1, order_by="name asc", pluck="name")
    return row[0] if row else None


def _enrich_items(items):
    """Attach live stock quantity + default selling price to item rows."""
    if not items:
        return items
    names = [i["name"] for i in items]
    price_map = {}
    stock_map = {}
    try:
        pl = _default_selling_price_list()
        if pl:
            prices = frappe.get_all("Item Price",
                                    filters={"item_code": ["in", names], "price_list": pl},
                                    fields=["item_code", "price_list_rate", "currency"])
            for p in prices:
                price_map[p["item_code"]] = {"price_list": pl, "rate": p.get("price_list_rate"), "currency": p.get("currency")}
    except Exception:
        pass
    try:
        bins = frappe.get_all("Bin", filters={"item_code": ["in", names]}, fields=["item_code", "actual_qty"])
        for b in bins:
            stock_map[b["item_code"]] = flt(stock_map.get(b["item_code"], 0)) + flt(b.get("actual_qty"))
    except Exception:
        pass
    for i in items:
        i["stock_qty"] = flt(stock_map.get(i["name"], 0))
        i["price"] = price_map.get(i["name"]) or {}
    return items


@frappe.whitelist()
def item_search(q=None, limit=10, with_price=True):
    """Instant item lookup by item code or item name (partial match).

    Barcode matches are resolved on the client from the Nexora barcode
    registry; the server returns live item details, price, stock and company
    so the Barcode Studio can load an item completely.
    """
    _check_permission()
    q = (q or "").strip()
    if len(q) < 1:
        return {"items": []}
    limit = max(1, min(int(limit or 10), 40))
    like = "%{0}%".format(q)

    items = frappe.get_all(
        "Item",
        fields=["name", "item_name", "stock_uom", "disabled", "image", "valuation_rate", "item_group"],
        or_filters=[["name", "like", like], ["item_name", "like", like]],
        limit_page_length=limit,
        order_by="modified desc",
    )
    if not items:
        return {"items": []}
    if with_price:
        _enrich_items(items)
    company = _resolve_company()
    for i in items:
        i["company"] = company
        i["barcode"] = ""
    return {"items": items}


@frappe.whitelist()
def barcode_studio(company=None, limit=200):
    """Aggregate payload for the full Barcode Studio workspace.

    Item, price, stock, purchase receipt and purchase invoice data is live
    ERPNext data. The barcode registry itself lives in the Nexora client so
    the workspace can assign/generate labels without ERPNext schema changes.
    """
    _check_permission()
    company = _resolve_company(company)
    limit = max(10, min(int(limit or 200), 2000))

    all_items = []
    try:
        all_items = frappe.get_all(
            "Item",
            fields=["name", "item_name", "stock_uom", "disabled", "valuation_rate", "item_group"],
            limit_page_length=limit,
            order_by="name asc",
        )
        _enrich_items(all_items)
    except Exception:
        all_items = []

    names = [i["name"] for i in all_items]

    pr_items = []
    pi_items = []
    try:
        if names:
            pr_items = frappe.get_all(
                "Purchase Receipt Item",
                filters={"item_code": ["in", names], "docstatus": 1},
                fields=["name", "parent", "item_code", "item_name", "qty", "uom"],
                limit_page_length=limit,
                order_by="parent desc",
            )
    except Exception:
        pr_items = []
    try:
        if names:
            pi_items = frappe.get_all(
                "Purchase Invoice Item",
                filters={"item_code": ["in", names], "docstatus": 1},
                fields=["name", "parent", "item_code", "item_name", "qty", "uom"],
                limit_page_length=limit,
                order_by="parent desc",
            )
    except Exception:
        pi_items = []

    def _parents(child_rows, doctype):
        pnames = list({c["parent"] for c in child_rows})
        if not pnames:
            return {}
        try:
            docs = frappe.get_all(doctype, filters={"name": ["in", pnames]},
                                  fields=["name", "supplier", "posting_date", "status", "grand_total"])
            return {d["name"]: d for d in docs}
        except Exception:
            return {}

    pr_parents = _parents(pr_items, "Purchase Receipt")
    pi_parents = _parents(pi_items, "Purchase Invoice")

    def _attach(rows, parents):
        out = []
        for r in rows:
            p = parents.get(r["parent"]) or {}
            out.append({
                "docname": r["parent"],
                "item_code": r["item_code"],
                "item_name": r.get("item_name") or r["item_code"],
                "qty": flt(r.get("qty", 0)),
                "uom": r.get("uom") or "",
                "supplier": p.get("supplier") or "",
                "date": str(p.get("posting_date") or ""),
                "status": p.get("status") or "",
                "grand_total": p.get("grand_total") or 0,
            })
        return out

    return {
        "company": company,
        "kpis": {
            "total_items": len(all_items),
            "pending_receipts": len(pr_items),
            "pending_invoices": len(pi_items),
        },
        "items": all_items,
        "pending_receipts": _attach(pr_items, pr_parents),
        "pending_invoices": _attach(pi_items, pi_parents),
    }


# ---------------------------------------------------------------------------
# v3.6 Analytics (12-month series, donuts, quick operations)
# ---------------------------------------------------------------------------
def _month_axis(n):
    from calendar import month_abbr
    today = getdate(nowdate())
    out = []
    for i in range(n - 1, -1, -1):
        m = add_months(today, -i)
        out.append({
            "year": m.year,
            "month": m.month,
            "key": "{0:04d}-{1:02d}".format(m.year, m.month),
            "label": month_abbr[m.month],
        })
    return out


def _current_inventory_value():
    rows = frappe.db.sql(
        """
        SELECT IFNULL(SUM(IFNULL(sle.stock_value, 0)), 0) AS value
        FROM `tabStock Ledger Entry` sle
        WHERE sle.name IN (
            SELECT MAX(name) FROM `tabStock Ledger Entry`
            GROUP BY item_code, warehouse
        )
        """,
        as_dict=True,
    )
    return flt(rows[0]["value"], 2) if rows else 0


def _series12(company):
    axis = _month_axis(12)
    start = "{0:04d}-{1:02d}-01".format(axis[0]["year"], axis[0]["month"])
    end = str(nowdate())
    keys = [m["key"] for m in axis]

    sales_rows = frappe.db.sql(
        """
        SELECT DATE_FORMAT(si.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(si.base_net_total, 0)) AS net,
               SUM(IFNULL(si.base_grand_total, 0)) AS grand,
               IFNULL(SUM(
                   CASE WHEN IFNULL(it.is_stock_item, 1) = 1
                        THEN IFNULL(sii.qty, 0) * (IFNULL(sii.net_rate, 0) - IFNULL(it.valuation_rate, 0))
                        ELSE 0 END
               ), 0) AS profit,
               COUNT(DISTINCT si.name) AS count
        FROM `tabSales Invoice` si
        LEFT JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        LEFT JOIN `tabItem` it ON it.name = sii.item_code
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
        GROUP BY ym
        """,
        (company, start, end),
        as_dict=True,
    )

    purchase_rows = frappe.db.sql(
        """
        SELECT DATE_FORMAT(pi.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(pi.base_net_total, 0)) AS net,
               COUNT(DISTINCT pi.name) AS count
        FROM `tabPurchase Invoice` pi
        WHERE pi.docstatus = 1 AND pi.company = %s AND pi.posting_date BETWEEN %s AND %s
        GROUP BY ym
        """,
        (company, start, end),
        as_dict=True,
    )

    cash_rows = frappe.db.sql(
        """
        SELECT DATE_FORMAT(pe.posting_date, '%%Y-%%m') AS ym,
               SUM(IF(pe.payment_type = 'Receive', IFNULL(pe.base_paid_amount, 0), 0)) AS received,
               SUM(IF(pe.payment_type = 'Pay', IFNULL(pe.base_paid_amount, 0), 0)) AS paid
        FROM `tabPayment Entry` pe
        WHERE pe.docstatus = 1 AND pe.company = %s AND pe.posting_date BETWEEN %s AND %s
        GROUP BY ym
        """,
        (company, start, end),
        as_dict=True,
    )

    svd_rows = frappe.db.sql(
        """
        SELECT DATE_FORMAT(sle.posting_date, '%%Y-%%m') AS ym,
               SUM(IFNULL(sle.stock_value_difference, 0)) AS svd
        FROM `tabStock Ledger Entry` sle
        WHERE sle.company = %s AND sle.posting_date BETWEEN %s AND %s
        GROUP BY ym
        """,
        (company, start, end),
        as_dict=True,
    )

    current_value = _current_inventory_value()

    s_map = {r["ym"]: r for r in sales_rows}
    p_map = {r["ym"]: r for r in purchase_rows}
    c_map = {r["ym"]: r for r in cash_rows}
    v_map = {r["ym"]: flt(r["svd"], 2) for r in svd_rows}

    inv_vals = {}
    running = current_value
    desc = list(reversed(keys))
    for i, k in enumerate(desc):
        if i == 0:
            inv_vals[k] = running
        else:
            running = flt(running - v_map.get(desc[i - 1], 0), 2)
            inv_vals[k] = running

    out = []
    for m in axis:
        k = m["key"]
        s = s_map.get(k) or {}
        p = p_map.get(k) or {}
        c = c_map.get(k) or {}
        received = flt(c.get("received"), 2)
        paid = flt(c.get("paid"), 2)
        out.append({
            "key": k,
            "label": m["label"],
            "sales": flt(s.get("net") or s.get("grand") or 0, 2),
            "grand": flt(s.get("grand") or 0, 2),
            "profit": flt(s.get("profit") or 0, 2),
            "invoices": int(s.get("count") or 0),
            "purchases": flt(p.get("net") or 0, 2),
            "purchase_orders": int(p.get("count") or 0),
            "cash_in": received,
            "cash_out": paid,
            "cash_flow": flt(received - paid, 2),
            "inventory_value": inv_vals.get(k, current_value),
        })
    return {"axis": keys, "months": out, "current_value": current_value}


@frappe.whitelist()
def series12(company=None):
    _check_permission()
    company = _resolve_company(company)
    return _safe(lambda: _series12(company), {"axis": [], "months": []}, "series12")


def _donuts(company):
    today = getdate(nowdate())
    year_start = str(add_days(today, -364))

    cat_sales = frappe.db.sql(
        """
        SELECT IFNULL(sii.item_group, 'Uncategorized') AS category,
               SUM(IFNULL(sii.amount, 0)) AS amount
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date >= %s
        GROUP BY sii.item_group
        ORDER BY amount DESC
        LIMIT 8
        """,
        (company, year_start),
        as_dict=True,
    )

    cat_inventory = frappe.db.sql(
        """
        SELECT IFNULL(it.item_group, 'Uncategorized') AS category,
               SUM(t.sv) AS value
        FROM (
            SELECT sle.item_code, sle.warehouse, IFNULL(sle.stock_value, 0) AS sv
            FROM `tabStock Ledger Entry` sle
            WHERE sle.name IN (
                SELECT MAX(name) FROM `tabStock Ledger Entry`
                GROUP BY item_code, warehouse
            )
        ) t
        INNER JOIN `tabItem` it ON it.name = t.item_code
        WHERE IFNULL(it.disabled, 0) = 0
        GROUP BY it.item_group
        ORDER BY value DESC
        LIMIT 8
        """,
        as_dict=True,
    )

    suppliers = frappe.db.sql(
        """
        SELECT pi.supplier, IFNULL(s.supplier_name, pi.supplier) AS supplier_name,
               SUM(IFNULL(pi.base_net_total, 0)) AS amount
        FROM `tabPurchase Invoice` pi
        LEFT JOIN `tabSupplier` s ON s.name = pi.supplier
        WHERE pi.docstatus = 1 AND pi.company = %s AND pi.posting_date >= %s
        GROUP BY pi.supplier
        ORDER BY amount DESC
        LIMIT 8
        """,
        (company, year_start),
        as_dict=True,
    )

    customers = _top_customers(company, year_start, str(today), limit=8)

    def clean(rows, label_key, value_key, convert=False):
        out = []
        for r in rows:
            v = flt(r[value_key], 2)
            if v <= 0:
                continue
            out.append({"label": r[label_key], "value": v})
        if not out:
            return [{"label": _("No data"), "value": 1}]
        return out

    return {
        "sales_by_category": clean(cat_sales, "category", "amount"),
        "inventory_by_category": clean(cat_inventory, "category", "value"),
        "customers": clean(customers, "customer_name", "amount"),
        "suppliers": clean(suppliers, "supplier_name", "amount"),
    }


@frappe.whitelist()
def donuts(company=None):
    _check_permission()
    company = _resolve_company(company)
    return _safe(lambda: _donuts(company), {}, "donuts")


def _quick_ops(company):
    last_sales = frappe.db.sql(
        """
        SELECT name, customer, grand_total, status, posting_date
        FROM `tabSales Invoice`
        WHERE docstatus = 1 AND company = %s
        ORDER BY posting_date DESC, creation DESC
        LIMIT 8
        """,
        (company,),
        as_dict=True,
    )
    last_purchase_orders = frappe.db.sql(
        """
        SELECT name, supplier, grand_total, status, transaction_date
        FROM `tabPurchase Order`
        WHERE docstatus < 2 AND company = %s
        ORDER BY transaction_date DESC, creation DESC
        LIMIT 6
        """,
        (company,),
        as_dict=True,
    )
    last_payments = frappe.db.sql(
        """
        SELECT name, party_type, party, payment_type, base_paid_amount, posting_date, reference_no
        FROM `tabPayment Entry`
        WHERE docstatus = 1 AND company = %s
        ORDER BY posting_date DESC, creation DESC
        LIMIT 6
        """,
        (company,),
        as_dict=True,
    )
    return {
        "last_sales": [
            {"name": r["name"], "customer": r["customer"], "amount": flt(r["grand_total"], 2),
             "status": r["status"], "date": str(r["posting_date"] or "")}
            for r in last_sales
        ],
        "last_purchase_orders": [
            {"name": r["name"], "supplier": r["supplier"], "amount": flt(r["grand_total"], 2),
             "status": r["status"], "date": str(r["transaction_date"] or "")}
            for r in last_purchase_orders
        ],
        "last_payments": [
            {"name": r["name"], "party_type": r["party_type"], "party": r["party"],
             "type": r["payment_type"], "amount": flt(r["base_paid_amount"], 2),
             "date": str(r["posting_date"] or ""), "reference_no": r.get("reference_no") or ""}
            for r in last_payments
        ],
    }


@frappe.whitelist()
def quick_ops(company=None):
    _check_permission()
    company = _resolve_company(company)
    return _safe(lambda: _quick_ops(company), {}, "quick_ops")


# ---------------------------------------------------------------------------
# v3.6 Native centers (pricing / exchange)
# ---------------------------------------------------------------------------
@frappe.whitelist()
def pricing_center(company=None, price_list=None):
    _check_permission()
    company = _resolve_company(company)
    lists = frappe.db.sql(
        """
        SELECT pl.name, IFNULL(pl.currency, '') AS currency
        FROM `tabPrice List` pl
        WHERE IFNULL(pl.selling, 0) = 1
        ORDER BY pl.name
        """,
        as_dict=True,
    )
    if not lists:
        return {"price_lists": [], "price_list": None, "items": []}
    active = price_list if price_list in {l["name"] for l in lists} else lists[0]["name"]
    items = frappe.db.sql(
        """
        SELECT ip.item_code, IFNULL(it.item_name, ip.item_code) AS item_name,
               ip.price_list_rate, IFNULL(ip.currency, '') AS currency,
               IFNULL(it.valuation_rate, 0) AS valuation_rate
        FROM `tabItem Price` ip
        INNER JOIN `tabItem` it ON it.name = ip.item_code
        WHERE ip.price_list = %s AND IFNULL(it.disabled, 0) = 0
        ORDER BY ip.item_code
        LIMIT 250
        """,
        (active,),
        as_dict=True,
    )
    return {
        "price_lists": [{"name": l["name"], "currency": l["currency"]} for l in lists],
        "price_list": active,
        "items": [
            {"item_code": r["item_code"], "item_name": r["item_name"],
             "price": flt(r["price_list_rate"], 2), "currency": r["currency"],
             "cost": flt(r["valuation_rate"], 2)}
            for r in items
        ],
    }


@frappe.whitelist()
def exchange_center(company=None):
    _check_permission()
    company = _resolve_company(company)
    base = _company_currency(company)
    rows = frappe.db.sql(
        """
        SELECT ce.from_currency, ce.to_currency, ce.exchange_rate, ce.date
        FROM `tabCurrency Exchange` ce
        WHERE (ce.from_currency, ce.to_currency, ce.date) IN (
            SELECT from_currency, to_currency, MAX(date)
            FROM `tabCurrency Exchange`
            GROUP BY from_currency, to_currency
        )
        ORDER BY ce.date DESC, ce.creation DESC
        """,
        as_dict=True,
    )
    return {
        "base_currency": base,
        "rates": [
            {"from_currency": r["from_currency"], "to_currency": r["to_currency"],
             "rate": flt(r["exchange_rate"], 4), "date": str(r["date"] or "")}
            for r in rows
        ],
    }


# ---------------------------------------------------------------------------
# v3.6 Shipment Cost Intelligence
# ---------------------------------------------------------------------------
SHIPMENT_ALLOC_METHODS = ("Item Value", "Quantity", "Weight", "Volume", "Cartons", "Manual")
SHIPMENT_EXPENSE_TYPES = ("Product Cost", "Freight", "Insurance", "Customs", "Clearance",
                          "Port Fees", "Inland Transport", "Banking", "Other")


def _landed_cost(expenses, items, alloc_method):
    """Pure allocation engine. expenses: list of {expense_type, amount, item (optional)}.
    items: list of {key, qty, weight, volume, cartons, product_cost}. Returns rich dict."""
    if not items:
        return {"ok": False, "error": "no items", "items": [], "expenses": [], "totals": {}}

    def num(v):
        return flt(v, 4)

    base = alloc_method or "Item Value"
    total_base = {}
    for it in items:
        if base == "Item Value":
            b = num(it.get("product_cost") or 0)
        elif base == "Quantity":
            b = num(it.get("qty") or 0)
        elif base == "Weight":
            b = num(it.get("weight") or 0)
        elif base == "Volume":
            b = num(it.get("volume") or 0)
        elif base == "Cartons":
            b = num(it.get("cartons") or 0)
        elif base == "Manual":
            b = num(it.get("manual_share") or 0)
        else:
            b = num(it.get("product_cost") or 0)
        total_base[it["key"]] = b

    sum_base = sum(total_base.values())
    if sum_base <= 0:
        share = {k: 1.0 / max(1, len(items)) for k in total_base}
    else:
        share = {k: v / sum_base for k, v in total_base.items()}

    cost_rows = [e for e in expenses if e.get("expense_type") == "Product Cost"]
    other_rows = [e for e in expenses if e.get("expense_type") != "Product Cost"]

    item_cost = {}
    for it in items:
        item_cost[it["key"]] = num(it.get("product_cost") or 0)
    for e in cost_rows:
        target = e.get("item") or e.get("item_key")
        if target and target in item_cost:
            item_cost[target] = num(item_cost[target] + e.get("amount") or 0)

    allocated_expenses = []
    for e in other_rows:
        amount = num(e.get("amount") or 0)
        if amount == 0:
            continue
        e_key = "{0}:{1}".format(e.get("expense_type"), e.get("index", 0))
        parts = {}
        for it in items:
            k = it["key"]
            a = flt(amount * share[k], 4)
            parts[k] = a
            item_cost[k] = num(item_cost[k] + a)
        allocated_expenses.append({
            "type": e.get("expense_type"),
            "amount": amount,
            "parts": parts,
            "key": e_key,
        })

    out_items = []
    for it in items:
        k = it["key"]
        qty = num(it.get("qty") or 0) or 1
        landed = num(item_cost[k])
        out_items.append({
            "key": k,
            "item_code": it.get("item_code") or it.get("name") or k,
            "item_name": it.get("item_name") or it.get("item_code") or k,
            "qty": num(it.get("qty") or 0),
            "weight": num(it.get("weight") or 0),
            "volume": num(it.get("volume") or 0),
            "cartons": num(it.get("cartons") or 0),
            "product_cost": num(it.get("product_cost") or 0),
            "unit_cost": num((it.get("product_cost") or 0) / qty),
            "landed_cost": landed,
            "unit_landed_cost": num(landed / qty),
            "extra_cost": num(landed - (it.get("product_cost") or 0)),
        })

    totals = {
        "product_cost_total": num(sum(item_cost[k] - sum(
            p.get("parts", {}).get(k, 0) for p in allocated_expenses) for k in item_cost)),
        "expense_total": num(sum(e["amount"] for e in allocated_expenses)),
        "landed_cost_total": num(sum(item_cost.values())),
    }
    return {
        "ok": True,
        "alloc_method": base,
        "items": out_items,
        "expenses": allocated_expenses,
        "totals": totals,
    }


def _normalize_shipment(payload):
    items = []
    for i, raw in enumerate(payload.get("items") or []):
        items.append({
            "key": raw.get("key") or str(i + 1),
            "item_code": raw.get("item_code") or "",
            "item_name": raw.get("item_name") or "",
            "qty": flt(raw.get("qty") or 0, 4),
            "weight": flt(raw.get("weight") or 0, 4),
            "volume": flt(raw.get("volume") or 0, 4),
            "cartons": flt(raw.get("cartons") or 0, 4),
            "product_cost": flt(raw.get("product_cost") or 0, 4),
        })
    expenses = []
    for i, raw in enumerate(payload.get("expenses") or []):
        expenses.append({
            "index": i,
            "expense_type": raw.get("expense_type") or "Other",
            "amount": flt(raw.get("amount") or 0, 4),
            "item": raw.get("item_key") or raw.get("item") or None,
            "notes": raw.get("notes") or "",
        })
    return items, expenses


def _shipment_list(company):
    if not frappe.db.exists("DocType", "Nexora Shipment"):
        return []
    rows = frappe.db.sql(
        """
        SELECT name, shipment_name, supplier, origin, destination, shipping_company,
               currency, status, alloc_method, shipment_date, company,
               IFNULL(expense_total, 0) AS expense_total,
               IFNULL(landed_cost_total, 0) AS landed_cost_total,
               IFNULL(product_cost_total, 0) AS product_cost_total,
               creation, modified
        FROM `tabNexora Shipment`
        WHERE company = %s
        ORDER BY creation DESC
        """,
        (company,),
        as_dict=True,
    )
    return [
        {
            "name": r["name"],
            "shipment_name": r.get("shipment_name") or r["name"],
            "supplier": r.get("supplier") or "",
            "origin": r.get("origin") or "",
            "destination": r.get("destination") or "",
            "shipping_company": r.get("shipping_company") or "",
            "currency": r.get("currency") or "",
            "status": r.get("status") or "Draft",
            "alloc_method": r.get("alloc_method") or "Item Value",
            "shipment_date": str(r.get("shipment_date") or ""),
            "expense_total": flt(r.get("expense_total"), 2),
            "landed_cost_total": flt(r.get("landed_cost_total"), 2),
            "product_cost_total": flt(r.get("product_cost_total"), 2),
            "creation": str(r.get("creation") or ""),
        }
        for r in rows
    ]


def _shipment_get(name):
    if not frappe.db.exists("Nexora Shipment", name):
        frappe.throw(_("Shipment {0} not found").format(name))
    doc = frappe.get_doc("Nexora Shipment", name)
    items = [{
        "key": d.name or "",
        "item_code": d.item_code or "",
        "item_name": d.item_name or "",
        "qty": flt(d.qty, 4),
        "weight": flt(d.weight, 4),
        "volume": flt(d.volume, 4),
        "cartons": flt(d.cartons, 4),
        "product_cost": flt(d.product_cost, 4),
        "unit_cost": flt(d.unit_cost, 4),
        "landed_cost": flt(d.landed_cost, 4),
        "unit_landed_cost": flt(d.unit_landed_cost, 4),
    } for d in doc.get("items") or []]
    expenses = [{
        "index": i,
        "expense_type": d.expense_type or "Other",
        "amount": flt(d.amount, 4),
        "item_key": d.item_key or "",
        "notes": d.notes or "",
    } for i, d in enumerate(doc.get("expenses") or [])]
    return {
        "name": doc.name,
        "shipment_name": doc.shipment_name,
        "company": doc.company,
        "supplier": doc.supplier or "",
        "origin": doc.origin or "",
        "destination": doc.destination or "",
        "shipping_company": doc.shipping_company or "",
        "currency": doc.currency or "",
        "exchange_rate": flt(doc.exchange_rate or 1, 4),
        "status": doc.status or "Draft",
        "locked": int(doc.locked or 0),
        "alloc_method": doc.alloc_method or "Item Value",
        "shipment_date": str(doc.shipment_date or ""),
        "notes": doc.notes or "",
        "items": items,
        "expenses": expenses,
        "totals": {
            "product_cost_total": flt(doc.product_cost_total, 2),
            "expense_total": flt(doc.expense_total, 2),
            "landed_cost_total": flt(doc.landed_cost_total, 2),
        },
        "allocation_history": doc.allocation_history or "",
    }


def _shipment_save(payload):
    if not frappe.db.exists("DocType", "Nexora Shipment"):
        frappe.throw(_("Shipment module not migrated yet. Run bench migrate first."))
    items, expenses = _normalize_shipment(payload)
    calc = _landed_cost(expenses, items, payload.get("alloc_method"))
    company = payload.get("company") or _resolve_company()
    shipment_date = payload.get("shipment_date") or nowdate()

    if payload.get("name"):
        doc = frappe.get_doc("Nexora Shipment", payload["name"])
        if int(doc.locked or 0):
            frappe.throw(_("Shipment is closed and locked."))
    else:
        doc = frappe.new_doc("Nexora Shipment")
    doc.company = company
    doc.shipment_name = payload.get("shipment_name") or doc.shipment_name or "SHIP-{0}".format(
        frappe.utils.now_datetime().strftime("%Y%m%d%H%M%S"))
    doc.supplier = payload.get("supplier") or ""
    doc.origin = payload.get("origin") or ""
    doc.destination = payload.get("destination") or ""
    doc.shipping_company = payload.get("shipping_company") or ""
    doc.currency = payload.get("currency") or ""
    doc.exchange_rate = flt(payload.get("exchange_rate") or 1, 4)
    doc.alloc_method = payload.get("alloc_method") or "Item Value"
    doc.shipment_date = shipment_date
    doc.notes = payload.get("notes") or ""

    doc.set("items", [])
    doc.set("expenses", [])
    if calc.get("ok"):
        for it in calc["items"]:
            doc.append("items", {
                "item_code": it["item_code"],
                "item_name": it["item_name"],
                "qty": it["qty"],
                "weight": it["weight"],
                "volume": it["volume"],
                "cartons": it["cartons"],
                "product_cost": it["product_cost"],
                "unit_cost": it["unit_cost"],
                "landed_cost": it["landed_cost"],
                "unit_landed_cost": it["unit_landed_cost"],
            })
        for e in expenses:
            doc.append("expenses", {
                "expense_type": e["expense_type"],
                "amount": e["amount"],
                "item_key": e["item"] or "",
                "notes": e["notes"],
            })
        doc.product_cost_total = calc["totals"]["product_cost_total"]
        doc.expense_total = calc["totals"]["expense_total"]
        doc.landed_cost_total = calc["totals"]["landed_cost_total"]

    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return {"name": doc.name, "ok": True, "calc": calc}


def _shipment_close(name):
    doc = frappe.get_doc("Nexora Shipment", name)
    if int(doc.locked or 0):
        return {"ok": True, "name": doc.name, "locked": True}
    if not (doc.get("items") or []):
        frappe.throw(_("Cannot close a shipment without line items."))
    calc = _landed_cost(
        [{"expense_type": e.expense_type, "amount": e.amount, "item": e.item_key or None}
         for e in doc.get("expenses") or []],
        [{"key": d.name, "item_code": d.item_code, "item_name": d.item_name, "qty": d.qty,
          "weight": d.weight, "volume": d.volume, "cartons": d.cartons, "product_cost": d.product_cost}
         for d in doc.get("items") or []],
        doc.alloc_method,
    )
    doc.status = "Closed"
    doc.locked = 1
    doc.allocation_history = frappe.as_json(calc) if calc.get("ok") else ""
    doc.save(ignore_permissions=True)
    frappe.db.commit()

    updated = 0
    if calc.get("ok") and frappe.db.field_exists("Item", "valuation_rate"):
        for it in calc["items"]:
            if it["item_code"] and it["unit_landed_cost"] > 0:
                frappe.db.set_value("Item", it["item_code"], "valuation_rate", flt(it["unit_landed_cost"], 4))
                updated += 1
        frappe.db.commit()
    return {"ok": True, "name": doc.name, "locked": True, "updated_items": updated}


@frappe.whitelist()
def shipment_api(method="get", name=None, company=None, payload=None):
    _check_permission()
    if method == "get_all":
        return _shipment_list(_resolve_company(company))
    if method == "get":
        return _shipment_get(name)
    if method == "save":
        return _shipment_save(payload or {})
    if method == "close":
        return _shipment_close(name)
    frappe.throw(_("Unknown shipment method: {0}").format(method))


# ---------------------------------------------------------------------------
# Main entry
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# KPI sparklines (Nexora Intelligence Center - Phase 1)
# ---------------------------------------------------------------------------
def _kpi_series(company, today):
    days = 14
    gl = _gl_series_map(company, today, [
        ("cash", ("Cash", "Bank")),
        ("ar", ("Receivable",)),
        ("ap", ("Payable",)),
    ], days)
    return {
        "cash": gl["cash"],
        "ar": gl["ar"],
        "ap": gl["ap"],
        "value": _inventory_value_series(company, today, days),
        "po": _doc_series(company, today, "Purchase Order", days),
        "so": _doc_series(company, today, "Sales Order", days),
        "stockout": _stockout_series(company, today, days),
    }


def _build_kpis(company, sales, cash, inventory, purchasing, sos, series):
    trend = sales.get("trend") or []
    yesterday_s = (sales.get("yesterday") or {})
    vs7 = (sales.get("yesterday_vs_7d") or {})
    avg7 = (sales.get("avg_7d") or {})
    pos = (purchasing or {}).get("pending_pos") or {}
    low = (inventory or {}).get("low_stock") or {}

    sales_spark = [flt(r.get("amount"), 2) for r in trend[-14:]]
    profit_spark = [flt(r.get("profit"), 2) for r in trend[-14:]]
    cash_spark = [flt(r.get("amount"), 2) for r in (series.get("cash") or [])]
    ar_spark = [flt(r.get("amount"), 2) for r in (series.get("ar") or [])]
    val_spark = [flt(r.get("amount"), 2) for r in (series.get("value") or [])]
    po_spark = [flt(r.get("count"), 2) for r in (series.get("po") or [])]
    so_spark = [flt(r.get("count"), 2) for r in (series.get("so") or [])]
    stock_spark = [flt(r.get("count"), 2) for r in (series.get("stockout") or [])]

    def kpi(key, icon, title, value, spark, currency=False, count=False, pct=None, prev=None, click=None):
        if pct is None and len(spark) >= 2:
            prev = spark[-2]
            cur = spark[-1]
            pct = _pct(cur, prev)
        return {
            "key": key,
            "icon": icon,
            "title": title,
            "value": flt(value, 2) if currency else (int(value) if count else flt(value, 2)),
            "currency": bool(currency),
            "count": bool(count),
            "pct": flt(pct, 1) if pct is not None else None,
            "prev": flt(prev, 2) if prev is not None else None,
            "spark": spark,
            "click": click or key,
        }

    return [
        kpi("yesterday-sales", "trending-up", _("Yesterday Sales"),
            flt(yesterday_s.get("amount")), sales_spark, currency=True,
            pct=vs7.get("amount_pct"), prev=avg7.get("amount"), click="sales-yesterday"),
        kpi("yesterday-profit", "activity", _("Yesterday Profit"),
            flt(yesterday_s.get("profit")), profit_spark, currency=True,
            pct=vs7.get("profit_pct"), prev=avg7.get("profit"), click="profit-yesterday"),
        kpi("receivables", "incoming", _("Open Receivables"),
            flt((cash or {}).get("receivables")), ar_spark, currency=True, click="receivables"),
        kpi("inventory-value", "package", _("Inventory Value"),
            flt((inventory or {}).get("total_value")), val_spark, currency=True,
            pct=(inventory or {}).get("change_pct"), prev=(inventory or {}).get("prev_value"), click="inventory-value"),
        kpi("cash-balance", "wallet", _("Cash Balance"),
            flt((cash or {}).get("total")), cash_spark, currency=True,
            pct=(cash or {}).get("change_pct_7d"), prev=(cash or {}).get("prev_total"), click="cash"),
        kpi("po-pending", "shopping-cart", _("Purchase Orders Pending"),
            int(pos.get("count") or 0), po_spark, count=True, click="pending-pos"),
        kpi("so-pending", "file-text", _("Sales Orders Pending"),
            int((sos or {}).get("count") or 0), so_spark, count=True, click="sales-orders"),
        kpi("low-stock", "alert-triangle", _("Low Stock Items"),
            int(low.get("count") or 0), stock_spark, count=True, click="low-stock"),
    ]


# ---------------------------------------------------------------------------
# Business health (Nexora Intelligence Center)
# ---------------------------------------------------------------------------
def _cogs_30d(company, today):
    try:
        row = frappe.db.sql(
            """
            SELECT IFNULL(SUM(IFNULL(sii.qty, 0) * IFNULL(it.valuation_rate, 0)), 0) AS cogs
            FROM `tabSales Invoice Item` sii
            INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
            LEFT JOIN `tabItem` it ON it.name = sii.item_code
            WHERE si.docstatus = 1 AND si.company = %s AND si.posting_date BETWEEN %s AND %s
              AND IFNULL(it.is_stock_item, 1) = 1
            """,
            (company, add_days(today, -29), today),
            as_dict=True,
        )
        return flt(row[0]["cogs"], 2)
    except Exception:
        return 0


def _health_score(recv_overdue, pay_overdue, recv_total, pay_total, cash_now, turnover_30d):
    score = 100
    if recv_total and flt(recv_overdue) / recv_total > 0.3:
        score -= 15
    if pay_total and flt(pay_overdue) / pay_total > 0.3:
        score -= 10
    if flt(cash_now) < 0:
        score -= 20
    if turnover_30d < 0.3:
        score -= 10
    return max(0, min(100, int(score)))


def _business_health(company, today, sales, cash, inventory, series):
    recv_total = flt((cash or {}).get("receivables") or 0)
    recv_detail = (cash or {}).get("receivables_detail") or {}
    recv_overdue = flt(recv_detail.get("overdue") or 0)
    ar_series = series.get("ar") or []
    ar_start = ar_series[0].get("amount", 0) if ar_series else 0
    recv_trend = flt((recv_total - ar_start) / abs(ar_start) * 100, 1) if ar_start else 0

    pay_total = flt((cash or {}).get("payables") or 0)
    pay_detail = (cash or {}).get("payables_detail") or {}
    pay_overdue = flt(pay_detail.get("overdue") or 0)
    ap_series = series.get("ap") or []
    ap_start = ap_series[0].get("amount", 0) if ap_series else 0
    pay_trend = flt((pay_total - ap_start) / abs(ap_start) * 100, 1) if ap_start else 0

    cogs = _cogs_30d(company, today)
    avg_inv = flt((inventory or {}).get("total_value") or 0)
    turnover_30d = flt(cogs / avg_inv, 2) if avg_inv else 0

    cash_now = flt((cash or {}).get("total") or 0)
    cs = series.get("cash") or []
    cash_30d_ago = cs[0].get("amount", cash_now) if cs else cash_now
    cash_flow = flt(cash_now - cash_30d_ago, 2)
    cash_flow_avg = flt(cash_flow / 30, 2) if len(cs) > 1 else 0

    score = _health_score(recv_overdue, pay_overdue, recv_total, pay_total, cash_now, turnover_30d)

    return {
        "receivables": {"total": recv_total, "overdue": recv_overdue, "trend_pct": recv_trend},
        "payables": {"total": pay_total, "overdue": pay_overdue, "trend_pct": pay_trend},
        "inventory_turnover": {
            "cogs_30d": cogs, "avg_value": avg_inv,
            "turnover_30d": turnover_30d, "annualized": flt(turnover_30d * 12, 2),
        },
        "cash_flow": {"net_30d": cash_flow, "avg_daily": cash_flow_avg, "current": cash_now},
        "net_position": flt((cash or {}).get("net_position") or 0),
        "score": score,
        "as_at": today,
    }


# ---------------------------------------------------------------------------
# Recent activity / Business alerts (Nexora Intelligence Center)
# ---------------------------------------------------------------------------
def _recent_activity(company):
    out = []

    def push(rtype, icon, color, name, title, amount, ts):
        out.append({
            "type": rtype, "icon": icon, "color": color, "name": name,
            "title": title, "amount": flt(amount, 2), "ts": str(ts or ""),
        })

    sis = frappe.db.sql(
        """
        SELECT si.name, IFNULL(c.customer_name, si.customer_name) AS party,
               si.grand_total, si.creation
        FROM `tabSales Invoice` si
        LEFT JOIN `tabCustomer` c ON c.name = si.customer
        WHERE si.docstatus = 1 AND si.company = %s
        ORDER BY si.creation DESC LIMIT 5
        """,
        (company,),
        as_dict=True,
    )
    for r in sis:
        push("sales", "file", "blue", r["name"], _("{0} · {1}").format(r["name"], r.get("party") or ""), r["grand_total"], r["creation"])

    pis = frappe.db.sql(
        """
        SELECT pi.name, IFNULL(s.supplier_name, pi.supplier_name) AS party,
               pi.grand_total, pi.creation
        FROM `tabPurchase Invoice` pi
        LEFT JOIN `tabSupplier` s ON s.name = pi.supplier
        WHERE pi.docstatus = 1 AND pi.company = %s
        ORDER BY pi.creation DESC LIMIT 4
        """,
        (company,),
        as_dict=True,
    )
    for r in pis:
        push("purchase", "cart", "orange", r["name"], _("{0} · {1}").format(r["name"], r.get("party") or ""), r["grand_total"], r["creation"])

    if frappe.db.table_exists("Purchase Order"):
        pos = frappe.db.sql(
            """
            SELECT name, supplier, grand_total, creation FROM `tabPurchase Order`
            WHERE docstatus = 0 AND company = %s ORDER BY creation DESC LIMIT 4
            """,
            (company,),
            as_dict=True,
        )
        for r in pos:
            push("po", "cart", "purple", r["name"], _("{0} (draft)").format(r["name"]), r["grand_total"], r["creation"])

    if frappe.db.table_exists("Stock Entry"):
        ses = frappe.db.sql(
            """
            SELECT name, purpose, creation FROM `tabStock Entry`
            WHERE docstatus = 1 AND company = %s ORDER BY creation DESC LIMIT 4
            """,
            (company,),
            as_dict=True,
        )
        for r in ses:
            push("stock", "box", "teal", r["name"], _("{0} · {1}").format(r["name"], r.get("purpose") or ""), 0, r["creation"])

    if frappe.db.table_exists("Payment Entry"):
        pes = frappe.db.sql(
            """
            SELECT name, party, payment_type, paid_amount, creation FROM `tabPayment Entry`
            WHERE docstatus = 1 AND company = %s ORDER BY creation DESC LIMIT 4
            """,
            (company,),
            as_dict=True,
        )
        for r in pes:
            push("payment", "wallet", "green", r["name"],
                 _("{0} · {1}").format(r["name"], r.get("party") or ""),
                 r["paid_amount"], r["creation"])

    if frappe.db.table_exists("Delivery Note"):
        dns = frappe.db.sql(
            """
            SELECT dn.name, IFNULL(c.customer_name, dn.customer_name) AS party,
                   dn.grand_total, dn.creation
            FROM `tabDelivery Note` dn
            LEFT JOIN `tabCustomer` c ON c.name = dn.customer
            WHERE dn.docstatus = 1 AND dn.company = %s
            ORDER BY dn.creation DESC LIMIT 4
            """,
            (company,),
            as_dict=True,
        )
        for r in dns:
            push("delivery", "truck", "indigo", r["name"],
                 _("{0} · {1}").format(r["name"], r.get("party") or ""),
                 r["grand_total"], r["creation"])

    if frappe.db.table_exists("Stock Entry"):
        mrs = frappe.db.sql(
            """
            SELECT name, purpose, creation FROM `tabStock Entry`
            WHERE docstatus = 1 AND company = %s AND purpose = 'Material Receipt'
            ORDER BY creation DESC LIMIT 4
            """,
            (company,),
            as_dict=True,
        )
        for r in mrs:
            push("material-receipt", "package", "teal", r["name"],
                 _("{0} · Material Receipt").format(r["name"]), 0, r["creation"])

    out.sort(key=lambda x: x["ts"], reverse=True)
    return out[:14]


def _build_alerts(sales, cash, purchasing, inventory, moving, pricing):
    alerts = []

    low = inventory.get("low_stock") or {}
    if low.get("count"):
        alerts.append({
            "kind": "low-stock", "icon": "alert", "color": "orange",
            "label": _("Low Stock"), "count": int(low["count"]),
            "amount": 0, "sub": _("items below reorder level"),
            "items": [
                {"name": i.get("item_name") or i.get("item_code"), "value": i.get("qty"), "note": _("on hand")}
                for i in (low.get("items") or [])[:3]
            ],
            "click": "low-stock",
        })

    out = inventory.get("out_of_stock") or {}
    if out.get("count"):
        alerts.append({
            "kind": "out-of-stock", "icon": "out", "color": "red",
            "label": _("Out of Stock"), "count": int(out["count"]),
            "amount": 0, "sub": _("unavailable items"),
            "items": [
                {"name": i.get("item_name") or i.get("item_code"), "value": i.get("qty"), "note": _("on hand")}
                for i in (out.get("items") or [])[:3]
            ],
            "click": "out-of-stock",
        })

    dead_count = (moving or {}).get("dead_stock_count") or 0
    if dead_count:
        dead_items = (moving or {}).get("dead_stock") or []
        alerts.append({
            "kind": "zero-movement", "icon": "clock", "color": "gray",
            "label": _("Zero Movement"), "count": int(dead_count),
            "amount": flt(sum(flt(i.get("stock_value")) for i in dead_items), 2),
            "sub": _("no sales in the last 30 days"),
            "items": [
                {"name": i.get("item_name") or i.get("item_code"), "value": flt(i.get("stock_value"), 2), "note": _("idle value")}
                for i in dead_items[:3]
            ],
            "click": "slow-moving",
        })

    vs7 = (sales or {}).get("yesterday_vs_7d") or {}
    amt_pct = vs7.get("amount_pct")
    if amt_pct is not None and amt_pct <= -15:
        alerts.append({
            "kind": "sales-drop", "icon": "trending-down", "color": "red",
            "label": _("Sales Drop"), "count": 1,
            "amount": flt((sales or {}).get("yesterday", {}).get("amount") or 0),
            "sub": _("yesterday {0}% below the 7-day average").format(flt(amt_pct, 1)),
            "items": [], "click": "sales-yesterday",
        })

    cch = (cash or {}).get("change_pct_7d")
    if cch is not None and cch < 0:
        alerts.append({
            "kind": "cash-trend", "icon": "wallet", "color": "orange",
            "label": _("Cash Declining"), "count": 1,
            "amount": flt((cash or {}).get("total")),
            "sub": _("down {0}% over the last 14 days").format(abs(flt(cch, 1))),
            "items": [], "click": "cash",
        })

    pr = pricing or {}
    if pr.get("count"):
        alerts.append({
            "kind": "pricing", "icon": "tag", "color": "red",
            "label": _("Margin Review"), "count": int(pr["count"]),
            "amount": flt(pr.get("impact"), 2), "sub": _("priced at or below cost"),
            "items": [
                {"name": i.get("item_name") or i.get("item_code"), "value": i.get("price_list_rate"), "note": _("rate")}
                for i in (pr.get("items") or [])[:3]
            ],
            "click": "pricing",
        })

    recv = flt((cash or {}).get("receivables"))
    if recv:
        alerts.append({
            "kind": "receivables", "icon": "incoming", "color": "orange",
            "label": _("Receivables"), "count": 1,
            "amount": recv, "sub": _("customer outstanding"),
            "items": [], "click": "receivables",
        })

    recv_detail = (cash or {}).get("receivables_detail") or {}
    recv_overdue = flt(recv_detail.get("overdue") or 0)
    if recv_overdue and recv_detail.get("overdue_count"):
        alerts.append({
            "kind": "receivables-overdue", "icon": "incoming", "color": "red",
            "label": _("Overdue Receivables"), "count": int(recv_detail["overdue_count"]),
            "amount": recv_overdue, "sub": _("invoices past due date"),
            "items": [
                {"name": i.get("customer_name") or i.get("customer"), "value": flt(i.get("overdue"), 2), "note": _("overdue")}
                for i in (recv_detail.get("top") or [])[:3]
            ],
            "click": "receivables",
        })

    pay = flt((cash or {}).get("payables"))
    if pay:
        alerts.append({
            "kind": "payables", "icon": "outgoing", "color": "purple",
            "label": _("Payables"), "count": 1,
            "amount": pay, "sub": _("supplier outstanding"),
            "items": [], "click": "payables",
        })

    crit = (inventory or {}).get("critical_count") or 0
    if crit:
        out = inventory.get("out_of_stock") or {}
        alerts.append({
            "kind": "inventory-shortage", "icon": "package", "color": "red",
            "label": _("Inventory Shortage"), "count": int(crit),
            "amount": 0, "sub": _("critical / out-of-stock items"),
            "items": [
                {"name": i.get("item_name") or i.get("item_code"), "value": flt(i.get("qty"), 2), "note": _("on hand")}
                for i in (out.get("items") or [])[:3]
            ],
            "click": "low-stock",
        })

    delay = flt((purchasing or {}).get("pending_pos", {}).get("avg_delay_days") or 0)
    if delay > 0:
        alerts.append({
            "kind": "supplier-delay", "icon": "clock", "color": "orange",
            "label": _("Supplier Delays"), "count": 1,
            "amount": 0, "sub": _("open POs averaging {0} days past schedule").format(flt(delay, 1)),
            "items": [], "click": "pending-pos",
        })

    pos = (purchasing or {}).get("pending_pos") or {}
    if pos.get("count"):
        alerts.append({
            "kind": "pending-pos", "icon": "cart", "color": "blue",
            "label": _("Pending Purchase Orders"), "count": int(pos["count"]),
            "amount": flt(pos.get("amount"), 2), "sub": _("awaiting submission"),
            "items": [], "click": "pending-pos",
        })

    alerts.sort(key=lambda a: (0 if a["color"] in ("red", "orange") else 1, -a["count"]))
    return alerts


@frappe.whitelist()
def get_executive_dashboard(company=None):
    _check_permission()
    company = _resolve_company(company)

    key = "nexora:exec:{0}".format(company or "default")
    data = frappe.cache.get_value(key, generator=lambda: _build_payload(company))
    frappe.cache.set_value(key, data, expires_in_sec=DASH_CACHE_TTL)
    return data


def _build_payload(company):
    today = nowdate()
    yesterday = add_days(today, -1)

    series = _safe(lambda: _kpi_series(company, today), {}, "series")
    sales = _safe(lambda: _build_sales(company, today, yesterday), {}, "sales")
    cash = _safe(lambda: _cash_position(company, today, series), {}, "cash")
    purchasing = _safe(lambda: _purchase_performance(company, today), {}, "purchasing")
    inventory = _safe(lambda: _inventory_health(company, today, series=series.get("value")), {}, "inventory")
    moving = _safe(lambda: _inventory_intelligence(company, today), {}, "moving")
    rates = _safe(lambda: _exchange_rates(company), {}, "exchange_rates")
    pricing = _safe(lambda: _pricing_alerts(company), {"count": 0, "items": [], "impact": 0}, "pricing")
    notifications = _safe(lambda: _notifications(), {"unread": 0, "recent": []}, "notifications")
    activity = _safe(lambda: _recent_activity(company), [], "activity")
    sos = _safe(lambda: _sales_orders_pending(company, today), {"count": 0, "amount": 0, "avg_age_days": 0}, "sos")
    health = _safe(lambda: _business_health(company, today, sales, cash, inventory, series), {}, "business_health")
    alerts = _safe(lambda: _build_alerts(sales, cash, purchasing, inventory, moving, pricing), [], "alerts")
    kpis = _safe(lambda: _build_kpis(company, sales, cash, inventory, purchasing, sos, series), [], "kpis")

    company_currency = _company_currency(company)

    return {
        "company": company,
        "company_currency": company_currency,
        "as_at": today,
        "as_at_time": frappe.utils.now_datetime().strftime("%H:%M"),
        "sales": sales,
        "cash": cash,
        "purchasing": purchasing,
        "inventory": inventory,
        "moving": moving,
        "exchange_rates": rates,
        "pricing_alerts": pricing,
        "notifications": notifications,
        "activity": activity,
        "alerts": alerts,
        "sos": sos,
        "kpis": kpis,
        "business_health": health,
    }
