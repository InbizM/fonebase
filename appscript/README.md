# Módulo Google Apps Script — Backup Incremental Turso DB

Este directorio contiene el código y la configuración para respaldar automáticamente tu base de datos de **Turso (SQLite Cloud)** hacia **Google Sheets** cada 30 minutos sin duplicar datos.

## 📁 Archivos en esta carpeta:

- [BackupTursoToSheets.js](file:///data/data/com.termux/files/home/adminpro/appscript/BackupTursoToSheets.js): Script principal con la lógica de consulta a Turso DB y escritura incremental en Google Sheets.

## 🚀 Cómo instalar y activar en Google Sheets:

1. Abre tu hoja de Google Sheets en tu navegador.
2. Ve al menú **Extensiones** > **Apps Script**.
3. Copia el contenido del archivo [BackupTursoToSheets.js](file:///data/data/com.termux/files/home/adminpro/appscript/BackupTursoToSheets.js) y pégalo en el editor de Apps Script.
4. Selecciona la función `crearDisparadorCada30Min` en la barra superior y presiona **Ejecutar**.
5. Concede los permisos solicitados la primera vez.

¡Listo! A partir de ese momento, cada 30 minutos se ejecutará el respaldo automático registrando únicamente la información nueva en pestañas dedicadas para cada tabla.
