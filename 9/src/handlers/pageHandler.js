const path = require("path");
const ejs = require("ejs");

const viewsDir = path.join(__dirname, "..", "..", "views");
const dataDir = path.join(__dirname, "..", "..", "data");

const pages = {
  "/": {
    view: "home.ejs",
    data: () => ({
      title: "Home",
      name: "Nikola",
      age: 30,
      height: 185,
      weight: 85,
    }),
  },
  "/news": {
    view: "news.ejs",
    data: () => ({
      title: "News",
      news: require(path.join(dataDir, "news.json")),
    }),
  },
  "/products": {
    view: "products.ejs",
    data: () => ({
      title: "Products",
      products: require(path.join(dataDir, "products.json")),
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
  ejs.renderFile(path.join(viewsDir, view), data, (err, body) => {
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

function handlePage(req, res) {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const page = pages[pathname];

  if (!page) {
    return render(res, 404, "404.ejs", { title: "Not found", url: pathname });
  }

  return render(res, 200, page.view, page.data());
}

module.exports = handlePage;
