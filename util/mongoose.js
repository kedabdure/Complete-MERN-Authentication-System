const mongoose = require('mongoose');

const mongooseConnect = () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    const connection = mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return connection
  }
}

module.exports = mongooseConnect;
