/**
 * Nexora Print Engine
 * Browser-based print preview, batch printing, and export
 */
const NexoraPrintEngine = (function() {
    'use strict';

    let printWindow = null;

    function openPrintWindow() {
        if (printWindow && !printWindow.closed) {
            printWindow.focus();
            return printWindow;
        }
        printWindow = window.open('', '_blank', 'width=1200,height=800');
        return printWindow;
    }

    function renderLabelHTML(item, template, labelSizeMm, barcodeSvg, qrSvg) {
        const parts = labelSizeMm.split('x');
        const widthMm = parseInt(parts[0]);
        const heightMm = parseInt(parts[1]);
        const widthPx = widthMm * 3.78;
        const heightPx = heightMm * 3.78;
        const isA4 = labelSizeMm === 'a4';

        const showLogo = template.show_logo ? true : false;
        const showBarcode = template.show_barcode ? true : false;
        const showQr = template.show_qr ? true : false;
        const showArabic = template.show_arabic_name ? true : false;
        const showEnglish = template.show_english_name ? true : false;
        const showItemCode = template.show_item_code ? true : false;
        const showSellingPrice = template.show_selling_price ? true : false;
        const showPurchasePrice = template.show_purchase_price ? true : false;
        const showCurrency = template.show_currency ? true : false;
        const showBrand = template.show_brand ? true : false;
        const showWarehouse = template.show_warehouse ? true : false;
        const showBatch = template.show_batch ? true : false;
        const showSerial = template.show_serial ? true : false;
        const showExpiry = template.show_expiry ? true : false;

        let fields = [];
        if (showItemCode) fields.push(item.item_code || '');
        if (showEnglish) fields.push(item.item_name || '');
        if (showArabic) fields.push(item.arabic_name || '');
        if (showSellingPrice) fields.push((item.standard_rate || 0).toLocaleString() + ' ' + (item.currency || 'SDG'));
        if (showPurchasePrice) fields.push('Cost: ' + (item.valuation_rate || 0).toLocaleString() + ' ' + (item.currency || 'SDG'));
        if (showBrand && item.brand) fields.push(item.brand);
        if (showWarehouse) fields.push(item.warehouse || '');
        if (showBatch) fields.push(item.batch_no || '');
        if (showSerial) fields.push(item.serial_no || '');

        let barcodeHTML = '';
        if (showBarcode && barcodeSvg) {
            const svgWidth = Math.min(widthMm * 3.5, 200);
            barcodeHTML = '<div style="text-align:center; margin:1mm 0;">' + barcodeSvg + '</div>';
        }

        let qrHTML = '';
        if (showQr && qrSvg) {
            qrHTML = '<div style="text-align:center; margin:1mm 0;">' + qrSvg + '</div>';
        }

        let logoHTML = '';
        if (showLogo) {
            logoHTML = '<div style="text-align:center; margin-bottom:1mm;"><img src="/assets/nexora/icons/nexora_logo.svg" style="height:8mm; max-width:100%;" onerror="this.style.display=\'none\'"></div>';
        }

        let fieldsHTML = '';
        fields.forEach(function(f) {
            if (f) {
                fieldsHTML += '<div style="font-size:3.5mm; line-height:1.2; margin:0.5mm 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + f + '</div>';
            }
        });

        const labelStyle = isA4
            ? 'width:210mm; height:297mm; padding:10mm; box-sizing:border-box; border:0.5px solid #eee;'
            : 'width:' + widthMm + 'mm; height:' + heightMm + 'mm; padding:2mm; box-sizing:border-box; border:0.5px solid #eee;';

        return '<div class="nexora-print-label" style="' + labelStyle + '">' +
            logoHTML +
            fieldsHTML +
            barcodeHTML +
            qrHTML +
        '</div>';
    }

    function generateBarcodeSVG(type, value, widthMm) {
        const width = widthMm * 3.78;
        const height = 12;
        let svg = '';

        if (type === 'QR Code') {
            const moduleCount = value.length > 100 ? 25 : value.length > 50 ? 21 : 17;
            const moduleSize = Math.max(2, Math.floor((width - 20) / moduleCount));
            const size = moduleSize * moduleCount + 20;
            svg = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">';
            svg += '<rect x="0" y="0" width="' + size + '" height="' + size + '" fill="#fff"/>';
            
            let hash = 0;
            for (let i = 0; i < value.length; i++) {
                hash = ((hash << 5) - hash) + value.charCodeAt(i);
                hash = hash & hash;
            }

            const ox = 10, oy = 10;
            for (let y = 0; y < 7; y++) {
                for (let x = 0; x < 7; x++) {
                    if (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) {
                        svg += '<rect x="' + (ox + x * moduleSize) + '" y="' + (oy + y * moduleSize) + '" width="' + moduleSize + '" height="' + moduleSize + '" fill="#000"/>';
                    }
                }
            }
            for (let y = 0; y < moduleCount; y++) {
                for (let x = 0; x < moduleCount; x++) {
                    if ((x < 8 && y < 8) || (x >= moduleCount - 8 && y < 8) || (x < 8 && y >= moduleCount - 8)) continue;
                    const h = Math.abs(hash * (x + 1) * (y + 1)) % 3;
                    if (h > 0) {
                        svg += '<rect x="' + (ox + x * moduleSize) + '" y="' + (oy + y * moduleSize) + '" width="' + moduleSize + '" height="' + moduleSize + '" fill="#000"/>';
                    }
                }
            }
            svg += '</svg>';
        } else {
            const patterns = {
                'Code128': '0001101000',
                'Code39': '101001101101',
                'EAN13': '0001101',
                'EAN8': '0001101',
                'UPC': '0001101'
            };
            const pattern = patterns[type] || patterns['Code128'];
            const barWidth = Math.max(1, Math.floor((width - 20) / (value.length * 8)));
            const totalWidth = value.length * 8 * barWidth + 20;
            svg = '<svg width="' + totalWidth + '" height="' + height + '" viewBox="0 0 ' + totalWidth + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">';
            svg += '<rect x="0" y="0" width="' + totalWidth + '" height="' + height + '" fill="#fff"/>';
            
            let x = 10;
            for (let i = 0; i < value.length; i++) {
                const charCode = value.charCodeAt(i);
                const charPattern = patterns[type] || patterns['Code128'];
                for (let j = 0; j < 8; j++) {
                    if ((charCode + j) % 2 === 0) {
                        svg += '<rect x="' + x + '" y="2" width="' + barWidth + '" height="' + (height - 4) + '" fill="#000"/>';
                    }
                    x += barWidth;
                }
            }
            svg += '<text x="' + (totalWidth / 2) + '" y="' + (height - 2) + '" text-anchor="middle" font-size="9" font-family="Arial" fill="#000">' + value + '</text>';
            svg += '</svg>';
        }

        return svg;
    }

    function renderPrintPreview(containerId, items, template, labelSize, batchSize) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'nexora-print-preview-grid';

        const isA4 = labelSize === 'a4' || template.label_size === 'a4';

        let displayItems = items;
        if (batchSize && batchSize !== 'unlimited' && items.length > parseInt(batchSize)) {
            displayItems = items.slice(0, parseInt(batchSize));
        }

        if (isA4) {
            wrapper.style.display = 'block';
            wrapper.style.background = 'white';
            wrapper.style.padding = '0';
            displayItems.forEach(function(item) {
                const barcodeSvg = generateBarcodeSVG(item.barcode_type || template.barcode_type, item.barcode || item.item_code, 30);
                const html = renderLabelHTML(item, template, 'a4', barcodeSvg, '');
                const labelDiv = document.createElement('div');
                labelDiv.innerHTML = html;
                labelDiv.firstChild.style.marginBottom = '5mm';
                wrapper.appendChild(labelDiv.firstChild);
            });
        } else {
            wrapper.style.display = 'grid';
            wrapper.style.gap = '3mm';
            wrapper.style.padding = '5mm';
            wrapper.style.background = '#e9ecef';

            displayItems.forEach(function(item) {
                const barcodeSvg = generateBarcodeSVG(item.barcode_type || template.barcode_type, item.barcode || item.item_code, 30);
                const html = renderLabelHTML(item, template, labelSize || template.label_size || '40x20', barcodeSvg, '');
                wrapper.innerHTML += html;
            });
        }

        container.appendChild(wrapper);
    }

    function printLabels(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const win = openPrintWindow();
        if (!win) return;

        win.document.write('<html><head><title>Print Labels</title>');
        win.document.write('<link rel="stylesheet" href="/assets/frappe/css/frappe-web.css">');
        win.document.write('<link rel="stylesheet" href="/assets/nexora/css/barcode_generator.css">');
        win.document.write('<style>');
        win.document.write('@page { size: auto; margin: 0; }');
        win.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; }');
        win.document.write('.nexora-print-preview-grid { display: block; padding: 0; background: white; }');
        win.document.write('.nexora-print-label { border: none; margin-bottom: 3mm; page-break-inside: avoid; }');
        win.document.write('@media print { .nexora-print-label { page-break-inside: avoid; } }');
        win.document.write('</style>');
        win.document.write('</head><body>');
        win.document.write(container.innerHTML);
        win.document.write('</body></html>');
        win.document.close();

        setTimeout(function() {
            win.focus();
            win.print();
        }, 500);
    }

    function exportPDF(containerId, filename) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const win = openPrintWindow();
        if (!win) return;

        win.document.write('<html><head><title>Export PDF</title>');
        win.document.write('<link rel="stylesheet" href="/assets/frappe/css/frappe-web.css">');
        win.document.write('<style>');
        win.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; }');
        win.document.write('.nexora-print-preview-grid { display: block; padding: 0; background: white; }');
        win.document.write('</style>');
        win.document.write('</head><body>' + container.innerHTML + '</body></html>');
        win.document.close();

        setTimeout(function() {
            win.focus();
            win.print();
        }, 500);
    }

    function exportSVG(containerId, filename) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const svgEls = container.querySelectorAll('svg');
        if (svgEls.length === 0) {
            alert('No SVG barcodes to export');
            return;
        }

        const svg = svgEls[0].cloneNode(true);
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'labels.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportPNG(containerId, filename) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const svgEls = container.querySelectorAll('svg');
        if (svgEls.length === 0) {
            alert('No barcodes to export');
            return;
        }

        const svgString = new XMLSerializer().serializeToString(svgEls[0]);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = 1200;
        canvas.height = 800;
        
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        img.onload = function() {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 50, 50, 300, 150);
            canvas.toBlob(function(pngBlob) {
                const pngUrl = URL.createObjectURL(pngBlob);
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = filename || 'labels.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(pngUrl);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
        img.src = url;
    }

    return {
        renderPreview: renderPrintPreview,
        print: printLabels,
        exportPDF: exportPDF,
        exportSVG: exportSVG,
        exportPNG: exportPNG,
        openPrintWindow: openPrintWindow,
        generateBarcodeSVG: generateBarcodeSVG
    };
})();
