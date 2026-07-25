# -*- coding: utf-8 -*-
import frappe
from nexora.services.company_service import get_active_company


def get_warehouses(company=None):
    company = company or get_active_company()
    filters = {}
    if company:
        filters["company"] = company
    return frappe.get_all("Warehouse", filters=filters, fields=["name", "company", "is_group"])


def get_warehouse_count(company=None):
    return frappe.db.count("Warehouse", {"company": company or get_active_company()})


def get_item_count():
    return frappe.db.count("Item", {"disabled": 0})


def get_stock_qty(company=None):
    try:
        warehouses = [w.name for w in get_warehouses(company)]
        if not warehouses:
            return 0
        bins = frappe.get_all(
            "Bin",
            filters={"warehouse": ["in", warehouses], "actual_qty": [">", 0]},
            fields=["actual_qty"],
        )
        return sum(b.actual_qty for b in bins)
    except Exception:
        return 0


def get_inventory_value(company=None):
    try:
        warehouses = [w.name for w in get_warehouses(company)]
        if not warehouses:
            return 0.0
        bins = frappe.get_all(
            "Bin",
            filters={"warehouse": ["in", warehouses], "stock_value": [">", 0]},
            fields=["stock_value"],
        )
        return sum(b.stock_value for b in bins)
    except Exception:
        return 0.0


def get_inventory_summary():
    return {
        "warehouses": get_warehouse_count(),
        "items": get_item_count(),
        "stock_qty": get_stock_qty(),
        "inventory_value": get_inventory_value(),
    }


def get_inventory_table(limit=20, company=None):
    company = company or get_active_company()
    warehouses = [w.name for w in get_warehouses(company)]
    if not warehouses:
        return []

    bins = frappe.get_all(
        "Bin",
        filters={"warehouse": ["in", warehouses], "actual_qty": ["!=", 0]},
        fields=["item_code", "warehouse", "actual_qty", "valuation_rate", "stock_value", "reserved_qty"],
        limit=limit,
    )

    items = frappe.get_all(
        "Item",
        filters={"name": ["in", [b.item_code for b in bins]]},
        fields=["name", "item_name", "disabled"],
    )
    item_map = {i.name: i for i in items}

    reorder_items = frappe.get_all(
        "Item Reorder",
        filters={"parent": ["in", [b.item_code for b in bins]], "warehouse": ["in", warehouses]},
        fields=["parent", "warehouse", "warehouse_reorder_level"],
    )
    reorder_map = {}
    for r in reorder_items:
        key = (r.parent, r.warehouse)
        reorder_map[key] = r.warehouse_reorder_level

    selling_prices = frappe.get_all(
        "Item Price",
        filters={"item_code": ["in", [b.item_code for b in bins]], "price_list": "Standard Selling"},
        fields=["item_code", "price_list_rate"],
    )
    price_map = {p.item_code: p.price_list_rate for p in selling_prices}

    results = []
    for b in bins:
        item = item_map.get(b.item_code)
        if not item:
            continue
        valuation_rate = b.valuation_rate or 0
        available_qty = b.actual_qty or 0
        reserved_qty = getattr(b, "reserved_qty", None) or 0
        stock_value = (available_qty * valuation_rate) if available_qty and valuation_rate else 0
        selling_price = price_map.get(b.item_code)
        if not selling_price and valuation_rate > 0:
            selling_price = valuation_rate * 1.20
        gross_profit = (selling_price - valuation_rate) if selling_price and valuation_rate else 0
        gross_profit_pct = ((gross_profit / selling_price) * 100) if selling_price > 0 else 0
        reorder_level = reorder_map.get((b.item_code, b.warehouse), 0) or 0
        if available_qty <= 0:
            stock_status = "Out of Stock"
        elif reorder_level > 0 and available_qty <= reorder_level:
            stock_status = "Low Stock"
        else:
            stock_status = "Normal"
        results.append({
            "item_code": b.item_code,
            "item_name": item.item_name,
            "warehouse": b.warehouse,
            "available_qty": available_qty,
            "reserved_qty": reserved_qty,
            "stock_value": stock_value,
            "valuation_rate": valuation_rate,
            "selling_price": selling_price,
            "gross_profit": gross_profit,
            "gross_profit_pct": round(gross_profit_pct, 2),
            "stock_status": stock_status,
            "status": "Disabled" if item.disabled else "Active",
        })
    return results


def get_low_stock_items(limit=20, company=None):
    company = company or get_active_company()
    warehouses = [w.name for w in get_warehouses(company)]
    if not warehouses:
        return []

    try:
        bins = frappe.get_all(
            "Bin",
            filters={"warehouse": ["in", warehouses], "actual_qty": [">", 0]},
            fields=["item_code", "warehouse", "actual_qty"],
        )

        reorder_items = frappe.get_all(
            "Item Reorder",
            filters={"warehouse": ["in", warehouses]},
            fields=["parent", "warehouse", "warehouse_reorder_level"],
        )
        reorder_map = {}
        for r in reorder_items:
            key = (r.parent, r.warehouse)
            reorder_map[key] = r.warehouse_reorder_level

        low_stock = []
        for b in bins:
            key = (b.item_code, b.warehouse)
            reorder_level = reorder_map.get(key)
            if reorder_level is not None and b.actual_qty < reorder_level:
                item = frappe.get_all(
                    "Item",
                    filters={"name": b.item_code},
                    fields=["name", "item_name", "disabled"],
                    limit=1,
                )
                if item:
                    low_stock.append({
                        "item_code": b.item_code,
                        "item_name": item[0].item_name,
                        "warehouse": b.warehouse,
                        "available_qty": b.actual_qty,
                        "reorder_level": reorder_level,
                        "status": "Disabled" if item[0].disabled else "Active",
                    })
        return low_stock[:limit]
    except Exception:
        return []


def get_out_of_stock_items(limit=20, company=None):
    company = company or get_active_company()
    warehouses = [w.name for w in get_warehouses(company)]
    if not warehouses:
        return []

    bins = frappe.get_all(
        "Bin",
        filters={"warehouse": ["in", warehouses], "actual_qty": ["<=", 0]},
        fields=["item_code", "warehouse", "actual_qty"],
        limit=limit * 2,
    )

    seen = set()
    results = []
    for b in bins:
        if b.item_code in seen:
            continue
        seen.add(b.item_code)
        item = frappe.get_all(
            "Item",
            filters={"name": b.item_code},
            fields=["name", "item_name", "disabled"],
            limit=1,
        )
        if item:
            results.append({
                "item_code": b.item_code,
                "item_name": item[0].item_name,
                "warehouse": b.warehouse,
                "available_qty": b.actual_qty,
                "status": "Disabled" if item[0].disabled else "Active",
            })
        if len(results) >= limit:
            break
    return results
