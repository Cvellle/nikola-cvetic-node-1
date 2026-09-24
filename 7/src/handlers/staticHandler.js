const fs = require("fs");
const path = require("path");

const contentTypes = {
  ".html": { type: "text/html", encoding: "utf-8" },
  ".css": { type: "text/css", encoding: "utf-8" },
  ".js": { type: "application/javascript", encoding: "utf-8" },
  ".json": { type: "application/json", encoding: "utf-8" },
  ".png": { type: "image/png", encoding: "" },
  ".jpg": { type: "image/jpeg", encoding: "" },
  ".jpeg": { type: "image/jpeg", encoding: "" },
  ".gif": { type: "image/gif", encoding: "" },
  ".svg": { type: "image/svg+xml", encoding: "utf-8" },
  ".ico": { type: "image/x-icon", encoding: "" },
};

function handleStaticFiles(req, res) {
  const filePath = path.join(__dirname, "..", "..", req.url);
  const ext = path.extname(filePath);
  const contentType = contentTypes[ext];

  if (!contentType) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File type not supported");
    return;
  }

  fs.readFile(filePath, contentType.encoding, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType.type });
    res.end(data);
  });
}

module.exports = handleStaticFiles;
