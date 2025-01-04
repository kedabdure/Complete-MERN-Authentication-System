const express = require('express');
require('dotenv').config();
const mongooseConnect = require('./util/mongoose.js');
const productRoute = require('./routes/product.route');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/products', productRoute);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

mongooseConnect().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
});
