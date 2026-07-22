/**
 * nexora RTL & Arabic Helper for Frappe Desk
 */
$(document).ready(function() {
    if (frappe.boot && frappe.boot.nexora && frappe.boot.nexora.rtl) {
        $("html").attr("dir", "rtl").addClass("nexora-rtl");
    }
});
