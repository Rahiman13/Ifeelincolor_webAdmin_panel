import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './AppRouter'; // Ensure AppRoutes is correctly imported
import Sidebar from './component/Shared/Sidebar';
import Footer from './component/Shared/Footer';
import Navbar from './component/Shared/Navbar';
import './App.scss';

const App = () => {
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onRouteChanged = () => {
      console.log("ROUTE CHANGED");
      const body = document.querySelector('body');
      const pageBodyWrapper = document.querySelector('.page-body-wrapper');

      window.scrollTo(0, 0);

      const fullPageLayoutRoutes = [
        '/dist/',
        '/dist/admin',
        // '/dist/',
        // '/dist/register',
        '/dist/forget',
        '/dist/user-pages/lockscreen',
        '/dist/error-pages/error-404',
        '/dist/error-pages/error-500',
        '/dist/general-pages/landing-page',
      ];

      const isFullPage = fullPageLayoutRoutes.includes(location.pathname);

      setIsFullPageLayout(isFullPage);

      if (pageBodyWrapper) {
        if (isFullPage) {
          pageBodyWrapper.classList.add('full-page-wrapper');
        } else {
          pageBodyWrapper.classList.remove('full-page-wrapper');
        }
      }
    };

    onRouteChanged();
  }, [location.pathname]);

  return (
    <div className="container-scroller p-0">
      {!isFullPageLayout && <Navbar />}
      <div className="container-fluid page-body-wrapper d-flex">
        {!isFullPageLayout && <Sidebar />}
        <div className="main-panel">
          <div className="container-scroller">
            <AppRoutes />
          </div>
          {!isFullPageLayout && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;
