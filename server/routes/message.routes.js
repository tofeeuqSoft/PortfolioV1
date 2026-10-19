import { Router } from 'express';
import {
  listMessages,
  updateMessage,
  deleteMessage,
} from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listMessages);
router.patch('/:id', requireAuth, updateMessage);
router.delete('/:id', requireAuth, deleteMessage);

export default router;
