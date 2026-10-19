import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.cookie('token', token, cookieOptions);
  res.json({ success: true, data: user.toSafeJSON(), message: 'Logged in' });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  res.json({ success: true, data: null, message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeJSON() });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user || !(await user.verifyPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  if (await user.verifyPassword(newPassword)) {
    return res
      .status(400)
      .json({ success: false, message: 'New password must be different from the current one' });
  }

  await user.setPassword(newPassword);
  await user.save();

  res.json({ success: true, data: null, message: 'Password updated' });
});
