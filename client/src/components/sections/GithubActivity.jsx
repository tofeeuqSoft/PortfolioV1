import { useEffect, useState } from 'react';
import Section from '../ui/Section.jsx';
import api from '../../services/api.js';

export default function GithubActivity() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/github/summary')
      .then(({ data: res }) => active && setData(res.data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  if (failed || !data) return null;

  return (
    <Section
      id="github"
      eyebrow="// github"
      title="GitHub activity"
      description={`Live stats from the ${data.username} profile.`}
    >
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{data.publicRepos}</p>
          <p className="text-sm text-slate-500">Public repos</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{data.followers}</p>
          <p className="text-sm text-slate-500">Followers</p>
        </div>
        <div className="card text-center">
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-brand-500 hover:underline"
          >
            @{data.username}
          </a>
          <p className="text-sm text-slate-500">View profile</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(data.recentRepos || []).slice(0, 6).map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="card block"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{repo.name}</h3>
              <span className="text-xs text-slate-500">★ {repo.stars}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
              {repo.description || 'No description'}
            </p>
            {repo.language && (
              <span className="mt-3 inline-block font-mono text-xs text-brand-500">
                {repo.language}
              </span>
            )}
          </a>
        ))}
      </div>
    </Section>
  );
}
