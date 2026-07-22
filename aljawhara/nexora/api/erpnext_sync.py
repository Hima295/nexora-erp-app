# -*- coding: utf-8 -*-
import frappe

def inspect_erpnext_source_of_truth():
    """
    Non-invasive reader that queries standard ERPNext tables as Single Source of Truth.
    Guarantees zero duplicate databases or shadow tables.
    """
    if "erpnext" not in frappe.get_installed_apps():
        return {"status": "ERPNext v15+ not installed in current bench site"}

    stats = {
        "item_count": frappe.db.count("Item"),
        "customer_count": frappe.db.count("Customer"),
        "supplier_count": frappe.db.count("Supplier"),
        "sales_orders_count": frappe.db.count("Sales Order"),
        "purchase_orders_count": frappe.db.count("Purchase Order"),
        "stock_entries_count": frappe.db.count("Stock Entry")
    }
    return stats
