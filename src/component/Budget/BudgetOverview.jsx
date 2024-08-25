import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaDollarSign, FaChartLine, FaCoins } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import './BudgetAnalysis.scss';
import Card_circle from '../../assets/circle.svg';

const dummyData = [
  {
    id: 1,
    avatar: 'https://example.com/avatar1.jpg',
    name: 'John Doe',
    subscriptionType: 'Portal',
    amount: 10000,
    date: '2024-01-01',
    plan: 'Monthly'
  },
  {
    id: 2,
    avatar: 'https://example.com/avatar2.jpg',
    name: 'Jane Doe',
    subscriptionType: 'Clinician',
    amount: 5000,
    date: '2024-02-01',
    plan: 'Yearly'
  },
  // Add more dummy data here
];

const BudgetAnalysis = () => {
  const [earnings, setEarnings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulating API call to fetch earnings
    setEarnings(dummyData); // Use dummy data
  }, []);

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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Earnings',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  const chartSeries = [
    {
      name: 'Portal Earnings',
      data: [12000, 11000, 9000, 10000, 8500, 12000, 11500, 13000, 14000, 15000, 16000, 17000],
    },
    {
      name: 'Clinician Earnings',
      data: [8000, 7000, 6000, 7000, 6500, 8000, 7500, 8000, 8500, 9000, 9500, 10000],
    },
  ];

  return (
    <div className="budget-analysis">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-chart-line"></i>
          </span> Budget Analysis
        </h3>
        <span>
          Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
        </span>
      </div>

      <Container fluid>
        {/* First Row: Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-primary text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <FaDollarSign className="fs-1 me-3" />
                <div>
                  <h4 className="font-weight-normal mb-3">Total Portal Earnings</h4>
                  <h2 className="mb-0">$12,000</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-success text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <FaChartLine className="fs-1 me-3" />
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <div>
                  <h4 className="font-weight-normal mb-3">Total Clinician Earnings</h4>
                  <h2 className="mb-0">$5,000</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="bg-gradient-info text-white card-img-holder">
              <Card.Body className="d-flex align-items-center">
                <FaCoins className="fs-1 me-3" />
                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                <div>
                  <h4 className="font-weight-normal mb-3">Total Earnings</h4>
                  <h2 className="mb-0">$17,000</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Second Row: Stacked Column Chart */}
        <Row className="mb-4">
          <Col>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">Budget Analysis Overview</Card.Header>
              <Card.Body>
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Third Row: Table */}
        <Row>
          <Col>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="budget table">
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Subscription Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Plan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earnings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((earning) => (
                    <TableRow key={earning.id}>
                      <TableCell>
                        <Avatar alt={earning.name} src={earning.avatar} />
                      </TableCell>
                      <TableCell>{earning.name}</TableCell>
                      <TableCell>{earning.subscriptionType}</TableCell>
                      <TableCell>${earning.amount}</TableCell>
                      <TableCell>{earning.date}</TableCell>
                      <TableCell>{earning.plan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={earnings.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BudgetAnalysis;
