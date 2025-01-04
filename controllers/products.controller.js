const Product = require('../models/product.model');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a product by id
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Post a product
const postProduct = async (req, res) => {
  try {
    const product = req.body
    const productDoc = await Product.create(product)
    if (!product) {
      return res.status(400).json({ message: "Failed to create product" })
    }
    res.status(201).json(productDoc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = req.body

    const productDoc = await Product.findByIdAndUpdate(id, product, { new: true })
    if (!productDoc) {
      return res.status(400).json({ message: "Failed to update the product" })
    }

    res.status(200).json(productDoc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      return res.status(404).json({message: "Product not found"})
    }

    res.status(200).json({message: "Product deleted successfully"})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct
};
