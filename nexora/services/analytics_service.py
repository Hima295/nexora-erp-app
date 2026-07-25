# -*- coding: utf-8 -*-
import frappe
from nexora.services.company_service import get_company_context
from nexora.services.inventory_service import get_inventory_summary
from nexora.services.supplier_service import get_supplier_count
from nexora.services.purchasing_service import get_purchasing_summary
from nexora.services.pricing_service import get_pricing_summary


def get_system_connection_status():
    erpnext_installed = "erpnext" in frappe.get_installed_apps()
    company_context = get_company_context()
    inventory = get_inventory_summary()
    purchasing = get_purchasing_summary()
    pricing = get_pricing_summary()

    return {
        "status": "Connected" if erpnext_installed else "Disconnected",
        "erpnext_installed": erpnext_installed,
        "active_company": company_context.get("company"),
        "warehouses_count": inventory.get("warehouses", 0),
        "items_count": inventory.get("items", 0),
        "suppliers_count": get_supplier_count(),
        "purchase_orders_count": purchasing.get("purchase_orders", 0),
        "price_lists_count": pricing.get("price_lists", 0),
        "last_synchronization": frappe.utils.now(),
    }
