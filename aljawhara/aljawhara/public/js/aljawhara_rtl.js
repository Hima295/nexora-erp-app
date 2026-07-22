/**
 * Aljawhara RTL & Arabic Helper for Frappe Desk
 */
$(document).ready(function() {
    if (frappe.boot && frappe.boot.aljawhara && frappe.boot.aljawhara.rtl) {
        $("html").attr("dir", "rtl").addClass("aljawhara-rtl");
    }
});
