import frappe
from frappe import _
from erpnext.crm.doctype.lead.lead_dashboard import get_data as get_lead_data

def get_data(data=None):
    # Fetch the default Lead dashboard data
    data = get_lead_data() if data is None else data

    # Add Land Details to the transactions if not already added
    if "transactions" in data:
        land_transaction_exists = any(
            transaction.get("label") == _("Land Details") for transaction in data["transactions"]
        )
        if not land_transaction_exists:
            data["transactions"].append(
                {
                    "label": _("Land Details"),
                    "items": ["Land"]
                }
            )

        # Add Site Visit to the transactions if not already added
        site_visit_transaction_exists = any(
            transaction.get("label") == _("Site Visit") for transaction in data["transactions"]
        )
        if not site_visit_transaction_exists:
            data["transactions"].append(
                {
                    "label": _("Site Visit"),
                    "items": ["Site Visit"]
                }
            )

    # Ensure non_standard_fieldnames includes the custom linkage for Land and Site Visit
    if "non_standard_fieldnames" in data:
        data["non_standard_fieldnames"].update({
            "Land": "focal_person",
            "Site Visit": "focal_person"
        })
    else:
        data["non_standard_fieldnames"] = {
            "Land": "focal_person",
            "Site Visit": "focal_person"
        }

    return data
