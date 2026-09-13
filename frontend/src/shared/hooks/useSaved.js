import { useEffect, useState } from 'react';
import { apiRequest, authHeaders } from '../../api/client.js';
import { getSession } from '../session.js';

export function useSaved() {
  const session = getSession();
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    apiRequest('/v1/saved', { headers: authHeaders(session) }).then((data) => setSaved(data.results || [])).catch(() => {});
  }, []);
  async function toggleSaved(id) {
    const exists = saved.some((item) => item.listing_id === id);
    await apiRequest(`/v1/saved${exists ? `/${id}` : ''}`, {
      method: exists ? 'DELETE' : 'POST', headers: authHeaders(session),
      body: exists ? undefined : JSON.stringify({ listing_id: id })
    });
    setSaved(exists ? saved.filter((item) => item.listing_id !== id) : [...saved, { listing_id: id }]);
  }
  return { saved, toggleSaved };
}