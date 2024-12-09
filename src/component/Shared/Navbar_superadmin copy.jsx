import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import Face1 from '../../assets/face1.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Add this import
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';

const dummyAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAACUCAMAAAD79nauAAAAZlBMVEX///8AAAD8/Pzh4eHExMT19fXn5+f5+fnu7u6pqamHh4d5eXmsrKxHR0fr6+tfX18fHx/R0dE+Pj6bm5tubm62trYsLCzLy8syMjJzc3MXFxfX19cRERE5OTlmZmZZWVmTk5NOTk7ac85mAAAEZklEQVR4nO2cibaiMAyGWWUp+yaiV+H9X3LUGc9VxNIoaeIcvifIf9qkaZrUMFZWVjSSOEEodmeECKPcojYHjleLoWg680bWxtWW2igY+5M5RRO41JYpkwyTEq44XyIjb15rME1hU9ungO9I1uFCzN41/LKSrsOF1qG2Uk4wswp/yTivhXtUkXBhQ23qS+zpuDrFgWuM8nfKGs4xitraaawAoOF8XlDbO0nSgkTELDdUDdJgHkpqgyewUpgIM2W4FBZQg5nV1CY/40FFmCG1yc/4YBEnfpngBiyi4xdl4SLMiNrmJ94Q0XvURo+B+4QpfGqjx4BDLEfPfkNE8T+IaPbURo+xYPnfhYyfCPUbEV8RhgCL+GHnE0YJFhHzE+GARaT8ygU2WAS/w+6NvINf2mEkBUzCgWECaPgVUETH8WoHDU9FTm3yBNDwVCXUFk+wBYroqQ2eYg/LnjhWO84xFlZ5OvE76s74IUhERW3vNKDw1AXU5k4TQUS0/LK/K9sfgIiY2toXbJRfu0y2LmEYEM/mV/77R9DNG3+DbbuKPShrOFHb+hr1RJbxS3aeKWrIqC2VoZp5sMybbuzVNBT8btf3qJXQGF5M71GqeTCs1TyikAUeWHvEBX+YFdFT2zjPbJhNeXv1FSuSq2g4FjmecMODTATjs/oeR9YF2FNbp4gjK3uwTcFH/B8iZNvpW0TUsvD0JX4tv2oL7inHFX/mBTL9gg3lzVYLGvapk6FStuHYw/iLpfj6OOzZFjuMTa+m4bIYTKuYSRQrazjfUCOGMrwI+PBonkpm0dYNUkD178YQMpKRiB9p9v2a9shiU1leDXyFH9EEPm2ospIc9sY1TepsyDokkm0AiUcymt4h2Vf7oHrTEaY5lY7mbWXVYqlF+KXdBToLIVGsWv6G0cWlLueA95hB0JEdWvvl99GILfZqeAHORnogxO2/mb/yLEKKGm/1aDirQFwLXJe+B7HJcdHTTQ5afgvqQPkQtOFUeE/7ByDlIC6ki+ZjkFr6t7OD+0uCdHLPPAEtzA5HRKkxOKG1sOgVkeKIkJbsFwcpxsp/RlkapNYJT2uIxTqyIY2Kn9IhadCY/2E+FWsUgXejAP4I8QGY80a64hPqMKQur0Ct3Gi6YyNPauMXbEwN76uwb3feA78ZHn9DFfiFZR/73D7oGNPO4TPwIPQ0zeLGWV1f3GA6t9D1Y5Kl3jkABbcK+8BcO9DbxDr/Xkig7QNqaB4MtjECrfb/Jm3oH2fzZPp70hZX0VD01SXL7qiCpk8TOPYrZ6D6E8aC/5ryiopwHqFephTV0X6nly9xYBTUg1LJ51tKMBgLcT57BWt5/DX+0WJUNpcWWcD47whWTfxO8UY3Zsuu3zpKgW8wQ89wVs2tBeA97BiwaCZ9xnV6xdXY1Yzaesd4+3qYVZCVOcON9IBrB9JcROQul6A6gyOKJuvuXeTQZU17DBjvokk2TtSHojoejzsRlrVj8/unbWVlZWVlZWUFwh8O4UAQnNBllQAAAABJRU5ErkJggg=='; // Path to your dummy avatar image

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [orgName, setOrgName] = useState('');
  const [orgImage, setOrgImage] = useState('');
  const [notifications, setNotifications] = useState([]); // Add state for notifications
  const [showAllNotifications, setShowAllNotifications] = useState(false); // State to toggle between showing all notifications or just the latest 5
  const [userInfo, setUserInfo] = useState(null);

  const toggleOffcanvas = () => {
    const sidebar = document.querySelector('.sidebar-offcanvas');
    if (sidebar) {
      sidebar.classList.toggle('active');
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handlePowerClick = () => {
    toast.success('Logout Successful');
    setTimeout(() => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('OrganizationId');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('adminPortal');
      navigate('/');
    }, 2000);
  };

  const fetchNotifications = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    let apiUrl = '';
    
    // Determine the API URL based on the user role
    if (role === 'organization') {
      apiUrl = 'https://rough-1-gcic.onrender.com/api/organization/notifications';
    } else if (role === 'manager') {
      apiUrl = 'https://rough-1-gcic.onrender.com/api/manager/notifications';
    } else if (role === 'Admin') {
      apiUrl = 'https://rough-1-gcic.onrender.com/api/admin/notifications';
    } else if (role === 'assistant') {
      apiUrl = 'https://rough-1-gcic.onrender.com/api/assistant/notifications';
    }

    if (token) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setNotifications(data.body); // Set notifications state
          }
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsSidebarOpen(false);
      }
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar and reset icon when route changes
    const sidebar = document.querySelector('.sidebar-offcanvas');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      setIsSidebarOpen(false);
    }
  }, [location]);

  const fetchUserDetails = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (token) {
      try {
        let apiUrl = '';
        if (isAdminPortal && role === 'Admin') {
          apiUrl = 'https://rough-1-gcic.onrender.com/api/admin/profile';
        } else if (isAdminPortal && role === 'assistant') {
          apiUrl = 'https://rough-1-gcic.onrender.com/api/assistant/profile';
        } else if (role === 'organization') {
          apiUrl = 'https://rough-1-gcic.onrender.com/api/organization/me';
        } else if (role === 'manager') {
          apiUrl = 'https://rough-1-gcic.onrender.com/api/manager/info';
        }

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            if (isAdminPortal && role === 'Admin') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (isAdminPortal && role === 'assistant') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (role === 'organization') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (role === 'manager') {
              setUserInfo(data.body);
              setOrgName(data.body.manager.name);
              setOrgImage(data.body.organization.image);
            }
          }
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Updated modern styles
  const navbarStyle = {
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'all 0.3s ease',
  };

  const brandWrapperStyle = {
    background: 'linear-gradient(135deg, #2A2D34 0%, #2A2D34 100%)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    // borderRadius: '8px',
    margin: '10px',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '265px',
    minWidth: '265px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  };

  const brandWrapperContainerStyle = {
    width: '255px',
    minWidth: '255px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
  };

  const brandTextStyle = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
    padding: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    WebkitTextFillColor: '#ffffff',
  };

  const notificationButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '50%',
    padding: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    }
  };

  const profileContainerStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '4px 12px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
    }
  };

  const profileImageStyle = {
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-column flex-md-row" style={navbarStyle}>
      <div className="text-center navbar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center" 
        style={brandWrapperContainerStyle}
      >
        <div style={brandWrapperStyle}>
          <span className="navbar-brand brand-logo" style={brandTextStyle}>
            IFEELINCOLOR
          </span>
        </div>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch justify-content-between flex-grow-1">
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={toggleOffcanvas}
            style={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)', border: 'none' }}
          >
            <span className={`mdi ${isSidebarOpen ? 'mdi-close' : 'mdi-menu'}`}></span>
          </button>
          <button
            className="navbar-toggler navbar-toggler align-items-center d-none d-lg-flex"
            type="button"
            onClick={() => document.body.classList.toggle('sidebar-icon-only')}
            style={{ color: 'white',  border: 'none' }}
          >
            <span className="mdi mdi-menu"></span>
          </button>
        </div>

        <ul className="navbar-nav navbar-nav-right d-flex align-items-center">
          <li className="nav-item">
            <Dropdown>
              <Dropdown.Toggle 
                className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent" 
                style={{ ...notificationButtonStyle, border: 'none' }}
              >
                <i className="mdi mdi-bell-outline" style={{ fontSize: '24px', color: 'white' }}></i>
                {notifications.length > 0 && (
                  <span className="count-symbol bg-danger" 
                    style={{ 
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      padding: '4px',
                      borderRadius: '50%',
                      border: '2px solid #1a2980'
                    }}
                  ></span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <h6 className="p-3 mb-0" style={{ fontWeight: 'bold', color: '#333' }}>Admin Notifications</h6>
                <div className="dropdown-divider"></div>
                {(showAllNotifications ? notifications : notifications.slice(0, 5)).map(notification => ( // Show all or latest 5 notifications
                  <Dropdown.Item key={notification._id} className="dropdown-item preview-item" style={{ padding: '10px 15px', borderRadius: '5px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-info">
                        <i className="mdi mdi-alert-circle-outline"></i>
                      </div>
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject font-weight-normal mb-1" style={{ fontWeight: '600', color: '#333' }}>{notification.message}</h6>
                      <p className="text-gray ellipsis mb-0" style={{ fontSize: '12px', color: '#777' }}>{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  </Dropdown.Item>
                ))}
                <div className="dropdown-divider"></div>
                <h6 className="p-3 mb-0 text-center cursor-pointer" style={{ color: '#007bff' }} onClick={() => setShowAllNotifications(!showAllNotifications)}>
                  {showAllNotifications ? 'Show less notifications' : 'See all notifications'}
                </h6>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item nav-profile ms-3">
            <Dropdown>
              <Dropdown.Toggle 
                as={Link} 
                className="nav-link p-0" 
                style={{ ...profileContainerStyle, textDecoration: 'none' }}
              >
                <div className="d-flex align-items-center">
                  <div className="nav-profile-img me-2">
                    <img 
                      src={orgImage || dummyAvatar} 
                      alt="user" 
                      className="rounded-circle" 
                      style={{ 
                        ...profileImageStyle,
                        width: '32px', 
                        height: '32px', 
                        objectFit: 'cover' 
                      }} 
                    />
                    <span className="availability-status online"></span>
                  </div>
                  <span className="d-none d-md-inline-block text-white" 
                    style={{ 
                      fontWeight: '500',
                      fontSize: '14px',
                      marginRight: '8px'
                    }}
                  >
                    {orgName || 'User'}
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end mt-2">
                <Dropdown.Item 
                  as={Link} 
                  to={sessionStorage.getItem('adminPortal') === 'true' ? '/profile_superadmin' : '/profile'} 
                  className="d-flex align-items-center"
                >
                  <FaUser className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handlePowerClick} className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
