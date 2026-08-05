# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document
from frappe.utils import now


class NexoraBackup(Document):
    def before_insert(self):
        if not self.creation_date:
            self.creation_date = now()
        if not self.created_by:
            self.created_by = frappe.session.user
