const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const bcrypt = require("bcrypt");
const { findUserByEmail, insertUser } = require("../users");

const formPath = path.join(__dirname, "..", "..", "public", "register.html");

// salt rounds - koliko puta se hesira (2^10), vise = sigurnije ali sporije
const SALT_ROUNDS = 10;

// nesto@nesto.nesto, bez razmaka
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// da korisnik ne bi mogao da ubaci html/script kroz input
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// popunjava {{errors}}, {{name}}, {{email}} u register.html
function sendForm(res, status, { errors = [], name = "", email = "" } = {}) {
  fs.readFile(formPath, "utf-8", (err, html) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not load page");
      return;
    }

    const errorsHtml = errors.length
      ? `<ul style="color: red">${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>`
      : "";

    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      html
        .replace("{{errors}}", errorsHtml)
        .replace("{{name}}", escapeHtml(name))
        .replace("{{email}}", escapeHtml(email)),
    );
  });
}

async function validate({ name, email, password, confirm_password }) {
  const errors = [];

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters");
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push("Email is not valid");
  }

  if (password.length < 3) {
    errors.push("Password must be at least 3 characters");
  }

  if (password !== confirm_password) {
    errors.push("Passwords do not match");
  }

  // async provera - ide u bazu, zato validate mora biti async
  if (EMAIL_REGEX.test(email) && (await findUserByEmail(email))) {
    errors.push("Email is already registered");
  }

  return errors;
}

async function register(req, res, body) {
  const data = querystring.parse(body);

  // ?? "" - ako polje ne postoji, da ne bi puklo na .length / .trim()
  const user = {
    name: String(data.name ?? "").trim(),
    email: String(data.email ?? "").trim().toLowerCase(),
    password: String(data.password ?? ""),
    confirm_password: String(data.confirm_password ?? ""),
  };

  try {
    const errors = await validate(user);

    if (errors.length) {
      // return - da ne nastavi dalje i ne posalje headere dva puta
      return sendForm(res, 400, { errors, name: user.name, email: user.email });
    }

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    await insertUser(user.name, user.email, hashedPassword);

    res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Welcome, ${escapeHtml(user.name)}!</h1><p>You are registered.</p>`);
  } catch (err) {
    // ako dva zahteva sa istim emailom prodju proveru u isto vreme, UNIQUE u bazi ih zaustavlja
    if (err.code === "ER_DUP_ENTRY") {
      return sendForm(res, 400, {
        errors: ["Email is already registered"],
        name: user.name,
        email: user.email,
      });
    }

    console.log(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Could not register user");
  }
}

function handleRegister(req, res) {
  if (req.method === "GET") {
    return sendForm(res, 200);
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method not allowed");
    return;
  }

  // body stize u delovima (chunks), skupljamo ga pa parsiramo na "end"
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    register(req, res, body);
  });
}

module.exports = handleRegister;
