import React, { useState, useEffect } from "react";
import Icon from '@mdi/react';
import { mdiOfficeBuilding, mdiDomain, mdiChartLine, mdiPlus } from '@mdi/js';
// import './OrganizationPage.scss';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Modal, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, CircularProgress, Backdrop, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Card_circle from '../../assets/circle.svg';
import axios from 'axios';

// ... Keep the styled components from the Clinician page ...
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
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    minWidth: '100%',
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
    minWidth: '100%',
    tableLayout: 'fixed', // This ensures columns have fixed widths
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
    },
    '&:hover': {
        backgroundColor: '#fff',
        // transform: 'translateY(-2px)',
        // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
    fontSize: '0.875rem',
    lineHeight: '1.43',
    padding: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px', // Adjust this value as needed
    '&:hover': {
        overflow: 'visible',
        whiteSpace: 'normal',
        height: 'auto',
        maxWidth: 'none',
        background: 'rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 1,
    },
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledChip = styled(Chip)(({ theme, active }) => ({
    fontWeight: 'bold',
    borderRadius: '20px',
    backgroundColor: active ? '#7a990a' : '#d32f2f',
    color: 'white',
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


const OrganizationPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [organizationCounts, setOrganizationCounts] = useState({
        total: 0,
        activeCount: 0,
        inactiveCount: 0
    });
    const [organizationStats, setOrganizationStats] = useState({
        totalOrganizations: 0,
        activeOrganizations: 0,
        inactiveOrganizations: 0
    });
    const [isAdminPortal, setIsAdminPortal] = useState(false);
    const [newOrganization, setNewOrganization] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [activeFilter, setActiveFilter] = useState("all");
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const adminPortal = sessionStorage.getItem('adminPortal');
        setIsAdminPortal(adminPortal === 'true');
        fetchOrganizations();
        fetchOrganizationStats();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
            const url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/organizations`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizations(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrganizationStats = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
            const response = await axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/organization-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizationStats(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching organization stats:', error);
            toast.error('Failed to fetch organization statistics');
        }
    };

    const fetchOrganizationCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
            const response = await axios.get(`https://rough-1-gcic.onrender.com/api/${baseUrl}/organizations-counts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizationCounts(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching organization counts:', error);
            toast.error('Failed to fetch organization counts');
        }
    };

    const handleEdit = (organization) => {
        setSelectedOrganization(organization);
        setModalType("edit");
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = sessionStorage.getItem('token');
                const role = sessionStorage.getItem('role');
                const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
                await axios.delete(`https://rough-1-gcic.onrender.com/api/${baseUrl}/organization/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setOrganizations(organizations.filter(org => org._id !== id));
                toast.success('Organization deleted successfully');
            } catch (error) {
                console.error('Error deleting organization:', error);
                toast.error('Failed to delete organization');
            }
        }
    };

    const handleAddOrganization = () => {
        setNewOrganization({ name: '', email: '', password: '' });
        setModalType("add");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (modalType === "add") {
            try {
                setActionLoading(true);
                const token = sessionStorage.getItem('token');
                const response = await axios.post('https://rough-1-gcic.onrender.com/api/organization/register', newOrganization, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    toast.success('Organization registered successfully');
                    setOrganizations([...organizations, response.data.body]);
                    setShowModal(false);
                    fetchOrganizationStats();
                }
            } catch (error) {
                console.error('Error registering organization:', error);
                toast.error(error.response?.data?.message || 'Failed to register organization');
            } finally {
                setActionLoading(false);
            }
        } else if (modalType === "edit") {
            try {
                setActionLoading(true);
                const token = sessionStorage.getItem('token');
                const response = await axios.put(`https://rough-1-gcic.onrender.com/api/admin/organization/${selectedOrganization._id}`, selectedOrganization, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    toast.success('Organization updated successfully');
                    setOrganizations(organizations.map(org => org._id === selectedOrganization._id ? response.data.body : org));
                    setShowModal(false);
                }
            } catch (error) {
                console.error('Error updating organization:', error);
                toast.error('Failed to update organization');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrganization({ ...newOrganization, [name]: value });
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
        setPage(0);
        handleClose();
    };

    const getFilteredOrganizations = () => {
        let filteredOrgs = organizations;
        if (activeFilter === "active") {
            filteredOrgs = organizations.filter(org => org.active);
        } else if (activeFilter === "inactive") {
            filteredOrgs = organizations.filter(org => !org.active);
        }
        return filteredOrgs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    return (
        <div className="container-fluid mt-4 organization-page">
            {loading ? (
                <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <Icon path={mdiOfficeBuilding} size={1.3} />
                            </span>
                            Organization Management
                        </h3>
                        <span>
                            Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                        </span>
                    </div>

                    <div className="row px-3">
                        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
                            <MetricCard
                                title="All Organizations"
                                value={isAdminPortal ? organizationStats.totalOrganizations : organizationCounts.total}
                                icon={mdiChartLine}
                                gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                                percentage="100.0% Total"
                            />
                            <MetricCard
                                title="Active Organizations"
                                value={isAdminPortal ? organizationStats.activeOrganizations : organizationCounts.activeCount}
                                icon={mdiDomain}
                                gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                                percentage={`${((isAdminPortal ? organizationStats.activeOrganizations : organizationCounts.activeCount) / (isAdminPortal ? organizationStats.totalOrganizations : organizationCounts.total) * 100).toFixed(1)}% of total`}
                            />
                            <MetricCard
                                title="Inactive Organizations"
                                value={isAdminPortal ? organizationStats.inactiveOrganizations : organizationCounts.inactiveCount}
                                icon={mdiOfficeBuilding}
                                gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                                percentage={`${((isAdminPortal ? organizationStats.inactiveOrganizations : organizationCounts.inactiveCount) / (isAdminPortal ? organizationStats.totalOrganizations : organizationCounts.total) * 100).toFixed(1)}% of total`}
                            />
                        </Box>
                    </div>

                    <Box mt={4} px={3} width="100%">
                        <StyledTableContainer style={{ width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
                            <TableHeaderBox>
                                <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Organization Details
                                </Typography>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleFilterClick}
                                        startIcon={<MenuIcon />}
                                        sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#FFF', color: 'black', '&:hover': { backgroundColor: '#FFF' } }}
                                        className='rounded-80 border border-dark'
                                    >
                                        Filter
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => handleFilterSelect("all")}>All Organizations</MenuItem>
                                        <MenuItem onClick={() => handleFilterSelect("active")}>Active Organizations</MenuItem>
                                        <MenuItem onClick={() => handleFilterSelect("inactive")}>Inactive Organizations</MenuItem>
                                    </Menu>
                                    {isAdminPortal && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddOrganization}
                                            startIcon={<Icon path={mdiPlus} size={1} />}
                                            sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#7a990a', '&:hover': { backgroundColor: '#218838' } }}
                                            className='rounded-80 border-info'
                                        >
                                            Add Organization
                                        </Button>
                                    )}
                                </div>
                            </TableHeaderBox>
                            <StyledTable>
                                <StyledTableHead>
                                    <TableRow>
                                        <StyledHeaderCell align="center" style={{ width: '8%' }}>S.No</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '20%' }}>Name</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '20%' }}>Email</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '20%' }}>Company Name</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '15%' }}>Founder</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '15%' }}>Contact</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '15%' }}>Status</StyledHeaderCell>
                                        <StyledHeaderCell align="center" style={{ width: '15%' }}>Joined Date</StyledHeaderCell>
                                        {/* <StyledHeaderCell align="center" style={{ width: '15%' }}>Actions</StyledHeaderCell> */}
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {getFilteredOrganizations().map((org, index) => (
                                        <StyledTableRow key={org._id}>
                                            <StyledTableCell align="center">
                                                <Typography variant="body2" fontWeight="500">
                                                    {page * rowsPerPage + index + 1}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box display="flex" alignItems="center">
                                                    <StyledAvatar src={org.image} alt={org.name}>
                                                        {org.name.charAt(0)}
                                                    </StyledAvatar>
                                                    <Typography variant="subtitle1" fontWeight="medium">{org.name||'-'}</Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center" className="text-primary">{org.email||'-'}</StyledTableCell>
                                            <StyledTableCell align="center" className="text-primary">{org.companyName||'-'}</StyledTableCell>
                                            <StyledTableCell align="center" className="text-primary">{org.founder||'-'}</StyledTableCell>
                                            <StyledTableCell align="center">{org.mobile || '-'}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <StyledChip
                                                    label={org.active ? 'Active' : 'Inactive'}
                                                    active={org.active}
                                                    size="small"
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(org.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                                <ActionButton onClick={() => handleEdit(org)} color="primary">
                                                    <EditIcon />
                                                </ActionButton>
                                                <ActionButton onClick={() => handleDelete(org._id)} color="error">
                                                    <DeleteIcon />
                                                </ActionButton>
                                            </StyledTableCell> */}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                            <TablePagination
                                component="div"
                                count={organizations.length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </StyledTableContainer>
                    </Box>

                    <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                        <DialogTitle sx={{
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            color: '#fff',
                            background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
                            borderBottom: '2px solid #e0e0e0'
                        }}>
                            {modalType === "edit" ? "Edit Organization" : "Add New Organization"}
                        </DialogTitle>
                        <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                value={modalType === "add" ? newOrganization.name : selectedOrganization?.name || ''}
                                onChange={modalType === "add" ? handleInputChange : (e) => setSelectedOrganization({ ...selectedOrganization, name: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                name="email"
                                type="email"
                                value={modalType === "add" ? newOrganization.email : selectedOrganization?.email || ''}
                                onChange={modalType === "add" ? handleInputChange : (e) => setSelectedOrganization({ ...selectedOrganization, email: e.target.value })}
                            />
                            {modalType === "add" && (
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={newOrganization.password}
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
                </>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default OrganizationPage;
