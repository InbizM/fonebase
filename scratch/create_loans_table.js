const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

async function main() {
  const sql = `
    CREATE TABLE IF NOT EXISTS prestamos_empleados (
      id_prestamo TEXT PRIMARY KEY,
      fecha TEXT,
      empleado TEXT,
      tipo TEXT,
      monto REAL,
      producto_id TEXT,
      producto_nombre TEXT,
      cantidad INTEGER,
      estado TEXT,
      notas TEXT
    )
  `;
  const requests = [{ type: "execute", stmt: { sql } }];
  
  try {
    const res = await fetch(TURSO_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TURSO_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

main();
