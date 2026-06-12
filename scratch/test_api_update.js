const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

// Map args keeping numbers as numbers
const mapArgs = (d) => d.map(v => {
  if (typeof v === 'number') {
    return { type: 'float', value: v };
  }
  return { type: 'text', value: String(v || '') };
});

async function queryTurso(sqls) {
  const requests = Array.isArray(sqls)
    ? sqls.map(s => (typeof s === 'string' ? { type: "execute", stmt: { sql: s } } : (s.type ? s : { type: "execute", stmt: s })))
    : [{ type: "execute", stmt: (typeof sqls === 'string' ? { sql: sqls } : sqls) }];
  const res = await fetch(TURSO_URL, { method: "POST", headers: { "Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ requests }) });
  const data = await res.json();
  return data;
}

async function run() {
  const d = {
    id_credito: "CRE-9001",
    cliente: "Camila Holguín",
    telefono: "315",
    id_factura_ref: "FAC-5002",
    fecha_deuda: "2024-04-24",
    tipo: "Crédito",
    valor_total: 1000000,
    total_abonado: 250000,
    saldo_pendiente: 750000,
    estado: "Activo",
    fecha_cancelacion: "",
    detalle: "Venta Celular",
    historial_abonos: "12/6/2026 12:45 p. m.|50000||Efectivo"
  };
  
  const id = "CRE-9001";
  
  const query = { 
    sql: "UPDATE creditos SET id_credito=?, cliente=?, telefono=?, id_factura_ref=?, fecha_deuda=?, tipo=?, valor_total=?, total_abonado=?, saldo_pendiente=?, estado=?, fecha_cancelacion=?, detalle=?, historial_abonos=? WHERE id_credito=?", 
    args: [...mapArgs([
      d.id_credito || d.id,
      d.cliente,
      d.telefono,
      d.id_factura_ref || d.idFactura || "",
      d.fecha_deuda || d.fecha || "",
      d.tipo || "Crédito",
      d.valor_total !== undefined ? d.valor_total : d.total,
      d.total_abonado !== undefined ? d.total_abonado : d.abonado,
      d.saldo_pendiente !== undefined ? d.saldo_pendiente : d.saldo,
      d.estado,
      d.fecha_cancelacion || d.fechaCancelacion || "",
      d.detalle || "",
      d.historial_abonos || d.historialAbonos || ""
    ]), { type: "text", value: id }] 
  };
  
  try {
    const data = await queryTurso(query);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
}

run();
