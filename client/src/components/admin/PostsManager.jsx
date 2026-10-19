import { useEffect, useState } from 'react';
import api, { apiError } from '../../services/api.js';
import { renderMarkdown } from '../../utils/markdown.js';
import { useToast } from '../../context/ToastContext.jsx';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: '',
  tags: '',
  status: 'draft',
};

export default function PostsManager() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    api
      .get('/posts/manage/all')
      .then(({ data }) => setPosts(data.data))
      .catch((err) => setError(apiError(err)));

  useEffect(() => {
    load();
  }, []);

  const update = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editId) await api.put(`/posts/${editId}`, payload);
      else await api.post('/posts', payload);
      toast.success(`Post ${editId ? 'updated' : 'created'}.`);
      setForm(EMPTY);
      setEditId(null);
      setPreview(false);
      await load();
    } catch (err) {
      setError(apiError(err));
      toast.error(apiError(err));
    }
  };

  const onEdit = (post) => {
    setEditId(post._id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      contentMarkdown: post.contentMarkdown || '',
      tags: (post.tags || []).join(', '),
      status: post.status,
    });
    setPreview(false);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted.');
      await load();
    } catch (err) {
      setError(apiError(err));
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="card space-y-4">
        <h3 className="text-lg font-semibold">{editId ? 'Edit' : 'New'} post</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-title" className="mb-1 block text-sm font-medium">Title</label>
            <input id="p-title" className="field" value={form.title} onChange={(e) => update('title', e.target.value)} required />
          </div>
          <div>
            <label htmlFor="p-slug" className="mb-1 block text-sm font-medium">Slug</label>
            <input id="p-slug" className="field" value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
          </div>
        </div>
        <div>
          <label htmlFor="p-excerpt" className="mb-1 block text-sm font-medium">Excerpt</label>
          <input id="p-excerpt" className="field" value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-tags" className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
            <input id="p-tags" className="field" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
          </div>
          <div>
            <label htmlFor="p-status" className="mb-1 block text-sm font-medium">Status</label>
            <select id="p-status" className="field" value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="p-content" className="text-sm font-medium">Content (Markdown)</label>
            <button type="button" onClick={() => setPreview((v) => !v)} className="text-xs text-brand-500 hover:underline">
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div
              className="markdown-body min-h-[12rem] rounded-xl border border-slate-200 p-4 dark:border-white/10"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(form.contentMarkdown) }}
            />
          ) : (
            <textarea
              id="p-content"
              rows={12}
              className="field font-mono text-sm"
              value={form.contentMarkdown}
              onChange={(e) => update('contentMarkdown', e.target.value)}
            />
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">{editId ? 'Save changes' : 'Create'}</button>
          {editId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setEditId(null);
                setForm(EMPTY);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Title</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Reading</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t border-slate-200/70 dark:border-white/10">
                <td className="py-3">{post.title}</td>
                <td className="py-3">
                  <span className={`chip ${post.status === 'published' ? 'border-emerald-500/40 text-emerald-500' : ''}`}>
                    {post.status}
                  </span>
                </td>
                <td className="py-3">{post.readingTime || 1} min</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onEdit(post)} className="text-brand-500 hover:underline">Edit</button>
                    <button type="button" onClick={() => onDelete(post._id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr>
                <td colSpan={4} className="py-4 text-slate-500">No posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
