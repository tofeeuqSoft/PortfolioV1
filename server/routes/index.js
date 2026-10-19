import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import projectRoutes from './project.routes.js';
import {
  skillsRouter,
  educationRouter,
  trainingRouter,
  testimonialsRouter,
  servicesRouter,
} from './content.routes.js';
import contactRoutes from './contact.routes.js';
import messageRoutes from './message.routes.js';
import blogRoutes from './blog.routes.js';
import { downloadCv } from '../controllers/cvController.js';
import { getGithubSummary } from '../controllers/githubController.js';
import { trackPageView, getSummary, getPublicStats } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/auth.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillsRouter);
router.use('/education', educationRouter);
router.use('/training', trainingRouter);
router.use('/contact', contactRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);
router.use('/posts', blogRoutes);
router.use('/testimonials', testimonialsRouter);
router.use('/services', servicesRouter);
router.get('/cv/download', downloadCv);
router.get('/github/summary', getGithubSummary);
router.post('/analytics/pageview', trackPageView);
router.get('/analytics/public', getPublicStats);
router.get('/analytics/summary', requireAuth, getSummary);

export default router;
