import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import html2canvas from 'html2canvas';
import { showToast } from './toast.js';

let _device = null;
let _characteristic = null;
let _isPrinting = false;

export function getPaperFormat() {
  return localStorage.getItem("fonebase_paper_format") || "80mm";
}

export function getPrintWidthPx() {
  return getPaperFormat() === "58mm" ? 384 : 576;
}

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
      const chars = await service.getCharacteristics();
      for (const char of chars) {
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
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      resolve(c);
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

// ============================================================
// TICKET HTML — Optimizado para impresora térmica 203 DPI
// REGLA: Solo usar #000 (negro) y #fff (blanco) — NO grises.
// El threshold convierte todo a 1 bit: gris claro = blanco = invisible.
// ============================================================
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
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

  const emisor = {
    nombre:      ajustesEmpresa?.nombre      || "MI NEGOCIO",
    nit:         ajustesEmpresa?.nit         || "900.123.456-1",
    direccion:   (ajustesEmpresa?.direccion  || "Calle 123 No. 45 - 67") + ", " + (ajustesEmpresa?.ciudad || "Bogotá - Cundinamarca"),
    contacto:    ajustesEmpresa?.contacto    || "3001234567",
    condiciones: ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
    logo:        ajustesEmpresa?.logo        || "",
    logo_size:   ajustesEmpresa?.logo_size   || 60,
    mostrar_nombre: ajustesEmpresa?.mostrar_nombre !== 0
  };

  const fmt = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);

  // Fallbacks para campos vacíos
  const cliente = v.cliente || 'Sin nombre';
  const cedula = v.cedula || 'N/A';
  const telCliente = v.telefono_cliente || v.telefono || 'N/A';
  const dirCliente = v.direccion || '—';
  const ciudadCliente = v.ciudad || '—';
  const vendedor = v.vendedor || 'Vendedor';
  const productos = v.productos || 'Producto';
  const cantidad = v.cantidad || 1;
  const factura = v.id_factura || v.idFactura || 'S/N';
  const metodo = v.metodo || 'Efectivo';

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${getPrintWidthPx()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      /* ---- Header empresa ---- */
      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      /* ---- Card genérica ---- */
      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 12px;
        border-bottom: 2px solid #000;
        padding-bottom: 3px;
      }

      .divider {
        border: none;
        border-top: 3px dashed #000;
        margin: 12px 0;
      }

      .data-row {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-bottom: 3px;
      }
      .data-label {
        font-weight: 900;
        font-size: 22px;
        color: #000;
      }

      /* ---- Productos ---- */
      .product-card {
        border: 3px solid #000;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .product-name {
        font-size: 24px;
        font-weight: 900;
        color: #000;
      }
      .product-qty {
        font-size: 24px;
        font-weight: 900;
        color: #000;
      }

      /* ---- Resumen (fondo negro) ---- */
      .summary-card {
        background: #000;
        color: #fff;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
      }
      .summary-label {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        text-transform: uppercase;
      }
      .summary-line {
        font-size: 22px;
        font-weight: 900;
        color: #fff;
      }
      .summary-discount {
        font-size: 22px;
        font-weight: 900;
        color: #fff;
      }
      .total-label {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        text-transform: uppercase;
      }
      .total-amount {
        font-size: 44px;
        font-weight: 900;
        color: #fff;
        line-height: 1;
      }

      /* ---- Firmas GRANDES ---- */
      .firma-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 12px;
      }
      .firma-col {
        flex: 1;
        text-align: center;
      }
      .firma-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
      }
      .firma-box {
        border: 3px solid #000;
        border-radius: 6px;
        height: 170px;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .firma-box img {
        height: 160px;
        max-width: 100%;
        object-fit: contain;
      }

      /* ---- Legal / Footer ---- */
      .legal {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        text-align: justify;
        margin-top: 14px;
        line-height: 1.35;
      }
      .footer {
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        color: #000;
        margin-top: 14px;
        padding-bottom: 20px;
      }

      .imei-text {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        margin-bottom: 10px;
        padding-left: 4px;
      }

      .comprobante-title {
        font-size: 24px;
        font-weight: 900;
        text-transform: uppercase;
        color: #000;
      }
      .invoice-number {
        font-size: 32px;
        font-weight: 900;
        line-height: 1.1;
        color: #000;
      }
      .invoice-meta {
        font-size: 22px;
        color: #000;
      }
    </style>

    ${emisor.logo ? `
    <div style="text-align:center; margin-bottom:12px;">
      <img src="${emisor.logo}" style="max-height:${Math.max(emisor.logo_size, 160)}px; max-width:80%; object-fit:contain; display:inline-block;" crossorigin="anonymous">
    </div>` : ''}

    <div class="header-box">
      ${emisor.mostrar_nombre ? `<div class="name">${emisor.nombre}</div>` : ''}
      <div class="info">NIT: ${emisor.nit}</div>
      <div class="info">${emisor.direccion}</div>
      <div class="info">Tel: ${emisor.contacto}</div>
    </div>

    <div class="card">
      <div class="comprobante-title">COMPROBANTE DE VENTA</div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-number">${factura}</div>
        <div class="badge">PAGADO</div>
      </div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-meta">${fechaStr}</div>
        <div class="invoice-meta bold">${metodo}</div>
      </div>
    </div>

    <div class="section-label">CLIENTE</div>
    <div class="data-row bold" style="font-size:24px;">${cliente}</div>
    <div class="data-row"><span class="data-label">ID:</span> ${cedula}</div>
    <div class="data-row"><span class="data-label">Tel:</span> ${telCliente}</div>
    <div class="data-row"><span class="data-label">Ubic:</span> ${dirCliente}, ${ciudadCliente}</div>

    <div class="section-label">VENDEDOR</div>
    <div class="data-row bold" style="font-size:24px;">${vendedor}</div>
    <div class="data-row" style="font-size:20px; font-style:italic;">Vendedor Autorizado</div>

    <hr class="divider">

    <div class="section-label">DETALLE DE PRODUCTOS</div>
    <div class="product-card">
      <div class="flex-between">
        <div class="product-name" style="width:78%;">${productos}</div>
        <div class="product-qty">x${cantidad}</div>
      </div>
    </div>

    ${imeiText && imeiText !== 'N/A' ? `
    <div class="imei-text">IMEI: ${imeiText}</div>` : ''}

    <div class="summary-card">
      <div class="flex-between" style="align-items:flex-end;">
        <div>
          <div class="summary-label">RESUMEN</div>
          <div class="summary-line">Subtotal: ${fmt(v.subtotal || v.total)}</div>
          <div class="summary-discount">Desc: -${fmt(v.descuento || 0)}</div>
        </div>
        <div style="text-align:right;">
          <div class="total-label">TOTAL</div>
          <div class="total-amount">${fmt(v.total)}</div>
        </div>
      </div>
    </div>

    <div class="firma-grid">
      <div class="firma-col">
        <div class="firma-label">FIRMA VENDEDOR</div>
        <div class="firma-box">
          ${v.id_firma_vendedor ? `<img src="${v.id_firma_vendedor}" crossorigin="anonymous">` : ''}
        </div>
      </div>
      <div class="firma-col">
        <div class="firma-label">FIRMA CLIENTE</div>
        <div class="firma-box">
          ${v.id_firma_comprador ? `<img src="${v.id_firma_comprador}" crossorigin="anonymous">` : ''}
        </div>
      </div>
    </div>

    <div class="legal">${emisor.condiciones}</div>
    <div class="footer">¡GRACIAS POR SU COMPRA!</div>
  `;
}

async function htmlToCanvas(v, ajustesEmpresa) {
  const widthPx = getPrintWidthPx();
  const wrapper = document.createElement('div');
  wrapper.className = 'ticket-container';
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${widthPx}px;
    background: white;
    z-index: -1;
  `;
  wrapper.innerHTML = buildTicketHTML(v, ajustesEmpresa);
  document.body.appendChild(wrapper);

  // Esperar a que carguen imágenes (logo, firmas)
  const imgs = wrapper.querySelectorAll('img');
  await Promise.all([...imgs].map(img =>
    img.complete
      ? Promise.resolve()
      : new Promise(r => { img.onload = r; img.onerror = r; })
  ));

  const canvas = await html2canvas(wrapper, {
    width: widthPx,
    windowWidth: widthPx,
    backgroundColor: '#ffffff',
    scale: 1,
    useCORS: true,
    logging: false,
    allowTaint: false,
  });

  document.body.removeChild(wrapper);
  return canvas;
}

// La altura debe ser múltiplo de 8 para ESC/POS bitmap
function alignHeight(src) {
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

    const rawCanvas = await htmlToCanvas(v, ajustesEmpresa);
    const ticketCanvas = alignHeight(rawCanvas);

    console.log(`[BT-Printer] Canvas: ${ticketCanvas.width}x${ticketCanvas.height}px`);

    const widthPx = getPrintWidthPx();
    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: widthPx === 576 ? 48 : 32,
    });

    encoder
      .initialize()
      .align('center')
      .image(ticketCanvas, widthPx, ticketCanvas.height, 'threshold')
      .newline()
      .newline()
      .newline()
      .cut();

    await sendBytes(encoder.encode());
    console.log("[BT-Printer] ✅ Impresión enviada.");

  } catch (err) {
    console.error("[BT-Printer] Error:", err);
    showToast(`Error Bluetooth: ${err.message || err}`, "error");
  } finally {
    _isPrinting = false;
  }
}

function buildTechnicalTicketHTML(s, ajustesEmpresa = null) {
  const now = new Date();
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

  const emisor = {
    nombre:      ajustesEmpresa?.nombre      || "MI NEGOCIO",
    nit:         ajustesEmpresa?.nit         || "900.123.456-1",
    direccion:   (ajustesEmpresa?.direccion  || "Calle 123 No. 45 - 67") + ", " + (ajustesEmpresa?.ciudad || "Bogotá - Cundinamarca"),
    contacto:    ajustesEmpresa?.contacto    || "3001234567",
    condiciones: ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
    logo:        ajustesEmpresa?.logo        || "",
    logo_size:   ajustesEmpresa?.logo_size   || 60,
    mostrar_nombre: ajustesEmpresa?.mostrar_nombre !== 0
  };

  const fmt = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);
  const saldo = (s.precio_final || 0) - (s.abono || 0);
  const st = (s.estado || "").trim();

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${getPrintWidthPx()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      /* ---- Header empresa ---- */
      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      /* ---- Card genérica ---- */
      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 12px;
        border-bottom: 2px solid #000;
        padding-bottom: 3px;
      }

      .divider {
        border: none;
        border-top: 3px dashed #000;
        margin: 12px 0;
      }

      .data-row {
        margin-bottom: 4px;
        font-size: 22px;
        font-weight: 900;
      }
      .data-label {
        font-weight: 900;
        text-transform: uppercase;
        font-size: 18px;
        margin-right: 4px;
      }

      /* ---- Totales ---- */
      .summary-card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-top: 12px;
      }

      /* ---- Firmas GRANDES ---- */
      .firma-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 12px;
      }
      .firma-col {
        flex: 1;
        text-align: center;
      }
      .firma-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
      }
      .firma-box {
        border: 3px solid #000;
        border-radius: 6px;
        height: 170px;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      /* ---- Legal / Footer ---- */
      .legal {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        text-align: justify;
        margin-top: 14px;
        line-height: 1.35;
      }
      .footer {
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        color: #000;
        margin-top: 14px;
        padding-bottom: 20px;
      }
    </style>

    ${emisor.logo ? `
    <div style="text-align:center; margin-bottom:12px;">
      <img src="${emisor.logo}" style="max-height:${Math.max(emisor.logo_size, 160)}px; max-width:80%; object-fit:contain; display:inline-block;" crossorigin="anonymous">
    </div>` : ''}

    <div class="header-box">
      ${emisor.mostrar_nombre ? `<div class="name">${emisor.nombre}</div>` : ''}
      <div class="info">NIT: ${emisor.nit}</div>
      <div class="info">${emisor.direccion}</div>
      <div class="info">Tel: ${emisor.contacto}</div>
    </div>

    <div class="card">
      <div class="bold text-xl uppercase">SERVICIO TÉCNICO</div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="bold text-2xl">${s.id_orden}</div>
        <div class="badge">${st}</div>
      </div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="text-sm font-bold">${fechaStr}</div>
        <div class="text-sm font-bold">SOPORTE</div>
      </div>
    </div>

    <div class="section-label">CLIENTE</div>
    <div class="data-row bold" style="font-size:24px;">${s.cliente}</div>
    <div class="data-row"><span class="data-label">Tel:</span> ${s.telefono || 'N/A'}</div>

    <div class="section-label">DISPOSITIVO</div>
    <div class="data-row bold" style="font-size:24px;">${s.equipo}</div>
    <div class="data-row"><span class="data-label">IMEI/S:</span> ${s.imei_serie || 'N/A'}</div>
    ${s.clave_patron ? `<div class="data-row"><span class="data-label">CLAVE:</span> ${s.clave_patron}</div>` : ''}

    <hr class="divider">

    <div class="section-label">DETALLES DEL TRABAJO</div>
    <div class="card" style="font-size:22px; line-height:1.4;">
      <div class="bold" style="font-size:18px; text-transform:uppercase;">Falla Reportada:</div>
      <div>${s.falla}</div>
      ${s.repuestos ? `
        <div class="bold" style="font-size:18px; text-transform:uppercase; margin-top:8px; border-top:2px dashed #000; padding-top:4px;">Repuestos Utilizados:</div>
        <div>${s.repuestos}</div>
      ` : ''}
    </div>

    <div class="summary-card">
      <div class="flex-between">
        <div>
          <div class="bold text-sm uppercase">Resumen de Pago</div>
          <div style="font-size:20px; margin-top:4px;">Costo Total: ${fmt(s.precio_final)}</div>
          <div style="font-size:20px; font-weight:900;">Abonado: -${fmt(s.abono)}</div>
        </div>
        <div style="text-align: right;">
          <div class="bold text-sm uppercase">Saldo Pendiente</div>
          <div class="text-2xl bold">${fmt(saldo)}</div>
        </div>
      </div>
    </div>

    <div class="firma-grid" style="margin-top:16px;">
      <div class="firma-col">
        <div class="firma-label">FIRMA TÉCNICO</div>
        <div class="firma-box"></div>
      </div>
      <div class="firma-col">
        <div class="firma-label">FIRMA CLIENTE</div>
        <div class="firma-box"></div>
      </div>
    </div>

    <div class="legal">
      ${emisor.condiciones}
      <p style="margin-top:6px; font-style:italic; text-align:center;">Conserve este ticket para reclamar su equipo.</p>
    </div>
    <div class="footer">¡GRACIAS POR SU CONFIANZA!</div>
  `;
}

export async function printBluetoothTechnicalTicket(s, ajustesEmpresa = null) {
  if (_isPrinting) {
    console.warn("[BT-Printer] Impresión en progreso.");
    return;
  }

  try {
    _isPrinting = true;
    await connectPrinter();

    const widthPx = getPrintWidthPx();
    const wrapper = document.createElement('div');
    wrapper.className = 'ticket-container';
    wrapper.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${widthPx}px;
      background: white;
      z-index: -1;
    `;
    wrapper.innerHTML = buildTechnicalTicketHTML(s, ajustesEmpresa);
    document.body.appendChild(wrapper);

    const imgs = wrapper.querySelectorAll('img');
    await Promise.all([...imgs].map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(r => { img.onload = r; img.onerror = r; })
    ));

    const rawCanvas = await html2canvas(wrapper, {
      width: widthPx,
      windowWidth: widthPx,
      backgroundColor: '#ffffff',
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: false,
    });

    document.body.removeChild(wrapper);
    const ticketCanvas = alignHeight(rawCanvas);

    console.log(`[BT-Printer] Technical Canvas: ${ticketCanvas.width}x${ticketCanvas.height}px`);

    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: widthPx === 576 ? 48 : 32,
    });

    encoder
      .initialize()
      .align('center')
      .image(ticketCanvas, widthPx, ticketCanvas.height, 'threshold')
      .newline()
      .newline()
      .newline()
      .cut();

    await sendBytes(encoder.encode());
    console.log("[BT-Printer] ✅ Impresión de Servicio Técnico enviada.");

  } catch (err) {
    console.error("[BT-Printer] Error en ticket técnico:", err);
    showToast(`Error Bluetooth: ${err.message || err}`, "error");
  } finally {
    _isPrinting = false;
  }
}

export async function printBluetoothAbonoTicket(cred, monto, nota, ajustesEmpresa = null) {
  if (_isPrinting) {
    console.warn("[BT-Printer] Impresión en progreso.");
    return;
  }

  try {
    _isPrinting = true;
    await connectPrinter();

    const widthPx = getPrintWidthPx();
    const wrapper = document.createElement('div');
    wrapper.className = 'ticket-container';
    wrapper.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${widthPx}px;
      background: white;
      z-index: -1;
    `;
    wrapper.innerHTML = buildAbonoTicketHTML(cred, monto, nota, ajustesEmpresa);
    document.body.appendChild(wrapper);

    // Esperar a que carguen imágenes
    const imgs = wrapper.querySelectorAll('img');
    await Promise.all([...imgs].map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    ));

    const rawCanvas = await html2canvas(wrapper, {
      width: widthPx,
      windowWidth: widthPx,
      backgroundColor: '#ffffff',
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: false,
    });
    document.body.removeChild(wrapper);

    const ticketCanvas = alignHeight(rawCanvas);

    console.log(`[BT-Printer] Abono Canvas: ${ticketCanvas.width}x${ticketCanvas.height}px`);

    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: widthPx === 576 ? 48 : 32,
    });

    encoder
      .initialize()
      .align('center')
      .image(ticketCanvas, widthPx, ticketCanvas.height, 'threshold')
      .newline()
      .newline()
      .newline()
      .cut();

    await sendBytes(encoder.encode());
    console.log("[BT-Printer] ✅ Impresión de abono enviada.");

  } catch (err) {
    console.error("[BT-Printer] Error en ticket abono:", err);
    showToast(`Error Bluetooth: ${err.message || err}`, "error");
    throw err;
  } finally {
    _isPrinting = false;
  }
}

function parseHistorialLocal(raw) {
  if (!raw) return [];
  return raw.split(";").filter(Boolean).map(e => {
    const parts = e.split("|");
    return { 
      fecha: parts[0] || "", 
      monto: parseFloat(parts[1]) || 0, 
      nota: parts[2] || "", 
      metodo: parts[3] || "Efectivo",
      evidencia: parts[4] || ""
    };
  });
}

function buildAbonoTicketHTML(cred, monto, nota, ajustesEmpresa = null) {
  const now = new Date();
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  
  const emisor = {
    nombre: ajustesEmpresa?.nombre || "MI NEGOCIO",
    nit: ajustesEmpresa?.nit || "900.123.456-1",
    direccion: (ajustesEmpresa?.direccion || "Calle 123 No. 45 - 67") + ", " + (ajustesEmpresa?.ciudad || "Bogotá - Cundinamarca"),
    contacto: ajustesEmpresa?.contacto || "3001234567",
    logo: ajustesEmpresa?.logo || "",
    logo_size: ajustesEmpresa?.logo_size || 60,
    mostrar_nombre: ajustesEmpresa?.mostrar_nombre !== 0
  };

  const fmt = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);
  const hist = parseHistorialLocal(cred.historialAbonos);

  let histHtml = hist.map((a, idx) => `
    <tr style="border-bottom: 2px solid #000;">
      <td style="padding: 6px 0; text-align: left; vertical-align: top; font-size: 20px;">
        <div class="bold">#${idx + 1} - ${a.fecha}</div>
        <div style="font-size: 18px; margin-top: 2px;">
          <span style="background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 900; font-size: 16px; text-transform: uppercase;">${a.metodo || 'Efectivo'}</span>
          ${a.nota ? '• ' + a.nota : ''}
        </div>
      </td>
      <td style="text-align: right; padding: 6px 0; font-weight: 900; font-size: 22px; vertical-align: bottom;">
        ${fmt(a.monto)}
      </td>
    </tr>
  `).join("");

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${getPrintWidthPx()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .badge-error {
        border: 3px solid #000;
        color: #000;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-title {
        font-size: 18px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 4px;
        margin-top: 8px;
        border-bottom: 2px solid #000;
        padding-bottom: 2px;
      }

      .summary-card {
        background: #000;
        color: #fff;
        border-radius: 8px;
        padding: 10px;
        margin-top: 12px;
      }
    </style>
    <div class="ticket-container">
      <!-- Logo -->
      ${emisor.logo ? `
      <div style="text-align: center; margin-bottom: 6px;">
        <img src="${emisor.logo}" style="max-height: ${emisor.logo_size || 60}px; max-width: 100%; object-fit: contain;">
      </div>
      ` : ''}
      <div class="header-box">
        ${emisor.mostrar_nombre ? `<div class="name">${emisor.nombre}</div>` : ''}
        <div class="info">
          <div>NIT: ${emisor.nit}</div>
          <div>${emisor.direccion}</div>
          <div>Tel: ${emisor.contacto}</div>
        </div>
      </div>

      <!-- Header / Comprobante -->
      <div class="card">
        <div class="bold" style="font-size: 26px; color: #000; text-transform: uppercase; text-align: center; margin-bottom: 4px;">RECIBO DE ABONO</div>
        <div class="flex-between">
          <div class="bold" style="font-size: 22px;">${cred.tipo === 'Plan Separe' ? 'PLAN SEPARE' : 'CRÉDITO'}</div>
          <div class="${cred.saldo <= 0 ? 'badge' : 'badge-error'}">${cred.saldo <= 0 ? (cred.tipo === 'Plan Separe' ? 'ENTREGADO' : 'PAGADO') : 'PENDIENTE'}</div>
        </div>
        <div class="flex-between" style="margin-top: 6px; font-size: 18px;">
          <div>Fecha: ${fechaStr}</div>
          <div>Ref: ${cred.idFactura || 'S/N'}</div>
        </div>
      </div>

      <!-- Info Cliente -->
      <div style="font-size: 20px; margin-bottom: 8px;">
        <div class="section-title">CLIENTE</div>
        <div class="bold">${cred.cliente}</div>
        <div>ID: ${cred.telefono || ''}</div>
      </div>
      
      <!-- Detalle Producto -->
      <div style="font-size: 20px; margin-bottom: 8px;">
        <div class="section-title">PRODUCTO / DETALLE</div>
        <div class="bold">${cred.detalle || 'Pago de deuda'}</div>
      </div>

      <!-- Historial de Abonos -->
      <div class="section-title">HISTORIAL DE PAGOS</div>
      <table style="width: 100%; border-collapse: collapse;">
        ${histHtml}
      </table>

      <!-- Resumen Financiero -->
      <div class="summary-card" style="font-size: 22px;">
        <div class="flex-between">
          <span>Valor Total:</span>
          <span class="bold">${fmt(cred.total)}</span>
        </div>
        <div class="flex-between" style="margin-top: 4px;">
          <span>Total Abonado:</span>
          <span class="bold">${fmt(cred.abonado)}</span>
        </div>
        <div class="flex-between" style="border-top: 2px dashed #fff; margin-top: 6px; padding-top: 6px; font-size: 24px;">
          <span class="bold">SALDO PENDIENTE:</span>
          <span class="bold" style="font-size: 28px;">${fmt(cred.saldo)}</span>
        </div>
      </div>

      <div class="center bold" style="margin-top: 20px; font-size: 18px; font-style: italic;">
        ${cred.tipo === 'Plan Separe' ? 'El producto se entregará al completar el pago total.' : 'Conserve este recibo como soporte de pago.'}
      </div>
      <div class="center bold" style="margin-top: 15px; font-size: 22px; border: 2px solid #000; padding: 4px; border-radius: 4px;">¡GRACIAS POR SU PAGO!</div>
    </div>
  `;
}
