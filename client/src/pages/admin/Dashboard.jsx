import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Seo from '../../components/Seo.jsx';
import ProfileEditor from '../../components/admin/ProfileEditor.jsx';
import ResourceManager from '../../components/admin/ResourceManager.jsx';
import MessagesInbox from '../../components/admin/MessagesInbox.jsx';
import PostsManager from '../../components/admin/PostsManager.jsx';
import AnalyticsOverview from '../../components/admin/AnalyticsOverview.jsx';
import ChangePassword from '../../components/admin/ChangePassword.jsx';

const TABS = [
  'Profile',
  'Projects',
  'Skills',
  'Education',
  'Training',
  'Services',
  'Testimonials',
  'Posts',
  'Messages',
  'Analytics',
  'Account',
];

const projectFields = [
  { name: 'title', label: 'Title', full: true, required: true },
  { name: 'slug', label: 'Slug', help: 'URL-friendly id, e.g. mern-booking', required: true },
  { name: 'category', label: 'Category' },
  { name: 'summary', label: 'Summary', full: true },
  { name: 'description', label: 'Description', type: 'textarea', full: true },
  { name: 'features', label: 'Features', type: 'tags', help: 'Comma separated', full: true },
  { name: 'challenges', label: 'Challenges', type: 'textarea', full: true },
  { name: 'techStack', label: 'Tech stack', type: 'tags', help: 'Comma separated' },
  { name: 'images', label: 'Screenshots', type: 'images', full: true },
  { name: 'liveUrl', label: 'Live URL' },
  { name: 'githubUrl', label: 'GitHub URL' },
  { name: 'order', label: 'Order', type: 'number' },
  { name: 'featured', label: 'Featured', type: 'checkbox' },
];

const skillFields = [
  { name: 'name', label: 'Skill', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['Frontend', 'Backend', 'Database', 'Tools'] },
  { name: 'level', label: 'Level (0-100)', type: 'number' },
  { name: 'order', label: 'Order', type: 'number' },
  {
    name: 'projects',
    label: 'Proof (projects that used this skill)',
    type: 'multiref',
    optionsEndpoint: '/projects',
    labelKey: 'title',
    full: true,
  },
];

const educationFields = [
  { name: 'institution', label: 'Institution', full: true, required: true },
  { name: 'degree', label: 'Degree' },
  { name: 'field', label: 'Field' },
  { name: 'result', label: 'Result' },
  { name: 'startYear', label: 'Start year' },
  { name: 'passingYear', label: 'Passing year' },
  { name: 'order', label: 'Order', type: 'number' },
];

const trainingFields = [
  { name: 'title', label: 'Title', full: true, required: true },
  { name: 'provider', label: 'Provider' },
  { name: 'batch', label: 'Batch' },
  { name: 'year', label: 'Year' },
  { name: 'certificateUrl', label: 'Certificate URL', full: true },
  { name: 'assessmentUrl', label: 'Assessment URL', full: true },
  { name: 'order', label: 'Order', type: 'number' },
];

const serviceFields = [
  { name: 'title', label: 'Title', full: true, required: true },
  { name: 'description', label: 'Description', type: 'textarea', full: true },
  { name: 'icon', label: 'Icon (emoji)' },
  { name: 'order', label: 'Order', type: 'number' },
];

const testimonialFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'role', label: 'Role' },
  { name: 'message', label: 'Message', type: 'textarea', full: true },
  { name: 'avatarUrl', label: 'Avatar URL', full: true },
  { name: 'visible', label: 'Visible', type: 'checkbox' },
  { name: 'order', label: 'Order', type: 'number' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('Profile');

  return (
    <div className="min-h-screen">
      <Seo title="Admin dashboard" description="Manage portfolio content." />

      <header className="border-b border-slate-200/70 dark:border-white/10">
        <div className="container-page flex h-16 items-center justify-between">
          <h1 className="font-mono text-lg font-bold">
            <span className="gradient-text">admin</span>
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">{user?.email}</span>
            <Link to="/" className="btn-ghost !px-3 !py-1.5">
              View site
            </Link>
            <button type="button" onClick={logout} className="btn-ghost !px-3 !py-1.5">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === t
                  ? 'bg-brand-500 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Profile' && <ProfileEditor />}

        {tab === 'Projects' && (
          <ResourceManager
            title="project"
            endpoint="/projects"
            fields={projectFields}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'views', label: 'Views' },
              { key: 'featured', label: 'Featured', render: (p) => (p.featured ? 'Yes' : '—') },
            ]}
          />
        )}

        {tab === 'Skills' && (
          <ResourceManager
            title="skill"
            endpoint="/skills"
            fields={skillFields}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' },
              { key: 'level', label: 'Level' },
              {
                key: 'projects',
                label: 'Proof',
                render: (s) => (Array.isArray(s.projects) ? s.projects.length : 0),
              },
            ]}
          />
        )}

        {tab === 'Education' && (
          <ResourceManager
            title="education"
            endpoint="/education"
            fields={educationFields}
            columns={[
              { key: 'institution', label: 'Institution' },
              { key: 'degree', label: 'Degree' },
              { key: 'passingYear', label: 'Year' },
            ]}
          />
        )}

        {tab === 'Training' && (
          <ResourceManager
            title="training"
            endpoint="/training"
            fields={trainingFields}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'provider', label: 'Provider' },
              { key: 'year', label: 'Year' },
            ]}
          />
        )}

        {tab === 'Services' && (
          <ResourceManager
            title="service"
            endpoint="/services"
            fields={serviceFields}
            columns={[
              { key: 'icon', label: 'Icon' },
              { key: 'title', label: 'Title' },
              { key: 'order', label: 'Order' },
            ]}
          />
        )}

        {tab === 'Testimonials' && (
          <ResourceManager
            title="testimonial"
            endpoint="/testimonials"
            fields={testimonialFields}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'visible', label: 'Visible', render: (t) => (t.visible ? 'Yes' : 'No') },
            ]}
          />
        )}

        {tab === 'Posts' && <PostsManager />}

        {tab === 'Messages' && <MessagesInbox />}

        {tab === 'Analytics' && <AnalyticsOverview />}

        {tab === 'Account' && <ChangePassword />}
      </div>
    </div>
  );
}
