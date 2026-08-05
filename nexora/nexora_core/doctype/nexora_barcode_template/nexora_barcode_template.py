# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document


class NexoraBarcodeTemplate(Document):
    def validate(self):
        if self.is_default:
            frappe.db.set_value(
                "Nexora Barcode Template",
                {"company": self.company, "is_default": 1, "name": ["!=", self.name]},
                "is_default",
                0,
            )
