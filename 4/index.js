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
  });
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
