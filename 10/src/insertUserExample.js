const pool = require("./db");
const { insertUser } = require("./users");

async function main() {
  try {
    const id = await insertUser("Nikola", "nikola@example.com", "nikola123");
    console.log("User inserted with id:", id);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("Email already exists");
    } else {
      console.log("Error inserting user:", err.message);
    }
  } finally {
    await pool.end(); // zatvara sve konekcije da bi se skripta zavrsila
  }
}

main();
