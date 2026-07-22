# -*- coding: utf-8 -*-
import frappe

@frappe.whitelist()
def get_system_status():
    """Returns ERPNext connection status and Aljawhara extension parameters"""
    try:
        settings = frappe.get_single("Aljawhara Settings")
        erpnext_installed = "erpnext" in frappe.get_installed_apps()
        
        return {
            "app_name": "aljawhara",
            "app_version": frappe.get_attr("aljawhara.__version__"),
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
        frappe.log_error(f"Error fetching system status: {str(e)}", "Aljawhara API Error")
        return {"error": str(e)}

def boot_session(bootinfo):
    """Injects Aljawhara global context during Frappe session initialization"""
    try:
        settings = frappe.get_single("Aljawhara Settings")
        bootinfo.aljawhara = {
            "version": frappe.get_attr("aljawhara.__version__"),
            "rtl": settings.primary_language == "Arabic (RTL)",
            "app_title": settings.app_title_override or "Aljawhara الجوهرة"
        }
    except Exception:
        pass
