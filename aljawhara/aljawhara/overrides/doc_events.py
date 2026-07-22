# -*- coding: utf-8 -*-
import frappe
from aljawhara.aljawhara_core.doctype.aljawhara_log.aljawhara_log import log_event

def on_sales_order_submit(doc, method=None):
    """Event handler triggered when an ERPNext Sales Order is submitted"""
    settings = frappe.get_single("Aljawhara Settings")
    if settings.enabled and settings.observe_sales_orders:
        log_event(
            subject=f"Sales Order Submitted: {doc.name}",
            message=f"Observed Sales Order {doc.name} for Customer '{doc.customer}' with Total {doc.grand_total} {doc.currency}",
            log_type="Audit",
            module="Sales Intelligence",
            reference_doctype="Sales Order",
            reference_name=doc.name
        )

def on_sales_order_cancel(doc, method=None):
    """Event handler triggered when an ERPNext Sales Order is cancelled"""
    settings = frappe.get_single("Aljawhara Settings")
    if settings.enabled and settings.observe_sales_orders:
        log_event(
            subject=f"Sales Order Cancelled: {doc.name}",
            message=f"Sales Order {doc.name} was cancelled.",
            log_type="Warning",
            module="Sales Intelligence",
            reference_doctype="Sales Order",
            reference_name=doc.name
        )

def on_purchase_order_submit(doc, method=None):
    """Event handler triggered when an ERPNext Purchase Order is submitted"""
    settings = frappe.get_single("Aljawhara Settings")
    if settings.enabled and settings.observe_purchase_orders:
        log_event(
            subject=f"Purchase Order Submitted: {doc.name}",
            message=f"Observed Purchase Order {doc.name} for Supplier '{doc.supplier}' with Total {doc.grand_total} {doc.currency}",
            log_type="Audit",
            module="Purchasing Intelligence",
            reference_doctype="Purchase Order",
            reference_name=doc.name
        )

def on_item_update(doc, method=None):
    """Event handler triggered when an ERPNext Item master is updated"""
    pass

def on_stock_entry_submit(doc, method=None):
    """Event handler triggered when an ERPNext Stock Entry is submitted"""
    settings = frappe.get_single("Aljawhara Settings")
    if settings.enabled and settings.observe_stock_entries:
        log_event(
            subject=f"Stock Entry Submitted: {doc.name}",
            message=f"Observed Stock Entry {doc.name} (Purpose: {doc.purpose})",
            log_type="Audit",
            module="Inventory Intelligence",
            reference_doctype="Stock Entry",
            reference_name=doc.name
        )
