const pool = require("./db");

// Prepared statement - ? su placeholderi,
// vrednosti se salju odvojeno od SQL-a -> nema SQL injection
// pool.execute() = prepared statement, pool.query() = obican upit
async function insertUser(name, email, password) {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  const [result] = await pool.execute(sql, [name, email, password]);

  return result.insertId;
}

module.exports = { insertUser };
