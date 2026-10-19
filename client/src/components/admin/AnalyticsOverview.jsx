import { useEffect, useState } from 'react';
import api, { apiError } from '../../services/api.js';

function Stat({ value, label }) {
  return (
    <div className="card text-center">
      <p className="text-3xl font-extrabold gradient-text">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/analytics/summary')
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(apiError(err)));
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p className="text-slate-500">Loading analytics…</p>;

  const maxDaily = Math.max(1, ...data.daily.map((d) => d.pageViews));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={data.pageViews} label="Page views" />
        <Stat value={data.cvDownloads} label="CV downloads" />
        <Stat value={data.messagesThisWeek} label="Messages (7d)" />
        <Stat value={data.topProject?.views ?? 0} label="Top project views" />
      </div>

      {data.topProject && (
        <div className="card">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Most viewed project</h3>
          <p className="mt-1 text-lg font-semibold">{data.topProject.title}</p>
        </div>
      )}

      <div className="card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Page views (last 14 days)
        </h3>
        <div className="flex h-40 items-end gap-1">
          {data.daily.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.pageViews}`}>
              <div
                className="w-full rounded-t bg-gradient-to-t from-brand-500 to-accent-cyan"
                style={{ height: `${(d.pageViews / maxDaily) * 100}%` }}
              />
            </div>
          ))}
          {!data.daily.length && <p className="text-slate-500">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
