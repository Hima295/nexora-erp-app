frappe.ui.form.on('Aljawhara Log', {
    refresh: function(frm) {
        // Read-only audit log view
        frm.disable_save();
    }
});
