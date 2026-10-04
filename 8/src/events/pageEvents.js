const EventEmitter = require("events");

const PAGE_EVENTS = Object.freeze({
  SUCCESS: "page:success",
  FAIL: "page:fail",
});

const pageEvents = new EventEmitter();

module.exports = { pageEvents, PAGE_EVENTS };
