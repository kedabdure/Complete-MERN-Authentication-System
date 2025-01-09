import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "All fields are required", success: false });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name, email, password: hashedPassword
    })
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Sending Welcome Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our platform",
      text: `Welcome to Nexaddis, ${name}. We are glad to have you on board`
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User created successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }

}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "All fields are required", success: false });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ success: true, message: "Login success" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "User is already verified" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;

    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      // text: `Your OTP is ${otp} valid for 24 hours. Please do not share this with anyone`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, massage: "Missing Required Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.veryOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Email verified",
      text: `Your email is verified successfully!. Welcome to our platform`
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "Authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset OTP",
      // text: `Your OTP is ${otp} valid for 15 minutes. Please use this OTP to reset your password`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP and new password are required" });
  }

  try {

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiredAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOtp = '';
    user.resetOtpExpiredAt = 0;
    await user.save();


    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset successful",
      text: "Your password has been reset successfully"
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}