# -*- coding: utf-8 -*-
import frappe


def get_active_company():
    user_company = frappe.defaults.get_user_default("company")
    if user_company:
        return user_company
    return frappe.defaults.get_global_default("company") or frappe.db.get_single_value(
        "Global Defaults", "default_company"
    )


def get_companies():
    """Return all active companies the user has access to"""
    companies = frappe.get_all(
        "Company",
        fields=["name"],
        order_by="name",
    )
    return [c.name for c in companies]


def set_active_company(company_name):
    """Set the active company for the current user session"""
    if not frappe.db.exists("Company", company_name):
        frappe.throw(f"Company {company_name} does not exist")
    
    frappe.defaults.set_user_default("company", company_name)
    return {"success": True, "company": company_name}


def get_company_context():
    company = get_active_company()
    return {
        "company": company,
    }


def validate_company_exists(company):
    if not company:
        company = get_active_company()
    if not company or not frappe.db.exists("Company", company):
        frappe.throw("Company not found. Please set a default Company in Global Defaults.")
    return company
