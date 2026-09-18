const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    if (
      !data.name.hasOwnProperty("email") ||
      !data.name.hasOwnProperty("password")
    ) {
      res.statusCode = 400;
      // mora unutar - asinhronost
      res.end();
      return;
    }

    const users = JSON.parse(
      fs.readFileSync(__dirname + "/../data/users.json", "utf-8"),
    );

    const userExists = users.some((user) => user.email === data.email);

    if (userExists) {
      res.statusCode = 409; // Conflict - resurs vec postoji
      res.setHeader("Content-Type", "text/plain");
      res.end("User already exists");
      return;
    }

    res.statusCode = 201; // Created
    res.setHeader("Content-Type", "text/plain");
    res.end("User created");
  });
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
