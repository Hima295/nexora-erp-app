# -*- coding: utf-8 -*-
import frappe


def get_supplier_count():
    return frappe.db.count("Supplier", {"disabled": 0})


def get_suppliers(limit=20):
    return frappe.get_all(
        "Supplier",
        fields=["name", "supplier_name", "supplier_group", "default_currency"],
        limit=limit,
    )
