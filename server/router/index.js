var express = require("express");
var router = express.Router();
const formidable = require("formidable");

let productsCtrl = require("../controllers/products");
let countersCtrl = require("../controllers/counters");
let authCtrl = require("../controllers/auth");
let mailCtrl = require("../controllers/mail");

router.get("/", async (req, res) => {
  try {
    let products = await productsCtrl.get();
    let skills = await countersCtrl.get();

    res.render("index", {
      products,
      skills
    });
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 404;
  }
});

router.post("/", async (req, res) => {
  try {
    await mailCtrl.send(req.body);

    let products = await productsCtrl.get();
    let skills = await countersCtrl.get();

    res.render("index", {
      products,
      skills
    });
  } catch (err) {
    console.error("err", err);
    res.status = err.status || 500;
  }
});

router.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error("err", err);
    res.status = err.status || 500;
  }
});

router.post("/login", async (req, res) => {
  try {
    await authCtrl.auth(req.body);
    req.session.isAuth = true;

    res.redirect("/admin");
  } catch (err) {
    console.error("err", err);
    res.redirect("/login");
    res.status = err.status || 500;
  }
});

router.get("/admin", async (req, res) => {
  try {
    if (req.session.isAuth) {
      res.render("admin");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error("err", err);
    res.status = err.status || 404;
  }
});

router.post("/admin/upload", async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      await productsCtrl.add({ ...files, ...fields });
    });

    res.render("admin");
  } catch (err) {
    console.error("err", err);
    res.status = err.status || 500;
  }
});

router.post("/admin/skills", async (req, res) => {
  try {
    await countersCtrl.set({ ...req.body });

    res.render("admin");
  } catch (err) {
    console.error("err", err);
    res.status = err.status || 500;
  }
});

module.exports = router;
