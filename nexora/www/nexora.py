from urllib.parse import urlencode

import frappe

no_cache = 1


def get_context(context):
	if frappe.session.user == "Guest":
		frappe.local.flags.redirect_location = "/login?" + urlencode(
			{"redirect-to": frappe.request.path}
		)
		raise frappe.Redirect

	if frappe.db.get_value("User", frappe.session.user, "user_type", order_by=None) == "Website User":
		frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)

	# this needs commit
	csrf_token = frappe.sessions.get_csrf_token()
	frappe.db.commit()

	context.title = "Nexora"
	context.csrf_token = csrf_token
	context.boot_user = frappe.as_json(
		{
			"name": frappe.session.user,
			"fullname": frappe.utils.get_fullname(frappe.session.user),
			"email": frappe.session.user,
		}
	)
