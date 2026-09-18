const http = require("http");

const news = require("./data/news.json");

const server = http.createServer((req, res) => {
  // Streaming
  // samo prikupljanje podataka,
  // mora imati req.on("end") da bi se prikazali
  // paralelno prima sve podatke, ne ceka sve chunkove odjednom
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    if (
      !data.name.hasOwnProperty("email") ||
      !data.name.hasOwnProperty("password")
    ) {
      res.statusCode = 400;
      // mora unutar da se ne bi pregazio sa sledecim
      // zavrsi zahtev u ifu, a a ko ne udje, onda ispod zavrsi
      res.end();
    }
    //
    res.end();
  });

  // mora posle i
  // res.end();

  // [1, 2, 3, 4, 5, 6, 7, 8, 9] - prvo [1, 2, 3] pa [4, 5, 6] pa [7, 8] pa [9, 10]

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
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("404 not found");
  }
});
server.listen(3000);

console.log("Server is running at http://localhost:3000/");
