import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    contentMarkdown: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readingTime: { type: Number, default: 1 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model('Post', postSchema);
