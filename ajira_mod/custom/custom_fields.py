import frappe

def create_custom_field():
    if not frappe.db.exists("Custom Field", {"dt": "Quotation", "fieldname": "land"}):
        frappe.get_doc({
            "doctype": "Custom Field",
            "dt": "Quotation",
            "fieldname": "land",
            "label": "Land Detail",
            "fieldtype": "Link",
            "options": "Land",
            "insert_after": "valid_till"
        }).insert()
