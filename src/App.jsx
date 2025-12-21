import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';

// Lazy-load secondary pages - only download when user navigates to them
const ServiceGallery = lazy(() => import('./components/ServiceGallery'));
const About = lazy(() => import('./components/About'));
const Admin = lazy(() => import('./components/Admin'));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0a0a0a',
    color: '#fff'
  }}>
    Loading...
  </div>
);

function App() {
  const location = useLocation();

  // Check if we're on an overlay route (service gallery or about)
  const isOverlayRoute = location.pathname.startsWith('/service/') || location.pathname === '/about';

  // Only scroll to top for non-overlay routes (like /admin)
  useEffect(() => {
    if (!isOverlayRoute && location.pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isOverlayRoute]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Home is always rendered - never unmounts, preserving scroll position */}
      <Home />

      {/* Overlay routes render on TOP of Home */}
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          {/* Home route - renders nothing since Home is always mounted above */}
          <Route path="/" element={null} />
          {/* ServiceGallery and About are fixed-position overlays */}
          <Route path="/service/:id" element={<ServiceGallery />} />
          <Route path="/about" element={<About />} />
          {/* Admin replaces everything */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;


