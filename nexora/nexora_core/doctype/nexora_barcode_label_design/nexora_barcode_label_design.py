# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document


class NexoraBarcodeLabelDesign(Document):
    def validate(self):
        if self.is_default:
            frappe.db.set_value(
                "Nexora Barcode Label Design",
                {"company": self.company, "is_default": 1, "name": ["!=", self.name]},
                "is_default",
                0,
            )
