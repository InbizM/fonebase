# Módulo Google Apps Script — Backup Turso DB a Google Drive (Archivos JSON)

Este directorio contiene la solución para respaldar de manera automática toda la base de datos de **Turso (SQLite Cloud)** generando archivos `.json` directamente en una carpeta de tu **Google Drive** cada 30 minutos.

## 📁 Archivos en esta carpeta:

- [BackupTursoToDriveJSON.js](file:///data/data/com.termux/files/home/adminpro/appscript/BackupTursoToDriveJSON.js): Script de Google Apps Script que extrae todas las tablas de Turso DB y guarda un archivo `.json` timestamped en la carpeta `Backups_AdminPro_TursoDB` de tu Google Drive.

## 🚀 Cómo instalarlo en tu cuenta de Google:

1. Ve a [script.google.com](https://script.google.com) y crea un **Nuevo Proyecto**.
2. Copia y pega todo el contenido del archivo [BackupTursoToDriveJSON.js](file:///data/data/com.termux/files/home/adminpro/appscript/BackupTursoToDriveJSON.js).
3. Selecciona la función `crearDisparadorCada30MinDrive` y presiona **Ejecutar**.
4. Concede los permisos de Google Drive cuando te los solicite.

¡Listo! A partir de ese momento, cada 30 minutos se creará automáticamente un archivo de respaldo `.json` en tu carpeta `Backups_AdminPro_TursoDB` de Google Drive y se mantendrá actualizado el archivo `ultimo_backup.json`.
