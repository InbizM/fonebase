import { showToast } from "./toast.js";

// ============================================================
// api.js — FoneBase API Service (V12 EXPENSES ID FIX)
// ============================================================

export function getTursoConfig() {
  const customUrl = localStorage.getItem("fonebase_custom_turso_url");
  const customToken = localStorage.getItem("fonebase_custom_turso_token");
  return {
    url: customUrl || "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline",
    token: customToken || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw"
  };
}

export function getOpenRouterApiKey() {
  const customKey = localStorage.getItem("fonebase_custom_openrouter_key");
  return customKey || atob("c2stb3ItdjEtYTIyYjlmMmQ5ODI4NDhhMGYyMjg4OWJhMDc0MTg0NWFlMWEzMzcyNjg5NDViODQ5MDkwNjZkNzNhZjRlYTllZg==");
}

let _gasToken = localStorage.getItem("adminpro_gas_token") || "";

// ── HELPERS ──
export const setToken = (t) => { _gasToken = t; localStorage.setItem("adminpro_gas_token", t); };
export const getToken = () => _gasToken;
export const logout = () => {
  localStorage.removeItem("adminpro_gas_token");
  localStorage.removeItem("adminproSession");
  localStorage.removeItem("adminpro_user");
  location.reload();
};

// Helper functions for Offline Mode
function isWriteQuery(sqls) {
  const checkStr = (str) => {
    if (typeof str !== 'string') return false;
    return /\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(str);
  };
  const getSqlString = (item) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (item.sql) return item.sql;
    if (item.stmt) {
      if (typeof item.stmt === 'string') return item.stmt;
      if (item.stmt.sql) return item.stmt.sql;
    }
    return "";
  };
  if (Array.isArray(sqls)) {
    return sqls.some(item => checkStr(getSqlString(item)));
  }
  return checkStr(getSqlString(sqls));
}

function isMigration(sqls) {
  const checkStr = (str) => {
    if (typeof str !== 'string') return false;
    return /\b(CREATE\s+TABLE|ALTER\s+TABLE)\b/i.test(str);
  };
  const getSqlString = (item) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (item.sql) return item.sql;
    if (item.stmt) {
      if (typeof item.stmt === 'string') return item.stmt;
      if (item.stmt.sql) return item.stmt.sql;
    }
    return "";
  };
  if (Array.isArray(sqls)) {
    return sqls.some(item => checkStr(getSqlString(item)));
  }
  return checkStr(getSqlString(sqls));
}

function queueWrite(sqls) {
  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem("adminpro_offline_queue") || "[]");
  } catch (e) {
    queue = [];
  }
  queue.push(sqls);
  localStorage.setItem("adminpro_offline_queue", JSON.stringify(queue));
  showToast("⚠️ Sin conexión. Operación guardada en el teléfono para sincronizar.", "warning");
}

let isSyncing = false;

export async function syncOfflineQueue() {
  if (isSyncing) return;
  if (!navigator.onLine) return;

  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem("adminpro_offline_queue") || "[]");
  } catch (e) {
    queue = [];
  }

  if (queue.length === 0) return;

  isSyncing = true;

  // Ping ligero a Turso
  try {
    const config = getTursoConfig();
    const res = await fetch(config.url, { 
      method: "POST", 
      headers: { "Authorization": `Bearer ${config.token}`, "Content-Type": "application/json" }, 
      body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql: "SELECT 1" } }] }) 
    });
    if (!res.ok) throw new Error("Ping failed");
  } catch (e) {
    console.warn("Ping a Turso fallido en syncOfflineQueue, abortando.");
    isSyncing = false;
    return;
  }

  let processedCount = 0;
  while (queue.length > 0) {
    const sqls = queue[0];
    try {
      await queryTurso(sqls, true); // bypassQueue = true
      queue.shift();
      localStorage.setItem("adminpro_offline_queue", JSON.stringify(queue));
      processedCount++;
    } catch (err) {
      console.error("Error procesando consulta en cola de sincronización:", err);
      break;
    }
  }

  isSyncing = false;

  if (processedCount > 0 && queue.length === 0) {
    showToast("🔄 ¡Conexión restablecida! Todos los datos locales se sincronizaron con la nube.", "success");
    setTimeout(() => {
      location.reload();
    }, 1500);
  }
}

export function applyLocalContextToSql(sql) {
  if (typeof sql !== "string") return sql;
  
  const activeLocal = localStorage.getItem("fonebase_active_local_id") || "1";
  const prefix = `local${activeLocal}_`;
  
  const localTables = [
    "inventario", "equipos", "ventas", "egresos", "servicio_tecnico", 
    "creditos", "reventas", "vales_fisicos", "tareas", "nominas", 
    "prestamos_empleados"
  ];
  
  let newSql = sql;
  
  localTables.forEach(table => {
    const regex = new RegExp(`\\b${table}\\b`, 'g');
    newSql = newSql.replace(regex, `${prefix}${table}`);
  });
  
  return newSql;
}

export async function queryTurso(sqls, bypassQueue = false) {
  let processedSqls;
  if (Array.isArray(sqls)) {
    processedSqls = sqls.map(s => {
      if (typeof s === "string") {
        return applyLocalContextToSql(s);
      } else if (s && typeof s === "object") {
        const copy = { ...s };
        if (copy.sql) copy.sql = applyLocalContextToSql(copy.sql);
        return copy;
      }
      return s;
    });
  } else if (typeof sqls === "string") {
    processedSqls = applyLocalContextToSql(sqls);
  } else if (sqls && typeof sqls === "object") {
    processedSqls = { ...sqls };
    if (processedSqls.sql) processedSqls.sql = applyLocalContextToSql(processedSqls.sql);
  } else {
    processedSqls = sqls;
  }

  if (!bypassQueue && isWriteQuery(processedSqls) && !navigator.onLine) {
    if (!isMigration(processedSqls)) {
      queueWrite(processedSqls);
      const simulated = [];
      simulated.success = true;
      simulated.offline = true;
      simulated.message = "Operación guardada localmente por estar offline";
      return simulated;
    }
  }

  try {
    const requests = Array.isArray(processedSqls)
      ? processedSqls.map(s => (typeof s === 'string' ? { type: "execute", stmt: { sql: s } } : (s.type ? s : { type: "execute", stmt: s })))
      : [{ type: "execute", stmt: (typeof processedSqls === 'string' ? { sql: processedSqls } : processedSqls) }];
    const config = getTursoConfig();
    const res = await fetch(config.url, { method: "POST", headers: { "Authorization": `Bearer ${config.token}`, "Content-Type": "application/json" }, body: JSON.stringify({ requests }) });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const results = (data.results || []).map(r => {
      if (!r.response || !r.response.result) return [];
      const { cols, rows } = r.response.result;
      return rows.map(row => {
        const obj = {};
        cols.forEach((col, i) => { obj[col.name] = row[i].value; });
        return obj;
      });
    });
    results.success = true;

    if (isWriteQuery(processedSqls)) {
      setTimeout(syncOfflineQueue, 100);
    } else {
      localStorage.setItem("turso_read_cache_" + JSON.stringify(processedSqls), JSON.stringify(results));
    }

    return results;
  } catch (error) {
    if (!bypassQueue && isWriteQuery(processedSqls)) {
      if (!isMigration(processedSqls)) {
        queueWrite(processedSqls);
        const simulated = [];
        simulated.success = true;
        simulated.offline = true;
        simulated.message = "Operación guardada localmente por fallo de red";
        return simulated;
      }
      throw error;
    } else if (isWriteQuery(processedSqls)) {
      throw error;
    } else {
      const cacheKey = "turso_read_cache_" + JSON.stringify(processedSqls);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.warn("Recuperando datos desde caché local debido a error en la consulta:", error);
        try {
          const parsed = JSON.parse(cached);
          parsed.success = true;
          parsed.fromCache = true;
          return parsed;
        } catch (e) {
          console.error("Error al deserializar caché:", e);
        }
      }
      throw error;
    }
  }
}
export const mapArgs = (d) => d.map(v => {
  if (typeof v === 'number') {
    return { type: 'float', value: v };
  }
  return { type: 'text', value: String(v !== undefined && v !== null ? v : '') };
});

export async function inicializarEsquemaBaseDeDatos() {
  const schemas = [
    `CREATE TABLE IF NOT EXISTS usuarios (email TEXT PRIMARY KEY, password TEXT, nombre TEXT, rol TEXT, estado TEXT)`,
    `CREATE TABLE IF NOT EXISTS clientes (id TEXT PRIMARY KEY, nombre TEXT, telefono TEXT, direccion TEXT, email TEXT, tipo TEXT, fecha_registro TEXT)`,
    `CREATE TABLE IF NOT EXISTS inventario (id TEXT PRIMARY KEY, nombre TEXT, marca TEXT, categoria TEXT, tipo TEXT, costo REAL, precio_venta REAL, stock_minimo INTEGER, stock_actual INTEGER, ubicacion TEXT, sku TEXT, imagen TEXT, fijado INTEGER DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS equipos (imei1 TEXT PRIMARY KEY, imei2 TEXT, id_producto TEXT, marca TEXT, nombre TEXT, proveedor TEXT, costo REAL, venta REAL, estado TEXT, fecha_ingreso TEXT)`,
    `CREATE TABLE IF NOT EXISTS ventas (id_factura TEXT PRIMARY KEY, fecha TEXT, cedula TEXT, cliente TEXT, direccion TEXT, producto_nombre TEXT, cantidad TEXT, cantidad_items TEXT, imeis TEXT, subtotal REAL, descuento REAL, total REAL, metodo TEXT, vendedor TEXT, firma_vendedor TEXT, firma_comprador TEXT, evidencia TEXT, ciudad TEXT, telefono TEXT, tipo_factura TEXT)`,
    `CREATE TABLE IF NOT EXISTS egresos (id_gasto TEXT PRIMARY KEY, fecha TEXT, categoria TEXT, concepto TEXT, responsable TEXT, monto REAL, nota TEXT)`,
    `CREATE TABLE IF NOT EXISTS servicio_tecnico (id_orden TEXT PRIMARY KEY, cliente TEXT, telefono TEXT, equipo TEXT, imei_serie TEXT, falla TEXT, clave_patron TEXT, repuestos TEXT, costo_taller REAL, abono REAL, precio_final REAL, estado TEXT, evidencias TEXT)`,
    `CREATE TABLE IF NOT EXISTS creditos (id_credito TEXT PRIMARY KEY, cliente TEXT, telefono TEXT, id_factura_ref TEXT, fecha_deuda TEXT, tipo TEXT, valor_total REAL, total_abonado REAL, saldo_pendiente REAL, estado TEXT, detalle TEXT, historial_abonos TEXT)`,
    `CREATE TABLE IF NOT EXISTS reventas (id_reventa TEXT PRIMARY KEY, fecha TEXT, producto TEXT, categoria TEXT, costo_proveedor REAL, precio_venta REAL, proveedor TEXT, utilidad REAL)`,
    `CREATE TABLE IF NOT EXISTS proveedores (id_prov TEXT PRIMARY KEY, nombre TEXT, nit TEXT, telefono TEXT, direccion TEXT, ciudad TEXT, contacto TEXT, correo TEXT, estado TEXT DEFAULT 'Activo')`,
    `CREATE TABLE IF NOT EXISTS marcas_categorias (nombre TEXT PRIMARY KEY, tipo TEXT)`,
    `CREATE TABLE IF NOT EXISTS vales_fisicos (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente TEXT, producto TEXT, cantidad INTEGER, monto REAL, estado TEXT, fecha TEXT, foto_base64 TEXT)`,
    `CREATE TABLE IF NOT EXISTS tareas (id TEXT PRIMARY KEY, tarea TEXT, fecha_inicio TEXT, fecha_vencimiento TEXT, prioridad TEXT, estado TEXT, responsable TEXT, notas TEXT, color TEXT)`,
    `CREATE TABLE IF NOT EXISTS nominas (id_nomina TEXT PRIMARY KEY, fecha TEXT, empleado TEXT, periodo TEXT, salario_base REAL, deducciones REAL, bonificaciones REAL, total_pagar REAL, estado TEXT, notas TEXT)`,
    `CREATE TABLE IF NOT EXISTS prestamos_empleados (id_prestamo TEXT PRIMARY KEY, fecha TEXT, empleado TEXT, tipo TEXT, monto REAL, producto_id TEXT, producto_nombre TEXT, cantidad INTEGER, estado TEXT, notas TEXT)`,
    `CREATE TABLE IF NOT EXISTS metas_financieras (id_meta TEXT PRIMARY KEY, titulo TEXT, monto_objetivo REAL, tipo_calculo TEXT, fecha_inicio TEXT, fecha_limite TEXT, estado TEXT, notas TEXT)`,
    `CREATE TABLE IF NOT EXISTS ajustes_empresa (id INTEGER PRIMARY KEY, nombre TEXT, nit TEXT, propietario TEXT, telefono TEXT, direccion TEXT, ciudad TEXT, contacto TEXT, correo TEXT, condiciones TEXT, logo TEXT, logo_size INTEGER, mostrar_nombre INTEGER)`
  ];

  for (const sql of schemas) {
    try {
      await queryTurso(sql, true);
    } catch (e) {
      console.error("Error al inicializar tabla:", e);
    }
  }

  // Insertar fila por defecto con el ID del local activo en ajustes_empresa si no existe
  try {
    const activeLocal = localStorage.getItem("fonebase_active_local_id") || "1";
    const name = activeLocal === "1" ? "MI NEGOCIO" : `Sucursal ${activeLocal}`;
    await queryTurso(`INSERT OR IGNORE INTO ajustes_empresa (id, nombre, nit, propietario, telefono, direccion, ciudad, contacto, correo, condiciones, logo, logo_size, mostrar_nombre) VALUES (${activeLocal}, '${name}', '900.123.456-1', 'Juan Pérez', '3001234567', 'Calle 123 No. 45 - 67', 'Bogotá - Cundinamarca', '3001234567', 'contacto@miempresa.com', 'GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.', '', 40, 1)`, true);
  } catch (e) {
    console.error("Error al insertar ajustes_empresa inicial:", e);
  }

  // Migración: Asegurar columna sucursal_id en usuarios
  try {
    await queryTurso("ALTER TABLE usuarios ADD COLUMN sucursal_id TEXT DEFAULT '1'", true);
  } catch (e) { /* Columna ya existe */ }
}

// Inicializar base de datos
inicializarEsquemaBaseDeDatos().catch(err => console.error("Error al arrancar base de datos:", err));

// ── COMPRESIÓN DE IMÁGENES POR CANVAS ──
export function compressImage(base64Data, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
  return new Promise((resolve) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      resolve(base64Data || "");
      return;
    }
    
    const img = new Image();
    img.src = base64Data;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL("image/webp", quality);
      resolve(dataUrl);
    };
    img.onerror = () => {
      resolve(base64Data);
    };
  });
}

// ── ALGORITMO TOTP 2FA (COMPATIBLE CON GOOGLE/MICROSOFT AUTHENTICATOR) ──
function base32Decode(str) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let cleanStr = str.replace(/=+$/, "").toUpperCase();
  let len = cleanStr.length;
  let bits = 0;
  let value = 0;
  let bytes = [];
  
  for (let i = 0; i < len; i++) {
    let val = alphabet.indexOf(cleanStr[i]);
    if (val === -1) throw new Error("Invalid base32 character");
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

function sha1(msgBytes) {
  let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
  const len = msgBytes.length;
  const bitLen = len * 8;
  const padLen = ((len + 8) % 64 < 56) ? (56 - (len + 8) % 64) : (120 - (len + 8) % 64);
  const padded = new Uint8Array(len + 1 + padLen + 8);
  padded.set(msgBytes);
  padded[len] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLen, false);

  const w = new Uint32Array(80);
  for (let i = 0; i < padded.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      w[t] = view.getUint32(i + t * 4, false);
    }
    for (let t = 16; t < 80; t++) {
      const val = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
      w[t] = (val << 1) | (val >>> 31);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let t = 0; t < 80; t++) {
      let f, k;
      if (t < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5A827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[t]) >>> 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  const res = new Uint8Array(20);
  const resView = new DataView(res.buffer);
  resView.setUint32(0, h0, false);
  resView.setUint32(4, h1, false);
  resView.setUint32(8, h2, false);
  resView.setUint32(12, h3, false);
  resView.setUint32(16, h4, false);
  return res;
}

function hmacSha1Fallback(keyBytes, msgBytes) {
  let key = keyBytes;
  if (key.length > 64) {
    key = sha1(key);
  }
  const ipad = new Uint8Array(64);
  const opad = new Uint8Array(64);
  ipad.fill(0x36);
  opad.fill(0x5c);

  for (let i = 0; i < key.length; i++) {
    ipad[i] ^= key[i];
    opad[i] ^= key[i];
  }

  const innerMsg = new Uint8Array(64 + msgBytes.length);
  innerMsg.set(ipad, 0);
  innerMsg.set(msgBytes, 64);
  const innerHash = sha1(innerMsg);

  const outerMsg = new Uint8Array(64 + 20);
  outerMsg.set(opad, 0);
  outerMsg.set(innerHash, 64);
  return sha1(outerMsg);
}

async function generateTOTP(secretBase32, timeOffsetSteps = 0) {
  try {
    const keyBytes = base32Decode(secretBase32);
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const timeStep = 30;
    const counter = Math.floor(epoch / timeStep) + timeOffsetSteps;
    
    const msgBytes = new Uint8Array(8);
    let temp = counter;
    for (let i = 7; i >= 0; i--) {
      msgBytes[i] = temp & 255;
      temp = Math.floor(temp / 256);
    }
    
    let hmac;
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.importKey === "function") {
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: { name: "SHA-1" } },
        false,
        ["sign"]
      );
      const signatureBuffer = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        msgBytes
      );
      hmac = new Uint8Array(signatureBuffer);
    } else {
      hmac = hmacSha1Fallback(keyBytes, msgBytes);
    }
    
    const offset = hmac[hmac.length - 1] & 15;
    const binary = ((hmac[offset] & 127) << 24) |
                   ((hmac[offset + 1] & 255) << 16) |
                   ((hmac[offset + 2] & 255) << 8) |
                   (hmac[offset + 3] & 255);
    
    const code = binary % 1000000;
    return String(code).padStart(6, "0");
  } catch (e) {
    console.error("Error generating TOTP", e);
    return null;
  }
}

async function verifyTOTP(secretBase32, enteredCode) {
  for (let offset = -1; offset <= 1; offset++) {
    const generated = await generateTOTP(secretBase32, offset);
    if (generated && generated === enteredCode) {
      return true;
    }
  }
  return false;
}

// ── DRIVE UPLOADS (MIGRADOS A RETORNO LOCAL COMPRIMIDO) ──
export const uploadFoto = async (base64, fileName, mimeType) => await compressImage(base64, 1024, 1024, 0.8);
export const uploadSignature = async (base64, fileName) => base64;
export const uploadEvidencia = async (base64, fileName, mimeType) => await compressImage(base64, 1024, 1024, 0.8);

// ── BROWSER-DIRECT GEMINI API VISION CALL ──
async function callGeminiDirect(base64Data, mimeType, mode = "label") {
  // Support backward compatibility
  if (mode === true) mode = "imei";
  if (mode === false) mode = "label";

  const apiKey = "AIzaSyBgIE-rLsAEfHapwDCaULRNXanFukHL-Dk";
  
  const imeiPrompt = 'Eres un experto en identificación de teléfonos celulares. ' +
    'Mira esta imagen de la etiqueta trasera, caja o sticker de un teléfono celular. ' +
    'Extrae los números IMEI y la información del dispositivo. ' +
    'Responde SOLO con un JSON válido, sin texto adicional, sin bloques de código:\n\n' +
    '{"imei1":"primer número IMEI de 15 dígitos","imei2":"segundo número IMEI de 15 dígitos si existe","name":"nombre del modelo sin la marca (ej: Galaxy A54, iPhone 15 Pro)","brand":"marca (ej: Samsung, Apple, Xiaomi)","color":"color en español","ram":"RAM si aplica (ej: 8GB)","memoria":"almacenamiento si aplica (ej: 256GB)","sku":"código modelo fabricante","cost":"","price":"","bestPhotoIndex":"índice base 0 de la mejor foto para perfil"}\n\n' +
    'REGLAS:\n' +
    '- imei1: el primer IMEI visible, debe ser exactamente 15 dígitos numéricos\n' +
    '- imei2: el segundo IMEI si existe, 15 dígitos. Si solo hay uno, dejar vacío ""\n' +
    '- name: solo el nombre del modelo SIN la marca\n' +
    '- brand: la marca del fabricante\n' +
    '- color: traducir al español\n' +
    '- bestPhotoIndex: número entero (ej: 0, 1, 2) que representa el índice base 0 de la imagen que mejor muestre el producto completo o su caja limpia para perfil comercial. Si solo hay una imagen, responder 0.\n' +
    '- Si no encuentras un dato, deja el valor como cadena vacía ""\n' +
    '- NO inventes datos. Solo extrae lo que ves en la imagen';

  const labelPrompt = 'Eres un asistente experto en identificación de productos de tecnología, celulares y accesorios (como cargadores, audífonos, estuches, etc.). ' +
    'Mira esta imagen de un producto, caja, etiqueta o factura. ' +
    'Identifica la información y responde SOLO con un JSON válido, sin texto adicional, sin bloques de código, sin explicaciones:\n\n' +
    '{"name":"nombre del modelo sin la marca (ej: Cargador 20W USB-C, Galaxy A54, Audífonos Bluetooth Pro)","brand":"marca (ej: Samsung, Apple, Xiaomi, Genérico)","category":"Categoría sugerida (DEBE ser uno de estos valores exactos: Celulares, Accesorios, Audio, Tablets)","sku":"código de modelo o SKU del fabricante","ram":"RAM si aplica (ej: 8GB)","memoria":"almacenamiento si aplica (ej: 256GB)","color":"color en español (ej: Blanco, Negro, Azul)","cost":"","price":"","description":"Ficha técnica detallada del producto resumida con características clave de lo visible","adCopy":"Mensaje de venta/publicidad creativo y atractivo en español con emojis, ideal para estados de WhatsApp, Instagram o catálogo digital","bestPhotoIndex":"índice base 0 de la mejor foto para perfil"}\n\n' +
    'REGLAS:\n' +
    '- name: nombre descriptivo del modelo de celular o accesorio SIN incluir la marca. Ej: para "Apple USB-C Power Adapter 20W" -> "Adaptador de Corriente USB-C 20W" o "Cargador 20W USB-C".\n' +
    '- brand: la marca del fabricante. Si no es de marca conocida o no se visualiza, responder "Genérico".\n' +
    '- category: Clasifica el producto. Si es un cargador, cable, adaptador, protector, estuche, etc., usa "Accesorios". Si es un celular o smartphone, usa "Celulares". Si son audífonos, parlantes o altavoces, usa "Audio". Si es una tablet, usa "Tablets".\n' +
    '- ram y memoria: Solo si aplica (celulares/tablets) y es visible.\n' +
    '- color: traducir colores al español.\n' +
    '- cost y price: solo si hay precios o costos visibles en la imagen, como número sin símbolo de moneda.\n' +
    '- description: Generar una ficha técnica detallada basada únicamente en lo que muestra la imagen (especificaciones, compatibilidad, entradas, salidas, potencia, etc.).\n' +
    '- adCopy: Generar un texto publicitario muy atractivo y enganchador para vender este producto, destacando sus beneficios y agregando emojis llamativos.\n' +
    '- bestPhotoIndex: número entero (ej: 0, 1, 2) que representa el índice base 0 de la imagen que mejor muestre el producto completo o su caja limpia para perfil comercial. Si solo hay una imagen, responder 0.\n' +
    '- Si no encuentras un dato, deja el valor como cadena vacía "".\n' +
    '- NO inventes datos que no estén en la imagen.';

  const bulkPrompt = 'Eres un experto en digitalización de inventarios. ' +
    'Mira esta imagen que contiene un listado, etiquetas, códigos de barras o una caja con múltiples números IMEI de teléfonos celulares. ' +
    'Extrae todos los números IMEI de 15 dígitos numéricos que encuentres. ' +
    'Responde SOLO con un JSON válido, sin texto adicional, sin bloques de código ni explicaciones:\n\n' +
    '{"imeis":["IMEI_1_de_15_dígitos","IMEI_2_de_15_dígitos",...]}\n\n' +
    'REGLAS:\n' +
    '- Cada IMEI en el arreglo "imeis" debe ser una cadena de exactamente 15 caracteres numéricos.\n' +
    '- No incluyas espacios, guiones ni letras en los IMEIs.\n' +
    '- Si no detectas ningún IMEI válido, responde con un arreglo vacío {"imeis":[]}.\n' +
    '- NO inventes datos. Solo extrae lo que ves en la imagen.';

  let prompt = labelPrompt;
  if (mode === "imei") prompt = imeiPrompt;
  else if (mode === "bulk") prompt = bulkPrompt;

  const parts = [];
  parts.push({ text: prompt });

  if (Array.isArray(base64Data)) {
    base64Data.forEach(img => {
      let rawBase64 = img.base64;
      if (rawBase64.includes("base64,")) {
        rawBase64 = rawBase64.split("base64,")[1];
      }
      parts.push({
        inlineData: {
          mimeType: img.type || img.mimeType || "image/jpeg",
          data: rawBase64
        }
      });
    });
  } else {
    let rawBase64 = base64Data;
    if (rawBase64.includes("base64,")) {
      rawBase64 = rawBase64.split("base64,")[1];
    }
    parts.push({
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: rawBase64
      }
    });
  }

  // ============================================================
  // ANALISIS DE IMAGEN CON IA (EXCLUSIVO QWEN 3.7 FLASH VIA OPENROUTER)
  // ============================================================
  const openRouterApiKey = getOpenRouterApiKey();
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
  
  const openRouterContent = [{ type: "text", text: prompt }];

  if (Array.isArray(base64Data)) {
    base64Data.forEach(img => {
      let dataUrl = img.base64;
      if (!dataUrl.startsWith("data:")) {
        dataUrl = `data:${img.type || "image/jpeg"};base64,${dataUrl}`;
      }
      openRouterContent.push({
        type: "image_url",
        image_url: { url: dataUrl }
      });
    });
  } else {
    let dataUrl = base64Data;
    if (!dataUrl.startsWith("data:")) {
      dataUrl = `data:${mimeType || "image/jpeg"};base64,${dataUrl}`;
    }
    openRouterContent.push({
      type: "image_url",
      image_url: { url: dataUrl }
    });
  }

  try {
    console.log("[Qwen 3.7 Flash] Analizando imagen de inventario...");
    const response = await fetch(openRouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://adminpro.local",
        "X-Title": "FoneBase Inventory AI"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.7-flash",
        messages: [
          {
            role: "user",
            content: openRouterContent
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error de OpenRouter (${response.status}): ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Sin respuesta del modelo Qwen 3.7 Flash");
    }

    const responseContent = data.choices[0].message.content.trim();
    let jsonStr = responseContent;

    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(jsonStr);
    console.log("[Qwen 3.7 Flash] Éxito al analizar producto:", parsed);
    return { success: true, data: parsed, model: "qwen/qwen3.7-flash" };

  } catch (e) {
    console.error("[Qwen 3.7 Flash] Excepción al analizar imagen:", e);
    return { success: false, mensaje: `Error de análisis con Qwen 3.7 Flash: ${e.message}` };
  }
}

export const analyzeLabelImage = async (base64Data, mimeType) => await callGeminiDirect(base64Data, mimeType, "label");
export const analyzeImeiLabel = async (base64Data, mimeType) => await callGeminiDirect(base64Data, mimeType, "imei");
export const analyzeBulkImeis = async (base64Data, mimeType) => await callGeminiDirect(base64Data, mimeType, "bulk");

// ── AUTH ──
export const login = async (email, password) => {
  try {
    const results = await queryTurso({ 
      sql: "SELECT email, nombre, rol, estado, totp_secret FROM usuarios WHERE email = ? AND password = ? AND estado = 'Activo'", 
      args: [{ type: "text", value: email.toLowerCase() }, { type: "text", value: password }] 
    });
    
    const user = results[0]?.[0];
    if (!user) return { success: false, mensaje: "Credenciales incorrectas" };
    
    if (!user.totp_secret) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let secret = "";
      for (let i = 0; i < 16; i++) {
        secret += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      
      await queryTurso({
        sql: "UPDATE usuarios SET totp_secret = ? WHERE email = ?",
        args: [{ type: "text", value: secret }, { type: "text", value: user.email.toLowerCase() }]
      });
      
      const otpauthUrl = `otpauth://totp/FoneBase:${user.email}?secret=${secret}&issuer=FoneBase`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
      
      return { success: true, step: "setup-totp", secret, qrCodeUrl, nombre: user.nombre };
    }
    
    return { success: true, step: "totp", nombre: user.nombre };
  } catch (err) {
    return { success: false, mensaje: "Error en base de datos: " + err.message };
  }
};

export const verifyPin = async (email, pin) => {
  try {
    const results = await queryTurso({
      sql: "SELECT nombre, rol, email, totp_secret FROM usuarios WHERE email = ?",
      args: [{ type: "text", value: email.toLowerCase() }]
    });
    
    const user = results[0]?.[0];
    if (!user) return { success: false, mensaje: "Usuario no encontrado" };
    
    if (!user.totp_secret) return { success: false, mensaje: "2FA no configurado" };
    
    const isValid = await verifyTOTP(user.totp_secret, pin);
    if (!isValid) return { success: false, mensaje: "Código 2FA incorrecto" };
    
    // Generate a simple client-side session token
    const token = btoa(JSON.stringify({ email: user.email, nombre: user.nombre, rol: user.rol, exp: Date.now() + 24*60*60*1000 }));
    setToken(token);
    
    const fullUser = { nombre: user.nombre, rol: user.rol, email: user.email, token };
    localStorage.setItem("adminpro_user", JSON.stringify(fullUser));
    return { success: true, ...fullUser };
  } catch (err) {
    return { success: false, mensaje: "Error de autenticación: " + err.message };
  }
};
export const reset2fa = async (email) => {
  try {
    await queryTurso({
      sql: "UPDATE usuarios SET totp_secret = NULL WHERE email = ?",
      args: [{ type: "text", value: email.toLowerCase() }]
    });
    return { success: true };
  } catch (err) {
    throw new Error("Error al restablecer 2FA: " + err.message);
  }
};

// ── USUARIOS ──
export const getUsers = async () => {
  try {
    await queryTurso("ALTER TABLE usuarios ADD COLUMN sucursal_id TEXT DEFAULT 'PRINCIPAL'");
  } catch (e) {}
  return (await queryTurso("SELECT * FROM usuarios ORDER BY nombre ASC"))[0] || [];
};
export const crearUsuario = (d) => queryTurso({ sql: "INSERT INTO usuarios (email, password, nombre, rol, estado, sucursal_id) VALUES (?,?,?,?,?,?)", args: mapArgs(d) });
export const actualizarUsuario = (oldEmail, newEmail, d) => queryTurso({ sql: "UPDATE usuarios SET email=?, password=?, nombre=?, rol=?, estado=?, sucursal_id=? WHERE email=?", args: [{ type: "text", value: newEmail }, ...mapArgs(d), { type: "text", value: oldEmail }] });
export const eliminarUsuario = (email) => queryTurso({ sql: "DELETE FROM usuarios WHERE email = ?", args: [{ type: "text", value: email }] });

// ── CLIENTES ──
export const getClientes = async () => {
  const results = await queryTurso("SELECT * FROM clientes ORDER BY nombre ASC");
  return (results[0] || []).map(c => ({
    ...c,
    cedula: c.id
  }));
};
export const crearCliente = (d) => queryTurso({ sql: "INSERT INTO clientes VALUES (?,?,?,?,?,?,?)", args: mapArgs([d.cedula, d.nombre, d.telefono, d.direccion, d.email, d.tipo, new Date().toISOString()]) });
export const actualizarCliente = (id, d) => queryTurso({ sql: "UPDATE clientes SET id=?, nombre=?, telefono=?, direccion=?, email=?, tipo=? WHERE id=?", args: [...mapArgs([d.cedula, d.nombre, d.telefono, d.direccion, d.email, d.tipo]), { type: "text", value: id }] });
export const eliminarCliente = (id) => queryTurso({ sql: "DELETE FROM clientes WHERE id = ?", args: [{ type: "text", value: id }] });

// ── INVENTARIO ──
export const getInventario = async () => {
  try {
    await queryTurso("ALTER TABLE inventario ADD COLUMN fijado INTEGER DEFAULT 0");
  } catch (e) {
    // Column might already exist
  }
  let results = (await queryTurso("SELECT * FROM inventario ORDER BY fijado DESC, id DESC"))[0] || [];
  return results.map(r => ({ ...r, stockActual: r.stock_actual, stockMinimo: r.stock_minimo, precioVenta: r.precio_venta, costo: r.costo, fijado: r.fijado || 0 }));
};
export const crearProducto = (d) => {
  const argsList = [...d];
  if (argsList.length === 12) {
    argsList.push(0);
  }
  return queryTurso({ sql: "INSERT INTO inventario VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: mapArgs(argsList) });
};
export const actualizarProducto = (id, d) => {
  const list = Array.isArray(d) ? (d.length === 13 ? d.slice(1) : d) : [];
  return queryTurso({
    sql: "UPDATE inventario SET nombre=?, marca=?, categoria=?, tipo=?, costo=?, precio_venta=?, stock_minimo=?, stock_actual=?, ubicacion=?, sku=?, imagen=?, fijado=? WHERE id=?",
    args: [...mapArgs(list), { type: "text", value: String(id || "") }]
  });
};
export const pinProducto = (id, fijado) => queryTurso({ sql: "UPDATE inventario SET fijado=? WHERE id=?", args: [{ type: "integer", value: fijado }, { type: "text", value: id }] });
export const eliminarProducto = (id) => queryTurso({ sql: "DELETE FROM inventario WHERE id = ?", args: [{ type: "text", value: id }] });

// ── EQUIPOS ──
export const getEquipos = async () => (await queryTurso("SELECT * FROM equipos"))[0] || [];
export const crearEquipo = (d) => queryTurso({ 
  sql: "INSERT INTO equipos VALUES (?,?,?,?,?,?,?,?,?,?)", 
  args: mapArgs([d.imei1, d.imei2, d.id_producto || '', d.marca, d.nombre, d.proveedor, d.costo, d.venta, d.estado, d.fecha_ingreso || new Date().toISOString()]) 
});
export const actualizarEquipo = (id, d) => queryTurso({ 
  sql: "UPDATE equipos SET imei1=?, imei2=?, id_producto=?, marca=?, nombre=?, proveedor=?, costo=?, venta=?, estado=?, fecha_ingreso=? WHERE imei1=?", 
  args: [...mapArgs([d.imei1, d.imei2, d.id_producto || '', d.marca, d.nombre, d.proveedor, d.costo, d.venta, d.estado, d.fecha_ingreso || new Date().toISOString()]), { type: "text", value: id }] 
});
export const eliminarEquipo = (id) => queryTurso({ sql: "DELETE FROM equipos WHERE imei1 = ?", args: [{ type: "text", value: id }] });
export const crearEquiposLote = (list) => {
  const requests = list.map(d => ({
    sql: "INSERT INTO equipos (imei1, imei2, id_producto, marca, nombre, proveedor, costo, venta, estado, fecha_ingreso) VALUES (?,?,?,?,?,?,?,?,?,?)",
    args: mapArgs([
      d.imei1,
      d.imei2 || '',
      d.id_producto || '',
      d.marca || '',
      d.nombre || '',
      d.proveedor || '',
      d.costo || 0,
      d.venta || 0,
      d.estado || 'Disponible',
      d.fecha_ingreso || new Date().toISOString()
    ])
  }));
  return queryTurso(requests);
};

// ── VENTAS ──
export const getVentas = async () => (await queryTurso("SELECT * FROM ventas ORDER BY fecha DESC"))[0] || [];
export const registrarVenta = async (v) => {
  const idFac = `FAC-${Date.now()}`;
  const now = new Date().toISOString();
  
  const requests = [
    { 
      sql: "INSERT INTO ventas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
      args: [
        {type:"text", value:idFac}, 
        {type:"text", value:now}, 
        {type:"text", value:v.cedula || ""}, 
        {type:"text", value:v.cliente || ""}, 
        {type:"text", value:v.direccion || ""}, 
        {type:"text", value:v.productoNombre || ""}, 
        {type:"text", value:String(v.total || 0)}, 
        {type:"text", value:String(v.items?.length || 1)}, 
        {type:"text", value:v.imeis || "N/A"}, 
        {type:"float", value:v.subtotal || 0}, 
        {type:"float", value:v.descuento || 0}, 
        {type:"float", value:v.total || 0}, 
        {type:"text", value:v.metodo || ""}, 
        {type:"text", value:v.vendedor || ""}, 
        {type:"text", value:v.firmaVendedor || ""}, 
        {type:"text", value:v.firmaComprador || ""}, 
        {type:"text", value:v.evidencia || ""},
        {type:"text", value:v.ciudad || ""},
        {type:"text", value:v.telefono || ""},
        {type:"text", value:v.tipoFactura || "fisica"}
      ] 
    }
  ];

  // Decrementar stock para cada producto
  if (v.items && Array.isArray(v.items)) {
    v.items.forEach(item => {
      requests.push({ 
        sql: "UPDATE inventario SET stock_actual = stock_actual - ? WHERE id = ?", 
        args: [
          { type: "float", value: parseFloat(item.qty || 1) }, 
          { type: "text", value: item.id }
        ] 
      });
    });
  } else {
    requests.push({ sql: "UPDATE inventario SET stock_actual = stock_actual - 1 WHERE id = ?", args: [{ type: "text", value: v.productoId || "" }] });
  }

  await queryTurso(requests);
  return { success: true, idFactura: idFac };
};

// ── CRÉDITOS ──
export const getCreditos = async () => (await queryTurso("SELECT * FROM creditos"))[0].map(r => ({ 
  ...r, 
  id: r.id_credito, 
  idFactura: r.id_factura_ref, 
  fecha: r.fecha_deuda,
  abonado: r.total_abonado, 
  saldo: r.saldo_pendiente, 
  total: r.valor_total,
  fechaCancelacion: r.fecha_cancelacion,
  historialAbonos: r.historial_abonos
}));
export const crearCredito = (d) => queryTurso({ sql: "INSERT INTO creditos (id_credito, cliente, telefono, id_factura_ref, fecha_deuda, tipo, valor_total, total_abonado, saldo_pendiente, estado, detalle, historial_abonos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", args: mapArgs([Date.now().toString(), d.cliente, d.telefono, d.idFactura || "", new Date().toISOString(), d.tipo||'Crédito', Number(d.total || 0), 0, Number(d.total || 0), 'Activo', d.detalle || "", d.historialAbonos || ""]) });
export const actualizarCredito = (id, d) => queryTurso({ 
  sql: "UPDATE creditos SET id_credito=?, cliente=?, telefono=?, id_factura_ref=?, fecha_deuda=?, tipo=?, valor_total=?, total_abonado=?, saldo_pendiente=?, estado=?, fecha_cancelacion=?, detalle=?, historial_abonos=? WHERE id_credito=?", 
  args: [...mapArgs([
    d.id_credito || d.id,
    d.cliente,
    d.telefono,
    d.id_factura_ref || d.idFactura || "",
    d.fecha_deuda || d.fecha || "",
    d.tipo || "Crédito",
    Number(d.total !== undefined ? d.total : (d.valor_total !== undefined ? d.valor_total : 0)),
    Number(d.abonado !== undefined ? d.abonado : (d.total_abonado !== undefined ? d.total_abonado : 0)),
    Number(d.saldo !== undefined ? d.saldo : (d.saldo_pendiente !== undefined ? d.saldo_pendiente : 0)),
    d.estado,
    d.fechaCancelacion !== undefined ? d.fechaCancelacion : d.fecha_cancelacion || "",
    d.detalle || "",
    d.historialAbonos !== undefined ? d.historialAbonos : d.historial_abonos || ""
  ]), { type: "text", value: id }] 
});

// ── REVENTAS ──
export const getReventas = async () => (await queryTurso("SELECT * FROM reventas ORDER BY fecha DESC"))[0].map(r => ({ ...r, id: r.id_reventa, producto: r.producto, costo: r.costo_proveedor, precio: r.precio_venta, utilidad: r.utilidad }));
export const crearReventa = (d) => queryTurso({ sql: "INSERT INTO reventas VALUES (?,?,?,?,?,?,?,?)", args: mapArgs([`REV-${Date.now()}`, new Date().toISOString(), d.producto, d.categoria, d.costo, d.precio, d.proveedor, d.precio - d.costo]) });
export const actualizarReventa = (id, d) => queryTurso({ sql: "UPDATE reventas SET id_reventa=?, fecha=?, producto=?, categoria=?, costo_proveedor=?, precio_venta=?, proveedor=?, utilidad=? WHERE id_reventa=?", args: [...mapArgs(d), { type: "text", value: id }] });
export const eliminarReventa = (id) => queryTurso({ sql: "DELETE FROM reventas WHERE id_reventa = ?", args: [{ type: "text", value: id }] });

// ── SERVICIO TÉCNICO ──
export const getTechnical = async () => (await queryTurso("SELECT * FROM servicio_tecnico ORDER BY id_orden DESC"))[0] || [];
export const crearServicioTecnico = (d) => queryTurso({ sql: "INSERT INTO servicio_tecnico VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: mapArgs(d) });
export const actualizarServicioTecnico = (id, d) => queryTurso({ sql: "UPDATE servicio_tecnico SET id_orden=?, cliente=?, telefono=?, equipo=?, imei_serie=?, falla=?, clave_patron=?, repuestos=?, costo_taller=?, abono=?, precio_final=?, estado=?, evidencias=? WHERE id_orden=?", args: [...mapArgs(d), { type: "text", value: id }] });
export const eliminarServicioTecnico = (id) => queryTurso({ sql: "DELETE FROM servicio_tecnico WHERE id_orden = ?", args: [{ type: "text", value: id }] });

// ── DASHBOARD ──
export const getDashboard = async () => {
  const res = await queryTurso(["SELECT COUNT(*) as c FROM inventario", "SELECT COUNT(*) as c FROM clientes", "SELECT SUM(total) as s FROM ventas WHERE date(fecha) = date('now')", "SELECT SUM(monto) as s FROM egresos WHERE date(fecha) = date('now')", "SELECT SUM(stock_actual) as s FROM inventario", "SELECT COUNT(*) as c FROM inventario WHERE stock_actual <= 1", "SELECT * FROM ventas ORDER BY fecha DESC LIMIT 8", "SELECT date(fecha) as d, SUM(total) as m FROM ventas WHERE date(fecha) >= date('now','-7 days') GROUP BY d", "SELECT COUNT(*) as c FROM equipos", "SELECT productos, COUNT(*) as qty FROM ventas GROUP BY productos ORDER BY qty DESC LIMIT 5", "SELECT id, nombre, stock_actual, stock_minimo FROM inventario WHERE stock_actual <= 1 LIMIT 5", "SELECT id_orden, cliente, equipo, estado FROM servicio_tecnico ORDER BY id_orden DESC LIMIT 5", "SELECT COUNT(*) as c FROM creditos WHERE estado != 'Pagado' AND estado != 'Cancelado'", "SELECT COUNT(*) as c FROM reventas"]);
  const labels7d = []; const ventas7d = [];
  for (let i=6; i>=0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i); const iso = d.toISOString().slice(0,10);
    labels7d.push(d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }));
    const day = (res[7] || []).find(x => x.d === iso); ventas7d.push(day ? day.m : 0);
  }
  return { ingresosHoy: res[2]?.[0]?.s||0, egresosHoy: res[3]?.[0]?.s||0, utilidad: (res[2]?.[0]?.s||0)-(res[3]?.[0]?.s||0), totalProductos: res[0]?.[0]?.c||0, totalClientes: res[1]?.[0]?.c||0, totalStock: res[4]?.[0]?.s||0, stockCritico: res[5]?.[0]?.c||0, totalEquipos: res[8]?.[0]?.c||0, ventasRecientes: res[6]||[], topProductos: (res[9]||[]).map(p=>({nombre:p.productos, cantidad:p.qty})), productosBajoStock: (res[10]||[]).map(p=>({...p, stockActual: p.stock_actual})), tecRecientes: res[11]||[], creditosActivos: res[12]?.[0]?.c||0, totalReventas: res[13]?.[0]?.c||0, labels7d, ventas7d };
};

// ── EGRESOS ──
export const getEgresos = async () => {
  const results = await queryTurso("SELECT * FROM egresos ORDER BY fecha DESC");
  return (results[0] || []).map(e => ({
    ...e,
    id: e.id_gasto // Mapeamos id_gasto de Turso a id para el frontend
  }));
};
export const registrarEgreso = (d) => queryTurso({ sql: "INSERT INTO egresos VALUES (?,?,?,?,?,?,?)", args: mapArgs([`EGR-${Date.now()}`, new Date().toISOString(), d.categoria, d.concepto, d.responsable, d.monto, '']) });
export const getVendedores = async () => (await queryTurso("SELECT nombre, email FROM usuarios WHERE rol != 'Cliente'"))[0] || [];

// ── NÓMINAS ──
export const getNominas = async () => {
  const results = await queryTurso("SELECT * FROM nominas ORDER BY fecha DESC");
  return (results[0] || []).map(n => ({
    ...n,
    id: n.id_nomina
  }));
};
export const crearNomina = (d) => queryTurso({ sql: "INSERT INTO nominas VALUES (?,?,?,?,?,?,?,?,?,?)", args: mapArgs([`NOM-${Date.now()}`, d.fecha || new Date().toISOString(), d.empleado, d.periodo, d.salario_base, d.deducciones, d.bonificaciones, d.total_pagar, d.estado || 'Pendiente', d.notas || '']) });
export const actualizarNomina = (id, d) => queryTurso({ sql: "UPDATE nominas SET fecha=?, empleado=?, periodo=?, salario_base=?, deducciones=?, bonificaciones=?, total_pagar=?, estado=?, notas=? WHERE id_nomina=?", args: [...mapArgs([d.fecha, d.empleado, d.periodo, d.salario_base, d.deducciones, d.bonificaciones, d.total_pagar, d.estado, d.notas]), { type: "text", value: id }] });
export const eliminarNomina = (id) => queryTurso({ sql: "DELETE FROM nominas WHERE id_nomina = ?", args: [{ type: "text", value: id }] });


// ── TAREAS ──
export const getTareas = async () => (await queryTurso("SELECT * FROM tareas ORDER BY date(fecha_vencimiento) ASC"))[0] || [];
export const crearTarea = (t) => queryTurso({ sql: "INSERT INTO tareas VALUES (?,?,?,?,?,?,?,?,?)", args: mapArgs([`T-${Date.now()}`, t.tarea, t.fecha_inicio, t.fecha_vencimiento, t.prioridad, t.estado||'Pendiente', t.responsable, t.notas||'', t.color||'#4f46e5']) });
export const updateTareaEstado = (id, est) => queryTurso({ sql: "UPDATE tareas SET estado = ? WHERE id = ?", args: [{type:"text", value:est}, {type:"text", value:id}] });
export const eliminarTarea = (id) => queryTurso({ sql: "DELETE FROM tareas WHERE id = ?", args: [{type:"text", value:id}] });

// ── CONFIGURACIÓN DE EMPRESA ──
export const getAjustesEmpresa = async () => {
  const activeLocal = localStorage.getItem("fonebase_active_local_id") || "1";
  const results = await queryTurso(`SELECT * FROM ajustes_empresa WHERE id = ${activeLocal}`);
  return results[0]?.[0] || null;
};
export const saveAjustesEmpresa = (c) => {
  const activeLocal = localStorage.getItem("fonebase_active_local_id") || "1";
  return queryTurso({
    sql: `UPDATE ajustes_empresa SET nombre=?, nit=?, propietario=?, telefono=?, direccion=?, ciudad=?, contacto=?, correo=?, condiciones=?, logo=?, logo_size=?, mostrar_nombre=? WHERE id=${activeLocal}`,
    args: mapArgs([c.nombre, c.nit, c.propietario, c.telefono, c.direccion, c.ciudad, c.contacto, c.correo, c.condiciones, c.logo || '', c.logo_size || 40, c.mostrar_nombre !== undefined ? c.mostrar_nombre : 1])
  });
};

export const getLocalesConfigurados = async () => {
  const res = await queryTurso("SELECT id, nombre FROM ajustes_empresa", true);
  return res[0] || [];
};

export const crearNuevoLocal = async (nombre) => {
  const locales = await getLocalesConfigurados();
  let nextId = 1;
  locales.forEach(l => {
    const idNum = parseInt(l.id, 10);
    if (idNum >= nextId) nextId = idNum + 1;
  });

  await queryTurso({
    sql: "INSERT INTO ajustes_empresa (id, nombre, nit, propietario, telefono, direccion, ciudad, contacto, correo, condiciones, logo, logo_size, mostrar_nombre) VALUES (?, ?, '900.123.456-1', 'Juan Pérez', '3001234567', 'Calle 123 No. 45 - 67', 'Bogotá - Cundinamarca', '3001234567', 'contacto@miempresa.com', 'GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.', '', 40, 1)",
    args: mapArgs([nextId, nombre])
  }, true);

  return nextId;
};

// ── VALES FÍSICOS ──
export const getValesFisicos = async () => {
  const results = await queryTurso("SELECT * FROM vales_fisicos ORDER BY id DESC");
  return results[0] || [];
};

export const crearValeFisico = (v) => queryTurso({
  sql: "INSERT INTO vales_fisicos (cliente, producto, cantidad, monto, estado, fecha, foto_base64) VALUES (?,?,?,?,?,?,?)",
  args: mapArgs([v.cliente, v.producto, v.cantidad || 1, v.monto || 0, v.estado || 'Pendiente', v.fecha || new Date().toISOString().split('T')[0], v.foto_base64 || ''])
});

export const cambiarEstadoVale = (id, estado) => queryTurso({
  sql: "UPDATE vales_fisicos SET estado = ? WHERE id = ?",
  args: [{ type: "text", value: estado }, { type: "integer", value: Number(id) }]
});

export const eliminarValeFisico = (id) => queryTurso({
  sql: "DELETE FROM vales_fisicos WHERE id = ?",
  args: [{ type: "integer", value: Number(id) }]
});

// ── PRÉSTAMOS PARA EMPLEADOS ──
export const getPrestamos = async () => {
  const results = await queryTurso("SELECT * FROM prestamos_empleados ORDER BY fecha DESC");
  return (results[0] || []).map(p => ({
    ...p,
    id: p.id_prestamo
  }));
};

export const crearPrestamo = (d) => queryTurso({
  sql: "INSERT INTO prestamos_empleados (id_prestamo, fecha, empleado, tipo, monto, producto_id, producto_nombre, cantidad, estado, notas) VALUES (?,?,?,?,?,?,?,?,?,?)",
  args: mapArgs([
    `PR-${Date.now()}`,
    d.fecha || new Date().toISOString(),
    d.empleado,
    d.tipo || 'Dinero',
    Number(d.monto || 0),
    d.producto_id || '',
    d.producto_nombre || '',
    Number(d.cantidad || 0),
    d.estado || 'Pendiente',
    d.notas || ''
  ])
});

export const actualizarPrestamoEstado = (id, estado) => queryTurso({
  sql: "UPDATE prestamos_empleados SET estado = ? WHERE id_prestamo = ?",
  args: [{ type: "text", value: estado }, { type: "text", value: id }]
});

export const eliminarPrestamo = (id) => queryTurso({
  sql: "DELETE FROM prestamos_empleados WHERE id_prestamo = ?",
  args: [{ type: "text", value: id }]
});

// ── METAS FINANCIERAS DE NEGOCIO ──
export const getMetas = async () => {
  const results = await queryTurso("SELECT * FROM metas_financieras ORDER BY fecha_inicio DESC");
  return (results[0] || []).map(m => ({
    ...m,
    id: m.id_meta
  }));
};

export const crearMeta = (d) => queryTurso({
  sql: "INSERT INTO metas_financieras (id_meta, titulo, monto_objetivo, tipo_calculo, fecha_inicio, fecha_limite, estado, notas) VALUES (?,?,?,?,?,?,?,?)",
  args: mapArgs([
    `META-${Date.now()}`,
    d.titulo || '',
    Number(d.monto_objetivo || 0),
    d.tipo_calculo || 'Ventas',
    d.fecha_inicio || new Date().toISOString().split('T')[0],
    d.fecha_limite || new Date().toISOString().split('T')[0],
    d.estado || 'Activa',
    d.notas || ''
  ])
});

export const eliminarMeta = (id) => queryTurso({
  sql: "DELETE FROM metas_financieras WHERE id_meta = ?",
  args: [{ type: "text", value: id }]
});

export const getMetasProgreso = async () => {
  const metas = (await queryTurso("SELECT * FROM metas_financieras ORDER BY fecha_inicio DESC"))[0] || [];
  if (metas.length === 0) return [];

  const requests = [];
  metas.forEach(meta => {
    const startDate = (meta.fecha_inicio || '').substring(0, 10);
    const endDate = (meta.fecha_limite || '').substring(0, 10);

    // Consulta de ventas en el rango
    requests.push({
      sql: "SELECT COALESCE(SUM(CAST(total AS REAL)), 0) as val FROM ventas WHERE date(fecha) >= date(?) AND date(fecha) <= date(?)",
      args: [{ type: "text", value: startDate }, { type: "text", value: endDate }]
    });

    // Consulta de egresos en el rango
    requests.push({
      sql: "SELECT COALESCE(SUM(CAST(monto AS REAL)), 0) as val FROM egresos WHERE date(fecha) >= date(?) AND date(fecha) <= date(?)",
      args: [{ type: "text", value: startDate }, { type: "text", value: endDate }]
    });
  });

  const batchResults = await queryTurso(requests);
  
  let resultIdx = 0;
  return metas.map(meta => {
    const salesVal = batchResults[resultIdx]?.[0]?.val || 0;
    resultIdx++;
    
    const egresosVal = batchResults[resultIdx]?.[0]?.val || 0;
    resultIdx++;
    
    let acumulado = 0;
    if (meta.tipo_calculo === 'Ventas') {
      acumulado = salesVal;
    } else if (meta.tipo_calculo === 'Utilidad') {
      acumulado = salesVal - egresosVal;
    }
    
    const porcentaje = meta.monto_objetivo > 0 ? (acumulado / meta.monto_objetivo) * 100 : 0;
    
    return {
      ...meta,
      id: meta.id_meta,
      acumulado,
      porcentaje
    };
  });
};

export const procesarValeOcrConQwen = async (base64Data) => {
  const prompt = 'Responde ÚNICAMENTE un objeto JSON válido con los campos: "cliente" (string), "producto" (string), "cantidad" (número), "monto" (número), "fecha" (YYYY-MM-DD). No incluyas explicaciones ni bloques de texto.';

  const openRouterApiKey = getOpenRouterApiKey();
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

  const models = [
    "qwen/qwen2.5-vl-72b-instruct",
    "qwen/qwen3.7-flash"
  ];

  let dataUrl = base64Data;
  if (!dataUrl.startsWith("data:")) {
    dataUrl = `data:image/jpeg;base64,${dataUrl}`;
  }

  let lastError = "";

  for (const modelName of models) {
    try {
      const response = await fetch(openRouterUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://adminpro.local",
          "X-Title": "FoneBase OCR"
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: dataUrl } }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        lastError = `Status ${response.status}: ${await response.text()}`;
        continue;
      }

      const resData = await response.json();
      const rawText = resData.choices[0]?.message?.content || "";
      let cleanedJson = rawText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

      const firstBrace = cleanedJson.indexOf("{");
      const lastBrace = cleanedJson.lastIndexOf("}");
      
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleanedJson.substring(firstBrace, lastBrace + 1));
        } catch (e) {
          console.warn("Fallo sub-brace parse, intentando parse directo...", e);
        }
      }

      try {
        return JSON.parse(cleanedJson);
      } catch (e) {
        // Fallback de extracción vía Regex si el JSON está incompleto o con formato mixto
        const clienteMatch = rawText.match(/"cliente"\s*:\s*"([^"]+)"/i);
        const productoMatch = rawText.match(/"producto"\s*:\s*"([^"]+)"/i);
        const cantidadMatch = rawText.match(/"cantidad"\s*:\s*(\d+)/i);
        const montoMatch = rawText.match(/"monto"\s*:\s*(\d+)/i);
        const fechaMatch = rawText.match(/"fecha"\s*:\s*"([^"]+)"/i);

        if (clienteMatch || productoMatch || montoMatch) {
          return {
            cliente: clienteMatch ? clienteMatch[1] : "Cliente Vale",
            producto: productoMatch ? productoMatch[1] : "Producto impreso",
            cantidad: cantidadMatch ? parseInt(cantidadMatch[1], 10) : 1,
            monto: montoMatch ? parseInt(montoMatch[1], 10) : 0,
            fecha: fechaMatch ? fechaMatch[1] : new Date().toISOString().split('T')[0]
          };
        }
        throw new Error("No se pudo interpretar el formato JSON del modelo: " + e.message);
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error("No se pudo extraer la información del vale: " + lastError);
};
