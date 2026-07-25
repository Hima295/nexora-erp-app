# -*- coding: utf-8 -*-
import frappe
import json


def execute():
    """Creates/updates the Nexora Inventory Custom HTML Block for Nexora Pulse workspace"""
    block_name = "Nexora Inventory"
    
    if frappe.db.exists("Custom HTML Block", block_name):
        block = frappe.get_doc("Custom HTML Block", block_name)
    else:
        block = frappe.new_doc("Custom HTML Block")
        block.name = block_name
    block.html = """
<div id="nexora-inventory-container" style="padding: 15px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <label for="nexora-company-select" style="font-weight: bold; margin: 0;">Company:</label>
            <select id="nexora-company-select" class="btn btn-sm btn-default" style="min-width: 200px;">
                <option value="">Loading...</option>
            </select>
        </div>
        <button id="nexora-refresh-btn" class="btn btn-sm btn-default">
            <i class="fa fa-refresh"></i> Refresh Data
        </button>
    </div>
    
    <div id="nexora-system-connection" style="margin-bottom: 20px;">
        <h4 style="margin-top: 0;"><b>System Connection</b></h4>
        <div class="row">
            <div class="col-md-3"><div class="stat-box"><h4>Connection Status</h4><p id="nexora-conn-status">--</p></div></div>
            <div class="col-md-3"><div class="stat-box"><h4>Active Company</h4><p id="nexora-conn-company">--</p></div></div>
            <div class="col-md-3"><div class="stat-box"><h4>Last Refresh</h4><p id="nexora-conn-time">--</p></div></div>
            <div class="col-md-3"><div class="stat-box"><h4>Warehouses</h4><p id="nexora-conn-warehouses">--</p></div></div>
            <div class="col-md-3"><div class="stat-box"><h4>Items</h4><p id="nexora-conn-items">--</p></div></div>
        </div>
    </div>
    
    <div id="nexora-inventory-section">
        <h4 style="margin-top: 20px;"><b>Inventory</b></h4>
        <div id="nexora-inventory-loading" style="text-align: center; padding: 20px;">
            <i class="fa fa-spinner fa-spin"></i> Loading live inventory data...
        </div>
        <div id="nexora-inventory-content" style="display: none;"></div>
    </div>
</div>
"""
    block.script = """
const root = root_element;

function refreshNexoraData(showLoading) {
    const loading = root.getElementById('nexora-inventory-loading');
    const content = root.getElementById('nexora-inventory-content');
    const statusEl = root.getElementById('nexora-conn-status');
    const companyEl = root.getElementById('nexora-conn-company');
    const timeEl = root.getElementById('nexora-conn-time');
    const warehousesEl = root.getElementById('nexora-conn-warehouses');
    const itemsEl = root.getElementById('nexora-conn-items');
    const refreshBtn = root.getElementById('nexora-refresh-btn');

    if (showLoading) {
        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
    }
    if (refreshBtn) refreshBtn.disabled = true;

    frappe.call({
        method: 'nexora.api.v1.get_system_connection',
        type: 'GET',
        cache: false,
        callback: function(r) {
            const conn = r.message || {};
            if (statusEl) statusEl.innerHTML = conn.status || 'Unknown';
            if (companyEl) companyEl.innerHTML = conn.active_company || 'N/A';
            if (timeEl) timeEl.innerHTML = new Date().toLocaleString();
            if (warehousesEl) warehousesEl.innerHTML = conn.warehouses_count != null ? conn.warehouses_count : '--';
            if (itemsEl) itemsEl.innerHTML = conn.items_count != null ? conn.items_count : '--';

            frappe.call({
                method: 'nexora.api.v1.get_inventory_data',
                type: 'GET',
                cache: false,
                callback: function(r2) {
                    if (loading) loading.style.display = 'none';
                    if (content) content.style.display = 'block';
                    if (refreshBtn) refreshBtn.disabled = false;

                    if (r2.message && r2.message.status === 'Connected') {
                        const data = r2.message;
                        let html = '';

                        if (data.inventory_table && data.inventory_table.length > 0) {
                            html += '<table class="table table-bordered table-striped">';
                            html += '<thead><tr><th>Item Code</th><th>Item Name</th><th>Warehouse</th><th>Available Qty</th><th>Reserved Qty</th><th>Valuation Rate</th><th>Inventory Value</th><th>Selling Price</th><th>Gross Profit</th><th>Gross Profit %</th><th>Stock Status</th></tr></thead>';
                            html += '<tbody>';
                            let totalQty = 0;
                            let grandInventoryValue = 0;
                            data.inventory_table.forEach(function(row) {
                                const availableQty = row.available_qty || 0;
                                const reservedQty = row.reserved_qty || 0;
                                const valuationRate = row.valuation_rate || 0;
                                const stockValue = row.stock_value || 0;
                                const sellingPrice = row.selling_price || 0;
                                const grossProfit = sellingPrice > 0 ? (sellingPrice - valuationRate) : 0;
                                const grossProfitPct = sellingPrice > 0 ? ((grossProfit / sellingPrice) * 100) : 0;

                                html += '<tr>';
                                html += '<td>' + (row.item_code || '') + '</td>';
                                html += '<td>' + (row.item_name || '') + '</td>';
                                html += '<td>' + (row.warehouse || '') + '</td>';
                                html += '<td>' + availableQty + '</td>';
                                html += '<td>' + reservedQty + '</td>';
                                html += '<td>' + valuationRate + '</td>';
                                html += '<td>' + stockValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' SDG</td>';
                                html += '<td>' + (sellingPrice > 0 ? sellingPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' SDG' : '—') + '</td>';
                                html += '<td>' + (grossProfit > 0 ? grossProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' SDG' : '—') + '</td>';
                                html += '<td>' + (grossProfitPct > 0 ? grossProfitPct.toFixed(2) + '%' : '—') + '</td>';
                                html += '<td>' + (row.stock_status || '') + '</td>';
                                html += '</tr>';
                                totalQty += availableQty;
                                grandInventoryValue += stockValue;
                            });
                            html += '</tbody>';
                            html += '<tfoot><tr>';
                            html += '<td colspan="3"><b>Total Qty</b></td>';
                            html += '<td><b>' + totalQty + '</b></td>';
                            html += '<td colspan="2"><b>Grand Inventory Value</b></td>';
                            html += '<td colspan="3"><b>' + grandInventoryValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' SDG</b></td>';
                            html += '</tr></tfoot>';
                            html += '</table>';
                        } else {
                            html += '<p style="color: #888;">No inventory records found for the current company.</p>';
                        }

                        if (content) content.innerHTML = html;
                    } else {
                        if (content) content.innerHTML = '<p style=\"color: #d00;\">Unable to load inventory data.</p>';
                    }
                }
            });
        }
    });
}

function refreshNexoraNumberCards() {
    const numberWidgets = [];
    document.querySelectorAll('.number-widget-box').forEach(function(w) {
        const numberEl = w.querySelector('.number');
        const titleEl = w.querySelector('.widget-title');
        if (numberEl) {
            numberWidgets.push({
                widget: w,
                numberEl: numberEl,
                title: titleEl ? titleEl.innerText.trim().toLowerCase() : ''
            });
        }
    });

    const cardApis = [
        { method: 'nexora.api.v1.get_number_card_items', key: 'total items', isCurrency: false },
        { method: 'nexora.api.v1.get_number_card_warehouses', key: 'total warehouses', isCurrency: false },
        { method: 'nexora.api.v1.get_number_card_stock_qty', key: 'total stock quantity', isCurrency: false },
        { method: 'nexora.api.v1.get_number_card_inventory_value', key: 'total inventory value', isCurrency: true }
    ];

    function updateNextCard() {
        if (cardApis.length === 0) {
            return;
        }
        const api = cardApis.shift();
        const widget = numberWidgets.find(w => w.title === api.key);
        frappe.call({
            method: api.method,
            type: 'GET',
            cache: false,
            callback: function(r) {
                const val = r.message || '--';
                if (widget && widget.numberEl) {
                    if (api.isCurrency && typeof val === 'string' && val.indexOf(' SDG') === -1) {
                        const num = parseFloat(val);
                        if (!isNaN(num)) {
                            widget.numberEl.innerHTML = num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' SDG';
                        } else {
                            widget.numberEl.innerHTML = val;
                        }
                    } else {
                        widget.numberEl.innerHTML = val;
                    }
                }
                updateNextCard();
            },
            error: function() {
                if (widget && widget.numberEl) {
                    widget.numberEl.innerHTML = '--';
                }
                updateNextCard();
            }
        });
    }

    updateNextCard();
}

function loadCompanies() {
    const select = root.getElementById('nexora-company-select');
    if (!select) return;

    frappe.call({
        method: 'nexora.api.v1.get_companies',
        type: 'GET',
        callback: function(r) {
            const companies = r.message && r.message.companies ? r.message.companies : [];
            select.innerHTML = '';

            if (companies.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.text = 'No companies';
                select.appendChild(option);
                return;
            }

            companies.forEach(function(company) {
                const option = document.createElement('option');
                option.value = company;
                option.text = company;
                select.appendChild(option);
            });

            frappe.call({
                method: 'nexora.api.v1.get_system_connection',
                type: 'GET',
                callback: function(r2) {
                    const conn = r2.message || {};
                    const active = conn.active_company || '';
                    if (active && companies.includes(active)) {
                        select.value = active;
                    }
                }
            });
        }
    });
}

function onCompanyChange() {
    const select = root.getElementById('nexora-company-select');
    if (!select) return;

    const company = select.value;
    if (!company) return;

    frappe.call({
        method: 'nexora.api.v1.set_active_company',
        type: 'POST',
        args: { company_name: company },
        callback: function(r) {
            refreshNexoraData(true);
            refreshNexoraNumberCards();
        }
    });
}

const companySelect = root.getElementById('nexora-company-select');
if (companySelect) {
    companySelect.addEventListener('change', onCompanyChange);
}

const refreshBtn = root.getElementById('nexora-refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
        refreshNexoraData(true);
        refreshNexoraNumberCards();
    });
}

loadCompanies();
refreshNexoraData(false);
refreshNexoraNumberCards();
"""
    block.style = """
.stat-box {
    background: #f8f9fa;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    border: 1px solid #dee2e6;
}
.stat-box h4 {
    margin: 0 0 10px 0;
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
}
.stat-box p {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}
"""
    block.save(ignore_permissions=True)
    frappe.db.commit()
    
    # Update Nexora Pulse workspace
    if frappe.db.exists("Workspace", "Nexora Pulse"):
        workspace = frappe.get_doc("Workspace", "Nexora Pulse")
        
        has_block = False
        for cb in workspace.custom_blocks:
            if cb.custom_block_name == block_name:
                has_block = True
                break
        
        if not has_block:
            workspace.append("custom_blocks", {
                "custom_block_name": block_name,
                "label": "Inventory"
            })
        
        workspace.flags.ignore_version = True
        workspace.save(ignore_permissions=True)
        frappe.db.commit()
    
    # Force reload workspace to pick up any JSON changes
    try:
        frappe.reload_doc("nexora.nexora_core", "workspace", "nexora_pulse", force=True)
        frappe.db.commit()
    except Exception:
        pass
    
    # Ensure shortcut blocks exist in workspace content (ERPNext renders from content, not just child tables)
    try:
        ws = frappe.get_doc("Workspace", "Nexora Pulse")
        content = json.loads(ws.content or "[]")
        shortcut_blocks = [
            {"id": "np-sc-1", "type": "shortcut", "data": {"card_name": "Items", "label": "Items", "type": "DocType", "link_to": "Item", "color": "#FF6B6B", "icon": "fa fa-cube", "doc_view": "List"}},
            {"id": "np-sc-2", "type": "shortcut", "data": {"card_name": "Warehouses", "label": "Warehouses", "type": "DocType", "link_to": "Warehouse", "color": "#4ECDC4", "icon": "fa fa-warehouse", "doc_view": "List"}},
            {"id": "np-sc-3", "type": "shortcut", "data": {"card_name": "Stock Entry", "label": "Stock Entry", "type": "DocType", "link_to": "Stock Entry", "color": "#45B7D1", "icon": "fa fa-arrow-right", "doc_view": "List"}},
            {"id": "np-sc-4", "type": "shortcut", "data": {"card_name": "Material Request", "label": "Material Request", "type": "DocType", "link_to": "Material Request", "color": "#96CEB4", "icon": "fa fa-shopping-cart", "doc_view": "List"}},
            {"id": "np-sc-5", "type": "shortcut", "data": {"card_name": "Suppliers", "label": "Suppliers", "type": "DocType", "link_to": "Supplier", "color": "#85C1E9", "icon": "fa fa-truck", "doc_view": "List"}},
            {"id": "np-sc-6", "type": "shortcut", "data": {"card_name": "Purchase Orders", "label": "Purchase Orders", "type": "DocType", "link_to": "Purchase Order", "color": "#F7DC6F", "icon": "fa fa-file-text", "doc_view": "List"}},
            {"id": "np-sc-7", "type": "shortcut", "data": {"card_name": "Sales Orders", "label": "Sales Orders", "type": "DocType", "link_to": "Sales Order", "color": "#BB8FCE", "icon": "fa fa-file-text", "doc_view": "List"}},
            {"id": "np-sc-8", "type": "shortcut", "data": {"card_name": "Purchase Receipt", "label": "Purchase Receipt", "type": "DocType", "link_to": "Purchase Receipt", "color": "#DDA0DD", "icon": "fa fa-check", "doc_view": "List"}},
            {"id": "np-sc-9", "type": "shortcut", "data": {"card_name": "Delivery Note", "label": "Delivery Note", "type": "DocType", "link_to": "Delivery Note", "color": "#98D8C8", "icon": "fa fa-truck", "doc_view": "List"}},
            {"id": "np-sc-10", "type": "shortcut", "data": {"card_name": "Customers", "label": "Customers", "type": "DocType", "link_to": "Customer", "color": "#F1948A", "icon": "fa fa-user", "doc_view": "List"}},
        ]
        
        has_shortcuts = any(b.get("type") == "shortcut" for b in content)
        if not has_shortcuts:
            new_content = []
            for block in content:
                new_content.append(block)
                if block.get("type") == "header" and "Executive KPIs" in block.get("data", {}).get("text", ""):
                    new_content.extend(shortcut_blocks)
            ws.content = json.dumps(new_content)
            ws.flags.ignore_version = True
            ws.save(ignore_permissions=True)
            frappe.db.commit()
    except Exception:
        pass
