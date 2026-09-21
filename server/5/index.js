// sync - za neki bitan fajl (config), za manje fajlove i sl.
// async - za html
// async - ima i callback funkciju

const http = require("http");
const fs = require("fs");
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
  fs.readFile(__dirname + "/../../html/index.html", "utf-8", (err, html) => {
    if (err) {
      res.statusCode = 500;
      res.end("Internal server error");
      return;
    }

    let result = html;
    for (const key in variables) {
      result = result.replace("{{" + key + "}}", variables[key]);
    }

    // uhvatiomo ip
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
