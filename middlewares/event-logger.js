const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const allowedOrigins = require("../configs/allowed-origins");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function eventLogger(message, logName) {
  const dateItem = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const logItem = `${dateItem}\t${uuid()}\t${message}\n`;

  const logFolder = "logs";
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }

  const logFilePath = `./${logFolder}/${logName}.txt`;

  fs.appendFile(logFilePath, logItem, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log("Log entry added to", logFilePath);
    }
  });
}

function logger(req, res, next) {
  eventLogger(
    `${req.method}\t${req.headers.origin}\t${res.statusCode}`,
    "reqlog"
  );
  console.log(`${req.method}\t${req.path}`);
  next();
}

function errorLogger(err, req, res, next) {
  eventLogger(`${err.name}\t${err.stack}`, "errorLog");
  console.error(err.stack);
  res.status(500).send(err.message);
}

const credentials = (req, res, next) => {
  const origin = req.headers.Origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
};

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "You're not logged in!" });
  console.log(authHeader);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Session expired. please login again" });
    } else {
      req.user = decoded.username;
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = { eventLogger, logger, errorLogger, verifyJwt, credentials };
