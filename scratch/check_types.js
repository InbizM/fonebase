const TURSO_URL = "https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw";

async function run() {
  const query = { sql: "SELECT id_credito, cliente, valor_total, total_abonado, saldo_pendiente FROM creditos" };
  const res = await fetch(TURSO_URL, { method: "POST", headers: { "Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ requests: [{ type: "execute", stmt: query }] }) });
  const data = await res.json();
  const rows = data.results[0].response.result.rows;
  const cols = data.results[0].response.result.cols;
  
  console.log("Columns:", cols.map(c => c.name));
  rows.forEach(row => {
    console.log(`Credit ID: ${row[0].value} (${row[1].value})`);
    console.log(`  valor_total: value=${row[2].value}, type=${typeof row[2].value}`);
    console.log(`  total_abonado: value=${row[3].value}, type=${typeof row[3].value}`);
    console.log(`  saldo_pendiente: value=${row[4].value}, type=${typeof row[4].value}`);
  });
}
run();
