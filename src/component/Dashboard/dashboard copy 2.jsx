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
    Backdrop,
    Typography,
    Box
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import './Dashboard_organization.css';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
    borderRadius: theme.shape.borderRadius * 3,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

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
//     '&:nth-of-type(odd)': {
//         backgroundColor: alpha(theme.palette.primary.light, 0.05),
//     },
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.primary.light, 0.1),
//         transform: 'translateY(-2px)',
//         boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//     },
//     transition: 'all 0.3s ease',
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
    },
    '&:hover': {
        backgroundColor: 'white',
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    borderRadius: '20px',
    padding: '0 10px',
    height: 28,
    fontSize: '0.75rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
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
                                selection: false,
                                zoom: false,
                                zoomin: false,
                                zoomout: false,
                                pan: false,
                                reset: false
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
                    // title: {
                    //     text: 'Monthly Earnings',
                    //     align: 'center'
                    // },
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
            // Dummy data for admins and managers
            // admins: [
            //     {
            //         organization: "Tech Innovators",
            //         name: "John Doe",
            //         email: "john.doe@techinnovators.com",
            //         avatar: "https://randomuser.me/api/portraits/men/1.jpg" // Sample avatar URL
            //     },
            //     {
            //         organization: "Creative Solutions",
            //         name: "Jane Smith",
            //         email: "jane.smith@creativesolutions.com",
            //         avatar: "https://randomuser.me/api/portraits/women/2.jpg"
            //     },
            //     {
            //         organization: "Health Corp",
            //         name: "Robert Johnson",
            //         email: "robert.johnson@healthcorp.com",
            //         avatar: "https://randomuser.me/api/portraits/men/3.jpg"
            //     },
            //     {
            //         organization: "Health Corp",
            //         name: " Johnson",
            //         email: "johnson@healthcorp.com",
            //         avatar: "https://randomuser.me/api/portraits/men/4.jpg"
            //     }
            // ],
            managers: [],
            isLoading: true,
            error: null,
            subscriptionData: {
                options: {
                    chart: {
                        type: 'area',
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
                                    filename: 'Subscription Trends Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Subscriptions',
                                },
                                svg: {
                                    filename: 'Subscription Trends Chart',
                                },
                                png: {
                                    filename: 'Subscription Trends Chart',
                                }
                            },
                            autoSelected: 'zoom'
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    colors: ['#4CAF50'],
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            stops: [0, 90, 100]
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: [],
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Subscriptions',
                            style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: 'Roboto, sans-serif'
                            }
                        }
                    },
                    grid: {
                        borderColor: '#f1f1f1',
                    },
                    tooltip: {
                        theme: 'dark'
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: []
                }]
            },
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
            userRole: sessionStorage.getItem('role') || ''
        };
        // Refs for charts and table
        this.clinicianStatusChartRef = React.createRef();
        this.subscriptionTrendsChartRef = React.createRef();
        this.subscriptionComparisonChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
        this.patientStatusTableRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllData();
    }

    fetchAllData = async () => {
        this.setState({ isLoading: true });
        try {
            await Promise.all([
                this.fetchManagers(),
                this.fetchSubscriptions(),
                this.fetchClinicians(),
                this.fetchEarnings(),
                this.fetchCounts()
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

    fetchSubscriptions = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/organization/subscriptions';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processSubscriptionData(response.data.body);
            } else {
                throw new Error("Failed to fetch subscription data");
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            this.setState({ error: error.message, isLoading: false });
        }
    }

    processSubscriptionData = (data) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const subscriptionCounts = new Array(12).fill(0);

        data.forEach(subscription => {
            const date = new Date(subscription.createdAt);
            const month = date.getMonth();
            subscriptionCounts[month]++;
        });

        this.setState(prevState => ({
            subscriptionData: {
                ...prevState.subscriptionData,
                options: {
                    ...prevState.subscriptionData.options,
                    xaxis: {
                        categories: monthNames
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: subscriptionCounts
                }]
            },
            isLoading: false
        }));
    }

    fetchClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = 'https://rough-1-gcic.onrender.com/api/organization/doctors';

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
        const activeClinicians = data.filter(clinician => clinician.Active === "yes").length;
        const inactiveClinicians = data.length - activeClinicians;

        this.setState(prevState => ({
            clinicianStatusData: {
                ...prevState.clinicianStatusData,
                series: [activeClinicians, inactiveClinicians]
            },
            isLoadingClinicians: false
        }));
    }

    fetchEarnings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const response = await axios.get('https://rough-1-gcic.onrender.com/api/organization/earnings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processEarningsData(response.data.body);
            } else {
                throw new Error("Failed to fetch earnings data");
            }
        } catch (error) {
            this.setState({ earningsError: error.message, isLoadingEarnings: false });
        }
    }

    processEarningsData = (data) => {
        const { monthlyEarnings, periodTotal, allTimeTotal, currentYearTotal } = data;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const months = Object.keys(monthlyEarnings).map(key => {
            const [year, month] = key.split('-');
            return `${monthNames[parseInt(month) - 1]} `;
        });
        const earnings = Object.values(monthlyEarnings);

        this.setState(prevState => ({
            budgetAnalysisData: {
                ...prevState.budgetAnalysisData,
                options: {
                    ...prevState.budgetAnalysisData.options,
                    xaxis: {
                        categories: months
                    }
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: earnings
                }]
            },
            totalEarnings: {
                periodTotal,
                allTimeTotal,
                currentYearTotal
            },
            isLoadingEarnings: false
        }));
    }

    fetchCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const [doctorsResponse, subscriptionsResponse, earningsResponse, patientsResponse] = await Promise.all([
                axios.get('https://rough-1-gcic.onrender.com/api/organization/doctors/count', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/organization/subscriptions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/organization/earnings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('https://rough-1-gcic.onrender.com/api/organization/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            this.setState({
                counts: {
                    totalPatients: patientsResponse.data.body.length, // Assuming the API returns an array of patients
                    totalDoctors: doctorsResponse.data.body.total,
                    totalSubscriptions: subscriptionsResponse.data.body.length, // Assuming this returns an array of subscriptions
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
        this.props.navigate('/subscription-management/clinician');
    }

    handleViewClinicians = () => {
        this.props.navigate('/clinician-management/view');
    }

    handleViewBudget = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    render() {
        const { managers, isLoading, error, subscriptionData, clinicianStatusData, isLoadingClinicians, clinicianError, budgetAnalysisData, isLoadingEarnings, earningsError, totalEarnings, counts, isLoadingCounts, countsError, userRole } = this.state;

        // Sort managers by joined date (most recent first) and take the top 5
        const recentManagers = [...managers]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const cardHeaderStyle = {
            background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
            color: 'white',
        };

        return (
            <div className='p-3'>
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
                                        {isLoadingCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : countsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">{counts.totalDoctors}</h3>
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
                                        {isLoadingCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : countsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">{counts.totalSubscriptions}</h3>
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
                                        {isLoadingCounts ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : countsError ? (
                                            <p>Error loading data</p>
                                        ) : (
                                            <h3 className="mb-4">$ {counts.totalEarnings.toFixed(2)}</h3>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-lg-7 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Trends</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewSubscriptions}
                                        >
                                            View All
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : error ? (
                                            <p>Error: {error}</p>
                                        ) : (
                                            <div ref={this.subscriptionTrendsChartRef}>
                                                <ApexCharts
                                                    options={subscriptionData.options}
                                                    series={subscriptionData.series}
                                                    type="area"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
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
                                                    height={380}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

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
                                        >
                                            View All
                                        </Button>
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

                        {userRole !== 'manager' && (
                            <div className="row">
                                <div className="col-12 mb-4">
                                    <StyledTableContainer component={Paper} elevation={3}>
                                        <TableHeaderBox>
                                            <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                                                Recent Managers
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                startIcon={<Icon path={mdiEye} size={0.8} />}
                                                onClick={this.handleViewAllClick}
                                            >
                                                View All
                                            </Button>
                                        </TableHeaderBox>
                                        {isLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : error ? (
                                            <Box sx={{ p: 3 }}>
                                                <Typography color="error">Error: {error}</Typography>
                                            </Box>
                                        ) : (
                                            <StyledTable>
                                                <StyledTableHead>
                                                    <TableRow>
                                                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Name</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Mobile</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Joined Date</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Status</StyledHeaderCell>
                                                    </TableRow>
                                                </StyledTableHead>
                                                <TableBody>
                                                    {recentManagers.map((manager, index) => (
                                                        <StyledTableRow key={manager._id}>
                                                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                                    <StyledAvatar
                                                                        src={manager.image}
                                                                        alt={manager.name}
                                                                    >
                                                                        {manager.name.charAt(0)}
                                                                    </StyledAvatar>
                                                                    <Typography variant="body1" style={{ marginLeft: '10px' }}>
                                                                        {manager.name}
                                                                    </Typography>
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center" className='text-primary'>{manager.email}</StyledTableCell>
                                                            <StyledTableCell align="center">{manager.mobile || 'N/A'}</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                {new Date(manager.createdAt).toLocaleDateString()}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <StyledChip
                                                                    label={manager.Active === 'yes' ? 'Active' : 'Inactive'}
                                                                    color={manager.Active === 'yes' ? 'success' : 'error'}
                                                                    variant="outlined"
                                                                />
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </StyledTable>
                                        )}
                                    </StyledTableContainer>
                                </div>
                            </div>
                        )}
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