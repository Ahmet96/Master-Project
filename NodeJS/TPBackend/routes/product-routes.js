const express = require("express");
const { check } = require("express-validator");
const productControllers = require("../controllers/product-controllers");
const fileUpload = require('../middleware/file-upload')
const router = express.Router();

router.get("/", productControllers.getProducts);

router.get("/:pid", productControllers.getProductById);

router.get("/user/:uid", productControllers.getProductsByUserId);

router.post("/", 
fileUpload.single('image'),
[
  check("title").not().isEmpty(),
  check("description").isLength({ Min: 5 }),

  productControllers.createProduct,
]);

router.patch("/:pid", [
  check("title").not().isEmpty(),
  check("description").isLength({ Min: 5 }),

  productControllers.updateProduct,
]);
router.delete("/:pid", productControllers.deleteProduct);

module.exports = router;
