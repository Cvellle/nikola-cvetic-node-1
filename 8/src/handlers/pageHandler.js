const fs = require("fs");
const path = require("path");
const { pageEvents, PAGE_EVENTS } = require("../events/pageEvents");

const pagesDir = path.join(__dirname, "..", "..", "public");

const pages = {
  "/": "index.html",
};

function handlePage(req, res) {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const page = pages[pathname];

  if (!page) {
    pageEvents.emit(PAGE_EVENTS.FAIL, {
      page: pathname,
      statusCode: 404,
      message: "Page not found",
    });
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
    return;
  }

  fs.readFile(path.join(pagesDir, page), "utf-8", (err, data) => {
    if (err) {
      pageEvents.emit(PAGE_EVENTS.FAIL, {
        page: pathname,
        statusCode: 500,
        message: err.message,
      });
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not load page");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
    pageEvents.emit(PAGE_EVENTS.SUCCESS, { page: pathname });
  });
}

module.exports = handlePage;
