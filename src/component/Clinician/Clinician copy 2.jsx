import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiDoctor, mdiStethoscope, mdiChartLine, mdiPlus } from '@mdi/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card_circle from '../../assets/circle.svg';
import './ClinicianPage.scss';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisV } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Card, Typography, Box, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Modal, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, useMediaQuery, useTheme, CircularProgress, Backdrop, Paper, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
            height: '200px',
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
        }}>
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

// Styled components for enhanced table appearance
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
    // borderRadius: theme.shape.borderRadius * 3,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    minWidth: '100%', // Ensure the table container takes full width
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

const StyledTable = styled(Table)({
    minWidth: '100%', // Ensure the table takes full width of the container
    fontFamily: 'Arial, sans-serif', // Set a suitable font style
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.grey[200],
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.common.black,
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    lineHeight: '1.5rem',
    letterSpacing: '0.05em',
    padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
    },
    '&:hover': {
        backgroundColor: '#fff',
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
    backgroundColor: '#7a990a',
    padding: '0 10px',
    height: 28,
    fontSize: '0.75rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    padding: '4px 10px 3px',
    margin: '3px',
    display: 'flex-column',
    gap: '10px',
    transition: 'all 0.2s',
    backgroundColor: "#F5F5FF5",
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    borderRadius: '20px',

    '&:hover': {
        transform: 'scale(1.15)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    width: '130px',
    '& .MuiInputBase-root': {
        borderRadius: '20px',
        backgroundColor: 'white',
        fontSize: '0.75rem',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
    },
    '& .MuiInputBase-input': {
        padding: '6px 10px',
        fontSize: '0.75rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[300],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.75rem',
        transform: 'translate(14px, 6px) scale(1)',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        },
    },
}));

const ClinicianPage = () => {
    const [activeTab, setActiveTab] = useState("allClinicians");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [selectedClinician, setSelectedClinician] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [clinicians, setClinicians] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [clinicianCounts, setClinicianCounts] = useState({
        total: 0,
        activeCount: 0,
        inactiveCount: 0
    });
    const [userRole, setUserRole] = useState('');
    const [myClinicians, setMyClinicians] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
    const [adminPortal, setAdminPortal] = useState('');
    const [dateRange, setDateRange] = useState({ from: null, to: null });

    useEffect(() => {
        setAdminPortal(sessionStorage.getItem('adminPortal'));
        console.log(adminPortal);
    }, []);

    useEffect(() => {
        getUserRole();
        fetchClinicians();
        fetchClinicianCounts();
    }, []);

    const getUserRole = () => {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
                sessionStorage.setItem('role', payload.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserRole('');
            }
        }
    };

    const getAuthHeaders = () => {
        const token = sessionStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const fetchClinicians = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            let url;

            if (role === 'manager') {
                url = 'https://rough-1-gcic.onrender.com/api/manager/clinicians-created';
            } else if (role === 'Admin') {
                url = 'https://rough-1-gcic.onrender.com/api/admin/doctors';
            } else if (role === 'assistant') {
                url = 'https://rough-1-gcic.onrender.com/api/assistant/doctors';
            } else {
                url = 'https://rough-1-gcic.onrender.com/api/organization/doctors';
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                setClinicians(response.data.body);
            }

            // Fetch "My Clinicians" only for non-manager roles
            if (role !== 'manager') {
                fetchMyClinicians();
            }
        } catch (error) {
            console.error('Error fetching clinicians:', error);
            toast.error('Failed to fetch clinicians');
        } finally {
            setLoading(false);
        }
    };

    const fetchClinicianCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            let url;

            if (role === 'manager') {
                url = 'https://rough-1-gcic.onrender.com/api/manager/clinicians-counts';
            } else if (role === 'Admin') {
                url = 'https://rough-1-gcic.onrender.com/api/admin/doctors-counts';
            } else if (role === 'assistant') {
                url = 'https://rough-1-gcic.onrender.com/api/assistant/doctors-counts';
            } else {
                url = 'https://rough-1-gcic.onrender.com/api/organization/doctors/count';
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                if (role === 'manager') {
                    setClinicianCounts({
                        total: response.data.body.totalClinisists,
                        activeCount: response.data.body.activeClinisists,
                        inactiveCount: response.data.body.inactiveClinisists
                    });
                } else {
                    setClinicianCounts(response.data.body);
                }
            }
        } catch (error) {
            console.error('Error fetching clinician counts:', error);
            toast.error('Failed to fetch clinician counts');
        }
    };

    // previous code
    // const fetchMyClinicians = async () => {
    //     try {
    //         const token = sessionStorage.getItem('token');
    //         const response = await axios.get('https://rough-1-gcic.onrender.com/api/organization/my-doctors', {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (response.data.status === 'success') {
    //             setMyClinicians(response.data.body);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching my clinicians:', error);
    //         toast.error('Failed to fetch clinicians added by you');
    //     }
    // };

    const fetchMyClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            let url;
            if (role === 'organization') {
                url = 'https://rough-1-gcic.onrender.com/api/organization/my-doctors';
            }
            // Clinicians added by Admin
            else if (role === 'Admin') {
                url = ''
            }
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                setMyClinicians(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching my clinicians:', error);
            toast.error('Failed to fetch clinicians added by you');
        }
    };

    const activeClinicians = clinicians.filter(clinician => clinician.Active === 'yes');
    const inactiveClinicians = clinicians.filter(clinician => clinician.Active === 'no');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    };

    const handleDateChange = (type) => (date) => {
        setDateRange(prev => ({ ...prev, [type]: date }));
    };

    const filterCliniciansByDateRange = (clinicians) => {
        if (!dateRange.from && !dateRange.to) return clinicians;

        return clinicians.filter(clinician => {
            const joinedDate = new Date(clinician.createdAt);
            if (dateRange.from && dateRange.to) {
                return joinedDate >= dateRange.from && joinedDate <= dateRange.to;
            } else if (dateRange.from) {
                return joinedDate >= dateRange.from;
            } else if (dateRange.to) {
                return joinedDate <= dateRange.to;
            }
            return true;
        });
    };

    const getPaginatedClinicians = () => {
        const currentClinicians = userRole === 'manager' ? clinicians :
            (activeTab === "allClinicians" ? clinicians : myClinicians);
        const filteredClinicians = filterCliniciansByDateRange(currentClinicians);
        return filteredClinicians.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    const handleEditClick = (clinician) => {
        setSelectedClinician(clinician);
        setModalType("edit");
        setShowModal(true);
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');

            if (modalType === "edit" && selectedClinician) {
                const { _id, name, email } = selectedClinician;
                let url;

                if (role === 'manager') {
                    url = `https://rough-1-gcic.onrender.com/api/manager/update-doctor/${_id}`;
                } else if (role === 'Admin') {
                    url = `https://rough-1-gcic.onrender.com/api/admin/doctors/${_id}`;
                } else if (role === 'assistant') {
                    url = `https://rough-1-gcic.onrender.com/api/assistant/doctors/${_id}`;
                } else {
                    url = `https://rough-1-gcic.onrender.com/api/organization/update-doctor/${_id}`;
                }
                const data = { name, email };

                const response = await axios.put(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message || 'Clinician updated successfully!');
                    // Fetch fresh data after successful update
                    await fetchClinicians();
                    await fetchClinicianCounts();
                }
            } else if (modalType === "add" && selectedClinician) {
                const { name, email, password } = selectedClinician;
                let url, data;

                if (role === 'manager') {
                    url = 'https://rough-1-gcic.onrender.com/api/manager/register-doctor';
                    data = { name, email, password };
                } else {
                    url = 'https://rough-1-gcic.onrender.com/api/organization/register-doctor';
                    data = { name, email, password };
                }

                const response = await axios.post(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message || 'New clinician added successfully!');
                    // Fetch updated data instead of manually updating state
                    await fetchClinicians();
                    await fetchClinicianCounts();
                }
            }
            setShowModal(false);
            setSelectedClinician(null);
        } catch (error) {
            console.error('Error saving clinician:', error);
            toast.error(error.response?.data?.message || 'Failed to save clinician');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to recover this clinician!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                setActionLoading(true);
                const token = sessionStorage.getItem('token');
                const role = sessionStorage.getItem('role');

                let url;
                if (role === 'manager') {
                    url = `https://rough-1-gcic.onrender.com/api/manager/delete-doctor/${id}`;
                } else if (role === 'Admin') {
                    url = `https://rough-1-gcic.onrender.com/api/admin/doctors/${id}`;
                } else if (role === 'assistant') {
                    url = `https://rough-1-gcic.onrender.com/api/assistant/doctors/${id}`;
                } else {
                    url = `https://rough-1-gcic.onrender.com/api/organization/delete-doctor/${id}`;
                }

                const response = await axios.delete(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    // Fetch fresh data after successful deletion
                    await fetchClinicians();
                    await fetchClinicianCounts();
                    
                    Swal.fire(
                        'Deleted!',
                        response.data.message || 'The clinician has been deleted.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error deleting clinician:', error);
            toast.error('Failed to delete clinician');
        } finally {
            setActionLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClinician(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setSelectedClinician({ ...selectedClinician, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget); // Open dropdown
    };

    const handleClose = () => {
        setAnchorEl(null); // Close dropdown
    };

    const handleFilterSelect = (filter) => {
        setActiveTab(filter); // Set the active tab based on selection
        setPage(0); // Reset page to 0
        handleClose(); // Close dropdown
    };

    return (
        <div className="container-fluid mt-4 clinician-page">
            {loading ? (
                <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <Icon path={mdiDoctor} size={1.3} />
                            </span>
                            Clinician Management
                        </h3>
                        <span>
                            Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                        </span>
                    </div>

                    <div className="row px-3">
                        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
                            <MetricCard
                                title="All Clinicians"
                                value={clinicianCounts.total}
                                icon={mdiChartLine}
                                // gradient="linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)"
                                gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"

                                percentage="100.0% Total"
                            />
                            <MetricCard
                                title="Active Clinicians"
                                value={clinicianCounts.activeCount}
                                icon={mdiDoctor}
                                // gradient="linear-gradient(135deg, #38ef7d 0%, #11998e 100%)"
                                gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"

                                percentage={`${((clinicianCounts.activeCount / clinicianCounts.total) * 100).toFixed(1)}% of total`}
                            />
                            <MetricCard
                                title="Inactive Clinicians"
                                value={clinicianCounts.inactiveCount}
                                icon={mdiStethoscope}
                                // gradient="linear-gradient(135deg, #FFD200 0%, #F7971E 100%)"
                                gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"

                                percentage={`${((clinicianCounts.inactiveCount / clinicianCounts.total) * 100).toFixed(1)}% of total`}
                            />
                        </Box>
                    </div>

                    <Box mt={4} px={3} width="100%">
                        <StyledTableContainer style={{ width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
                            <TableHeaderBox>
                                <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Clinician Details
                                </Typography>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    {userRole !== 'manager' && ( // Check if the user is a Manager
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleFilterClick} // Open filter dropdown
                                                startIcon={<MenuIcon />}
                                                sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#FFF', color: 'black', '&:hover': { backgroundColor: '#FFF' } }}
                                                className='rounded-80 border  border-dark'
                                            >
                                                Filter
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={() => handleFilterSelect("allClinicians")}>All Clinicians</MenuItem>
                                                <MenuItem onClick={() => handleFilterSelect("myClinicians")}>Clinicians Added By Me</MenuItem>
                                            </Menu>
                                        </>
                                    )}

                                    {(adminPortal !== 'true') && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { setSelectedClinician({}); setImagePreview(""); setModalType("add"); setShowModal(true); }}
                                            startIcon={<Icon path={mdiPlus} size={1} />}
                                            sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#7a990a', '&:hover': { backgroundColor: '#218838' } }}
                                            className='rounded-80 border-info'
                                        >
                                            Add Clinician
                                        </Button>
                                    )}
                                </div>
                            </TableHeaderBox>
                            <StyledTable>
                                <StyledTableHead>
                                    <TableRow>
                                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                                        <StyledHeaderCell align="left">Name</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Mobile</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Specialized In</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Status</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Joined Date</StyledHeaderCell>
                                        <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {getPaginatedClinicians().map((clinician, index) => (
                                        <StyledTableRow key={clinician._id}>
                                            <StyledTableCell align="center">
                                                <Typography variant="body2" fontWeight="500">
                                                    {page * rowsPerPage + index + 1}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box display="flex" alignItems="center">
                                                    <StyledAvatar src={clinician.avatar} alt={clinician.name}>
                                                        {clinician.name.charAt(0)}
                                                    </StyledAvatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {clinician.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {clinician.licenseNumber || 'No License'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center" className="text-primary">{clinician.email}</StyledTableCell>
                                            <StyledTableCell align="center">{clinician.mobileNum || '-'}</StyledTableCell>
                                            <StyledTableCell align="center">{clinician.specializedIn || '-'}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <StyledChip
                                                    label={clinician.Active === 'yes' ? 'Active' : 'Inactive'}
                                                    color={clinician.Active === 'yes' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(clinician.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <ActionButton onClick={() => handleEditClick(clinician)} color="primary">
                                                    <EditIcon />
                                                </ActionButton>
                                                <ActionButton onClick={() => handleDelete(clinician._id)} color="error">
                                                    <DeleteIcon />
                                                </ActionButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <StyledDatePicker
                                            label="From"
                                            value={dateRange.from}
                                            onChange={handleDateChange('from')}
                                            renderInput={(params) => <TextField {...params} />}
                                            inputFormat="dd/MM/yy"
                                            clearable
                                        />
                                        <StyledDatePicker
                                            label="To"
                                            value={dateRange.to}
                                            onChange={handleDateChange('to')}
                                            renderInput={(params) => <TextField {...params} />}
                                            inputFormat="dd/MM/yy"
                                            clearable
                                        />
                                    </Box>
                                </LocalizationProvider>
                                <TablePagination
                                    component="div"
                                    count={userRole === 'manager' ? clinicians.length : (activeTab === "allClinicians" ? clinicians.length : myClinicians.length)}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />

                            </Box>
                        </StyledTableContainer>
                        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                            <DialogTitle sx={{
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                color: '#fff', // Change text color to white for better contrast
                                background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', // Match the background gradient
                                borderBottom: '2px solid #e0e0e0'
                            }}>
                                {modalType === "edit" ? "Edit Clinician" : "Add New Clinician"}
                            </DialogTitle>
                            <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Name"
                                    name="name"
                                    value={selectedClinician?.name || ''}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={selectedClinician?.email || ''}
                                    onChange={handleInputChange}
                                />
                                {modalType === "add" && (
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={selectedClinician?.password || ''}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </Box>
                </>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ClinicianPage;