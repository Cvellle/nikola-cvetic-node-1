const path = require("path");
const ejs = require("ejs");
const { getAllProducts, getProductBySlug } = require("../products");

const viewsDir = path.join(__dirname, "..", "..", "views");
const dataDir = path.join(__dirname, "..", "..", "data");

// data je async jer proizvode citamo iz baze
const pages = {
  "/": {
    view: "home.ejs",
    data: async () => ({
      title: "Home",
      name: "Nikola",
      age: 30,
      height: 185,
      weight: 85,
      products: await getAllProducts(),
    }),
  },
  "/news": {
    view: "news.ejs",
    data: async () => ({
      title: "News",
      news: require(path.join(dataDir, "news.json")),
    }),
  },
  "/products": {
    view: "products.ejs",
    data: async () => ({
      title: "Products",
      products: await getAllProducts(),
    }),
  },
};

function sendHtml(res, status, html) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(html);
}

function sendError(res) {
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end("Could not load page");
}

// 1. renderFile(view) -> html samo za sadrzaj stranice (body)
// 2. renderFile(layout) -> ugnjezdeno, ubacujemo body u layout (header + footer)
function render(res, status, view, data) {
  ejs.renderFile(path.join(viewsDir, "pages", view), data, (err, body) => {
    if (err) {
      console.log(err);
      return sendError(res);
    }

    ejs.renderFile(
      path.join(viewsDir, "layout.ejs"),
      { ...data, body },
      (err, html) => {
        if (err) {
          console.log(err);
          return sendError(res);
        }

        return sendHtml(res, status, html);
      },
    );
  });
}

function getPathname(req) {
  return new URL(req.url, "http://localhost").pathname;
}

// da li postoji stranica za ovaj url ("/", "/news", "/products")
function isPage(req) {
  return Boolean(pages[getPathname(req)]);
}

async function handlePage(req, res) {
  const page = pages[getPathname(req)];

  try {
    const data = await page.data();
    return render(res, 200, page.view, data);
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

function handleNotFound(req, res) {
  return render(res, 404, "404.ejs", {
    title: "Not found",
    url: getPathname(req),
  });
}

async function handleProduct(req, res, slug) {
  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return handleNotFound(req, res);
    }

    return render(res, 200, "product.ejs", { title: product.name, product });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

function handleAboutPage(req, res) {
  return render(res, 200, "about.ejs", {
    title: "About",
    course: "Node.js kurs",
    topics: ["http module", "event emitters", "ejs templates", "mysql"],
  });
}

module.exports = {
  isPage,
  handlePage,
  handleProduct,
  handleAboutPage,
  handleNotFound,
};
