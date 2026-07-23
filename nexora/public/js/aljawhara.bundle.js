/**
 * nexora Custom Frappe Desk Bundle (ERPNext v15+)
 */
console.log("[nexora] Custom Frappe application loaded successfully.");

frappe.provide("nexora");

nexora.init = function() {
    if (frappe.boot && frappe.boot.nexora) {
        console.log("[nexora] Boot initialized:", frappe.boot.nexora);
    }
};

$(document).on("app_ready", function() {
    nexora.init();
});
