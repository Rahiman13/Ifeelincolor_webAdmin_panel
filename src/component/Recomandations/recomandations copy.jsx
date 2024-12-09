import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grow, Grid, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Input, Modal, Fade, Backdrop, Menu, MenuItem } from '@mui/material';
import Icon from '@mdi/react';
import { mdiClipboardTextMultipleOutline, mdiAccountGroup, mdiDoctor, mdiPlus, mdiDelete, mdiCloudUpload, mdiFormatListBulleted, mdiStar, mdiDotsVertical, mdiPencil } from '@mdi/js';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const FilterToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  marginBottom: theme.spacing(3),
}));

const ToggleButton = styled(motion.button)(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 1),
  border: 'none',
  borderRadius: '20px',
  background: active ? 'white' : 'transparent',
  color: active ? '#2196F3' : 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
  },
}));

const PatientCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '15px',
  padding: theme.spacing(3),
  color: 'white',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const RecommendationModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(motion.div)(({ theme }) => ({
  backgroundColor: '#f0f4f8',
  borderRadius: '30px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  width: '90%',
  maxWidth: '1000px',
  maxHeight: '90vh',
  overflow: 'auto',
  backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const RecommendationCard = styled(motion.div)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '20px',
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
  },
}));

const MediaPreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const MediaItem = styled('img')({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  },
}));

const Recommendations = () => {
  const [filterPortalPatients, setFilterPortalPatients] = useState(true);
  const [patients, setPatients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState({
    recommendation: '',
    type: 'portal',
    relatedMedia: {
      images: [],
      documents: [],
      videos: []
    }
  });
  const [openRecommendationsModal, setOpenRecommendationsModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/subscriptions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setPatients(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
  };

  const fetchRecommendations = async (patientId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/rec/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          const patientRecommendations = response.data.body.filter(rec => rec.recommendedTo === patientId);
          setRecommendations(patientRecommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    fetchRecommendations(patient.patient._id);
    setOpenRecommendationsModal(true);
  };

  const handleCloseRecommendationsModal = () => {
    setOpenRecommendationsModal(false);
    setSelectedPatient(null);
    setRecommendations([]);
  };

  const handleAddRecommendation = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedPatient && newRecommendation.recommendation) {
      try {
        const formData = new FormData();
        formData.append('recommendation', newRecommendation.recommendation);
        formData.append('type', newRecommendation.type);
        formData.append('recommendedTo', selectedPatient.patient._id);

        // Append media files
        newRecommendation.relatedMedia.images.forEach((file) => {
          formData.append(`images`, file);
        });
        newRecommendation.relatedMedia.documents.forEach((file) => {
          formData.append(`documents`, file);
        });
        newRecommendation.relatedMedia.videos.forEach((file) => {
          formData.append(`videos`, file);
        });

        const response = await axios.post('https://rough-1-gcic.onrender.com/api/rec/create-rec', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.status === 'success') {
          fetchRecommendations(selectedPatient.patient._id);
          resetForm();
        }
      } catch (error) {
        console.error('Error adding recommendation:', error);
        // Show error message to user
      }
    }
  };

  const handleFileChange = (event, mediaType) => {
    const files = Array.from(event.target.files);
    setNewRecommendation(prev => ({
      ...prev,
      relatedMedia: {
        ...prev.relatedMedia,
        [mediaType]: files
      }
    }));
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        await axios.delete(`https://rough-1-gcic.onrender.com/api/rec/recommendations/${recommendationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRecommendations(selectedPatient.patient._id);
      } catch (error) {
        console.error('Error deleting recommendation:', error);
      }
    }
  };

  const handleMenuOpen = (event, recommendation) => {
    setAnchorEl(event.currentTarget);
    setEditingRecommendation(recommendation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditingRecommendation(null);
  };

  const handleEditRecommendation = (recommendation) => {
    setIsEditing(true);
    setNewRecommendation({
      ...recommendation,
      relatedMedia: {
        images: [],
        documents: [],
        videos: []
      }
    });
    setOpenDialog(true);
  };

  const handleUpdateRecommendation = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && isEditing) {
      try {
        const formData = new FormData();
        formData.append('recommendation', newRecommendation.recommendation);
        formData.append('type', newRecommendation.type);

        // Append media files
        newRecommendation.relatedMedia.images.forEach((file) => {
          formData.append(`images`, file);
        });
        newRecommendation.relatedMedia.documents.forEach((file) => {
          formData.append(`documents`, file);
        });
        newRecommendation.relatedMedia.videos.forEach((file) => {
          formData.append(`videos`, file);
        });

        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/rec/recommendations/${newRecommendation._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.status === 'success') {
          fetchRecommendations(selectedPatient.patient._id);
          resetForm();
        }
      } catch (error) {
        console.error('Error updating recommendation:', error);
        // Show error message to user
      }
    }
  };

  const resetForm = () => {
    setNewRecommendation({
      recommendation: '',
      type: 'portal',
      relatedMedia: {
        images: [],
        documents: [],
        videos: []
      }
    });
    setOpenDialog(false);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" className='p-3'>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <Icon path={mdiClipboardTextMultipleOutline} size={1.3} />
          </span>
          Recommendations
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span>
                Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </span>
            </li>
          </ul>
        </nav>
      </div>

      <FilterToggle>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
          View Recommendations For:
        </Typography>
        <Box>
          <ToggleButton
            active={filterPortalPatients}
            onClick={() => setFilterPortalPatients(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon path={mdiAccountGroup} size={1} style={{ marginRight: '8px' }} />
            Portal Patients
          </ToggleButton>
          <ToggleButton
            active={!filterPortalPatients}
            onClick={() => setFilterPortalPatients(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon path={mdiDoctor} size={1} style={{ marginRight: '8px' }} />
            Subscribed Patients
          </ToggleButton>
        </Box>
      </FilterToggle>

      <Grow in={true}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" component="div" gutterBottom>
            {filterPortalPatients ? "Portal Patients" : "Patients Subscribed to Clinicians"}
          </Typography>
          <Typography variant="body1">
            {filterPortalPatients
              ? "Showing recommendations for patients using the portal."
              : "Showing recommendations for patients subscribed to clinicians."}
          </Typography>
        </StyledPaper>
      </Grow>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {filterPortalPatients && patients.map((patient, index) => (
          <Grid item xs={12} sm={6} md={4} key={patient._id}>
            <PatientCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePatientClick(patient)}
            >
              <Avatar
                src={patient.patient.image}
                alt={patient.patient.userName}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>{patient.patient.userName}</Typography>
              <Typography variant="body2" gutterBottom>{patient.patient.email}</Typography>
              <Typography variant="body2" gutterBottom>{patient.patient.location}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Plan: {patient.plan.name}
              </Typography>
              <Typography variant="body2">
                Validity: {new Date(patient.endDate).toLocaleDateString()}
              </Typography>
            </PatientCard>
          </Grid>
        ))}
      </Grid>

      <RecommendationModal
        open={openRecommendationsModal}
        onClose={handleCloseRecommendationsModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openRecommendationsModal}>
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {selectedPatient && (
              <>
                <Box display="flex" alignItems="center" mb={4}>
                  <Avatar
                    src={selectedPatient.patient.image}
                    alt={selectedPatient.patient.userName}
                    sx={{ width: 100, height: 100, mr: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a237e">
                      {selectedPatient.patient.userName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedPatient.patient.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.patient.location}
                    </Typography>
                  </Box>
                </Box>
                <ActionButton
                  variant="contained"
                  startIcon={<Icon path={mdiPlus} size={1} />}
                  onClick={() => {
                    setIsEditing(false);
                    setOpenDialog(true);
                  }}
                  sx={{ mb: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}
                >
                  Add Recommendation
                </ActionButton>
                <AnimatePresence>
                  {recommendations.map((rec, index) => (
                    <RecommendationCard
                      key={rec._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom color="#1a237e">
                            <Icon path={mdiFormatListBulleted} size={1} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            {rec.recommendation}
                          </Typography>
                          <Typography variant="caption" display="block" mb={1} color="text.secondary">
                            <Icon path={mdiStar} size={0.8} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {new Date(rec.timestamp).toLocaleString()}
                          </Typography>
                          {rec.relatedMedia && (
                            <MediaPreview>
                              {rec.relatedMedia.images && rec.relatedMedia.images.map((img, i) => (
                                <MediaItem key={i} src={img.url} alt={`Image ${i}`} />
                              ))}
                              {rec.relatedMedia.documents && rec.relatedMedia.documents.map((doc, i) => (
                                <Box key={i} component="span" sx={{ p: 1, border: '1px solid #3f51b5', borderRadius: '10px', color: '#3f51b5', fontWeight: 'bold' }}>
                                  Doc {i+1}
                                </Box>
                              ))}
                              {rec.relatedMedia.videos && rec.relatedMedia.videos.map((video, i) => (
                                <Box key={i} component="span" sx={{ p: 1, border: '1px solid #f50057', borderRadius: '10px', color: '#f50057', fontWeight: 'bold' }}>
                                  Video {i+1}
                                </Box>
                              ))}
                            </MediaPreview>
                          )}
                        </Box>
                        <IconButton onClick={(event) => handleMenuOpen(event, rec)} sx={{ color: '#3f51b5' }}>
                          <Icon path={mdiDotsVertical} size={1} />
                        </IconButton>
                      </Box>
                    </RecommendationCard>
                  ))}
                </AnimatePresence>
              </>
            )}
          </ModalContent>
        </Fade>
      </RecommendationModal>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleEditRecommendation(editingRecommendation); handleMenuClose(); }}>
          <Icon path={mdiPencil} size={1} style={{ marginRight: '8px' }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDeleteRecommendation(editingRecommendation._id); handleMenuClose(); }}>
          <Icon path={mdiDelete} size={1} style={{ marginRight: '8px' }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>{isEditing ? 'Edit Recommendation' : 'Add New Recommendation'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recommendation"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecommendation.recommendation}
            onChange={(e) => setNewRecommendation(prev => ({ ...prev, recommendation: e.target.value }))}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Images</Typography>
            <Input
              type="file"
              inputProps={{ multiple: true, accept: 'image/*' }}
              onChange={(e) => handleFileChange(e, 'images')}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Documents</Typography>
            <Input
              type="file"
              inputProps={{ multiple: true, accept: '.pdf,.doc,.docx' }}
              onChange={(e) => handleFileChange(e, 'documents')}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Videos</Typography>
            <Input
              type="file"
              inputProps={{ multiple: true, accept: 'video/*' }}
              onChange={(e) => handleFileChange(e, 'videos')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button onClick={isEditing ? handleUpdateRecommendation : handleAddRecommendation}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recommendations;
