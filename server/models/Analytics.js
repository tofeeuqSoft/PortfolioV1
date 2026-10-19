import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    pageViews: { type: Number, default: 0 },
    cvDownloads: { type: Number, default: 0 },
    projectViews: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);
