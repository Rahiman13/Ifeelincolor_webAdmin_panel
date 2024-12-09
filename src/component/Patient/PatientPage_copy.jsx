import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  TablePagination,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  Chip,
  CircularProgress,
  LinearProgress,
  styled,
  alpha,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 650,
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    transition: 'all 0.3s ease',
    transform: 'translateY(-2px)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  borderRadius: '6px',
  fontSize: '0.75rem',
  height: '24px',
  ...(status === 'Active' && {
    color: theme.palette.success.dark,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  }),
  ...(status === 'Expired' && {
    color: theme.palette.error.dark,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  }),
}));

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

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
  },
}));

// Add this new styled component for contact info
const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .icon': {
    color: theme.palette.text.secondary,
    fontSize: '1rem'
  }
}));

// Add this helper function at the top of the component
const getApiBaseUrl = () => {
  const role = sessionStorage.getItem('role');
  return role === 'assistant' ? 'assistant' : 'admin';
};

export default function Component() {
  const [filterType, setFilterType] = useState('all');
  const [portalPatients, setPortalPatients] = useState([]);
  const [clinicianPatients, setClinicianPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal) return;

      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscription-counts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setSubscriptionData(data.body.monthlyData);

          // Extract unique years from the data
          const years = [...new Set(Object.keys(data.body.monthlyData).map(date => date.split('-')[0]))];
          setAvailableYears(years.sort());

          // Set the most recent year as default
          if (years.length > 0) {
            setSelectedYear(Math.max(...years.map(Number)));
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    const fetchPortalPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'portal') return;

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          const formattedData = data.body.map(subscription => ({
            id: subscription._id,
            name: subscription.patient.userName,
            email: subscription.patient.email,
            mobile: subscription.patient.mobile,
            subscriptionType: 'Portal',
            planName: subscription.plan.name,
            details: subscription.plan.details,
            doctorName: subscription.doctor.name,
            doctorEmail: subscription.doctor.email,
            startDate: new Date(subscription.startDate).toLocaleDateString(),
            endDate: new Date(subscription.endDate).toLocaleDateString(),
            avatarSrc: subscription.patient.image || "/placeholder-user.jpg",
            avatarFallback: subscription.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setPortalPatients(formattedData);
        }
      } catch (error) {
        console.error('Error fetching portal subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalPatients();
  }, [filterType]);

  useEffect(() => {
    const fetchClinicianPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'clinician') return;

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          const formattedData = data.body.map(item => ({
            id: item.subscription._id,
            name: item.patient.userName,
            email: item.patient.email,
            mobile: item.patient.mobile,
            subscriptionType: 'Clinician',
            clinician: {
              name: item.clinician.name,
              specialization: item.clinician.specializedIn,
              degree: item.clinician.degree
            },
            planName: item.plan.name,
            details: item.plan.details,
            startDate: new Date(item.subscription.startDate).toLocaleDateString(),
            endDate: new Date(item.subscription.endDate).toLocaleDateString(),
            avatarSrc: item.patient.image || "/placeholder-user.jpg",
            avatarFallback: item.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setClinicianPatients(formattedData);
        }
      } catch (error) {
        console.error('Error fetching clinician subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicianPatients();
  }, [filterType]);

  // Filter data based on selected year
  const getFilteredData = () => {
    if (!subscriptionData) return null;

    const filteredData = Object.entries(subscriptionData)
      .filter(([date]) => date.startsWith(selectedYear))
      .reduce((acc, [date, value]) => {
        acc[date] = value;
        return acc;
      }, {});

    return Object.keys(filteredData).length > 0 ? filteredData : null;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: "",
      email: "",
      mobile: "",
      subscriptionType: "",
      planName: "",
      avatarSrc: "/placeholder-user.jpg",
      avatarFallback: "",
    };
    setSelectedUser(newUser);
    handleOpenModal("add");
  };

  const handleUpdateStatus = () => {
    handleOpenModal("edit");
    handleCloseMenu();
  };

  const handleDeletePatient = () => {
    if (selectedUser.subscriptionType === 'Portal') {
      setPortalPatients(portalPatients.filter(user => user.id !== selectedUser.id));
    } else if (selectedUser.subscriptionType === 'Clinician') {
      setClinicianPatients(clinicianPatients.filter(user => user.id !== selectedUser.id));
    }
    handleCloseMenu();
  };

  const handleSave = () => {
    const updatedUser = { ...selectedUser };

    if (modalMode === "add") {
      if (updatedUser.subscriptionType === 'Portal') {
        setPortalPatients([...portalPatients, updatedUser]);
      } else if (updatedUser.subscriptionType === 'Clinician') {
        setClinicianPatients([...clinicianPatients, updatedUser]);
      }
    } else if (modalMode === "edit") {
      if (updatedUser.subscriptionType === 'Portal') {
        setPortalPatients(portalPatients.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));
      } else if (updatedUser.subscriptionType === 'Clinician') {
        setClinicianPatients(clinicianPatients.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));
      }
    }
    handleCloseModal();
  };

  const barChartData = {
    series: [
      {
        name: "Patients",
        data: getFilteredData()
          ? Object.values(getFilteredData())
          : [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#4EE6C9"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: getFilteredData()
          ? Object.keys(getFilteredData()).map(date => {
            const [year, month] = date.split('-');
            return new Date(year, month - 1).toLocaleString('default', { month: 'long' });
          })
          : [],
      },
      yaxis: {
        title: {
          text: "Number of Patients",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} patients`,
        },
      },
    },
  };

  // Add this where you want to show the year filter (inside the CardHeader of the chart)
  const chartHeader = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">Patient Count by Month</Typography>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          displayEmpty
          sx={{
            height: 40,
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }}
        >
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  useEffect(() => {
    const fetchAllPatients = async () => {
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      if (!isAdminPortal || filterType !== 'all') return;

      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const baseUrl = getApiBaseUrl();

        // Fetch both portal and clinician patients in parallel
        const [portalResponse, clinicianResponse] = await Promise.all([
          fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/subscriptions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`https://rough-1-gcic.onrender.com/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        const portalData = await portalResponse.json();
        const clinicianData = await clinicianResponse.json();

        if (portalData.status === 'success') {
          const formattedPortalData = portalData.body.map(subscription => ({
            id: subscription._id,
            name: subscription.patient.userName,
            email: subscription.patient.email,
            mobile: subscription.patient.mobile,
            subscriptionType: 'Portal',
            planName: subscription.plan.name,
            details: subscription.plan.details,
            startDate: new Date(subscription.startDate).toLocaleDateString(),
            endDate: new Date(subscription.endDate).toLocaleDateString(),
            avatarSrc: subscription.patient.image || "/placeholder-user.jpg",
            avatarFallback: subscription.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setPortalPatients(formattedPortalData);
        }

        if (clinicianData.status === 'success') {
          const formattedClinicianData = clinicianData.body.map(item => ({
            id: item.subscription._id,
            name: item.patient.userName,
            email: item.patient.email,
            mobile: item.patient.mobile,
            subscriptionType: 'Clinician',
            clinician: {
              name: item.clinician.name,
              specialization: item.clinician.specializedIn,
              degree: item.clinician.degree
            },
            planName: item.plan.name,
            details: item.plan.details,
            startDate: new Date(item.subscription.startDate).toLocaleDateString(),
            endDate: new Date(item.subscription.endDate).toLocaleDateString(),
            avatarSrc: item.patient.image || "/placeholder-user.jpg",
            avatarFallback: item.patient.userName.split(' ').map(n => n[0]).join(''),
          }));
          setClinicianPatients(formattedClinicianData);
        }
      } catch (error) {
        console.error('Error fetching all patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPatients();
  }, [filterType]);

  const getFilteredUsers = () => {
    switch (filterType) {
      case 'portal':
        return portalPatients;
      case 'clinician':
        return clinicianPatients;
      case 'all':
        // Combine both arrays and sort by name
        return [...portalPatients, ...clinicianPatients].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      default:
        return [];
    }
  };

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }} className='d-flex justify-content-between align-items-end'>
        <Typography variant="h6" component="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          <Box component="span" sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '20%',
            bgcolor: 'primary.main',
            color: 'white',
            mr: 2
          }}>
            <i className="mdi mdi-account" style={{ fontSize: '26px' }}></i>
          </Box>
          Patient Management
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, fontWeight: 600 }} >
          Overview <i className="mdi mdi-alert-circle-outline" style={{ fontSize: '18px', verticalAlign: 'middle' }}></i>
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={chartHeader}
              sx={{
                background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
                color: 'white',
                '& .MuiTypography-root': { color: 'white' },
                '& .MuiSelect-root': {
                  color: 'white',
                  '&:before': { borderColor: 'white' }
                }
              }}
            />
            <CardContent>
              <Box sx={{ height: { xs: 300, sm: 400, md: 500 }, width: '100%' }}>
                <Chart
                  options={barChartData.options}
                  series={barChartData.series}
                  type="bar"
                  height="100%"
                  width="100%"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <StyledTableContainer>
            <TableHeaderBox>
              <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                Patient Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setPage(0);
                    }}
                    displayEmpty
                    sx={{
                      height: 40,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white'
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                  >
                    <MenuItem value="all">All Patients ({portalPatients.length + clinicianPatients.length})</MenuItem>
                    <MenuItem value="portal">Portal Patients ({portalPatients.length})</MenuItem>
                    <MenuItem value="clinician">Clinician Patients ({clinicianPatients.length})</MenuItem>
                  </Select>
                </FormControl>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleAddUser}
                  size={isMobile ? "small" : "medium"}
                  className="rounded-pill py-2"
                >
                  Add Patient
                </Button> */}
              </Box>
            </TableHeaderBox>

            <StyledTableContainer>
              <StyledTable>
                <StyledTableHead>
                  <TableRow>
                    <StyledHeaderCell>Patient Details</StyledHeaderCell>
                    <StyledHeaderCell>Contact Information</StyledHeaderCell>
                    <StyledHeaderCell>Subscription Details</StyledHeaderCell>
                    <StyledHeaderCell>Clinician Details</StyledHeaderCell>
                    {/* {filterType !== 'Portal' && (
                    )} */}
                    <StyledHeaderCell>Status & Timeline</StyledHeaderCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {isLoading ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={5} align="center">
                        <CircularProgress />
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    getFilteredUsers()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <StyledTableRow key={user.id}>
                          <StyledTableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={user.avatarSrc}
                                alt={user.name}
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
                                  {user.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <span style={{ color: '#666' }}>ID:</span>&nbsp;{user.id}
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
                                <Typography variant="body2">{user.email}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ bgcolor: alpha('#4caf50', 0.1) }}>
                                  <PhoneIcon sx={{ color: '#4caf50' }} />
                                </InfoIcon>
                                <Typography variant="body2">{user.mobile}</Typography>
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
                                    {/* {user.subscriptionType} */}
                                    {user.planName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {user.details}
                                  </Typography>
                                  {/* <Typography variant="caption" color="text.secondary">
                                  </Typography> */}

                                </Box>
                              </Box>
                            </Box>
                          </StyledTableCell>

                          <StyledTableCell>
                            {user.subscriptionType !== 'Portal' ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ bgcolor: alpha('#ff9800', 0.1) }}>
                                  <LocalHospitalIcon sx={{ color: '#ff9800' }} />
                                </InfoIcon>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Dr. {user.clinician.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {user.clinician.specialization}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      color: 'text.disabled',
                                      fontSize: '0.7rem'
                                    }}
                                  >
                                    {user.clinician.degree}
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
                                label={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
                                status={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
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
                                  {user.startDate} - {user.endDate}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateProgress(user.startDate, user.endDate)}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: alpha('#000', 0.05),
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: new Date(user.endDate) > new Date() ? 'success.main' : 'error.main',
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                  )}
                </TableBody>
              </StyledTable>
              <TablePagination
                component="div"
                count={getFilteredUsers().length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
              />
            </StyledTableContainer>
          </StyledTableContainer>
        </Grid>
      </Grid>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 400 },
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              {modalMode === "add" ? "Add Patient" : "Edit Patient"}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Name"
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Age"
            value={selectedUser?.age || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, age: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subscription Type"
            value={selectedUser?.subscriptionType || ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                subscriptionType: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Clinician"
            value={selectedUser?.clinician || ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                clinician: e.target.value,
              })
            }
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseModal} color="secondary" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              {modalMode === "add" ? "Add" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}