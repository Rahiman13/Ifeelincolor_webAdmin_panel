import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
// import { Trans } from 'react-i18next';
import Face1 from '../../assets/face1.jpg';
// import Logo from '../../assets/logo.svg'
// import './Sidebar.css';
// Import the Material Design Icons CSS from CDN
import '@mdi/font/css/materialdesignicons.min.css';
import Icon from '@mdi/react';
import { mdiDoctor } from '@mdi/js';


const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const location = useLocation();

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
      { path: '/dist/dashboard', state: 'dashboardMenuOpen' },
      { path: '/dist/patient-management/view', state: 'patientManagementMenuOpen' },
      { path: '/dist/clinicians/view', state: 'clinicianMenuOpen' },
      // { path: '/dist/patient-management/statuses', state: 'patientManagementMenuOpen' },
      // { path: '/dist/patient-management/assign-questions', state: 'patientManagementMenuOpen' },
      // { path: '/dist/subscription-management/portal', state: 'subscriptionManagementMenuOpen' },
      { path: '/dist/subscription-management/clinician', state: 'subscriptionManagementMenuOpen' },
      // { path: '/dist/subscription-management/organization', state: 'subscriptionManagementMenuOpen' },
      // { path: '/dist/test-management/create', state: 'testManagementMenuOpen' },
      // { path: '/dist/test-management/manage', state: 'testManagementMenuOpen' },
      // { path: '/dist/test-management/ai-questions', state: 'testManagementMenuOpen' },
      // { path: '/dist/banner-management/upload', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/dist/banner-management/view', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/dist/subscription-budget-analysis/overview', state: 'subscriptionBudgetAnalysisMenuOpen' },
      // { path: '/dist/settings', state: 'settingsMenuOpen' },
      // { path: '/dist/register', state: 'registerMenuOpen' },

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

      // Cleanup event listeners on component unmount
      return () => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, []);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <Link to="/dist/profile" className="nav-link" >
            <div className="nav-profile-image">
              <img src={Face1} alt="profile" />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">Ram</span>
              <span className=" text-medium">Super Admin</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </Link>
        </li>
        <li className={isPathActive('/dist/dashboard') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-view-dashboard menu-icon"></i>
          </Link>
        </li>

        {/* Subscription & Budget Analysis */}
        <li className={isPathActive('/dist/subscription-budget-analysis/overview') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/subscription-budget-analysis/overview">
            <span className="menu-title">Budget Analysis</span>
            <i className="mdi mdi-chart-line menu-icon"></i>
          </Link>
        </li>

        {/* Patient Management */}
        <li className={isPathActive('/dist/patient-management/view') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/patient-management/view">
            <span className="menu-title">Patient Management</span>
            <i className="mdi mdi-account-multiple menu-icon"></i>

          </Link>
        </li>

        {/* Clinicians */}
        <li className={isPathActive('/dist/clinicians/view') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/clinicians/view">
            <span className="menu-title">Clinicians</span>
            {/* <Icon path={mdiDoctor} size={1} /> */}
            <i className="mdi mdi-doctor menu-icon"></i>

          </Link>
        </li>
        {/* <li className={isPathActive('/patient-management/view') || isPathActive('/patient-management/statuses') || isPathActive('/patient-management/assign-questions') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.patientManagementMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('patientManagementMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title">Patient Management</span>
            <i className="mdi mdi-account-multiple menu-icon"></i>
            <i className={`mdi ${menuState.patientManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'} `}></i>
          </div>
          <Collapse in={menuState.patientManagementMenuOpen}>
            <ul className="nav flex-column m-0 p-0 sub-menu">
              <li className="nav-item m-0 p-0">
                <Link className={isPathActive('/patient-management/view') ? 'nav-link active' : 'nav-link'} to="/patient-management/view">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Patient Data</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/patient-management/statuses') ? 'nav-link active' : 'nav-link'} to="/patient-management/statuses">
                  <i className='mdi mdi-arrow-right m-0 p-0'></i>
                  <span className="menu-title m-0 p-0">Patient Statuses</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/patient-management/assign-questions') ? 'nav-link active' : 'nav-link'} to="/patient-management/assign-questions">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Assign Questions</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li> */}

        {/* Subscription Management */}
        <li className={isPathActive('/dist/subscription-management/clinician') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/subscription-management/clinician">
            <span className="menu-title">Subscrption Management</span>
            <i className="mdi mdi-card-account-details menu-icon"></i>
          </Link>
        </li>



        {/* Banner & Announcement Management */}
        <li className={isPathActive('/dist/banner-management/view') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/banner-management/view">
            <span className="menu-title">Banner  Management</span>
            <i className="mdi mdi mdi-bullhorn menu-icon"></i>
          </Link>
        </li>



        {/* Settings */}
        {/* <li className={isPathActive('/dist/settings') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/settings">
            <span className="menu-title">Settings</span>
            <i className="mdi mdi-cogs menu-icon"></i>
          </Link>
        </li> */}

        {/* Register */}
        <li className={isPathActive('/dist/register') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dist/register">
            <span className="menu-title">Add Members</span>
            <i className="mdi mdi-account-plus menu-icon"></i>

          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
