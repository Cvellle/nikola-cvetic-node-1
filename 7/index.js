const http = require("http");

const handleStaticFiles = require("./src/handlers/staticHandler");
const handleApiCall = require("./src/handlers/apiHandler");
const handlePage = require("./src/handlers/pageHandler");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/public/")) {
    handleStaticFiles(req, res);
  } else if (req.url.startsWith("/api/")) {
    handleApiCall(req, res);
  } else {
    if (req.url === "/") {
      handlePage(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  }
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
