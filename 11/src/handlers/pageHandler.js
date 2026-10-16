const path = require("path");
const ejs = require("ejs");
const pageEmitter = require("../events/emitters/pageEmitter");

const viewsDir = path.join(__dirname, "..", "..", "views");

// 1. renderFile(pagePath) -> html samo za sadrzaj stranice (body)
// 2. renderFile(layoutPath) -> ugnjezdeno, ubacujemo body u layout (header + footer)
function handlePage(page, data, req, res) {
  const pagePath = path.join(viewsDir, "pages", `${page}.ejs`);
  const layoutPath = path.join(viewsDir, "layout.ejs");

  ejs.renderFile(pagePath, data, (err, body) => {
    if (err) {
      pageEmitter("fail", { page: req.url, statusCode: 500, message: err.message });
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not load page");
      return;
    }

    ejs.renderFile(layoutPath, { ...data, body }, (err, html) => {
      if (err) {
        pageEmitter("fail", { page: req.url, statusCode: 500, message: err.message });
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Could not load page");
        return;
      }

      // status postavlja onaj ko poziva (res.statusCode = 400 / 404), inace je 200
      res.writeHead(res.statusCode, { "Content-Type": "text/html" });
      res.end(html);
      pageEmitter("success", { page: req.url });
    });
  });
}

module.exports = handlePage;
