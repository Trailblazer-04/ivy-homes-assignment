import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest, authHeaders } from '../api/client.js';
import { clearSession, getSession } from '../shared/session.js';
import { Brand } from '../components/Brand.jsx';

export function AppShell({ children }) {
  const session = getSession(); const navigate = useNavigate(); const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  async function logout() { await apiRequest('/auth/logout', { method: 'POST', headers: authHeaders(session) }).catch(() => {}); clearSession(); navigate('/login'); }
  const links = [['/','Discover','⌂'],['/rentals','Rentals','⌁'],['/projects','Projects','▦'],['/saved','Saved homes','♡'],['/insights','Insights','◒']];
  return <div className="app-shell"><button className="sidebar-toggle" type="button" aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>{sidebarOpen ? '×' : '☰'}</button>{sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}<aside className={sidebarOpen ? 'open' : ''}><Brand /><nav>{links.map(([path, label, icon]) => <Link className={location.pathname === path ? 'active' : ''} to={path} key={path} onClick={() => setSidebarOpen(false)}><i>{icon}</i>{label}</Link>)}</nav><div className="account"><small>Signed in as</small><strong>{session?.user?.email}</strong><button onClick={logout}>Sign out</button></div></aside><main>{children}</main></div>;
}