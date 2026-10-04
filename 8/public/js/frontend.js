fetch("/api/products/available")
  .then((result) => result.json())
  .then((data) => console.log("available", data));

fetch("/api/products/not-available")
  .then((result) => result.json())
  .then((data) => console.log("not-available", data));

fetch("/api/products/all")
  .then((result) => result.json())
  .then((data) => console.log("all", data));
