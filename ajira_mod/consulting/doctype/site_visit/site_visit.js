// Copyright (c) 2025, Ajira and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Site Visit", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Site Visit', {
    refresh: function (frm) {
        // Add button to the HTML field
        frm.fields_dict['char_killa'].html(`<button class="btn btn-primary char-killa-add">Char Killa Add</button>`);

        // Attach event to the button
        frm.$wrapper.find('.char-killa-add').on('click', function () {
            frappe.new_doc('Char Killa'); // Open the Char Killa doctype form
        });
    }
});
