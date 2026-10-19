import Post from '../models/Post.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export function estimateReadingTime(markdown = '') {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const listPublishedPosts = asyncHandler(async (req, res) => {
  const { tag, limit = 50 } = req.query;
  const filter = { status: 'published' };
  if (tag) filter.tags = tag;
  const posts = await Post.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 100))
    .select('-contentMarkdown');
  res.json({ success: true, data: posts });
});

export const getPublishedPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: 'published' });
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
});

// Admin management -----------------------------------------------------------

export const listAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json({ success: true, data: posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const payload = normalizePost(req.body);
  const post = await Post.create(payload);
  res.status(201).json({ success: true, data: post, message: 'Created' });
});

export const updatePost = asyncHandler(async (req, res) => {
  const payload = normalizePost(req.body);
  const post = await Post.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!post) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: post, message: 'Updated' });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: post, message: 'Deleted' });
});

function normalizePost(body) {
  const payload = { ...body };
  payload.readingTime = estimateReadingTime(payload.contentMarkdown || '');
  if (payload.status === 'published' && !payload.publishedAt) {
    payload.publishedAt = new Date();
  }
  return payload;
}
