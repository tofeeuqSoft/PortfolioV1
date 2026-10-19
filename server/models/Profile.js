import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: 'Tauhidul Islam' },
    title: { type: String, default: 'Full Stack MERN Developer' },
    heroRoles: { type: [String], default: ['Full Stack MERN Developer', 'React Specialist', 'API Builder'] },
    pitch: { type: String, default: '' },
    bio: { type: String, default: '' },
    objective: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    cvUrl: { type: String, default: '/api/cv/download' },
    location: { type: String, default: 'Mirpur, Dhaka' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    availableForWork: { type: Boolean, default: true },
    visibleSections: {
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      journey: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
