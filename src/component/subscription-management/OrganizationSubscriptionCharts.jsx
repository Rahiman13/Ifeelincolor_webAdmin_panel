import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'react-bootstrap';

const OrganizationSubscriptionCharts = () => {
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
      data: [30, 45, 35, 50, 60, 70, 80, 95, 110, 125, 145, 165],
    },
    {
      name: 'Renewals',
      data: [20, 35, 25, 40, 50, 60, 70, 85, 95, 110, 125, 145],
    },
    {
      name: 'Ended Subscriptions',
      data: [10, 20, 15, 25, 30, 40, 50, 60, 70, 85, 100, 115],
    },
  ];

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">Organization Subscription Overview</Card.Header>
      <Card.Body>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default OrganizationSubscriptionCharts;
