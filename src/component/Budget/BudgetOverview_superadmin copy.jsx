import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Backdrop, CircularProgress, Typography, Box, Button } from '@mui/material';
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

// Add these new keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Update the CustomTooltip styled component
const CustomTooltip = styled('div')(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  padding: '16px',
  border: '2px solid #3A1C71',
  fontFamily: '"Poppins", sans-serif',
  maxWidth: '300px',
  backdropFilter: 'blur(10px)',
  animation: `${fadeIn} 0.3s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3A1C71, #D76D77, #FFAF7B)',
    borderTopLeftRadius: '13px',
    borderTopRightRadius: '13px',
  },
  '& .tooltip-title': {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#3A1C71',
    textAlign: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50px',
      height: '2px',
      background: 'linear-gradient(90deg, #3A1C71, #D76D77)',
    },
  },
  '& .tooltip-row': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(58, 28, 113, 0.05)',
      transform: 'translateX(5px)',
    },
  },
  '& .tooltip-label': {
    fontSize: '14px',
    fontWeight: '600',
    color: '#134E5E',
  },
  '& .tooltip-value': {
    fontSize: '14px',
    fontWeight: '700',
    color: '#FF416C',
    display: 'flex',
    alignItems: 'center',
    '& .percentage': {
      fontSize: '12px',
      marginLeft: '5px',
      color: '#26D0CE',
    },
  },
  '& .tooltip-bar': {
    height: '6px',
    borderRadius: '3px',
    marginTop: '4px',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
      backgroundSize: '468px 100%',
      animation: `${shimmer} 2s infinite linear`,
    },
  },
  '& .tooltip-total': {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '2px dashed #3A1C71',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#3A1C71',
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

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (sessionStorage.getItem('adminPortal') === 'true') {
        await fetchAdminEarningsData();
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
      const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/detailed-earnings-month-wise', {
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
      const role = sessionStorage.getItem('role');
      let url;

      if (role === 'manager') {
        url = 'https://rough-1-gcic.onrender.com/api/manager/subscriptions';
      }
      else if (role === 'Admin') {
        url = 'https://rough-1-gcic.onrender.com/api/admin/subscriptions';

      } else {
        url = 'https://rough-1-gcic.onrender.com/api/organization/subscriptions';
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(response.data.body);
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
    tooltip: {
      shared: true,
      intersect: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries;
        const date = w.globals.labels[dataPointIndex];
        const total = data.reduce((sum, s) => sum + s.data[dataPointIndex], 0);

        let content = `
          <${CustomTooltip.toString()}>
            <div class="tooltip-title">${date}</div>
        `;

        data.forEach((s, index) => {
          const value = s.data[dataPointIndex];
          const percentage = ((value / total) * 100).toFixed(1);
          const barColor = index === 0 ? '#3A1C71' : index === 1 ? '#D76D77' : '#FFAF7B';
          content += `
            <div class="tooltip-row">
              <span class="tooltip-label">${s.name}</span>
              <span class="tooltip-value">
                $${value.toFixed(2)}
                <span class="percentage">(${percentage}%)</span>
              </span>
            </div>
            <div class="tooltip-bar" style="width: ${percentage}%; background-color: ${barColor};"></div>
          `;
        });

        content += `
          <div class="tooltip-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
          </${CustomTooltip.toString()}>
        `;

        return content;
      }
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
                      gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                      percentage="Total Patient Earnings"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Clinician Earnings"
                      value={adminMetrics?.clinicianEarnings || 0}
                      icon={mdiDoctor}
                      gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                      percentage="Total Clinician Earnings"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Organization Earnings"
                      value={adminMetrics?.organizationEarnings || 0}
                      icon={mdiOfficeBuilding}
                      gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                      percentage="Total Organization Earnings"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <MetricCard
                      title="Total Earnings"
                      value={adminMetrics?.totalEarnings || 0}
                      icon={mdiCashMultiple}
                      gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
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
                      Earning Details
                    </Typography>
                    {/* <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<Icon path={mdiEye} size={0.8} />}
                      onClick={this.handleViewAllClick}
                    >
                      View All
                    </Button> */}
                  </TableHeaderBox>
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                        <StyledHeaderCell align="center">Name</StyledHeaderCell>
                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                        {sessionStorage.getItem('role') !== 'Admin' && (
                          <StyledHeaderCell align="center">Clinician</StyledHeaderCell>
                        )}
                        <StyledHeaderCell align="center">Plan</StyledHeaderCell>
                        <StyledHeaderCell align="center">Price</StyledHeaderCell>
                        <StyledHeaderCell align="center">Start Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">End Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">Renewal</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subscription, index) => (
                        <StyledTableRow key={subscription._id}>
                          <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.patient.userName || '-'}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.patient.email}</StyledTableCell>
                          {sessionStorage.getItem('role') !== 'Admin' && (
                            <StyledTableCell align="center">{subscription.clinisist?.name || 'N/A'}</StyledTableCell>
                          )}
                          <StyledTableCell align="center">{subscription.plan?.name || 'N/A'}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.plan?.price ? `$${subscription.plan.price.toFixed(2)}` : 'N/A'}</StyledTableCell>
                          <StyledTableCell align="center">{new Date(subscription.startDate).toLocaleDateString()}</StyledTableCell>
                          <StyledTableCell align="center">{new Date(subscription.endDate).toLocaleDateString()}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.renewal ? 'Yes' : 'No'}</StyledTableCell>
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
