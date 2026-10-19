import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const router = Router();

router.post('/image', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.status(201).json({
    success: true,
    data: { url: `/uploads/${req.file.filename}` },
    message: 'Uploaded',
  });
});

router.post('/cv', requireAuth, upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const target = path.join(uploadsDir, 'cv.pdf');
  fs.renameSync(req.file.path, target);
  res.status(201).json({
    success: true,
    data: { url: '/api/cv/download' },
    message: 'CV updated',
  });
});

export default router;
