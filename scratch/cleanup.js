// ============================================================
// cleanup.js — Script de limpieza de datos de prueba (Turso DB)
// ============================================================

const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

const tables = [
  'clientes',
  'inventario',
  'equipos',
  'ventas',
  'egresos',
  'servicio_tecnico',
  'creditos',
  'reventas',
  'proveedores',
  'marcas_categorias',
  'tareas',
  'nominas',
  'vales_fisicos',
  'prestamos_empleados',
  'metas_financieras'
];

async function queryTurso(sqls) {
  const requests = Array.isArray(sqls)
    ? sqls.map(s => ({ type: "execute", stmt: { sql: s } }))
    : [{ type: "execute", stmt: { sql: sqls } }];
  
  const res = await fetch(TURSO_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TURSO_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ requests })
  });
  
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.results || [];
}

async function run() {
  console.log("Iniciando la limpieza de la base de datos Turso...\n");
  
  // 1. Vaciar tablas
  console.log("--- 1. VACIAMENTO DE TABLAS DE PRUEBA ---");
  for (const table of tables) {
    try {
      process.stdout.write(`Vaciando tabla '${table}'... `);
      await queryTurso(`DELETE FROM ${table}`);
      console.log("✅ OK");
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }
  console.log("");

  // 2. Eliminar usuarios excepto administrador
  console.log("--- 2. ELIMINACIÓN DE USUARIOS DE PRUEBA ---");
  try {
    process.stdout.write("Eliminando usuarios (excepto stream.easyapp@gmail.com)... ");
    await queryTurso("DELETE FROM usuarios WHERE email != 'stream.easyapp@gmail.com'");
    console.log("✅ OK");
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`);
  }
  console.log("");

  // 3. Restablecer ajustes_empresa
  console.log("--- 3. RESTABLECIMIENTO DE AJUSTES_EMPRESA ---");
  const recommendedQuery = "UPDATE ajustes_empresa SET nombre='', nit='', propietario='', propietario='', telefono='', direccion='', ciudad='', contacto='', correo='', condiciones='', logo='', mensaje_whatsapp='' WHERE id=1";
  const safeQuery = "UPDATE ajustes_empresa SET nombre='', nit='', propietario='', telefono='', direccion='', ciudad='', contacto='', correo='', condiciones='', logo='', logo_size=40, mostrar_nombre=1 WHERE id=1";
  
  try {
    process.stdout.write("Intentando restablecer con la consulta recomendada... ");
    await queryTurso(recommendedQuery);
    console.log("✅ OK");
  } catch (err) {
    console.log(`❌ FALLÓ: ${err.message}`);
    console.log("Intentando con la consulta segura de fallback (basada en el esquema real)...");
    try {
      process.stdout.write("Ejecutando consulta segura... ");
      await queryTurso(safeQuery);
      console.log("✅ OK");
    } catch (safeErr) {
      console.log(`❌ ERROR CRÍTICO: ${safeErr.message}`);
    }
  }

  console.log("\nLimpieza de base de datos Turso finalizada.");
}

run().catch(console.error);
