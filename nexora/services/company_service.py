# -*- coding: utf-8 -*-
import frappe


def get_active_company():
    return frappe.defaults.get_global_default("company") or frappe.db.get_single_value(
        "Global Defaults", "default_company"
    )


def get_active_branch():
    try:
        if frappe.db.exists("DocType", "Branch"):
            branch = frappe.db.get_single_value("Global Defaults", "default_branch")
            return branch if branch else None
    except Exception:
        pass
    return None


def get_company_context():
    company = get_active_company()
    branch = get_active_branch()
    return {
        "company": company,
        "branch": branch,
    }


def validate_company_exists(company):
    if not company:
        company = get_active_company()
    if not company or not frappe.db.exists("Company", company):
        frappe.throw("Company not found. Please set a default Company in Global Defaults.")
    return company
