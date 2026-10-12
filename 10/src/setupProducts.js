// Real projects use a tool like
// Knex, Sequelize, Prisma,
// TypeORM or db-migrate

const fs = require("fs");
const path = require("path");
const pool = require("./db");

// Pokrece sql/products.sql - pravi tabelu i ubacuje proizvode
// INSERT IGNORE preskace slug-ove koji vec postoje, pa moze vise puta da se pokrene
async function main() {
  const sqlFile = fs.readFileSync(
    path.join(__dirname, "..", "sql", "products.sql"),
    "utf-8",
  );
  const statements = sqlFile
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  try {
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log("Products table ready");
  } catch (err) {
    console.log("Error setting up products:", err.message);
  } finally {
    await pool.end();
  }
}

main();
