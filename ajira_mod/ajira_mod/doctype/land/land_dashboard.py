# import frappe
# from frappe import _

# def get_data():
#     """Return data for Land dashboard showing linked Lead records"""
#     return {
#         'fieldname': 'focal_person',
#         'transactions': [
#             {
#                 'label': _('Lead Details'),
#                 'items': ['Lead']
#             }
#         ]
#     }

# @frappe.whitelist()
# def get_dashboard_data(doctype, docname):
#     """Get dashboard data for Land DocType"""
#     return {
#         'fieldname': 'focal_person',
#         'transactions': [
#             {
#                 'label': _('Lead Details'),
#                 'items': ['Lead']
#             }
#         ]
#     }
