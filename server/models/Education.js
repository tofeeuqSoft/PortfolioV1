import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    result: { type: String, default: '' },
    startYear: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Education', educationSchema);
