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


def get_inventory_summary():
    return {
        "warehouses": get_warehouse_count(),
        "items": get_item_count(),
    }
