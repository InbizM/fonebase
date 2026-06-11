import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import html2canvas from 'html2canvas';

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

export async function connectPrinter() {
  if (_device && _device.gatt.connected) return true;

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
    } catch (e) { /* servicio no existe */ }
  }

  _device = null;
  throw new Error("No se encontró canal de escritura en la impresora.");
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

// Genera el HTML del ticket igual que imprimirTicketHistory
function buildTicketHTML(v, ajustesEmpresa = null) {
  let imeiText = "N/A";
  try {
    const imeiObj = JSON.parse(v.imeis || "{}");
    const flatImeis = Object.values(imeiObj).flat().filter(x => x && x.trim());
    if (flatImeis.length > 0) imeiText = flatImeis.join(", ");
  } catch(e) {
    if (v.imeis && v.imeis !== "{}" && v.imeis !== "N/A") imeiText = v.imeis;
  }

  const now = new Date(v.fecha || Date.now());
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

  const emisor = {
    nombre:      ajustesEmpresa?.nombre      || "WAYIRA PHONE",
    propietario: ajustesEmpresa?.propietario || "Yeison Rangel Rangel",
    nit:         ajustesEmpresa?.nit         || "1193400777-2",
    direccion:   (ajustesEmpresa?.direccion  || "Calle 12 No. 10 - 108") + ", " + (ajustesEmpresa?.ciudad || "Maicao - La Guajira"),
    contacto:    ajustesEmpresa?.contacto    || "3016807310",
    condiciones: ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
    logo:        ajustesEmpresa?.logo        || "",
    logo_size:   ajustesEmpresa?.logo_size   || 40
  };

  return `
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        width: 384px;
        margin: 0;
        padding: 6px;
        font-size: 10px;
        color: #1e293b;
        line-height: 1.3;
        background: #fff;
      }
      .bold { font-weight: 900; }
      .text-xs { font-size: 8px; }
      .text-sm { font-size: 11px; }
      .text-lg { font-size: 14px; }
      .text-xl { font-size: 18px; }
      .text-slate-500 { color: #64748b; }
      .text-slate-400 { color: #94a3b8; }
      .card {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 4px;
        margin-bottom: 6px;
        background: #f8fafc;
      }
      .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
      .badge {
        background: #dcfce7; color: #166534;
        padding: 2px 4px; border-radius: 8px;
        font-size: 8px; font-weight: 900; text-transform: uppercase;
      }
      .section-title {
        font-size: 7px;
        font-weight: 900;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
        margin-top: 4px;
      }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
      .product-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 4px;
        margin-bottom: 4px;
      }
      .summary-card {
        background: #0f172a;
        color: white;
        border-radius: 6px;
        padding: 6px;
        margin-top: 6px;
      }
      .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
      .center { text-align: center; }
    </style>

    ${emisor.logo ? `
    <div style="text-align: center; margin-bottom: 4px;">
      <img src="${emisor.logo}" style="max-height: ${emisor.logo_size}px; max-width: 100%; object-fit: contain;" crossorigin="anonymous">
    </div>` : ''}

    <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
      <div class="bold text-sm" style="text-transform: uppercase; color: #000;">${emisor.nombre}</div>
      <div>NIT: ${emisor.nit}</div>
      <div>${emisor.direccion}</div>
      <div>Tel: ${emisor.contacto}</div>
    </div>

    <div class="card">
      <div class="text-xs bold" style="color: #dc2626; text-transform: uppercase;">COMPROBANTE DE VENTA</div>
      <div class="flex-between" style="margin-top: 2px;">
        <div class="text-lg bold" style="line-height: 1;">${v.id_factura || v.idFactura}</div>
        <div class="badge">PAGADO</div>
      </div>
      <div class="flex-between" style="margin-top: 2px;">
        <div class="text-xs text-slate-500">${fechaStr}</div>
        <div class="text-xs bold">${v.metodo || 'Efectivo'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
        <div class="bold text-sm">${v.cliente}</div>
        <div class="text-xs text-slate-500">ID: ${v.cedula}</div>
        <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${v.telefono_cliente || v.telefono || 'N/A'}</div>
        <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Ubicación:</span> ${v.direccion || '—'}, ${v.ciudad || '—'}</div>
      </div>
      <div>
        <div class="section-title">ATENDIDO POR</div>
        <div class="bold text-sm">${v.vendedor || 'Vendedor'}</div>
        <div class="text-xs text-slate-400" style="font-style: italic;">Vendedor Autorizado</div>
        <div class="text-xs bold" style="color: #dc2626; background: #fef2f2; display: inline-block; padding: 1px 4px; border-radius: 4px; margin-top: 2px;">DIGITAL</div>
      </div>
    </div>

    <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>

    <div class="section-title">DETALLE DE PRODUCTOS</div>
    <div class="product-card">
      <div class="flex-between">
        <div class="bold text-sm" style="width: 80%;">${v.productos}</div>
        <div class="bold text-sm">x${v.cantidad || 1}</div>
      </div>
    </div>
    ${imeiText && imeiText !== 'N/A' ? `<div class="text-xs bold" style="color:#dc2626; margin-top: -2px; margin-bottom: 4px; margin-left: 4px;">IMEI/SERIE: ${imeiText}</div>` : ''}

    <div class="summary-card">
      <div class="flex-between" style="align-items: flex-end;">
        <div>
          <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN FINANCIERO</div>
          <div class="text-xs" style="color: #cbd5e1;">Subtotal: $${new Intl.NumberFormat('es-CO').format(v.subtotal || v.total)}</div>
          <div class="text-xs bold" style="color: #f87171;">Descuento: -$${new Intl.NumberFormat('es-CO').format(v.descuento || 0)}</div>
        </div>
        <div style="text-align: right;">
          <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">TOTAL COBRADO</div>
          <div class="text-xl bold" style="color: white; line-height: 1;">$${new Intl.NumberFormat('es-CO').format(v.total)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 8px;">
      <div class="center">
        <div class="text-xs bold text-slate-400">FIRMA VEND.</div>
        <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px; display: flex; justify-content: center; align-items: center;">
          ${v.id_firma_vendedor ? `<img src="${v.id_firma_vendedor}" style="height: 26px; max-width: 100%; object-fit: contain;" crossorigin="anonymous">` : ''}
        </div>
      </div>
      <div class="center">
        <div class="text-xs bold text-slate-400">FIRMA CLI.</div>
        <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px; display: flex; justify-content: center; align-items: center;">
          ${v.id_firma_comprador ? `<img src="${v.id_firma_comprador}" style="height: 26px; max-width: 100%; object-fit: contain;" crossorigin="anonymous">` : ''}
        </div>
      </div>
    </div>

    <div class="legal">${emisor.condiciones}</div>
    <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU COMPRA!</div>
  `;
}

// Renderiza el HTML en un div oculto y lo convierte a canvas con html2canvas
async function htmlToCanvas(v, ajustesEmpresa) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 384px;
    background: white;
    z-index: -1;
  `;
  wrapper.innerHTML = buildTicketHTML(v, ajustesEmpresa);
  document.body.appendChild(wrapper);

  // Esperar a que las imágenes (logo, firmas) carguen
  const imgs = wrapper.querySelectorAll('img');
  await Promise.all([...imgs].map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));

  const canvas = await html2canvas(wrapper, {
    width: 384,
    backgroundColor: '#ffffff',
    scale: 1,
    useCORS: true,
    logging: false
  });

  document.body.removeChild(wrapper);
  return canvas;
}

// Ajusta la altura del canvas a múltiplo de 8 (requerido ESC/POS)
function alignCanvas(src) {
  const alignedH = Math.ceil(src.height / 8) * 8;
  if (alignedH === src.height) return src;
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = alignedH;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(src, 0, 0);
  return c;
}

export async function printBluetoothTicket(v, _canvasCliente = null, _canvasVendedor = null, ajustesEmpresa = null) {
  if (_isPrinting) {
    console.warn("[BT-Printer] Impresión en progreso.");
    return;
  }

  try {
    _isPrinting = true;
    await connectPrinter();

    // Renderizar el HTML exactamente igual a la vista digital
    const rawCanvas = await htmlToCanvas(v, ajustesEmpresa);
    const ticketCanvas = alignCanvas(rawCanvas);

    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: 48  // 48mm
    });

    encoder
      .initialize()
      .align('center')
      .image(ticketCanvas, ticketCanvas.width, ticketCanvas.height, 'threshold')
      .newline()
      .newline()
      .newline()
      .cut();

    await sendBytes(encoder.encode());
    console.log("[BT-Printer] ✅ Impresión enviada.");

  } catch (err) {
    console.error("[BT-Printer] Error:", err);
    alert(`Error Bluetooth: ${err.message || err}`);
  } finally {
    _isPrinting = false;
  }
}
