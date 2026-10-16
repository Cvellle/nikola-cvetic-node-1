const { findUserByEmail } = require("../users");

// nesto@nesto.nesto, bez razmaka
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function validateUser({ name, email, password, confirm_password }) {
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

  // async provera - ide u bazu, zato validateUser mora biti async
  if (EMAIL_REGEX.test(email) && (await findUserByEmail(email))) {
    errors.push("Email is already registered");
  }

  return errors;
}

module.exports = { validateUser };
