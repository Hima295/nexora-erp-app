# -*- coding: utf-8 -*-
import frappe
from frappe.model.document import Document
from frappe.utils import now, get_datetime


class NexoraUpdateHistory(Document):
    def before_insert(self):
        if not self.date:
            self.date = get_datetime(now()).date()
        if not self.time:
            self.time = get_datetime(now()).time()
