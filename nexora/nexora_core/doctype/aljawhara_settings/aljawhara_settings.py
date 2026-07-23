# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document

class nexoraSettings(Document):
    def validate(self):
        """Validate settings before saving"""
        if self.auto_sync_interval_mins and self.auto_sync_interval_mins < 5:
            frappe.throw(frappe._("Background sync interval cannot be less than 5 minutes."))

    def on_change(self):
        """Clear cached settings across workers on save"""
        frappe.cache().delete_value("nexora_settings")

@frappe.whitelist()
def get_nexora_settings():
    """Retrieve cached nexora settings or fetch single document"""
    settings = frappe.cache().get_value("nexora_settings")
    if not settings:
        settings = frappe.get_single("nexora Settings").as_dict()
        frappe.cache().set_value("nexora_settings", settings)
    return settings
