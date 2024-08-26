import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import ApexCharts from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Icon from '@mdi/react';
// import { mdiDoctor } from '@mdi/js';
import { mdiHome, mdiDoctor, mdiAlertCircleOutline, mdiAccount, mdiDiamond, mdiCashMultiple, mdiDownload } from '@mdi/js';
import Card_circle from '../../assets/circle.svg'
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Avatar,
//   IconButton,
//   Menu,
//   MenuItem,
//   Button,
//   Modal,
//   TextField,
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   TablePagination,
// } from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,

} from "@mui/material";
import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visitSaleData: {
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                        zoom: {
                            enabled: true
                        },
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            type: "vertical",
                            shadeIntensity: 1,
                            gradientToColors: ['#4CAF50', '#FF9800', '#F44336'],
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                        }
                    },
                    xaxis: {
                        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
                    },
                    legend: {
                        position: 'top',
                    },
                },
                series: [{
                    name: 'Subscriptions',
                    data: [20, 40, 15, 35, 25, 50, 30, 20]
                }
                ]
            },
            patientStatusData: {
                options: {
                    chart: {
                        type: 'donut',
                        height: 350,
                        // width: 1850,
                    },
                    labels: ['Healthy', 'At Risk', 'Critical'],
                    colors: ["#4EE6C9", "#DC526C", "#87EF9D"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
                series: [50, 30, 20],
            },
            subscriptionComparisonData: {
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            type: "vertical",
                            shadeIntensity: 1,
                            gradientToColors: ['#36A2EB', '#FF6384'],
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                        }
                    },
                    xaxis: {
                        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
                series: [
                    {
                        name: 'Portal Subscriptions',
                        data: [30, 50, 25, 45, 35, 60, 40, 30],
                    },
                    {
                        name: 'Clinician Subscriptions',
                        data: [20, 40, 15, 35, 25, 50, 30, 20],
                    }
                ],
            },
            budgetAnalysisData: {
                options: {
                    chart: {
                        type: 'bar',
                        height: 350,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                        },
                    },
                    xaxis: {
                        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
                    },
                    fill: {
                        opacity: 1
                    },
                    dataLabels: {
                        enabled: false
                    },
                    legend: {
                        position: 'top',
                    },
                },
                series: [
                    {
                        name: 'Portal Subscriptions Budget',
                        data: [6000, 10000, 5000, 9000, 7000, 12000, 8000, 6000],
                    },
                    {
                        name: 'Clinician Subscriptions Budget',
                        data: [6000, 12000, 4500, 10500, 7500, 15000, 9000, 6000],
                    }
                ],
                patientDetails: [
                    { id: 1, name: 'John Doe', issue: 'Anxiety disorders', subscriptionType: 'Portal', startDate: '2023-01-10', endDate: '2024-01-10', assignedDoctor: 'Dr. Smith', status: 'Healthy' },
                    { id: 2, name: 'Jane Roe', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                    { id: 3, name: 'Sam Green', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
                    { id: 4, name: 'Jamie', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                    { id: 5, name: 'Sersi', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
                ],
            },
        };
        this.patientStatusChartRef = React.createRef();
        this.subscriptionTrendsChartRef = React.createRef();
        this.subscriptionComparisonChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
        this.patientStatusTableRef = React.createRef();
    }
    // statusMappings = {
    //   'Healthy': { percentage: 100, color: '#4CAF50' }, // Green
    //   'At Risk': { percentage: 50, color: '#FF9800' }, // Orange
    //   'Critical': { percentage: 25, color: '#F44336' } // Red
    // };

    downloadChart = (chartRef, fileName) => {
        const chartElement = chartRef.current.querySelector('.apexcharts-canvas');
        html2canvas(chartElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save(`${fileName}.pdf`);
        });
    };

    render() {
        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white mr-2">
                            <i className="mdi mdi-home fs-5"></i>
                            {/* <Icon path={mdiHome} size={1} className="float-right icon-hover" />  */}
                            </span> Dashboard </h3>
                    <nav aria-label="breadcrumb">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page">
                                <span></span>Overview <Icon path={mdiAlertCircleOutline} size={0.6} className="float-right icon-hover" />
                                {/* <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i> */}

                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-lg-3 stretch-card grid-margin">
                        <div className="card bg-gradient-success card-img-holder text-white">
                            <div className="card-body">
                                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-3">Active Patients
                                    {/* <i className="mdi mdi-account mdi-24px float-right"></i> */}
                                    <Icon path={mdiAccount} size={1} className="float-right icon-hover" />

                                </h4>
                                <h2 className="mb-5">41</h2>
                                <h6 className="card-text">Increased by 5%</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 stretch-card grid-margin">
                        <div className="card bg-gradient-dark card-img-holder text-white">
                            <div className="card-body">
                                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-3">Active Doctors
                                    <Icon path={mdiDoctor} size={1} className="float-right icon-hover" />
                                </h4>
                                <h2 className="mb-5">14</h2>
                                <h6 className="card-text">Increased by 5%</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 stretch-card grid-margin">
                        <div className="card bg-gradient-info card-img-holder text-white">
                            <div className="card-body">
                                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-3">Total Subscriptions
                                    {/* <i className="mdi mdi-diamond  mdi-24px float-right"></i> */}
                                    <Icon path={mdiDiamond} size={1} className="float-right icon-hover" />

                                </h4>
                                <h2 className="mb-5">1,234</h2>
                                <h6 className="card-text">Decreased by 10%</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 stretch-card grid-margin">
                        <div className="card bg-gradient-danger card-img-holder text-white">
                            <div className="card-body">
                                <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-3">Earnings
                                    {/* <i className="mdi mdi-cash-multiple mdi-24px float-right"></i> */}
                                    <Icon path={mdiCashMultiple} size={1} className="float-right icon-hover" />

                                </h4>
                                <h2 className="mb-5">$ 15,000</h2>
                                <h6 className="card-text">Increased by 60%</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-7 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className='card-head'>
                                    <h4 className="card-title">Subscription Trends</h4>
                                    <button
                                        className="btn btn-icon btn-rounded float-right"
                                        onClick={() => this.downloadChart(this.patientStatusChartRef, 'visit-sales-chart')}
                                    >

                                    </button>
                                </div>
                                <div ref={this.patientStatusChartRef}>
                                    <ApexCharts
                                        options={this.state.visitSaleData.options}
                                        series={this.state.visitSaleData.series}
                                        type="line"
                                        height={350}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className='card-head'>
                                    <h4 className="card-title">Patient Status Overview</h4>
                                    <button
                                        className="btn btn-icon btn-rounded float-right"
                                        onClick={() => this.downloadChart(this.patientStatusChartRef, 'patient-status-chart')}
                                    >

                                    </button>
                                </div>
                                <div ref={this.patientStatusChartRef}>
                                    <ApexCharts
                                        options={this.state.patientStatusData.options}
                                        series={this.state.patientStatusData.series}
                                        type="donut"
                                        height={380}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className='card-head'>
                                    <h4 className="card-title">Subscription Comparison</h4>
                                    <button
                                        className="btn btn-icon btn-rounded float-right"
                                        onClick={() => this.downloadChart(this.subscriptionComparisonChartRef, 'subscription-comparison-chart')}
                                    >

                                    </button>
                                </div>
                                <div ref={this.subscriptionComparisonChartRef}>
                                    <ApexCharts
                                        options={this.state.subscriptionComparisonData.options}
                                        series={this.state.subscriptionComparisonData.series}
                                        type="line"
                                        height={350}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className='card-head'>
                                    <h4 className="card-title">Subscription & Budget Analysis</h4>
                                    <button
                                        className="btn btn-icon btn-rounded float-right"
                                        onClick={() => this.downloadChart(this.budgetAnalysisChartRef, 'budget-analysis-chart')}
                                    >

                                    </button>
                                </div>
                                <div ref={this.budgetAnalysisChartRef}>
                                    <ApexCharts
                                        options={this.state.budgetAnalysisData.options}
                                        series={this.state.budgetAnalysisData.series}
                                        type="bar"
                                        height={350}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Patient Details</h4>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Patient Name</TableCell>
                                                <TableCell align="right">Issue</TableCell>
                                                <TableCell align="right">Subscription Type</TableCell>
                                                <TableCell align="right">Start Date</TableCell>
                                                <TableCell align="right">End Date</TableCell>
                                                <TableCell align="right">Assigned Doctor</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.budgetAnalysisData.patientDetails.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.issue}</TableCell>
                                                    <TableCell align="right">{row.subscriptionType}</TableCell>
                                                    <TableCell align="right">{row.startDate}</TableCell>
                                                    <TableCell align="right">{row.endDate}</TableCell>
                                                    <TableCell align="right">{row.assignedDoctor}</TableCell>
                                                    <TableCell align="right">{row.status}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
