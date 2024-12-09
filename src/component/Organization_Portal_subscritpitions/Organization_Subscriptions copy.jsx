import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
// import Organizations_SubscriptionCharts from '../subscription-management/Organizations_SubscriptionCharts';
import Organizations_SubscriptionCharts from './Organizations_SubscriptionCharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Backdrop, Box, Typography, Avatar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// import './ClinicianSubscription.scss';
import '../subscription-management/ClinicianSubscription.scss';
import Card_circle from '../../assets/circle.svg';
import { mdiDoctor, mdiAccountGroup } from '@mdi/js';
import Icon from '@mdi/react';

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
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    // transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
  fontSize: '0.875rem',
  lineHeight: '1.43',
  padding: '16px',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  marginRight: theme.spacing(1),
}));

export default function ClinicianSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    validSubscriptions: 0,
    renewalSubscriptions: 0,
    endedSubscriptions: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    try {
      // Fetch subscription counts
      const countsEndpoint = role === 'manager'
        ? 'https://rough-1-gcic.onrender.com/api/manager/subscriptions-counts'
        : 'https://rough-1-gcic.onrender.com/api/organization/subscription-counts';

      const countsResponse = await axios.get(countsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (countsResponse.data.status === 'success') {
        const counts = countsResponse.data.body;
        setSubscriptionCounts({
          validSubscriptions: counts.validSubscriptions,
          renewalSubscriptions: counts.renewalSubscriptions,
          endedSubscriptions: counts.endedSubscriptions
        });
      }

      // Fetch subscription details
      const subscriptionsEndpoint = role === 'manager'
        ? 'https://rough-1-gcic.onrender.com/api/manager/subscriptions'
        : 'https://rough-1-gcic.onrender.com/api/organization/subscriptions';

      const subscriptionsResponse = await axios.get(subscriptionsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (subscriptionsResponse.data.status === 'success') {
        const apiData = subscriptionsResponse.data.body.map(item => ({
          id: item._id,
          name: item.patient.userName,
          image: item.patient.image, // Add this line to include the image URL
          clinician: item.clinisist ? item.clinisist.name : 'N/A',
          subscribedDate: new Date(item.startDate).toLocaleDateString(),
          endDate: new Date(item.endDate).toLocaleDateString(),
          plan: item.plan.name,
          remainingDays: Math.max(0, Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
          renewals: item.renewal ? [new Date(item.endDate).toLocaleDateString()] : [],
          status: new Date(item.endDate) > new Date() ? 'Active' : 'Cancelled',
        }));
        setSubscriptions(apiData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setToastMessage('Failed to fetch data');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

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

  const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

  return (
    <div className="clinician-subscription p-3">
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white text-xl me-2">
                <Icon path={isAdminPortal ? mdiDoctor : mdiAccountGroup} size={1.3} />
              </span>
              {isAdminPortal ? 'Clinician Subscription' : 'Subscriptions'}
            </h3>
            <span>
              Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </span>
          </div>
          <Container fluid>
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Card className="text-white card-img-holder" style={{ height: '200px', background: 'linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)' }}>
                  <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
                  <Card.Body className="d-flex">
                    <div className="card-details ">
                      <div className=''>
                        <h3 className="card-title d-flex align-items-center gap-3 text-white">
                          Active Subscriptions
                          {/* {sessionStorage.getItem('role') === 'manager' ? 'Active Subscriptions' : 'Valid Subscriptions'} */}
                          <FaCheckCircle className="fs-1 mr-2 text-white" />
                        </h3>
                        <p className="card-text fs-2 fw-bold">
                          {subscriptionCounts.validSubscriptions}
                        </p>
                        <p className="card-text">
                          {calculatePercentageChange(subscriptionCounts.validSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className=" text-white card-img-holder" style={{ height: '200px', background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)' }}>
                  <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
                  <Card.Body className="d-flex">
                    <div className="card-details">
                      <div>
                        <h3 className="card-title d-flex align-items-center gap-3 text-white">Renewals
                          <FaRedo className="fs-1 mr-3" />
                        </h3>
                        <p className="card-text fs-2 fw-bold">
                          {subscriptionCounts.renewalSubscriptions}
                        </p>
                        <p className="card-text">
                          {calculatePercentageChange(subscriptionCounts.renewalSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="bg-gradient-danger text-white card-img-holder " style={{ height: '200px', background: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)' }}>
                  <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
                  <Card.Body className="d-flex ">
                    <div className="card-details">
                      <div>
                        <h3 className="card-title d-flex align-items-center gap-3 text-white">Ended Subscriptions
                          <FaTimesCircle className="fs-1 me-3" />
                        </h3>
                        <p className="card-text fs-2 fw-bold">
                          {subscriptionCounts.endedSubscriptions}
                        </p>
                        <p className="card-text">
                          {calculatePercentageChange(subscriptionCounts.endedSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Organizations_SubscriptionCharts 
                  subscriptions={subscriptions} 
                  chartTitle={isAdminPortal ? "Clinician Subscription Analysis" : "Subscription Analysis"}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                {/* <StyledTableContainer component={Paper} className='px-4 pt-3'> */}
                <StyledTableContainer component={Paper} className='p-0'>
                  <TableHeaderBox>
                    <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
                      Subscription Details
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
                  <StyledTable aria-label="clinician subscription table">
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                        <StyledHeaderCell align="center">Patient</StyledHeaderCell>
                        <StyledHeaderCell align="center">Clinician</StyledHeaderCell>
                        <StyledHeaderCell align="center">Subscribed Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">End Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">Plan</StyledHeaderCell>
                        <StyledHeaderCell align="center">Remaining Days</StyledHeaderCell>
                        <StyledHeaderCell align="center">Renewals</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sub, index) => (
                        <StyledTableRow key={sub.id}>
                          <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                          <StyledTableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <StyledAvatar src={sub.image} alt={sub.name}>
                                {sub.name.charAt(0)}
                              </StyledAvatar>
                              {sub.name}
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="center">{sub.clinician}</StyledTableCell>
                          <StyledTableCell align="center">{sub.subscribedDate}</StyledTableCell>
                          <StyledTableCell align="center">{sub.endDate}</StyledTableCell>
                          <StyledTableCell align="center">{sub.plan}</StyledTableCell>
                          <StyledTableCell align="center">{sub.remainingDays}</StyledTableCell>
                          <StyledTableCell align="center">
                            {sub.renewals.length > 0 ? sub.renewals[sub.renewals.length - 1] : 'No Renewals'}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    component="div"
                    count={subscriptions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}
