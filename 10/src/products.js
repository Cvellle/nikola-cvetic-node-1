const pool = require("./db");

// MySQL vraca DECIMAL kao string, a BOOLEAN kao 0/1,
// pa ih pretvaramo u number i boolean da bi view radio (toFixed, if)
function toProduct(row) {
  return {
    ...row,
    available: Boolean(row.available),
    price: Number(row.price),
  };
}

async function getAllProducts() {
  const sql = "SELECT id, slug, name, available, amount, price FROM products ORDER BY id";

  const [rows] = await pool.execute(sql);

  return rows.map(toProduct);
}

async function getProductBySlug(slug) {
  const sql = "SELECT id, slug, name, available, amount, price FROM products WHERE slug = ?";

  const [rows] = await pool.execute(sql, [slug]);

  return rows.length > 0 ? toProduct(rows[0]) : null;
}

module.exports = { getAllProducts, getProductBySlug };
