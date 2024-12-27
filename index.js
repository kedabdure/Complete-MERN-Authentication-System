const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js')
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('<h1>Hello World</h2>');
})

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
})

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.find({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
})

app.post('/api/products', async (req, res) => {
  console.log(req.body);
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

mongoose.connect("mongodb+srv://abdurehimked:S0YF6mELmWeefV9A@cluster0.jvfs7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('Database connected');
  })
  .catch(() => {
    console.log('Error');
  });