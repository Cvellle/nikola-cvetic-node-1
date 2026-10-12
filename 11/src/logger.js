const fs = require("fs");
const path = require("path");

async function logUsersVisit(ip) {
  const logFile = path.join(__dirname, "visitors.txt");
  const log = ip + "\n";
  // na lokalu ce davati jedino ::1

  fs.appendFile(logFile, log, (err) => {
    if (err) {
      console.log("Error writing to file:" + err);
    }
  });
}

module.exports = logUsersVisit;
