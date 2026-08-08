const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};

// Specific API calls
export const challengesApi = {
  getAll: (params?: string) => api.get(`/api/challenges${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/api/challenges/${id}`),
  getByDay: (day: number) => api.get(`/api/challenges/day/${day}`),
};

export const codeApi = {
  run: (data: { code: string; language: string; challengeId: string }) =>
    api.post('/api/code/run', data),
  visualize: (data: { code: string; language: string; challengeSlug: string }) =>
    api.post('/api/code/visualize', data),
};

export const submissionsApi = {
  submit: (data: { challengeId: string; language: string; code: string }) =>
    api.post('/api/submissions/submit', data),
};

export const progressApi = {
  get: () => api.get('/api/progress'),
};

export const leaderboardApi = {
  get: () => api.get('/api/leaderboard'),
};

export const userApi = {
  getProfile: () => api.get('/api/user/profile'),
};

export const achievementsApi = {
  getAll: () => api.get('/api/achievements'),
};

export const githubApi = {
  getStatus: () => api.get('/api/github/status'),
  createRepo: () => api.post('/api/github/create-repository', {}),
  commit: (data: { day: number; challengeTitle: string; code: string; language: string }) =>
    api.post('/api/github/commit', data),
};

export const linkedinApi = {
  getStatus: () => api.get('/api/linkedin/status'),
  publish: (data: { achievementId: string }) => api.post('/api/linkedin/publish', data),
};
