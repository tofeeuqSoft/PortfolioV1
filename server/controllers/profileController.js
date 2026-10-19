import Profile from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  res.json({ success: true, data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  Object.assign(profile, req.body);
  await profile.save();
  res.json({ success: true, data: profile, message: 'Profile updated' });
});
