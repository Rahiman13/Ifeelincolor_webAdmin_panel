import React, { useState, useEffect } from 'react';
import { Dropdown } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiAccountTie, mdiAccountMultiple, mdiChartLine, mdiPlus } from '@mdi/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card_circle from '../../assets/circle.svg';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisV } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Tabs, Tab, Modal, TextField, Box, TablePagination, Typography, MenuItem, CircularProgress, Backdrop, Paper, Avatar, Chip, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './manager.scss';
import axios from 'axios';

const MetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card
    sx={{
      background: gradient,
      color: 'white',
      padding: 4,
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '195px',
        height: '240px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.6,
        zIndex: 0,
      },
      zIndex: 1,
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
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  lineHeight: '1.5rem',
  letterSpacing: '0.05em',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  },
}));

const ManagersPage = () => {
  const [activeTab, setActiveTab] = useState("total");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const [activeManagers, setActiveManagers] = useState([]);
  const [inactiveManagers, setInactiveManagers] = useState([]);
  const [managerCounts, setManagerCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchManagersForTab();
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    setInitialLoading(true);
    try {
      await Promise.all([fetchManagers(), fetchManagerCounts()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to fetch initial data');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchManagersForTab = async () => {
    try {
      await fetchManagers();
    } catch (error) {
      console.error('Error fetching managers for tab:', error);
      toast.error('Failed to fetch managers');
    }
  };

  const fetchManagers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let endpoint = 'https://rough-1-gcic.onrender.com/api/organization/managers';
      
      if (activeTab === 'active') {
        endpoint = 'https://rough-1-gcic.onrender.com/api/organization/managers/active';
      } else if (activeTab === 'inactive') {
        endpoint = 'https://rough-1-gcic.onrender.com/api/organization/managers/inactive';
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (activeTab === 'active') {
        setActiveManagers(response.data.body);
      } else if (activeTab === 'inactive') {
        setInactiveManagers(response.data.body);
      } else {
        setManagers(response.data.body);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  };

  const fetchManagerCounts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('https://rough-1-gcic.onrender.com/api/organization/managers/counts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagerCounts(response.data.body);
    } catch (error) {
      console.error('Error fetching manager counts:', error);
      toast.error('Failed to fetch manager counts');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedManagers = () => {
    let currentManagers;
    switch (activeTab) {
      case "active":
        currentManagers = activeManagers;
        break;
      case "inactive":
        currentManagers = inactiveManagers;
        break;
      default:
        currentManagers = managers;
    }
    return currentManagers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover this manager!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const token = sessionStorage.getItem('token');
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/organization/manager/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.status === 'success') {
            // Remove the deleted manager from the list
            setManagers(prevManagers => prevManagers.filter(m => m._id !== id));
            Swal.fire(
              'Deleted!',
              'The manager has been deleted.',
              'success'
            );
            // Refresh manager counts after successful deletion
            fetchManagerCounts();
          } else {
            throw new Error(response.data.message || 'Failed to delete manager');
          }
        } catch (error) {
          console.error('Error deleting manager:', error);
          Swal.fire(
            'Error!',
            error.message || 'Failed to delete the manager.',
            'error'
          );
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleSave = async () => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (modalType === "edit" && selectedManager) {
        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/organization/manager/${selectedManager._id}`, {
          name: selectedManager.name,
          email: selectedManager.email,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.status === 'success') {
          // Update the manager in the existing list
          setManagers(prevManagers => 
            prevManagers.map(m => m._id === selectedManager._id ? response.data.body : m)
          );
          toast.success('Manager details updated successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to update manager');
        }
      } else if (modalType === "add" && selectedManager) {
        const response = await axios.post('https://rough-1-gcic.onrender.com/api/manager/register', {
          name: selectedManager.name,
          email: selectedManager.email,
          password: selectedManager.password,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.status === 'success') {
          // Add the new manager to the existing list
          setManagers(prevManagers => [...prevManagers, response.data.body]);
          toast.success('New manager added successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to add manager');
        }
      }
      setShowModal(false);
      setSelectedManager(null);
      // Refresh manager counts after successful operation
      fetchManagerCounts();
    } catch (error) {
      console.error('Error saving manager:', error);
      toast.error(error.message || 'Failed to save manager');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedManager({ ...selectedManager, [name]: value });
  };

  return (
    <div className="container-fluid mt-4 manager-page">
      {initialLoading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiAccountTie} size={1.4} />
              </span> Managers
            </h3>
            <span>
              Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </span>
          </div>
          <div className="row px-3">
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
              <MetricCard
                title="All Managers"
                value={managerCounts.total}
                icon={mdiChartLine}
                gradient="linear-gradient(135deg, #38ef7d 0%, #11998e 100%)"
                percentage="100.0% Total"
              />
              <MetricCard
                title="Active Managers"
                value={managerCounts.active}
                icon={mdiAccountTie}
                gradient="linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)"
                percentage={`${((managerCounts.active / managerCounts.total) * 100).toFixed(1)}% of total`}
              />
              <MetricCard
                title="Inactive Managers"
                value={managerCounts.inactive}
                icon={mdiAccountMultiple}
                gradient="linear-gradient(135deg, #4ECDC4 0%, #556270 100%)"
                percentage={`${((managerCounts.inactive / managerCounts.total) * 100).toFixed(1)}% of total`}
              />
            </Box>
          </div>

          <Box mt={4} px={3}>
            <Card sx={{ p: 3 }}>
              <div className="border-bottom border-#efefef border-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Typography variant="h5" gutterBottom>
                    Manager Management
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { setSelectedManager({}); setModalType("add"); setShowModal(true); }}
                    startIcon={<Icon path={mdiPlus} size={1} />}
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                    className='rounded-pill'
                  >
                    Add Manager
                  </Button>
                </div>
              </div>

              <Tabs
                value={activeTab}
                onChange={(event, newValue) => {
                  setActiveTab(newValue);
                  setPage(0);
                }}
                indicatorColor="primary"
                textColor="primary"
                centered
                className="my-3"
              >
                <Tab label="All Managers" value="total" />
                <Tab label="Active Managers" value="active" />
                <Tab label="Inactive Managers" value="inactive" />
              </Tabs>
              <Box sx={{ padding: 3 }}>
                <StyledTableContainer component={Paper}>
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                        <StyledHeaderCell align="left">Name</StyledHeaderCell>
                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                        <StyledHeaderCell align="center">Status</StyledHeaderCell>
                        <StyledHeaderCell align="center">Joined Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {getPaginatedManagers().map((manager, index) => (
                        <StyledTableRow key={manager._id}>
                          <StyledTableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" alignItems="center">
                              <StyledAvatar alt={manager.name}>
                                {manager.name.charAt(0)}
                              </StyledAvatar>
                              <Typography variant="subtitle1" fontWeight="medium">{manager.name}</Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="center">{manager.email}</StyledTableCell>
                          <StyledTableCell align="center">
                            <StyledChip
                              label={manager.Active === "yes" ? "Active" : "Inactive"}
                              color={manager.Active === "yes" ? "success" : "error"}
                              size="small"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Typography variant="body2" color="textSecondary">
                              {new Date(manager.createdAt).toLocaleDateString()}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <ActionButton onClick={() => handleEdit(manager)} color="primary">
                              <EditIcon />
                            </ActionButton>
                            <ActionButton onClick={() => handleDelete(manager._id)} color="error">
                              <DeleteIcon />
                            </ActionButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                </StyledTableContainer>
                <TablePagination
                  component="div"
                  count={getPaginatedManagers().length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </Box>
            </Card>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: '400px',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: '8px',
                }}
              >
                <h4>{modalType === "edit" ? "Edit Manager" : "Add New Manager"}</h4>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={selectedManager?.name || ''}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  value={selectedManager?.email || ''}
                  onChange={handleInputChange}
                />
                {modalType === "add" && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type="password"
                    value={selectedManager?.password || ''}
                    onChange={handleInputChange}
                  />
                )}
                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowModal(false)}
                    className="me-2 rounded-pill"
                    sx={{
                      backgroundColor: '#f0f0f0',
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    className='rounded-pill'
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
                </div>
              </Box>
            </Modal>

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

export default ManagersPage;