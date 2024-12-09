import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Grid, Card, CardContent, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Backdrop, CircularProgress, Collapse, Checkbox, FormControlLabel, Input,
  ToggleButtonGroup, ToggleButton, Chip, Divider,
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiHumanHandsup, mdiChevronDown, mdiPlus, mdiDotsVertical, mdiEye, mdiPencil, mdiDelete, mdiChevronUp, mdiCloudUpload, mdiFormatListBulleted, mdiStar, mdiAlertCircleOutline, mdiCheckCircle } from '@mdi/js';
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

const AssessmentCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  borderRadius: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateX(0)',
    }
  }
}));

const AssessmentCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '16px',
  position: 'relative',
});

const AssessmentCardContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
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

// Add these styled components at the top with the others
const StyledPageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  marginBottom: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '30px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '.page-title': {
    fontSize: '2.2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  '.page-title-icon': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '20px',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
    width: '55px',
    height: '55px',
  }
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '4px',
  display: 'flex',
  justifyContent: 'end',
  '& .MuiToggleButton-root': {
    color: '#1e293b',
    border: 'none',
    borderRadius: '8px',
    margin: '0 4px',
    padding: '6px 16px',
    textTransform: 'none',
    fontWeight: 500,
    '&.Mui-selected': {
      backgroundColor: '#3b82f6',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2563eb',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
  }
}));

const StyledDashboard = styled('div')(({ theme }) => ({
  // background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    zIndex: 0,
    borderRadius: '0 0 60px 60px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  }
}));

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease-in-out',
});

const AssessmentGrid = styled(Grid)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  padding: '24px 0',
});

// Add this new styled component for MCQ options
const McqOptionChip = styled(Box)(({ theme, isCorrect }) => ({
  padding: '8px 12px',
  borderRadius: '16px',
  backgroundColor: isCorrect ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  border: `1px solid ${isCorrect ? '#2e7d32' : 'rgba(0, 0, 0, 0.12)'}`,
  color: isCorrect ? '#2e7d32' : 'rgba(0, 0, 0, 0.87)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '4px 0',
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

  // Add new state for active tab
  const [activeTab, setActiveTab] = useState('bodyParts');

  // Add tab change handler
  const handleTabChange = (event, newValue) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

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

  const handleBodyPartModalOpen = async (mode, bodyPart = null) => {
    setBodyPartModalMode(mode);

    if (mode === 'edit' || mode === 'view') {
      const bodyPartData = await fetchBodyPartById(bodyPart._id);
      if (bodyPartData) {
        setSelectedBodyPart(bodyPartData);
        setOpenBodyPartModal(true);
      }
    } else {
      setNewBodyPart({ partName: '', description: '' });
      setOpenBodyPartModal(true);
    }
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
    if (bodyPartModalMode === 'add') {
      setNewBodyPart(prev => ({ ...prev, [name]: value }));
    } else {
      setSelectedBodyPart(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveBodyPart = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Validation
        const bodyPartData = bodyPartModalMode === 'add' ? newBodyPart : selectedBodyPart;
        if (!bodyPartData.partName || !bodyPartData.description) {
          toast.error('Please fill all required fields');
          setActionLoading(false);
          return;
        }

        let response;
        if (bodyPartModalMode === 'add') {
          response = await axios.post('https://rough-1-gcic.onrender.com/api/admin/body', bodyPartData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (bodyPartModalMode === 'edit') {
          response = await axios.put(`https://rough-1-gcic.onrender.com/api/admin/body/${selectedBodyPart._id}`, bodyPartData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response.data.status === 'success') {
          // Update the local state immediately for better UX
          if (bodyPartModalMode === 'edit') {
            setBodyParts(prevParts =>
              prevParts.map(part =>
                part._id === selectedBodyPart._id ? response.data.body : part
              )
            );
          } else {
            setBodyParts(prevParts => [...prevParts, response.data.body]);
          }

          handleBodyPartModalClose();
          toast.success(`Body part ${bodyPartModalMode === 'add' ? 'added' : 'updated'} successfully`);

          // Refresh the list to ensure synchronization
          fetchBodyParts();
        }
      } catch (error) {
        console.error(`Error ${bodyPartModalMode} body part:`, error);
        toast.error(`Error ${bodyPartModalMode} body part: ${error.response?.data?.message || error.message}`);
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const handleDeleteBodyPart = async (bodyPartId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && bodyPartId) {
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

          const response = await axios.delete(
            `https://rough-1-gcic.onrender.com/api/admin/body/${bodyPartId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.status === 'success') {
            // Update local state
            setBodyParts(prevParts => prevParts.filter(part => part._id !== bodyPartId));

            // Close any open menus
            handleBodyPartMenuClose();

            // Show success message
            toast.success('Body part deleted successfully');

            // Refresh the list
            await fetchBodyParts();
          }
        }
      } catch (error) {
        console.error('Error deleting body part:', error);
        toast.error(`Error deleting body part: ${error.response?.data?.message || error.message}`);
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access or invalid body part');
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
        if (!newBodyAssessment.question || !newBodyAssessment.part || 
            newBodyAssessment.score === 0 || 
            !newBodyAssessment.mcqOptions.some(option => option.isCorrect)) {
          toast.error('Please fill all required fields');
          return;
        }

        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: 'mcq',
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(option => ({
            text: option.text,
            color: option.color
          })),
          media: newBodyAssessment.media
        };

        const response = await axios.post(
          'https://rough-1-gcic.onrender.com/api/bodytest',
          bodyAssessmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status === 'success') {
          setBodyAssessments(prev => [...prev, response.data.body]);
          handleBodyAssessmentModalClose();
          toast.success('Body assessment created successfully');
          
          // Reset form
          setNewBodyAssessment({
            question: '',
            answer: '',
            type: 'mcq',
            score: 0,
            part: '',
            mcqOptions: [
              { text: '', color: '', isCorrect: false },
              { text: '', color: '', isCorrect: false }
            ],
            media: null
          });
        }
      } catch (error) {
        console.error('Error creating body assessment:', error);
        toast.error(`Error creating body assessment: ${error.response?.data?.message || error.message}`);
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

  // Add this new function to fetch body part by ID
  const fetchBodyPartById = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        const response = await axios.get(`https://rough-1-gcic.onrender.com/api/admin/body/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setSelectedBodyPart(response.data.body);
          return response.data.body;
        } else {
          throw new Error(response.data.message || 'Failed to fetch body part');
        }
      } catch (error) {
        console.error('Error fetching body part:', error);
        toast.error('Error fetching body part: ' + (error.response?.data?.message || error.message));
        return null;
      } finally {
        setActionLoading(false);
      }
    }
    return null;
  };

  // Add this function definition
  const handleDeleteIconClick = (event, bodyPart) => {
    event.stopPropagation(); // Prevent event bubbling
    handleDeleteBodyPart(bodyPart._id);
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
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBodyPartMenuOpen(e, part);
                    }}
                  >
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 600,
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Icon path={mdiFormatListBulleted} size={1} color="#3b82f6" />
          Body Assessments
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<Icon path={mdiPlus} size={1} />}
          onClick={() => handleBodyAssessmentModalOpen('add')}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white'
          }}
        >
          Add Assessment
        </StyledButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AssessmentGrid>
          {bodyAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment._id}
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <AssessmentCardHeader>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                    {assessment.question}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      icon={<Icon path={mdiFormatListBulleted} size={0.7} />}
                      label={assessment.type.toUpperCase()}
                      size="small"
                      sx={{ backgroundColor: '#e2e8f0' }}
                    />
                    <Chip
                      icon={<Icon path={mdiStar} size={0.7} />}
                      label={`Score: ${assessment.score}`}
                      size="small"
                      sx={{ backgroundColor: '#e2e8f0' }}
                    />
                  </Box>
                </Box>
                <ActionButtons className="action-buttons">
                  <IconButton
                    onClick={() => handleBodyAssessmentModalOpen('edit', assessment)}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
                    }}
                  >
                    <Icon path={mdiPencil} size={0.7} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteBodyAssessment(assessment._id)}
                    sx={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
                    }}
                  >
                    <Icon path={mdiDelete} size={0.7} />
                  </IconButton>
                </ActionButtons>
              </AssessmentCardHeader>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                  MCQ Options:
                </Typography>
                {assessment.mcqOptions.map((option, index) => (
                  <McqOptionChip
                    key={index}
                    isCorrect={option.text === assessment.answer}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {option.text}
                    </Typography>
                    {option.text === assessment.answer && (
                      <Icon path={mdiCheckCircle} size={0.7} color="#2e7d32" />
                    )}
                  </McqOptionChip>
                ))}
              </Box>

              {assessment.media && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                    Media Attachment
                  </Typography>
                  <Box
                    component="img"
                    src={assessment.media}
                    alt="Assessment media"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
            </AssessmentCard>
          ))}
        </AssessmentGrid>
      )}
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

  const renderBodyPartMenu = () => (
    <Menu
      anchorEl={bodyPartAnchorEl}
      open={Boolean(bodyPartAnchorEl)}
      onClose={handleBodyPartMenuClose}
    >
      <MenuItem onClick={() => handleBodyPartModalOpen('view', selectedBodyPart)}>
        <Visibility sx={{ mr: 1 }} /> View
      </MenuItem>
      <MenuItem onClick={() => handleBodyPartModalOpen('edit', selectedBodyPart)}>
        <Edit sx={{ mr: 1 }} /> Edit
      </MenuItem>
      <MenuItem
        onClick={() => selectedBodyPart && handleDeleteBodyPart(selectedBodyPart._id)}
        sx={{
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'error.light',
          }
        }}
      >
        <Delete sx={{ mr: 1 }} /> Delete
      </MenuItem>
    </Menu>
  );

  if (loading) {
    return (
      <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    // <Container maxWidth="lg" className='p-3'>
    <StyledDashboard>
      <StyledPageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon
              path={mdiHumanHandsup}
              size={1.5}
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          Body Assessments
        </div>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2
        }}>
          <span style={{
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}>
            Manage your body assessments and evaluations
            <Icon path={mdiAlertCircleOutline} size={0.7} color="#3b82f6" />
          </span>
        </Box>
        <Box sx={{ mt: 3 }}>
          <StyledToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={handleTabChange}
            aria-label="assessment sections"
          >
            <ToggleButton value="bodyParts" aria-label="body parts">
              <Icon path={mdiHumanHandsup} size={0.8} style={{ marginRight: '8px' }} />
              Body Parts
            </ToggleButton>
            <ToggleButton value="bodyAssessments" aria-label="body assessments">
              <Icon path={mdiFormatListBulleted} size={0.8} style={{ marginRight: '8px' }} />
              Body Assessments
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
      </StyledPageHeader>

      <Box sx={{ position: 'relative', zIndex: 1, mt: 9 }}>
        {/* Body Parts Section */}
        {activeTab === 'bodyParts' && (
          <Box mb={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="h5" sx={{
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Icon path={mdiHumanHandsup} size={1} color="#3b82f6" />
                Body Parts
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<Icon path={mdiPlus} size={1} />}
                onClick={handleAddBodyPart}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white'
                }}
              >
                Add Body Part
              </StyledButton>
            </Box>
            <AssessmentGrid>
              {bodyParts.map((bodyPart, index) => (
                <AssessmentCard key={bodyPart._id}>
                  <AssessmentCardHeader>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {bodyPart.partName}
                    </Typography>
                    <ActionButtons className="action-buttons">
                      <IconButton
                        onClick={() => handleBodyPartModalOpen('edit', bodyPart)}
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          }
                        }}
                      >
                        <Icon path={mdiPencil} size={0.7} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => handleDeleteIconClick(e, bodyPart)}
                        sx={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          }
                        }}
                      >
                        <Icon path={mdiDelete} size={0.7} />
                      </IconButton>
                    </ActionButtons>
                  </AssessmentCardHeader>
                  <AssessmentCardContent>
                    <Typography variant="body1" color="text.secondary">
                      {bodyPart.description}
                    </Typography>
                  </AssessmentCardContent>
                </AssessmentCard>
              ))}
            </AssessmentGrid>
          </Box>
        )}

        {/* Body Assessments Section */}
        {activeTab === 'bodyAssessments' && (
          <Box mb={4}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Icon path={mdiFormatListBulleted} size={1} color="#3b82f6" />
                Body Assessments
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<Icon path={mdiPlus} size={1} />}
                onClick={() => handleBodyAssessmentModalOpen('add')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white'
                }}
              >
                Add Assessment
              </StyledButton>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <AssessmentGrid>
                {bodyAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment._id}
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AssessmentCardHeader>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                          {assessment.question}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          <Chip
                            icon={<Icon path={mdiFormatListBulleted} size={0.7} />}
                            label={assessment.type.toUpperCase()}
                            size="small"
                            sx={{ backgroundColor: '#e2e8f0' }}
                          />
                          <Chip
                            icon={<Icon path={mdiStar} size={0.7} />}
                            label={`Score: ${assessment.score}`}
                            size="small"
                            sx={{ backgroundColor: '#e2e8f0' }}
                          />
                        </Box>
                      </Box>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => handleBodyAssessmentModalOpen('edit', assessment)}
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
                          }}
                        >
                          <Icon path={mdiPencil} size={0.7} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBodyAssessment(assessment._id)}
                          sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
                          }}
                        >
                          <Icon path={mdiDelete} size={0.7} />
                        </IconButton>
                      </ActionButtons>
                    </AssessmentCardHeader>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                        MCQ Options:
                      </Typography>
                      {assessment.mcqOptions.map((option, index) => (
                        <McqOptionChip
                          key={index}
                          isCorrect={option.text === assessment.answer}
                        >
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {option.text}
                          </Typography>
                          {option.text === assessment.answer && (
                            <Icon path={mdiCheckCircle} size={0.7} color="#2e7d32" />
                          )}
                        </McqOptionChip>
                      ))}
                    </Box>

                    {assessment.media && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                          Media Attachment
                        </Typography>
                        <Box
                          component="img"
                          src={assessment.media}
                          alt="Assessment media"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )}
                  </AssessmentCard>
                ))}
              </AssessmentGrid>
            )}
          </Box>
        )}
      </Box>

      {/* Keep existing modals and menus */}
      {renderBodyPartModal()}
      {renderViewBodyAssessmentModal()}
      {renderEditBodyAssessmentModal()}

      {/* ... rest of the existing code ... */}
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
    {renderBodyPartMenu()}

    <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>

    <ToastContainer position="top-right" autoClose={3000} />
  </StyledDashboard>

);
};

export default BodyAssessments;
