frappe.ui.form.on('nexora Log', {
    refresh: function(frm) {
        // Read-only audit log view
        frm.disable_save();
    }
});
