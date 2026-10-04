// event emitters
// above the fold
// mejl kad korisnik nesto kupi, da mu se posalje mejl
// page loaded
// za sta su event emiteri bolji

const http = require("http");

require("./src/events/listeners");

const handleStaticFiles = require("./src/handlers/staticHandler");
const handleApiCall = require("./src/handlers/apiHandler");
const handlePage = require("./src/handlers/pageHandler");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/public/")) {
    handleStaticFiles(req, res);
  } else if (req.url.startsWith("/api/")) {
    handleApiCall(req, res);
  } else {
    handlePage(req, res);
  }
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
