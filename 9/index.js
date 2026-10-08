const http = require("http");

const handleStaticFiles = require("./src/handlers/staticHandler");
const handleApiCall = require("./src/handlers/apiHandler");
const { handlePage, handleProduct } = require("./src/handlers/pageHandler");

const server = http.createServer((req, res) => {
  // /product/product-1 -> slug = "product-1"
  const productMatch = req.url.match(/^\/product\/([\w-]+)$/);

  if (productMatch) {
    handleProduct(req, res, productMatch[1]);
  } else if (req.url.startsWith("/public/")) {
    handleStaticFiles(req, res);
  } else if (req.url.startsWith("/api/")) {
    handleApiCall(req, res);
  } else {
    handlePage(req, res);
  }
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
