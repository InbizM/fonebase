/**
 * ==============================================================================
 * BACKUP INTELIGENTE DE TURSO DB (SQLITE CLOUD) A GOOGLE SHEETS
 * Frecuencia: Cada 30 Minutos (Incremental sin duplicar datos)
 * ==============================================================================
 */

// ⚙️ CONFIGURACIÓN DE CONEXIÓN A TURSO DB
const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

// DEFINICIÓN DE TABLAS Y SUS LLAVES PRIMARIAS
const TABLAS_CONFIG = [
  { nombre: "clientes", pk: "id", modo: "incremental" },
  { nombre: "inventario", pk: "id", modo: "sincronizar" }, // Sincroniza stock actual
  { nombre: "equipos", pk: "imei1", modo: "incremental" },
  { nombre: "ventas", pk: "id_factura", modo: "incremental" },
  { nombre: "egresos", pk: "id_gasto", modo: "incremental" },
  { nombre: "servicio_tecnico", pk: "id_orden", modo: "incremental" },
  { nombre: "creditos", pk: "id_credito", modo: "incremental" },
  { nombre: "reventas", pk: "id_reventa", modo: "incremental" },
  { nombre: "proveedores", pk: "id_prov", modo: "incremental" },
  { nombre: "vales_fisicos", pk: "id", modo: "incremental" },
  { nombre: "tareas", pk: "id", modo: "incremental" },
  { nombre: "nominas", pk: "id_nomina", modo: "incremental" },
  { nombre: "marcas_categorias", pk: "nombre", modo: "incremental" },
  { nombre: "ajustes_empresa", pk: "id", modo: "sincronizar" }
];

/**
 * FUNCIÓN PRINCIPAL: Ejecuta el Backup Incremental
 */
function ejecutarBackupIncrementalTurso() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  console.log("🚀 Iniciando Backup Incremental desde Turso DB...");

  TABLAS_CONFIG.forEach(tConfig => {
    try {
      backupTabla(ss, tConfig);
    } catch (err) {
      console.error("❌ Error respaldando tabla " + tConfig.nombre + ": " + err.message);
    }
  });

  console.log("✅ Backup Inteligente completado con éxito a las " + new Date().toLocaleString());
}

/**
 * Procesa la copia de una tabla específica
 */
function backupTabla(ss, config) {
  let sheet = ss.getSheetByName(config.nombre);
  
  // 1. Obtener datos desde Turso DB
  const registros = consultarTurso(`SELECT * FROM ${config.nombre}`);
  if (!registros || registros.length === 0) return;

  const columnas = Object.keys(registros[0]);

  // 2. Si la pestaña no existe, la creamos y colocamos los encabezados
  if (!sheet) {
    sheet = ss.insertSheet(config.nombre);
    sheet.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight("bold").setBackground("#e2e8f0");
    sheet.setFrozenRows(1);
  }

  // 3. Obtener llaves ya respaldadas en la hoja de cálculo
  const lastRow = sheet.getLastRow();
  let idsExistentes = new Set();
  
  if (lastRow > 1) {
    const pkIndex = columnas.indexOf(config.pk);
    if (pkIndex !== -1) {
      const pkRange = sheet.getRange(2, pkIndex + 1, lastRow - 1, 1).getValues();
      pkRange.forEach(row => {
        if (row[0] !== "" && row[0] !== null) idsExistentes.add(String(row[0]));
      });
    }
  }

  // 4. Modo Incremental: Filtrar solo registros nuevos
  if (config.modo === "incremental") {
    const nuevosRegistros = registros.filter(r => !idsExistentes.has(String(r[config.pk])));
    
    if (nuevosRegistros.length > 0) {
      const filasNuevas = nuevosRegistros.map(r => columnas.map(c => sanitizarValor(r[c])));
      sheet.getRange(sheet.getLastRow() + 1, 1, filasNuevas.length, columnas.length).setValues(filasNuevas);
      console.log(`📌 [${config.nombre}]: +${nuevosRegistros.length} nuevos registros agregados.`);
    } else {
      console.log(`ℹ️ [${config.nombre}]: Sin registros nuevos.`);
    }
  } 
  // 5. Modo Sincronizar (Inventario / Ajustes): Reemplaza todo para mantener el stock exacto
  else if (config.modo === "sincronizar") {
    sheet.clearContents();
    sheet.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight("bold").setBackground("#cbd5e1");
    sheet.setFrozenRows(1);
    
    const todasLasFilas = registros.map(r => columnas.map(c => sanitizarValor(r[c])));
    sheet.getRange(2, 1, todasLasFilas.length, columnas.length).setValues(todasLasFilas);
    console.log(`🔄 [${config.nombre}]: Sincronización completa (${registros.length} filas).`);
  }
}

/**
 * Consulta la API Pipeline de Turso DB
 */
function consultarTurso(sql) {
  const payload = {
    requests: [{ type: "execute", stmt: { sql: sql } }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + TURSO_TOKEN
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const res = UrlFetchApp.fetch(TURSO_URL, options);
  const data = JSON.parse(res.getContentText());

  if (data.error) throw new Error(data.error.message);

  const result = data.results[0].response.result;
  const cols = result.cols.map(c => c.name);
  
  return result.rows.map(row => {
    let obj = {};
    cols.forEach((colName, idx) => {
      obj[colName] = row[idx].value;
    });
    return obj;
  });
}

/**
 * Limpia y sanitiza datos largos o imágenes base64 para Google Sheets
 */
function sanitizarValor(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  let str = String(val);
  // Si es un base64 muy largo (ej. imágenes o firmas), recorta para evitar desbordar límites de celda
  if (str.startsWith("data:image") && str.length > 500) {
    return "[IMAGEN_BASE64_ADJUNTA]";
  }
  return str;
}

/**
 * CONFIGURACIÓN AUTOMÁTICA DEL TRIGGER CADA 30 MINUTOS
 * Ejecuta esta función una única vez desde el editor para activar el respaldo automático.
 */
function crearDisparadorCada30Min() {
  // Elimina disparadores previos duplicados
  const disparadores = ScriptApp.getProjectTriggers();
  disparadores.forEach(t => {
    if (t.getHandlerFunction() === "ejecutarBackupIncrementalTurso") {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Crea el disparador automático cada 30 minutos
  ScriptApp.newTrigger("ejecutarBackupIncrementalTurso")
    .timeBased()
    .everyMinutes(30)
    .create();

  console.log("⏱️ Disparador automático configurado exitosamente cada 30 minutos.");
}
