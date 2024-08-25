import React from 'react';
// import ReactApexChart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';

import { Card } from 'react-bootstrap';

const ClinicianSubscriptionCharts = () => {
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
        text: 'Subscriptions',
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
      name: 'Active Subscriptions',
      data: [25, 35, 20, 45, 40, 55, 65, 80, 100, 120, 140, 160],
    },
    {
      name: 'Renewals',
      data: [15, 25, 18, 30, 28, 40, 50, 65, 85, 95, 110, 130],
    },
    {
      name: 'Ended Subscriptions',
      data: [7, 12, 10, 18, 15, 22, 27, 30, 40, 55, 70, 85],
    },
  ];

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">Clinician Subscription Overview</Card.Header>
      <Card.Body>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default ClinicianSubscriptionCharts;
