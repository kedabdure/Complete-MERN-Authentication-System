import express from 'express';
import { getUserDate } from '../controllers/user.controller.js';
import userAuth from '../middleware/user.auth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserDate);

export default userRouter;