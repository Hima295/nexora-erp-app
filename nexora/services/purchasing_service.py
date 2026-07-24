# -*- coding: utf-8 -*-
import frappe
from nexora.services.company_service import get_active_company


def get_purchase_order_count(status=None):
    filters = {"company": get_active_company()}
    if status:
        filters["status"] = status
    return frappe.db.count("Purchase Order", filters)


def get_purchase_receipt_count():
    return frappe.db.count("Purchase Receipt", {"company": get_active_company()})


def get_purchase_invoice_count():
    return frappe.db.count("Purchase Invoice", {"company": get_active_company()})


def get_purchasing_summary():
    return {
        "purchase_orders": get_purchase_order_count(),
        "purchase_receipts": get_purchase_receipt_count(),
        "purchase_invoices": get_purchase_invoice_count(),
    }
