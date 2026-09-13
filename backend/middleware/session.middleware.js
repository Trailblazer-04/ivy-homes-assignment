const sessions = new Map();

export function saveSession(session) {
  sessions.set(session.accessToken, session);
}

export function deleteSession(token) {
  sessions.delete(token);
}

export function requireSession(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const session = token && sessions.get(token);
  if (!session)
    return response.status(401).json({ message: "Please log in again." });
  request.session = session;
  request.accessToken = token;
  next();
}

export function authHeaders(request) {
  return { Authorization: `Bearer ${request.accessToken}` };
}
