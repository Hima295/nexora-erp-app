frappe.ui.form.on('Aljawhara Settings', {
    refresh: function(frm) {
        frm.add_custom_button(__('Check System Status'), function() {
            frappe.call({
                method: 'aljawhara.api.v1.get_system_status',
                callback: function(r) {
                    if (r.message) {
                        frappe.msgprint({
                            title: __('Aljawhara Status'),
                            indicator: 'green',
                            message: __('ERPNext v15 Core Connected: {0}<br>RTL Mode: {1}<br>Active Observers: {2}', [
                                r.message.erpnext_connected ? __('Yes') : __('No'),
                                r.message.rtl_enabled ? __('Arabic (RTL)') : __('English (LTR)'),
                                r.message.active_observers.join(', ')
                            ])
                        });
                    }
                }
            });
        }).addClass('btn-primary');
    }
});
