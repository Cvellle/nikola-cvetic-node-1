const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/kontakt") {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  // Head
  res.statusCode = 200; // OK

  // Types
  //   Text, JSON, HTML, JavaScript, CSS, XML);
  res.setHeader("Content-Type", "text/plain");

  // Body
  res.end("hello world");
});
server.listen(3000);

console.log("Server is running at http://localhost:3000/");
