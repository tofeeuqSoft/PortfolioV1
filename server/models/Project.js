import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    challenges: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    category: { type: String, default: 'Full Stack' },
    images: { type: [String], default: [] },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ featured: 1, order: 1, createdAt: -1 });

export default mongoose.model('Project', projectSchema);
