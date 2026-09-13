import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App.jsx';
import './styles.css';
import './layout/sidebar.css';
import './layout/visual-polish.css';
import './features/auth/login-polish.css';
import './features/listings/browse-polish.css';
import './layout/motion.css';

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);