import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyEmail, isAuthenticated } from '../controllers/auth.controller.js';
import userAuth from '../middleware/user.auth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);

export default authRouter;
