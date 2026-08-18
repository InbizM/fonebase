# 📱 FoneBase — Documentación Completa del Sistema y Proyecto

Bienvenido a la documentación técnica y funcional de **FoneBase**, el sistema integral de Punto de Venta (POS), Gestión de Inventarios con control de IMEIs, Servicio Técnico y Asistente Inteligente con IA para tiendas de telefonía móvil y tecnología.

---

## 📌 1. Información General del Proyecto

* **Nombre del Proyecto:** FoneBase (POS & ERP de Telefonía Móvil)
* **Directorio Raíz:** `/data/data/com.termux/files/home/fonebase/`
* **Repositorio Remoto:** `git@github.com:InbizM/fonebase.git` (Rama `main`)
* **Despliegue Web:** [https://inbizm.github.io/fonebase/](https://inbizm.github.io/fonebase/)
* **Entorno Local:** `http://localhost:5173/` (Servidor de desarrollo Vite)

---

## 🛠️ 2. Stack Tecnológico

| Capa | Tecnología Utilizada | Descripción |
|---|---|---|
| **Frontend Core** | **HTML5 Semántico + Vanilla JavaScript (ES Modules)** | Máximo rendimiento, sin sobrecarga de frameworks pesados. |
| **Estilos y UI** | **Tailwind CSS + Material Symbols + Google Fonts** | Diseño responsivo moderno, optimizado para celulares y tablets. |
| **Empaquetador** | **Vite** | Compilación ultrarrápida en entorno móvil Termux/Android. |
| **Base de Datos** | **Turso Cloud (libSQL / SQLite Distribuido)** | Base de datos SQL en la nube con réplicas de baja latencia y modo offline. |
| **Inteligencia Artificial** | **OpenRouter API (`google/gemini-2.5-flash-lite`)** | Procesamiento de visión multimodal, OCR de etiquetas IMEI y asistente en tiempo real. |
| **Seguridad** | **2FA TOTP (Google/Microsoft Authenticator)** | Autenticación de doble factor basada en algoritmos criptográficos HMAC-SHA1. |

---

## 📂 3. Estructura de Archivos del Código Fuente

```text
fonebase/
├── index.html                     # Maquetación principal de la SPA y modales interactivos
├── package.json                   # Dependencias y scripts de construcción (Vite)
├── vite.config.js                 # Configuración de compilación y empaquetado
├── PROYECTO_DOCUMENTACION.md      # Este documento explicativo
├── src/
│   ├── main.js                    # Router principal, carga dinámica de módulos y estado global
│   ├── api.js                     # Conector con Turso SQL, OpenRouter, compresión y 2FA
│   ├── toast.js                   # Sistema de notificaciones flotantes (éxito, aviso, error)
│   ├── style.css                  # Estilos complementarios y temas oscuro/claro
│   │
│   ├── views/                     # Módulos y vistas del sistema
│   │   ├── dashboard.js           # Métricas financieras, ventas, egresos y gráficos 7D
│   │   ├── pos.js                 # Punto de Venta, escaneo de IMEI, cobro y facturación
│   │   ├── inventory.js           # Catálogo general de productos, precios y fotos
│   │   ├── imei.js                # Control detallado de IMEIs, estados y escáner IA
│   │   ├── technical.js           # Órdenes de Servicio Técnico y trazabilidad de taller
│   │   ├── credits.js             # Módulo de ventas a crédito, cartera y abonos parciales
│   │   ├── expenses.js            # Registro de gastos y egresos del negocio
│   │   ├── customers.js           # Directorio de clientes y cédulas
│   │   ├── payroll.js             # Nómina, préstamos y adelantos a empleados
│   │   ├── goals.js               # Metas financieras y porcentaje de cumplimiento
│   │   ├── users.js               # Control de usuarios, roles (Admin/Vendedor/Técnico) y 2FA
│   │   └── company-settings.js    # Datos del local, nombre comercial, NIT y logotipo
│   │
│   └── agent/                     # Módulo de Inteligencia Artificial (FoneBase IA)
│       ├── agent-view.js          # Interfaz visual del chat, burbujas y notas de voz
│       ├── agent-service.js       # Inyección de contexto en tiempo real y llamada a OpenRouter
│       └── agent-tools.js         # Ejecutor de acciones, wizard multi-producto y auto-vinculación
```

---

## 🧩 4. Módulos y Funcionalidades Clave

### 1. Punto de Venta (POS) — `src/views/pos.js`
* **Venta Rápida y por IMEI:** Permite vender productos generales o seleccionar el IMEI físico específico que sale de la tienda.
* **Múltiples Métodos de Pago:** Efectivo, Transferencia (Nequi/Daviplata/Bancolombia), Tarjeta, Crédito o Mixto.
* **Facturación Digital:** Generación de recibo térmico imprimible o descargable con QR, desglose de IVA, firmas y soporte de garantía.
* **Reventas Directas:** Registra productos de reventa externa sin necesidad de registrarlos previamente en el inventario.

### 2. Control de Inventario y Catálogo — `src/views/inventory.js`
* **Plantillas de Producto:** Agrupa los teléfonos por nombre comercial y referencia técnica (ej. `Tecno Spark Go 3 (KN3)`, `Samsung Galaxy A17`).
* **Sincronización Automática de Stock con IMEIs:** El stock de cada celular en el inventario coincide exactamente con la cantidad de IMEIs físicos con estado `'Disponible'`.
* **Compresión Inteligente de Imágenes:** Comprime fotos de cámara/galería a ~15-20 KB en memoria usando Canvas, evitando sobrecargar la base de datos.
* **Escáner Multifoto con IA:** Analiza hasta 4 fotos de una caja y extrae automáticamente ficha técnica, color, RAM, ROM y genera copia publicitaria.

### 3. Módulo de Equipos e IMEIs — `src/views/imei.js`
* **Trazabilidad 1 a 1:** Cada teléfono físico tiene su IMEI1 (15 dígitos), IMEI2 opcional, color, RAM, memoria interna, proveedor, costo de compra y precio de venta.
* **Estados del Equipo:**
  * `Disponible`: En tienda listo para venta.
  * `Vendido`: Entregado al cliente con factura asociada.
  * `En Servicio Técnico`: En reparación interna o externa.
  * `Garantía`: Devuelto por el cliente para trámite.
* **Carga Masiva de IMEIs:** Escaneo por cámara o importación en lote de decenas de IMEIs de una sola vez.

### 4. Servicio Técnico — `src/views/technical.js`
* **Recepción de Equipos:** Registro de cliente, equipo, IMEI/serie, falla reportada, patrón/clave de desbloqueo y fotos de evidencia del estado físico de recepción.
* **Control de Taller:** Costo de taller vs. Precio cobrado al cliente para cálculo automático de utilidad.
* **Abonos y Estados:** `Recibido` ➔ `En Revisión` ➔ `Esperando Repuesto` ➔ `Reparado` ➔ `Entregado` ➔ `Sin Solución`.

### 5. Créditos y Cobranzas — `src/views/credits.js`
* **Ventas Financiadas:** Registro de compras a cuotas vinculadas a clientes.
* **Historial de Abonos:** Registra cada abono con fecha, monto y responsable, recalculando el saldo pendiente al instante.

### 6. Finanzas y Egresos — `src/views/expenses.js` y `dashboard.js`
* **Cálculo de Utilidad en Tiempo Real:** `Utilidad = Ventas Totales - Costo de Mercancía - Egresos Operativos`.
* **Gráficos Dinámicos:** Comparativa de ingresos vs. egresos de los últimos 7 días.

---

## 🤖 5. Asistente Inteligente (FoneBase IA)

El asistente inteligente permite operar el negocio por **Voz, Texto o Fotos de Etiquetas**:

### ¿Cómo funciona la arquitectura de IA?
1. **Inyección de Contexto en Tiempo Real (`agent-service.js`):** Cada vez que hablas con el asistente, este recibe el estado actual del negocio (ventas de hoy, egresos, stock crítico, catálogo de productos con sus IDs y precios).
2. **Motor de Visión Multimodal (`google/gemini-2.5-flash-lite`):**
   * Lee fotos de etiquetas de cajas y extrae los 15 dígitos de cada IMEI, modelo, RAM, ROM y color.
3. **Herencia Automática de Precios (`agent-tools.js`):**
   * Al recibir una orden como *"agrega los imei"*, busca automáticamente si el producto ya existe en el inventario por su nombre o SKU (ej. `A17`, `KN3`, `A07`).
   * Si ya existe, **hereda de inmediato su costo, precio de venta, precio de revendedor y foto sin pedírtelos de nuevo**.
4. **Formulario Interactivo (Wizard):**
   * Solo si el producto es totalmente nuevo y no tiene precio, abre un asistente visual paso a paso para definir el costo de compra y calcular el precio de venta sugerido (+20%) y revendedor (+5%).

---

## 🗄️ 6. Esquema de Base de Datos (Turso SQL)

Cada local comercial tiene sus tablas aisladas bajo el prefijo `localX_` (ej. `local1_inventario`, `local1_equipos`):

```sql
-- 1. Tabla de Inventario / Catálogo General
CREATE TABLE inventario (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  marca TEXT,
  categoria TEXT,
  tipo TEXT DEFAULT 'Físico',
  costo REAL DEFAULT 0,
  precio_venta REAL DEFAULT 0,
  stock_minimo INTEGER DEFAULT 1,
  stock_actual INTEGER DEFAULT 0,
  ubicacion TEXT,
  sku TEXT,
  imagen TEXT,
  fijado INTEGER DEFAULT 0
);

-- 2. Tabla de Teléfonos Físicos con IMEI
CREATE TABLE equipos (
  imei1 TEXT PRIMARY KEY,
  imei2 TEXT,
  id_producto TEXT,
  marca TEXT,
  nombre TEXT NOT NULL,
  proveedor TEXT,
  costo REAL DEFAULT 0,
  venta REAL DEFAULT 0,
  precio_revendedor REAL DEFAULT 0,
  estado TEXT DEFAULT 'Disponible',
  fecha_ingreso TEXT,
  color TEXT,
  ram TEXT,
  memoria TEXT,
  condicion TEXT DEFAULT 'Nuevo',
  notas TEXT
);

-- 3. Tabla de Ventas y Facturas
CREATE TABLE ventas (
  id_factura TEXT PRIMARY KEY,
  fecha TEXT,
  cedula TEXT,
  cliente TEXT,
  direccion TEXT,
  productoNombre TEXT,
  total TEXT,
  items TEXT,
  imeis TEXT,
  subtotal REAL,
  descuento REAL,
  total_num REAL,
  metodo TEXT,
  vendedor TEXT,
  firmaVendedor TEXT,
  firmaComprador TEXT,
  evidencia TEXT,
  ciudad TEXT,
  telefono TEXT,
  tipoFactura TEXT DEFAULT 'fisica'
);

-- 4. Tabla de Servicio Técnico
CREATE TABLE servicio_tecnico (
  id_orden TEXT PRIMARY KEY,
  cliente TEXT,
  telefono TEXT,
  equipo TEXT,
  imei_serie TEXT,
  falla TEXT,
  clave_patron TEXT,
  repuestos TEXT,
  costo_taller REAL DEFAULT 0,
  abono REAL DEFAULT 0,
  precio_final REAL DEFAULT 0,
  estado TEXT DEFAULT 'Recibido',
  evidencias TEXT
);

-- 5. Tabla de Créditos y Cartera
CREATE TABLE creditos (
  id_credito TEXT PRIMARY KEY,
  cliente TEXT,
  telefono TEXT,
  id_factura_ref TEXT,
  fecha_deuda TEXT,
  tipo TEXT DEFAULT 'Crédito',
  valor_total REAL,
  total_abonado REAL DEFAULT 0,
  saldo_pendiente REAL,
  estado TEXT DEFAULT 'Activo',
  fecha_cancelacion TEXT,
  detalle TEXT,
  historial_abonos TEXT
);

-- 6. Tabla de Egresos y Gastos
CREATE TABLE egresos (
  id_gasto TEXT PRIMARY KEY,
  fecha TEXT,
  categoria TEXT,
  concepto TEXT,
  responsable TEXT,
  monto REAL,
  comprobante TEXT
);
```

---

## ⚡ 7. Comandos Frecuentes de Desarrollo

```bash
# Entrar al directorio del proyecto
cd /data/data/com.termux/files/home/fonebase

# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción (genera la carpeta dist/)
npm run build

# Subir cambios al repositorio GitHub
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

*Documento generado para el proyecto **FoneBase** — Sistema de Gestión Inteligente.*
