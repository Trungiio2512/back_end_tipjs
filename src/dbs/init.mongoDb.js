"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, name, port },
} = require("../configs/config.mongdb");

const connectionString = `mongodb://${host}:${port}/${name}`;
// const connectionString = "mongodb://127.0.0.1:27017/ecommerce";

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    console.log(connectionString);
    mongoose
      .connect(connectionString)
      .then(() => countConnect())
      .catch(() => console.log("Error connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
