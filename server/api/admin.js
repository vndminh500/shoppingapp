const express = require("express");
const router = express.Router();
// utils
const JwtUtil = require("../utils/JwtUtil");
const EmailUtil = require("../utils/EmailUtil");
// daos
const AdminDAO = require("../models/AdminDAO");
const CustomerDAO = require("../models/CustomerDAO");
//product
const ProductDAO = require("../models/ProductDAO");
const OrderDAO = require("../models/OrderDAO");

// login
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password,
    );
    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({
        success: true,
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});

const CategoryDAO = require("../models/CategoryDAO");

router.get("/categories", JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post("/categories", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name; // lấy tên từ nội dung gửi lên
  const category = { name: name };
  const result = await CategoryDAO.insert(category); // gọi hàm insert bạn vừa tạo
  res.json(result);
});

router.put("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const category = { id: id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const result = await CategoryDAO.delete(id);
  res.json(result);
});

router.get("/products", JwtUtil.checkToken, async function (req, res) {
  const products = await ProductDAO.selectAll();
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const offset = (curPage - 1) * sizePage;
  const result = {
    products: products.slice(offset, offset + sizePage),
    noPages: noPages,
    curPage: curPage,
  };
  res.json(result);
});

router.post("/products", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    id: id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const result = await ProductDAO.delete(id);
  res.json(result);
});

router.get("/orders", JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put("/orders/status/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

router.get("/customers", JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

router.get(
  "/orders/customer/:cid",
  JwtUtil.checkToken,
  async function (req, res) {
    try {
      const _cid = req.params.cid;
      const orders = await OrderDAO.selectByCustID(_cid);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || "Failed to load orders" });
    }
  },
);

router.put(
  "/customers/deactive/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
  },
);

router.get(
  "/customers/sendmail/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    try {
      const cust = await CustomerDAO.selectByID(_id);
      if (!cust) {
        return res.json({ success: false, message: "Not exists customer" });
      }
      await EmailUtil.send(cust.email, cust._id, cust.token);
      res.json({ success: true, message: "Please check email" });
    } catch (err) {
      console.error(err);
      res.json({
        success: false,
        message:
          err.message ||
          "Email failure (check Gmail App Password / SMTP settings)",
      });
    }
  },
);

module.exports = router;
