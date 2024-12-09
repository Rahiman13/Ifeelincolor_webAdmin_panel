import React, { Component } from 'react';
import ApexCharts from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Icon from '@mdi/react';
import { mdiHome, mdiDoctor, mdiAlertCircleOutline, mdiAccount, mdiDiamond, mdiCashMultiple, mdiDownload } from '@mdi/js';
import Card_circle from '../../assets/circle.svg'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    Typography,
    Box
} from "@mui/material";
import './Dashboard.css';

// Metric Card Component
const MetricCard = ({ title, value, icon, gradient, percentage }) => (
    <Card
        sx={{
            background: gradient, // Gradient as the base background
            color: 'white',
            padding: 4,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            height: '230px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition effect for hover
            '&:hover': {
                // transform: 'scale(1.05)', // Slightly scale the card on hover
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', // Add shadow on hover
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '195px',
                height: '240px',
                // backgroundImage: `url(${Card_circle})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                opacity: 0.6, // Set opacity for transparency
                zIndex: 0, // Ensure it's behind the text
            },
            zIndex: 1, // Ensure the content stays on top
        }} >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }} className='d-flex align-items-center gap-2'>
            <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
            <Typography variant="h6" fontWeight="normal">
                {title}
            </Typography>
            <Icon path={icon} size={1.2} color="rgba(255,255,255,0.8)" />
        </Box>
        <Typography variant="h4" fontWeight="bold" my={2}>
            {value}
        </Typography>
        <Typography variant="body2">
            {percentage}
        </Typography>
    </Card>
);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visitSaleData: {
                options: {
                    chart: {
                        type: 'line',
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
                        categories: [] // Initialize with an empty array
                    },
                    legend: {
                        position: 'top',
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [] // Initialize with an empty array
            },
            clinicianStatusData: {
                options: {
                    chart: {
                        type: 'donut',
                        toolbar: {
                            show: true,
                        },
                    },
                    labels: ['Active', 'Inactive'],
                    colors: ["#4EE6C9", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [] // Initialize with an empty array
            },
            subscriptionComparisonData: {
                options: {
                    chart: {
                        type: 'line',
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
                            gradientToColors: ['#36A2EB', '#FF6384', '#FEEA56'],
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
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [
                    {
                        name: 'Portal Subscriptions',
                        data: [30, 50, 25, 45, 35, 60, 40, 30],
                    },
                    {
                        name: 'Clinician Subscriptions',
                        data: [20, 40, 15, 35, 25, 50, 30, 20],
                    },
                    {
                        name: 'Organization Subscriptions',
                        data: [10, 30, 5, 25, 15, 40, 20, 10],
                    }
                ],
            },
            budgetAnalysisData: {
                options: {
                    chart: {
                        type: 'bar',
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
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [
                    {
                        name: 'Portal Subscriptions Budget',
                        data: [6000, 10000, 5000, 9000, 7000, 12000, 8000, 6000],
                    },
                    {
                        name: 'Clinician Subscriptions Budget',
                        data: [6000, 12000, 4500, 10500, 7500, 15000, 9000, 6000],
                    },
                    {
                        name: 'Organization Subscriptions Budget',
                        data: [7000, 16000, 5000, 10000, 5500, 5000, 2000, 4000],
                    }
                ],
            },
            patientDetails: [
                { id: 1, name: 'John Doe', issue: 'Anxiety disorders', subscriptionType: 'Portal', startDate: '2023-01-10', endDate: '2024-01-10', assignedDoctor: 'Dr. Smith', status: 'Healthy' },
                { id: 2, name: 'Jane Roe', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 3, name: 'Sam Green', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
                { id: 4, name: 'Jamie', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 5, name: 'Sersi', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
            ],
            totalSubscriptions: 0, // Add state for total subscriptions
            percentageIncrease: '0%', // Add state for percentage increase
            totalEarnings: 0,
            currentEarnings: 0,
            earningsPercentageIncrease: '0%', // Add state for earnings percentage increase
            activeClinicians: 0, // Add state for active clinicians
            percentageActiveClinicians: '0%' // Add state for percentage of active clinicians
        };
        this.subscriptionTrendsChartRef = React.createRef();
        this.clinicianStatusChartRef = React.createRef();
        this.subscriptionComparisonChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        this.fetchSubscriptionCounts(); // Fetch subscription counts on mount
        this.fetchEarningsData(); // Fetch earnings data on mount
        this.fetchClinicianCounts(); // Fetch clinician counts on mount
        this.fetchSubscriptionTrends(); // Fetch subscription trends on mount
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const charts = [
            this.subscriptionTrendsChartRef,
            this.clinicianStatusChartRef,
            this.subscriptionComparisonChartRef,
            this.budgetAnalysisChartRef
        ];

        charts.forEach(chartRef => {
            if (chartRef.current) {
                const chart = chartRef.current.chart;
                if (chart) {
                    chart.updateOptions({
                        chart: {
                            width: '100%',
                            height: 350
                        }
                    });
                }
            }
        });
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

    fetchSubscriptionCounts = async () => {
        const role = sessionStorage.getItem('role'); // Get role from session
        const token = sessionStorage.getItem('token'); // Get token from session

        if (role === 'Admin' && token) {
            try {
                const response = await fetch('https://rough-1-gcic.onrender.com/api/admin/subscription-counts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const totalCount = data.body.totalCount; // Get total count from response
                    const monthlyData = data.body.monthlyData; // Get monthly data for percentage calculation

                    // Calculate percentage increase based on previous month's count
                    const previousMonthCount = monthlyData[Object.keys(monthlyData)[Object.keys(monthlyData).length - 2]] || 0; // Get previous month's count
                    const percentageIncrease = previousMonthCount ? ((totalCount - previousMonthCount) / previousMonthCount) * 100 : 0;

                    this.setState({ 
                        totalSubscriptions: totalCount, // Update state with total subscriptions
                        percentageIncrease: percentageIncrease.toFixed(2) + '%' // Store percentage increase
                    });
                }
            } catch (error) {
                console.error('Error fetching subscription counts:', error);
            }
        }
    };

    fetchEarningsData = async () => {
        const role = sessionStorage.getItem('role'); // Get role from session
        const token = sessionStorage.getItem('token'); // Get token from session

        if (role === 'Admin' && token) {
            try {
                const response = await fetch('https://rough-1-gcic.onrender.com/api/admin/current-earnings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const totalEarnings= data.body.total.earnings;
                    const currentEarnings = data.body.currentMonth.earnings; // Get current month earnings
                    const previousEarnings = data.body.currentYear.earnings; // Get current year earnings for percentage calculation

                    // Calculate percentage increase based on previous earnings
                    const percentageIncrease = previousEarnings ? ((currentEarnings - previousEarnings) / previousEarnings) * 100 : 0;

                    this.setState({ 
                        totalEarnings: totalEarnings,
                        currentEarnings: currentEarnings, // Update state with total earnings
                        earningsPercentageIncrease: percentageIncrease.toFixed(2) + '%' // Store percentage increase
                    });
                }
            } catch (error) {
                console.error('Error fetching earnings data:', error);
            }
        }
    };

    fetchClinicianCounts = async () => {
        const role = sessionStorage.getItem('role'); // Get role from session
        const token = sessionStorage.getItem('token'); // Get token from session

        if (role === 'Admin' && token) {
            try {
                const response = await fetch('https://rough-1-gcic.onrender.com/api/admin/doctors-counts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const totalClinicians = data.body.total; // Get total clinicians from response
                    const activeClinicians = data.body.active; // Get active clinicians from response
                    const inactiveClinicians = data.body.inactive; // Get inactive clinicians from response

                    // Update state with active and inactive clinician counts
                    this.setState({ 
                        clinicianStatusData: {
                            ...this.state.clinicianStatusData,
                            series: [activeClinicians, inactiveClinicians] // Set series data for the donut chart
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching clinician counts:', error);
            }
        }
    };

    fetchSubscriptionTrends = async () => {
        const role = sessionStorage.getItem('role'); // Get role from session
        const token = sessionStorage.getItem('token'); // Get token from session

        if (role === 'Admin' && token) {
            try {
                const response = await fetch('https://rough-1-gcic.onrender.com/api/admin/subscription-counts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const monthlyData = data.body.monthlyData; // Get monthly data for the graph
                    const categories = Object.keys(monthlyData).map(date => {
                        const [year, month] = date.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { month: 'short' }); // Convert to 3-letter month name
                    }); // Extract months as 3-letter names
                    const seriesData = Object.values(monthlyData); // Extract subscription counts as series data

                    this.setState({ 
                        visitSaleData: {
                            ...this.state.visitSaleData,
                            options: {
                                ...this.state.visitSaleData.options,
                                xaxis: {
                                    categories: categories // Set categories for the x-axis with 3-letter month names
                                }
                            },
                            series: [{
                                name: 'Subscriptions',
                                data: seriesData // Set subscription data for the series
                            }]
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching subscription trends:', error);
            }
        }
    };

    render() {
        return (
            <div className='dashboard-container pt-3'>
                <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
                    <h3 className="page-title d-flex align-items-center">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-home fs-2"></i>
                        </span> Dashboard 
                    </h3>
                    <nav aria-label="breadcrumb" className="mt-2 mt-sm-0">
                        <ul className="breadcrumb mb-0">
                            <li className="breadcrumb-item active" aria-current="page">
                                <span>Overview</span> <Icon path={mdiAlertCircleOutline} size={0.6} className="ms-1 icon-hover icon-sm text-primary align-middle" />
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="row mt-3">
                    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
                        <MetricCard
                            title="Active Patients"
                            value="41"
                            icon={mdiAccount}
                            gradient="linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)"
                            percentage="Increased by 5%"
                        />
                        <MetricCard
                            title="Active Doctors"
                            value={this.state.activeClinicians.toString()} // Use state value for active clinicians
                            icon={mdiDoctor}
                            gradient="linear-gradient(135deg, #FFD200 0%, #F7971E 100%)"
                            percentage={`Increased by ${this.state.percentageActiveClinicians || '0%'}`} // Display calculated percentage of active clinicians
                        />
                        <MetricCard
                            title="Total Subscriptions"
                            value={this.state.totalSubscriptions.toString()} // Use state value for total subscriptions
                            icon={mdiDiamond}
                            gradient="linear-gradient(135deg, #38ef7d 0%, #11998e 100%)"
                            percentage={`Increased by ${this.state.percentageIncrease || '0%'}`} // Display calculated percentage increase
                        />
                        <MetricCard
                            title="Earnings"
                            value={`$ ${this.state.totalEarnings.toFixed(2)}`} // Use state value for total earnings
                            // value={`$ ${this.state.currentEarnings.toFixed(2)}`} // Use state value for total earnings
                            icon={mdiCashMultiple}
                            gradient="linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)"
                            percentage={`Increased by ${this.state.earningsPercentageIncrease || '0%'}`} // Display calculated percentage increase
                        />
                    </Box>
                </div>

                <div className="row pt-4">
                    <div className="col-12 col-lg-7 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Subscription Trends</h4>
                                <div className="chart-container">
                                    <ApexCharts
                                        ref={this.subscriptionTrendsChartRef}
                                        options={this.state.visitSaleData.options}
                                        series={this.state.visitSaleData.series}
                                        type="line"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-5 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Clinician Status Overview</h4>
                                <div className="chart-container">
                                    <ApexCharts
                                        ref={this.clinicianStatusChartRef}
                                        options={this.state.clinicianStatusData.options}
                                        series={this.state.clinicianStatusData.series}
                                        type="donut"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-lg-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Subscription Comparison</h4>
                                <div className="chart-container">
                                    <ApexCharts
                                        ref={this.subscriptionComparisonChartRef}
                                        options={{
                                            ...this.state.subscriptionComparisonData.options,
                                            chart: {
                                                ...this.state.subscriptionComparisonData.options.chart,
                                                width: '100%',
                                                height: 350
                                            }
                                        }}
                                        series={this.state.subscriptionComparisonData.series}
                                        type="line"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Subscription & Budget Analysis</h4>
                                <div className="chart-container">
                                    <ApexCharts
                                        ref={this.budgetAnalysisChartRef}
                                        options={{
                                            ...this.state.budgetAnalysisData.options,
                                            chart: {
                                                ...this.state.budgetAnalysisData.options.chart,
                                                width: '100%',
                                                height: 350
                                            }
                                        }}
                                        series={this.state.budgetAnalysisData.series}
                                        type="bar"
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
                                <div className="table-responsive">
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Patient Name</TableCell>
                                                    <TableCell align="center">Issue</TableCell>
                                                    <TableCell align="center">Subscription Type</TableCell>
                                                    <TableCell align="center">Start Date</TableCell>
                                                    <TableCell align="center">End Date</TableCell>
                                                    <TableCell align="center">Assigned Doctor</TableCell>
                                                    <TableCell align="center">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.patientDetails.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="center">{row.issue}</TableCell>
                                                        <TableCell align="center">{row.subscriptionType}</TableCell>
                                                        <TableCell align="center">{row.startDate}</TableCell>
                                                        <TableCell align="center">{row.endDate}</TableCell>
                                                        <TableCell align="center">{row.assignedDoctor}</TableCell>
                                                        <TableCell align="center">{row.status}</TableCell>
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
            </div>
        );
    }
}

export default Dashboard;