const emitter = require("../emitter");
const { PAGE } = require("../eventNames");

function pageEmitter(type, data) {
  const eventName = PAGE[type];

  if (!eventName) {
    throw new Error(`Unknown page event type: "${type}"`);
  }

  emitter.emit(eventName, data);
}

module.exports = pageEmitter;
