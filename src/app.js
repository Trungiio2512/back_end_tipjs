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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require("./dbs/init.mongoDb");
// const { checkOverLoad } = require("./helpers/check.connect");

// checkOverLoad();
// init routes
app.use("/", require("./routes"));

// handleling errors

module.exports = app;
