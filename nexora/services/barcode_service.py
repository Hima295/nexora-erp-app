# -*- coding: utf-8 -*-
import frappe
import json
import os
import datetime
from pathlib import Path


class BarcodeService:
    BASE_DIR = frappe.get_app_path("nexora")
    BARCODE_DIR = os.path.join(BASE_DIR, "private", "barcodes")

    @staticmethod
    def get_items(filters=None):
        conditions = []
        values = []

        if filters:
            if filters.get("category"):
                conditions.append("item.item_group = %s")
                values.append(filters.get("category"))
            if filters.get("brand"):
                conditions.append("item.brand = %s")
                values.append(filters.get("brand"))
            if filters.get("supplier"):
                conditions.append(
                    "exists (select name from `tabItem Supplier` where parent = item.name and supplier = %s)"
                )
                values.append(filters.get("supplier"))
            if filters.get("warehouse"):
                conditions.append(
                    "exists (select name from `tabBin` where item_code = item.name and warehouse = %s)"
                )
                values.append(filters.get("warehouse"))
            if filters.get("item_code"):
                conditions.append("item.name like %s")
                values.append(f"%{filters.get('item_code')}%")
            if filters.get("item_name"):
                conditions.append("item.item_name like %s")
                values.append(f"%{filters.get('item_name')}%")
            if filters.get("low_stock"):
                conditions.append(
                    "exists (select name from `tabBin` where item_code = item.name and actual_qty <= reorder_level)"
                )
            if filters.get("without_barcode"):
                conditions.append(
                    "not exists (select name from `tabNexora Barcode Item` where item_code = item.name)"
                )

        where = " and ".join(conditions) if conditions else "1=1"
        query = f"""
            select item.name, item.item_code, item.item_name, item.item_group, item.brand,
                   item.standard_rate as selling_price, item.valuation_rate as purchase_price,
                   item.currency, item.description, item.image
            from `tabItem` item
            where {where} and item.disabled = 0
            order by item.item_code asc
        """
        return frappe.db.sql(query, values, as_dict=True)

    @staticmethod
    def get_item_details(item_code):
        item = frappe.get_doc("Item", item_code)
        barcode_doc = frappe.get_all(
            "Nexora Barcode Item",
            filters={"item_code": item_code},
            fields=["barcode", "barcode_type"],
            limit=1,
        )
        barcode = barcode_doc[0]["barcode"] if barcode_doc else None
        barcode_type = barcode_doc[0]["barcode_type"] if barcode_doc else "Code128"
        return {
            "item_code": item.item_code,
            "item_name": item.item_name,
            "arabic_name": item.get("arabic_name", ""),
            "standard_rate": item.standard_rate,
            "valuation_rate": item.valuation_rate,
            "currency": item.currency,
            "brand": item.brand,
            "image": item.image,
            "barcode": barcode,
            "barcode_type": barcode_type,
        }

    @staticmethod
    def get_templates(company=None):
        filters = {}
        if company:
            filters["company"] = company
        return frappe.get_all("Nexora Barcode Template", filters=filters, fields=["*"])

    @staticmethod
    def get_default_template(company=None):
        filters = {"is_default": 1}
        if company:
            filters["company"] = company
        return frappe.get_all("Nexora Barcode Template", filters=filters, fields=["*"], limit=1)

    @staticmethod
    def generate_barcodes_for_items(item_codes, company, barcode_type="Code128"):
        results = []
        for item_code in item_codes:
            existing = frappe.get_all("Nexora Barcode Item", filters={"item_code": item_code})
            if not existing:
                prefix = "G"
                last = frappe.db.get_value(
                    "Nexora Barcode Item",
                    {"company": company},
                    "barcode",
                    order_by="barcode desc",
                )
                if last:
                    try:
                        num = int(last.replace(prefix, "")) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                barcode = f"{prefix}{num:09d}"
                doc = frappe.new_doc("Nexora Barcode Item")
                doc.item_code = item_code
                doc.barcode = barcode
                doc.barcode_type = barcode_type
                doc.company = company
                doc.insert(ignore_permissions=True)
                results.append({"item_code": item_code, "barcode": barcode, "status": "created"})
            else:
                results.append({"item_code": item_code, "barcode": existing[0]["barcode"], "status": "exists"})
        frappe.db.commit()
        return results

    @staticmethod
    def create_print_job(data):
        doc = frappe.new_doc("Nexora Barcode Print Job")
        doc.job_name = data.get("job_name")
        doc.template = data.get("template")
        doc.print_type = data.get("print_type")
        doc.total_labels = data.get("total_labels", 0)
        doc.status = "Pending"
        doc.item_code = data.get("item_code")
        doc.item_name = data.get("item_name")
        doc.barcode = data.get("barcode")
        doc.printer_name = data.get("printer_name")
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return doc.name

    @staticmethod
    def get_print_history(filters=None):
        conditions = []
        values = []
        if filters:
            if filters.get("template"):
                conditions.append("template = %s")
                values.append(filters.get("template"))
            if filters.get("status"):
                conditions.append("status = %s")
                values.append(filters.get("status"))
            if filters.get("from_date"):
                conditions.append("print_date >= %s")
                values.append(filters.get("from_date"))
            if filters.get("to_date"):
                conditions.append("print_date <= %s")
                values.append(filters.get("to_date"))
        where = " and ".join(conditions) if conditions else "1=1"
        return frappe.db.sql(
            f"select * from `tabNexora Barcode Print Job` where {where} order by print_date desc",
            values,
            as_dict=True,
        )

    @staticmethod
    def save_template(data):
        if data.get("name"):
            doc = frappe.get_doc("Nexora Barcode Template", data.get("name"))
        else:
            doc = frappe.new_doc("Nexora Barcode Template")
        
        doc.template_name = data.get("template_name", doc.template_name)
        doc.label_size = data.get("label_size", doc.label_size)
        doc.barcode_type = data.get("barcode_type", doc.barcode_type)
        doc.orientation = data.get("orientation", doc.orientation)
        doc.company = data.get("company", doc.company)
        doc.visibility = data.get("visibility", doc.visibility)
        doc.is_default = data.get("is_default", 0)
        doc.show_logo = data.get("show_logo", 0)
        doc.show_barcode = data.get("show_barcode", 1)
        doc.show_qr = data.get("show_qr", 0)
        doc.show_arabic_name = data.get("show_arabic_name", 1)
        doc.show_english_name = data.get("show_english_name", 1)
        doc.show_item_code = data.get("show_item_code", 1)
        doc.show_selling_price = data.get("show_selling_price", 1)
        doc.show_purchase_price = data.get("show_purchase_price", 0)
        doc.show_currency = data.get("show_currency", 1)
        doc.show_brand = data.get("show_brand", 0)
        doc.show_warehouse = data.get("show_warehouse", 0)
        doc.show_batch = data.get("show_batch", 0)
        doc.show_serial = data.get("show_serial", 0)
        doc.show_expiry = data.get("show_expiry", 0)
        doc.show_custom_field = data.get("show_custom_field", 0)
        doc.custom_field_name = data.get("custom_field_name", "")
        
        doc.flags.ignore_permissions = True
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"success": True, "name": doc.name}

    @staticmethod
    def duplicate_template(template_name):
        if not frappe.db.exists("Nexora Barcode Template", template_name):
            return {"error": "Template not found"}
        original = frappe.get_doc("Nexora Barcode Template", template_name)
        doc = frappe.copy_doc(original)
        doc.template_name = original.template_name + " (Copy)"
        doc.is_default = 0
        doc.flags.ignore_permissions = True
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"success": True, "name": doc.name}

    @staticmethod
    def delete_template(template_name):
        if not frappe.db.exists("Nexora Barcode Template", template_name):
            return {"error": "Template not found"}
        frappe.delete_doc("Nexora Barcode Template", template_name, force=True, ignore_permissions=True)
        frappe.db.commit()
        return {"success": True}

    @staticmethod
    def render_label(template_name, item_code):
        template = frappe.get_doc("Nexora Barcode Template", template_name)
        item = frappe.get_doc("Item", item_code)
        
        fields = {}
        if template.show_item_code: fields.item_code = item.item_code
        if template.show_english_name: fields.item_name = item.item_name
        if template.show_arabic_name: fields.arabic_name = item.get("arabic_name", "")
        if template.show_selling_price: fields.standard_rate = item.standard_rate
        if template.show_purchase_price: fields.valuation_rate = item.valuation_rate
        if template.show_currency: fields.currency = item.currency
        if template.show_brand: fields.brand = item.brand
        if template.show_batch: fields.batch_no = ""
        if template.show_serial: fields.serial_no = ""
        
        fields.barcode = item.item_code
        fields.barcode_type = template.barcode_type
        
        return {
            "template": template_name,
            "item": item_code,
            "fields": fields,
            "label_size": template.label_size,
            "barcode_type": template.barcode_type
        }

    @staticmethod
    def export_labels(print_type, filters, template_name, export_format, batch_size):
        template = frappe.get_doc("Nexora Barcode Template", template_name)
        items = BarcodeService.get_items(filters)
        
        if batch_size and batch_size !== "unlimited":
            items = items[:int(batch_size)]
        
        return {
            "template": template_name,
            "export_format": export_format,
            "total_labels": len(items),
            "items": items,
            "label_size": template.label_size,
            "barcode_type": template.barcode_type
        }
