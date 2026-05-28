const http = require("http");
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error conectando a PostgreSQL", err));

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "api" }));
    return;
  }

  if (req.url === "/api") {
    try {
      const result = await client.query("SELECT * FROM mensajes");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      res.writeHead(500);
      res.end("Error consultando PostgreSQL");
      console.error(err);
    }

    return;
  }

  res.writeHead(404);
  res.end("Ruta no encontrada");
});

server.listen(3000, () => {
  console.log("API escuchando en puerto 3000");
});
