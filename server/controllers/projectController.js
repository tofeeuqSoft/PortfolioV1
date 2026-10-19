import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const listProjects = asyncHandler(async (req, res) => {
  const { category, search, featured, limit = 100, page = 1 } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { techStack: { $regex: search, $options: 'i' } },
    ];
  }

  const perPage = Math.min(Number(limit) || 100, 200);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * perPage;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(perPage),
    Project.countDocuments(filter),
  ]);

  res.json({ success: true, data: projects, meta: { total, page: Number(page), limit: perPage } });
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
});
