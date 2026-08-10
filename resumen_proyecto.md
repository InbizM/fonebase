# FoneBase — Resumen del Proyecto e Implementaciones Recientes

Este archivo contiene la hoja de ruta, arquitectura del sistema y el detalle de las últimas implementaciones realizadas en FoneBase.

---

## 📂 Ruta del Proyecto
* **Directorio del Código Principal:** `/data/data/com.termux/files/home/adminpro`
* **Directorio de la APK de Android:** `/data/data/com.termux/files/home/FoneBase.apk`
* **Servidor Local de Desarrollo:** `http://localhost:5173/adminpro/`
* **Servidor en Red Local:** `http://192.168.1.105:5173/adminpro/`

---

## 🛠️ Stack Tecnológico
1. **Frontend:** Single Page Application (SPA) construida con **Vite** y empaquetada con **TailwindCSS**.
2. **Base de Datos:** **Turso DB** (base de datos SQLite distribuida en la nube, operada directamente mediante HTTPS pipelines sin depender de un servidor local de base de datos).
3. **Inteligencia Artificial:** **Qwen 3.7 Flash** (procesamiento de comandos por voz y lenguaje natural) mediante OpenRouter.
4. **Reconocimiento de Voz:** **Web Speech API** nativa de Android/iOS/Navegador.
5. **Nativo Móvil:** **Capacitor.js** (utilizado para compilar el build de producción web `/dist` como APK de Android nativa).

---

## 🚀 Últimas Implementaciones (Agosto 2026)

### 1. ⚡ Venta Flash de Accesorios (POS)
* **Botón de Venta Flash:** Ubicado arriba del botón de Venta normal en el panel de cobro del POS (tanto en escritorio como en móvil).
* **Modal Wizard Paso a Paso:** Al presionarlo, abre un modal guiado que permite:
  * **Paso 1:** Elegir un accesorio (excluye celulares y filtra por categoría 'Accesorios' con buscador veloz).
  * **Paso 2:** Digitar o modificar el precio final de venta acordado directamente con el cliente (independiente del precio de lista).
  * **Paso 3:** Confirmar para registrar de inmediato en la base de datos (con el perfil automático `"Cliente Flash"`, método `"Efectivo"` y fecha actual) y enviar a imprimir el ticket.

### 2. 💬 Sección del Asistente IA (Chat de Voz/Texto)
* **Acceso Principal:** Se creó una vista independiente (`data-view="assistant"`) en el menú del sidebar al lado del Dashboard con el icono de globos de conversación (`forum`).
* **Chat de Pantalla Completa:** Interfaz minimalista de ancho completo (100% width) limpia y libre de paneles adicionales, ideal para hablar o escribir peticiones rápidas a la IA ("Registrar egreso...", "Crear tarea...", etc.).

### 3. 📄 Impresión de Póster PDF en Kiosco
* **Botón de Impresión:** Se añadieron botones de **"Imprimir Póster PDF"** en el panel de navegación y cabecera del Kiosco.
* **Estilo Póster Revista:** Configura reglas `@media print` en [kiosk.js](file:///data/data/com.termux/files/home/adminpro/src/views/kiosk.js) para ocultar las barras del sistema y formatear el póster en una página A4 limpia para imprimir o guardar como PDF manteniendo el diseño beige/negro/rojo de revista de moda.

### 4. 📦 Restauración del Catálogo PDF (Inventario)
* Se restauró por completo la función `generatePdfCatalog()` en [inventory.js](file:///data/data/com.termux/files/home/adminpro/src/views/inventory.js) adaptándola visualmente a la paleta de colores del Kiosco (portada negra tipo revista con letras crema y catálogo interno beige en doble columna con borde fino).

### 📱 5. Empaquetado APK de Android (Capacitor)
* Se configuró Capacitor y se compiló de forma exitosa el proyecto nativo usando el SDK de Android local de Termux, generando el archivo instalable `/data/data/com.termux/files/home/FoneBase.apk` (4.4 MB, ejecuta el frontend local offline y consulta APIs en la nube).

---

## 🗺️ Listado Completo de Módulos (Vistas en `src/views/`)
* **Dashboard (`dashboard.js`):** Métricas, KPIs financieros de ventas/egresos, ventas recientes, control de tareas del día.
* **Asistente IA (`assistant.js`):** Comando por voz y chat con ejecución de operaciones automáticas.
* **Punto de Venta (`pos.js`):** Carrito de compras, cotizaciones, plan separe, cobros digitales con firma y venta flash.
* **Catálogo de Inventario (`inventory.js`):** CRUD de stock, escáner de códigos de barra por cámara, generación de catálogos PDF.
* **Equipos IMEI (`imei.js`):** Registro de dispositivos por número IMEI y control de estados (Disponible, Vendido).
* **Modo Kiosco (`kiosk.js`):** Rotador de pósters tipo revista para exhibición en vitrina.
* **Servicio Técnico (`technical.js`):** Cola de reparaciones, estados e impresión de reportes de servicio.
* **Clientes (`clients.js`):** Base de datos de clientes, historiales de créditos y facturación.
* **Ajustes (`settings.js`):** Perfil de la tienda, datos fiscales del ticket de compra y configuración de facturación.
