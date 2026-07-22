# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document

class nexoraLog(Document):
    pass

def get_permission_query_conditions(user):
    """Ensure System Managers and authorized users can access logs"""
    if not user:
        user = frappe.session.user
    if "System Manager" in frappe.get_roles(user):
        return ""
    return "`tabnexora Log`.owner = {user}".format(user=frappe.db.escape(user))

def log_event(subject, message="", log_type="Info", module="nexora Core", reference_doctype=None, reference_name=None, execution_time_ms=0):
    """Helper method to record system events non-invasively"""
    try:
        log = frappe.get_doc({
            "doctype": "nexora Log",
            "subject": subject,
            "message": str(message),
            "log_type": log_type,
            "module": module,
            "reference_doctype": reference_doctype,
            "reference_name": reference_name,
            "execution_time_ms": execution_time_ms
        })
        log.insert(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.log_error(f"Failed to write nexora Log: {str(e)}", "nexora Log Failure")
