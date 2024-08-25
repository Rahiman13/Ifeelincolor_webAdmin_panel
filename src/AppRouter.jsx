import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/dashboard';
import PatientPage from './component/Patient/PatientPage';
import BannerOverview from './component/banner-management/ViewBanner';
import Login from './component/User/Login';
import Register from './component/User/Register';
import Spinner from './component/Shared/Spinner';
import Error404 from './component/Error/Error_404';
import Error500 from './component/Error/Error_500';
import BudgetAnalysis from './component/Budget/BudgetOverview';
import PortalSubscriptions from './component/subscription-management/PortalSubscriptions'
import ClinicianSubscriptions from './component/subscription-management/ClinicianSubscriptions'
import OrganizationSubscriptions from './component/subscription-management/OrganizationSubscriptions'
import ManageAssessment from './component/Assessment/ManageAssessment'
import AISuggestedQuestions from './component/Assessment/AISuggestedQuestions'
import Settings from './component/Settings/Settings';
import ProfilePage from './component/Profile/Profile';


const AppRouter = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Error Pages */}
          <Route path="/error-pages/error-404" element={<Error404 />} />
          <Route path="/error-pages/error-500" element={<Error500 />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-management/view" element={<PatientPage />} />
          <Route path="/banner-management/view" element={<BannerOverview />} />
          <Route path="/subscription-budget-analysis/overview" element={<BudgetAnalysis />} />
          {/*Subscriptions  */}
          <Route path="/subscription-management/portal" element={<PortalSubscriptions />} />
          <Route path="/subscription-management/clinician" element={<ClinicianSubscriptions />} />
          <Route path="/subscription-management/organization" element={<OrganizationSubscriptions />} />

          {/* Test Management */}
          <Route path="/test-management/manage" element={<ManageAssessment />} />
          <Route path="/test-management/ai-questions" element={<AISuggestedQuestions />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />




          {/* Add more routes as needed */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
