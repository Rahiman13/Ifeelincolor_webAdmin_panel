import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
// import { Trans } from 'react-i18next';
import Face1 from '../../assets/face1.jpg';
// import Logo from '../../assets/logo.svg'
// import './Sidebar.css';
// Import the Material Design Icons CSS from CDN
import '@mdi/font/css/materialdesignicons.min.css';


const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const location = useLocation();

  const sidebarStyle = {
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Roboto', sans-serif",
    color: '#26d0ce !important',
  };

  const navItemStyle = {
    margin: '5px 8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: '#26d0ce !important',
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 10px',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

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
      { path: '/patient-management/statuses', state: 'patientManagementMenuOpen' },
      { path: '/patient-management/assign-questions', state: 'patientManagementMenuOpen' },
      { path: '/subscription-management/portal', state: 'subscriptionManagementMenuOpen' },
      { path: '/subscription-management/clinician', state: 'subscriptionManagementMenuOpen' },
      { path: '/subscription-management/organization', state: 'subscriptionManagementMenuOpen' },
      { path: '/test-management/create', state: 'testManagementMenuOpen' },
      { path: '/test-management/manage', state: 'testManagementMenuOpen' },
      { path: '/test-management/ai-questions', state: 'testManagementMenuOpen' },
      { path: '/banner-management/upload', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/banner-management/view', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/subscription-budget-analysis/overview', state: 'subscriptionBudgetAnalysisMenuOpen' },
      { path: '/settings', state: 'settingsMenuOpen' },
      { path: '/register', state: 'registerMenuOpen' },

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
    <nav className="sidebar sidebar-offcanvas" id="sidebar" style={sidebarStyle}>
      <ul className="nav" style={{ padding: '0' }}>
        <li className="nav-item nav-profile">
          <Link to="/profile" className="nav-link" >
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
        <li className={isPathActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-view-dashboard menu-icon"></i>
          </Link>
        </li>

        {/* Subscription & Budget Analysis */}
        <li className={isPathActive('/subscription-budget-analysis/overview') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/subscription-budget-analysis/overview">
            <span className="menu-title">Earnigs</span>
            <i className="mdi mdi-chart-line menu-icon"></i>
          </Link>
        </li>

        {/* Patient Management */}
        <li className={isPathActive('/patient-management/view') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/patient-management/view">
            <span className="menu-title">Patient Management</span>
            <i className="mdi mdi-account-multiple menu-icon"></i>

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
        <li className={isPathActive('/subscription-management/portal') || isPathActive('/subscription-management/clinician') || isPathActive('/subscription-management/organization') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.subscriptionManagementMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('subscriptionManagementMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title">Subscriptions</span>
            <i className="mdi mdi-card-account-details menu-icon"></i>
            <i className={`mdi ${menuState.subscriptionManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
          </div>
          <Collapse in={menuState.subscriptionManagementMenuOpen}>
            <ul className="nav flex-column m-0 p-0 sub-menu">
              <li className="nav-item">
                <Link className={isPathActive('/subscription-management/portal') ? 'nav-link active' : 'nav-link'} to="/subscription-management/portal">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Portal</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/subscription-management/clinician') ? 'nav-link active' : 'nav-link'} to="/subscription-management/clinician">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Clinician</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/subscription-management/organization') ? 'nav-link active' : 'nav-link'} to="/subscription-management/organization">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Organization</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Test Management */}
        <li className={isPathActive('/test-management/create') || isPathActive('/test-management/manage') || isPathActive('/test-management/ai-questions') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.testManagementMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('testManagementMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title">Assessment</span>
            <i className="mdi mdi-clipboard-text menu-icon"></i>
            <i className={`mdi ${menuState.testManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
          </div>
          <Collapse in={menuState.testManagementMenuOpen}>
            <ul className="nav flex-column m-0 p-0 sub-menu">
              {/* <li className="nav-item">
                <Link className={isPathActive('/test-management/create') ? 'nav-link active' : 'nav-link'} to="/test-management/create">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Create Test</span>
                </Link>
              </li> */}
              <li className="nav-item">
                <Link className={isPathActive('/test-management/manage') ? 'nav-link active' : 'nav-link'} to="/test-management/manage">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Manage </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/test-management/ai-questions') ? 'nav-link active' : 'nav-link'} to="/test-management/ai-questions">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">ChatBot</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Banner & Announcement Management */}
        {/* <li className={isPathActive('/banner-management/upload') || isPathActive('/banner-management/view') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.bannerAnnouncementManagementMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('bannerAnnouncementManagementMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title">Banner Management</span>
            <i className="mdi mdi mdi-bullhorn menu-icon"></i>
            <i className={`mdi ${menuState.bannerAnnouncementManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
          </div>
          <Collapse in={menuState.bannerAnnouncementManagementMenuOpen}>
            <ul className="nav flex-column m-0 p-0 sub-menu">
              <li className="nav-item">
                <Link className={isPathActive('/banner-management/upload') ? 'nav-link active' : 'nav-link'} to="/banner-management/upload">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">Upload Banner</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isPathActive('/banner-management/view') ? 'nav-link active' : 'nav-link'} to="/banner-management/view">
                  <i className='mdi mdi-arrow-right m-0 p-0 '></i>
                  <span className="menu-title m-0 p-0">View Banners</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li> */}
        <li className={isPathActive('/banner-management/view') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/banner-management/view">
            <span className="menu-title">Banner  Management</span>
            <i className="mdi mdi mdi-bullhorn menu-icon"></i>
          </Link>
        </li>



        {/* Settings */}
        <li className={isPathActive('/settings') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/settings">
            <span className="menu-title">Settings</span>
            <i className="mdi mdi-cogs menu-icon"></i>

          </Link>
        </li>

        {/* Register */}
        {/* <li className={isPathActive('/register') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/register">
            <span className="menu-title">Add Members</span>
            <i className="mdi mdi-account-plus menu-icon"></i>

          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;