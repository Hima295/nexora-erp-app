# -*- coding: utf-8 -*-
import frappe


def get_item_price_count():
    return frappe.db.count("Item Price")


def get_price_list_count():
    return frappe.db.count("Price List")


def get_pricing_summary():
    return {
        "item_prices": get_item_price_count(),
        "price_lists": get_price_list_count(),
    }
