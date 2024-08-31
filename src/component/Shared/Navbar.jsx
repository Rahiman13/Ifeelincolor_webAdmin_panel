import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import Face1 from '../../assets/face1.jpg';
import Logo_mini from '../../assets/logo-mini.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure you have this import for toast styles

const Navbar = () => {
  const navigate = useNavigate();

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  };

  const toggleRightSidebar = () => {
    document.querySelector('.right-sidebar').classList.toggle('open');
  };

  const handlePowerClick = () => {
    toast.success('Logout Successful');
    setTimeout(() => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('OrganizationId');
      navigate('/dist/');
    }, 2000)
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/dist/dashboard">
          <img src={Logo} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/">
          <img src={Logo_mini} alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle('sidebar-icon-only')}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile">
            <Link className="nav-link" to="/dist/profile">
              <div className="nav-profile-img">
                <img src={Face1} alt="user" />
                <span className="availability-status online"></span>
              </div>
              <div className="nav-profile-text">
                <p className="mb-1 text-black">Ram</p>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Dropdown>
              <Dropdown.Toggle className="nav-link count-indicator">
                <i className="mdi mdi-bell-outline"></i>
                <span className="count-symbol bg-danger"></span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
                <h6 className="p-3 mb-0">Admin Notifications</h6>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-success">
                      <i className="mdi mdi-calendar"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">New Patient Registered</h6>
                    <p className="text-gray ellipsis mb-0">Just now</p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-warning">
                      <i className="mdi mdi-cog"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">Server Maintenance</h6>
                    <p className="text-gray ellipsis mb-0">Scheduled for tonight</p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-info">
                      <i className="mdi mdi-alert-circle-outline"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">Subscription Expiring</h6>
                    <p className="text-gray ellipsis mb-0">Your subscription ends in 3 days</p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <h6 className="p-3 mb-0 text-center cursor-pointer">See all notifications</h6>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item nav-logout d-none d-lg-block">
            <div className="nav-link cursor-pointer" onClick={handlePowerClick}>
              <i className="mdi mdi-power"></i>
            </div>
          </li>
        </ul>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
