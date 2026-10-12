function logHelper(type, message) {
  const line = `[${new Date().toISOString()}] ${type.toUpperCase()}: ${message}`;

  if (type === "fail") {
    console.error(line);
  } else {
    console.log(line);
  }
}

module.exports = logHelper;
