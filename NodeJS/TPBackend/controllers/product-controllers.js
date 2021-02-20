const fs = require('fs');
const { validationResult } = require("express-validator");
const Product = require("../models/product");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const mongoose = require("mongoose");


const getProducts = async (req,res,next) => {
   let products;
   try{
     products = await Product.find({})
   }catch(err){
    const error = new HttpError("Anyone not post any product", 500);
    return next(error);
   }
   res.json({ products: products.map((product) => product.toObject({ getters: true })) });}

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Could not find this product", 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "could not find a product for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ product: product.toObject({ getters: true }) });

};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithProducts;
  try {
    userWithProducts = await User.findById(userId).populate("products");
  } catch (err) {
    const error = new HttpError(
      "Fetching products failed,please try again",
      500
    );
    return next(error);
  }

  if (!userWithProducts || userWithProducts.products.length === 0) {
    return next(new HttpError("Could not find any product"));
  }
  res.json({
    products: userWithProducts.products.map((product) =>
      product.toObject({ getters: true })
    ),
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422);
    return next(
      new HttpError("Invalid inputs passes,please check your data", 422)
    );
  }

  const { title, description, currency, price, category, creator } = req.body;
  const createdProduct = new Product({
    title,
    description,
    image:req.file.path,
    currency,
    price,
    category,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating product failed,pls try again ", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({
      session: sess,
    });
    user.products.push(createdProduct);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again",
      500
    );
    return next(error);
  }


  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return next(
      new HttpError("Invalid inputs passes,please check your data", 422)
    );
  }
  const { title, description, price, category, currency } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch {
    const error = new HttpError("could not update,please try again", 500);
    return next(error);
  }
  product.title = title;
  product.description = description;
  product.price = price;
  product.category = category;
  product.currency = currency;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not update product",
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find the product.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess });
    product.creator.products.pull(product);
    await product.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }
  
  fs.unlink(imagePath, err => {
    console.log(err);
  });


  res.status(200).json({ message: "Deleted product." });
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
