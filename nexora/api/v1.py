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


@frappe.whitelist()
def developer_verify_environment():
    try:
        from nexora.services.developer_service import DeveloperService
        return DeveloperService.verify_environment()
    except Exception as e:
        frappe.log_error(f"Error verifying environment: {str(e)}", "Developer Center")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def developer_create_backup():
    try:
        from nexora.services.developer_service import DeveloperService
        source_paths = [
            DeveloperService.BASE_DIR,
            os.path.join(DeveloperService.BASE_DIR, "..", "docker-compose.yml"),
            os.path.join(DeveloperService.BASE_DIR, "..", "Dockerfile"),
            os.path.join(DeveloperService.BASE_DIR, "..", ".env"),
        ]
        return DeveloperService.create_backup(source_paths)
    except Exception as e:
        frappe.log_error(f"Error creating backup: {str(e)}", "Developer Center")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def developer_publish_update(commit_message=None, branch=None, create_tag=False, quick_mode=False):
    try:
        import time
        from nexora.services.developer_service import DeveloperService
        start = time.time()
        branch = branch or "main"
        settings = frappe.get_single("nexora Developer Settings") if frappe.db.exists("DocType", "nexora Developer Settings") else None

        steps = []
        steps.append(("verify", DeveloperService.verify_environment()))
        if not steps[-1][1].get("all_passed"):
            return {"success": False, "step": "verify", "result": steps[-1][1]}

        backup_result = None
        if not quick_mode or (settings and settings.auto_backup_enabled):
            backup_source_paths = [
                DeveloperService.BASE_DIR,
                os.path.join(DeveloperService.BASE_DIR, "..", "docker-compose.yml"),
                os.path.join(DeveloperService.BASE_DIR, "..", "Dockerfile"),
                os.path.join(DeveloperService.BASE_DIR, "..", ".env"),
            ]
            backup_result = DeveloperService.create_backup(backup_source_paths)

        steps.append(("git_status", DeveloperService.get_git_status()))
        steps.append(("git_add", DeveloperService.git_add_all()))
        commit_msg = commit_message or "Auto Update"
        steps.append(("git_commit", DeveloperService.git_commit(commit_msg)))
        steps.append(("git_push", DeveloperService.git_push(branch)))

        tag_result = None
        if create_tag:
            current_version = getattr(settings, "version_prefix", "v") or "v"
            latest = DeveloperService.get_next_version(current_version)
            tag_result = DeveloperService.git_create_tag(latest, f"Release {latest}")
            steps.append(("git_tag", tag_result))

        duration = round(time.time() - start, 2)
        history_record = {
            "date": frappe.utils.now_datetime().strftime("%Y-%m-%d"),
            "time": frappe.utils.now_datetime().strftime("%H:%M:%S"),
            "commit_hash": steps[-3][1].get("commit_hash") if len(steps) > 3 else None,
            "commit_message": commit_msg,
            "tag": tag_result.get("output") if tag_result else None,
            "branch": branch,
            "author": frappe.session.user,
            "duration": duration,
            "changed_files": steps[-4][1].get("files") if len(steps) > 4 else [],
            "backup_file": backup_result.get("backup_path") if backup_result else None,
            "push_result": steps[-1][1].get("output") if len(steps) > 0 else None,
            "status": "Success" if steps[-1][1].get("success") else "Failed",
        }
        DeveloperService.write_update_history(history_record)

        return {
            "success": history_record["status"] == "Success",
            "steps": steps,
            "duration": duration,
            "history": history_record,
        }
    except Exception as e:
        frappe.log_error(f"Error publishing update: {str(e)}", "Developer Center")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def developer_get_history():
    try:
        from nexora.services.developer_service import DeveloperService
        filters = frappe.local.form_dict.get("filters", {})
        return DeveloperService.get_update_history(filters)
    except Exception as e:
        frappe.log_error(f"Error fetching update history: {str(e)}", "Developer Center")
        return []


@frappe.whitelist()
def developer_list_backups():
    try:
        from nexora.services.developer_service import DeveloperService
        return DeveloperService.list_backups()
    except Exception as e:
        frappe.log_error(f"Error listing backups: {str(e)}", "Developer Center")
        return []


@frappe.whitelist()
def developer_restore_backup(backup_file_path):
    try:
        from nexura.services.developer_service import DeveloperService
        return DeveloperService.restore_backup(backup_file_path)
    except Exception as e:
        frappe.log_error(f"Error restoring backup: {str(e)}", "Developer Center")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def developer_delete_backup(backup_file_path):
    try:
        from nexora.services.developer_service import DeveloperService
        return DeveloperService.delete_backup(backup_file_path)
    except Exception as e:
        frappe.log_error(f"Error deleting backup: {str(e)}", "Developer Center")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def developer_get_next_version(current_version=None):
    try:
        from nexora.services.developer_service import DeveloperService
        version = current_version or "v1.0.0"
        return DeveloperService.get_next_version(version)
    except Exception as e:
        frappe.log_error(f"Error computing next version: {str(e)}", "Developer Center")
        return "v1.0.1"


@frappe.whitelist()
def barcode_get_items(filters=None):
    try:
        from nexora.services.barcode_service import BarcodeService
        filters = frappe.parse_json(filters or "{}")
        return {"items": BarcodeService.get_items(filters)}
    except Exception as e:
        frappe.log_error(f"Error fetching barcode items: {str(e)}", "Nexora Barcode")
        return {"items": []}


@frappe.whitelist()
def barcode_get_item_details(item_code):
    try:
        from nexora.services.barcode_service import BarcodeService
        return BarcodeService.get_item_details(item_code)
    except Exception as e:
        frappe.log_error(f"Error fetching item details: {str(e)}", "Nexora Barcode")
        return {}


@frappe.whitelist()
def barcode_get_templates():
    try:
        from nexora.services.barcode_service import BarcodeService
        company = frappe.defaults.get_user_default("company")
        return {"templates": BarcodeService.get_templates(company)}
    except Exception as e:
        frappe.log_error(f"Error fetching templates: {str(e)}", "Nexora Barcode")
        return {"templates": []}


@frappe.whitelist()
def barcode_get_default_template():
    try:
        from nexora.services.barcode_service import BarcodeService
        company = frappe.defaults.get_user_default("company")
        template = BarcodeService.get_default_template(company)
        return {"template": template[0] if template else None}
    except Exception as e:
        frappe.log_error(f"Error fetching default template: {str(e)}", "Nexora Barcode")
        return {"template": None}


@frappe.whitelist()
def barcode_generate_barcodes(item_codes=None, barcode_type="Code128", company_prefix="G"):
    try:
        from nexora.services.barcode_service import BarcodeService
        if not item_codes:
            return []
        item_codes = frappe.parse_json(item_codes)
        company = frappe.defaults.get_user_default("company")
        return BarcodeService.generate_barcodes_for_items(item_codes, company, barcode_type)
    except Exception as e:
        frappe.log_error(f"Error generating barcodes: {str(e)}", "Nexora Barcode")
        return []


@frappe.whitelist()
def barcode_create_print_job(data=None):
    try:
        from nexora.services.barcode_service import BarcodeService
        if not data:
            return {"error": "No data provided"}
        data = frappe.parse_json(data)
        job_name = BarcodeService.create_print_job(data)
        return {"job_name": job_name}
    except Exception as e:
        frappe.log_error(f"Error creating print job: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}


@frappe.whitelist()
def barcode_get_print_history(filters=None):
    try:
        from nexora.services.barcode_service import BarcodeService
        filters = frappe.parse_json(filters or "{}")
        return {"history": BarcodeService.get_print_history(filters)}
    except Exception as e:
        frappe.log_error(f"Error fetching print history: {str(e)}", "Nexora Barcode")
        return {"history": []}


@frappe.whitelist()
def barcode_save_template():
    try:
        from nexora.services.barcode_service import BarcodeService
        data = frappe.parse_json(frappe.local.form_dict.get("data", "{}"))
        return BarcodeService.save_template(data)
    except Exception as e:
        frappe.log_error(f"Error saving template: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}


@frappe.whitelist()
def barcode_get_templates():
    try:
        from nexora.services.barcode_service import BarcodeService
        company = frappe.defaults.get_user_default("company")
        return {"templates": BarcodeService.get_templates(company)}
    except Exception as e:
        frappe.log_error(f"Error fetching templates: {str(e)}", "Nexora Barcode")
        return {"templates": []}


@frappe.whitelist()
def barcode_duplicate_template(template_name):
    try:
        from nexora.services.barcode_service import BarcodeService
        return BarcodeService.duplicate_template(template_name)
    except Exception as e:
        frappe.log_error(f"Error duplicating template: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}


@frappe.whitelist()
def barcode_delete_template(template_name):
    try:
        from nexora.services.barcode_service import BarcodeService
        return BarcodeService.delete_template(template_name)
    except Exception as e:
        frappe.log_error(f"Error deleting template: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}


@frappe.whitelist()
def barcode_render_label(template_name, item_code):
    try:
        from nexora.services.barcode_service import BarcodeService
        return BarcodeService.render_label(template_name, item_code)
    except Exception as e:
        frappe.log_error(f"Error rendering label: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}


@frappe.whitelist()
def barcode_export_labels(print_type, filters, template_name, export_format, batch_size):
    try:
        from nexora.services.barcode_service import BarcodeService
        filters = frappe.parse_json(filters or "{}")
        return BarcodeService.export_labels(print_type, filters, template_name, export_format, batch_size)
    except Exception as e:
        frappe.log_error(f"Error exporting labels: {str(e)}", "Nexora Barcode")
        return {"error": str(e)}

