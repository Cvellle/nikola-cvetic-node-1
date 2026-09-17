const http = require("http");

const news = require("./data/news.json");

const server = http.createServer((req, res) => {
  // new URL(req.url, `base`);
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/contact") {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  if (url.pathname === "/") {
    // Head
    res.statusCode = 200; // OK

    // Types
    // Text, JSON, HTML, JavaScript, CSS, XML;
    res.setHeader("Content-Type", "text/plain");

    // Body
    res.end("hello world");
  } else if (url.pathname === "/news") {
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
