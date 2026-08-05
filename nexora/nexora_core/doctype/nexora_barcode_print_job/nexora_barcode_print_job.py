# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document
from frappe.utils import now


class NexoraBarcodePrintJob(Document):
    def before_insert(self):
        if not self.print_date:
            self.print_date = now()
        if not self.printed_by:
            self.printed_by = frappe.session.user
