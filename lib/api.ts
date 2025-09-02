//mini couche api
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

function assertApiUrl() {
  if (!API_URL) throw new Error('Missing EXPO_PUBLIC_API_URL');
}

export async function fetchCommonByUsers(users: string[]) {
  assertApiUrl();
  const clean = users.map(u => u.trim()).filter(Boolean);
  if (clean.length === 0) throw new Error('At least one user is required');

  const path = `/common/${encodeURIComponent(clean.join(','))}`;
  const res = await fetch(`${API_URL}${path}`, { method: 'GET' });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text || res.statusText}`);
  }

  return res.json() as Promise<any>;
}