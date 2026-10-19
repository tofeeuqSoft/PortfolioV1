import Skill from '../models/Skill.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const listSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find()
    .sort({ category: 1, order: 1 })
    .populate('projects', 'title slug');
  res.json({ success: true, data: skills });
});
