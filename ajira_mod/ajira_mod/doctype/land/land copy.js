// Copyright (c) 2025, Ajira and contributors
// For license information, please see license.txt

frappe.ui.form.on('Land', {
    // When the form is loaded or refreshed
    refresh(frm) {
        // Fetch the lead_name from the Lead doctype and set it to focal_person_name
        frappe.db.get_value('Lead', frm.doc.focal_person, 'lead_name', function(value) {
            if (value) {
                frm.add_fetch('focal_person', 'lead_name', 'focal_person_name');
                frm.set_df_property('focal_person_name', 'read_only', true);
            }
            toggle_fields(frm);
        });

        // Set query for district field
        frm.set_query('district', function() {
            return {
                filters: {
                    active: 1 // Use 'active' instead of 'is_active'
                }
            };
        });

        // Ensure the area sections toggle based on unit_type value
        if (frm.doc.unit_type) {
            frm.trigger('toggle_area_sections');
        } else {
            // Hide both area-specific sections if no value is selected
            frm.set_df_property('rapd_section', 'hidden', 1);
            frm.set_df_property('bkd_section', 'hidden', 1);
        }

        // Trigger the calculation when the form is refreshed
        calculate_land_area(frm);
    },

    // When the "land_owner" field is changed
    land_owner(frm) {
        toggle_fields(frm);
    },

    // When the "district" field is changed
    district(frm) {
        if (frm.doc.district) {
            // Clear the Municipality field
            frm.set_value('municipality', null);

            // Set a dynamic query on the Municipality field based on selected District
            frm.set_query('municipality', function() {
                return {
                    filters: {
                        district: frm.doc.district,
                        active: 1 // Ensure only active municipalities are shown
                    }
                };
            });
        } else {
            // Clear the Municipality field and remove query filter
            frm.set_value('municipality', null);
            frm.set_query('municipality', function() {
                return {};
            });
            console.warn("District is not selected. Municipality dropdown cleared.");
        }
    },

    // Trigger when unit_type (Area Type) changes
    unit_type(frm) {
        // Clear all area-related fields
        frm.trigger('clear_area_fields');

        // Trigger the toggle for area sections
        frm.trigger('toggle_area_sections');
    },

    // Toggle the visibility of area-specific sections
    toggle_area_sections(frm) {
        if (frm.doc.unit_type === "Hilly Area") {
            frm.set_df_property('rapd_section', 'hidden', 0);
            frm.set_df_property('bkd_section', 'hidden', 1);
        } else if (frm.doc.unit_type === "Terai Area") {
            frm.set_df_property('rapd_section', 'hidden', 1);
            frm.set_df_property('bkd_section', 'hidden', 0);
        } else {
            // Hide both sections if no type is selected
            frm.set_df_property('rapd_section', 'hidden', 1);
            frm.set_df_property('bkd_section', 'hidden', 1);
        }

        // Ensure the Square Feet/Meter section is always visible
        frm.set_df_property('sq_feet_meter_section', 'hidden', 0);
    },

    // Clear all area-related fields
    clear_area_fields(frm) {
        // Clear fields for R-A-P-D (Hilly Area)
        frm.set_value('ropani', null);
        frm.set_value('aana', null);
        frm.set_value('paisa', null);
        frm.set_value('daam', null);

        // Clear fields for B-K-D (Terai Area)
        frm.set_value('bigha', null);
        frm.set_value('kattha', null);
        frm.set_value('dhur', null);

        // Clear fields for Square Feet/Meter
        frm.set_value('sq_feet', null);
        frm.set_value('sq_mtr', null);
    },

    // Trigger calculations when R-A-P-D fields change
    ropani(frm) {
        frm.trigger('calculate_area');
    },
    aana(frm) {
        frm.trigger('calculate_area');
    },
    paisa(frm) {
        frm.trigger('calculate_area');
    },
    daam(frm) {
        frm.trigger('calculate_area');
    },

    // Calculate area in square feet and square meters
    calculate_area(frm) {
        // Get input values
        let ropani = frm.doc.ropani || 0;
        let aana = frm.doc.aana || 0;
        let paisa = frm.doc.paisa || 0;
        let daam = frm.doc.daam || 0;

        // Calculate total Daam
        let total_daam = (ropani * 256) + (aana * 16) + (paisa * 4) + daam;

        // Calculate Square Feet from Daam
        let calculated_sq_feet = total_daam * 21.39;

        // Calculate Square Meter from Square Feet
        let calculated_sq_mtr = calculated_sq_feet / 10.7639;

        // Set calculated values
        frm.set_value('sq_feet', calculated_sq_feet.toFixed(2));
        frm.set_value('sq_mtr', calculated_sq_mtr.toFixed(2));
    },

    // Trigger calculations for B-K-D fields
    bigha(frm) {
        calculate_land_area(frm);
    },
    kattha(frm) {
        calculate_land_area(frm);
    },
    dhur(frm) {
        calculate_land_area(frm);
    },

    // Trigger reverse calculations for square feet and square meter
    sq_feet(frm) {
        calculate_reverse(frm);
    },
    sq_mtr(frm) {
        calculate_reverse(frm);
    }
});

// Function to calculate total area from B-K-D fields
function calculate_land_area(frm) {
    // Conversion factors
    const kattha_to_sqft = 3645;              // 1 Kattha = 3645 Square Feet
    const bigha_to_sqft = kattha_to_sqft * 20; // 1 Bigha = 20 Kattha
    const dhur_to_sqft = kattha_to_sqft / 20;  // 1 Dhur = 1/20 Kattha
    const sqft_to_sqm = 0.092903;             // Conversion factor for square feet to square meter

    // Input values
    let bigha = frm.doc.bigha || 0;
    let kattha = frm.doc.kattha || 0;
    let dhur = frm.doc.dhur || 0;

    // Calculate total square feet
    let total_sqft = (bigha * bigha_to_sqft) +
                     (kattha * kattha_to_sqft) +
                     (dhur * dhur_to_sqft);

    // Calculate square meter
    let total_sqm = total_sqft * sqft_to_sqm;

    // Update fields in the form
    frm.set_value('sq_feet', total_sqft);
    frm.set_value('sq_mtr', total_sqm.toFixed(2));
}

// Function to calculate reverse conversions from square feet and square meter
function calculate_reverse(frm) {
    // Conversion factors
    const kattha_to_sqft = 3645;              // 1 Kattha = 3645 Square Feet
    const bigha_to_sqft = kattha_to_sqft * 20; // 1 Bigha = 20 Kattha
    const dhur_to_sqft = kattha_to_sqft / 20;  // 1 Dhur = 1/20 Kattha
    const sqft_to_sqm = 0.092903;             // Conversion factor for square feet to square meter

    // Input values
    let sqft = frm.doc.sq_feet || 0;
    let sqm = frm.doc.sq_mtr || 0;

    // If square feet are entered, calculate reverse
    if (sqft > 0) {
        let total_sqft = sqft;

        // Calculate square meter
        let total_sqm = total_sqft * sqft_to_sqm;

        // Convert square feet to bigha, kattha, and dhur
        let bigha = Math.floor(total_sqft / bigha_to_sqft);
        total_sqft -= bigha * bigha_to_sqft;

        let kattha = Math.floor(total_sqft / kattha_to_sqft);
        total_sqft -= kattha * kattha_to_sqft;

        let dhur = total_sqft / dhur_to_sqft;

        // Update fields
        frm.set_value('sq_mtr', total_sqm.toFixed(2));
        frm.set_value('bigha', bigha);
        frm.set_value('kattha', kattha);
        frm.set_value('dhur', dhur.toFixed(2));
    }
    // If square meter is entered, calculate reverse
    else if (sqm > 0) {
        let total_sqm = sqm;

        // Convert square meter to square feet
        let total_sqft = total_sqm / sqft_to_sqm;

        // Convert square feet to bigha, kattha, and dhur
        let bigha = Math.floor(total_sqft / bigha_to_sqft);
        total_sqft -= bigha * bigha_to_sqft;

        let kattha = Math.floor(total_sqft / kattha_to_sqft);
        total_sqft -= kattha * kattha_to_sqft;

        let dhur = total_sqft / dhur_to_sqft;

        // Update fields
        frm.set_value('sq_feet', total_sqft);
        frm.set_value('bigha', bigha);
        frm.set_value('kattha', kattha);
        frm.set_value('dhur', dhur.toFixed(2));
    }
}

// Function to toggle the visibility of fields based on land_owner value
function toggle_fields(frm) {
    if (frm.doc.land_owner === 'Self') {
        // Hide the focal person fields and set them to null
        frm.set_value('land_owner_name', frm.doc.focal_person_name);
        frm.set_df_property('focal_person_name', 'hidden', true);
        frm.set_df_property('land_owner_name', 'hidden', false);
        frm.set_df_property('land_owner_name', 'read_only', true);
        frm.set_value('relation_with_fp', '');
        frm.set_df_property('relation_with_fp', 'hidden', true);
        frm.set_df_property('land_owner_name', 'reqd', false);
    } else if (frm.doc.land_owner === 'Relative') {
        frm.set_df_property('land_owner_name', 'hidden', false);
        frm.set_df_property('land_owner_name', 'read_only', false);
        frm.set_df_property('focal_person_name', 'hidden', false);
        frm.set_df_property('relation_with_fp', 'hidden', false);
        frm.set_df_property('land_owner_name', 'reqd', true);
    }
}
