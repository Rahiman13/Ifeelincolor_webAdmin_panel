import React, { Component } from 'react';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Icon from '@mdi/react';
import { mdiHome, mdiDoctor, mdiAlertCircleOutline, mdiAccount, mdiDiamond, mdiCashMultiple, mdiDownload, mdiEye } from '@mdi/js';
import Card_circle from '../../assets/circle.svg'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Avatar,
    Chip,
    Button,
    Backdrop
} from "@mui/material";
import { styled } from '@mui/material/styles';
import './Dashboard_organization.css';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import moment from 'moment'; // Make sure to install and import moment.js


// Styled components for a fancier table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    '&.MuiTableCell-body': {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Existing data
            // visitSaleData: {
            //     options: {
            //         chart: {
            //             type: 'line',
            //             height: 350,
            //             zoom: {
            //                 enabled: true
            //             },
            //         },
            //         stroke: {
            //             curve: 'smooth'
            //         },
            //         fill: {
            //             type: 'gradient',
            //             gradient: {
            //                 shade: 'dark',
            //                 type: "vertical",
            //                 shadeIntensity: 1,
            //                 gradientToColors: ['#4CAF50', '#FF9800', '#F44336'],
            //                 opacityFrom: 0.7,
            //                 opacityTo: 0.9,
            //             }
            //         },
            //         xaxis: {
            //             categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
            //         },
            //         legend: {
            //             position: 'top',
            //         },
            //         responsive: [{
            //             breakpoint: 480,
            //             options: {
            //                 chart: {
            //                     width: '100%',
            //                     height: 300
            //                 },
            //                 legend: {
            //                     position: 'bottom'
            //                 }
            //             }
            //         }]
            //     },
            //     series: [{
            //         name: 'Subscriptions',
            //         data: [20, 40, 15, 35, 25, 50, 30, 20]
            //     }]
            // },
            clinicianStatusData: {
                options: {
                    chart: {
                        type: 'donut',
                        height: 380,
                        toolbar: {
                            show: true,
                            tools: {
                                download: true,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Clinician Status Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Status',
                                    headerValue: 'Value',
                                },
                                svg: {
                                    filename: 'Clinician Status Chart',
                                },
                                png: {
                                    filename: 'Clinician Status Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    labels: ['Active', 'Inactive'],
                    colors: ["#4EE6C9", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
                series: [0, 0], // Initialize with zeros
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
                    // {
                    //     name: 'Portal Subscriptions',
                    //     data: [30, 50, 25, 45, 35, 60, 40, 30],
                    // },
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
                        toolbar: {
                            show: true,
                            tools: {
                                download: true,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Earning Analysis Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Earnings',
                                },
                                svg: {
                                    filename: 'Earning Analysis Chart',
                                },
                                png: {
                                    filename: 'Earning Analysis Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                        },
                    },
                    xaxis: {
                        categories: [],
                    },
                    yaxis: {
                        title: {
                            text: 'Earnings ($)'
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    dataLabels: {
                        enabled: false
                    },
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: []
                }]
            },
            patientDetails: [
                { id: 1, name: 'John Doe', issue: 'Anxiety disorders', subscriptionType: 'Portal', startDate: '2023-01-10', endDate: '2024-01-10', assignedDoctor: 'Dr. Smith', status: 'Healthy' },
                { id: 2, name: 'Jane Roe', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 3, name: 'Sam Green', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
                { id: 4, name: 'Jamie', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 5, name: 'Sersi', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
            ],

            managers: [],
            isLoading: true,
            error: null,
            isLoadingClinicians: true,
            clinicianError: null,
            isLoadingEarnings: true,
            earningsError: null,
            totalEarnings: {
                periodTotal: 0,
                allTimeTotal: 0,
                currentYearTotal: 0
            },
            counts: {
                totalPatients: 0,
                totalDoctors: 0,
                totalSubscriptions: 0,
                totalEarnings: 0
            },
            isLoadingCounts: true,
            countsError: null,
            userRole: sessionStorage.getItem('role') || '',
            subscriptionCounts: {
                activeSubscriptions: 0,
                renewalSubscriptions: 0,
                endedSubscriptions: 0,
                totalSubscriptions: 0
            },
            isLoadingSubscriptionCounts: true,
            subscriptionCountsError: null,
            clinicianCounts: {
                totalClinicians: 0,
                activeClinicians: 0,
                inactiveClinicians: 0
            },
            isLoadingClinicianCounts: true,
            clinicianCountsError: null,
            earningsData: {
                monthlyEarnings: {},
                totalEarningsThisYear: 0,
                allTimeEarnings: 0
            },
            subscriptionTrendsData: {
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
                    xaxis: {
                        type: 'category',
                        categories: [],
                        tickAmount: 12,
                        labels: {
                            // rotate: -45,
                            rotateAlways: true,
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Subscriptions'
                        }
                    },
                    // title: {
                    //     text: 'Subscription Trends (Last 12 Months)',
                    //     align: 'left'
                    // },
                },
                series: [{
                    name: 'Subscriptions',
                    data: []
                }]
            },
            isLoadingSubscriptionTrends: true,
            subscriptionTrendsError: null,
        };
        // Refs for charts and table
        this.clinicianStatusChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
        this.subscriptionTrendsChartRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllData();
    }

    fetchAllData = async () => {
        this.setState({ isLoading: true });
        try {
            await Promise.all([
                // this.fetchManagers(),
                this.fetchClinicians(),
                this.fetchEarnings(),
                this.fetchCounts(),
                this.fetchSubscriptionCounts(),
                this.fetchClinicianCounts(),
                this.fetchSubscriptionTrends(),
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    fetchManagers = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Get the token from session storage
            if (!token) {
                throw new Error("No authorization token found");
            }

            const response = await axios.get('https://rough-1-gcic.onrender.com/api/organization/managers', {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                }
            });

            if (response.data.status === "success") {
                this.setState({ managers: response.data.body, isLoading: false });
            } else {
                throw new Error("Failed to fetch managers");
            }
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    }

    fetchClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/manager/clinicians-created';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processClinicianData(response.data.body);
            } else {
                throw new Error("Failed to fetch clinician data");
            }
        } catch (error) {
            this.setState({ clinicianError: error.message, isLoadingClinicians: false });
        }
    }

    processClinicianData = (data) => {
        console.log('Clinician Data:', data);

        // Check if data exists and is an array
        if (!data || !Array.isArray(data) || data.length === 0) {
            // Set default empty state with "No Data" message
            this.setState(prevState => ({
                clinicianStatusData: {
                    options: {
                        ...prevState.clinicianStatusData.options,
                        chart: {
                            ...prevState.clinicianStatusData.options.chart,
                            type: 'donut',
                        },
                        labels: ['No Data'],
                        colors: ["#E0E0E0"], // Gray color for empty state
                        dataLabels: {
                            enabled: true,
                        },
                        legend: {
                            position: 'bottom',
                        },
                        noData: {
                            text: 'No Clinician Data Available',
                            align: 'center',
                            verticalAlign: 'middle',
                            style: {
                                fontSize: '16px',
                                color: '#666'
                            }
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }]
                    },
                    series: [1] // Single value for empty state
                },
                isLoadingClinicians: false
            }));
            return;
        }

        // Process data if it exists
        const activeClinicians = data.filter(clinician => clinician.Active === "yes").length;
        const inactiveClinicians = data.length - activeClinicians;

        console.log('Active:', activeClinicians, 'Inactive:', inactiveClinicians);

        this.setState(prevState => ({
            clinicianStatusData: {
                options: {
                    ...prevState.clinicianStatusData.options,
                    chart: {
                        ...prevState.clinicianStatusData.options.chart,
                        type: 'donut',
                    },
                    labels: ['Active', 'Inactive'],
                    colors: ["#4EE6C9", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                    noData: {
                        text: 'No Clinician Data Available',
                        align: 'center',
                        verticalAlign: 'middle',
                        style: {
                            fontSize: '16px',
                            color: '#666'
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [activeClinicians, inactiveClinicians]
            },
            isLoadingClinicians: false
        }));
    };

    fetchEarnings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/manager/earnings';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { monthlyEarnings, currentYearTotal, allTimeTotal } = response.data.body;

                this.setState({
                    earningsData: {
                        monthlyEarnings,
                        totalEarningsThisYear: currentYearTotal,
                        allTimeEarnings: allTimeTotal
                    },
                    isLoadingEarnings: false
                });

                this.updateBudgetAnalysisChart(monthlyEarnings);
            } else {
                throw new Error("Failed to fetch earnings data");
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
            this.setState({
                earningsError: error.message,
                isLoadingEarnings: false
            });
        }
    };

    updateBudgetAnalysisChart = (monthlyEarnings) => {
        const months = Object.keys(monthlyEarnings).map(key => {
            const [year, month] = key.split('-');
            return `${this.getMonthName(parseInt(month))} ${year}`;
        });
        
        const earnings = Object.values(monthlyEarnings);

        this.setState(prevState => ({
            budgetAnalysisData: {
                ...prevState.budgetAnalysisData,
                options: {
                    ...prevState.budgetAnalysisData.options,
                    chart: {
                        ...prevState.budgetAnalysisData.options.chart,
                        type: 'bar',
                        height: 350,
                        toolbar: {
                            show: true,
                            tools: {
                                download: true,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Earning Analysis Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Earnings',
                                },
                                svg: {
                                    filename: 'Earning Analysis Chart',
                                },
                                png: {
                                    filename: 'Earning Analysis Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    xaxis: {
                        categories: months,
                        labels: {
                            rotate: -45,
                            rotateAlways: true,
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Earnings ($)'
                        },
                        labels: {
                            formatter: (value) => `$${value.toFixed(2)}`
                        }
                    }
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: earnings
                }]
            }
        }));
    };

    getMonthName = (monthNumber) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[monthNumber - 1];
    };

    fetchCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const [doctorsResponse, subscriptionsResponse, earningsResponse, patientsResponse] = await Promise.all([
                axios.get('https://rough-1-gcic.onrender.com/api/manager/clinicians-counts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/manager/subscriptions-counts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/manager/earnings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/manager/subscribed-patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            this.setState({
                counts: {
                    totalPatients: patientsResponse.data.body.length,
                    totalDoctors: doctorsResponse.data.body.total,
                    totalSubscriptions: subscriptionsResponse.data.body.length,
                    totalEarnings: earningsResponse.data.body.allTimeTotal
                },
                isLoadingCounts: false
            });
        } catch (error) {
            console.error('Error fetching counts:', error);
            this.setState({
                countsError: "Failed to fetch some data. Please try again later.",
                isLoadingCounts: false
            });
        }
    }

    fetchSubscriptionCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/manager/subscriptions-counts';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { validSubscriptions, renewalSubscriptions, endedSubscriptions } = response.data.body;
                const totalSubscriptions = validSubscriptions + endedSubscriptions;

                this.setState({
                    subscriptionCounts: {
                        activeSubscriptions: validSubscriptions,
                        renewalSubscriptions,
                        endedSubscriptions,
                        totalSubscriptions
                    },
                    isLoadingSubscriptionCounts: false
                });
            } else {
                throw new Error("Failed to fetch subscription counts");
            }
        } catch (error) {
            console.error('Error fetching subscription counts:', error);
            this.setState({
                subscriptionCountsError: error.message,
                isLoadingSubscriptionCounts: false
            });
        }
    };

    fetchClinicianCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/manager/clinicians-counts';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { totalClinisists, activeClinisists, inactiveClinisists } = response.data.body;
                this.setState({
                    clinicianCounts: {
                        totalClinicians: totalClinisists,
                        activeClinicians: activeClinisists,
                        inactiveClinicians: inactiveClinisists
                    },
                    isLoadingClinicianCounts: false
                });
            } else {
                throw new Error("Failed to fetch clinician counts");
            }
        } catch (error) {
            console.error('Error fetching clinician counts:', error);
            this.setState({
                clinicianCountsError: error.message,
                isLoadingClinicianCounts: false
            });
        }
    };

    fetchSubscriptionTrends = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/manager/subscriptions';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processSubscriptionTrendsData(response.data.body);
            } else {
                throw new Error("Failed to fetch subscription trends data");
            }
        } catch (error) {
            console.error('Error fetching subscription trends:', error);
            this.setState({
                subscriptionTrendsError: error.message,
                isLoadingSubscriptionTrends: false
            });
        }
    };

    processSubscriptionTrendsData = (data) => {
        const endDate = moment();
        const startDate = moment().subtract(11, 'months').startOf('month');
        const monthsArray = [];
        const subscriptionCounts = new Array(12).fill(0);

        // Generate array of last 12 months
        for (let i = 0; i < 12; i++) {
            monthsArray.push(moment(startDate).add(i, 'months').format('MMM YYYY'));
        }

        data.forEach(subscription => {
            const createdDate = moment(subscription.createdAt);
            if (createdDate.isBetween(startDate, endDate, null, '[]')) {
                const monthIndex = createdDate.diff(startDate, 'months');
                subscriptionCounts[monthIndex]++;
            }
        });

        this.setState(prevState => ({
            subscriptionTrendsData: {
                ...prevState.subscriptionTrendsData,
                options: {
                    ...prevState.subscriptionTrendsData.options,
                    xaxis: {
                        ...prevState.subscriptionTrendsData.options.xaxis,
                        categories: monthsArray
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: subscriptionCounts
                }]
            },
            isLoadingSubscriptionTrends: false
        }));
    };

    // statusMappings = {
    //   'Healthy': { percentage: 100, color: '#4CAF50' }, // Green
    //   'At Risk': { percentage: 50, color: '#FF9800' }, // Orange
    //   'Critical': { percentage: 25, color: '#F44336' } // Red
    // };

    handleViewAllClick = () => {
        this.props.navigate('/managers-management/view');
    }

    downloadChart = (chartRef, fileName) => {
        const chartElement = chartRef.current.querySelector('.apexcharts-canvas');
        html2canvas(chartElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save(`${fileName}.pdf`);
        });
    };

    handleViewSubscriptions = () => {
        this.props.navigate('/subscription-management/organization_portal');
    }

    handleViewClinicians = () => {
        this.props.navigate('/clinician-management/view');
    }

    handleViewBudget = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    render() {
        const { isLoading, error, clinicianStatusData, isLoadingClinicians, clinicianError, budgetAnalysisData, isLoadingEarnings, earningsError, counts, isLoadingCounts, countsError, subscriptionCounts, isLoadingSubscriptionCounts, subscriptionCountsError, clinicianCounts, isLoadingClinicianCounts, clinicianCountsError, earningsData, subscriptionTrendsData, isLoadingSubscriptionTrends, subscriptionTrendsError } = this.state;
        const cardHeaderStyle = {
            background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
            color: 'white',
        };

        return (
            <div className='p-3 '>
                {isLoading ? (
                    <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    <>
                        <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
                            <h3 className="page-title d-flex align-items-center">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home fs-3"></i>
                                </span> Dashboard
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb mb-0">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Overview <Icon path={mdiAlertCircleOutline} size={0.6} className="float-right icon-hover" />
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="row">
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <div className="card bg-gradient-success card-img-holder text-white" style={{ minHeight: '180px' }}>
                                    <div className="card-body">
                                        <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                        <h5 className="font-weight-normal mb-3">Total Patients
                                            <Icon path={mdiAccount} size={0.8} className="float-right icon-hover" />
                                        </h5>
                                        {isLoadingCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : countsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">{counts.totalPatients}</h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <div className="card bg-gradient-dark card-img-holder text-white" style={{ minHeight: '180px' }}>
                                    <div className="card-body">
                                        <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                        <h5 className="font-weight-normal mb-3">Total Clinicians
                                            <Icon path={mdiDoctor} size={0.8} className="float-right icon-hover" />
                                        </h5>
                                        {isLoadingClinicianCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : clinicianCountsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">{clinicianCounts.totalClinicians}</h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <div className="card bg-gradient-info card-img-holder text-white" style={{ minHeight: '180px' }}>
                                    <div className="card-body">
                                        <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                        <h5 className="font-weight-normal mb-3">Total Subscriptions
                                            <Icon path={mdiDiamond} size={0.8} className="float-right icon-hover" />
                                        </h5>
                                        {isLoadingSubscriptionCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : subscriptionCountsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">{subscriptionCounts.totalSubscriptions}</h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <div className="card bg-gradient-danger card-img-holder text-white" style={{ minHeight: '180px' }}>
                                    <div className="card-body">
                                        <img src={Card_circle} className="card-img-absolute" alt="circle" />
                                        <h5 className="font-weight-normal mb-3">Total Earnings
                                            <Icon path={mdiCashMultiple} size={0.8} className="float-right icon-hover" />
                                        </h5>
                                        {isLoadingEarnings ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : earningsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">
                                                $ {earningsData.allTimeEarnings ?
                                                    earningsData.allTimeEarnings.toLocaleString('en-US', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }) :
                                                    '0.00'
                                                }
                                            </h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Subscription Trends */}
                            <div className="col-12 col-lg-7 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Trends (Last 12 Months)</h4>
                                        <Button
                                            // className='d-flex justify-content-center m-0 px-0'
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            // startIcon={<Icon path={mdiEye} size={1.0} />}
                                            onClick={this.handleViewSubscriptions}
                                        >View All</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingSubscriptionTrends ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : subscriptionTrendsError ? (
                                            <p>Error: {subscriptionTrendsError}</p>
                                        ) : (
                                            <div ref={this.subscriptionTrendsChartRef}>
                                                <ApexCharts
                                                    options={subscriptionTrendsData.options}
                                                    series={subscriptionTrendsData.series}
                                                    type="line"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Clinician Status */}
                            <div className="col-12 col-lg-5 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Clinician Status Overview</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewClinicians}
                                        >
                                            View All
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingClinicians ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : clinicianError ? (
                                            <p>Error: {clinicianError}</p>
                                        ) : (
                                            <div ref={this.clinicianStatusChartRef}>
                                                <ApexCharts
                                                    options={clinicianStatusData.options}
                                                    series={clinicianStatusData.series}
                                                    type="donut"
                                                    width="100%"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

                        {/* Earning Analysis */}
                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Earning Analysis</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewBudget}
                                            className=''
                                        >View All</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingEarnings ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : earningsError ? (
                                            <p>Error: {earningsError}</p>
                                        ) : (
                                            <div ref={this.budgetAnalysisChartRef}>
                                                <ApexCharts
                                                    options={budgetAnalysisData.options}
                                                    series={budgetAnalysisData.series}
                                                    type="bar"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

// Wrapper component
function DashboardWithRouter(props) {
    let navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />;
}

export default DashboardWithRouter;