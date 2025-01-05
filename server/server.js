import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get('/', (req, res) => res.send("API is running"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
