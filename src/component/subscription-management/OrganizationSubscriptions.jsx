import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ToastContainer, Toast } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
import OrganizationSubscriptionCharts from './OrganizationSubscriptionCharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, TablePagination } from '@mui/material';
import './OrganizationSubscription.scss';
import Card_circle from '../../assets/circle.svg';
import { mdiOfficeBuilding } from '@mdi/js';
import Icon from '@mdi/react';

const dummyOrganizationData = [
  {
    id: 1,
    avatar: 'https://example.com/orgavatar1.jpg',
    name: 'TechCorp',
    contactPerson: 'John Doe',
    subscribedDate: '2024-01-01',
    endDate: '2025-01-01',
    plan: 'Yearly',
    remainingDays: 180,
    renewals: ['2024-05-15', '2024-07-15'],
    status: 'Active',
  },
  {
    id: 2,
    avatar: 'https://example.com/orgavatar2.jpg',
    name: 'HealthPlus',
    contactPerson: 'Jane Smith',
    subscribedDate: '2024-02-01',
    endDate: '2024-03-01',
    plan: 'Monthly',
    remainingDays: 10,
    renewals: ['2024-03-01', '2024-04-01'],
    status: 'Pending',
  },
  // Additional organization data here...
];

export default function OrganizationSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setSubscriptions(dummyOrganizationData); // Replace with API call in real use
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="organization-subscription p-3">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <Icon path={mdiOfficeBuilding} size={1} />
          </span> 
          Organization Subscription
        </h3>
        <span>
          Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
        </span>
      </div>
      <Container fluid>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-primary text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <FaCheckCircle className="fs-1 me-3" />
                <div>
                  <h3 className="card-title">Active Subscriptions</h3>
                  <p className="card-text fs-2 fw-bold">
                    {subscriptions.filter((sub) => sub.status === 'Active').length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-warning text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <FaRedo className="fs-1 me-3" />
                <div>
                  <h3 className="card-title">Renewals</h3>
                  <p className="card-text fs-2 fw-bold">
                    {subscriptions.filter((sub) => sub.status === 'Pending').length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-danger text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <FaTimesCircle className="fs-1 me-3" />
                <div>
                  <h3 className="card-title">Ended Subscriptions</h3>
                  <p className="card-text fs-2 fw-bold">
                    {subscriptions.filter((sub) => sub.status === 'Cancelled').length}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <OrganizationSubscriptionCharts subscriptions={subscriptions} />
          </Col>
        </Row>

        <Row>
          <Col>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="organization subscription table">
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Organization Name</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Subscribed Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Remaining Days</TableCell>
                    <TableCell>Renewals</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <Avatar alt={sub.name} src={sub.avatar} />
                      </TableCell>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell>{sub.contactPerson}</TableCell>
                      <TableCell>{sub.subscribedDate}</TableCell>
                      <TableCell>{sub.endDate}</TableCell>
                      <TableCell>{sub.plan}</TableCell>
                      <TableCell>{sub.remainingDays}</TableCell>
                      <TableCell>
                        {sub.renewals.length > 0 ? sub.renewals[sub.renewals.length - 1] : 'No Renewals'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={subscriptions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
