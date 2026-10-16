// event emitters
// above the fold
// mejl kad korisnik nesto kupi, da mu se posalje mejl
// page loaded
// za sta su event emiteri bolji

const http = require("http");
const path = require("path");

require("./src/events/listeners");

const handleStaticFiles = require("./src/handlers/staticHandler");
const handleApiCall = require("./src/handlers/apiHandler");
const handlePage = require("./src/handlers/pageHandler");
const { getAllProducts, getProductBySlug } = require("./src/products");

const server = http.createServer(async (req, res) => {
  // /product/product-1 -> slug = "product-1"
  const productMatch = req.url.match(/^\/product\/([\w-]+)$/);

  try {
    if (req.url.startsWith("/public/")) {
      handleStaticFiles(req, res);
    } else if (req.url.startsWith("/api/")) {
      handleApiCall(req, res);
    } else if (req.url === "/") {
      handlePage(
        "home",
        {
          title: "Home",
          name: "Nikola",
          age: 30,
          height: 185,
          weight: 85,
          products: await getAllProducts(),
        },
        req,
        res,
      );
    } else if (req.url === "/news") {
      handlePage(
        "news",
        { title: "News", news: require(path.join(__dirname, "data", "news.json")) },
        req,
        res,
      );
    } else if (req.url === "/products") {
      handlePage("products", { title: "Products", products: await getAllProducts() }, req, res);
    } else if (req.url === "/about") {
      handlePage(
        "about",
        {
          title: "About",
          course: "Node.js kurs",
          topics: ["http module", "event emitters", "ejs templates", "mysql"],
        },
        req,
        res,
      );
    } else if (req.url === "/register") {
      handlePage("register", { title: "Register", errors: [], name: "", email: "" }, req, res);
    } else if (productMatch) {
      const product = await getProductBySlug(productMatch[1]);

      // url moze da izgleda dobro, a da proizvod ne postoji u bazi -> null -> 404
      if (product) {
        handlePage("permalink", { title: product.name, product: product }, req, res);
      } else {
        res.statusCode = 404;
        handlePage("404", { title: "Not found", url: req.url }, req, res);
      }
    } else {
      res.statusCode = 404;
      handlePage("404", { title: "Not found", url: req.url }, req, res);
    }
  } catch (err) {
    console.log(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Could not load page");
  }
});

server.listen(3000);

console.log("Server is running at http://localhost:3000/");
