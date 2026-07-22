from frappe import _

def get_data():
    return [
        {
            "label": _("Aljawhara Suite"),
            "icon": "octicon octicon-briefcase",
            "items": [
                {
                    "type": "doctype",
                    "name": "Aljawhara Settings",
                    "label": _("Aljawhara Settings"),
                    "description": _("Configure Aljawhara ERPNext Extension and Analytics engine"),
                },
                {
                    "type": "doctype",
                    "name": "Aljawhara Log",
                    "label": _("System Audit Logs"),
                    "description": _("View automated sync and execution logs"),
                }
            ]
        },
        {
            "label": _("ERPNext Intelligence Modules"),
            "icon": "octicon octicon-graph",
            "items": [
                {
                    "type": "page",
                    "name": "executive-analytics-blueprint",
                    "label": _("Executive Analytics Architecture"),
                    "description": _("Blueprint for executive dashboard modules"),
                },
                {
                    "type": "page",
                    "name": "inventory-intelligence-blueprint",
                    "label": _("Inventory Intelligence Architecture"),
                    "description": _("Blueprint for inventory insights modules"),
                }
            ]
        }
    ]
