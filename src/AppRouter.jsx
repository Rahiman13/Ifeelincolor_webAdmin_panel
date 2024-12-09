import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardSuperAdmin from './component/Dashboard/dashboard_superadmin';
import Dashboard from './component/Dashboard/dashboard';
import Dashboard_OrgManager from './component/Dashboard/Dashbooard_OrgManager';
import PatientPage from './component/Patient/PatientPage';
import BannerOverview from './component/banner-management/ViewBanner';
import Login from './component/User/Login';
import LoginAdmin from './component/User/Login admin';
import Register from './component/User/Register';
import Spinner from './component/Shared/Spinner';
import Error404 from './component/Error/Error_404';
import Error500 from './component/Error/Error_500';
import BudgetAnalysis from './component/Budget/BudgetOverview';
import BudgetOverview_superadmin from './component/Budget/BudgetOverview_superadmin';
import PortalSubscriptions from './component/subscription-management/PortalSubscriptions'
import ClinicianSubscriptions from './component/subscription-management/ClinicianSubscriptions'
import OrganizationSubscriptions from './component/subscription-management/OrganizationSubscriptions'
import ManageAssessment from './component/Assessment/ManageAssessment'
import MoodAssessments from './component/Assessment/MoodAssessments'
import BodyAssessments from './component/Assessment/BodyAssessments'
import Recommandations from './component/Recomandations/recomandations'
// import MoodLevelAssessments from './component/Assessment/MoodLevelAssessments'
import AISuggestedQuestions from './component/Assessment/AISuggestedQuestions'
import Settings from './component/Settings/Settings';
import ProfilePage from './component/Profile/Profile';
import Profile_superadmin from './component/Profile/Profile_superadmin';
import ProtectedRoute from './component/Protected/ProtectedRoute'
import ForgetPassword from './component/User/ForgetPassword';
import LandingPage from './component/Landing/LandingPage';
import LandingPage_Ifeelincolor from './component/Landing/Landing_Ifeelincolor';
import Organization_login from './component/User/Organization_login'
import ForgotPasswordOrganization from './component/User/ForgetPassword_organization';
import LoginManager from './component/User/LoginManager';
import ForgotPasswordManager from './component/User/ForgetPassword_manager';
import LoginOrgAdmin from './component/User/OrgAdminLogin';
import ForgotPasswordOrgAdmin from './component/User/ForgetPassword_orgadmin';
import OrganizationRegister from './component/User/OrganizationRegister'
import ForgetPassword_Admin from './component/User/ForgetPassword_Admin';
import ForgetPasswordAssistant from './component/User/ForgetPassword_Assistant';
import Dashboard_superadmin from './component/Dashboard/dashboard_superadmin';
import ClinicianPage from './component/Clinician/Clinician';
import ManagersPage from './component/Managers/Managers';
import AdminsPage from './component/Admin/Adminspage';
import OpeningPage from './component/User/openingPage';
import Packages from './component/Packages/Packages';
import OrganizationPage from './component/organization/Organization';
import Organization_Subscriptions from './component/Organization_Portal_subscritpitions/Organization_Subscriptions';
import './AppRoute.css';
import AssistantLogin from './component/User/Login_assistant';
import AssistantPage from './component/Assistant/Assistant';
import Permissions from './component/Permissions/Permissions';
import Clinician_superadmin from './component/Clinician/Clinician_superadmin';
import Packages_superadmin from './component/Packages/Packages_superadmin';
import ErrorBoundary from './component/Errorboundaries/error_home';

import OrganizationPayment from './component/Payment/OrganizationPaymentSetup';
import StripePaymentPage from './component/Payment/Transaction';

// import './component/Admin/Adminspage.css'

import Background from './assets/background';

const AppRouter = () => {
  const [userRole, setUserRole] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const adminPortal = sessionStorage.getItem('adminPortal');
    const role = sessionStorage.getItem('role');
    setUserRole(role);
    setIsSuperAdmin(adminPortal === 'true');
  }, []);

  const renderDashboard = () => {
    if (userRole === 'manager') {
      return <Dashboard_OrgManager />;
    } else if (userRole === 'organization') {
      return <Dashboard />;
    } else if (userRole === 'Admin') {
      return <Dashboard_superadmin />;
    } else {
      return <Dashboard />;
    }
  };

  return (
    <div className="responsive-margin">
      <Suspense fallback={<Spinner />}>
        <Routes>

          <Route path="/back" element={
            <ErrorBoundary>
              <Background />
            </ErrorBoundary>
          } />
          <Route path="/" element={
            <ErrorBoundary>
              <OpeningPage />
            </ErrorBoundary>
          } />
          <Route path="/landingpage" element={
            <ErrorBoundary>
              <LandingPage />
            </ErrorBoundary>
          } />
          <Route path="/landingpage_Ifeelincolor" element={<LandingPage_Ifeelincolor />} />
          <Route path="/organization-login" element={
            <ErrorBoundary>
              <Organization_login />
            </ErrorBoundary>
          } />
          <Route path="/organization-register" element={
            <ErrorBoundary>
              <OrganizationRegister />
            </ErrorBoundary>
          } />
          <Route path="/organization-forget" element={<ForgotPasswordOrganization />} />
          <Route path="/manager-login" element={<LoginManager />} />
          <Route path="/assistant-login" element={<AssistantLogin />} />
          <Route path="/assistant-forget" element={<ForgetPasswordAssistant />} />
          <Route path="/manager-forget" element={<ForgotPasswordManager />} />
          <Route path="/orgadmin-login" element={<LoginOrgAdmin />} />
          <Route path="/orgadmin-forget" element={<ForgotPasswordOrgAdmin />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<LoginAdmin />} />
          <Route path="/forget" element={<ForgetPassword_Admin />} />
          {/* Error Pages */}
          <Route path="/error-pages/error-404" element={<Error404 />} />
          <Route path="/error-pages/error-500" element={<Error500 />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Dashboard OrgManager */}
          <Route path="/dashboard/orgmanager" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Dashboard_OrgManager />
              </ProtectedRoute>
            </ErrorBoundary>
          } />


          {/* Dashboard Superadmin */}
          {/* if u want to add assistant to the dashboard, add it here */}
          <Route path="/dashboard/ifeelincolor" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Dashboard_superadmin />
              </ProtectedRoute>
            </ErrorBoundary>
          } />


          {/* Plan Packages */}
          <Route path="/packages/view" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Packages />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Packages Superadmin */}
          <Route path="/packages/view_superadmin" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Packages_superadmin />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Patient Management */}
          <Route path="/patient-management/view" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <PatientPage />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Clinician */}
          <Route path="/clinician-management/view" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <ClinicianPage />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Clinician Superadmin */}
          <Route path="/clinician-management/view_superadmin" element={<ProtectedRoute>
            <Clinician_superadmin />
          </ProtectedRoute>} />

          {/* Organization */}
          <Route path="/organization-management/view" element={<ProtectedRoute>
            <OrganizationPage />
          </ProtectedRoute>} />

          {/* Managers */}
          <Route path="/managers-management/view" element={<ProtectedRoute>
            <ManagersPage />
          </ProtectedRoute>} />

          {/* Admins */}
          <Route path="/admins-management/view" element={<ProtectedRoute>
            <AdminsPage />
          </ProtectedRoute>} />

          {/* Banners */}
          <Route path="/banner-management/view" element={<ProtectedRoute>
            <BannerOverview />
          </ProtectedRoute>} />

          {/* Budget */}
          <Route path="/subscription-budget-analysis/overview" element={<ProtectedRoute>
            <BudgetAnalysis />
          </ProtectedRoute>} />

          {/* Budget for superadmin */}
          <Route path="/subscription-budget-analysis/overview_superadmin" element={<ProtectedRoute>
            <BudgetOverview_superadmin />
          </ProtectedRoute>} />

          {/* Recommandations */}
          <Route path="/recommendation/overview" element={<ProtectedRoute>
            <Recommandations />
          </ProtectedRoute>} />

          {/*Subscriptions  */}
          <Route path="/subscription-management/portal" element={<ProtectedRoute><PortalSubscriptions /> </ProtectedRoute>} />
          <Route path="/subscription-management/clinician" element={<ProtectedRoute><ClinicianSubscriptions /></ProtectedRoute>} />
          <Route path="/subscription-management/organization" element={<ProtectedRoute><OrganizationSubscriptions /></ProtectedRoute>} />
          <Route path="/subscription-management/organization_portal" element={<ProtectedRoute><Organization_Subscriptions /></ProtectedRoute>} />

          {/* Test Management */}
          <Route path="/test-management/manage" element={<ProtectedRoute><ManageAssessment /></ProtectedRoute>} />
          <Route path="/test-management/mood-assessments" element={<ProtectedRoute><MoodAssessments /></ProtectedRoute>} />
          <Route path="/test-management/body-assessments" element={<ProtectedRoute><BodyAssessments /></ProtectedRoute>} />
          {/* <Route path="/test-management/mood-level-assessments" element={<ProtectedRoute><MoodLevelAssessments /></ProtectedRoute>} /> */}
          <Route path="/test-management/ai-questions" element={<ProtectedRoute><AISuggestedQuestions /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="/settings" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Profile */}
          <Route path="/profile" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/profile_superadmin" element={<ProtectedRoute><Profile_superadmin /></ProtectedRoute>} />
          <Route path="/assistant-management/view" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
          {/* Add more routes as needed */}

          {/* Permissions */}
          <Route path="/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />

          {/* Payment */}
          <Route path="/payment/organization" element={<OrganizationPayment />} />
          <Route path="/payment/stripe" element={<StripePaymentPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;