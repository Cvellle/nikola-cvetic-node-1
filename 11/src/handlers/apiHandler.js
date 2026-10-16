const querystring = require("querystring");
const { createUser } = require("../services/userService");
const handlePage = require("./pageHandler");
const { escapeHtml } = require("../helpers/htmlHelper");

function handleApiCall(req, res) {
  const urlMatch = req.url.match(/^\/api\/([\w-]+)/);

  if (urlMatch && urlMatch[1] === "register" && req.method === "POST") {
    // body stize u delovima (chunks), skupljamo ga pa parsiramo na "end"
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { errors, user } = await createUser(querystring.parse(body));

        if (errors.length) {
          // 400 - korisnik je poslao neispravne podatke
          res.statusCode = 400;
          // return - da ne nastavi dalje i ne posalje headere dva puta
          return handlePage(
            "register",
            { title: "Register", errors, name: user.name, email: user.email },
            req,
            res,
          );
        }

        res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Welcome, ${escapeHtml(user.name)}!</h1><p>You are registered.</p>`);
      } catch (err) {
        console.log(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Could not register user");
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true }));
}

module.exports = handleApiCall;
