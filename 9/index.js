const http = require("http");

const handleStaticFiles = require("./src/handlers/staticHandler");
const handleApiCall = require("./src/handlers/apiHandler");
const {
  isPage,
  handlePage,
  handleProduct,
  handleAboutPage,
  handleNotFound,
} = require("./src/handlers/pageHandler");

const server = http.createServer((req, res) => {
  // /product/product-1 -> slug = "product-1"
  const productMatch = req.url.match(/^\/product\/([\w-]+)$/);

  if (req.url.startsWith("/public/")) {
    handleStaticFiles(req, res);
  } else if (req.url.startsWith("/api/")) {
    handleApiCall(req, res);
  } else if (isPage(req)) {
    handlePage(req, res);
  } else if (req.url === "/about") {
    handleAboutPage(req, res);
  } else if (productMatch) {
    handleProduct(req, res, productMatch[1]);
  } else {
    handleNotFound(req, res);
  }
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
