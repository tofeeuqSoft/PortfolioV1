import { useEffect, useState } from 'react';
import api, { apiError } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function MessagesInbox() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const load = () =>
    api
      .get('/messages')
      .then(({ data }) => setMessages(data.data))
      .catch((err) => setError(apiError(err)));

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (msg) => {
    try {
      await api.patch(`/messages/${msg._id}`, { read: !msg.read });
      await load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted.');
      await load();
    } catch (err) {
      setError(apiError(err));
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {messages.map((msg) => (
        <article
          key={msg._id}
          className={`card ${msg.read ? 'opacity-70' : 'ring-1 ring-brand-500/30'}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">
                {msg.subject || '(no subject)'}{' '}
                {!msg.read && <span className="chip border-brand-500/40 text-brand-500">New</span>}
              </h3>
              <p className="text-sm text-slate-500">
                {msg.name} · <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
              </p>
            </div>
            <time className="text-xs text-slate-400">
              {new Date(msg.createdAt).toLocaleString()}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
            {msg.message}
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <button type="button" onClick={() => toggleRead(msg)} className="text-brand-500 hover:underline">
              Mark as {msg.read ? 'unread' : 'read'}
            </button>
            <a href={`mailto:${msg.email}`} className="text-brand-500 hover:underline">
              Reply
            </a>
            <button type="button" onClick={() => remove(msg._id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </article>
      ))}
      {!messages.length && !error && <p className="text-slate-500">No messages yet.</p>}
    </div>
  );
}
