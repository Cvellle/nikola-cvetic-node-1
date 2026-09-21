const http = require("http");

const news = require("./data/news.json");

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  if (url.pathname === "/news") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const title = url.searchParams.get("title");
    const articleFound = news.find((article) => article.title === title);

    const articlesHtml = articleFound
      ? `<h1>${articleFound.title}</h1><p>${articleFound.content}</p>`
      : news
          .map(
            (article) => `<h1>${article.title}</h1><p>${article.content}</p>`,
          )
          .join("");

    // or in <head> charset="utf-8"
    res.end(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>News</title>
        </head>
        <body>
          ${articlesHtml}
        </body>
      </html>
    `);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("404 not found");
  }
});
server.listen(3000);

console.log("Server is running at http://localhost:3000/");
