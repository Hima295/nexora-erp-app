# -*- coding: utf-8 -*-
import frappe
from nexora.nexora_core.doctype.nexora_log.nexora_log import log_event

def hourly_analytics_sync():
    """Background task executed hourly by Frappe Scheduler"""
    settings = frappe.get_single("nexora Settings")
    if not settings.enabled:
        return

    log_event(
        subject="Hourly Analytics Heartbeat",
        message="nexora background heartbeat executed successfully.",
        log_type="Sync",
        module="nexora Core"
    )

def daily_decision_support_digest():
    """Daily summary task"""
    settings = frappe.get_single("nexora Settings")
    if not settings.enabled:
        return

    log_event(
        subject="Daily Decision Digest Prepared",
        message="Daily summary background task completed.",
        log_type="Info",
        module="nexora Core"
    )

def weekly_system_health_check():
    """Weekly maintenance and log pruning task"""
    settings = frappe.get_single("nexora Settings")
    if not settings.enabled:
        return

    retention_days = settings.log_retention_days or 90
    frappe.db.sql("""
        DELETE FROM `tabnexora Log`
        WHERE DATEDIFF(NOW(), creation) > %s
    """, (retention_days,))
    frappe.db.commit()
