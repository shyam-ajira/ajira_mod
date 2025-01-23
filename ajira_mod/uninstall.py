import frappe

def before_uninstall():
    try:
        # Delete custom fields from Frappe's Custom Field doctype
        custom_fields = frappe.get_all("Custom Field", filters={"dt": "Quotation"})
        # frappe.msgprint("Custom fields and columns deleted successfully.")
        for field in custom_fields:
            frappe.delete_doc("Custom Field", field.name, force=True)

    except Exception as e:
        frappe.log_error(message=f"Error in before_uninstall: {str(e)}", title="Uninstall Error")
        frappe.throw(f"An error occurred while deleting custom fields and columns: {str(e)}")