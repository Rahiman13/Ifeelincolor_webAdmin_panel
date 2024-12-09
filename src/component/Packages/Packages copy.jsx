import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  styled,
  FormControlLabel,
  CircularProgress,
  Backdrop,
  Collapse,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import Icon from '@mdi/react';
import { mdiClipboardListOutline, mdiDoctor, mdiPencil, mdiDelete } from '@mdi/js';
import { motion } from 'framer-motion';

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [bodyPartSectionExpanded, setBodyPartSectionExpanded] = useState(false);
  const [clinicianPlans, setClinicianPlans] = useState([]);
  const [clinicianPlanSectionExpanded, setClinicianPlanSectionExpanded] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const adminPortal = sessionStorage.getItem('adminPortal');
    setIsAdmin(role === 'Admin' || role === 'assistant');
    setIsAdminPortal(adminPortal === 'true');
    fetchPlans();
    if (adminPortal === 'true') {
      fetchClinicianPlans();
    }
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const organizationId = sessionStorage.getItem('OrganizationId');
      const role = sessionStorage.getItem('role');
      // if (!token || !organizationId) {
      //   throw new Error('No authorization token or organization ID found');
      // }

      let url;
      if (role === 'organization') {
        if (!token || !organizationId) {
          throw new Error('No authorization token or organization ID found');
        } else {
          url = 'https://rough-1-gcic.onrender.com/api/organization/plans'
        }
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/portal-plans`;
      }

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            organizationId: organizationId
          }
        }
      );

      if (response.data.status === 'success') {
        const formattedPlans = response.data.body.map(plan => ({
          id: plan._id,
          name: plan.name,
          price: plan.price,
          details: plan.details,
          validity: plan.validity,
          status: plan.status,
          createdBy: plan.createdBy,
        }));
        setPlans(formattedPlans);
        toast.success('Plans fetched successfully');
      } else {
        throw new Error(response.data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicianPlans = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');
      
      if (adminPortal === 'true' && token) {
        const response = await axios.get(
          'https://rough-1-gcic.onrender.com/api/clinicistPlan',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          setClinicianPlans(response.data.body);
          toast.success('Clinician plans fetched successfully');
        } else {
          throw new Error(response.data.message || 'Failed to fetch clinician plans');
        }
      }
    } catch (error) {
      console.error('Error fetching clinician plans:', error);
      toast.error(error.message || 'Failed to fetch clinician plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async (planId) => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      if (!token) {
        throw new Error('No authorization token found');
      }

      let url;
      if (role === 'organization') {
        url = `https://rough-1-gcic.onrender.com/api/organization/plan/${planId}`;
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/portal-plans/${planId}`;
      }

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        const planDetails = response.data.body;
        return {
          id: planDetails._id,
          name: planDetails.name,
          price: planDetails.price,
          details: planDetails.details,
          validity: planDetails.validity,
          status: planDetails.status,
          createdBy: planDetails.createdBy,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch plan details');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      toast.error(error.message || 'Failed to fetch plan details');
    }
  };

  const handleOpenModal = async (plan = null) => {
    if (plan) {
      const planDetails = await fetchPlanDetails(plan.id);
      setSelectedPlan(planDetails);
    } else {
      setSelectedPlan(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setOpenModal(false);
  };

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const handleStatusChange = async (planId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      if (!token) {
        throw new Error('No authorization token found');
      }

      let url;
      if (role === 'organization') {
        url = `https://rough-1-gcic.onrender.com/api/organization/plan/${planId}`
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/portal-plans/${planId}`;
      }

      const response = await axios.put(
        url,
        { status: newStatus ? 'Active' : 'Inactive' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setPlans(plans.map(plan =>
          plan.id === planId ? { ...plan, status: newStatus ? 'Active' : 'Inactive' } : plan
        ));
        toast.success(`Plan status updated successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to update plan status');
      }
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  const handleSavePlan = async (updatedPlan) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      if (!token) {
        throw new Error('No authorization token found');
      }

      const planData = {
        name: updatedPlan.name,
        price: parseFloat(updatedPlan.price),
        details: updatedPlan.details,
        validity: parseInt(updatedPlan.validity),
        status: updatedPlan.status,
      };

      if (isAdmin && isAdminPortal) {
        planData.planType = updatedPlan.planType;
      }

      console.log('Plan data to be sent:', planData); // Log the data being sent

      let response;
      let url;
      const baseUrl = role === 'assistant' ? 'assistant' : role === 'Admin' ? 'admin' : 'organization';
      
      if (updatedPlan.id) {
        url = role === 'organization' 
          ? `https://rough-1-gcic.onrender.com/api/organization/plan/${updatedPlan.id}`
          : `https://rough-1-gcic.onrender.com/api/${baseUrl}/portal-plans/${updatedPlan.id}`;
      } else {
        url = role === 'organization'
          ? 'https://rough-1-gcic.onrender.com/api/organization/create-plan'
          : `https://rough-1-gcic.onrender.com/api/${baseUrl}/create-plan`;
      }

      console.log('Updating existing plan. URL:', url);
      response = await axios.put(url, planData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Server response:', response.data); // Log the entire response

      if (response.data.status === 'success') {
        if (updatedPlan.id) {
          setPlans(plans.map(plan => plan.id === updatedPlan.id ? { ...updatedPlan, ...response.data.body } : plan));
          toast.success('Plan updated successfully');
        } else {
          setPlans([...plans, response.data.body]);
          toast.success('Plan created successfully');
        }
        handleCloseModal();
      } else {
        throw new Error(response.data.message || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(error.message || 'Failed to save plan');
      // Check if the plan was actually saved despite the error
      await fetchPlans();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
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
        setActionLoading(true);
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        const organizationId = sessionStorage.getItem('OrganizationId');
        // if (!token || !organizationId) {
        //   throw new Error('No authorization token or organization ID found');
        // }

        let url;
        if (role === 'organization') {
          if (!token || !organizationId) {
            throw new Error('No authorization token or organization ID found');
          }
          else{
            url=`https://rough-1-gcic.onrender.com/api/organization/plan/${selectedPlan.id}`
          }
        }
        else if (role === 'Admin' || role === 'assistant') {
          const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
          url = `https://rough-1-gcic.onrender.com/api/${baseUrl}/portal-plans/${selectedPlan.id}`;
        }

        // Optimistically update the UI
        setPlans(plans.filter((p) => p.id !== selectedPlan.id));
        handleMenuClose();

        // Send delete request to the server
        const response = await axios.delete(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              organizationId: organizationId
            }
          }
        );

        if (response.data.status === 'success') {
          Swal.fire(
            'Deleted!',
            'The plan has been deleted.',
            'success'
          );
        } else {
          // If the server request fails, revert the optimistic update
          fetchPlans();
          throw new Error(response.data.message || 'Failed to delete plan');
        }
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      Swal.fire(
        'Error!',
        error.message || 'Failed to delete plan',
        'error'
      );
      // Refresh plans in case of error
      await fetchPlans();
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleSaveClinicianPlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');
      
      if (adminPortal !== 'true' || !token) {
        throw new Error('Unauthorized to create clinician plans');
      }

      const response = await axios.post(
        'https://rough-1-gcic.onrender.com/api/clinicistPlan',
        planData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setClinicianPlans([...clinicianPlans, response.data.body]);
        toast.success('Clinician plan created successfully');
        handleCloseModal();
      } else {
        throw new Error(response.data.message || 'Failed to create clinician plan');
      }
    } catch (error) {
      console.error('Error creating clinician plan:', error);
      toast.error(error.message || 'Failed to create clinician plan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiClipboardListOutline} size={1.3} />
              </span> Subscription Plans
            </h3>
            <span>
              Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </span>
          </div>

          <Box mb={4}>
            <StyledButton
              variant="contained"
              color="primary"
              endIcon={bodyPartSectionExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              onClick={() => setBodyPartSectionExpanded(!bodyPartSectionExpanded)}
              fullWidth
              sx={{
                backgroundColor: '#7a990a',
                '&:hover': { backgroundColor: '#218838' },
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Patient Plans</Typography>
            </StyledButton>
            <Collapse in={bodyPartSectionExpanded}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'end', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal()}
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'auto', md: 'flex-end', lg: 'flex-end' } }}
                >
                  Add Plan
                </StyledButton>
              </Box>

              <Grid container spacing={3}>
                {plans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={plan.id}>
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                            {plan.name}
                          </Typography>
                          <IconButton onClick={(e) => handleMenuOpen(e, plan)} sx={{ color: '#fff' }}>
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="h4" component="p" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#fff' }}>
                          ${plan.price}
                          <Typography component="span" variant="body2" sx={{ verticalAlign: 'super', ml: 0.5, color: 'rgba(255, 255, 255, 0.8)' }}>
                            /{plan.validity} days
                          </Typography>
                        </Typography>
                        <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                          {plan.details}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {plan.status}
                          </Typography>
                          <StatusSwitch
                            checked={plan.status === 'Active'}
                            onChange={(e) => handleStatusChange(plan.id, e.target.checked)}
                            inputProps={{ 'aria-label': 'plan status' }}
                          />
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>

          {isAdminPortal && (
            <Box mb={4}>
              <StyledButton
                variant="contained"
                color="primary"
                endIcon={clinicianPlanSectionExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                onClick={() => setClinicianPlanSectionExpanded(!clinicianPlanSectionExpanded)}
                fullWidth
                sx={{
                  backgroundColor: '#4a148c',
                  '&:hover': { backgroundColor: '#6a1b9a' },
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Clinician Plans</Typography>
              </StyledButton>
              <Collapse in={clinicianPlanSectionExpanded}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'end', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal(null, 'clinician')}
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'auto', md: 'flex-end', lg: 'flex-end' } }}
                  >
                    Add Clinician Plan
                  </StyledButton>
                </Box>
                <Grid container spacing={3}>
                  {clinicianPlans.map((plan) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={plan._id}>
                      <ClinicianPlanCard
                        plan={plan}
                        onEdit={() => handleOpenModal(plan, 'clinician')}
                        onDelete={() => handleDeletePlan(plan._id, 'clinician')}
                        onStatusChange={(e) => handleStatusChange(plan._id, e.target.checked, 'clinician')}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Box>
          )}

          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
            <DialogTitle sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#fff', // Change text color to white for better contrast
              // backgroundColor: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', // Match navbar background
              background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',

              borderBottom: '2px solid #e0e0e0'
            }}>
              {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
            </DialogTitle>
            <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
              <PlanForm 
                plan={selectedPlan} 
                onSave={handleSavePlan} 
                onCancel={handleCloseModal} 
                isAdmin={isAdmin} 
                isAdminPortal={isAdminPortal}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: theme.palette.primary.contrastText,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    bottom: '-50%',
    left: '-50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
    transform: 'rotate(30deg)',
  },
}));

const StatusSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#4CAF50',
    '&:hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4CAF50',
  },
}));

const StyledButton = styled(Button)({
  borderRadius: '25px',
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  color: 'white',
  height: 48,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
  },
});

const PlanForm = ({ plan, onSave, onCancel, isAdmin, isAdminPortal }) => {
  const [formData, setFormData] = useState(plan || {
    name: '',
    price: '',
    details: '',
    validity: '',
    status: 'Active',
    planType: 'portal-plan',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    } else {
      setFormData({
        name: '',
        price: '',
        details: '',
        validity: '',
        status: 'Active',
        planType: 'portal-plan',
        startDate: '',
        endDate: '',
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData(prevData => ({ ...prevData, status: e.target.checked ? 'Active' : 'Inactive' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.planType === 'doctor-plan') {
      const clinicianPlanData = {
        planName: formData.name,
        price: parseFloat(formData.price),
        startDate: formData.startDate,
        endDate: formData.endDate,
        validity: parseInt(formData.validity),
      };
      onSave(clinicianPlanData);
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Plan Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Price (in USD)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Details"
        name="details"
        value={formData.details}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        required
      />
      <TextField
        fullWidth
        label="Validity (in days)"
        name="validity"
        type="number"
        value={formData.validity}
        onChange={handleChange}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal">
        <FormControlLabel
          control={
            <Switch
              checked={formData.status === 'Active'}
              onChange={handleStatusChange}
              name="status"
              color="primary"
            />
          }
          label={formData.status}
        />
      </FormControl>
      {isAdmin && isAdminPortal && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="plan-type-label">Plan Type</InputLabel>
          <Select
            labelId="plan-type-label"
            id="plan-type"
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            required
          >
            <MenuItem value="portal-plan">Portal Plan</MenuItem>
            <MenuItem value="doctor-plan">Doctor Plan</MenuItem>
          </Select>
        </FormControl>
      )}
      {isAdmin && isAdminPortal && formData.planType === 'doctor-plan' && (
        <>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
        </>
      )}
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {plan ? 'Update Plan' : 'Add Plan'} {/* Conditional button text */}
        </Button>
      </DialogActions>
    </form>
  );
};

const ClinicianPlanCard = ({ plan, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledCard>
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#fff' }}>
            {plan.planName}
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ color: '#fff' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" component="p" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#fff' }}>
          ${plan.price}
          <Typography component="span" variant="body2" sx={{ verticalAlign: 'super', ml: 0.5, color: 'rgba(255, 255, 255, 0.8)' }}>
            /{plan.validity} days
          </Typography>
        </Typography>
        <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
          {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {plan.status || 'Active'}
          </Typography>
          <StatusSwitch
            checked={plan.status === 'Active'}
            onChange={onStatusChange}
            inputProps={{ 'aria-label': 'plan status' }}
          />
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default PlansManagement;
