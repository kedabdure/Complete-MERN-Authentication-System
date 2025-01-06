import mongoose from "mongoose";

const connectDB = async () => {
  const conn = process.env.MONGODB_URI_LOCAL;
  console.log(conn)

  mongoose.connection.on("connected", () => {
    console.log('Database connected')
  })
  await mongoose.connect(conn)
}

export default connectDB;
