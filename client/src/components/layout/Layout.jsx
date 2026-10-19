import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import ScrollProgress from './ScrollProgress.jsx';
import Backdrop from './Backdrop.jsx';
import CursorGlow from './CursorGlow.jsx';
import CommandPalette from '../CommandPalette.jsx';
import usePageView from '../../hooks/usePageView.js';

export default function Layout() {
  usePageView();
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <ScrollProgress />
      <Backdrop />
      <CursorGlow />
      <CommandPalette />
      <Navbar />
      <main id="main-content" className="flex-1">
        <div key={pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
