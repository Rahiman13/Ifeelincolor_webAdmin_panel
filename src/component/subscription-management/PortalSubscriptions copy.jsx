import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
import SubscriptionCharts from './PortalSubscriptionCharts';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Backdrop, Box, Typography, Avatar, Chip, Tooltip } from '@mui/material';
import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import './PortalSubscription.scss';
import Card_circle from '../../assets/circle.svg';
import { mdiMonitor, mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

// Create a theme with the necessary color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      contrastText: '#fff',
    },
  },
});

// Styled components (same as in ClinicianSubscription)
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 650,
});

const TableHeaderBox = styled(Box)(({ theme }) => ({
  // background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',

  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    // backgroundColor: theme.palette.action.selected,
    transition: 'all 0.3s ease',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  background: status === 'Active'
    ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
    : status === 'Renewal'
      ? 'linear-gradient(45deg, #f1c40f, #f39c12)'
      : 'linear-gradient(45deg, #e74c3c, #c0392b)',
  padding: '8px 12px',
  borderRadius: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
  },
}));

// Add these new styled components
const InfoChip = styled(Chip)(({ theme, $color, $hoverColor }) => ({
  margin: '4px',
  backgroundColor: 'transparent',
  background: $color,
  color: '#fff',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  borderRadius: '20px',
  padding: '8px 12px',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: $hoverColor,
  },
  transition: 'all 0.3s ease',
}));

const PatientAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  border: '3px solid white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const DetailBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transform: 'translateY(-2px)',
  },
}));

// Add these new styled components at the top
const StyledDashboard = styled('div')(({ theme }) => ({
  background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
  minHeight: '100vh',
  padding: theme.spacing(4),
  fontFamily: "'Poppins', sans-serif",
  color: '#1a365d',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '220px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    zIndex: 0,
    borderRadius: '0 0 50px 50px',
  }
}));

const StyledPageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  // background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  // padding: theme.spacing(1),
  // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  // border: '1px solid rgba(255, 255, 255, 0.2)',
  '.page-title': {
    fontSize: '3rem',
    fontWeight: 700,
    // background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'white',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  '.page-title-icon': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
    // transform: 'rotate(-10deg)',
    width: '48px',
    height: '48px',
  }
}));

// Add this styled component definition
const ModernMetricCard = styled(Card)(({ gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '24px',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiTypography-root': {
    color: '#fff',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '195px',
    height: '240px',
    backgroundImage: `url(${Card_circle})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    opacity: 0.6,
    zIndex: 0,
  }
}));

// Update the SearchContainer styled component
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',

  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  padding: '8px 16px',
  width: '300px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',

  '&:hover, &:focus-within': {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

    '&::before': {
      transform: 'translateX(300px)',
    },

    '& .search-icon': {
      transform: 'rotate(90deg)',
      color: '#fff',
    },

    '& input::placeholder': {
      color: 'rgba(255, 255, 255, 0.8)',
    }
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'transform 0.5s',
    transform: 'translateX(-100px)',
  },

  '& input': {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    padding: '4px 8px',
    fontSize: '0.875rem',
    color: '#fff',
    fontWeight: '500',
    letterSpacing: '0.5px',

    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
      transition: 'color 0.3s ease',
    }
  },

  '& .search-icon': {
    transition: 'all 0.3s ease',
    color: 'rgba(255, 255, 255, 0.6)',
  }
}));

export default function PortalSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    active: 0,
    renewal: 0,
    ended: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const adminPortal = sessionStorage.getItem('adminPortal');
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const baseUrl = role === 'assistant' ? 'assistant' : 'admin';

      if (adminPortal === 'true' && token) {
        try {
          const [subscriptionsResponse, countsResponse] = await Promise.all([
            axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/total-subscription-counts`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          if (subscriptionsResponse.data.status === 'success') {
            setSubscriptions(subscriptionsResponse.data.body);
          } else {
            setToastMessage('Failed to fetch subscriptions');
            setShowToast(true);
          }

          if (countsResponse.data.status === 'success') {
            const { patientSubscription } = countsResponse.data.data;
            setSubscriptionCounts({
              active: patientSubscription.active,
              renewal: patientSubscription.renewal,
              ended: patientSubscription.ended
            });
          } else {
            setToastMessage('Failed to fetch subscription counts');
            setShowToast(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setToastMessage('Error fetching data');
          setShowToast(true);
        }
      } else {
        setToastMessage('Unauthorized access');
        setShowToast(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculatePercentageChange = (current, total) => {
    if (total === 0) return '0%';
    const percentage = (current / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getFilteredSubscriptions = () => {
    let filtered = [...subscriptions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.patient.userName?.toLowerCase().includes(query) ||
        sub.patient.email?.toLowerCase().includes(query)
      );
    }

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  if (loading) {
    return (
      <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledDashboard>
        {loading ? (
          <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <StyledPageHeader>
              <div className="page-title">
                <div className="page-title-icon">
                  <Icon
                    path={mdiMonitor}
                    size={1.5}
                    color="#ffffff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                </div>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  Portal Subscription
                </span>
              </div>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Subscription Plans Management
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      <li>Manage both Patient and Clinician subscription plans</li>
                      <li>Create, edit, and delete subscription plans</li>
                      <li>Set plan pricing, validity periods, and features</li>
                      <li>Toggle plan status between active and inactive</li>
                      <li>Monitor plan creation and update history</li>
                      <li>View detailed plan descriptions and terms</li>
                      <li>Control access to different platform features</li>
                      <li>Manage subscription renewals and expirations</li>
                    </ul>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                      Tip: Use the toggle buttons to switch between Patient and Clinician plans
                    </Typography>
                  </Box>
                }
                arrow
                placement="bottom-end"
                sx={{
                  '& .MuiTooltip-tooltip': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: 400
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'rgba(255, 255, 255, 0.95)',
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '12px',
                }}>
                  <Typography sx={{
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}>
                    Overview
                  </Typography>
                  <Icon
                    path={mdiAlertCircleOutline}
                    size={0.8}
                    color="#fff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </Box>
              </Tooltip>
            </StyledPageHeader>

            <Container fluid>
              <Row className="mb-4">
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Active Subscriptions
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.active}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.active,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaCheckCircle size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Renewals
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.renewal}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.renewal,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaRedo size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Ended Subscriptions
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.ended}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.ended,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaTimesCircle size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <SubscriptionCharts subscriptions={subscriptions} />
                </Col>
              </Row>

              <Row>
                <Col>
                  <StyledTableContainer sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden'
                  }}>
                    <TableHeaderBox>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Add this
                        width: '100%', // Add this
                        // gap: 3,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
                          Portal Subscription Details
                        </Typography>
                        <SearchContainer>
                          <Icon
                            path={mdiMagnify}
                            size={0.9}
                            className="search-icon"
                            style={{
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                          {searchQuery && (
                            <Box
                              component="span"
                              sx={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  transform: 'translateY(-50%) scale(1.1)',
                                }
                              }}
                              onClick={() => setSearchQuery('')}
                            >
                              <CloseIcon
                                sx={{
                                  fontSize: '14px',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                }}
                              />
                            </Box>
                          )}
                        </SearchContainer>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '350px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            opacity: searchQuery ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <Icon
                            path={mdiMagnify}
                            size={0.5}
                            color="rgba(255, 255, 255, 0.6)"
                          />
                          {`Found ${subscriptions.filter(sub =>
                            sub.patient.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length} results`}
                        </Box>
                      </Box>
                    </TableHeaderBox>
                    <StyledTable aria-label="subscription table">
                      <StyledTableHead>
                        <TableRow>
                          <StyledHeaderCell>Patient Information</StyledHeaderCell>
                          <StyledHeaderCell>Contact Details</StyledHeaderCell>
                          <StyledHeaderCell>Subscription Information</StyledHeaderCell>
                          <StyledHeaderCell>Status</StyledHeaderCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {getFilteredSubscriptions().map((sub, index) => (
                          <StyledTableRow key={sub._id}>
                            <StyledTableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Tooltip title={`Patient ID: ${sub.patient._id}`} arrow>
                                  <PatientAvatar
                                    src={sub.patient.image}
                                    alt={sub.patient.userName}
                                  >
                                    {sub.patient.userName?.charAt(0)}
                                  </PatientAvatar>
                                </Tooltip>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {sub.patient.userName || '-'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Member since {new Date(sub.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell>
                              {/* <DetailBox> */}
                              <Tooltip title="Send Email" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <EmailIcon fontSize="small" color="primary" />
                                  <Typography variant="body2" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '200px'
                                  }}>
                                    {sub.patient.email || '-'}
                                  </Typography>
                                </Box>
                              </Tooltip>
                              <Tooltip title="Call Patient" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PhoneIcon fontSize="small" color="success" />
                                  <Typography variant="body2">{sub.patient.mobile || '-'}</Typography>
                                </Box>
                              </Tooltip>
                              {/* </DetailBox> */}
                            </StyledTableCell>

                            <StyledTableCell>
                              {/* <DetailBox> */}
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                <Tooltip title="Subscription Plan" arrow>
                                  <InfoChip
                                    label={`${sub.plan.name} - $${sub.plan.price}`}
                                    $color="linear-gradient(45deg, #1976d2, #64b5f6)"
                                    $hoverColor="linear-gradient(45deg, #64b5f6, #1976d2)"
                                  />
                                </Tooltip>
                                <Tooltip title="Plan Duration" arrow>
                                  <InfoChip
                                    label={`${sub.plan.validity} Days`}
                                    $color="linear-gradient(45deg, #7b1fa2, #ba68c8)"
                                    $hoverColor="linear-gradient(45deg, #ba68c8, #7b1fa2)"
                                  />
                                </Tooltip>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Tooltip title="Start Date" arrow>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon fontSize="small" color="primary" />
                                    <Typography variant="body2">
                                      {new Date(sub.startDate).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                                <Tooltip title="End Date" arrow>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventBusyIcon fontSize="small" color="error" />
                                    <Typography variant="body2">
                                      {new Date(sub.endDate).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              </Box>
                              {/* </DetailBox> */}
                            </StyledTableCell>

                            <StyledTableCell>
                              <Tooltip title={`Subscription ${sub.renewal ? 'up for renewal' : (new Date(sub.endDate) > new Date() ? 'currently active' : 'has expired')}`} arrow>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                  <StatusChip
                                    label={sub.renewal ? 'Renewal' : (new Date(sub.endDate) > new Date() ? 'Active' : 'Expired')}
                                    status={sub.renewal ? 'Renewal' : (new Date(sub.endDate) > new Date() ? 'Active' : 'Expired')}
                                  />
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {new Date(sub.endDate) > new Date()
                                      ? `${Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`
                                      : 'Subscription ended'}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                    <TablePagination
                      component="div"
                      count={subscriptions.filter(sub => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return sub.patient.userName?.toLowerCase().includes(query) ||
                          sub.patient.email?.toLowerCase().includes(query);
                      }).length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      sx={{
                        borderTop: '1px solid rgba(224, 224, 224, 1)',
                        backgroundColor: '#f5f5f5',
                      }}
                    />
                  </StyledTableContainer>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </StyledDashboard>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ThemeProvider>
  );
}
