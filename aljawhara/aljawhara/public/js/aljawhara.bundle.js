/**
 * Aljawhara Custom Frappe Desk Bundle (ERPNext v15+)
 */
console.log("[Aljawhara] Custom Frappe application loaded successfully.");

frappe.provide("aljawhara");

aljawhara.init = function() {
    if (frappe.boot && frappe.boot.aljawhara) {
        console.log("[Aljawhara] Boot initialized:", frappe.boot.aljawhara);
    }
};

$(document).on("app_ready", function() {
    aljawhara.init();
});
