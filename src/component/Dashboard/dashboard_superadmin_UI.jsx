import React, { Component } from 'react';
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
    Card,
    Typography,
    Box,
    CircularProgress,
    Button,
    Avatar,
    Backdrop,
    Chip,
    Tooltip,
    LinearProgress,
    FormControl,
    Select,
    MenuItem,
    alpha,
    TablePagination,
} from "@mui/material";
import './Dashboard.css';
import axios from 'axios';
import { Card as BootstrapCard } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import moment from 'moment'; // Add this import for date formatting
import { FaUserMd, FaCalendarAlt, FaDollarSign, FaClock, FaUsers, FaStar, FaChartLine, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Add this constant at the top of your file, after the imports
const API_BASE_URL = 'https://rough-1-gcic.onrender.com';

// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    }
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '24px 24px 0 0',
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '.MuiTableCell-root': {
        borderColor: 'rgba(0, 0, 0, 0.06)',
    }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    color: '#fff',
    fontWeight: 600,
    padding: theme.spacing(2),
    whiteSpace: 'nowrap',
    background: 'transparent',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        transform: 'scale(1.01)',
    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    borderRadius: '12px',
    fontWeight: 600,
    padding: '4px 8px',
    backgroundColor: status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: status === 'Active' ? '#10b981' : '#ef4444',
    border: `1px solid ${status === 'Active' ? '#10b981' : '#ef4444'}`,
}));

// Add custom styles for a trendy table
const TrendyTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
}));

const TrendyTableHead = styled(TableHead)(({ theme }) => ({
    background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
}));

const TrendyHeaderCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    padding: theme.spacing(2),
}));

const TrendyTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        transition: 'all 0.3s ease',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
}));

const TrendyTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '0.875rem',
    padding: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
}));

// Updated MetricCard Component
const MetricCard = ({ title, value, icon, bgClass, percentage }) => (
    <div className={`card ${bgClass} card-img-holder text-white`} style={{ minHeight: '180px' }}>
        <div className="card-body">
            <img src={Card_circle} className="card-img-absolute" alt="circle" />
            <h5 className="font-weight-normal mb-3">
                {title}
                <Icon path={icon} size={0.8} className="float-right icon-hover" />
            </h5>
            <h3 className="mb-4">{value}</h3>
            <h6>{percentage}</h6>
        </div>
    </div>
);

// Remove the old MetricCard component and replace with this new version
const ModernMetricCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: theme.spacing(3),
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    color: gradient ? '#fff' : 'inherit',

    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },

    '.metric-value': {
        fontSize: '2.5rem',
        fontWeight: 800,
        marginBottom: theme.spacing(1),
        background: gradient ? '#fff' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: gradient ? 'white' : 'transparent',
    },

    '.metric-title': {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: gradient ? '#fff' : '#64748b',
        marginBottom: theme.spacing(2),
    },

    '.metric-percentage': {
        fontSize: '1rem',
        color: gradient ? '#fff' : '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },

    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    },

    '.metric-icon': {
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        opacity: 0.2,
        fontSize: '3rem',
        color: gradient ? '#fff' : '#3b82f6',
    }
}));

// Add these new styled components at the top after existing styled components
const DashboardContainer = styled('div')(({ theme }) => ({
    background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
    minHeight: '100vh',
    padding: theme.spacing(4),
    fontFamily: "'Poppins', sans-serif",
    color: '#1a365d',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        zIndex: 0,
        borderRadius: '0 0 50px 50px',
    }
}));

const PageHeader = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    marginBottom: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '.page-title': {
        fontSize: '2rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    '.page-title-icon': {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
        transform: 'rotate(-10deg)',
    }
}));

const ChartCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },
    '.chart-header': {
        padding: theme.spacing(2),
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        marginBottom: theme.spacing(2),
    }
}));

const cardHeaderStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    borderRadius: '20px 20px 0 0',
    border: 'none',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '1.2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    },
    '& h4': {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 700,
    }
};

const additionalStyles = `
    .card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .apexcharts-canvas {
        border-radius: 0 0 20px 20px;
    }

    .MuiButton-contained {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        border-radius: 12px;
        padding: 8px 24px;
        text-transform: none;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        transition: all 0.3s ease;
    }

    .MuiButton-contained:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
    }

    .MuiChip-root {
        border-radius: 12px;
        font-weight: 600;
        padding: 12px 16px;
    }

    .MuiLinearProgress-root {
        height: 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.05);
    }
`;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isLoadingClinicians: true,
            clinicianError: null,
            counts: {
                totalPatients: 0,
                totalDoctors: 0,
                totalSubscriptions: 0,
                totalEarnings: 0
            },
            previousCounts: {
                totalDoctors: 0
            },
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
                series: [0, 0] // Initialize with zeros
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
            totalSubscriptions: 0, // Add state for total subscriptions
            percentageIncrease: '0%', // Add state for percentage increase
            totalEarnings: 0,
            currentEarnings: 0,
            earningsPercentageIncrease: '0%', // Add state for earnings percentage increase
            activeClinicians: 0, // Add state for active clinicians
            percentageActiveClinicians: '0%', // Add state for percentage of active clinicians
            totalClinicians: 0,
            isLoadingCounts: true,
            countsError: null,
            totalPatients: 0,
            patientPercentageIncrease: '0%',
            patientDetails: [],
            isLoadingPatientDetails: true,
            patientDetailsError: null,
            page: 0,
            rowsPerPage: 10,
        };
        this.subscriptionTrendsChartRef = React.createRef();
        this.clinicianStatusChartRef = React.createRef();
        this.subscriptionComparisonChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllData();
        this.fetchDetailedEarnings(); // Fetch detailed earnings data
        this.fetchSubscriptionComparisonData(); // Fetch subscription comparison data
    }

    fetchAllData = async () => {
        this.setState({ loading: true });
        try {
            await Promise.all([
                this.fetchSubscriptionCounts(),
                this.fetchEarningsData(),
                this.fetchClinicianCounts(),
                this.fetchSubscriptionTrends(),
                this.fetchPatientCounts(), // Add this new method
                this.fetchPatientDetails(),
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            this.setState({ loading: false });
        }
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

    getApiBaseUrl = () => {
        const role = sessionStorage.getItem('role');
        return role === 'assistant' ? 'assistant' : 'admin';
    };

    fetchSubscriptionCounts = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/subscription-counts`, {
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
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/current-earnings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const totalEarnings = data.body.total.earnings;
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
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                this.setState({ isLoadingClinicians: true });
                const response = await axios.get(`${API_BASE_URL}/api/${baseUrl}/doctors-counts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === "success") {
                    const { total, activeCount, inactiveCount } = response.data.body;
                    const previousTotal = this.state.counts.totalDoctors;
                    this.setState(prevState => ({
                        counts: {
                            ...prevState.counts,
                            totalDoctors: total
                        },
                        previousCounts: {
                            ...prevState.previousCounts,
                            totalDoctors: previousTotal
                        },
                        clinicianStatusData: {
                            ...prevState.clinicianStatusData,
                            series: [activeCount, inactiveCount]
                        },
                        isLoadingClinicians: false
                    }));
                } else {
                    throw new Error("Failed to fetch clinician counts");
                }
            } catch (error) {
                this.setState({
                    clinicianError: error.message,
                    isLoadingClinicians: false
                });
            }
        } else {
            this.setState({ isLoadingClinicians: false });
        }
    }

    fetchSubscriptionTrends = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/detailed-subscription-counts-month-wise`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const subscriptionData = data.data;
                    const categories = Object.keys(subscriptionData).map(date => {
                        const [year, month] = date.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
                    });
                    const patientSubscriptions = Object.values(subscriptionData).map(item => item.patientSubscription.active);
                    const clinicianSubscriptions = Object.values(subscriptionData).map(item => item.clinicianSubscription.active);
                    const organizationSubscriptions = Object.values(subscriptionData).map(item => item.organizationSubscription.active);

                    this.setState({
                        visitSaleData: {
                            ...this.state.visitSaleData,
                            options: {
                                ...this.state.visitSaleData.options,
                                xaxis: {
                                    categories: categories // Set categories for the x-axis with 3-letter month names
                                }
                            },
                            series: [
                                {
                                    name: 'Patient Subscriptions',
                                    data: patientSubscriptions
                                },
                                {
                                    name: 'Clinician Subscriptions',
                                    data: clinicianSubscriptions
                                },
                                {
                                    name: 'Organization Subscriptions',
                                    data: organizationSubscriptions
                                }
                            ]
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching subscription trends:', error);
            }
        }
    };

    fetchPatientCounts = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/subscription-counts`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const totalCount = data.body.totalCount;
                    const monthlyData = data.body.monthlyData;

                    // Calculate percentage increase
                    const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in format "YYYY-MM"
                    const previousMonth = Object.keys(monthlyData)[Object.keys(monthlyData).length - 2]; // Get previous month
                    const currentCount = monthlyData[currentMonth] || 0;
                    const previousCount = monthlyData[previousMonth] || 0;
                    const percentageIncrease = previousCount ? ((currentCount - previousCount) / previousCount) * 100 : 0;

                    this.setState({
                        totalPatients: totalCount,
                        patientPercentageIncrease: percentageIncrease.toFixed(2) + '%'
                    });
                }
            } catch (error) {
                console.error('Error fetching patient counts:', error);
            }
        }
    };

    fetchPatientDetails = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                this.setState({ isLoadingPatientDetails: true });
                
                const [subscriptionsResponse, doctorPlansResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/${baseUrl}/subscriptions`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`${API_BASE_URL}/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                ]);

                const [subscriptionsData, doctorPlansData] = await Promise.all([
                    subscriptionsResponse.json(),
                    doctorPlansResponse.json()
                ]);

                if (subscriptionsData.status === 'success' && doctorPlansData.status === 'success') {
                    // Combine and format both sets of patient details
                    const patientDetails = [
                        ...subscriptionsData.body.map(subscription => ({
                            id: subscription._id,
                            patientName: subscription.patient.userName,
                            image: subscription.patient.image,
                            email: subscription.patient.email,
                            mobile: subscription.patient.mobile,
                            patientlocation: subscription.patient.location || 'N/A',
                            subscriptionType: subscription.plan.name,
                            startDate: moment(subscription.startDate).format('YYYY-MM-DD'),
                            endDate: moment(subscription.endDate).format('YYYY-MM-DD'),
                            assignedDoctor: subscription.clinisist ? subscription.clinisist.name : 'N/A',
                            status: moment(subscription.endDate).isAfter(moment()) ? 'Active' : 'Expired',
                            doctorName: subscription.clinisist ? subscription.clinisist.name : 'N/A',
                            doctorImage: subscription.clinisist ? subscription.clinisist.image : null,
                            doctorEmail: subscription.clinisist ? subscription.clinisist.email : 'N/A',
                            doctorMobile: subscription.clinisist ? subscription.clinisist.mobile : 'N/A',
                            planName: subscription.plan.name,
                            price: subscription.plan.price,
                            validity: subscription.plan.validity,
                            details: subscription.plan.details,
                        })),
                        ...doctorPlansData.body.map(subscription => ({
                            id: subscription.subscription._id,
                            patientName: subscription.patient.userName,
                            image: subscription.patient.image,
                            email: subscription.patient.email,
                            mobile: subscription.patient.mobile,
                            patientlocation: subscription.patient.location || 'N/A',
                            subscriptionType: subscription.plan.name,
                            startDate: moment(subscription.subscription.startDate).format('YYYY-MM-DD'),
                            endDate: moment(subscription.subscription.endDate).format('YYYY-MM-DD'),
                            assignedDoctor: subscription.clinician.name,
                            status: moment(subscription.subscription.endDate).isAfter(moment()) ? 'Active' : 'Expired',
                            doctorName: subscription.clinician.name,
                            doctorImage: subscription.clinician.image,
                            doctorEmail: subscription.clinician.email,
                            doctorMobile: subscription.clinician.mobile,
                            planName: subscription.plan.name,
                            price: subscription.plan.price,
                            validity: subscription.plan.validity,
                            details: subscription.plan.details,
                        }))
                    ];

                    this.setState({
                        patientDetails,
                        isLoadingPatientDetails: false
                    });
                } else {
                    throw new Error(subscriptionsData.message || doctorPlansData.message || 'Failed to fetch patient details');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
                this.setState({
                    patientDetailsError: error.message,
                    isLoadingPatientDetails: false
                });
            }
        } else {
            this.setState({ isLoadingPatientDetails: false });
        }
    };

    calculatePercentageIncrease = (current, previous) => {
        if (previous === 0) return '100% increase';
        const increase = ((current - previous) / previous) * 100;
        return increase > 0 ? `${increase.toFixed(1)}% increase` : `${Math.abs(increase).toFixed(1)}% decrease`;
    }

    fetchDetailedEarnings = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/detailed-earnings-month-wise`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const earningsData = data.data;
                    const categories = Object.keys(earningsData).map(date => {
                        const [year, month] = date.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
                    });
                    const patientEarnings = Object.values(earningsData).map(item => item.patientEarnings);
                    const clinicianEarnings = Object.values(earningsData).map(item => item.clinicianEarnings);
                    const organizationEarnings = Object.values(earningsData).map(item => item.organizationEarnings);

                    this.setState({
                        budgetAnalysisData: {
                            ...this.state.budgetAnalysisData,
                            options: {
                                ...this.state.budgetAnalysisData.options,
                                xaxis: {
                                    categories: categories
                                }
                            },
                            series: [
                                {
                                    name: 'Patient Earnings',
                                    data: patientEarnings
                                },
                                {
                                    name: 'Clinician Earnings',
                                    data: clinicianEarnings
                                },
                                {
                                    name: 'Organization Earnings',
                                    data: organizationEarnings
                                }
                            ]
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching detailed earnings:', error);
            }
        }
    };

    fetchSubscriptionComparisonData = async () => {
        const token = sessionStorage.getItem('token');
        const baseUrl = this.getApiBaseUrl();

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/${baseUrl}/detailed-subscription-counts-month-wise`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 'success') {
                    const subscriptionData = data.data;
                    const categories = Object.keys(subscriptionData).map(date => {
                        const [year, month] = date.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
                    });
                    const patientSubscriptions = Object.values(subscriptionData).map(item => item.patientSubscription.active);
                    const clinicianSubscriptions = Object.values(subscriptionData).map(item => item.clinicianSubscription.active);
                    const organizationSubscriptions = Object.values(subscriptionData).map(item => item.organizationSubscription.active);

                    this.setState({
                        subscriptionComparisonData: {
                            ...this.state.subscriptionComparisonData,
                            options: {
                                ...this.state.subscriptionComparisonData.options,
                                xaxis: {
                                    categories: categories
                                }
                            },
                            series: [
                                {
                                    name: 'Patient Subscriptions',
                                    data: patientSubscriptions
                                },
                                {
                                    name: 'Clinician Subscriptions',
                                    data: clinicianSubscriptions
                                },
                                {
                                    name: 'Organization Subscriptions',
                                    data: organizationSubscriptions
                                }
                            ]
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching subscription comparison data:', error);
            }
        }
    };

    calculateProgress = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        const total = end - start;
        const elapsed = today - start;
        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    render() {
        const { totalClinicians, activeClinicians, isLoadingClinicians, clinicianError, clinicianStatusData, loading, counts, previousCounts, isLoadingCounts, countsError, isLoadingPatientDetails, patientDetailsError, patientDetails } = this.state;
        const role = sessionStorage.getItem('role');

        return (
            <DashboardContainer>
                <style>
                    {additionalStyles}
                </style>
                {loading ? (
                    <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    <>
                        <PageHeader>
                            <div className="page-title">
                                <span className="page-title-icon">
                                    <Icon path={mdiHome} size={1.2} color="#fff" />
                                </span>
                                Dashboard
                            </div>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active">
                                        <span style={{ color: '#64748b' }}>Overview</span>
                                        <Icon 
                                            path={mdiAlertCircleOutline} 
                                            size={0.6} 
                                            color="#3b82f6"
                                            style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} 
                                        />
                                    </li>
                                </ul>
                            </nav>
                        </PageHeader>

                        <div className="row mb-5"> {/* Added y space between each row */}
                            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} >
                                <ModernMetricCard
                                    title="Portal Patients"
                                    value={this.state.totalPatients}
                                    icon={mdiAccount}
                                    gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                    percentage={`↑ ${this.state.patientPercentageIncrease}`}
                                />
                                <ModernMetricCard
                                    title="Portal Clinicians"
                                    value={counts.totalDoctors.toString()}
                                    icon={mdiDoctor}
                                    gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                    percentage={this.calculatePercentageIncrease(counts.totalDoctors, previousCounts.totalDoctors)}
                                />
                                <ModernMetricCard
                                    title="Total Subscriptions"
                                    value={this.state.totalSubscriptions.toString()}
                                    icon={mdiDiamond}
                                    gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    percentage={`↑ ${this.state.percentageIncrease}`}
                                />
                                <ModernMetricCard
                                    title="Earnings"
                                    value={`$ ${this.state.totalEarnings.toFixed(2)}`}
                                    icon={mdiCashMultiple}
                                    gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                                    percentage={`↑ ${this.state.earningsPercentageIncrease}`}
                                />
                            </Box>
                        </div>

                        <div className="row mb-3"> {/* Updated to include all three subscription types */}
                            <div className="col-12 col-lg-7 grid-margin stretch-card">
                                <BootstrapCard>
                                    <BootstrapCard.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Trends</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={() => this.props.navigate('/subscription-management/portal')}
                                        >
                                            View All
                                        </Button>
                                    </BootstrapCard.Header>
                                    <BootstrapCard.Body>
                                        {loading ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : (
                                            <div ref={this.subscriptionTrendsChartRef}>
                                                <ApexCharts
                                                    options={this.state.visitSaleData.options}
                                                    series={this.state.visitSaleData.series}
                                                    type="line"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </BootstrapCard.Body>
                                </BootstrapCard>
                            </div>
                            <div className="col-12 col-lg-5 grid-margin stretch-card">
                                <BootstrapCard>
                                    <BootstrapCard.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Clinician Status Overview</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={() => this.props.navigate('/clinician-management/view')}
                                        >
                                            View All
                                        </Button>
                                    </BootstrapCard.Header>
                                    <BootstrapCard.Body>
                                        {isLoadingClinicians ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : clinicianError ? (
                                            <Typography color="error">{clinicianError}</Typography>
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
                                    </BootstrapCard.Body>
                                </BootstrapCard>
                            </div>
                        </div>

                        <div className="row mb-3"> {/* Removed the first card and made the second card full width */}
                            <div className="col-12 grid-margin stretch-card">
                                <BootstrapCard>
                                    <BootstrapCard.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Earnings</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={() => this.props.navigate('/subscription-budget-analysis/overview_superadmin')}
                                        >
                                            View All
                                        </Button>
                                    </BootstrapCard.Header>
                                    <BootstrapCard.Body>
                                        <div ref={this.budgetAnalysisChartRef}>
                                            <ApexCharts
                                                options={this.state.budgetAnalysisData.options}
                                                series={this.state.budgetAnalysisData.series}
                                                type="bar"
                                                height={350}
                                            />
                                        </div>
                                    </BootstrapCard.Body>
                                </BootstrapCard>
                            </div>
                        </div>

                        {/* <div className="row mb-3">
                            <div className="col-12 grid-margin stretch-card">
                                <BootstrapCard>
                                    <BootstrapCard.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Comparison</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={() => this.props.navigate('/subscription-comparison/overview')}
                                        >
                                            View All
                                        </Button>
                                    </BootstrapCard.Header>
                                    <BootstrapCard.Body>
                                        <div ref={this.subscriptionComparisonChartRef}>
                                            <ApexCharts
                                                options={this.state.subscriptionComparisonData.options}
                                                series={this.state.subscriptionComparisonData.series}
                                                type="line"
                                                height={350}
                                            />
                                        </div>
                                    </BootstrapCard.Body>
                                </BootstrapCard>
                            </div>
                        </div> */}

                        <div className="row mb-3"> {/* Added y space between each row */}
                            <div className="col-12 grid-margin stretch-card">
                                <StyledTableContainer>
                                    <TableHeaderBox>
                                        <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                                            Patient Details
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={() => this.props.navigate('patient-management/view')}
                                        >
                                            View All
                                        </Button>
                                    </TableHeaderBox>
                                    {isLoadingPatientDetails ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : patientDetailsError ? (
                                        <Typography color="error" align="center" p={3}>
                                            {patientDetailsError}
                                        </Typography>
                                    ) : (
                                        <>
                                            <StyledTable>
                                                <StyledTableHead>
                                                    <TableRow>
                                                        <StyledHeaderCell>Patient Details</StyledHeaderCell>
                                                        <StyledHeaderCell>Contact Information</StyledHeaderCell>
                                                        <StyledHeaderCell>Subscription Details</StyledHeaderCell>
                                                        <StyledHeaderCell>Clinician Details</StyledHeaderCell>
                                                        <StyledHeaderCell>Status & Timeline</StyledHeaderCell>
                                                    </TableRow>
                                                </StyledTableHead>
                                                <TableBody>
                                                    {patientDetails
                                                        .slice(
                                                            this.state.page * this.state.rowsPerPage,
                                                            this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                                                        )
                                                        .map((row) => (
                                                            <StyledTableRow key={row.id}>
                                                                <StyledTableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Avatar
                                                                            src={row.image}
                                                                            alt={row.patientName}
                                                                            sx={{ 
                                                                                width: 40, 
                                                                                height: 40,
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                            }}
                                                                        />
                                                                        <Box sx={{ ml: 2 }}>
                                                                            <Typography 
                                                                                variant="subtitle2" 
                                                                                sx={{ 
                                                                                    fontWeight: 600,
                                                                                    color: 'text.primary',
                                                                                    mb: 0.5
                                                                                }}
                                                                            >
                                                                                {row.patientName}
                                                                            </Typography>
                                                                            <Typography 
                                                                                variant="caption" 
                                                                                sx={{ 
                                                                                    color: 'text.secondary',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center'
                                                                                }}
                                                                            >
                                                                                <span style={{ color: '#666' }}>ID:</span>&nbsp;{row.id}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </StyledTableCell>

                                                                <StyledTableCell>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <InfoIcon sx={{ bgcolor: alpha('#2196f3', 0.1) }}>
                                                                                <EmailIcon sx={{ color: '#2196f3' }} />
                                                                            </InfoIcon>
                                                                            <Typography variant="body2">{row.email}</Typography>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <InfoIcon sx={{ bgcolor: alpha('#4caf50', 0.1) }}>
                                                                                <PhoneIcon sx={{ color: '#4caf50' }} />
                                                                            </InfoIcon>
                                                                            <Typography variant="body2">{row.mobile || 'N/A'}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </StyledTableCell>

                                                                <StyledTableCell>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <InfoIcon sx={{ bgcolor: alpha('#9c27b0', 0.1) }}>
                                                                                <LocalHospitalIcon sx={{ color: '#9c27b0' }} />
                                                                            </InfoIcon>
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                    {row.planName}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {row.details}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </StyledTableCell>

                                                                <StyledTableCell>
                                                                    {row.doctorName !== 'N/A' ? (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <InfoIcon sx={{ bgcolor: alpha('#ff9800', 0.1) }}>
                                                                                <LocalHospitalIcon sx={{ color: '#ff9800' }} />
                                                                            </InfoIcon>
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                    Dr. {row.doctorName}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {row.doctorEmail}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    ) : (
                                                                        <Typography variant="body2" color="text.disabled">N/A</Typography>
                                                                    )}
                                                                </StyledTableCell>

                                                                <StyledTableCell>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                                        <StatusChip 
                                                                            label={row.status}
                                                                            status={row.status}
                                                                            size="small"
                                                                        />
                                                                        <Box>
                                                                            <Typography 
                                                                                variant="caption" 
                                                                                sx={{ 
                                                                                    color: 'text.secondary',
                                                                                    display: 'block',
                                                                                    mb: 0.5
                                                                                }}
                                                                            >
                                                                                {row.startDate} - {row.endDate}
                                                                            </Typography>
                                                                            <LinearProgress 
                                                                                variant="determinate" 
                                                                                value={this.calculateProgress(row.startDate, row.endDate)}
                                                                                sx={{ 
                                                                                    height: 4,
                                                                                    borderRadius: 2,
                                                                                    bgcolor: alpha('#000', 0.05),
                                                                                    '& .MuiLinearProgress-bar': {
                                                                                        bgcolor: row.status === 'Active' ? 'success.main' : 'error.main',
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        ))}
                                                </TableBody>
                                            </StyledTable>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                                component="div"
                                                count={patientDetails.length}
                                                rowsPerPage={this.state.rowsPerPage}
                                                page={this.state.page}
                                                onPageChange={this.handleChangePage}
                                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                                                sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                                            />
                                        </>
                                    )}
                                </StyledTableContainer>
                            </div>
                        </div>
                    </>
                )}
            </DashboardContainer>
        );
    }
}

// Wrap the Dashboard component with a function component to use the useNavigate hook
function DashboardWithNavigation(props) {
    const navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />;
}

export default DashboardWithNavigation;

// Example function to calculate validity
function calculateValidity(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, 'days');
}

// Add these new styled components
const InfoIcon = styled(Box)(({ theme }) => ({
    width: 32,
    height: 32,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
    '& svg': {
        fontSize: '1.2rem',
    }
}));

// Add these new styled components
const ModernDashboard = styled('div')(({ theme }) => ({
    padding: theme.spacing(4),
    background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
    minHeight: '100vh',
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    '.title': {
        fontSize: '2.5rem',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        marginBottom: '0.5rem'
    },
    '.subtitle': {
        color: '#64748b',
        fontSize: '1.1rem'
    }
}));

const NeumorphicCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || '#ffffff',
    borderRadius: 24,
    padding: theme.spacing(3),
    boxShadow: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    }
}));

const MetricCardModern = styled(NeumorphicCard)(({ theme, gradient }) => ({
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: gradient ? '#fff' : 'inherit',
    '.metric-value': {
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    '.metric-title': {
        fontSize: '1.1rem',
        opacity: 0.9,
        fontWeight: 500,
    },
    '.metric-percentage': {
        fontSize: '0.9rem',
        opacity: 0.8,
    },
    '.metric-icon': {
        position: 'absolute',
        right: 20,
        bottom: 20,
        opacity: 0.2,
        fontSize: '3rem',
    }
}));

const ChartCardModern = styled(NeumorphicCard)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    '.chart-header': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    '.chart-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1e293b',
    }
}));

const ModernTable = styled(TableContainer)(({ theme }) => ({
    background: '#ffffff',
    borderRadius: 24,
    boxShadow: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
    overflow: 'hidden',
    '.table-header': {
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: theme.spacing(2, 3),
        color: '#fff',
    },
    '.MuiTableHead-root': {
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        '& th': {
            color: '#fff',
            fontWeight: 600,
            borderBottom: 'none',
        }
    },
    '.MuiTableBody-root tr': {
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(241, 245, 249, 0.5)',
            transform: 'scale(1.01)',
        }
    }
}));

const ModernButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: 12,
    padding: '8px 24px',
    color: '#fff',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&:hover': {
        background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    }
}));

