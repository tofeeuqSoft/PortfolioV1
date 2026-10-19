import crypto from 'crypto';
import Message from '../models/Message.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendContactNotification } from '../utils/mailer.js';

function hashIp(ip) {
  return crypto.createHash('sha256').update(String(ip || '')).digest('hex').slice(0, 32);
}

export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message, website } = req.body;

  // Honeypot: bots fill hidden "website" field.
  if (website) {
    return res.status(200).json({ success: true, data: null, message: 'Message received' });
  }

  const doc = await Message.create({
    name,
    email,
    subject,
    message,
    ipHash: hashIp(req.ip),
  });

  sendContactNotification(doc).catch((err) => console.error('Email notify failed:', err.message));

  res.status(201).json({ success: true, data: { _id: doc._id }, message: 'Message sent' });
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
});

export const updateMessage = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read },
    { new: true }
  );
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: doc, message: 'Updated' });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: doc, message: 'Deleted' });
});
