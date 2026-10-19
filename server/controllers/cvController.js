import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Analytics from '../models/Analytics.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

export const downloadCv = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  await Analytics.findOneAndUpdate(
    { date: today },
    { $inc: { cvDownloads: 1 } },
    { upsert: true }
  );

  const cvPath = path.join(uploadsDir, 'cv.pdf');
  if (!fs.existsSync(cvPath)) {
    return res.status(404).json({
      success: false,
      message: 'CV not uploaded yet. Upload it from the admin dashboard.',
    });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Tauhidul-Islam-CV.pdf"');
  fs.createReadStream(cvPath).pipe(res);
});
