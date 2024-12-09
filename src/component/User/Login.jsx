import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import Face1 from '../../assets/face1.jpg';
import '@mdi/font/css/materialdesignicons.min.css';

const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const location = useLocation();

  // Retrieve the user role from session storage
  const role = sessionStorage.getItem('role') || ''; // Fallback if not logged in

  const toggleMenuState = (menuStateKey) => {
    setMenuState((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [menuStateKey]: !prevState[menuStateKey],
    }));
  };

  const onRouteChanged = () => {
    document.querySelector('#sidebar').classList.remove('active');
    setMenuState({});

    const dropdownPaths = [
      { path: '/dashboard', state: 'dashboardMenuOpen' },
      { path: '/patient-management/view', state: 'patientManagementMenuOpen' },
      { path: '/clinicians/view', state: 'clinicianMenuOpen' },
      { path: '/subscription-management/clinician', state: 'subscriptionManagementMenuOpen' },
      { path: '/banner-management/view', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/subscription-budget-analysis/overview', state: 'subscriptionBudgetAnalysisMenuOpen' },
    ];

    dropdownPaths.forEach((obj) => {
      if (isPathActive(obj.path)) {
        setMenuState((prevState) => ({
          ...prevState,
          [obj.state]: true,
        }));
      }
    });
  };

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    onRouteChanged();
    const body = document.querySelector('body');
    const sidebarItems = document.querySelectorAll('.sidebar .nav-item');

    sidebarItems.forEach((el) => {
      const handleMouseOver = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      };

      const handleMouseOut = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      };

      el.addEventListener('mouseover', handleMouseOver);
      el.addEventListener('mouseout', handleMouseOut);

      return () => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, [location]);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/* Profile Section */}
        <li className="nav-item nav-profile">
          <Link to="/profile" className="nav-link">
            <div className="nav-profile-image">
              <img src={Face1} alt="profile" />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">Ram</span>
              <span className="text-medium">
                {role
                  ? role.charAt(0).toUpperCase() + role.slice(1)
                  : 'Role not found'}
              </span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </Link>
        </li>

        {/* Common for all roles: Dashboard */}
        <li className={isPathActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-view-dashboard menu-icon"></i>
          </Link>
        </li>

        {/* Conditionally rendered based on user role */}
        {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
          <>
            <li className={isPathActive('/patient-management/view') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/patient-management/view">
                <span className="menu-title">Patient Management</span>
                <i className="mdi mdi-account-multiple menu-icon"></i>
              </Link>
            </li>

            <li className={isPathActive('/clinician-management/view') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/clinician-management/view">
                <span className="menu-title">Clinician Management</span>
                <i className="mdi mdi-doctor menu-icon"></i>
              </Link>
            </li>
          </>
        )}

        {(role === 'organization' || role === 'orgadmin') && (
          <>
            <li className={isPathActive('/subscription-budget-analysis/overview') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/subscription-budget-analysis/overview">
                <span className="menu-title">Budget Analysis</span>
                <i className="mdi mdi-chart-line menu-icon"></i>
              </Link>
            </li>

            <li className={isPathActive('/managers-management/view') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/managers-management/view">
                <span className="menu-title">Managers Management</span>
                <i className="mdi mdi-account-tie menu-icon"></i>
              </Link>
            </li>
          </>
        )}

        {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
          <li className={isPathActive('/subscription-management/clinician') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/subscription-management/clinician">
              <span className="menu-title">Subscriptions</span>
              <i className="mdi mdi-card-account-details menu-icon"></i>
            </Link>
          </li>
        )}

        {role === 'organization' && (
          <>
            <li className={isPathActive('/admins-management/view') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/admins-management/view">
                <span className="menu-title">Admins Management</span>
                <i className="mdi mdi-shield-account menu-icon"></i>
              </Link>
            </li>

            <li className={isPathActive('/banner-management/view') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/banner-management/view">
                <span className="menu-title">Banner Management</span>
                <i className="mdi mdi-bullhorn menu-icon"></i>
              </Link>
            </li>

            <li className={isPathActive('/register') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/register">
                <span className="menu-title">Add Members</span>
                <i className="mdi mdi-account-plus menu-icon"></i>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
