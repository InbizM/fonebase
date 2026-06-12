import { actualizarCredito } from "../src/api.js";

async function run() {
  const d = {
    id_credito: "CRE-9001",
    cliente: "Camila Holguín",
    telefono: "315",
    id_factura_ref: "FAC-5002",
    fecha_deuda: "2024-04-24",
    tipo: "Crédito",
    valor_total: 1000000,
    total_abonado: 300000,
    saldo_pendiente: 700000,
    estado: "Activo",
    fecha_cancelacion: "",
    detalle: "Venta Celular",
    historial_abonos: "12/6/2026 12:45 p. m.|50000||Efectivo"
  };
  const id = "CRE-9001";
  try {
    const res = await actualizarCredito(id, d);
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
