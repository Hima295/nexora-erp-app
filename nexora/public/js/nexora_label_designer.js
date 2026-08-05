/**
 * Nexora Label Designer
 * Professional drag-and-drop label designer with live preview
 */
const NexoraLabelDesigner = (function() {
    'use strict';

    let container = null;
    let preview = null;
    let components = [];
    let selectedComponent = null;
    let isDragging = false;
    let isResizing = false;
    let dragOffset = { x: 0, y: 0 };
    let currentLabelSize = '40x20';
    let labelWidthMm = 40;
    let labelHeightMm = 20;
    let templateName = '';
    let company = '';
    let autoFitEnabled = true;
    let saveCallback = null;
    let snapToGrid = true;
    let gridSize = 1;
    let alignmentGuides = [];
    let isRtl = false;

    const MM_TO_PX = 3.78;

    function init(containerId, previewId, options) {
        container = document.getElementById(containerId);
        preview = document.getElementById(previewId);
        if (!container || !preview) return;

        options = options || {};
        templateName = options.templateName || '';
        company = options.company || '';
        autoFitEnabled = options.autoFit !== undefined ? options.autoFit : true;
        saveCallback = options.onSave || null;
        isRtl = options.rtl || false;

        if (options.components && Array.isArray(options.components)) {
            components = options.components.map(function(c) {
                return Object.assign({}, c, {
                    x: c.x || 0,
                    y: c.y || 0,
                    width: c.width || 50,
                    height: c.height || 20,
                    fontSize: c.fontSize || 10,
                    fontWeight: c.fontWeight || 'normal'
                });
            });
        } else {
            components = [
                { id: 'item_code', type: 'text', label: 'Item Code', x: 2, y: 2, width: 30, height: 5, fontSize: 8, fontWeight: 'bold', content: '{item_code}' },
                { id: 'item_name', type: 'text', label: 'Item Name', x: 2, y: 8, width: 30, height: 5, fontSize: 7, fontWeight: 'normal', content: '{item_name}' },
                { id: 'barcode', type: 'barcode', label: 'Barcode', x: 2, y: 14, width: 30, height: 8, barcodeType: 'Code128', content: '{barcode}' }
            ];
        }

        renderDesigner();
        renderPreview();
        attachEvents();
    }

    function snap(value) {
        if (!snapToGrid) return value;
        return Math.round(value / gridSize) * gridSize;
    }

    function showAlignmentGuides(x, y, width, height) {
        clearAlignmentGuides();
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const designerWidth = labelWidthMm;
        const designerHeight = labelHeightMm;

        const guides = [];

        if (Math.abs(centerX - designerWidth / 2) < 0.5) {
            guides.push({ type: 'vertical', position: 50 });
        }
        if (Math.abs(centerY - designerHeight / 2) < 0.5) {
            guides.push({ type: 'horizontal', position: 50 });
        }
        if (Math.abs(x) < 0.5) {
            guides.push({ type: 'vertical', position: 0 });
        }
        if (Math.abs(y) < 0.5) {
            guides.push({ type: 'horizontal', position: 0 });
        }
        if (Math.abs(x + width - designerWidth) < 0.5) {
            guides.push({ type: 'vertical', position: 100 });
        }
        if (Math.abs(y + height - designerHeight) < 0.5) {
            guides.push({ type: 'horizontal', position: 100 });
        }

        const designerArea = document.getElementById('nbc-designer-area');
        if (!designerArea) return;

        guides.forEach(function(guide) {
            const el = document.createElement('div');
            el.className = 'nexora-alignment-guide ' + guide.type;
            if (guide.type === 'vertical') {
                el.style.left = guide.position + '%';
            } else {
                el.style.top = guide.position + '%';
            }
            designerArea.appendChild(el);
            alignmentGuides.push(el);
        });
    }

    function clearAlignmentGuides() {
        alignmentGuides.forEach(function(el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        alignmentGuides = [];
    }

    function renderDesigner() {
        container.innerHTML = '';

        const toolbar = document.createElement('div');
        toolbar.className = 'nexora-barcode-toolbar';
        if (isRtl) toolbar.setAttribute('dir', 'rtl');
        toolbar.innerHTML = '<strong>' + (isRtl ? 'المكونات' : 'Components:') + '</strong> ';

        const addableComponents = [
            { type: 'text', label: isRtl ? 'نص' : 'Text' },
            { type: 'barcode', label: isRtl ? 'باركود' : 'Barcode' },
            { type: 'qr', label: isRtl ? 'QR' : 'QR Code' },
            { type: 'image', label: isRtl ? 'شعار' : 'Logo' },
            { type: 'price', label: isRtl ? 'السعر' : 'Price' }
        ];

        addableComponents.forEach(function(comp) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-primary';
            btn.textContent = '+ ' + comp.label;
            btn.onclick = function() {
                addComponent(comp.type);
            };
            toolbar.appendChild(btn);
        });

        const sizeLabel = document.createElement('span');
        sizeLabel.innerHTML = ' <strong>' + (isRtl ? 'الحجم:' : 'Size:') + '</strong> ';
        toolbar.appendChild(sizeLabel);

        const sizeSelect = document.createElement('select');
        sizeSelect.className = 'form-control form-control-sm';
        sizeSelect.style.display = 'inline-block';
        sizeSelect.style.width = 'auto';
        const sizes = [
            ['40x20', '40x20'], ['50x30', '50x30'], ['60x40', '60x40'],
            ['70x50', '70x50'], ['80x50', '80x50'], ['100x50', '100x50'],
            ['a4', 'A4']
        ];
        sizes.forEach(function(s) {
            const opt = document.createElement('option');
            opt.value = s[0];
            opt.textContent = s[1];
            if (s[0] === currentLabelSize) opt.selected = true;
            sizeSelect.appendChild(opt);
        });
        sizeSelect.onchange = function() {
            currentLabelSize = this.value;
            const parts = currentLabelSize.split('x');
            labelWidthMm = parseInt(parts[0]);
            labelHeightMm = parseInt(parts[1]);
            renderPreview();
        };
        toolbar.appendChild(sizeSelect);

        const snapBtn = document.createElement('button');
        snapBtn.className = 'btn btn-sm ' + (snapToGrid ? 'btn-success' : 'btn-outline-secondary');
        snapBtn.textContent = isRtl ? 'محاذاة: ' + (snapToGrid ? 'ON' : 'OFF') : 'Snap: ' + (snapToGrid ? 'ON' : 'OFF');
        snapBtn.onclick = function() {
            snapToGrid = !snapToGrid;
            this.className = 'btn btn-sm ' + (snapToGrid ? 'btn-success' : 'btn-outline-secondary');
            this.textContent = isRtl ? 'محاذاة: ' + (snapToGrid ? 'ON' : 'OFF') : 'Snap: ' + (snapToGrid ? 'ON' : 'OFF');
        };
        toolbar.appendChild(snapBtn);

        const autoFitBtn = document.createElement('button');
        autoFitBtn.className = 'btn btn-sm ' + (autoFitEnabled ? 'btn-success' : 'btn-outline-secondary');
        autoFitBtn.textContent = isRtl ? 'ملء تلقائي: ' + (autoFitEnabled ? 'ON' : 'OFF') : 'Auto-Fit: ' + (autoFitEnabled ? 'ON' : 'OFF');
        autoFitBtn.onclick = function() {
            autoFitEnabled = !autoFitEnabled;
            this.className = 'btn btn-sm ' + (autoFitEnabled ? 'btn-success' : 'btn-outline-secondary');
            this.textContent = isRtl ? 'ملء تلقائي: ' + (autoFitEnabled ? 'ON' : 'OFF') : 'Auto-Fit: ' + (autoFitEnabled ? 'ON' : 'OFF');
            if (autoFitEnabled) autoFitText();
        };
        toolbar.appendChild(autoFitBtn);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-sm btn-success';
        saveBtn.textContent = isRtl ? 'حفظ القالب' : 'Save Template';
        saveBtn.onclick = function() {
            if (saveCallback) saveCallback(buildTemplateData());
        };
        toolbar.appendChild(saveBtn);

        const dupBtn = document.createElement('button');
        dupBtn.className = 'btn btn-sm btn-outline-primary';
        dupBtn.textContent = isRtl ? 'تكرار' : 'Duplicate';
        dupBtn.onclick = function() {
            duplicateTemplate();
        };
        toolbar.appendChild(dupBtn);

        container.appendChild(toolbar);

        const designerArea = document.createElement('div');
        designerArea.className = 'nexora-barcode-designer';
        if (isRtl) designerArea.setAttribute('dir', 'rtl');
        designerArea.style.width = (labelWidthMm * MM_TO_PX) + 'px';
        designerArea.style.height = (labelHeightMm * MM_TO_PX) + 'px';
        designerArea.style.margin = '20px auto';
        designerArea.style.position = 'relative';
        designerArea.style.background = 'white';
        designerArea.id = 'nbc-designer-area';

        if (snapToGrid) {
            const gridOverlay = document.createElement('div');
            gridOverlay.className = 'nexora-snap-grid';
            designerArea.appendChild(gridOverlay);
        }

        components.forEach(function(comp) {
            const el = createComponentElement(comp);
            designerArea.appendChild(el);
        });

        container.appendChild(designerArea);
    }

    function createComponentElement(comp) {
        const el = document.createElement('div');
        el.className = 'nexora-barcode-component';
        el.style.left = (comp.x * MM_TO_PX) + 'px';
        el.style.top = (comp.y * MM_TO_PX) + 'px';
        el.style.width = (comp.width * MM_TO_PX) + 'px';
        el.style.height = (comp.height * MM_TO_PX) + 'px';
        el.setAttribute('data-id', comp.id);
        el.setAttribute('data-type', comp.type);

        let inner = '';
        if (comp.type === 'text') {
            inner = '<div style="font-size:' + (comp.fontSize || 10) + 'px; font-weight:' + (comp.fontWeight || 'normal') + '; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + (comp.content || comp.label) + '</div>';
        } else if (comp.type === 'barcode' || comp.type === 'qr') {
            inner = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f0f0f0; border:1px dashed #ccc; font-size:10px;">' + (comp.label || comp.type) + '</div>';
        } else if (comp.type === 'image') {
            inner = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f0f0f0; border:1px dashed #ccc; font-size:10px;">LOGO</div>';
        } else if (comp.type === 'price') {
            inner = '<div style="font-size:' + (comp.fontSize || 10) + 'px; font-weight:bold; white-space:nowrap;">' + (comp.content || '{price}') + '</div>';
        }
        el.innerHTML = inner;

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'nexora-barcode-resize-handle';
        el.appendChild(resizeHandle);

        return el;
    }

    function renderPreview() {
        if (!preview) return;
        preview.innerHTML = '';
        preview.className = 'nexora-label-preview nexora-label-size-' + currentLabelSize;
        preview.style.width = (labelWidthMm * MM_TO_PX) + 'px';
        preview.style.height = (labelHeightMm * MM_TO_PX) + 'px';
        preview.style.padding = '1mm';
        preview.style.boxSizing = 'border-box';

        components.forEach(function(comp) {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.left = (comp.x * MM_TO_PX + 1) + 'px';
            el.style.top = (comp.y * MM_TO_PX + 1) + 'px';
            el.style.width = (comp.width * MM_TO_PX) + 'px';
            el.style.height = (comp.height * MM_TO_PX) + 'px';
            el.style.fontSize = (comp.fontSize || 10) + 'px';
            el.style.fontWeight = comp.fontWeight || 'normal';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.overflow = 'hidden';
            el.textContent = comp.label || comp.content || comp.type;
            preview.appendChild(el);
        });
    }

    function addComponent(type) {
        const newComp = {
            id: 'comp_' + Date.now(),
            type: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            x: snap(2),
            y: snap(2),
            width: 20,
            height: 8,
            fontSize: 9,
            fontWeight: 'normal',
            content: '{' + type + '}'
        };
        components.push(newComp);
        renderDesigner();
        renderPreview();
    }

    function removeComponent(id) {
        components = components.filter(function(c) { return c.id !== id; });
        renderDesigner();
        renderPreview();
    }

    function autoFitText() {
        if (!autoFitEnabled) return;
        components.forEach(function(comp) {
            if (comp.type === 'text' || comp.type === 'price') {
                const area = comp.width * comp.height;
                const chars = (comp.content || '').length;
                if (chars > 0 && area > 0) {
                    comp.fontSize = Math.max(5, Math.min(14, Math.floor(area / chars * 0.8)));
                }
            }
        });
        renderDesigner();
        renderPreview();
    }

    function buildTemplateData() {
        return {
            template_name: templateName,
            label_size: currentLabelSize,
            company: company,
            components: components,
            is_default: false,
            visibility: 'Company'
        };
    }

    function loadTemplate(template) {
        if (template.components && Array.isArray(template.components)) {
            components = template.components;
        }
        if (template.label_size) {
            currentLabelSize = template.label_size;
            const parts = currentLabelSize.split('x');
            if (parts.length === 2) {
                labelWidthMm = parseInt(parts[0]);
                labelHeightMm = parseInt(parts[1]);
            } else if (currentLabelSize === 'a4') {
                labelWidthMm = 210;
                labelHeightMm = 297;
            }
        }
        if (template.template_name) {
            templateName = template.template_name;
        }
        renderDesigner();
        renderPreview();
    }

    function duplicateTemplate() {
        const duplicated = components.map(function(c) {
            return Object.assign({}, c, { id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) });
        });
        components = duplicated;
        templateName = '';
        renderDesigner();
        renderPreview();
    }

    function exportTemplate() {
        const data = buildTemplateData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (templateName || 'label-template') + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importTemplate(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.components && Array.isArray(data.components)) {
                loadTemplate(data);
                return true;
            }
        } catch (e) {
            console.error('Error importing template:', e);
        }
        return false;
    }

    function alignComponents(direction) {
        if (components.length === 0) return;
        const bounds = {
            left: Math.min.apply(null, components.map(c => c.x)),
            right: Math.max.apply(null, components.map(c => c.x + c.width)),
            top: Math.min.apply(null, components.map(c => c.y)),
            bottom: Math.max.apply(null, components.map(c => c.y + c.height))
        };

        components.forEach(function(comp) {
            switch (direction) {
                case 'left':
                    comp.x = bounds.left;
                    break;
                case 'right':
                    comp.x = bounds.right - comp.width;
                    break;
                case 'top':
                    comp.y = bounds.top;
                    break;
                case 'bottom':
                    comp.y = bounds.bottom - comp.height;
                    break;
                case 'center-h':
                    comp.x = snap((labelWidthMm - comp.width) / 2);
                    break;
                case 'center-v':
                    comp.y = snap((labelHeightMm - comp.height) / 2);
                    break;
            }
        });
        renderDesigner();
        renderPreview();
    }

    function attachEvents() {
        container.addEventListener('mousedown', function(e) {
            const compEl = e.target.closest('.nexora-barcode-component');
            if (!compEl) return;

            selectedComponent = compEl.getAttribute('data-id');
            const comp = components.find(function(c) { return c.id === selectedComponent; });
            if (!comp) return;

            if (e.target.classList.contains('nexora-barcode-resize-handle')) {
                isResizing = true;
            } else {
                isDragging = true;
                const rect = compEl.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
            }

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!selectedComponent) return;
            const comp = components.find(function(c) { return c.id === selectedComponent; });
            if (!comp) return;

            const designerArea = document.getElementById('nbc-designer-area');
            if (!designerArea) return;
            const areaRect = designerArea.getBoundingClientRect();

            if (isDragging) {
                let newX = (e.clientX - areaRect.left - dragOffset.x) / MM_TO_PX;
                let newY = (e.clientY - areaRect.top - dragOffset.y) / MM_TO_PX;
                newX = snap(Math.max(0, Math.min(labelWidthMm - comp.width, newX)));
                newY = snap(Math.max(0, Math.min(labelHeightMm - comp.height, newY)));
                comp.x = newX;
                comp.y = newY;
                showAlignmentGuides(comp.x, comp.y, comp.width, comp.height);
                renderDesigner();
                renderPreview();
            } else if (isResizing) {
                let newW = (e.clientX - areaRect.left) / MM_TO_PX - comp.x;
                let newH = (e.clientY - areaRect.top) / MM_TO_PX - comp.y;
                newW = snap(Math.max(5, Math.min(labelWidthMm - comp.x, newW)));
                newH = snap(Math.max(3, Math.min(labelHeightMm - comp.y, newH)));
                comp.width = newW;
                comp.height = newH;
                if (autoFitEnabled && (comp.type === 'text' || comp.type === 'price')) {
                    const area = comp.width * comp.height;
                    const chars = (comp.content || '').length;
                    if (chars > 0) {
                        comp.fontSize = Math.max(5, Math.min(14, Math.floor(area / chars * 0.8)));
                    }
                }
                renderDesigner();
                renderPreview();
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            isResizing = false;
            clearAlignmentGuides();
        });

        container.addEventListener('dblclick', function(e) {
            const compEl = e.target.closest('.nexora-barcode-component');
            if (compEl) {
                const compId = compEl.getAttribute('data-id');
                const comp = components.find(function(c) { return c.id === compId; });
                if (comp) {
                    const newLabel = prompt(isRtl ? 'أدخل محتوى المكون:' : 'Enter label content:', comp.content || comp.label);
                    if (newLabel !== null) {
                        comp.content = newLabel;
                        comp.label = newLabel;
                        renderDesigner();
                        renderPreview();
                    }
                }
            }
        });

        container.addEventListener('keydown', function(e) {
            if (!selectedComponent) return;
            const comp = components.find(function(c) { return c.id === selectedComponent; });
            if (!comp) return;

            const step = e.shiftKey ? gridSize * 5 : gridSize;
            switch (e.key) {
                case 'ArrowLeft':
                    if (isRtl) comp.x = Math.min(labelWidthMm - comp.width, comp.x + step);
                    else comp.x = Math.max(0, comp.x - step);
                    break;
                case 'ArrowRight':
                    if (isRtl) comp.x = Math.max(0, comp.x - step);
                    else comp.x = Math.min(labelWidthMm - comp.width, comp.x + step);
                    break;
                case 'ArrowUp':
                    comp.y = Math.max(0, comp.y - step);
                    break;
                case 'ArrowDown':
                    comp.y = Math.min(labelHeightMm - comp.height, comp.y + step);
                    break;
                case 'Delete':
                case 'Backspace':
                    removeComponent(comp.id);
                    selectedComponent = null;
                    break;
                default:
                    return;
            }
            e.preventDefault();
            renderDesigner();
            renderPreview();
        });
    }

    return {
        init: init,
        loadTemplate: loadTemplate,
        save: function() {
            return buildTemplateData();
        },
        duplicate: duplicateTemplate,
        removeComponent: removeComponent,
        autoFitText: autoFitText,
        getComponents: function() { return components; },
        setComponents: function(comps) { components = comps; renderDesigner(); renderPreview(); },
        exportTemplate: exportTemplate,
        importTemplate: importTemplate,
        alignComponents: alignComponents,
        setSnap: function(enabled) { snapToGrid = enabled; },
        setRtl: function(enabled) { isRtl = enabled; },
        getLabelSize: function() { return currentLabelSize; }
    };
})();
