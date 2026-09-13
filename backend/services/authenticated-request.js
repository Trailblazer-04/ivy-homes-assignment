import { requestUpstream } from "../utils/upstream.js";
import { authHeaders, saveSession } from "../middleware/session.middleware.js";

async function refreshSession(session) {
  const result = await requestUpstream("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });
  session.accessToken = result.access_token;
  session.refreshToken = result.refresh_token || session.refreshToken;
  saveSession(session);
  return session;
}

export async function requestAsUser(request, path, options = {}) {
  try {
    return await requestUpstream(path, {
      ...options,
      headers: { ...authHeaders(request), ...(options.headers || {}) },
    });
  } catch (error) {
    if (error.status !== 401 || !request.session.refreshToken) throw error;
    const session = await refreshSession(request.session);
    request.accessToken = session.accessToken;
    return requestUpstream(path, {
      ...options,
      headers: { ...authHeaders(request), ...(options.headers || {}) },
    });
  }
}
