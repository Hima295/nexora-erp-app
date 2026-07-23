# -*- coding: utf-8 -*-
import frappe

def log_event(subject, message, log_type='Info', module='nexora Core'):
    frappe.get_doc({
        'doctype': 'nexora Log',
        'subject': subject,
        'message': message,
        'log_type': log_type,
        'module': module
    }).insert(ignore_permissions=True)


def get_permission_query_conditions(user):
    return ''
