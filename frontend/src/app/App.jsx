import { Navigate, Route, Routes } from 'react-router-dom';
import { getSession } from '../shared/session.js';
import { AppShell } from '../layout/AppShell.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { BrowsePage } from '../features/listings/BrowsePage.jsx';
import { ListingDetailPage } from '../features/listings/ListingDetailPage.jsx';
import { ProjectsPage } from '../features/projects/ProjectsPage.jsx';
import { SavedPage } from '../features/saved/SavedPage.jsx';
import { InsightsPage } from '../features/insights/InsightsPage.jsx';

function Protected({ children }) { return getSession() ? <AppShell>{children}</AppShell> : <Navigate to="/login" replace />; }

export function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/" element={<Protected><BrowsePage /></Protected>} /><Route path="/rentals" element={<Protected><BrowsePage type="rentals" /></Protected>} /><Route path="/listing/:id" element={<Protected><ListingDetailPage /></Protected>} /><Route path="/projects" element={<Protected><ProjectsPage /></Protected>} /><Route path="/saved" element={<Protected><SavedPage /></Protected>} /><Route path="/insights" element={<Protected><InsightsPage /></Protected>} /></Routes>;
}