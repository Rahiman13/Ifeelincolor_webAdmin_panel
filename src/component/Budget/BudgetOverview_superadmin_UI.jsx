import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Backdrop, CircularProgress, Typography, Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card_circle from '../../assets/circle.svg';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiChartLine, mdiCashMultiple, mdiEye, mdiMonitor, mdiDoctor, mdiOfficeBuilding, mdiAlertCircleOutline } from '@mdi/js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns'; // Add this import at the top of your file
import { styled, alpha, keyframes } from '@mui/material/styles';
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';

// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  color: 'white',
};

const StyledTable = styled(Table)({
  minWidth: 700,
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  background: theme.palette.grey[200],

}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  // color: theme.palette.common.white,
  color: theme.palette.common.black,

  fontWeight: '500',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  lineHeight: '1.5rem',
  letterSpacing: '0.05em',
  padding: theme.spacing(2),
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     // backgroundColor: alpha(theme.palette.primary.light, 0.05),
//   },
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.light, 0.1),
//     transform: 'translateY(-2px)',
//     // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//   },
//   transition: 'all 0.3s ease',
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'white',
  '&:nth-of-type(odd)': {
  },
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
  fontSize: '0.875rem',
  lineHeight: '1.43',
  padding: '16px',
});

// Add these new styled components and keyframes
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '20px', // Slightly less rounded for a classic look
    background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    border: 'none',
    color: theme.palette.common.white,
    padding: '4px 10px', // Adjusted padding for a more compact look
    transition: 'all 0.3s ease-in-out',
    width: '140px', // Decreased width for a more compact look
    fontSize: '0.7rem', // Decreased text size for a more compact look
    fontWeight: '600',
    '&:hover': {
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)', // Softer shadow for a classic feel
      transform: 'translateY(-1px)',
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '5px 12px',
    width: 'calc(100% - 60px)', // Adjust width to accommodate the calendar icon
    '&::placeholder': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '&:hover .MuiInputBase-root::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '468px 100%',
    animation: `${shimmer} 2s infinite`,
    zIndex: 1,
    borderRadius: '30px',
  },
}));

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
  }
}));

const MetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card className="card-trendy text-white" style={{ height: '200px', background: gradient }}>
    <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
    <Card.Body className="d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <h4 className="font-weight-normal mb-0">{title}</h4>
        <Icon path={icon} size={1.2} color="rgba(255,255,255,0.8)" />
      </div>
      <h2 className="mb-0">${value.toFixed(2)}</h2>
      <p className="mb-0">{percentage}</p>
    </Card.Body>
  </Card>
);

const getApiBaseUrl = () => {
    const role = sessionStorage.getItem('role');
    return role === 'assistant' ? 'assistant' : 'admin';
};

// Styled components
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
    height: '300px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    zIndex: 0,
    borderRadius: '0 0 50px 50px',
  }
}));

const StyledPageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  marginBottom: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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

const BudgetAnalysis = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // January 1st of current year
  const [endDate, setEndDate] = useState(new Date()); // Current date
  const [metricData, setMetricData] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [adminEarningsData, setAdminEarningsData] = useState({});
  const [filter, setFilter] = useState('patient');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (sessionStorage.getItem('adminPortal') === 'true') {
        await Promise.all([fetchAdminEarningsData(), fetchAdminMetrics(), fetchSubscriptions()]);
      } else {
        await Promise.all([fetchMetricData(), fetchBudgetData(), fetchSubscriptions()]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminEarningsData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/detailed-earnings-month-wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });
      setAdminEarningsData(response.data.data);
    } catch (error) {
      console.error('Error fetching admin earnings data:', error);
      toast.error('Failed to fetch admin earnings data');
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/total-earnings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminMetrics(response.data.data);
    } catch (error) {
      console.error('Error fetching admin metric data:', error);
      toast.error('Failed to fetch admin metric data');
    }
  };

  const fetchMetricData = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (adminPortal) {
      try {
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/total-earnings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminMetrics(response.data.data);
      } catch (error) {
        console.error('Error fetching admin metric data:', error);
        toast.error('Failed to fetch admin metric data');
      }
    } else {
      // Existing metric data fetching logic for other roles
      // ...
    }
  };

  const fetchBudgetData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      let url;

      if (role === 'manager') {
        url = `https://rough-1-gcic.onrender.com/api/manager/earnings?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;
      } else {
        url = `https://rough-1-gcic.onrender.com/api/organization/earnings?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.body;

      if (role === 'organization') {
        // Calculate current year total
        const currentYear = new Date().getFullYear();
        const currentYearTotal = Object.entries(data.monthlyEarnings)
          .filter(([key]) => key.startsWith(currentYear.toString()))
          .reduce((total, [, value]) => total + value, 0);

        // Calculate previous year total
        const previousYear = currentYear - 1;
        const previousYearTotal = Object.entries(data.monthlyEarnings)
          .filter(([key]) => key.startsWith(previousYear.toString()))
          .reduce((total, [, value]) => total + value, 0);

        data.currentYearTotal = currentYearTotal;
        data.previousYearTotal = previousYearTotal;
      }

      setBudgetData(data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast.error('Failed to fetch budget data');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      const baseUrl = getApiBaseUrl();
      let url;

      if (isAdminPortal) {
        if (filter === 'clinician') {
          url = 'https://rough-1-gcic.onrender.com/api/doctorSub/getAll';
        } else if (filter === 'organization') {
          url = 'https://rough-1-gcic.onrender.com/api/orgSubscription/getAll';
        } else {
          url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`;
        }
      } else {
        // Use existing URLs for non-admin users
        const role = sessionStorage.getItem('role');
        if (role === 'manager') {
          url = 'https://rough-1-gcic.onrender.com/api/manager/subscriptions';
        } else {
          url = 'https://rough-1-gcic.onrender.com/api/organization/subscriptions';
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(filter === 'organization' ? response.data.data : response.data.body);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: sessionStorage.getItem('adminPortal') === 'true'
        ? Object.keys(adminEarningsData).map(key => format(new Date(key), 'MMM yyyy'))
        : Object.keys(budgetData?.monthlyEarnings || {})
            .filter(key => {
              const date = new Date(key);
              return date >= startDate && date <= endDate;
            })
            .map(key => format(new Date(key), 'MMM yyyy')),
    },
    yaxis: {
      title: {
        text: 'Earnings ($)',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
  };

  const chartSeries = sessionStorage.getItem('adminPortal') === 'true'
    ? [
        {
          name: 'Patient Earnings',
          data: Object.values(adminEarningsData).map(month => month.patientEarnings),
        },
        {
          name: 'Clinician Earnings',
          data: Object.values(adminEarningsData).map(month => month.clinicianEarnings),
        },
        {
          name: 'Organization Earnings',
          data: Object.values(adminEarningsData).map(month => month.organizationEarnings),
        },
      ]
    : budgetData
      ? [
          {
            name: 'Monthly Earnings',
            data: Object.entries(budgetData.monthlyEarnings)
              .filter(([key]) => {
                const date = new Date(key);
                return date >= startDate && date <= endDate;
              })
              .map(([, value]) => value),
          },
        ]
      : [];

  const calculatePercentageIncrease = (current, previous) => {
    if (previous === 0) return '100% increase';
    const increase = ((current - previous) / previous) * 100;
    return increase > 0 ? `${increase.toFixed(1)}% increase` : `${Math.abs(increase).toFixed(1)}% decrease`;
  };

  const renderTableHeaders = () => {
    const commonHeaders = [
      { id: 'sno', label: 'S.No', align: 'center' },
      { id: 'name', label: 'Name', align: 'center' },
      { id: 'email', label: 'Email', align: 'center' },
      { id: 'price', label: 'Price', align: 'center' },
      { id: 'startDate', label: 'Start Date', align: 'center' },
      { id: 'endDate', label: 'End Date', align: 'center' },
      { id: 'renewal', label: 'Renewal', align: 'center' },
    ];

    const specificHeaders = {
      patient: [
        { id: 'guardian', label: 'Guardian', align: 'center' },
        { id: 'location', label: 'Location', align: 'center' },
      ],
      clinician: [
        { id: 'specialization', label: 'Specialization', align: 'center' },
        { id: 'patients', label: 'Patients', align: 'center' },
        { id: 'experience', label: 'Experience', align: 'center' },
      ],
      organization: [
        { id: 'companyName', label: 'Company Name', align: 'center' },
        { id: 'clinicians', label: 'Clinicians', align: 'center' },
        { id: 'established', label: 'Established', align: 'center' },
      ],
    };

    return [...commonHeaders, ...(specificHeaders[filter] || [])];
  };

  const renderTableCell = (subscription, header) => {
    switch (header.id) {
      case 'sno':
        return page * rowsPerPage + subscriptions.indexOf(subscription) + 1;
      case 'name':
        return filter === 'clinician' ? subscription.clinician?.name :
               filter === 'patient' ? subscription.patient?.userName :
               subscription.organization?.name || '-';
      case 'email':
        return filter === 'clinician' ? subscription.clinician?.email :
               filter === 'patient' ? subscription.patient?.email :
               subscription.organization?.email || '-';
      case 'price':
        if (filter === 'patient') {
          return `$${subscription.plan?.price?.toFixed(2) || 'N/A'}`;
        } else {
          return `$${subscription.price?.toFixed(2) || 'N/A'}`;
        }
      case 'startDate':
        return new Date(subscription.startDate).toLocaleDateString();
      case 'endDate':
        return new Date(subscription.endDate).toLocaleDateString();
      case 'renewal':
        return subscription.renewal ? 'Yes' : 'No';
      case 'guardian':
        return subscription.patient?.guardian || '-';
      case 'location':
        return subscription.patient?.location || '-';
      case 'specialization':
        return subscription.clinician?.specializedIn || '-';
      case 'patients':
        return subscription.patients || '-';
      case 'experience':
        return subscription.clinician?.experince || '-';
      case 'companyName':
        return subscription.organization?.companyName || '-';
      case 'clinicians':
        return subscription.clinicians || '-';
      case 'established':
        return subscription.organization?.established ? new Date(subscription.organization.established).getFullYear() : '-';
      default:
        return '-';
    }
  };

  return (
    <StyledDashboard>
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <StyledPageHeader>
            <div className="page-title">
              <div className="page-title-icon">
                <Icon 
                  path={mdiChartLine} 
                  size={1.5} 
                  color="#ffffff"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              Earnings
            </div>
            <span style={{ 
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Overview
              <Icon path={mdiAlertCircleOutline} size={0.7} color="#3b82f6" />
            </span>
          </StyledPageHeader>

          <Container fluid>
            {/* First Row: Cards */}
            <Row className="mb-4">
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5}>
                {sessionStorage.getItem('adminPortal') === 'true' ? (
                  <>
                    <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 2 }}>
                          Portal Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', mb: 1 }}>
                          ${adminMetrics?.patientEarnings?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Total Patient Earnings
                        </Typography>
                        <Icon path={mdiMonitor} size={2} color="#fff" style={{ opacity: 0.2 }} />
                      </Box>
                    </ModernMetricCard>

                    <ModernMetricCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 2 }}>
                          Clinician Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', mb: 1 }}>
                          ${adminMetrics?.clinicianEarnings?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Total Clinician Earnings
                        </Typography>
                        <Icon path={mdiDoctor} size={2} color="#fff" style={{ opacity: 0.2 }} />
                      </Box>
                    </ModernMetricCard>

                    <ModernMetricCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 2 }}>
                          Organization Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', mb: 1 }}>
                          ${adminMetrics?.organizationEarnings?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Total Organization Earnings
                        </Typography>
                        <Icon path={mdiOfficeBuilding} size={2} color="#fff" style={{ opacity: 0.2 }} />
                      </Box>
                    </ModernMetricCard>

                    <ModernMetricCard gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)">
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 2 }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', mb: 1 }}>
                          ${(adminMetrics?.patientEarnings + adminMetrics?.clinicianEarnings + adminMetrics?.organizationEarnings)?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          Overall Portal Earnings
                        </Typography>
                        <Icon path={mdiCurrencyUsd} size={2} color="#fff" style={{ opacity: 0.2 }} />
                      </Box>
                    </ModernMetricCard>
                  </>
                ) : (
                  <>
                    <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 2 }}>
                          Current Year Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', mb: 1 }}>
                          ${budgetData?.currentYearTotal?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {calculatePercentageIncrease(budgetData?.currentYearTotal || 0, budgetData?.previousYearTotal || 0)}
                        </Typography>
                        <Icon path={mdiCurrencyUsd} size={2} color="#fff" style={{ opacity: 0.2 }} />
                      </Box>
                    </ModernMetricCard>
                  </>
                )}
              </Box>
            </Row>

            {/* Update the chart and table containers with similar modern styling */}
            <Row className="mb-4">
              <Col>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}>
                  {/* ... existing chart content ... */}
                </Card>
              </Col>
            </Row>

            {/* Update table styling similarly */}
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
                  {/* ... existing table content ... */}
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </StyledDashboard>
  );
};

export default BudgetAnalysis;
