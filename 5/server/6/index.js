const http = require("http");
const fs = require("fs");
const path = require("path");

const logUsersVisit = require("../../src/logger");

const variables = {
  name: "Nikola",
  age: 40,
  height: 172,
  weight: 65,
};

const navigation = fs.readFileSync(
  __dirname + "/../../html/components/navigation.html",
  "utf-8",
);
const footer = fs.readFileSync(
  __dirname + "/../../html/components/footer.html",
  "utf-8",
);

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/public/js") && req.url.endsWith(".js")) {
    const jsPath = path.join(__dirname, "/../../", req.url);
    fs.readFile(jsPath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("JS file not found");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
    return;
  }

  if (req.url.startsWith("/api/products")) {
    const filePath = path.join(__dirname, "/../../data", "products.json");
    fs.readFile(filePath, "utf-8", (err, jsonResponse) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("JSON not found");
        return;
      }
      console.log("jsonResponse", jsonResponse);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(jsonResponse);
    });
    return;
  }

  fs.readFile(__dirname + "/../../public/index.html", "utf-8", (err, html) => {
    if (err) {
      res.statusCode = 500;
      res.end("Internal server error");
      return;
    }

    let result = html;
    for (const key in variables) {
      result = result.replace("{{" + key + "}}", variables[key]);
    }

    // uhvatimo ip
    // druga opcija - ako smo prosledjeni s druge stranice,
    //  nemamo x-forewarded-for
    const ip = req.headers["x-forewarded-for"] || req.socket.remoteAddress;
    logUsersVisit(ip);

    const page = result
      .replace("{{navigation}}", navigation)
      .replace("{{footer}}", footer);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page);
  });
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
