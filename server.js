const app = require("./src/app");

const PORT = 3055;

const server = app.listen(3005, () => {
  console.log("WSV ecommerce server started on, " + PORT);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit sever express"));
});
