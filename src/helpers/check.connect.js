"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log("number of connections: ", numConnections);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = mongoose.connect.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum connection  base on number of cores
    const maxConnection = numCore * 2;

    console.log("Active connection: ", numConnections);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnections > maxConnection) {
      console.log("Connection overload detected");
    }
  }, _SECONDS); //monitor every 5second
};

module.exports = {
  countConnect,
  checkOverLoad,
};
