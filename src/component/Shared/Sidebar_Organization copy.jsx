import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Face1 from '../../assets/face1.jpg';
import '@mdi/font/css/materialdesignicons.min.css';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: #fff;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  min-height: 100vh;
  padding: 20px 0;
  transition: all 0.3s;

  @media (max-width: 991px) {
    position: fixed;
    z-index: 999;
    width: 260px;
    left: ${props => props.isOpen ? '0' : '-260px'};
  }
`;

const Logo = styled.div`
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const NavItem = styled.li`
  margin: 5px 0;
  width: 100%;
`;

const NavLink = styled(Link)`
  color: rgba(255,255,255,0.8);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  width: 100%;
  text-decoration: none;

  &:hover {
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    color: #fff;
  }

  &.active {
    background: linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    color: #fff;
    font-weight: bold;
  }

  i {
    margin-right: 15px;
    font-size: 18px;
    width: 20px;
    text-align: center;
  }
`;

const ProfileLink = styled(NavLink)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    border: 2px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
  }

  &:hover img {
    border-color: rgba(255,255,255,0.4);
  }

  div {
    text-align: left;
  }
`;

const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const role = sessionStorage.getItem('role') || '';

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
      { path: '/packages/view', state: 'PlanManagementMenuOpen' },
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
    return location.pathname === path;
  };

  useEffect(() => {
    onRouteChanged();
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {isSidebarOpen && window.innerWidth <= 991 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
          onClick={toggleSidebar}
        />
      )}
      <SidebarContainer className="sidebar sidebar-offcanvas" id="sidebar" isOpen={isSidebarOpen}>
        {/* <Logo>Organization Name</Logo> */}
        <NavList>                                                                                                                                                                                                                                                                            
          <NavItem>
            <ProfileLink to="/profile" className={isPathActive('/profile') ? 'active' : ''}>
              <img src={Face1} alt="profile" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Ram</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Role not found'}
                </div>
              </div>
            </ProfileLink>
          </NavItem>

          <NavItem>
            <NavLink to="/dashboard" className={isPathActive('/dashboard') ? 'active' : ''}>
              <i className="mdi mdi-view-dashboard"></i>
              <span>Dashboard</span>
            </NavLink>
          </NavItem>

          {(role === 'organization' || role === 'orgadmin') && (
            <NavItem>
              <NavLink to="/subscription-budget-analysis/overview" className={isPathActive('/subscription-budget-analysis/overview') ? 'active' : ''}>
                <i className="mdi mdi-chart-line"></i>
                <span>Earnings</span>
              </NavLink>
            </NavItem>
          )}

          {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
            <NavItem>
              <NavLink to="/subscription-management/clinician" className={isPathActive('/subscription-management/clinician') ? 'active' : ''}>
                <i className="mdi mdi-card-account-details"></i>
                <span>Subscriptions</span>
              </NavLink>
            </NavItem>
          )}

          {role === 'organization' && (
            <NavItem>
              <NavLink to="/packages/view" className={isPathActive('/packages/view') ? 'active' : ''}>
                <i className="mdi mdi-clipboard-list-outline"></i>
                <span>Plan Management</span>
              </NavLink>
            </NavItem>
          )}

          {(role === 'organization' || role === 'orgadmin') && (
            <NavItem>
              <NavLink to="/managers-management/view" className={isPathActive('/managers-management/view') ? 'active' : ''}>
                <i className="mdi mdi-account-tie"></i>
                <span>Managers Management</span>
              </NavLink>
            </NavItem>
          )}

          {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
            <NavItem>
              <NavLink to="/clinician-management/view" className={isPathActive('/clinician-management/view') ? 'active' : ''}>
                <i className="mdi mdi-doctor"></i>
                <span>Clinician Management</span>
              </NavLink>
            </NavItem>
          )}
        </NavList>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;