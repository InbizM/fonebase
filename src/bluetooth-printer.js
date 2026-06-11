import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

let _device = null;
let _characteristic = null;
let _isPrinting = false;

const PRINTER_SERVICES = [
  0x18f0,
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '000018f0-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000fee7-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '00004953-5443-4e45-5246-454c42494c49'
];

// Ancho del ticket en caracteres (48mm ≈ 32 chars, 58mm ≈ 32, ajusta si ves texto cortado)
const COLS = 32;

export async function connectPrinter() {
  if (_device && _device.gatt.connected) return true;

  try {
    if (!navigator.bluetooth) {
      throw new Error("Tu navegador no soporta Web Bluetooth. Usa Chrome/Edge.");
    }

    _device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PRINTER_SERVICES
    });

    const server = await _device.gatt.connect();

    for (const serviceUuid of PRINTER_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            _characteristic = char;
            console.log(`[BT-Printer] ✅ Canal encontrado: ${char.uuid}`);
            return true;
          }
        }
      } catch (e) { /* servicio no existe, continuar */ }
    }

    throw new Error("No se encontró canal de escritura en la impresora.");
  } catch (err) {
    _device = null;
    _characteristic = null;
    throw err;
  }
}

export async function imageToCanvas(url) {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function sendBytes(bytes) {
  if (!_characteristic) throw new Error("Impresora no conectada.");
  const CHUNK_SIZE = 100;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    await _characteristic.writeValue(bytes.slice(i, i + CHUNK_SIZE));
    await new Promise(r => setTimeout(r, 20));
  }
}

// Helpers de formato
const divider     = (char = '-') => char.repeat(COLS);
const centerText  = (text, width = COLS) => {
  const t = String(text).substring(0, width);
  const pad = Math.max(0, Math.floor((width - t.length) / 2));
  return ' '.repeat(pad) + t;
};
const leftRight   = (left, right, width = COLS) => {
  const l = String(left).substring(0, width - String(right).length - 1);
  const spaces = width - l.length - String(right).length;
  return l + ' '.repeat(Math.max(1, spaces)) + right;
};
const wrapText    = (text, width = COLS) => {
  const words = String(text).split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > width) { lines.push(line.trimEnd()); line = ''; }
    line += word + ' ';
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
};
const money = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);

// Escala un canvas de firma al ancho de impresión (384px = 58mm)
function scaleSignatureCanvas(srcCanvas, targetWidth = 384) {
  if (!srcCanvas || srcCanvas.width === 0) return null;
  const ratio  = targetWidth / srcCanvas.width;
  const newH   = Math.ceil(srcCanvas.height * ratio);
  // Alinear altura a múltiplo de 8 (requerido por ESC/POS bitmap)
  const alignH = Math.ceil(newH / 8) * 8;
  const c      = document.createElement('canvas');
  c.width      = targetWidth;
  c.height     = alignH;
  const ctx    = c.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, targetWidth, alignH);
  ctx.drawImage(srcCanvas, 0, 0, targetWidth, newH);
  return c;
}

export async function printBluetoothTicket(v, canvasCliente = null, canvasVendedor = null) {
  if (_isPrinting) {
    console.warn("[BT-Printer] Impresión en progreso.");
    return;
  }

  try {
    _isPrinting = true;
    await connectPrinter();

    const fecha  = new Date(v.fecha || Date.now()).toLocaleString('es-CO');
    const items  = Array.isArray(v.items) ? v.items : [{ nombre: v.productos, qty: v.cantidad || 1 }];
    const imeis  = typeof v.imeis === 'string' ? v.imeis : JSON.stringify(v.imeis || {});
    const imeiOk = imeis && imeis !== 'N/A' && imeis !== '{}' && imeis !== 'null';

    const enc = new ReceiptPrinterEncoder({ language: 'esc-pos', width: COLS });

    enc.initialize();

    // ── ENCABEZADO ──────────────────────────────────────────────
    enc.align('center')
       .bold(true).height(2).width(2)
       .line('WAYIRA PHONE')
       .height(1).width(1).bold(false)
       .line(v.emisor?.propietario || 'Yeison Rangel')
       .line(`NIT: ${v.emisor?.nit || '1193400777-2'}`)
       .line(v.emisor?.direccion  || 'Calle 12 No. 10 - 108')
       .line(`Tel: ${v.emisor?.contacto || '3016807310'}`)
       .newline()
       .line(divider('='))
       .newline();

    // ── FACTURA ──────────────────────────────────────────────────
    enc.align('left')
       .bold(true).line('COMPROBANTE DE VENTA').bold(false)
       .line(`FAC: ${v.idFactura || v.id_factura}`)
       .line(`Fecha: ${fecha}`)
       .newline()
       .line(divider())
       .newline();

    // ── CLIENTE ──────────────────────────────────────────────────
    enc.bold(true).line('CLIENTE').bold(false)
       .line(`${v.cliente}`)
       .line(`CC: ${v.cedula}`)
       .line(`Tel: ${v.telefono || v.telefono_cliente || 'N/A'}`)
       .line(`Dir: ${v.direccion || '—'}, ${v.ciudad || '—'}`)
       .newline()
       .line(divider())
       .newline();

    // ── ATENDIDO POR ─────────────────────────────────────────────
    enc.bold(true).line('ATENDIDO POR').bold(false)
       .line(v.vendedor || 'Yeison Rangel')
       .newline()
       .line(divider())
       .newline();

    // ── PRODUCTOS ────────────────────────────────────────────────
    enc.bold(true).line('DETALLE DE PRODUCTOS').bold(false);

    for (const item of items) {
      const precio = money(v.total / (item.qty || 1));
      enc.bold(true).line(String(item.nombre).substring(0, COLS)).bold(false)
         .line(leftRight(`  ${item.qty} x ${precio}`, money(v.total)));
    }

    // IMEIs
    if (imeiOk) {
      enc.newline()
         .bold(true).line('IMEI/SERIE:').bold(false);
      wrapText(imeis).forEach(l => enc.line(l));
    }

    enc.newline().line(divider('=')).newline();

    // ── TOTALES ──────────────────────────────────────────────────
    enc.line(leftRight('Subtotal:', money(v.subtotal || v.total)))
       .line(leftRight('Descuento:', `-${money(v.descuento || 0)}`))
       .bold(true).height(2)
       .line(leftRight('TOTAL:', money(v.total)))
       .height(1).bold(false)
       .newline()
       .line(divider('='))
       .newline();

    // ── FIRMAS (bitmap solo si existen) ──────────────────────────
    enc.align('center').bold(true).line('FIRMAS LEGALES').bold(false).newline();

    const firmaV = scaleSignatureCanvas(canvasVendedor);
    if (firmaV) {
      enc.line('-- VENDEDOR --')
         .image(firmaV, firmaV.width, firmaV.height, 'threshold')
         .newline();
    } else {
      enc.line('VENDEDOR: _________________').newline();
    }

    const firmaC = scaleSignatureCanvas(canvasCliente);
    if (firmaC) {
      enc.line('-- COMPRADOR --')
         .image(firmaC, firmaC.width, firmaC.height, 'threshold')
         .newline();
    } else {
      enc.line('COMPRADOR: ________________').newline();
    }

    enc.line(divider()).newline();

    // ── LEGAL ────────────────────────────────────────────────────
    enc.align('left');
    const legal = 'GARANTIA: Equipos probados y encendidos. Sin garantia en displays/tactiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).';
    wrapText(legal).forEach(l => enc.line(l));

    enc.newline()
       .align('center')
       .bold(true).line('¡GRACIAS POR SU COMPRA!').bold(false)
       .newline().newline().newline()
       .cut();

    await sendBytes(enc.encode());
    console.log("[BT-Printer] ✅ Impresión enviada.");

  } catch (err) {
    console.error("[BT-Printer] Error:", err);
    alert(`Error Bluetooth: ${err.message || err}`);
  } finally {
    _isPrinting = false;
  }
}
