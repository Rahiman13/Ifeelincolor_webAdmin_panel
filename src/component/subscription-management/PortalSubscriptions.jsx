import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
import SubscriptionCharts from './PortalSubscriptionCharts';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, TablePagination } from '@mui/material';
import './PortalSubscription.scss';
import Card_circle from '../../assets/circle.svg';


const dummyData = [
  {
    id: 1,
    avatar: 'https://example.com/avatar1.jpg',
    name: 'John Doe',
    subscribedDate: '2024-01-01',
    plan: 'Yearly',
    remainingDays: 180,
    renewals: ['2024-05-15', '2024-07-15'],
    endDate: '2025-01-01',
    status: 'Active',
  },
  {
    id: 2,
    avatar: 'https://example.com/avatar2.jpg',
    name: 'Jane Doe',
    subscribedDate: '2024-02-01',
    plan: 'Monthly',
    remainingDays: 10,
    renewals: ['2024-03-01', '2024-04-01'],
    endDate: '2024-12-01',
    status: 'Pending',
  },
  {
    id: 3,
    avatar: 'https://example.com/avatar3.jpg',
    name: 'Jim Beam',
    subscribedDate: '2024-03-01',
    plan: 'Monthly',
    remainingDays: 0,
    renewals: [],
    endDate: '2024-03-31',
    status: 'Cancelled',
  },
  // Add more dummy data here
];

export default function PortalSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulate API call
    setSubscriptions(dummyData);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="portal-subscription">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-folder-multiple"></i>
          </span>
          Portal Subscription
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
                  <h4 className="font-weight-normal mb-3">Active Subscriptions</h4>
                  <h2 className="mb-0">
                    {subscriptions.filter((sub) => sub.status === 'Active').length}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-warning text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <FaRedo className="fs-1 me-3" />
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <div>
                  <h4 className="font-weight-normal mb-3">Renewals</h4>
                  <h2 className="mb-0">
                    {subscriptions.filter((sub) => sub.status === 'Pending').length}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-danger text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <FaTimesCircle className="fs-1 me-3" />
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <div>
                  <h4 className="font-weight-normal mb-3">Ended Subscriptions</h4>
                  <h2 className="mb-0">
                    {subscriptions.filter((sub) => sub.status === 'Cancelled').length}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <SubscriptionCharts subscriptions={subscriptions} />
          </Col>
        </Row>

        <Row>
          <Col>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="subscription table">
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Subscribed Date</TableCell>
                    <TableCell>End Date</TableCell>
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
                      <TableCell>{sub.plan}</TableCell>
                      <TableCell>{sub.subscribedDate}</TableCell>
                      <TableCell>{sub.endDate}</TableCell>
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

























































// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import { FiPlus } from 'react-icons/fi';
// import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
// import { Toast, ToastContainer } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import { DataGrid } from '@mui/x-data-grid';
// import '@mui/material/styles/createTheme';
// import '@mui/material/styles/ThemeProvider';
// import '@mui/material/styles/CssBaseline';
// import './PortalSubscription.scss';


// export default function PortalSubscription() {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingSubscription, setEditingSubscription] = useState(null);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   useEffect(() => {
//     // Simulate API call to fetch subscriptions
//     const fetchSubscriptions = async () => {
//       const data = [
//         { id: 1, status: 'Active', month: 'January' },
//         { id: 2, status: 'Pending', month: 'February' },
//         { id: 3, status: 'Ended', month: 'March' },
//         // Add more dummy data
//       ];
//       setSubscriptions(data);
//     };
//     fetchSubscriptions();
//   }, []);

//   const handleAddSubscription = (newSubscription) => {
//     setSubscriptions([...subscriptions, { ...newSubscription, id: Date.now() }]);
//     setShowToast(true);
//     setToastMessage('Subscription added successfully!');
//   };

//   const handleEditSubscription = (updatedSubscription) => {
//     setSubscriptions(subscriptions.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub));
//     setShowToast(true);
//     setToastMessage('Subscription updated successfully!');
//   };

//   const handleDeleteSubscription = (id) => {
//     setSubscriptions(subscriptions.filter(sub => sub.id !== id));
//     setShowToast(true);
//     setToastMessage('Subscription deleted successfully!');
//   };

//   const barChartData = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [
//       {
//         label: 'Active',
//         data: subscriptions.filter(sub => sub.status === 'Active').map(sub => sub.id),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//       },
//       {
//         label: 'Pending',
//         data: subscriptions.filter(sub => sub.status === 'Pending').map(sub => sub.id),
//         backgroundColor: 'rgba(255, 206, 86, 0.6)',
//       },
//       {
//         label: 'Ended',
//         data: subscriptions.filter(sub => sub.status === 'Ended').map(sub => sub.id),
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//       },
//     ],
//   };

//   const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'status', headerName: 'Status', width: 130 },
//     { field: 'month', headerName: 'Month', width: 130 },
//     { field: 'details', headerName: 'Details', width: 230 },
//   ];

//   const rows = subscriptions.map((sub, index) => ({
//     id: sub.id,
//     status: sub.status,
//     month: sub.month,
//     details: `Details of subscription ${index + 1}`,
//   }));

//   return (
//     <div className="portal-subscription">
//       <Container fluid className="py-5">
//         {/* First Row: Cards */}
//         <Row className="mb-4">
//           <Col md={4} className="mb-3">
//             <Card className="bg-gradient-primary text-white">
//               <Card.Body className="d-flex align-items-center">
//                 <FaCheckCircle className="fs-1 me-3" />
//                 <div>
//                   <h3 className="card-title">Active Subscriptions</h3>
//                   <p className="card-text fs-2 fw-bold">
//                     {subscriptions.filter(sub => sub.status === 'Active').length}
//                   </p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4} className="mb-3">
//             <Card className="bg-gradient-warning text-white">
//               <Card.Body className="d-flex align-items-center">
//                 <FaRedo className="fs-1 me-3" />
//                 <div>
//                   <h3 className="card-title">Renewals</h3>
//                   <p className="card-text fs-2 fw-bold">
//                     {subscriptions.filter(sub => sub.status === 'Pending').length}
//                   </p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4} className="mb-3">
//             <Card className="bg-gradient-danger text-white">
//               <Card.Body className="d-flex align-items-center">
//                 <FaTimesCircle className="fs-1 me-3" />
//                 <div>
//                   <h3 className="card-title">Ended Subscriptions</h3>
//                   <p className="card-text fs-2 fw-bold">
//                     {subscriptions.filter(sub => sub.status === 'Ended').length}
//                   </p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Second Row: Bar Chart */}
//         <Row className="mb-4">
//           <Col>
//             <div className="chart-container">
//               <Bar data={barChartData} />
//             </div>
//           </Col>
//         </Row>

//         {/* Third Row: Table */}
//         <Row>
//           <Col>
//             <div style={{ height: 400, width: '100%' }}>
//               <DataGrid rows={rows} columns={columns} pageSize={5} />
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       <ToastContainer position="bottom-end" className="p-3">
//         <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
//           <Toast.Header>
//             <strong className="me-auto">Notification</strong>
//           </Toast.Header>
//           <Toast.Body>{toastMessage}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </div>
//   );
// }
