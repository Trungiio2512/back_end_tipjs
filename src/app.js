const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
require("dotenv").config();
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongoDb");
// const { checkOverLoad } = require("./helpers/check.connect");

// checkOverLoad();
// init routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Success",
  });
});

// handleling errors

module.exports = app;
