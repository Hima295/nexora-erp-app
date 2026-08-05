# -*- coding: utf-8 -*-
from . import __version__ as app_version

app_name = "nexora"
app_title = "nexora"
app_publisher = "nexora Engineering Team"
app_description = "Enterprise-grade custom Frappe application extending ERPNext v15+"
app_email = "dev@nexora.internal"
app_license = "MIT"

# ERPNext Dependency Declaration
required_apps = ["frappe", "erpnext"]

# App Include CSS & JS Assets in Frappe Desk
# Injected non-invasively for both LTR (English) and RTL (Arabic) layouts
app_include_js = [
    "/assets/nexora/js/nexora.bundle.js",
    "/assets/nexora/js/nexora_rtl.js",
    "/assets/nexora/js/nexora_workspace_mount.js"
]

app_include_css = [
    "/assets/nexora/css/nexora.bundle.css",
    "/assets/nexora/css/nexora_rtl.css"
]

# Nexora is now rendered inside the ERPNext Desk as a regular Workspace
# (the SPA is mounted by public/js/nexora_workspace_mount.js when the "Nexora"
# workspace is shown). No website route rule is registered for /app/nexora so
# the URL resolves to the Desk workspace and keeps the Desk sidebar visible.

# Show Nexora as the default app on the apps screen
add_to_apps_screen = [
    {
        "name": "nexora",
        "logo": "/assets/nexora/icons/nexora_logo.svg",
        "title": "Nexora",
        "route": "/app/nexora",
    }
]

# Barcode Studio page assets are loaded from page/barcode_studio/barcode_studio.js
# via frappe.require() using /assets/nexora/... URLs. The page_js hook cannot
# reference public files (it resolves relative to the app's Python module path),
# so no page_js entries are defined here.

# Desk Notifications & Logo
app_logo_url = "/assets/nexora/icons/nexora_logo.svg"

# Document Events Hooks
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
