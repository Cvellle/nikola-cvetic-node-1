const { pageEvents, PAGE_EVENTS } = require("../events/pageEvents");

pageEvents.on(PAGE_EVENTS.SUCCESS, ({ page }) => {
  console.log(`[${new Date().toISOString()}] Page loaded: ${page}`);
});

pageEvents.on(PAGE_EVENTS.FAIL, ({ page, statusCode, message }) => {
  console.error(
    `[${new Date().toISOString()}] Page failed (${statusCode}) on ${page}: ${message}`,
  );
});
