frappe.pages["nexora-dashboard"].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Nexora Executive Dashboard"),
        single_column: true
    });

    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "/assets/nexora/nexora_dashboard/css/nexora_dashboard.css?v=2";
    document.head.appendChild(cssLink);

    frappe.require([
        "/assets/nexora/nexora_dashboard/js/nexora_dashboard.i18n.js",
        "/assets/nexora/nexora_dashboard/js/nexora_dashboard.reportx.js",
        "/assets/nexora/nexora_dashboard/js/nexora_dashboard.datatable.js",
        "/assets/nexora/nexora_dashboard/js/nexora_dashboard.app.js",
        "/assets/nexora/nexora_dashboard/js/nexora_dashboard.reports.js"
    ]).then(function () {
        if (!window.NexoraDashboard || !window.NexoraDashboard.App) {
            console.error("Nexora Dashboard: core modules not loaded.");
            return;
        }
        var app = new window.NexoraDashboard.App(wrapper);
        app.init();
    });
};
