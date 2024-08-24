import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/dashboard';
import PatientPage from './component/Patient/PatientPage';
import BannerOverview from './component/banner-management/ViewBanner'

const AppRouter = () => {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-management/view" element={<PatientPage />} />
          <Route path="/banner-management/view" element={<BannerOverview />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
  );
}

export default AppRouter;
