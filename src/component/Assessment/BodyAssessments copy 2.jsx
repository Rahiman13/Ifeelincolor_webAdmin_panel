import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Grid, Card, CardContent, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Backdrop, CircularProgress, Collapse, Checkbox, FormControlLabel, Input,
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiHumanHandsup, mdiChevronDown, mdiPlus, mdiDotsVertical, mdiEye, mdiPencil, mdiDelete, mdiChevronUp, mdiCloudUpload, mdiFormatListBulleted, mdiStar } from '@mdi/js';
import { Add, MoreVert, Visibility, Edit, Delete, ExpandMore, ExpandLess, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { lighten, darken } from '@mui/material/styles';

// Styled components
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 20px',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },
}));

// Helper function to calculate luminance
const getLuminance = (hexColor) => {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// Updated GradientCard component
const GradientCard = styled(motion.div)(({ theme, gradientIndex }) => {
  const gradients = [
    { start: '#667eea', end: '#764ba2' },
    { start: '#ff9a9e', end: '#fad0c4' },
    { start: '#a1c4fd', end: '#c2e9fb' },
    { start: '#fbc2eb', end: '#a6c1ee' },
    { start: '#fad0c4', end: '#ffd1ff' },
    { start: '#fa709a', end: '#fee140' },
  ];

  const { start, end } = gradients[gradientIndex % gradients.length];
  const isLightBackground = getLuminance(start) > 0.5 || getLuminance(end) > 0.5;
  const textColor = isLightBackground ? '#000000' : '#ffffff';
  const textShadow = isLightBackground ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)';

  return {
    background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
    color: textColor,
    borderRadius: 20,
    padding: '25px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
      transform: 'rotate(30deg)',
      transition: 'all 0.5s ease-in-out',
    },
    '&:hover::before': {
      transform: 'rotate(0deg)',
    },
    '& .MuiTypography-root': {
      color: textColor,
      textShadow: textShadow,
    },
    '& .MuiIconButton-root': {
      color: textColor,
      backgroundColor: isLightBackground ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
      '&:hover': {
        backgroundColor: isLightBackground ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
      },
    },
  };
});

const AssessmentCard = styled(motion.div)(({ theme, gradientIndex }) => {
  const gradients = [
    ['#FF6B6B', '#4ECDC4'],
    ['#A770EF', '#CF8BF3', '#FDB99B'],
    ['#00F260', '#0575E6'],
    ['#F857A6', '#FF5858'],
    ['#4776E6', '#8E54E9'],
    ['#FFD200', '#F7971E'],
  ];
  const [startColor, endColor] = gradients[gradientIndex % gradients.length];
  
  return {
    background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
    borderRadius: 20,
    padding: theme.spacing(3),
    color: theme.palette.getContrastText(startColor),
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle, ${lighten(startColor, 0.2)} 0%, transparent 50%)`,
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
    },
    '&:hover::before': {
      opacity: 0.3,
    },
  };
});

const QuestionTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  fontSize: '1.2rem',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  marginBottom: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const BodyAssessments = () => {
  // Body Parts state
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [openBodyPartModal, setOpenBodyPartModal] = useState(false);
  const [bodyPartModalMode, setBodyPartModalMode] = useState('view');
  const [bodyPartSectionExpanded, setBodyPartSectionExpanded] = useState(true);
  const [bodyPartAnchorEl, setBodyPartAnchorEl] = useState(null);

  // Body Assessments state
  const [bodyAssessments, setBodyAssessments] = useState([]);
  const [selectedBodyAssessment, setSelectedBodyAssessment] = useState(null);
  const [openBodyAssessmentModal, setOpenBodyAssessmentModal] = useState(false);
  const [bodyAssessmentModalMode, setBodyAssessmentModalMode] = useState('view');
  const [bodyAssessmentSectionExpanded, setBodyAssessmentSectionExpanded] = useState(true);
  const [bodyAssessmentAnchorEl, setBodyAssessmentAnchorEl] = useState(null);
  const [newBodyAssessment, setNewBodyAssessment] = useState({
    question: '',
    answer: '',
    type: 'mcq',
    score: 0,
    part: '',
    mcqOptions: [{ text: '', color: '', isCorrect: false }, { text: '', color: '', isCorrect: false }],
    media: null,
  });

  // Separate modals for view, edit, and add
  const [viewBodyAssessmentModal, setViewBodyAssessmentModal] = useState(false);
  const [editBodyAssessmentModal, setEditBodyAssessmentModal] = useState(false);
  const [addBodyAssessmentModal, setAddBodyAssessmentModal] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [moods, setMoods] = useState([]);
  const [newBodyPart, setNewBodyPart] = useState({ partName: '', description: '' });

  useEffect(() => {
    fetchBodyParts();
    fetchBodyAssessments();
    fetchMoods();
  }, []);

  // Body Parts functions
  const fetchBodyParts = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/body', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setBodyParts(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching body parts:', error);
        toast.error('Error fetching body parts');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBodyPartMenuOpen = (event, bodyPart) => {
    setBodyPartAnchorEl(event.currentTarget);
    setSelectedBodyPart(bodyPart);
  };

  const handleBodyPartMenuClose = () => {
    setBodyPartAnchorEl(null);
  };

  const handleBodyPartModalOpen = (mode) => {
    setBodyPartModalMode(mode);
    setOpenBodyPartModal(true);
    handleBodyPartMenuClose();
  };

  const handleBodyPartModalClose = () => {
    setOpenBodyPartModal(false);
    setSelectedBodyPart(null);
  };

  const handleAddBodyPart = () => {
    setNewBodyPart({ partName: '', description: '' });
    setOpenBodyPartModal(true);
    setBodyPartModalMode('add');
  };

  const handleBodyPartInputChange = (e) => {
    const { name, value } = e.target;
    setNewBodyPart(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBodyPart = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        let response;
        if (bodyPartModalMode === 'add') {
          response = await axios.post('https://rough-1-gcic.onrender.com/api/admin/body', newBodyPart, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (bodyPartModalMode === 'edit') {
          response = await axios.put(`https://rough-1-gcic.onrender.com/api/admin/body/${selectedBodyPart._id}`, selectedBodyPart, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response.data.status === 'success') {
          fetchBodyParts();
          handleBodyPartModalClose();
          toast.success(`Body part ${bodyPartModalMode === 'add' ? 'added' : 'updated'} successfully`);
        }
      } catch (error) {
        console.error(`Error ${bodyPartModalMode === 'add' ? 'adding' : 'updating'} body part:`, error);
        toast.error(`Error ${bodyPartModalMode === 'add' ? 'adding' : 'updating'} body part`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteBodyPart = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedBodyPart) {
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
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/admin/body/${selectedBodyPart._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            fetchBodyParts();
            handleBodyPartMenuClose();
            toast.success('Body part deleted successfully');
          }
        }
      } catch (error) {
        console.error('Error deleting body part:', error);
        toast.error('Error deleting body part');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Body Assessments functions
  const fetchBodyAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/bodytest', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setBodyAssessments(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching body assessments:', error);
        toast.error('Error fetching body assessments');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBodyAssessmentMenuOpen = (event, assessment) => {
    setBodyAssessmentAnchorEl(event.currentTarget);
    setSelectedBodyAssessment(assessment);
  };

  const handleBodyAssessmentMenuClose = () => {
    setBodyAssessmentAnchorEl(null);
  };

  const handleBodyAssessmentModalOpen = (mode, assessment = null) => {
    if (mode === 'view') {
      setSelectedBodyAssessment(assessment);
      setViewBodyAssessmentModal(true);
    } else if (mode === 'edit') {
      setNewBodyAssessment({
        ...assessment,
        mcqOptions: assessment.mcqOptions.map(option => ({
          ...option,
          isCorrect: option.text === assessment.answer
        }))
      });
      setEditBodyAssessmentModal(true);
    } else if (mode === 'add') {
      setNewBodyAssessment({
        question: '',
        answer: '',
        type: 'mcq',
        score: 0,
        part: '',
        mcqOptions: [{ text: '', color: '', isCorrect: false }, { text: '', color: '', isCorrect: false }],
        media: null,
      });
      setAddBodyAssessmentModal(true);
    }
    handleBodyAssessmentMenuClose();
  };

  const handleBodyAssessmentModalClose = () => {
    setViewBodyAssessmentModal(false);
    setEditBodyAssessmentModal(false);
    setAddBodyAssessmentModal(false);
    setSelectedBodyAssessment(null);
  };

  const handleBodyAssessmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewBodyAssessment(prev => ({ ...prev, [name]: value }));
  };

  const handleMcqOptionChange = (index, field, value) => {
    setNewBodyAssessment(prev => {
      const updatedOptions = [...prev.mcqOptions];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      if (field === 'isCorrect' && value) {
        updatedOptions.forEach((option, i) => {
          if (i !== index) option.isCorrect = false;
        });
      }
      return { ...prev, mcqOptions: updatedOptions };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewBodyAssessment(prev => ({
        ...prev,
        media: file
      }));
    }
  };

  const handleCreateBodyAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        
        // Validation
        if (!newBodyAssessment.question || !newBodyAssessment.part || newBodyAssessment.score === 0 || !newBodyAssessment.mcqOptions.some(option => option.isCorrect)) {
          toast.error('Please fill all required fields');
          setActionLoading(false);
          return;
        }

        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: newBodyAssessment.type,
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(option => ({
            text: option.text,
            color: option.color,
            isCorrect: option.isCorrect
          }))
        };

        console.log('Sending data:', bodyAssessmentData);
        const response = await axios.post('https://rough-1-gcic.onrender.com/api/bodytest', bodyAssessmentData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Response:', response.data);
        if (response.data.status === 'success') {
          setBodyAssessments([...bodyAssessments, response.data.body]);
          setNewBodyAssessment({
            question: '',
            answer: '',
            type: 'mcq',
            score: 0,
            part: '',
            mcqOptions: [{ text: '', color: '', isCorrect: false }, { text: '', color: '', isCorrect: false }],
            media: null,
          });
          handleBodyAssessmentModalClose();
          toast.success('Body assessment created successfully');
        }
      } catch (error) {
        console.error('Error creating body assessment:', error.response?.data || error.message);
        console.error('Full error object:', error);
        toast.error('Error creating body assessment: ' + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const fetchMoods = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/moods', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoods(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Error fetching moods');
      }
    }
  };

  const handleAddOption = () => {
    setNewBodyAssessment(prev => ({
      ...prev,
      mcqOptions: [...prev.mcqOptions, { text: '', color: '', isCorrect: false }]
    }));
  };

  const handleRemoveOption = (index) => {
    setNewBodyAssessment(prev => ({
      ...prev,
      mcqOptions: prev.mcqOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBodyAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        
        // Validation
        if (!newBodyAssessment.question || !newBodyAssessment.part || newBodyAssessment.score === 0 || !newBodyAssessment.mcqOptions.some(option => option.isCorrect)) {
          toast.error('Please fill all required fields');
          setActionLoading(false);
          return;
        }

        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: 'mcq', // Always set type to 'mcq'
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(({ text, color }) => ({ text, color }))
        };

        let response;
        if (bodyAssessmentModalMode === 'edit') {
          response = await axios.put(`https://rough-1-gcic.onrender.com/api/bodytest/${newBodyAssessment._id}`, bodyAssessmentData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          response = await axios.post('https://rough-1-gcic.onrender.com/api/bodytest', bodyAssessmentData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (response.data.status === 'success') {
          if (bodyAssessmentModalMode === 'edit') {
            setBodyAssessments(prevAssessments => 
              prevAssessments.map(assessment => 
                assessment._id === response.data.body._id ? response.data.body : assessment
              )
            );
            toast.success('Body assessment updated successfully');
          } else {
            setBodyAssessments(prevAssessments => [...prevAssessments, response.data.body]);
            toast.success('Body assessment created successfully');
          }
          handleBodyAssessmentModalClose();
        }
      } catch (error) {
        console.error('Error saving body assessment:', error);
        toast.error('Error saving body assessment: ' + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const editBodyAssessment = async (id, updatedData) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/bodytest/${id}`, updatedData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Body assessment updated successfully');
          return response.data.body;
        }
      } catch (error) {
        console.error('Error updating body assessment:', error);
        toast.error('Error updating body assessment');
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const fetchBodyAssessmentById = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get(`https://rough-1-gcic.onrender.com/api/bodytest/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          return response.data.body;
        } else {
          throw new Error(response.data.message || 'Failed to fetch body assessment');
        }
      } catch (error) {
        console.error('Error fetching body assessment:', error);
        toast.error('Error fetching body assessment: ' + (error.response?.data?.message || error.message));
        return null;
      }
    } else {
      toast.error('Unauthorized access');
      return null;
    }
  };

  const deleteBodyAssessment = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/bodytest/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Body assessment deleted successfully');
          return true;
        } else {
          throw new Error(response.data.message || 'Failed to delete body assessment');
        }
      } catch (error) {
        console.error('Error deleting body assessment:', error);
        toast.error('Error deleting body assessment: ' + (error.response?.data?.message || error.message));
        return false;
      }
    } else {
      toast.error('Unauthorized access');
      return false;
    }
  };

  const handleDeleteBodyAssessment = async (id) => {
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
      const success = await deleteBodyAssessment(id);
      if (success) {
        setBodyAssessments(prevAssessments => prevAssessments.filter(assessment => assessment._id !== id));
        handleBodyAssessmentMenuClose();
      }
    }
  };

  const handleEditBodyAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        
        // Prepare the data to be sent
        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: 'mcq', // Always set type to 'mcq'
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(({ text, color }) => ({ text, color }))
        };

        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/bodytest/${newBodyAssessment._id}`, bodyAssessmentData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          setBodyAssessments(prevAssessments => 
            prevAssessments.map(assessment => 
              assessment._id === response.data.body._id ? response.data.body : assessment
            )
          );
          handleBodyAssessmentModalClose();
          toast.success('Body assessment updated successfully');
        }
      } catch (error) {
        console.error('Error updating body assessment:', error);
        toast.error('Error updating body assessment: ' + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  // Render functions
  const renderBodyPartsSection = () => (
    <Box mb={4}>
      <StyledButton
        variant="contained"
        color="primary"
        endIcon={bodyPartSectionExpanded ? <Icon path={mdiChevronUp} size={1} /> : <Icon path={mdiChevronDown} size={1} />}
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
        <Typography variant="h6">Body Parts</Typography>
      </StyledButton>
      <Collapse in={bodyPartSectionExpanded}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<Icon path={mdiPlus} size={1} />}
            onClick={handleAddBodyPart}
            sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' } }}
          >
            Add Body Part
          </StyledButton>
        </Box>
        <Grid container spacing={3}>
          {bodyParts.map((part, index) => (
            <Grid item xs={12} sm={6} md={4} key={part._id}>
              <GradientCard
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                gradientIndex={index}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {part.partName}
                  </Typography>
                  <IconButton onClick={(e) => handleBodyPartMenuOpen(e, part)}>
                    <Icon path={mdiDotsVertical} size={1} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {part.description}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 70,
                    height: 70,
                    margin: '0 auto',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(15deg)',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Icon path={mdiHumanHandsup} size={1.8} />
                </Box>
              </GradientCard>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );

  const renderBodyAssessmentsSection = () => (
    <Box mb={4}>
      <StyledButton
        variant="contained"
        color="primary"
        endIcon={bodyAssessmentSectionExpanded ? <ExpandLess /> : <ExpandMore />}
        onClick={() => setBodyAssessmentSectionExpanded(!bodyAssessmentSectionExpanded)}
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
        <Typography variant="h6">Body Assessments</Typography>
      </StyledButton>
      <Collapse in={bodyAssessmentSectionExpanded}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => handleBodyAssessmentModalOpen('add')}
            sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' } }}
          >
            Add Body Assessment
          </StyledButton>
        </Box>
        <Grid container spacing={3}>
          {bodyAssessments.map((assessment, index) => (
            <Grid item xs={12} sm={6} md={4} key={assessment._id}>
              <AssessmentCard
                gradientIndex={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <QuestionTypography variant="h6" component="h2">
                    {assessment.question}
                  </QuestionTypography>
                  <IconButton 
                    onClick={(e) => handleBodyAssessmentMenuOpen(e, assessment)}
                    sx={{ 
                      color: 'inherit', 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                <InfoTypography variant="body2">
                  <Icon path={mdiFormatListBulleted} size={0.8} /> Type: {assessment.type}
                </InfoTypography>
                <InfoTypography variant="body2">
                  <Icon path={mdiStar} size={0.8} /> Score: {assessment.score}
                </InfoTypography>
                <InfoTypography variant="body2">
                  <Icon path={mdiHumanHandsup} size={0.8} /> Part: {bodyParts.find(part => part._id === assessment.part)?.partName || 'Unknown'}
                </InfoTypography>
              </AssessmentCard>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );

  const renderViewBodyAssessmentModal = () => (
    <Dialog
      open={viewBodyAssessmentModal}
      onClose={handleBodyAssessmentModalClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#fff',
        background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
        borderBottom: '2px solid #e0e0e0'
      }}>
        View Body Assessment
      </DialogTitle>
      <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        {selectedBodyAssessment && (
          <>
            <TextField
              fullWidth
              label="Question"
              value={selectedBodyAssessment.question || ''}
              disabled
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              label="Body Part"
              value={bodyParts.find(part => part._id === selectedBodyAssessment.part)?.partName || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Score"
              value={selectedBodyAssessment.score || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Type"
              value={selectedBodyAssessment.type || ''}
              disabled
              sx={{ mb: 2 }}
            />
            {selectedBodyAssessment.type === 'mcq' && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Options:</Typography>
                {selectedBodyAssessment.mcqOptions.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option.text}
                      disabled
                      sx={{ mr: 1 }}
                    />
                    <Checkbox
                      checked={option.text === selectedBodyAssessment.answer}
                      disabled
                    />
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
        <Button onClick={handleBodyAssessmentModalClose} sx={{
          color: '#666',
          '&:hover': { backgroundColor: '#f0f0f0' }
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditBodyAssessmentModal = () => (
    <Dialog
      open={editBodyAssessmentModal}
      onClose={handleBodyAssessmentModalClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#fff',
        background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
        borderBottom: '2px solid #e0e0e0'
      }}>
        Edit Body Assessment
      </DialogTitle>
      <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <TextField
          fullWidth
          margin="normal"
          label="Question"
          name="question"
          value={newBodyAssessment.question}
          onChange={handleBodyAssessmentInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Score"
          name="score"
          type="number"
          value={newBodyAssessment.score}
          onChange={handleBodyAssessmentInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Body Part"
          name="part"
          value={newBodyAssessment.part}
          onChange={handleBodyAssessmentInputChange}
          sx={{ mb: 2 }}
        >
          {bodyParts.map((part) => (
            <MenuItem key={part._id} value={part._id}>
              {part.partName}
            </MenuItem>
          ))}
        </TextField>
        {newBodyAssessment.mcqOptions.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => handleMcqOptionChange(index, 'text', e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="Mood"
              value={option.color}
              onChange={(e) => handleMcqOptionChange(index, 'color', e.target.value)}
            >
              {moods.map((mood) => (
                <MenuItem key={mood._id} value={mood._id}>
                  {mood.mood}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={option.isCorrect}
                  onChange={(e) => handleMcqOptionChange(index, 'isCorrect', e.target.checked)}
                />
              }
              label="Correct"
            />
            <IconButton onClick={() => handleRemoveOption(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddOption}
          sx={{ mt: 2, mb: 2 }}
        >
          Add Option
        </Button>
        <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
          Note: You can add multiple options. Ensure at least one option is marked as correct.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
        <Button onClick={handleBodyAssessmentModalClose} sx={{
          color: '#666',
          '&:hover': { backgroundColor: '#f0f0f0' }
        }}>
          Cancel
        </Button>
        <Button onClick={handleEditBodyAssessment} sx={{
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0',
          }
        }}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderBodyPartModal = () => (
    <Dialog
      open={openBodyPartModal}
      onClose={handleBodyPartModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#fff',
        background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
        borderBottom: '2px solid #e0e0e0'
      }}>
        {bodyPartModalMode === "edit" ? "Edit Body Part" : bodyPartModalMode === "add" ? "Add New Body Part" : "View Body Part"}
      </DialogTitle>
      <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <TextField
          fullWidth
          margin="normal"
          label="Part Name"
          name="partName"
          value={bodyPartModalMode === 'add' ? newBodyPart.partName : selectedBodyPart?.partName || ''}
          onChange={bodyPartModalMode === 'add' ? handleBodyPartInputChange : (e) => setSelectedBodyPart({ ...selectedBodyPart, partName: e.target.value })}
          disabled={bodyPartModalMode === 'view'}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          multiline
          rows={4}
          value={bodyPartModalMode === 'add' ? newBodyPart.description : selectedBodyPart?.description || ''}
          onChange={bodyPartModalMode === 'add' ? handleBodyPartInputChange : (e) => setSelectedBodyPart({ ...selectedBodyPart, description: e.target.value })}
          disabled={bodyPartModalMode === 'view'}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
        <Button onClick={handleBodyPartModalClose} sx={{
          color: '#666',
          '&:hover': { backgroundColor: '#f0f0f0' }
        }}>
          {bodyPartModalMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {bodyPartModalMode !== 'view' && (
          <Button
            onClick={handleSaveBodyPart}
            variant="contained"
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
        )}
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Container maxWidth="lg" className='p-3'>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <Icon path={mdiHumanHandsup} size={1.3} />
          </span>
          Body Assessments
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

      {renderBodyPartsSection()}
      {renderBodyAssessmentsSection()}

      {/* Body Part Modal */}
      {renderBodyPartModal()}

      {renderViewBodyAssessmentModal()}
      {renderEditBodyAssessmentModal()}

      {/* Add Body Assessment Modal */}
      <Dialog
        open={addBodyAssessmentModal}
        onClose={handleBodyAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#fff',
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          borderBottom: '2px solid #e0e0e0'
        }}>
          Add New Body Assessment
        </DialogTitle>
        <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            name="question"
            value={newBodyAssessment.question}
            onChange={handleBodyAssessmentInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Score"
            name="score"
            type="number"
            value={newBodyAssessment.score}
            onChange={handleBodyAssessmentInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            margin="normal"
            label="Body Part"
            name="part"
            value={newBodyAssessment.part}
            onChange={handleBodyAssessmentInputChange}
            sx={{ mb: 2 }}
          >
            {bodyParts.map((part) => (
              <MenuItem key={part._id} value={part._id}>
                {part.partName}
              </MenuItem>
            ))}
          </TextField>
          {newBodyAssessment.mcqOptions.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleMcqOptionChange(index, 'text', e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Mood"
                value={option.color}
                onChange={(e) => handleMcqOptionChange(index, 'color', e.target.value)}
              >
                {moods.map((mood) => (
                  <MenuItem key={mood._id} value={mood._id}>
                    {mood.mood}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) => handleMcqOptionChange(index, 'isCorrect', e.target.checked)}
                  />
                }
                label="Correct"
              />
                <IconButton onClick={() => handleRemoveOption(index)}>
                  <Delete />
                </IconButton>
              
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddOption}
            sx={{ mt: 2, mb: 2 }}
          >
            Add Option
          </Button>
          <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
            Note: You can add multiple options. Ensure at least one option is marked as correct.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
          <Button onClick={handleBodyAssessmentModalClose} sx={{
            color: '#666',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateBodyAssessment} sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Body Part Menu */}
      <Menu
        anchorEl={bodyPartAnchorEl}
        open={Boolean(bodyPartAnchorEl)}
        onClose={handleBodyPartMenuClose}
      >
        <MenuItem onClick={() => handleBodyPartModalOpen('view')}><Visibility sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={() => handleBodyPartModalOpen('edit')}><Edit sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleDeleteBodyPart}><Delete sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>

      {/* Body Assessment Menu */}
      <Menu
        anchorEl={bodyAssessmentAnchorEl}
        open={Boolean(bodyAssessmentAnchorEl)}
        onClose={handleBodyAssessmentMenuClose}
      >
        <MenuItem onClick={() => handleBodyAssessmentModalOpen('view', selectedBodyAssessment)}>
          <Visibility sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={() => handleBodyAssessmentModalOpen('edit', selectedBodyAssessment)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteBodyAssessment(selectedBodyAssessment._id)}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default BodyAssessments;
