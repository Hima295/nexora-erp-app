# -*- coding: utf-8 -*-
import frappe

def execute():
    """Initializes default Aljawhara Settings if not present"""
    if not frappe.db.exists("DocType", "Aljawhara Settings"):
        return

    settings = frappe.get_single("Aljawhara Settings")
    settings.enabled = 1
    settings.primary_language = "Arabic (RTL)"
    settings.observe_sales_orders = 1
    settings.observe_purchase_orders = 1
    settings.observe_stock_entries = 1
    settings.flags.ignore_mandatory = True
    settings.save()
    frappe.db.commit()
