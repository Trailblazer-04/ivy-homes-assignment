export async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (response.status === 401) {
    sessionStorage.removeItem('ivy_session');
    window.location.href = '/login';
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong');
  return body;
}

export function authHeaders(session) {
  return { Authorization: `Bearer ${session.token}` };
}