const emitter = require("../emitter");
const { PAGE } = require("../eventNames");
const logHelper = require("../../helpers/logHelper");

emitter.on(PAGE.success, ({ page }) => {
  logHelper("success", `Page loaded: ${page}`);
});

emitter.on(PAGE.fail, ({ page, statusCode, message }) => {
  logHelper("fail", `Page failed (${statusCode}) on ${page}: ${message}`);
});
