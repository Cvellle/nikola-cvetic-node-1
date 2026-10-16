const path = require("path");
const ejs = require("ejs");

const viewsDir = path.join(__dirname, "..", "..", "views");

// 1. renderFile(pagePath) -> html samo za sadrzaj stranice (body)
// 2. renderFile(layoutPath) -> ugnjezdeno, ubacujemo body u layout (header + footer)
function handlePage(page, data, req, res) {
  const pagePath = path.join(viewsDir, "pages", `${page}.ejs`);
  const layoutPath = path.join(viewsDir, "layout.ejs");

  ejs.renderFile(pagePath, data, (err, body) => {
    if (err) {
      console.log(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not load page");
      return;
    }

    ejs.renderFile(layoutPath, { ...data, body }, (err, html) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Could not load page");
        return;
      }

      res.writeHead(page === "404" ? 404 : 200, { "Content-Type": "text/html" });
      res.end(html);
    });
  });
}

module.exports = handlePage;
