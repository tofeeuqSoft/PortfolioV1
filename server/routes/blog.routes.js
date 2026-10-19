import { Router } from 'express';
import {
  listPublishedPosts,
  getPublishedPost,
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listPublishedPosts);
router.get('/manage/all', requireAuth, listAllPosts);
router.post('/', requireAuth, createPost);
router.get('/:slug', getPublishedPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;
