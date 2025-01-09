import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true }));


// API endpoints
app.get('/', (req, res) => res.send("API is running"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
