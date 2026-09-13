export async function requestUpstream(path, options = {}) {
  const response = await fetch(`${process.env.VITE_IVY_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.VITE_IVY_API_KEY,
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      body.detail ||
        body.message ||
        `Upstream request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }
  return body;
}

export function sendError(response, error) {
  response.status(error.status || 500).json({ message: error.message });
}
