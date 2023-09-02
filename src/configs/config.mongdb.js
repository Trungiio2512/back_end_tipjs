"use strict";

//lv0
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "127.0.0.1",
//     port: 27027,
//     name: "db",
//   },
// };
//lv01
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "127.0.0.1",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDev",
  },
};
const proD = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "127.0.0.1",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "shopProd",
  },
};

const config = { dev, proD };
const env = process.env.NODE_ENV || "dev";
console.log(config[env]);
console.log(env);

module.exports = config[env];
