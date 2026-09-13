export function getSession() {
  return JSON.parse(sessionStorage.getItem('ivy_session') || 'null');
}

export function saveSession(session) {
  sessionStorage.setItem('ivy_session', JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem('ivy_session');
}