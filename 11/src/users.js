const pool = require("./db");

// Prepared statement - ? su placeholderi,
// vrednosti se salju odvojeno od SQL-a -> nema SQL injection
async function findUserByEmail(email) {
  const sql = "SELECT id, name, email FROM users WHERE email = ?";

  const [rows] = await pool.execute(sql, [email]);

  return rows.length > 0 ? rows[0] : null;
}

// password se ne vraca
async function findAllUsers() {
  const sql = "SELECT id, name, email FROM users";

  const [rows] = await pool.execute(sql);

  return rows;
}

// password ovde vec mora biti hesiran
async function insertUser(name, email, password) {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  const [result] = await pool.execute(sql, [name, email, password]);

  return result.insertId;
}

module.exports = { findUserByEmail, findAllUsers, insertUser };
