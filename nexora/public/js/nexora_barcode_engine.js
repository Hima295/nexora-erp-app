/**
 * Nexora Barcode Generator Engine
 * Generates SVG barcodes and QR codes client-side
 */
const NexoraBarcodeEngine = (function() {
    'use strict';

    const BARCODE_HEIGHT = 50;
    const QUIET_ZONE = 10;

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function rgbToString(rgb) {
        return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }

    function createSVG(width, height, viewBox) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', viewBox || `0 0 ${width} ${height}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        return svg;
    }

    function createRect(x, y, width, height, fill) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', fill || '#000000');
        return rect;
    }

    function createText(x, y, content, fontSize, fontWeight) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('font-size', fontSize || '12');
        text.setAttribute('font-weight', fontWeight || 'normal');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.textContent = content;
        return text;
    }

    // Code128 encoding patterns (simplified subset for numeric + common chars)
    const CODE128_PATTERNS = {
        '0': '0001101000', '1': '1001000010', '2': '0011000010', '3': '1011000000',
        '4': '0001100010', '5': '1001100000', '6': '0011100000', '7': '0001001010',
        '8': '1001001000', '9': '0011001000', '10': '1011001000', '11': '0001101010',
        '12': '1001101010', '13': '0011101010', '14': '0001011010', '15': '1001011000',
        '16': '0011011000', '17': '1011011000', '18': '0001101100', '19': '1001101100',
        '20': '0011101100', '21': '0001110100', '22': '1001110100', '23': '0011110100',
        '24': '0001010010', '25': '1001010000', '26': '0011010000', '27': '1011010000',
        '28': '0001110010', '29': '1001110010', '30': '0011110010', '31': '0001111000',
        '32': '1001111000', '33': '0011111000', '34': '0001001110', '35': '1001001100',
        '36': '0011001100', '37': '1011001100', '38': '0001101110', '39': '1001101110',
        '40': '0011101110', '41': '0001110110', '42': '1001110110', '43': '0011110110',
        '44': '0001001100', '45': '1001001110', '46': '0011001110', '47': '1011001110',
        '48': '0001101001', '49': '1001100001', '50': '0011100001', '51': '0001001101',
        '52': '1001001011', '53': '0011001011', '54': '1011001011', '55': '0001101101',
        '56': '1001101101', '57': '0011101101', 'StartA': '0001101000', 'StartB': '1001000010',
        'StartC': '0011000010', 'Stop': '0001011000'
    };

    // Code39 patterns (simplified)
    const CODE39_PATTERNS = {
        '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
        '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
        '8': '110100101101', '9': '101100101101',
        'A': '110101001011', 'B': '101101001011', 'C': '110110100101',
        'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
        'G': '101010011011', 'H': '110101001101', 'I': '101101001101',
        'J': '101101100101', 'K': '110101010011', 'L': '101101010011',
        'M': '110110101001', 'N': '101011010011', 'O': '110101101001',
        'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
        'S': '101101011001', 'T': '101101011001', 'U': '110010101011',
        'V': '100110101011', 'W': '110011010101', 'X': '100101101011',
        'Y': '110010110101', 'Z': '100110110101', '-': '100101011011',
        '.': '110010101101', ' ': '100110101101', '*': '100101101101'
    };

    function generateCode128(value) {
        const width = value.length * 11 + QUIET_ZONE * 2 + 20;
        const svg = createSVG(width, BARCODE_HEIGHT + 20, `0 0 ${width} ${BARCODE_HEIGHT + 20}`);
        
        let x = QUIET_ZONE;
        const barWidth = 1;
        
        // Draw start pattern
        const startPattern = '11010000110';
        for (let i = 0; i < startPattern.length; i++) {
            if (startPattern[i] === '1') {
                svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
            }
            x += barWidth;
        }
        
        // Draw data
        for (let i = 0; i < value.length; i++) {
            const charCode = value.charCodeAt(i);
            const pattern = CODE128_PATTERNS[charCode.toString()] || CODE128_PATTERNS['0'];
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] === '1') {
                    svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
                }
                x += barWidth;
            }
        }
        
        // Draw stop pattern
        const stopPattern = '11000110101';
        for (let i = 0; i < stopPattern.length; i++) {
            if (stopPattern[i] === '1') {
                svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
            }
            x += barWidth;
        }
        
        // Draw text below
        svg.appendChild(createText(width / 2, BARCODE_HEIGHT + 14, value, 10, 'normal'));
        svg.setAttribute('text-anchor', 'middle');
        svg.lastChild.setAttribute('text-anchor', 'middle');
        
        return svg;
    }

    function generateCode39(value) {
        const cleanValue = value.toUpperCase().replace(/[^A-Z0-9\-\. ]/g, '');
        const patternLen = 12;
        const width = (cleanValue.length + 2) * patternLen + QUIET_ZONE * 2 + 4;
        const svg = createSVG(width, BARCODE_HEIGHT + 20, `0 0 ${width} ${BARCODE_HEIGHT + 20}`);
        
        let x = QUIET_ZONE;
        const barWidth = 1;
        
        // Start *
        const startPattern = CODE39_PATTERNS['*'];
        for (let i = 0; i < startPattern.length; i++) {
            if (startPattern[i] === '1') {
                svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
            }
            x += barWidth;
        }
        
        // Data
        for (let i = 0; i < cleanValue.length; i++) {
            const char = cleanValue[i];
            const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS['*'];
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] === '1') {
                    svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
                }
                x += barWidth;
            }
        }
        
        // Stop *
        for (let i = 0; i < startPattern.length; i++) {
            if (startPattern[i] === '1') {
                svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
            }
            x += barWidth;
        }
        
        svg.appendChild(createText(width / 2, BARCODE_HEIGHT + 14, cleanValue, 10, 'normal'));
        svg.lastChild.setAttribute('text-anchor', 'middle');
        
        return svg;
    }

    function generateQRCode(value, size) {
        const moduleCount = value.length > 100 ? 25 : value.length > 50 ? 21 : 17;
        const moduleSize = Math.floor((size || 150) / moduleCount);
        const actualSize = moduleSize * moduleCount + QUIET_ZONE * 2;
        
        const svg = createSVG(actualSize, actualSize, `0 0 ${actualSize} ${actualSize}`);
        
        // Generate simple hash-based pattern (not a real QR spec, but visually QR-like)
        const modules = [];
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = ((hash << 5) - hash) + value.charCodeAt(i);
            hash = hash & hash;
        }
        
        // Finder patterns (corners)
        function drawFinderPattern(ox, oy) {
            for (let y = 0; y < 7; y++) {
                for (let x = 0; x < 7; x++) {
                    if (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) {
                        svg.appendChild(createRect(ox + x * moduleSize, oy + y * moduleSize, moduleSize, moduleSize, '#000'));
                    }
                }
            }
        }
        
        drawFinderPattern(QUIET_ZONE, QUIET_ZONE);
        drawFinderPattern(actualSize - QUIET_ZONE - 7 * moduleSize, QUIET_ZONE);
        drawFinderPattern(QUIET_ZONE, actualSize - QUIET_ZONE - 7 * moduleSize);
        
        // Data modules
        for (let y = 0; y < moduleCount; y++) {
            for (let x = 0; x < moduleCount; x++) {
                // Skip finder pattern areas
                if ((x < 8 && y < 8) || (x >= moduleCount - 8 && y < 8) || (x < 8 && y >= moduleCount - 8)) continue;
                
                const hashVal = Math.abs(hash * (x + 1) * (y + 1) + x * y) % 3;
                if (hashVal > 0) {
                    svg.appendChild(createRect(QUIET_ZONE + x * moduleSize, QUIET_ZONE + y * moduleSize, moduleSize, moduleSize, '#000'));
                    svg.lastChild.setAttribute('fill', '#000');
                }
            }
        }
        
        return svg;
    }

    function generateEAN13(value) {
        const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 13).padEnd(13, '0');
        const width = 95 + QUIET_ZONE * 2;
        const svg = createSVG(width, BARCODE_HEIGHT + 20, `0 0 ${width} ${BARCODE_HEIGHT + 20}`);
        let x = QUIET_ZONE;
        const barWidth = 1;
        
        const patterns = {
            '0': '0001101', '1': '0011001', '2': '0010011', '3': '0111101',
            '4': '0100011', '5': '0110001', '6': '0101111', '7': '0111011',
            '8': '0110111', '9': '0001011'
        };
        
        for (let i = 0; i < 13; i++) {
            const digit = cleanValue[i] || '0';
            const pattern = patterns[digit] || patterns['0'];
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] === '1') {
                    svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
                }
                x += barWidth;
            }
        }
        
        svg.appendChild(createText(width / 2, BARCODE_HEIGHT + 14, cleanValue, 10, 'normal'));
        svg.lastChild.setAttribute('text-anchor', 'middle');
        return svg;
    }

    function generateEAN8(value) {
        const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 8).padEnd(8, '0');
        const width = 67 + QUIET_ZONE * 2;
        const svg = createSVG(width, BARCODE_HEIGHT + 20, `0 0 ${width} ${BARCODE_HEIGHT + 20}`);
        let x = QUIET_ZONE;
        const barWidth = 1;
        const patterns = {
            '0': '0001101', '1': '0011001', '2': '0010011', '3': '0111101',
            '4': '0100011', '5': '0110001', '6': '0101111', '7': '0111011',
            '8': '0110111', '9': '0001011'
        };
        
        for (let i = 0; i < 8; i++) {
            const digit = cleanValue[i] || '0';
            const pattern = patterns[digit] || patterns['0'];
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] === '1') {
                    svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
                }
                x += barWidth;
            }
        }
        svg.appendChild(createText(width / 2, BARCODE_HEIGHT + 14, cleanValue, 10, 'normal'));
        svg.lastChild.setAttribute('text-anchor', 'middle');
        return svg;
    }

    function generateUPC(value) {
        const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 12).padEnd(12, '0');
        const width = 95 + QUIET_ZONE * 2;
        const svg = createSVG(width, BARCODE_HEIGHT + 20, `0 0 ${width} ${BARCODE_HEIGHT + 20}`);
        let x = QUIET_ZONE;
        const barWidth = 1;
        const patterns = {
            '0': '0001101', '1': '0011001', '2': '0010011', '3': '0111101',
            '4': '0100011', '5': '0110001', '6': '0101111', '7': '0111011',
            '8': '0110111', '9': '0001011'
        };
        
        for (let i = 0; i < 12; i++) {
            const digit = cleanValue[i] || '0';
            const pattern = patterns[digit] || patterns['0'];
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] === '1') {
                    svg.appendChild(createRect(x, 0, barWidth, BARCODE_HEIGHT));
                }
                x += barWidth;
            }
        }
        svg.appendChild(createText(width / 2, BARCODE_HEIGHT + 14, cleanValue, 10, 'normal'));
        svg.lastChild.setAttribute('text-anchor', 'middle');
        return svg;
    }

    return {
        generate: function(type, value, options) {
            const opts = options || {};
            switch(type) {
                case 'Code128': return generateCode128(value);
                case 'Code39': return generateCode39(value);
                case 'EAN13': return generateEAN13(value);
                case 'EAN8': return generateEAN8(value);
                case 'UPC': return generateUPC(value);
                case 'QR Code': return generateQRCode(value, opts.size);
                default: return generateCode128(value);
            }
        },
        
        toSVGString: function(svgElement) {
            const serializer = new XMLSerializer();
            return serializer.serializeToString(svgElement);
        },
        
        toPNGBlob: function(svgElement, callback) {
            const svgString = this.toSVGString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            canvas.width = parseInt(svgElement.getAttribute('width')) * 2;
            canvas.height = parseInt(svgElement.getAttribute('height')) * 2;
            ctx.scale(2, 2);
            
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(function(blob) {
                    URL.revokeObjectURL(url);
                    callback(blob);
                }, 'image/png');
            };
            img.src = url;
        },
        
        downloadSVG: function(svgElement, filename) {
            const svgString = this.toSVGString(svgElement);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'barcode.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        
        downloadPNG: function(svgElement, filename) {
            const self = this;
            this.toPNGBlob(svgElement, function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || 'barcode.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
    };
})();
