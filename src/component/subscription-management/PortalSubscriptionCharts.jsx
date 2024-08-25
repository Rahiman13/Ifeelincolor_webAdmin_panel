import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'react-bootstrap';

const SubscriptionCharts = () => {
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
      data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 140, 170, 190],
    },
    {
      name: 'Renewals',
      data: [10, 20, 15, 25, 29, 40, 50, 61, 85, 100, 120, 150],
    },
    {
      name: 'Ended Subscriptions',
      data: [5, 10, 8, 15, 14, 20, 30, 35, 45, 60, 80, 100],
    },
  ];

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">Portal Subscription Overview</Card.Header>
      <Card.Body>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default SubscriptionCharts;
