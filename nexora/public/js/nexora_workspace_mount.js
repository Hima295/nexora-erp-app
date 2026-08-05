/**
 * Nexora SPA -> ERPNext backend bridge
 *
 * Nexora is the frontend application; ERPNext is the backend only.
 * When the "Nexora" workspace is shown, this bridge mounts the standalone
 * Nexora dashboard bundle (nexora_dashboard.app.js) and hides ALL ERPNext
 * chrome (desk navbar, desk sidebar, workspace chrome) so the SPA fills the
 * full browser width with its own header + left sidebar. ERPNext chrome is
 * restored as soon as the user leaves the Nexora route.
 */
(function () {
    "use strict";

    var NEXORA_WORKSPACE = "Nexora"; // workspace title (page.name in workspace.js)
    var ASSETS = {
        css: "/assets/nexora/nexora_dashboard/css/nexora_dashboard.css?v=2",
        i18n: "/assets/nexora/nexora_dashboard/js/nexora_dashboard.i18n.js",
        app: "/assets/nexora/nexora_dashboard/js/nexora_dashboard.app.js",
        datatable: "/assets/nexora/nexora_dashboard/js/nexora_dashboard.datatable.js",
        reports: "/assets/nexora/nexora_dashboard/js/nexora_dashboard.reports.js"
    };

    var state = {
        mounted: false,
        pending: false,
        app: null,
        loaded: {}
    };

    /* ------------------------------------------------------------------
     * Asset loading (cached per page session)
     * ------------------------------------------------------------------ */

    function loadCss() {
        var url = ASSETS.css;
        if (state.loaded.css) return state.loaded.css;
        state.loaded.css = new Promise(function (resolve, reject) {
            if (document.querySelector('link[data-nexora-css="1"]')) return resolve();
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-nexora-css", "1");
            link.href = url;
            link.onload = resolve;
            link.onerror = function () {
                link.remove();
                delete state.loaded.css;
                reject(new Error("Failed to load " + url));
            };
            document.head.appendChild(link);
        });
        return state.loaded.css;
    }

    function loadJs(key) {
        var url = ASSETS[key];
        if (state.loaded[key]) return state.loaded[key];
        state.loaded[key] = new Promise(function (resolve, reject) {
            if (document.querySelector('script[data-nexora-js="' + url + '"]')) return resolve();
            var s = document.createElement("script");
            s.setAttribute("data-nexora-js", url);
            s.src = url;
            s.onload = resolve;
            s.onerror = function () {
                s.remove();
                delete state.loaded[key];
                reject(new Error("Failed to load " + url));
            };
            document.head.appendChild(s);
        });
        return state.loaded[key];
    }

    /* ------------------------------------------------------------------
     * Desk-context CSS overrides (injected after the SPA css so they win)
     * ------------------------------------------------------------------ */

    function injectFixStyles() {
        if (document.getElementById("nexora-workspace-fix")) return;
        var st = document.createElement("style");
        st.id = "nexora-workspace-fix";
        st.textContent = [
            /* Neutralize the standalone dark body background */
            "body.nexora-standalone{background:transparent}",
            /* Full-width takeover: hide every piece of ERPNext chrome while Nexora is active */
            "body.nexora-workspace-active .navbar,",
            "body.nexora-workspace-active .desk-sidebar,",
            "body.nexora-workspace-active .layout-side-section,",
            "body.nexora-workspace-active .page-head,",
            "body.nexora-workspace-active .page-title-area,",
            "body.nexora-workspace-active .workspace-footer,",
            "body.nexora-workspace-active #editorjs{display:none!important}",
            /* Fill the full browser width - no centered page column, no desk gutters */
            "body.nexora-workspace-active{overflow-x:hidden}",
            "body.nexora-workspace-active .page-body,",
            "body.nexora-workspace-active .page-wrapper,",
            "body.nexora-workspace-active .layout-main{margin:0!important;padding:0!important;border:0!important;width:100%!important;max-width:none!important}",
            "body.nexora-workspace-active .main-section,",
            "body.nexora-workspace-active .page-container,",
            "body.nexora-workspace-active .page-content,",
            "body.nexora-workspace-active .layout-main-section,",
            "body.nexora-workspace-active .layout-main-section-wrapper,",
            "body.nexora-workspace-active .editor-js-container{padding:0!important;margin:0!important;border:0!important;width:100%!important;max-width:none!important}",
            /* The Nexora SPA spans the full viewport (own header + left sidebar) */
            "body.nexora-workspace-active .nx-root{min-height:100vh;width:100%}",
            "body.nexora-workspace-active .nx-sidebar{top:0;height:100vh}",
            "body.nexora-workspace-active .nx-embed{height:calc(100vh - 170px)}",
            "body.nexora-workspace-active .nx-embed-inline{height:calc(100vh - 235px)}"
        ].join("\n");
        document.head.appendChild(st);
    }

    /* ------------------------------------------------------------------
     * Mount / unmount
     * ------------------------------------------------------------------ */

    function isNexoraRoute() {
        var r = frappe.router.current_route || [];
        return r[0] === "Workspaces" && r[1] === NEXORA_WORKSPACE;
    }

    function getMountContainer(ws) {
        var body = ws && ws.body;
        if (body && body.find) {
            var el = body.find(".editor-js-container").get(0);
            if (el) return el;
        }
        return document.querySelector(".editor-js-container");
    }

    function showMount() {
        document.body.classList.add("nexora-workspace-active");
    }

    function hideMount() {
        document.body.classList.remove("nexora-workspace-active");
        document.body.classList.remove("nexora-standalone");
        if (state.app) {
            if (state.app.state && state.app.state.timer) clearInterval(state.app.state.timer);
            if (state.app.root) {
                try {
                    state.app.root.remove();
                } catch (e) {}
            }
            state.app = null;
        }
        var nx = document.getElementById("nx-app");
        if (nx && nx.parentNode) nx.parentNode.removeChild(nx);
        if (window.NexoraDashboard) window.NexoraDashboard.activeApp = null;
        state.mounted = false;
        state.pending = false;
    }

    function mountNexora(ws, attempts) {
        attempts = attempts || 0;
        if (state.mounted) {
            showMount();
            return;
        }
        if (state.pending) return;
        if (!isNexoraRoute()) return;

        var container = getMountContainer(ws);
        if (!container) {
            // workspace DOM not rendered yet; retry shortly
            if (attempts > 60) return;
            setTimeout(function () {
                mountNexora(ws, attempts + 1);
            }, 120);
            return;
        }

        state.pending = true;
        showMount();
        injectFixStyles();

        var mountEl = document.getElementById("nx-app");
        if (!mountEl) {
            mountEl = document.createElement("div");
            mountEl.id = "nx-app";
            container.appendChild(mountEl);
        }

        loadCss()
            .then(function () {
                return loadJs("i18n");
            })
            .then(function () {
                return loadJs("app");
            })
            .then(function () {
                return loadJs("datatable");
            })
            .then(function () {
                return loadJs("reports");
            })
            .then(function () {
                if (!window.NexoraDashboard || !window.NexoraDashboard.App) {
                    throw new Error("NexoraDashboard.App is not available");
                }
                if (!isNexoraRoute()) {
                    hideMount();
                    return;
                }
                state.app = new window.NexoraDashboard.App(mountEl);
                state.app.init();
                state.mounted = true;
            })
            .catch(function (err) {
                state.pending = false;
                console.error("[Nexora] mount failed:", err);
                if (frappe.show_alert) {
                    frappe.show_alert({
                        message: "Nexora failed to load: " + (err && err.message ? err.message : err),
                        indicator: "red"
                    });
                }
            });
    }

    /* ------------------------------------------------------------------
     * Wiring
     * ------------------------------------------------------------------ */

    function patchWorkspaceShowPage() {
        var proto = frappe.views && frappe.views.Workspace && frappe.views.Workspace.prototype;
        if (!proto || proto.show_page.__nexoraWrapped) return;
        var orig = proto.show_page;
        var wrapped = async function (page) {
            try {
                await orig.call(this, page);
            } catch (e) {
                console.error("[Nexora] workspace show_page error", e);
            }
            if (page && page.name === NEXORA_WORKSPACE) {
                mountNexora(this);
            } else {
                hideMount();
            }
        };
        wrapped.__nexoraWrapped = true;
        proto.show_page = wrapped;
    }

    function onRouteChange() {
        if (!isNexoraRoute()) hideMount();
    }

    function init() {
        if (window.__nexoraWorkspaceBridge) return;
        window.__nexoraWorkspaceBridge = true;

        if (frappe.router && frappe.router.on) {
            frappe.router.on("change", onRouteChange);
        }
        patchWorkspaceShowPage();

        // Deep link straight onto the Nexora workspace (route already active).
        if (isNexoraRoute()) {
            setTimeout(function () {
                mountNexora(frappe.workspace);
            }, 150);
        }
    }

    if (frappe && frappe.ready) {
        frappe.ready(init);
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
