// Copyright (c) 2025, Ajira and contributors
// For license information, please see license.txt

frappe.ui.form.on("Land", {
    // When the form is loaded or refreshed
    refresh(frm) {
        frappe.db.get_value('Lead', frm.doc.focal_person, 'lead_name', function(value) {
            if (value) {
                frm.set_value('focal_person_name', value.lead_name);
                frm.set_df_property("focal_person_name", "read_only", true);
            }
        toggle_fields(frm);    
        });
    },

    // When the "land_owner" field is changed
    land_owner: function(frm) {
        toggle_fields(frm);
    }
});

// Function to toggle the visibility of fields based on land_owner value
function toggle_fields(frm) {
    if (frm.doc.land_owner === "Self") {
        // Hide the focal person fields and set them to null
        frm.set_value("land_owner_name", frm.doc.focal_person_name);
        frm.set_df_property("focal_person_name", "hidden", true);
        frm.set_df_property("land_owner_name", "hidden", false);
        frm.set_df_property("land_owner_name", "read_only", true);
        frm.set_value("relation_with_fp", "");
        frm.set_df_property("relation_with_fp", "hidden", true);
        frm.set_df_property("land_owner_name", "reqd", false);
    } else if (frm.doc.land_owner === "Relative") {
        frm.set_df_property("land_owner_name", "hidden", false);
        frm.set_df_property("land_owner_name", "read_only", false);
        frm.set_df_property("focal_person_name", "hidden", false);
        frm.set_df_property("relation_with_fp", "hidden", false);
        frm.set_df_property("land_owner_name", "reqd", true);
    }
}
