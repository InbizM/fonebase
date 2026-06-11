import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import html2canvas from 'html2canvas';

let _device = null;
let _characteristic = null;
let _isPrinting = false;

// GOOJPRT MTP-II: 384 dots por línea, 203 DPI, 48mm imprimible
const PRINT_WIDTH_PX = 384;

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
// TICKET HTML — Fuentes optimizadas para 203 DPI (48mm papel)
// 1px CSS = 1 dot impresora = 0.125mm
// Para texto legible: mínimo 20px (~2.5mm), ideal 24-28px (~3-3.5mm)
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
    nombre:      ajustesEmpresa?.nombre      || "WAYIRA PHONE",
    nit:         ajustesEmpresa?.nit         || "1193400777-2",
    direccion:   (ajustesEmpresa?.direccion  || "Calle 12 No. 10 - 108") + ", " + (ajustesEmpresa?.ciudad || "Maicao - La Guajira"),
    contacto:    ajustesEmpresa?.contacto    || "3016807310",
    condiciones: ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
    logo:        ajustesEmpresa?.logo        || "",
    logo_size:   ajustesEmpresa?.logo_size   || 60
  };

  const fmt = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        width: ${PRINT_WIDTH_PX}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        color: #000;
        line-height: 1.35;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      /* ---- Header empresa ---- */
      .header-box {
        border: 2px solid #555;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 20px;
        margin-top: 2px;
      }

      /* ---- Card genérica ---- */
      .card {
        border: 2px solid #555;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .badge {
        background: #000;
        color: #fff;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 18px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-label {
        font-size: 16px;
        font-weight: 900;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 10px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 2px;
      }

      .divider {
        border: none;
        border-top: 2px dashed #999;
        margin: 10px 0;
      }

      .data-row {
        font-size: 20px;
        margin-bottom: 2px;
      }
      .data-label {
        font-weight: 900;
        font-size: 18px;
        color: #555;
      }

      /* ---- Productos ---- */
      .product-card {
        border: 2px solid #555;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 8px;
      }
      .product-name {
        font-size: 22px;
        font-weight: 900;
      }
      .product-qty {
        font-size: 22px;
        font-weight: 900;
      }

      /* ---- Resumen (fondo oscuro) ---- */
      .summary-card {
        background: #000;
        color: #fff;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
      }
      .summary-label {
        font-size: 16px;
        font-weight: 900;
        color: #aaa;
        text-transform: uppercase;
      }
      .summary-line {
        font-size: 20px;
        color: #ddd;
      }
      .summary-discount {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
      }
      .total-label {
        font-size: 16px;
        font-weight: 900;
        color: #aaa;
        text-transform: uppercase;
      }
      .total-amount {
        font-size: 40px;
        font-weight: 900;
        color: #fff;
        line-height: 1;
      }

      /* ---- Firmas ---- */
      .firma-grid {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .firma-col {
        flex: 1;
        text-align: center;
      }
      .firma-label {
        font-size: 16px;
        font-weight: 900;
        color: #666;
      }
      .firma-box {
        border: 2px solid #999;
        border-radius: 6px;
        height: 60px;
        margin-top: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .firma-box img {
        height: 52px;
        max-width: 100%;
        object-fit: contain;
      }

      /* ---- Legal / Footer ---- */
      .legal {
        font-size: 16px;
        color: #555;
        text-align: justify;
        margin-top: 10px;
        line-height: 1.25;
      }
      .footer {
        text-align: center;
        font-size: 26px;
        font-weight: 900;
        margin-top: 12px;
        padding-bottom: 16px;
      }

      .imei-text {
        font-size: 18px;
        font-weight: 900;
        margin-bottom: 8px;
        padding-left: 4px;
      }

      .comprobante-title {
        font-size: 22px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .invoice-number {
        font-size: 30px;
        font-weight: 900;
        line-height: 1.1;
      }
      .invoice-meta {
        font-size: 20px;
      }
    </style>

    ${emisor.logo ? `
    <div style="text-align:center; margin-bottom:10px;">
      <img src="${emisor.logo}" style="max-height:${Math.max(emisor.logo_size, 60)}px; max-width:90%; object-fit:contain;" crossorigin="anonymous">
    </div>` : ''}

    <div class="header-box">
      <div class="name">${emisor.nombre}</div>
      <div class="info">NIT: ${emisor.nit}</div>
      <div class="info">${emisor.direccion}</div>
      <div class="info">Tel: ${emisor.contacto}</div>
    </div>

    <div class="card">
      <div class="comprobante-title">COMPROBANTE DE VENTA</div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-number">${v.id_factura || v.idFactura}</div>
        <div class="badge">PAGADO</div>
      </div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-meta">${fechaStr}</div>
        <div class="invoice-meta bold">${v.metodo || 'Efectivo'}</div>
      </div>
    </div>

    <div class="section-label">CLIENTE</div>
    <div class="data-row bold">${v.cliente}</div>
    <div class="data-row"><span class="data-label">ID:</span> ${v.cedula}</div>
    <div class="data-row"><span class="data-label">Tel:</span> ${v.telefono_cliente || v.telefono || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Ubic:</span> ${v.direccion || '—'}, ${v.ciudad || '—'}</div>

    <div class="section-label">VENDEDOR</div>
    <div class="data-row bold">${v.vendedor || 'Vendedor'}</div>
    <div class="data-row" style="font-size:18px; color:#666; font-style:italic;">Vendedor Autorizado</div>

    <hr class="divider">

    <div class="section-label">DETALLE DE PRODUCTOS</div>
    <div class="product-card">
      <div class="flex-between">
        <div class="product-name" style="width:80%;">${v.productos}</div>
        <div class="product-qty">x${v.cantidad || 1}</div>
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
        <div class="firma-label">FIRMA VEND.</div>
        <div class="firma-box">
          ${v.id_firma_vendedor ? `<img src="${v.id_firma_vendedor}" crossorigin="anonymous">` : ''}
        </div>
      </div>
      <div class="firma-col">
        <div class="firma-label">FIRMA CLI.</div>
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
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${PRINT_WIDTH_PX}px;
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
    width: PRINT_WIDTH_PX,
    windowWidth: PRINT_WIDTH_PX,
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

    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: 48,  // 48 columnas de texto para impresora 58mm
    });

    encoder
      .initialize()
      .align('center')
      .image(ticketCanvas, PRINT_WIDTH_PX, ticketCanvas.height, 'threshold')
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
