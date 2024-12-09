import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  TablePagination,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  Chip,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Backdrop,
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiAccount, mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

// Styled Components
const DashboardContainer = styled('div')(({ theme }) => ({
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
    height: '300px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    zIndex: 0,
    borderRadius: '0 0 50px 50px',
  }
}));

const PageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  marginBottom: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '.page-title': {
    fontSize: '2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
    width: '48px',
    height: '48px',
  }
}));

const CardHeader = styled(Box)(({ theme }) => ({
  // background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',

  padding: theme.spacing(2),
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const HeaderSelect = styled(Select)(({ theme }) => ({
  height: 40,
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white'
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '& .MuiSelect-select': {
    padding: '8px 14px'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  // borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-8px)',
    // boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledTableContainerHeader = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-8px)',
    // boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '.MuiTableCell-root': {
    borderColor: 'rgba(0, 0, 0, 0.06)',
  }
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
  '&:hover': {
    transition: 'all 0.3s ease',
    // transform: 'translateY(-2px)',
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
  fontWeight: 500,
  borderRadius: '6px',
  fontSize: '0.75rem',
  height: '24px',
  ...(status === 'Active' && {
    color: theme.palette.success.dark,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  }),
  ...(status === 'Expired' && {
    color: theme.palette.error.dark,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  }),
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1.5),
  '& svg': {
    fontSize: '1.2rem',
  }
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '24px 24px 0 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-2px)',
    // boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

// // Add this styled component after your existing styled components
// const SearchContainer = styled('div')(({ theme }) => ({
//   position: 'relative',
//   width: '300px',
//   '& input': {
//     width: '100%',
//     padding: '10px 36px 10px 40px',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     borderRadius: '12px',
//     color: 'white',
//     fontSize: '0.9rem',
//     transition: 'all 0.2s ease',
//     '&::placeholder': {
//       color: 'rgba(255, 255, 255, 0.6)',
//     },
//     '&:focus': {
//       outline: 'none',
//       backgroundColor: 'rgba(255, 255, 255, 0.15)',
//       borderColor: 'rgba(255, 255, 255, 0.3)',
//     },
//   },
//   '& .search-icon': {
//     position: 'absolute',
//     left: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
// }));

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

// ... rest of your styled components ...

export default function Component() {
  // State declarations (at the top of the component)
  const [filterType, setFilterType] = useState('all');
  const [portalPatients, setPortalPatients] = useState([]);
  const [clinicianPatients, setClinicianPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add API helper function
  const getApiBaseUrl = () => {
    const role = sessionStorage.getItem('role');
    return role === 'assistant' ? 'assistant' : 'admin';
  };

  // Add subscription data fetch effect
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal) {
        setIsLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscription-counts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setSubscriptionData(data.body.monthlyData);
          const years = [...new Set(Object.keys(data.body.monthlyData).map(date => date.split('-')[0]))];
          setAvailableYears(years.sort());
          if (years.length > 0) {
            setSelectedYear(Math.max(...years.map(Number)));
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Update chart data configuration
  const barChartData = {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: subscriptionData 
          ? Object.keys(subscriptionData)
              .filter(date => date.startsWith(selectedYear))
              .map(date => {
                const [year, month] = date.split('-');
                return new Date(year, month - 1).toLocaleString('default', { month: 'short' }).toUpperCase();
              })
          : [],
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 1,
          gradientToColors: ['#36A2EB'],
          opacityFrom: 0.7,
          opacityTo: 0.9,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: [{
      name: 'Patients',
      data: subscriptionData
        ? Object.entries(subscriptionData)
            .filter(([date]) => date.startsWith(selectedYear))
            .map(([_, value]) => value)
        : []
    }]
  };

  // Update the fetchAllPatients effect to match PatientPage_copy
  useEffect(() => {
    const fetchAllPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'all') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();

        const [portalResponse, clinicianResponse] = await Promise.all([
          fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const portalData = await portalResponse.json();
        const clinicianData = await clinicianResponse.json();

        if (portalData.status === 'success') {
          const formattedPortalData = portalData.body.map(subscription => ({
            id: subscription._id,
            name: subscription.patient.userName,
            email: subscription.patient.email,
            mobile: subscription.patient.mobile,
            subscriptionType: 'Portal',
            planName: subscription.plan.name,
            details: subscription.plan.details,
            startDate: new Date(subscription.startDate).toLocaleDateString(),
            endDate: new Date(subscription.endDate).toLocaleDateString(),
            avatarSrc: subscription.patient.image || "/placeholder-user.jpg",
            avatarFallback: subscription.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setPortalPatients(formattedPortalData);
        }

        if (clinicianData.status === 'success') {
          const formattedClinicianData = clinicianData.body.map(item => ({
            id: item.subscription._id,
            name: item.patient.userName,
            email: item.patient.email,
            mobile: item.patient.mobile,
            subscriptionType: 'Clinician',
            clinician: {
              name: item.clinician.name,
              specialization: item.clinician.specializedIn,
              degree: item.clinician.degree
            },
            planName: item.plan.name,
            details: item.plan.details,
            startDate: new Date(item.subscription.startDate).toLocaleDateString(),
            endDate: new Date(item.subscription.endDate).toLocaleDateString(),
            avatarSrc: item.patient.image || "/placeholder-user.jpg",
            avatarFallback: item.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setClinicianPatients(formattedClinicianData);
        }
      } catch (error) {
        console.error('Error fetching all patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPatients();
  }, [filterType]);

  // Add effect for portal patients
  useEffect(() => {
    const fetchPortalPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'portal') return;

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          const formattedData = data.body.map(subscription => ({
            id: subscription._id,
            name: subscription.patient.userName,
            email: subscription.patient.email,
            mobile: subscription.patient.mobile,
            subscriptionType: 'Portal',
            planName: subscription.plan.name,
            details: subscription.plan.details,
            startDate: new Date(subscription.startDate).toLocaleDateString(),
            endDate: new Date(subscription.endDate).toLocaleDateString(),
            avatarSrc: subscription.patient.image || "/placeholder-user.jpg",
            avatarFallback: subscription.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setPortalPatients(formattedData);
        }
      } catch (error) {
        console.error('Error fetching portal subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalPatients();
  }, [filterType]);

  // Add effect for clinician patients
  useEffect(() => {
    const fetchClinicianPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'clinician') return;

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          const formattedData = data.body.map(item => ({
            id: item.subscription._id,
            name: item.patient.userName,
            email: item.patient.email,
            mobile: item.patient.mobile,
            subscriptionType: 'Clinician',
            clinician: {
              name: item.clinician.name,
              specialization: item.clinician.specializedIn,
              degree: item.clinician.degree
            },
            planName: item.plan.name,
            details: item.plan.details,
            startDate: new Date(item.subscription.startDate).toLocaleDateString(),
            endDate: new Date(item.subscription.endDate).toLocaleDateString(),
            avatarSrc: item.patient.image || "/placeholder-user.jpg",
            avatarFallback: item.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setClinicianPatients(formattedData);
        }
      } catch (error) {
        console.error('Error fetching clinician subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicianPatients();
  }, [filterType]);

  // Handler functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add this helper function
  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  // Update the getFilteredUsers function
  const getFilteredUsers = () => {
    let users = [];
    switch (filterType) {
      case 'portal':
        users = portalPatients;
        break;
      case 'clinician':
        users = clinicianPatients;
        break;
      case 'all':
        users = [...portalPatients, ...clinicianPatients].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      default:
        users = [];
    }

    if (!searchQuery) return users;

    return users.filter(user => {
      const searchString = searchQuery.toLowerCase();
      const hasMatchingName = user.name.toLowerCase().includes(searchString);
      const hasMatchingEmail = user.email.toLowerCase().includes(searchString);
      const hasMatchingClinician = user.clinician?.name?.toLowerCase().includes(searchString);

      return hasMatchingName || hasMatchingEmail || hasMatchingClinician;
    });
  };

  return (
    <DashboardContainer>
      {isLoading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <PageHeader>
            <div className="page-title">
              <div className="page-title-icon">
                <Icon 
                  path={mdiAccount} 
                  size={1.5} 
                  color="#ffffff"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              Patient Management
            </div>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                <li className="breadcrumb-item active">
                  <span style={{ 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    Overview
                    <Icon 
                      path={mdiAlertCircleOutline} 
                      size={0.7} 
                      color="#3b82f6"
                    />
                  </span>
                </li>
              </ul>
            </nav>
          </PageHeader>

          <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid item xs={12}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <CardHeader>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Patient Count by Month
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <HeaderSelect
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      displayEmpty
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </HeaderSelect>
                  </FormControl>
                </CardHeader>
                <CardContent>
                  <Box sx={{ height: 350 }}>
                    <Chart
                      options={barChartData.options}
                      series={barChartData.series}
                      type="bar"
                      height="100%"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <StyledTableContainerHeader>
                <TableHeaderBox>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    position: 'relative',
                    zIndex: 1 
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      Patient Management
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
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                      {`Found ${getFilteredUsers().length} results`}
                    </Box>
                  </Box>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <HeaderSelect
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setPage(0);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="all">All Patients ({portalPatients.length + clinicianPatients.length})</MenuItem>
                      <MenuItem value="portal">Portal Patients ({portalPatients.length})</MenuItem>
                      <MenuItem value="clinician">Clinician Patients ({clinicianPatients.length})</MenuItem>
                    </HeaderSelect>
                  </FormControl>
                </TableHeaderBox>

                <StyledTableContainer className="border-radius-0">
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell width="20%">Patient Details</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Contact Information</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Subscription Details</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Clinician Details</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Status & Timeline</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {isLoading ? (
                        <StyledTableRow>
                          <StyledTableCell colSpan={5} align="center">
                            <CircularProgress />
                          </StyledTableCell>
                        </StyledTableRow>
                      ) : (
                        getFilteredUsers()
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((user) => (
                            <StyledTableRow key={user.id}>
                              <StyledTableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    src={user.avatarSrc}
                                    alt={user.name}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        mb: 0.5
                                      }}
                                    >
                                      {user.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {/* <span style={{ color: '#666' }}>ID:</span>&nbsp;{user.id} */}
                                    </Typography>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#2196f3', 0.1) }}>
                                      <EmailIcon sx={{ color: '#2196f3' }} />
                                    </InfoIcon>
                                    <Typography variant="body2">{user.email}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#4caf50', 0.1) }}>
                                      <PhoneIcon sx={{ color: '#4caf50' }} />
                                    </InfoIcon>
                                    <Typography variant="body2">{user.mobile}</Typography>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#9c27b0', 0.1) }}>
                                      <LocalHospitalIcon sx={{ color: '#9c27b0' }} />
                                    </InfoIcon>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {user.planName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.details}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                {user.subscriptionType !== 'Portal' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#ff9800', 0.1) }}>
                                      <LocalHospitalIcon sx={{ color: '#ff9800' }} />
                                    </InfoIcon>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {user.clinician?.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.clinician?.specialization}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: 'block',
                                          color: 'text.disabled',
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        {user.clinician?.degree}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.disabled">N/A</Typography>
                                )}
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  <StatusChip
                                    label={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
                                    status={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
                                    size="small"
                                  />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        display: 'block',
                                        mb: 0.5
                                      }}
                                    >
                                      {user.startDate} - {user.endDate}
                                    </Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={calculateProgress(user.startDate, user.endDate)}
                                      sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: alpha('#000', 0.05),
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: new Date(user.endDate) > new Date() ? 'success.main' : 'error.main',
                                        }
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                      )}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={getFilteredUsers().length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                  />
                </StyledTableContainer>
              </StyledTableContainerHeader>
            </Grid>
          </Grid>
        </Box>
      )}
    </DashboardContainer>
  );
}