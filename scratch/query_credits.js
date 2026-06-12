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

async function run() {
  try {
    const res = await queryTurso({
      sql: "SELECT * FROM creditos LIMIT 5"
    });
    console.log("Credits in DB:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err.stack);
  }
}
run();
