/**
 * ==============================================================================
 * BACKUP AUTOMÁTICO DE TURSO DB EN ARCHIVOS JSON DENTRO DE GOOGLE DRIVE
 * Frecuencia: Cada 30 Minutos (Guarda / Actualiza JSON completo en Google Drive)
 * ==============================================================================
 */

// ⚙️ CONFIGURACIÓN DE CONEXIÓN A TURSO DB Y GOOGLE DRIVE
const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

// NOMBRE DE LA CARPETA EN TU GOOGLE DRIVE DONDE SE GUARDARÁN LOS BACKUPS
const CARPETA_DRIVE_NOMBRE = "Backups_AdminPro_TursoDB";

// LISTA DE TABLAS A RESPALDAR
const TABLAS = [
  "usuarios",
  "clientes",
  "inventario",
  "equipos",
  "ventas",
  "egresos",
  "servicio_tecnico",
  "creditos",
  "reventas",
  "proveedores",
  "marcas_categorias",
  "tareas",
  "nominas",
  "ajustes_empresa",
  "vales_fisicos"
];

/**
 * FUNCIÓN PRINCIPAL: Genera el archivo JSON con toda la BD y lo guarda en Google Drive
 */
function ejecutarBackupTursoADriveJSON() {
  console.log("🚀 Iniciando Backup JSON de Turso DB a Google Drive...");

  // 1. Obtener o crear la carpeta en Google Drive
  const carpeta = obtenerOCrearCarpeta(CARPETA_DRIVE_NOMBRE);

  // 2. Extraer toda la información de cada tabla
  const datosCompletos = {
    metadata: {
      fecha_backup: new Date().toISOString(),
      timestamp: Date.now(),
      origen: "Turso DB (AdminPro)",
      total_tablas: TABLAS.length
    },
    tablas: {}
  };

  TABLAS.forEach(tablaNombre => {
    try {
      const registros = consultarTurso(`SELECT * FROM ${tablaNombre}`);
      datosCompletos.tablas[tablaNombre] = registros || [];
      console.log(`✅ Tabla [${tablaNombre}]: ${registros ? registros.length : 0} registros extraídos.`);
    } catch (err) {
      console.error(`❌ Error al extraer tabla ${tablaNombre}: ${err.message}`);
      datosCompletos.tablas[tablaNombre] = [];
    }
  });

  // 3. Convertir todo el objeto a formato JSON estructurado
  const jsonContent = JSON.stringify(datosCompletos, null, 2);

  // 4. Nombre del archivo con marca de tiempo (Ej: backup_adminpro_turso_2026-08-09_06-30.json)
  const ahora = new Date();
  const fechaTexto = ahora.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
  const nombreArchivo = `backup_adminpro_turso_${fechaTexto}.json`;

  // 5. Crear el archivo en la carpeta de Google Drive
  const archivo = carpeta.createFile(nombreArchivo, jsonContent, MimeType.PLAIN_TEXT);
  console.log(`🎉 Archivo creado exitosamente en Google Drive: ${archivo.getName()} (ID: ${archivo.getId()})`);

  // 6. Opcional: Mantener también un archivo siempre actualizado de "ultimo_backup.json"
  actualizarArchivoUltimoBackup(carpeta, jsonContent);
}

/**
 * Mantiene un archivo 'ultimo_backup.json' siempre al día en la misma carpeta
 */
function actualizarArchivoUltimoBackup(carpeta, jsonContent) {
  const archivos = carpeta.getFilesByName("ultimo_backup.json");
  if (archivos.hasNext()) {
    const archivoExistente = archivos.next();
    archivoExistente.setContent(jsonContent);
    console.log("🔄 Archivo 'ultimo_backup.json' actualizado.");
  } else {
    carpeta.createFile("ultimo_backup.json", jsonContent, MimeType.PLAIN_TEXT);
    console.log("📄 Archivo 'ultimo_backup.json' creado.");
  }
}

/**
 * Busca la carpeta en Google Drive; si no existe, la crea
 */
function obtenerOCrearCarpeta(nombreCarpeta) {
  const carpetas = DriveApp.getFoldersByName(nombreCarpeta);
  if (carpetas.hasNext()) {
    return carpetas.next();
  } else {
    return DriveApp.createFolder(nombreCarpeta);
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
 * CONFIGURACIÓN AUTOMÁTICA DEL TRIGGER CADA 30 MINUTOS
 * Ejecuta esta función una única vez desde el editor para activar el respaldo automático.
 */
function crearDisparadorCada30MinDrive() {
  // Elimina disparadores previos duplicados
  const disparadores = ScriptApp.getProjectTriggers();
  disparadores.forEach(t => {
    if (t.getHandlerFunction() === "ejecutarBackupTursoADriveJSON") {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Crea el disparador automático cada 30 minutos
  ScriptApp.newTrigger("ejecutarBackupTursoADriveJSON")
    .timeBased()
    .everyMinutes(30)
    .create();

  console.log("⏱️ Disparador automático a Google Drive configurado exitosamente cada 30 minutos.");
}
