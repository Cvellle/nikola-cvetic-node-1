const bcrypt = require("bcrypt");
const { findAllUsers, insertUser } = require("../users");
const { validateUser } = require("../helpers/validationHelper");

// salt rounds - koliko puta se hesira (2^10), vise = sigurnije ali sporije
const SALT_ROUNDS = 10;

// servis ne zna za req/res - vraca { errors, user }, a handler odlucuje sta salje
async function createUser(data) {
  // ?? "" - ako polje ne postoji, da ne bi puklo na .length / .trim()
  const user = {
    name: String(data.name ?? "").trim(),
    email: String(data.email ?? "").trim().toLowerCase(),
    password: String(data.password ?? ""),
    confirm_password: String(data.confirm_password ?? ""),
  };

  const errors = await validateUser(user);

  if (errors.length) {
    return { errors, user };
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.id = await insertUser(user.name, user.email, hashedPassword);
  } catch (err) {
    // ako dva zahteva sa istim emailom prodju proveru u isto vreme, UNIQUE u bazi ih zaustavlja
    if (err.code === "ER_DUP_ENTRY") {
      return { errors: ["Email is already registered"], user };
    }

    throw err;
  }

  return { errors: [], user };
}

async function getAllUsers() {
  return findAllUsers();
}

module.exports = { createUser, getAllUsers };
