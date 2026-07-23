# -*- coding: utf-8 -*-
from . import __version__ as app_version

app_name = "nexora"
app_title = "nexora"
app_publisher = "nexora Engineering Team"
app_description = "Enterprise-grade custom Frappe application extending ERPNext v15+"
app_email = "dev@nexora.internal"
app_license = "MIT"

# ERPNext Dependency Declaration
# Ensures nexora is installed alongside ERPNext v15+
required_apps = ["frappe", "erpnext"]

# App Include CSS & JS Assets in Frappe Desk
# Injected non-invasively for both LTR (English) and RTL (Arabic) layouts
app_include_js = [
    "/assets/nexora/js/nexora.bundle.js",
    "/assets/nexora/js/nexora_rtl.js"
]

app_include_css = [
    "/assets/nexora/css/nexora.bundle.css",
    "/assets/nexora/css/nexora_rtl.css"
]

# Desk Notifications & Logo
app_logo_url = "/assets/nexora/icons/nexora_logo.svg"

# Document Events Hooks (Non-invasive ERPNext standard observers)
# Listens to ERPNext lifecycle events without editing ERPNext core files
doc_events = {
    "Sales Order": {
        "on_submit": "nexora.overrides.doc_events.on_sales_order_submit",
        "on_cancel": "nexora.overrides.doc_events.on_sales_order_cancel"
    },
    "Purchase Order": {
        "on_submit": "nexora.overrides.doc_events.on_purchase_order_submit"
    },
    "Item": {
        "on_update": "nexora.overrides.doc_events.on_item_update"
    },
    "Stock Entry": {
        "on_submit": "nexora.overrides.doc_events.on_stock_entry_submit"
    }
}

# Scheduled Background Tasks
# Automated background processing using Frappe Scheduler
scheduler_events = {
    "hourly": [
        "nexora.tasks.cron.hourly_analytics_sync"
    ],
    "daily": [
        "nexora.tasks.cron.daily_decision_support_digest"
    ],
    "weekly": [
        "nexora.tasks.cron.weekly_system_health_check"
    ]
}

# Non-invasive Custom Field & Property Setter Fixtures
# Automatically exports and installs custom fields on standard ERPNext DocTypes
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [["module", "=", "nexora Core"]]
    },
    {
        "dt": "Property Setter",
        "filters": [["module", "=", "nexora Core"]]
    }
]

# Custom Whitelisted API Boot Info
# Invoked during Frappe desk initialization
boot_session = "nexora.api.v1.boot_session"

# Jinja Template Extensions
jinja = {
    "methods": [
        "nexora.utils.format_arabic_currency"
    ]
}

# Permission Query Conditions for Enterprise Data Isolation
permission_query_conditions = {
    "nexora Log": "nexora.nexora_core.doctype.nexora_log.nexora_log.get_permission_query_conditions"
}
