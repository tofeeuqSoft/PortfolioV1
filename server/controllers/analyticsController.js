import Analytics from '../models/Analytics.js';
import Message from '../models/Message.js';
import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const today = () => new Date().toISOString().slice(0, 10);

export const trackPageView = asyncHandler(async (req, res) => {
  await Analytics.findOneAndUpdate({ date: today() }, { $inc: { pageViews: 1 } }, { upsert: true });
  res.status(202).json({ success: true, data: null });
});

export const getPublicStats = asyncHandler(async (req, res) => {
  const [totals] = await Analytics.aggregate([
    { $group: { _id: null, pageViews: { $sum: '$pageViews' } } },
  ]);
  const todayDoc = await Analytics.findOne({ date: today() }).select('pageViews');
  res.json({
    success: true,
    data: {
      totalViews: (totals?.pageViews || 0) + 1,
      viewsToday: todayDoc?.pageViews || 0,
    },
  });
});

export const getSummary = asyncHandler(async (req, res) => {
  const [totals] = await Analytics.aggregate([
    {
      $group: {
        _id: null,
        pageViews: { $sum: '$pageViews' },
        cvDownloads: { $sum: '$cvDownloads' },
        days: { $sum: 1 },
      },
    },
  ]);

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [messagesThisWeek, projectViews, topProject, daily] = await Promise.all([
    Message.countDocuments({ createdAt: { $gte: since } }),
    Analytics.aggregate([
      { $unwind: { path: '$projectViews', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$projectViews.k', views: { $sum: '$projectViews.v' } } },
    ]),
    Project.findOne().sort({ views: -1 }).select('title slug views'),
    Analytics.find().sort({ date: -1 }).limit(14).select('date pageViews cvDownloads'),
  ]);

  res.json({
    success: true,
    data: {
      pageViews: totals?.pageViews || 0,
      cvDownloads: totals?.cvDownloads || 0,
      days: totals?.days || 0,
      messagesThisWeek,
      topProject,
      projectViews,
      daily: daily.reverse(),
    },
  });
});
