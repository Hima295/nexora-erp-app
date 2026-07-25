# -*- coding: utf-8 -*-
import frappe

@frappe.whitelist()
def get_system_status():
    """Returns ERPNext connection status and nexora extension parameters"""
    try:
        settings = frappe.get_single("nexora Settings")
        erpnext_installed = "erpnext" in frappe.get_installed_apps()
        
        return {
            "app_name": "nexora",
            "app_version": frappe.get_attr("nexora.__version__"),
            "erpnext_connected": erpnext_installed,
            "erpnext_version": frappe.get_attr("erpnext.__version__") if erpnext_installed else None,
            "rtl_enabled": settings.primary_language == "Arabic (RTL)",
            "enabled": bool(settings.enabled),
            "active_observers": [
                obs for obs, active in [
                    ("Sales Orders", settings.observe_sales_orders),
                    ("Purchase Orders", settings.observe_purchase_orders),
                    ("Stock Entries", settings.observe_stock_entries)
                ] if active
            ]
        }
    except Exception as e:
        frappe.log_error(f"Error fetching system status: {str(e)}", "nexora API Error")
        return {"error": str(e)}

def boot_session(bootinfo):
    """Injects nexora global context during Frappe session initialization"""
    try:
        settings = frappe.get_single("nexora Settings")
        bootinfo.nexora = {
            "version": frappe.get_attr("nexora.__version__"),
            "rtl": settings.primary_language == "Arabic (RTL)",
            "app_title": settings.app_title_override or "nexora الجوهرة"
        }
    except Exception:
        pass


@frappe.whitelist()
def get_system_connection():
    """Returns ERPNext system connection summary for Nexora Pulse workspace card"""
    try:
        from nexora.services.analytics_service import get_system_connection_status
        return get_system_connection_status()
    except Exception as e:
        frappe.log_error(f"Error fetching system connection: {str(e)}", "nexora API Error")
        return {"status": "Error", "error": str(e)}


@frappe.whitelist()
def get_companies():
    """Returns list of all active companies"""
    try:
        from nexora.services.company_service import get_companies
        return {"companies": get_companies()}
    except Exception as e:
        frappe.log_error(f"Error fetching companies: {str(e)}", "nexora API Error")
        return {"companies": []}


@frappe.whitelist()
def set_active_company(company_name):
    """Sets the active company for the current user session"""
    try:
        from nexora.services.company_service import set_active_company
        return set_active_company(company_name)
    except Exception as e:
        frappe.log_error(f"Error setting active company: {str(e)}", "nexora API Error")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def get_number_card_items(filters=None):
    from nexora.services.inventory_service import get_item_count
    return str(get_item_count())


@frappe.whitelist()
def get_number_card_warehouses(filters=None):
    from nexora.services.inventory_service import get_warehouse_count
    return str(get_warehouse_count())


@frappe.whitelist()
def get_number_card_stock_qty(filters=None):
    from nexora.services.inventory_service import get_stock_qty
    val = get_stock_qty()
    return str(int(val)) if val == int(val) else str(val)


@frappe.whitelist()
def get_number_card_inventory_value(filters=None):
    from nexora.services.inventory_service import get_inventory_value
    val = get_inventory_value()
    formatted = "{:,.2f}".format(val)
    return f"{formatted} SDG"


@frappe.whitelist()
def get_inventory_data():
    """Returns all inventory data for Nexora Pulse workspace custom block"""
    try:
        from nexora.services.company_service import get_active_company, get_company_context
        from nexora.services.inventory_service import (
            get_inventory_summary,
            get_inventory_table,
            get_low_stock_items,
            get_out_of_stock_items,
        )

        company = get_active_company()
        context = get_company_context()

        summary = get_inventory_summary()
        table = get_inventory_table()
        low_stock = get_low_stock_items()
        out_of_stock = get_out_of_stock_items()

        return {
            "status": "Connected",
            "active_company": company,
            "total_items": summary.get("items", 0),
            "total_warehouses": summary.get("warehouses", 0),
            "total_stock_qty": summary.get("stock_qty", 0),
            "total_inventory_value": summary.get("inventory_value", 0.0),
            "inventory_table": table,
            "low_stock_items": low_stock,
            "out_of_stock": out_of_stock,
        }
    except Exception as e:
        frappe.log_error(f"Error fetching inventory data: {str(e)}", "nexora API Error")
        return {"status": "Error", "error": str(e)}
