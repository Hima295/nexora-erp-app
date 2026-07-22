# -*- coding: utf-8 -*-
from . import __version__ as app_version

app_name = "aljawhara"
app_title = "Aljawhara"
app_publisher = "Aljawhara Engineering Team"
app_description = "Enterprise-grade custom Frappe application extending ERPNext v15+"
app_email = "dev@aljawhara.internal"
app_license = "MIT"

# ERPNext Dependency Declaration
# Ensures Aljawhara is installed alongside ERPNext v15+
required_apps = ["frappe", "erpnext"]

# App Include CSS & JS Assets in Frappe Desk
# Injected non-invasively for both LTR (English) and RTL (Arabic) layouts
app_include_js = [
    "/assets/aljawhara/js/aljawhara.bundle.js",
    "/assets/aljawhara/js/aljawhara_rtl.js"
]

app_include_css = [
    "/assets/aljawhara/css/aljawhara.bundle.css",
    "/assets/aljawhara/css/aljawhara_rtl.css"
]

# Desk Notifications & Logo
app_logo_url = "/assets/aljawhara/icons/aljawhara_logo.svg"

# Document Events Hooks (Non-invasive ERPNext standard observers)
# Listens to ERPNext lifecycle events without editing ERPNext core files
doc_events = {
    "Sales Order": {
        "on_submit": "aljawhara.overrides.doc_events.on_sales_order_submit",
        "on_cancel": "aljawhara.overrides.doc_events.on_sales_order_cancel"
    },
    "Purchase Order": {
        "on_submit": "aljawhara.overrides.doc_events.on_purchase_order_submit"
    },
    "Item": {
        "on_update": "aljawhara.overrides.doc_events.on_item_update"
    },
    "Stock Entry": {
        "on_submit": "aljawhara.overrides.doc_events.on_stock_entry_submit"
    }
}

# Scheduled Background Tasks
# Automated background processing using Frappe Scheduler
scheduler_events = {
    "hourly": [
        "aljawhara.tasks.cron.hourly_analytics_sync"
    ],
    "daily": [
        "aljawhara.tasks.cron.daily_decision_support_digest"
    ],
    "weekly": [
        "aljawhara.tasks.cron.weekly_system_health_check"
    ]
}

# Non-invasive Custom Field & Property Setter Fixtures
# Automatically exports and installs custom fields on standard ERPNext DocTypes
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [["module", "=", "Aljawhara Core"]]
    },
    {
        "dt": "Property Setter",
        "filters": [["module", "=", "Aljawhara Core"]]
    }
]

# Custom Whitelisted API Boot Info
# Invoked during Frappe desk initialization
boot_session = "aljawhara.api.v1.boot_session"

# Jinja Template Extensions
jinja = {
    "methods": [
        "aljawhara.utils.format_arabic_currency"
    ]
}

# Permission Query Conditions for Enterprise Data Isolation
permission_query_conditions = {
    "Aljawhara Log": "aljawhara.aljawhara_core.doctype.aljawhara_log.aljawhara_log.get_permission_query_conditions"
}
