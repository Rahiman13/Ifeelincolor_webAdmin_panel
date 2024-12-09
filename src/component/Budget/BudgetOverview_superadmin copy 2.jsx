import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Backdrop, CircularProgress, Typography, Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card_circle from '../../assets/circle.svg';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiChartLine, mdiCashMultiple, mdiEye, mdiMonitor, mdiDoctor, mdiOfficeBuilding } from '@mdi/js';
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
    <div className="budget-analysis p-3">
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiChartLine} size={1.3} />
              </span> Earnings
            </h3>
            <span>
              Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </span>
          </div>

          <Container fluid>
            {/* First Row: Cards */}
            <Row className="mb-4">
              {sessionStorage.getItem('adminPortal') === 'true' ? (
                <>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Portal Earnings"
                      value={adminMetrics?.patientEarnings || 0}
                      icon={mdiMonitor}
                      gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                      percentage="Total Patient Earnings"
                      />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Clinician Earnings"
                      value={adminMetrics?.clinicianEarnings || 0}
                      icon={mdiDoctor}
                      gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                      percentage="Total Clinician Earnings"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Organization Earnings"
                      value={adminMetrics?.organizationEarnings || 0}
                      icon={mdiOfficeBuilding}
                      gradient="linear-gradient(135deg, #FF8A00 0%, #FFD700 100%)"
                      percentage="Total Organization Earnings"
                      />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Total Earnings"
                      value={adminMetrics?.totalEarnings || 0}
                      icon={mdiCashMultiple}
                      gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                      percentage="Overall Total Earnings"
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col md={4} className="mb-3">
                    <MetricCard
                      title="Current Month Total"
                      value={metricData ? metricData.currentMonthEarnings : (budgetData?.periodTotal || 0)}
                      icon={mdiCurrencyUsd}
                      gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                      percentage={calculatePercentageIncrease(
                        metricData ? metricData.currentMonthEarnings : (budgetData?.periodTotal || 0),
                        budgetData?.previousPeriodTotal || 0
                      )}
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <MetricCard
                      title="Current Year Total"
                      value={metricData ? metricData.currentYearEarnings : (budgetData?.currentYearTotal || 0)}
                      icon={mdiChartLine}
                      gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                      percentage={calculatePercentageIncrease(
                        metricData ? metricData.currentYearEarnings : (budgetData?.currentYearTotal || 0),
                        budgetData?.previousYearTotal || 0
                      )}
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <MetricCard
                      title="All Time Total"
                      value={metricData ? metricData.totalEarnings : (budgetData?.allTimeTotal || 0)}
                      icon={mdiCashMultiple}
                      gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                      percentage="100% Total"
                    />
                  </Col>
                </>
              )}
            </Row>

            {/* Second Row: Stacked Column Chart */}
            <Row className="mb-4">
              <Col>
                <Card className="mb-4">
                  <Card.Header style={cardHeaderStyle} className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <span className='font-weight-bold'>Earning Analysis Overview</span>
                    <div className="d-flex gap-2">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StyledDatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          renderInput={(params) => <Form.Control {...params} />}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: {
                                width: '140px',
                                '& .MuiInputLabel-root': {
                                  color: '#fff',
                                  fontWeight: 600,
                                }
                              }
                            },
                            inputAdornment: {
                              style: { marginRight: '-8px' }
                            }
                          }}
                        />
                        <StyledDatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          renderInput={(params) => <Form.Control {...params} />}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: {
                                width: '140px',
                                '& .MuiInputLabel-root': {
                                  color: '#fff',
                                  fontWeight: 600,
                                }
                              }
                            },
                            inputAdornment: {
                              style: { marginRight: '-8px' }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Third Row: Table */}
            <Row>
              <Col>
                <StyledTableContainer component={Paper} className="p-0">
                  <TableHeaderBox>
                    <Typography variant="h5" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                      Subscriptions
                    </Typography>
                    <ToggleButtonGroup
                      value={filter}
                      exclusive
                      onChange={handleFilterChange}
                      aria-label="subscription filter"
                    >
                      <ToggleButton value="patient" aria-label="patient">
                        Patient
                      </ToggleButton>
                      <ToggleButton value="clinician" aria-label="clinician">
                        Clinician
                      </ToggleButton>
                      <ToggleButton value="organization" aria-label="organization">
                        Organization
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </TableHeaderBox>
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        {renderTableHeaders().map((header) => (
                          <StyledHeaderCell key={header.id} align={header.align}>
                            {header.label}
                          </StyledHeaderCell>
                        ))}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {subscriptions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((subscription) => (
                          <StyledTableRow key={subscription._id}>
                            {renderTableHeaders().map((header) => (
                              <StyledTableCell key={header.id} align={header.align}>
                                {renderTableCell(subscription, header)}
                              </StyledTableCell>
                            ))}
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    className="mt-2"
                    component="div"
                    count={subscriptions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  />
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BudgetAnalysis;
