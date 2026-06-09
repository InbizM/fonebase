import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

let _device = null;
let _characteristic = null;
let _isPrinting = false;

// UUIDs comunes para impresoras térmicas Bluetooth (GOOJPRT y similares)
const PRINTER_SERVICES = [
  0x18f0,
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '000018f0-0000-1000-8000-00805f9b34fb', // Generico / MTP-2
  '0000ffe0-0000-1000-8000-00805f9b34fb', // UART / FFE0
  '0000fee7-0000-1000-8000-00805f9b34fb', // Generico
  '0000ff00-0000-1000-8000-00805f9b34fb', // Generico
  '00004953-5443-4e45-5246-454c42494c49'  // ISSC
];

export async function connectPrinter() {
  if (_device && _device.gatt.connected) return true;

  try {
    if (!navigator.bluetooth) {
      throw new Error("Tu navegador o PC no soporta Web Bluetooth. Usa Chrome/Edge y verifica que el Bluetooth esté encendido.");
    }
    
    console.log("[BT-Printer] Iniciando escaneo...");
    _device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PRINTER_SERVICES
    });

    console.log(`[BT-Printer] Conectando a ${_device.name}...`);
    const server = await _device.gatt.connect();

    // ESCANEO DINÁMICO DE SERVICIOS Y CARACTERÍSTICAS
    for (const serviceUuid of PRINTER_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        console.log(`[BT-Printer] Explorando servicio: ${serviceUuid}`);
        
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          console.log(`[BT-Printer] Evaluando característica: ${char.uuid}`, char.properties);
          if (char.properties.write || char.properties.writeWithoutResponse) {
            _characteristic = char;
            console.log(`[BT-Printer] ✅ CANAL DE ESCRITURA ENCONTRADO: ${char.uuid}`);
            return true;
          }
        }
      } catch (e) {
        // Ignorar si el servicio no existe
      }
    }

    throw new Error("No se detectó un canal de escritura válido en los servicios de la impresora.");
  } catch (err) {
    console.error("[BT-Printer] Fallo crítico:", err);
    _device = null;
    _characteristic = null;
    throw err; // Propagar error para que lo atrape la función principal
  }
}

// Función para convertir URL de imagen (Drive) a Canvas para el encoder
export async function imageToCanvas(url) {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function sendBytes(bytes) {
  if (!_characteristic) throw new Error("Impresora no conectada.");

  // Las impresoras Bluetooth tienen un MTU limitado (generalmente 20 o 512 bytes)
  // Dividimos en trozos de 100 bytes para seguridad y estabilidad
  const CHUNK_SIZE = 100;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.slice(i, i + CHUNK_SIZE);
    await _characteristic.writeValue(chunk);
    // Pequeño delay para que el buffer de la impresora no se desborde
    await new Promise(r => setTimeout(r, 20));
  }
}

async function generateReceiptCanvas(v, firmaC, firmaV) {
  const width = 384;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = 3000;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'top';

  let y = 10;
  
  // Header
  ctx.textAlign = 'center';
  ctx.font = '900 34px sans-serif';
  ctx.fillText('CLAROCELL.COM', width/2, y); y += 40;
  
  ctx.font = '22px sans-serif';
  ctx.fillText(v.emisor?.propietario || 'Yeison Rangel Rangel', width/2, y); y += 28;
  ctx.font = '900 22px sans-serif';
  ctx.fillText(`NIT: ${v.emisor?.nit || '1193400777-2'}`, width/2, y); y += 28;
  ctx.font = '22px sans-serif';
  ctx.fillText(v.emisor?.direccion || 'Calle 12 No. 10 - 108', width/2, y); y += 28;
  ctx.fillText(`Tel: ${v.emisor?.contacto || '3016807310'}`, width/2, y); y += 35;
  
  // Divider Solid
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 15;
  
  // Factura Info (Grid-like)
  ctx.textAlign = 'left';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('FACT:', 10, y);
  ctx.font = '24px sans-serif';
  ctx.fillText(`${v.idFactura || v.id_factura}`, 90, y); y += 30;
  
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('FECHA:', 10, y);
  ctx.font = '24px sans-serif';
  ctx.fillText(`${new Date(v.fecha || Date.now()).toLocaleString('es-CO')}`, 90, y); y += 35;
  
  // Divider Dashed
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 15;
  ctx.setLineDash([]);
  
  // Client Info
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CLI:', 10, y);
  ctx.font = '900 24px sans-serif';
  ctx.fillText(`${v.cliente}`, 70, y); y += 30;
  
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CC:', 10, y);
  ctx.font = '24px sans-serif';
  ctx.fillText(`${v.cedula}`, 70, y); y += 30;
  
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('DIR:', 10, y);
  ctx.font = '24px sans-serif';
  ctx.fillText(`${v.direccion || '—'}, ${v.ciudad || '—'}`, 70, y); y += 30;
  
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('TEL:', 10, y);
  ctx.font = '24px sans-serif';
  ctx.fillText(`${v.telefono || v.telefono_cliente || 'N/A'}`, 70, y); y += 35;
  
  // Divider Solid
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 15;

  // Items
  const items = Array.isArray(v.items) ? v.items : [{nombre: v.productos, qty: v.cantidad || 1}];
  for (const i of items) {
    ctx.textAlign = 'left';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(`${i.nombre.substring(0, 24)}`, 10, y); y += 30;
    
    ctx.font = '24px sans-serif';
    ctx.fillText(`${i.qty} x $${new Intl.NumberFormat('es-CO').format(v.total / (i.qty || 1))}`, 10, y);
    
    ctx.textAlign = 'right';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(`$${new Intl.NumberFormat('es-CO').format(v.total)}`, width - 10, y); y += 40;
  }
  
  // Divider Dashed
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 15;
  ctx.setLineDash([]);
  
  // Totals
  ctx.textAlign = 'right';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('SUBTOTAL:', 200, y);
  ctx.font = '900 24px sans-serif';
  ctx.fillText(`$${new Intl.NumberFormat('es-CO').format(v.subtotal || v.total)}`, width - 10, y); y += 35;
  
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('DESC:', 200, y);
  ctx.font = '900 24px sans-serif';
  ctx.fillText(`-$${new Intl.NumberFormat('es-CO').format(v.descuento || 0)}`, width - 10, y); y += 40;
  
  ctx.font = '900 30px sans-serif';
  ctx.fillText('TOTAL:', 180, y);
  ctx.fillText(`$${new Intl.NumberFormat('es-CO').format(v.total)}`, width - 10, y); y += 45;
  
  // IMEIs
  const imeiStr = typeof v.imeis === 'string' ? v.imeis : JSON.stringify(v.imeis || {});
  if (imeiStr && imeiStr !== 'N/A' && imeiStr !== '{}') {
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 15;
    ctx.setLineDash([]);
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`IMEIs: ${imeiStr.substring(0, 40)}`, 10, y); y += 35;
  }
  
  // Divider Solid
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); y += 20;
  
  // Signatures
  ctx.textAlign = 'center';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('FIRMAS LEGALES', width/2, y); y += 30;
  
  if (firmaV && firmaV.width > 0) {
    const aspect = firmaV.height / firmaV.width;
    const sigHeight = Math.min(160, 300 * aspect); // Max height 160px
    ctx.drawImage(firmaV, 42, y, 300, sigHeight);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('VENDEDOR', width/2, y + sigHeight + 10);
    y += sigHeight + 40;
  }
  
  if (firmaC && firmaC.width > 0) {
    const aspect = firmaC.height / firmaC.width;
    const sigHeight = Math.min(160, 300 * aspect);
    ctx.drawImage(firmaC, 42, y, 300, sigHeight);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('COMPRADOR', width/2, y + sigHeight + 10);
    y += sigHeight + 40;
  }
  
  // Legal
  ctx.textAlign = 'left';
  ctx.font = '22px sans-serif';
  const legal = 'GARANTIA: Equipos probados y encendidos. Sin garantia en displays/tactiles o equipos apagados. Este doc. se asimila a letra de cambio (Art. 774 C.Comercio).';
  const words = legal.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 20 && n > 0) {
      ctx.fillText(line, 10, y);
      line = words[n] + ' ';
      y += 28;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 10, y); y += 45;
  
  // Footer
  ctx.textAlign = 'center';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('¡GRACIAS POR SU COMPRA!', width/2, y); y += 50;

  // Crop final canvas
  const finalHeight = Math.ceil(y / 8) * 8;
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = width;
  finalCanvas.height = finalHeight;
  const fctx = finalCanvas.getContext('2d');
  fctx.fillStyle = 'white';
  fctx.fillRect(0, 0, width, finalHeight);
  fctx.drawImage(canvas, 0, 0);
  
  return finalCanvas;
}

export async function printBluetoothTicket(v, canvasCliente = null, canvasVendedor = null) {
  if (_isPrinting) {
    console.warn("[BT-Printer] Impresión en progreso, ignorando nueva petición.");
    return;
  }
  
  try {
    _isPrinting = true;
    await connectPrinter();

    const receiptCanvas = await generateReceiptCanvas(v, canvasCliente, canvasVendedor);

    const encoder = new ReceiptPrinterEncoder({
      language: 'esc-pos',
      width: 32 // 58mm
    });

    encoder
      .initialize()
      .image(receiptCanvas, 384, receiptCanvas.height, 'threshold')
      .newline()
      .newline()
      .newline()
      .cut();

    const result = encoder.encode();
    await sendBytes(result);
    console.log("[BT-Printer] Impresión enviada con éxito.");

  } catch (err) {
    console.error("[BT-Printer] Fallo al imprimir:", err);
    alert(`Error Bluetooth: ${err.message || err}`);
  } finally {
    _isPrinting = false;
  }
}
