# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document
from frappe.utils import now


class NexoraBarcodeItem(Document):
    def before_insert(self):
        if not self.generated_date:
            self.generated_date = now()
        if not self.barcode:
            self.barcode = self.generate_barcode()

    def generate_barcode(self):
        prefix = "G"
        last = frappe.db.get_value(
            "Nexora Barcode Item",
            {"company": self.company},
            "barcode",
            order_by="barcode desc",
        )
        if last:
            try:
                num = int(last.replace(prefix, "")) + 1
            except ValueError:
                num = 1
        else:
            num = 1
        return f"{prefix}{num:09d}"
