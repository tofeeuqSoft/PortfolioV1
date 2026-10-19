import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Education from './models/Education.js';
import Training from './models/Training.js';
import Service from './models/Service.js';
import Testimonial from './models/Testimonial.js';
import Post from './models/Post.js';

const projects = [
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    summary: 'A full-stack MERN portfolio with an admin CMS — the site itself is the proof of skill.',
    description:
      'A personal portfolio built as a complete MERN application. The public site presents projects, skills and training, while a private dashboard manages all content without code changes.',
    features: [
      'Dynamic content managed from an admin dashboard',
      'JWT authentication with httpOnly cookies',
      'Project gallery with search and category filters',
      'CV download with download tracking',
    ],
    challenges:
      'Balancing a rich animated UI with performance budgets, and making every section dynamic while keeping the API simple.',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    category: 'Full Stack',
    featured: true,
    order: 1,
  },
  {
    title: 'Booking Website (MERN-Booking)',
    slug: 'mern-booking',
    summary: 'A booking platform with authentication, availability checks and an admin view.',
    description:
      'A MERN booking application that lets users reserve slots and manage their bookings, with an admin area to review reservations.',
    features: ['User registration and login', 'Create and manage bookings', 'Admin booking overview'],
    challenges: 'Preventing double bookings with reliable availability checks.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
    category: 'Full Stack',
    featured: true,
    order: 2,
  },
  {
    title: 'MERN CRUD Project',
    slug: 'mern-crud-project',
    summary: 'A clean CRUD application demonstrating REST API design and state management.',
    description:
      'A CRUD application built to practise full-stack fundamentals: REST endpoints, validation, and a responsive React interface.',
    features: ['Full create/read/update/delete flows', 'Form validation', 'Responsive UI'],
    challenges: 'Keeping client state in sync with the server after mutations.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
    category: 'Full Stack',
    featured: false,
    order: 3,
  },
  {
    title: 'E-Com Automation',
    slug: 'ecom-automation',
    summary: 'Automation utilities for e-commerce workflows.',
    description:
      'A project exploring automation for common e-commerce operations, focusing on reliable data handling and API integration.',
    features: ['Automated data processing', 'API integration', 'Configurable workflows'],
    challenges: 'Handling inconsistent external data safely.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    category: 'Backend',
    featured: false,
    order: 4,
  },
];

const skills = [
  { name: 'JavaScript', category: 'Frontend', level: 90, order: 1 },
  { name: 'React.js', category: 'Frontend', level: 88, order: 2 },
  { name: 'HTML', category: 'Frontend', level: 92, order: 3 },
  { name: 'CSS', category: 'Frontend', level: 85, order: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, order: 5 },
  { name: 'Bootstrap', category: 'Frontend', level: 78, order: 6 },
  { name: 'Node.js', category: 'Backend', level: 86, order: 7 },
  { name: 'Express.js', category: 'Backend', level: 86, order: 8 },
  { name: 'MongoDB', category: 'Database', level: 84, order: 9 },
  { name: 'GitHub', category: 'Tools', level: 85, order: 10 },
  { name: 'Postman', category: 'Tools', level: 88, order: 11 },
];

const education = [
  {
    institution: 'Varendra University',
    degree: 'B.Sc in CSE',
    field: 'Computer Science & Engineering',
    passingYear: '2025',
    order: 1,
  },
  {
    institution: 'Varendra College',
    degree: 'HSC',
    field: 'Science',
    passingYear: '2017',
    order: 2,
  },
  {
    institution: 'Kumorpur Alim Madrashah',
    degree: 'Dakhil',
    field: 'Science',
    passingYear: '2015',
    order: 3,
  },
];

const training = [
  {
    title: 'Complete Full Stack Web Development with MERN',
    provider: 'Ostad',
    batch: 'MERN Stack Batch-4',
    year: '2025',
    order: 1,
  },
];

const services = [
  { title: 'Full Stack Web Development', description: 'End-to-end MERN applications from database to UI.', icon: '🧩', order: 1 },
  { title: 'REST API Development', description: 'Secure, documented Express APIs with authentication and validation.', icon: '🔌', order: 2 },
  { title: 'E-commerce Solutions', description: 'Product catalogs, carts and order flows built to scale.', icon: '🛒', order: 3 },
  { title: 'Admin Dashboards', description: 'Content and data dashboards with full CRUD control.', icon: '📊', order: 4 },
];

const testimonials = [
  {
    name: 'Sabina Yasmin',
    role: 'Coordinator, Dept. of CSE, Varendra University',
    message: 'Tauhidul is a dedicated learner who consistently delivers thoughtful, well-structured solutions.',
    visible: true,
    order: 1,
  },
];

const posts = [
  {
    title: 'Why I build server-side rendered metadata for a React portfolio',
    slug: 'spa-seo-metadata',
    excerpt: 'A pure SPA is weaker for SEO. Here is how I mitigate it with per-route meta tags.',
    contentMarkdown:
      '# SPA SEO\n\nA single-page app renders on the client, which search crawlers may not wait for.\n\n## My approach\n\n- Per-route `title` and meta tags\n- Open Graph and Twitter cards\n- A `sitemap.xml` and `robots.txt`\n- Fast first paint\n\n> The goal is not to beat server rendering, but to be good enough for sharing and indexing.',
    tags: ['React', 'SEO', 'MERN'],
    status: 'published',
    publishedAt: new Date(),
  },
];

async function seed() {
  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@tofeeuq.dev').toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({ name: process.env.ADMIN_NAME || 'Tauhidul Islam', email: adminEmail });
    await admin.setPassword(process.env.ADMIN_PASSWORD || 'ChangeMe123!');
    await admin.save();
    console.log(`Created admin: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  if (!(await Profile.findOne())) {
    await Profile.create({
      fullName: 'Tauhidul Islam',
      title: 'Full Stack MERN Developer',
      heroRoles: ['Full Stack MERN Developer', 'React Specialist', 'API Builder'],
      pitch: 'I build reliable, scalable web applications with the MERN stack.',
      bio: 'Full Stack MERN developer based in Dhaka, focused on clean APIs and thoughtful user interfaces.',
      objective:
        'Dedicated MERN developer building innovative solutions for dynamic projects, always learning and shipping.',
      location: 'Mirpur, Dhaka',
      email: adminEmail,
      phone: '',
      socials: {
        github: 'https://github.com/tofeeuqSoft',
        linkedin: 'https://www.linkedin.com/in/tauhidul-islam-tofeeuq',
      },
      availableForWork: true,
    });
    console.log('Created profile');
  }

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(projects);
    console.log(`Inserted ${projects.length} projects`);
  }

  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(skills);
    console.log(`Inserted ${skills.length} skills`);
  }

  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany(education);
    console.log(`Inserted ${education.length} education entries`);
  }

  if ((await Training.countDocuments()) === 0) {
    await Training.insertMany(training);
    console.log(`Inserted ${training.length} training entries`);
  }

  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(services);
    console.log(`Inserted ${services.length} services`);
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`Inserted ${testimonials.length} testimonials`);
  }

  if ((await Post.countDocuments()) === 0) {
    await Post.insertMany(posts);
    console.log(`Inserted ${posts.length} posts`);
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
