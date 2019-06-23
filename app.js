const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

app.set("views", path.join(__dirname, "./server/views/pages"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "./server/static")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const session = require("express-session");
app.use(
  session({
    secret: "express:sess",
    key: "sessionkey",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 6000
    },
    saveUninitialized: false,
    resave: false
  })
);

// const koaBody = require("koa-body");
// app.use(
//   koaBody({
//     formidable: {
//       uploadDir: "./server/static/assets/img/products/"
//     },
//     multipart: true
//   })
// );

const router = require("./server/router");
app.use("/", router);

app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
