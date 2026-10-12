const mysql = require("mysql2/promise");

// Pool - drzi vise otvorenih konekcija i ponovo ih koristi,
// umesto da za svaki upit otvara novu konekciju
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // ako su sve zauzete, ceka u redu
  connectionLimit: 10, // najvise 10 konekcija odjednom
  queueLimit: 0, // 0 = neogranicen red cekanja
});

module.exports = pool;
