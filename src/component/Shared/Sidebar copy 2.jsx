import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import '@mdi/font/css/materialdesignicons.min.css';
import Face1 from '../../assets/face1.jpg'; // Import profile image
import axios from 'axios';
import { MdAccountCircle } from 'react-icons/md';

const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const [orgDetails, setOrgDetails] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [assistantProfile, setAssistantProfile] = useState(null);
  const location = useLocation();

  // Get the user role, token and adminPortal from session storage
  const role = sessionStorage.getItem('role') || '';
  const token = sessionStorage.getItem('token') || '';
  const adminPortal = sessionStorage.getItem('adminPortal') || '';

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (adminPortal === 'true' && token && role === 'Admin') {
        try {
          const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setAdminProfile(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error);
        }
      } else if (role === 'organization' && token) {
        try {
          const response = await axios.get('https://rough-1-gcic.onrender.com/api/organization/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setOrgDetails(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching organization details:', error);
        }
      } else if (role === 'assistant' && token) {
        try {
          const response = await axios.get('https://rough-1-gcic.onrender.com/api/assistant/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setAssistantProfile(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching assistant profile:', error);
        }
      }
    };

    fetchProfileDetails();
  }, [role, token, adminPortal]);

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
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
  };

  const navItemHoverStyle = {
    backgroundColor: 'transparent !important',
    color: '#26d0ce !important',
  };

  const navLinkHoverStyle = {
    color: '#26d0ce',
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  };

  const menuIconStyle = {
    fontSize: '22px',
    marginRight: '12px',
    color: '#26d0ce',
  };

  const subMenuIconStyle = {
    fontSize: '22px',
    marginRight: '12px',
    color: '#fff',
  };

  const profileSectionStyle = {
    padding: '20px 15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
    color: '#26d0ce !important',
  };

  const profileContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    padding: '0',
    textDecoration: 'none',
  };

  const profileImageContainerStyle = {
    position: 'relative',
    flexShrink: 0,
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  };

  const avatarIconStyle = {
    fontSize: '2.5rem',
    color: '#26d0ce',
  };

  const userDetailsStyle = {
    flex: 1,
    minWidth: 0,
  };

  const userNameStyle = {
    display: 'block',
    fontWeight: '500',
    fontSize: '14px',
    marginBottom: '4px',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const userRoleStyle = {
    display: 'block',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const onlineStatusStyle = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    backgroundColor: '#2ecc71',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px rgba(46, 204, 113, 0.3)'
  };

  const menuItemStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  };

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

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
      { path: '/dashboard/ifeelincolor', state: 'dashboardMenuOpen' },
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
      { path: '/subscription-budget-analysis/overview_superadmin', state: 'subscriptionBudgetAnalysisMenuOpen' },
      { path: '/settings', state: 'settingsMenuOpen' },
      { path: '/register', state: 'registerMenuOpen' },
      { path: '/profile_superadmin', state: 'profileMenuOpen' },
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

  const collapsedMenuStyle = {
    position: 'absolute',
    left: '100%',
    top: '0',
    minWidth: '250px',
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 4px 4px 0',
    zIndex: 1000,
    padding: '8px 0',
  };

  useEffect(() => {
    onRouteChanged();
    const body = document.querySelector('body');
    const sidebarItems = document.querySelectorAll('.sidebar .nav-item');

    sidebarItems.forEach((el) => {
      const handleMouseOver = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');

          const navLink = el.querySelector('.nav-link');
          if (navLink) {
            navLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            navLink.style.borderRadius = '4px';
          }

          const collapseMenu = el.querySelector('.collapse');
          if (collapseMenu) {
            Object.assign(collapseMenu.style, {
              display: 'block',
              position: 'absolute',
              left: '100%',
              top: '0',
              minWidth: '250px',
              background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
              boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '0 4px 4px 0',
              zIndex: '1000',
              padding: '8px 0',
            });

            const subMenuItems = collapseMenu.querySelectorAll('.nav-item');
            subMenuItems.forEach(item => {
              Object.assign(item.style, {
                margin: '5px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              });

              const subNavLink = item.querySelector('.nav-link');
              if (subNavLink) {
                Object.assign(subNavLink.style, {
                  padding: '10px 15px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                });
              }
            });
          }
        }
      };

      const handleMouseOut = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');

          const navLink = el.querySelector('.nav-link');
          if (navLink) {
            navLink.style.backgroundColor = '';
          }

          const collapseMenu = el.querySelector('.collapse');
          if (collapseMenu) {
            collapseMenu.style.display = '';
            collapseMenu.style.position = '';
          }
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
    <nav className="sidebar sidebar-offcanvas" id="sidebar" style={sidebarStyle}>
      <ul className="nav" style={{ padding: '0' }}>
        <li className="nav-item nav-profile" style={profileSectionStyle}>
          <Link
            to="/profile_superadmin"
            className="nav-link"
            style={profileContentStyle}
          >
            <div style={profileImageContainerStyle}>
              {adminProfile?.image ? (
                <img
                  src={adminProfile.image}
                  alt="profile"
                  style={profileImageStyle}
                />
              ) : assistantProfile?.image ? (
                <img
                  src={assistantProfile.image}
                  alt="profile"
                  style={profileImageStyle}
                />
              ) : (
                <MdAccountCircle style={avatarIconStyle} />
              )}
            </div>
            <div style={userDetailsStyle}>
              <span style={userNameStyle}>
                {adminProfile?.name || assistantProfile?.name || 'Loading...'}
              </span>
              <span style={userRoleStyle}>
                {adminProfile?.email || assistantProfile?.email || 'Loading...'}
              </span>
            </div>
          </Link>
        </li>

        {/* Dashboard */}
        <li
          className="nav-item"
          style={isPathActive('/dashboard/ifeelincolor') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/dashboard/ifeelincolor"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-view-dashboard" style={menuIconStyle}></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>

        {/* Earnings */}
        <li className="nav-item" style={isPathActive('/subscription-budget-analysis/overview_superadmin') ? activeNavItemStyle : navItemStyle}>
          <Link
            className="nav-link"
            to="/subscription-budget-analysis/overview_superadmin"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-chart-line" style={menuIconStyle}></i>
            <span className="menu-title">Earnings</span>
          </Link>
        </li>

        {/* Patients */}
        <li
          className="nav-item"
          style={isPathActive('/patient-management/view') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/patient-management/view"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-account-multiple" style={menuIconStyle}></i>
            <span className="menu-title">Patient Management</span>
          </Link>
        </li>

        {/* Clinician */}
        <li
          className="nav-item"
          style={isPathActive('/clinician-management/view') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/clinician-management/view"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.transform = navItemHoverStyle.transform;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-doctor" style={menuIconStyle}></i>
            <span className="menu-title">Clinician</span>
          </Link>
        </li>

        {/* Organization */}
        <li
          className="nav-item"
          style={isPathActive('/organization-management/view') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/organization-management/view"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.transform = navItemHoverStyle.transform;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-office-building" style={menuIconStyle}></i>
            <span className="menu-title">Organization</span>
          </Link>
        </li>

        {/* Assistant */}
        {sessionStorage.getItem('role') !== 'assistant' && (
          <li
            className="nav-item"
            style={isPathActive('/assistant-management/view') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/assistant-management/view"
              style={navLinkStyle}
            >
              <i className="mdi mdi-account-tie" style={menuIconStyle}></i>
              <span className="menu-title">Assistant</span>
            </Link>
          </li>
        )}

        {/* Create Assistant pages for CRUD operations has permission only for superadmin*/}
        {/* Create Organization registrations page */}

        {/* Portal Plan */}
        <li
          className="nav-item"
          style={isPathActive('/packages/view') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/packages/view"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.transform = navItemHoverStyle.transform;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-clipboard-list-outline" style={menuIconStyle}></i>
            <span className="menu-title">Plan Management</span>
          </Link>
        </li>

        {/* Recommandations */}
        <li
          className="nav-item"
          style={isPathActive('/recommendation/overview') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/recommendation/overview"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.transform = navItemHoverStyle.transform;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-lightbulb-on" style={menuIconStyle}></i>
            <span className="menu-title">Recommendations</span>
          </Link>
        </li>

        {/* Subscriptions dropdown */}
        <li className="nav-item" style={isPathActive('/subscription-management/portal') || isPathActive('/subscription-management/clinician') || isPathActive('/subscription-management/organization') ? activeNavItemStyle : navItemStyle}>
          <div
            className={`nav-link ${menuState.subscriptionManagementMenuOpen ? 'menu-expanded' : ''}`}
            onClick={() => toggleMenuState('subscriptionManagementMenuOpen')}
            data-toggle="collapse"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-card-account-details " style={menuIconStyle}></i>
            <span className="menu-title">Subscriptions</span>
            <i className={`mdi ${menuState.subscriptionManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`} style={{ display: 'flex', justifyContent: 'flex-end' }}></i>
          </div>
          <Collapse in={menuState.subscriptionManagementMenuOpen}>
            <ul className="nav flex-column sub-menu" style={{
              margin: '0',
              padding: '0',
              background: 'transparent',
              listStyle: 'none',
            }}>
              <li className="nav-item" style={{
                ...navItemStyle,
                margin: '5px 8px',
              }}>
                <Link
                  className="nav-link"
                  to="/subscription-management/portal"
                  style={{
                    ...navLinkStyle,
                    padding: '10px 15px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right' style={{
                    ...subMenuIconStyle,
                    fontSize: '16px',
                  }}></i>
                  <span>Portal</span>
                </Link>
              </li>
              <li className="nav-item" style={{
                ...navItemStyle,
                margin: '5px 8px',
              }}>
                <Link
                  className="nav-link"
                  to="/subscription-management/clinician"
                  style={{
                    ...navLinkStyle,
                    padding: '8px 15px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right' style={{
                    // ...menuIconStyle,
                  ...subMenuIconStyle,
                    fontSize: '16px',
                  }}></i>
                  <span>Clinician</span>
                </Link>
              </li>
              <li className="nav-item" style={{
                ...navItemStyle,
                margin: '5px 8px',
              }}>
                <Link
                  className="nav-link"
                  to="/subscription-management/organization"
                  style={{
                    ...navLinkStyle,
                    padding: '8px 15px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right fs-6' style={{
                  ...subMenuIconStyle,
                    fontSize: '16px',
                    width: '20px',
                  }}></i>
                  <span className=" m-0 p-0">Organization</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>


        {/* Assessment */}
        <li className="nav-item" style={isPathActive('/test-management/create') || isPathActive('/test-management/manage') || isPathActive('/test-management/ai-questions') || isPathActive('/test-management/mood-assessments') || isPathActive('/test-management/body-assessments') || isPathActive('/test-management/mood-level-assessments') ? activeNavItemStyle : navItemStyle}>
          <div
            className={`nav-link ${menuState.testManagementMenuOpen ? 'menu-expanded' : ''}`}
            onClick={() => toggleMenuState('testManagementMenuOpen')}
            data-toggle="collapse"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-clipboard-text" style={menuIconStyle}></i>
            <span className="menu-title">Assessment</span>
            <i className={`mdi ${menuState.testManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`} />
          </div>
          <Collapse in={menuState.testManagementMenuOpen}>
            <ul className="nav flex-column m-0 p-0 sub-menu">
              {/* <li className="nav-item" style={navItemStyle}>
                <Link className={isPathActive('/test-management/manage') ? 'nav-link active' : 'nav-link'} to="/test-management/manage"
                  style={navLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                  <span className="menu-title m-0 p-0">Manage</span>
                </Link>
              </li> */}
              <li className="nav-item" style={navItemStyle}>
                <Link className={isPathActive('/test-management/mood-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/mood-assessments"
                  style={navLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                  <span className=" m-0 p-0">Mood Assessments</span>
                </Link>
              </li>
              <li className="nav-item" style={navItemStyle}>
                <Link className={isPathActive('/test-management/body-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/body-assessments"
                  style={navLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                  <span className=" m-0 p-0">Body Assessments</span>
                </Link>
              </li>
              {/* <li className="nav-item" style={navItemStyle}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => renderTooltip(props, "Mood Level Assessments")}
                >
                  <Link className={isPathActive('/test-management/mood-level-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/mood-level-assessments"
                    style={{...navLinkStyle, ...menuItemStyle}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                      e.currentTarget.style.color = navLinkHoverStyle.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = navLinkStyle.color;
                    }}
                  >
                    <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                    <span className="menu-title m-0 p-0">Mood Level Assessments</span>
                  </Link>
                </OverlayTrigger>
              </li> */}
              <li className="nav-item" style={navItemStyle}>
                <Link className={isPathActive('/test-management/ai-questions') ? 'nav-link active' : 'nav-link'} to="/test-management/ai-questions"
                  style={navLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                    e.currentTarget.style.color = navLinkHoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = navLinkStyle.color;
                  }}
                >
                  <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                  <span className=" m-0 p-0">ChatBot</span>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>

        <li
          className="nav-item"
          style={isPathActive('/banner-management/view') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to="/banner-management/view"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-bullhorn" style={menuIconStyle}></i>
            {/* <span className="menu-title">Banner Management</span> */}
            <span className="menu-title">Announcements</span>
          </Link>
        </li>

        {/* Permissions */}
        {sessionStorage.getItem('role') === 'Admin' && (
          <li
            className="nav-item"
            style={isPathActive('/permissions') ? activeNavItemStyle : navItemStyle}
          >
            <Link className="nav-link" to="/permissions"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-shield-account" style={menuIconStyle}></i>
              <span className="menu-title">Permissions</span>
            </Link>
          </li>
        )}

        {/* <li className="nav-item" style={isPathActive('/settings') ? activeNavItemStyle : navItemStyle}
        >
          <Link className="nav-link" to="/settings"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-cogs" style={menuIconStyle}></i>
            <span className="menu-title">Settings</span>
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;