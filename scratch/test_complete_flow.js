const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

async function queryTurso(sqls) {
  const requests = Array.isArray(sqls)
    ? sqls.map(s => (typeof s === 'string' ? { type: "execute", stmt: { sql: s } } : (s.type ? s : { type: "execute", stmt: s })))
    : [{ type: "execute", stmt: (typeof sqls === 'string' ? { sql: sqls } : sqls) }];
  const res = await fetch(TURSO_URL, { method: "POST", headers: { "Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ requests }) });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return (data.results || []).map(r => {
    if (!r.response || !r.response.result) return [];
    const { cols, rows } = r.response.result;
    return rows.map(row => {
      const obj = {};
      cols.forEach((col, i) => { obj[col.name] = row[i].value; });
      return obj;
    });
  });
}

const mapArgs = (d) => d.map(v => {
  if (typeof v === 'number') {
    return { type: 'float', value: v };
  }
  return { type: 'text', value: String(v !== undefined && v !== null ? v : '') };
});

const getCreditos = async () => (await queryTurso("SELECT * FROM creditos WHERE id_credito = 'CRE-9001'"))[0].map(r => ({ 
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

const actualizarCredito = (id, d) => queryTurso({ 
  sql: "UPDATE creditos SET id_credito=?, cliente=?, telefono=?, id_factura_ref=?, fecha_deuda=?, tipo=?, valor_total=?, total_abonado=?, saldo_pendiente=?, estado=?, fecha_cancelacion=?, detalle=?, historial_abonos=? WHERE id_credito=?", 
  args: [...mapArgs([
    d.id_credito || d.id,
    d.cliente,
    d.telefono,
    d.id_factura_ref || d.idFactura || "",
    d.fecha_deuda || d.fecha || "",
    d.tipo || "Crédito",
    d.total !== undefined ? d.total : d.valor_total,
    d.abonado !== undefined ? d.abonado : d.total_abonado,
    d.saldo !== undefined ? d.saldo : d.saldo_pendiente,
    d.estado,
    d.fechaCancelacion !== undefined ? d.fechaCancelacion : d.fecha_cancelacion || "",
    d.detalle || "",
    d.historialAbonos !== undefined ? d.historialAbonos : d.historial_abonos || ""
  ]), { type: "text", value: id }] 
});

function parseHistorial(raw) {
  if (!raw) return [];
  return raw.split(";").filter(Boolean).map(e => {
    const parts = e.split("|");
    return { 
      fecha: parts[0] || "", 
      monto: parseFloat(parts[1]) || 0, 
      nota: parts[2] || "", 
      metodo: parts[3] || "Efectivo" 
    };
  });
}

function serializeHistorial(list) {
  return list.map(a => `${a.fecha}|${a.monto}|${a.nota}|${a.metodo || 'Efectivo'}`).join(";");
}

async function run() {
  try {
    // 1. Get the credit
    const list = await getCreditos();
    const cred = list[0];
    console.log("Original credit loaded from DB:", JSON.stringify(cred, null, 2));

    // 2. Add an abono
    const monto = 50000;
    const nota = "Segundo abono de prueba";
    const metodo = "Transferencia";

    const nuevoAbonado = (cred.abonado || 0) + monto;
    const nuevoSaldo   = Math.max(0, (cred.total || 0) - nuevoAbonado);
    const cancelado    = nuevoSaldo <= 0;

    const hist = parseHistorial(cred.historialAbonos);
    const now = new Date();
    const datePart = now.toLocaleDateString("es-CO");
    const timePart = now.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', hour12: true });
    const fechaStr = `${datePart} ${timePart}`;
    
    hist.push({ fecha: fechaStr, monto, nota, metodo });

    const d = {
      ...cred,
      abonado: nuevoAbonado,
      saldo: nuevoSaldo,
      estado: cancelado ? "Cancelado" : cred.estado,
      fechaCancelacion: cancelado ? fechaStr : (cred.fechaCancelacion || ""),
      historialAbonos: serializeHistorial(hist)
    };

    console.log("Updated credit object to save:", JSON.stringify(d, null, 2));

    // 3. Save to DB
    const resUpdate = await actualizarCredito(cred.id, d);
    console.log("Update response:", JSON.stringify(resUpdate, null, 2));

    // 4. Reload and check
    const listAfter = await getCreditos();
    const credAfter = listAfter[0];
    console.log("Credit loaded after update:", JSON.stringify(credAfter, null, 2));
    
  } catch (err) {
    console.error("Error running test:", err);
  }
}

run();
