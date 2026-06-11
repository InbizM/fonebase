import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import html2canvas from 'html2canvas';

let _device = null;
let _characteristic = null;
let _isPrinting = false;

// La impresora GOOJPRT MTP-II tiene exactamente 384 dots por línea a 203 DPI
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
    logo_size:   ajustesEmpresa?.logo_size   || 40
  };

  const fmt = (n) => '$' + new Intl.NumberFormat('es-CO').format(n || 0);

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        width: ${PRINT_WIDTH_PX}px;
        background: #fff;
        padding: 10px 10px 0 10px;
        font-size: 18px;
        color: #1e293b;
        line-height: 1.4;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }
      .small { font-size: 14px; }
      .xsmall { font-size: 12px; }
      .muted { color: #64748b; }
      .red { color: #dc2626; }

      .header-box {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 8px;
        background: #f8fafc;
        text-align: center;
        font-size: 14px;
        line-height: 1.4;
      }
      .header-box .name {
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
        color: #000;
      }

      .card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 8px;
        background: #f8fafc;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .badge {
        background: #dcfce7;
        color: #166534;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .section-label {
        font-size: 11px;
        font-weight: 900;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 6px;
      }
      .divider {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 8px 0;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 8px;
      }
      .product-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 6px;
      }
      .summary-card {
        background: #0f172a;
        color: white;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
      }
      .total-amount {
        font-size: 28px;
        font-weight: 900;
        color: white;
        line-height: 1;
      }
      .firma-box {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background: #f8fafc;
        height: 52px;
        margin-top: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .firma-box img {
        height: 44px;
        max-width: 100%;
        object-fit: contain;
      }
      .legal {
        font-size: 11px;
        color: #64748b;
        text-align: justify;
        margin-top: 10px;
        line-height: 1.3;
      }
      .footer {
        text-align: center;
        font-size: 18px;
        font-weight: 900;
        margin-top: 10px;
        padding-bottom: 12px;
      }
    </style>

    ${emisor.logo ? `
    <div style="text-align:center; margin-bottom:8px;">
      <img src="${emisor.logo}" style="max-height:${emisor.logo_size}px; max-width:100%; object-fit:contain;" crossorigin="anonymous">
    </div>` : ''}

    <div class="header-box">
      <div class="name">${emisor.nombre}</div>
      <div>NIT: ${emisor.nit}</div>
      <div>${emisor.direccion}</div>
      <div>Tel: ${emisor.contacto}</div>
    </div>

    <div class="card">
      <div class="small bold red" style="text-transform:uppercase;">COMPROBANTE DE VENTA</div>
      <div class="flex-between" style="margin-top:4px;">
        <div class="bold" style="font-size:20px; line-height:1.1;">${v.id_factura || v.idFactura}</div>
        <div class="badge">PAGADO</div>
      </div>
      <div class="flex-between" style="margin-top:4px;">
        <div class="small muted">${fechaStr}</div>
        <div class="small bold">${v.metodo || 'Efectivo'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-label">INFORMACIÓN DEL CLIENTE</div>
        <div class="bold" style="font-size:16px;">${v.cliente}</div>
        <div class="xsmall muted">ID: ${v.cedula}</div>
        <div class="xsmall muted">Tel: ${v.telefono_cliente || v.telefono || 'N/A'}</div>
        <div class="xsmall muted">Ubicación: ${v.direccion || '—'}, ${v.ciudad || '—'}</div>
      </div>
      <div>
        <div class="section-label">ATENDIDO POR</div>
        <div class="bold" style="font-size:16px;">${v.vendedor || 'Vendedor'}</div>
        <div class="xsmall muted" style="font-style:italic;">Vendedor Autorizado</div>
        <div class="xsmall bold red" style="background:#fef2f2; display:inline-block; padding:1px 6px; border-radius:4px; margin-top:3px;">DIGITAL</div>
      </div>
    </div>

    <hr class="divider">

    <div class="section-label">DETALLE DE PRODUCTOS</div>
    <div class="product-card">
      <div class="flex-between">
        <div class="bold" style="font-size:16px; width:80%;">${v.productos}</div>
        <div class="bold" style="font-size:16px;">x${v.cantidad || 1}</div>
      </div>
    </div>

    ${imeiText && imeiText !== 'N/A' ? `
    <div class="small bold red" style="margin-top:-2px; margin-bottom:6px; margin-left:4px;">
      IMEI/SERIE: ${imeiText}
    </div>` : ''}

    <div class="summary-card">
      <div class="flex-between" style="align-items:flex-end;">
        <div>
          <div class="section-label" style="color:#94a3b8; margin-top:0;">RESUMEN FINANCIERO</div>
          <div class="small" style="color:#cbd5e1;">Subtotal: ${fmt(v.subtotal || v.total)}</div>
          <div class="small bold" style="color:#f87171;">Descuento: -${fmt(v.descuento || 0)}</div>
        </div>
        <div style="text-align:right;">
          <div class="section-label" style="color:#94a3b8; margin-top:0; margin-bottom:2px;">TOTAL COBRADO</div>
          <div class="total-amount">${fmt(v.total)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="center">
        <div class="xsmall bold muted">FIRMA VEND.</div>
        <div class="firma-box">
          ${v.id_firma_vendedor ? `<img src="${v.id_firma_vendedor}" crossorigin="anonymous">` : ''}
        </div>
      </div>
      <div class="center">
        <div class="xsmall bold muted">FIRMA CLI.</div>
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
      width: PRINT_WIDTH_PX,  // 384 dots — ancho real del cabezal
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
