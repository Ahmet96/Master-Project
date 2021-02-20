const express = require("express");
const usersController = require("../controllers/user-controller");
const { check, checkSchema } = require("express-validator");
const fileUpload = require('../middleware/file-upload')
const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/signup", 
fileUpload.single('image'),
usersController.signup);

router.post("/login", usersController.login);

module.exports = router;
