import express from 'express';
import { getUserDate, getUsersData } from '../controllers/user.controller.js';
import userAuth from '../middleware/user.auth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserDate);
userRouter.get('/users', getUsersData)

export default userRouter;