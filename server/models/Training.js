import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, default: '' },
    batch: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    assessmentUrl: { type: String, default: '' },
    year: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Training', trainingSchema);
