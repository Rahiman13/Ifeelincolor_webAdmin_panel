import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Backdrop, CircularProgress, Collapse, Divider, Select,
  Checkbox, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, MoreVert, Visibility, Edit, Delete, ExpandMore, ExpandLess, Assessment } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Icon from '@mdi/react';
import { mdiEmoticon } from '@mdi/js';
import { ChromePicker } from 'react-color';
import Swal from 'sweetalert2';
import { lighten, darken } from '@mui/material/styles';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const GradientCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(45deg, ${color || '#ffffff'} 30%, ${lightenColor(color) || '#ffffff'} 90%)`,
  borderRadius: 15,
  transition: '0.3s',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
  '&:hover': {
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
  },
}));

const StyledButton = styled(Button)({
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
});

const FancyCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  borderRadius: 15,
  transition: '0.3s',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
  },
}));

const FancyCardContent = styled(CardContent)({
  padding: '1.5rem',
});

const FancyTypography = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#ffffff',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
});

const FancyAssessmentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
  borderRadius: 16,
  transition: 'all 0.3s',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Tag = styled(Box)(({ theme, color }) => ({
  background: color,
  color: theme.palette.getContrastText(color),
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  display: 'inline-block',
  marginRight: theme.spacing(1),
}));

const MoodAssessmentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  borderRadius: 16,
  transition: 'all 0.3s',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const MoodAssessmentButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
  },
}));

const MoodAssessmentDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const MoodAssessmentDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: 'white',
  fontWeight: 'bold',
}));

function lightenColor(color) {
  if (!color) return '#ffffff';
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r},${g},${b},0.8)`;
}

function getContrastColor(hexColor) {
  // If hexColor is undefined or null, return black
  if (!hexColor) return '#000000';

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default function MoodAssessments() {
  const [moods, setMoods] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMoodModal, setOpenMoodModal] = useState(false);
  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [moodSectionExpanded, setMoodSectionExpanded] = useState(true);
  const [moodLevelAssessmentSectionExpanded, setMoodLevelAssessmentSectionExpanded] = useState(true);
  const [moodAssessmentSectionExpanded, setMoodAssessmentSectionExpanded] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [newAssessment, setNewAssessment] = useState({
    question: '',
    answer: [{ option: '', moodLevel: 'low' }],
    type: ''
  });
  const [openMoodLevelAssessmentModal, setOpenMoodLevelAssessmentModal] = useState(false);
  const [selectedMoodLevelAssessment, setSelectedMoodLevelAssessment] = useState(null);
  const [openAddMoodLevelAssessmentModal, setOpenAddMoodLevelAssessmentModal] = useState(false);
  const [newMoodLevelAssessment, setNewMoodLevelAssessment] = useState({
    question: '',
    answer: [
      { option: '', moodLevel: 'low' },
      { option: '', moodLevel: 'medium' },
      { option: '', moodLevel: 'extreme' }
    ],
    type: ''
  });
  const [moodAssessments, setMoodAssessments] = useState([]);
  const [selectedMoodAssessment, setSelectedMoodAssessment] = useState(null);
  const [openMoodAssessmentModal, setOpenMoodAssessmentModal] = useState(false);
  const [openCreateMoodAssessmentModal, setOpenCreateMoodAssessmentModal] = useState(false);
  const [newMoodAssessment, setNewMoodAssessment] = useState({
    question: '',
    answer: '',
    type: 'mcq',
    score: 0,
    category: '', // This will store the mood ID
    media: '',
    mcqOptions: [{ text: '', isCorrect: false }]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [moodAssessmentAnchorEl, setMoodAssessmentAnchorEl] = useState(null);

  useEffect(() => {
    fetchMoods();
    fetchMoodLevelAssessments();
    fetchMoodAssessments();
  }, []);

  const fetchMoods = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/moods', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoods(response.data.body);
          // toast.success('Moods fetched successfully');
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Error fetching moods');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMoodLevelAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/sub', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setAssessments(response.data.body);
          // toast.success('Mood level assessments fetched successfully');
        }
      } catch (error) {
        console.error('Error fetching mood level assessments:', error);
        toast.error('Error fetching mood level assessments');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMoodAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/test', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoodAssessments(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching mood assessments:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoodMenuOpen = (event, mood) => {
    setAnchorEl(event.currentTarget);
    setSelectedMood(mood);
  };

  const handleAssessmentMenuOpen = (event, assessment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssessment(assessment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoodModalOpen = (mode) => {
    setModalMode(mode);
    setOpenMoodModal(true);
    handleMenuClose();
  };

  const handleAssessmentModalOpen = (mode) => {
    setModalMode(mode);
    setOpenAssessmentModal(true);
    handleMenuClose();
  };

  const handleMoodModalClose = () => {
    setOpenMoodModal(false);
    setSelectedMood(null);
    setShowColorPicker(false);
  };

  const handleAssessmentModalClose = () => {
    setOpenAssessmentModal(false);
    setSelectedAssessment(null);
  };

  const handleAddMood = () => {
    setSelectedMood({ mood: '', description: '', hexColor: '#ffffff' });
    handleMoodModalOpen('add');
  };

  const handleColorChange = (color) => {
    setSelectedMood({ ...selectedMood, hexColor: color.hex });
  };

  const handleSaveMood = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        let response;
        if (modalMode === 'add') {
          response = await axios.post('https://rough-1-gcic.onrender.com/api/admin/add-mood', selectedMood, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (modalMode === 'edit') {
          response = await axios.put(`https://rough-1-gcic.onrender.com/api/admin/moods/${selectedMood._id}`, selectedMood, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response.data.status === 'success') {
          fetchMoods();
          handleMoodModalClose();
          Swal.fire({
            icon: 'success',
            title: `Mood ${modalMode === 'add' ? 'added' : 'updated'} successfully`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} mood:`, error);
        toast.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} mood`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteMood = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedMood) {
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
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/admin/moods/${selectedMood._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            setMoods(moods.filter(mood => mood._id !== selectedMood._id));
            handleMenuClose();
            Swal.fire(
              'Deleted!',
              'The mood has been deleted.',
              'success'
            );
          }
        }
      } catch (error) {
        console.error('Error deleting mood:', error);
        toast.error('Error deleting mood');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const toggleSection = (section) => {
    if (section === 'moods') {
      setMoodSectionExpanded(!moodSectionExpanded);
    } else if (section === 'moodLevelAssessments') {
      setMoodLevelAssessmentSectionExpanded(!moodLevelAssessmentSectionExpanded);
    } else if (section === 'moodAssessments') {
      setMoodAssessmentSectionExpanded(!moodAssessmentSectionExpanded);
    }
  };

  const handleAddAssessment = () => {
    setOpenAssessmentModal(true);
  };

  const handleAssessmentChange = (e) => {
    setNewAssessment({ ...newAssessment, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedAnswers = [...newAssessment.answer];
    updatedAnswers[index][field] = value;
    setNewAssessment({ ...newAssessment, answer: updatedAnswers });
  };

  const addOption = () => {
    setNewAssessment({
      ...newAssessment,
      answer: [...newAssessment.answer, { option: '', moodLevel: 'low' }]
    });
  };

  const removeOption = (index) => {
    const updatedAnswers = newAssessment.answer.filter((_, i) => i !== index);
    setNewAssessment({ ...newAssessment, answer: updatedAnswers });
  };

  const handleSaveAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        console.log('Sending assessment data:', newAssessment);
        const response = await axios.post('https://rough-1-gcic.onrender.com/api/sub', newAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          fetchAssessments();
          handleAssessmentModalClose();
          toast.success('Mood assessment created successfully');
        }
      } catch (error) {
        console.error('Error creating assessment:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          toast.error(`Error creating assessment: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          toast.error('Error creating assessment: No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          toast.error(`Error creating assessment: ${error.message}`);
        }
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (adminPortal === 'true' && token && selectedAssessment) {
        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/sub/${selectedAssessment._id}`, selectedAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setAssessments(prevAssessments =>
            prevAssessments.map(a => a._id === selectedAssessment._id ? response.data.body : a)
          );
          toast.success('Assessment updated successfully');
          handleAssessmentModalClose();
        }
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedAssessment) {
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
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/sub/${selectedAssessment._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            setAssessments(prevAssessments => prevAssessments.filter(a => a._id !== selectedAssessment._id));
            handleMenuClose();
            Swal.fire(
              'Deleted!',
              'The assessment has been deleted.',
              'success'
            );
          }
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error('Error deleting assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'question') {
      setSelectedAssessment({ ...selectedAssessment, question: value });
    } else if (name.startsWith('option') || name.startsWith('moodLevel')) {
      const updatedAnswers = [...selectedAssessment.answer];
      updatedAnswers[index][name.split('-')[0]] = value;
      setSelectedAssessment({ ...selectedAssessment, answer: updatedAnswers });
    }
  };

  const handleMoodLevelAssessmentMenuOpen = (event, assessment) => {
    setAnchorEl(event.currentTarget);
    setSelectedMoodLevelAssessment(assessment);
  };

  const handleMoodLevelAssessmentModalOpen = (mode) => {
    setModalMode(mode);
    setOpenMoodLevelAssessmentModal(true);
    handleMenuClose();
  };

  const handleMoodLevelAssessmentModalClose = () => {
    setOpenMoodLevelAssessmentModal(false);
    setSelectedMoodLevelAssessment(null);
  };

  const handleSaveMoodLevelAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedMoodLevelAssessment) {
      try {
        setActionLoading(true);
        const response = await axios.put(`https://rough-1-gcic.onrender.com/api/sub/${selectedMoodLevelAssessment._id}`, selectedMoodLevelAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          fetchMoodLevelAssessments();
          handleMoodLevelAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood level assessment updated successfully',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error updating mood level assessment:', error);
        toast.error('Error updating mood level assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteMoodLevelAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedMoodLevelAssessment) {
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
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/sub/${selectedMoodLevelAssessment._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            setAssessments(assessments.filter(assessment => assessment._id !== selectedMoodLevelAssessment._id));
            handleMenuClose();
            Swal.fire(
              'Deleted!',
              'The mood level assessment has been deleted.',
              'success'
            );
          }
        }
      } catch (error) {
        console.error('Error deleting mood level assessment:', error);
        toast.error('Error deleting mood level assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddMoodLevelAssessmentModalOpen = () => {
    setOpenAddMoodLevelAssessmentModal(true);
  };

  const handleAddMoodLevelAssessmentModalClose = () => {
    setOpenAddMoodLevelAssessmentModal(false);
    setNewMoodLevelAssessment({
      question: '',
      answer: [
        { option: '', moodLevel: 'low' },
        { option: '', moodLevel: 'medium' },
        { option: '', moodLevel: 'extreme' }
      ],
      type: ''
    });
  };

  const handleNewMoodLevelAssessmentChange = (e) => {
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, [e.target.name]: e.target.value });
  };

  const handleNewMoodLevelAssessmentOptionChange = (index, field, value) => {
    const updatedAnswers = [...newMoodLevelAssessment.answer];
    updatedAnswers[index][field] = value;
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, answer: updatedAnswers });
  };

  const handleAddNewMoodLevelAssessmentOption = () => {
    setNewMoodLevelAssessment({
      ...newMoodLevelAssessment,
      answer: [...newMoodLevelAssessment.answer, { option: '', moodLevel: 'low' }]
    });
  };

  const handleRemoveNewMoodLevelAssessmentOption = (index) => {
    const updatedAnswers = newMoodLevelAssessment.answer.filter((_, i) => i !== index);
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, answer: updatedAnswers });
  };

  const handleSaveNewMoodLevelAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        const response = await axios.post('https://rough-1-gcic.onrender.com/api/sub', newMoodLevelAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          fetchMoodLevelAssessments();
          handleAddMoodLevelAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood level assessment created successfully',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error creating mood level assessment:', error);
        toast.error('Error creating mood level assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMoodAssessmentModalOpen = async (mode, assessmentId) => {
    console.log('Opening modal:', mode, assessmentId);
    setModalMode(mode);
    if (assessmentId) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`https://rough-1-gcic.onrender.com/api/test/${assessmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.status === 'success') {
          console.log('Fetched assessment:', response.data.body);
          setSelectedMoodAssessment(response.data.body);
        } else {
          throw new Error('Failed to fetch assessment details');
        }
      } catch (error) {
        console.error('Error fetching assessment details:', error);
        toast.error('Error fetching assessment details');
        return;
      }
    }
    setOpenMoodAssessmentModal(true);
  };

  const handleMoodAssessmentModalClose = () => {
    setOpenMoodAssessmentModal(false);
    setSelectedMoodAssessment(null);
    setModalMode('');
  };

  const handleCreateMoodAssessmentModalOpen = () => {
    setOpenCreateMoodAssessmentModal(true);
  };

  const handleCreateMoodAssessmentModalClose = () => {
    setOpenCreateMoodAssessmentModal(false);
    setNewMoodAssessment({
      question: '',
      answer: '',
      type: 'mcq',
      score: 0,
      category: '', // This will store the mood ID
      media: '',
      mcqOptions: [{ text: '', isCorrect: false }]
    });
  };

  const handleNewMoodAssessmentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      // Reset answer when changing type
      setNewMoodAssessment({
        ...newMoodAssessment,
        [name]: value,
        answer: '',
        mcqOptions: value === 'mcq' ? [{ text: '', isCorrect: false }] : []
      });
    } else {
      setNewMoodAssessment({ ...newMoodAssessment, [name]: value });
    }
  };

  const handleNewMoodAssessmentOptionChange = (index, field, value) => {
    const updatedOptions = [...newMoodAssessment.mcqOptions];
    updatedOptions[index][field] = value;
    
    // If the field is 'isCorrect' and it's being set to true, set all others to false
    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((option, i) => {
        if (i !== index) option.isCorrect = false;
      });
    }

    // Set the answer to the text of the correct option
    const answer = updatedOptions.find(option => option.isCorrect)?.text || '';

    setNewMoodAssessment({
      ...newMoodAssessment,
      mcqOptions: updatedOptions,
      answer: answer
    });
  };

  const handleAddNewMoodAssessmentOption = () => {
    setNewMoodAssessment({
      ...newMoodAssessment,
      mcqOptions: [...newMoodAssessment.mcqOptions, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveNewMoodAssessmentOption = (index) => {
    const updatedOptions = newMoodAssessment.mcqOptions.filter((_, i) => i !== index);
    setNewMoodAssessment({ ...newMoodAssessment, mcqOptions: updatedOptions });
  };

  const handleSaveNewMoodAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        const minimalData = {
          question: newMoodAssessment.question,
          type: newMoodAssessment.type,
          score: Number(newMoodAssessment.score),
          category: newMoodAssessment.category,
          answer: newMoodAssessment.answer,
          mcqOptions: newMoodAssessment.type === 'mcq' ? newMoodAssessment.mcqOptions : undefined
        };

        console.log('Sending data:', minimalData);

        const response = await axios.post('https://rough-1-gcic.onrender.com/api/test/create', minimalData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Server response:', response.data);

        if (response.data.status === 'success') {
          fetchMoodAssessments();
          handleCreateMoodAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood assessment created successfully',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          throw new Error(response.data.message || 'Unexpected response from server');
        }
      } catch (error) {
        console.error('Error creating mood assessment:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          toast.error(`Error creating assessment: ${error.response.data.message || 'Unknown server error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          toast.error('Error creating assessment: No response received from server');
        } else {
          console.error('Error message:', error.message);
          toast.error(`Error creating assessment: ${error.message}`);
        }
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('You do not have permission to perform this action');
    }
  };

  const handleEditMoodAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedMoodAssessment) {
      try {
        setActionLoading(true);

        // Create a simple object instead of FormData
        const updateData = {
          question: selectedMoodAssessment.question,
          type: selectedMoodAssessment.type,
          score: Number(selectedMoodAssessment.score), // Ensure this is a number
          category: selectedMoodAssessment.category,
          answer: selectedMoodAssessment.answer,
          mcqOptions: selectedMoodAssessment.type === 'mcq' ? selectedMoodAssessment.mcqOptions : undefined
        };

        // Log the data being sent
        console.log('Sending data to server:', JSON.stringify(updateData, null, 2));

        const response = await axios.put(
          `https://rough-1-gcic.onrender.com/api/test/${selectedMoodAssessment._id}`,
          updateData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Server response:', response.data);

        if (response.data.status === 'success') {
          fetchMoodAssessments();
          handleMoodAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood assessment updated successfully',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          throw new Error(response.data.message || 'Unexpected response from server');
        }
      } catch (error) {
        console.error('Error updating mood assessment:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          toast.error(`Error updating assessment: ${error.response.data.message || 'Unknown server error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          toast.error('Error updating assessment: No response received from server');
        } else {
          console.error('Error message:', error.message);
          toast.error(`Error updating assessment: ${error.message}`);
        }
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('You do not have permission to perform this action');
    }
  };

  const fetchMoodAssessmentDetails = async (assessmentId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        const response = await axios.get(`https://rough-1-gcic.onrender.com/api/test/${assessmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Fetched assessment details:', response.data);

        if (response.data.status === 'success' && response.data.body) {
          // Return the body of the response, which should contain the assessment data
          return response.data.body;
        } else {
          throw new Error('Failed to fetch assessment details or data is missing');
        }
      } catch (error) {
        console.error('Error fetching mood assessment details:', error);
        throw error;
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteMoodAssessment = async (assessmentId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    console.log('Delete attempt:', { adminPortal, hasToken: !!token, assessmentId });

    if (adminPortal === 'true' && token) {
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
          console.log('Sending delete request for assessment:', assessmentId);
          
          const response = await axios.delete(`https://rough-1-gcic.onrender.com/api/test/${assessmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log('Delete response:', response.data);

          if (response.data.status === 'success') {
            setMoodAssessments(prevAssessments => prevAssessments.filter(assessment => assessment._id !== assessmentId));
            Swal.fire(
              'Deleted!',
              'The mood assessment has been deleted.',
              'success'
            );
          } else {
            throw new Error('Unexpected response status');
          }
        }
      } catch (error) {
        console.error('Error deleting mood assessment:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        toast.error(`Error deleting assessment: ${error.response?.data?.message || error.message}`);
      } finally {
        setActionLoading(false);
      }
    } else {
      console.error('Delete conditions not met:', { adminPortal, hasToken: !!token });
      toast.error('Unable to delete assessment. Please check your permissions.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Modify this function for both create and edit modals
  const renderMediaUpload = (isEditMode = false) => {
    const assessment = isEditMode ? selectedMoodAssessment : newMoodAssessment;
    const setAssessment = isEditMode ? setSelectedMoodAssessment : setNewMoodAssessment;

    if (assessment.type === 'mcq') {
      return null; // Hide media for multiple choice questions
    }

    return (
      <>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept="image/*,video/*"
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          sx={{ mt: 2, mb: 2 }}
        >
          {selectedFile ? 'Change Media File' : 'Upload Media File'}
        </Button>
        {(selectedFile || assessment.media) && (
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="body2" mr={2}>
              {selectedFile ? selectedFile.name : 'Current media file'}
            </Typography>
            <IconButton onClick={handleDeleteFile} size="small">
              <Delete />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const handleMoodAssessmentMenuOpen = (event, assessment) => {
    setMoodAssessmentAnchorEl(event.currentTarget);
    setSelectedMoodAssessment(assessment);
  };

  const handleMoodAssessmentMenuClose = () => {
    setMoodAssessmentAnchorEl(null);
    setSelectedMoodAssessment(null);
  };

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
            <Icon path={mdiEmoticon} size={1.3} />
          </span>
          Mood Assessments
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

      {/* Moods Section */}
      <Box mb={4}>
        <StyledButton
          variant="contained"
          color="primary"
          endIcon={moodSectionExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => toggleSection('moods')}
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
          <Typography variant="h6">Moods</Typography>
        </StyledButton>
        <Collapse in={moodSectionExpanded}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={handleAddMood}
              sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' } }}
            >
              Add Mood
            </StyledButton>
          </Box>
          <Grid container spacing={3}>
            {moods.map((mood) => (
              <Grid item xs={12} sm={6} md={4} key={mood._id}>
                <GradientCard color={mood.hexColor}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{ color: getContrastColor(mood.hexColor) }}
                      >
                        {mood.mood}
                      </Typography>
                      <IconButton onClick={(e) => handleMoodMenuOpen(e, mood)}>
                        <MoreVert sx={{ color: getContrastColor(mood.hexColor) }} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: getContrastColor(mood.hexColor) }}
                    >
                      {mood.description}
                    </Typography>
                  </CardContent>
                </GradientCard>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Mood Level Assessments Section */}
      <Box mb={4}>
        <StyledButton
          variant="contained"
          color="primary"
          endIcon={moodLevelAssessmentSectionExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => toggleSection('moodLevelAssessments')}
          fullWidth
          sx={{
            backgroundColor: '#17a2b8',
            '&:hover': { backgroundColor: '#138496' },
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Mood Level Assessments</Typography>
        </StyledButton>
        <Collapse in={moodLevelAssessmentSectionExpanded}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={handleAddMoodLevelAssessmentModalOpen}
              sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' }, borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            >
              Add Mood Level Assessment
            </StyledButton>
          </Box>
          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment._id}>
                <FancyCard sx={{ borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', transition: 'all 0.3s ease-in-out' }}>
                  <FancyCardContent sx={{ padding: '20px' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FancyTypography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {assessment.question}
                      </FancyTypography>
                      <IconButton onClick={(e) => handleMoodLevelAssessmentMenuOpen(e, assessment)} sx={{ color: '#333' }}>
                        <MoreVert />
                      </IconButton>
                    </Box>
                    {assessment.answer.map((ans, index) => (
                      <Typography key={ans._id} variant="body2" sx={{ color: '#333', mt: 1, fontWeight: 'normal' }}>
                        {index + 1}. {ans.option} - {ans.moodLevel}
                      </Typography>
                    ))}
                  </FancyCardContent>
                </FancyCard>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Mood Assessments Section */}
      <Box mb={4}>
        <StyledButton
          variant="contained"
          color="primary"
          endIcon={moodAssessmentSectionExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => toggleSection('moodAssessments')}
          fullWidth
          sx={{
            backgroundColor: '#FF6B6B',
            '&:hover': { backgroundColor: '#FF8E53' },
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Mood Assessments</Typography>
        </StyledButton>
        <Collapse in={moodAssessmentSectionExpanded}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={handleCreateMoodAssessmentModalOpen}
              sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' } }}
            >
              Create Mood Assessment
            </StyledButton>
          </Box>
          <Grid container spacing={3}>
            {moodAssessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment._id}>
                <MoodAssessmentCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" component="h2" sx={{ color: '#fff' }}>
                        {assessment.question}
                      </Typography>
                      <IconButton 
                        onClick={(e) => handleMoodAssessmentMenuOpen(e, assessment)}
                        sx={{ color: '#fff' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#fff', mt: 1 }}>
                      Type: {assessment.type}
                    </Typography>
                    {assessment.type === 'mcq' && (
                      <Box mt={1}>
                        {assessment.mcqOptions.map((option, index) => (
                          <Typography key={index} variant="body2" sx={{ color: '#fff' }}>
                            • {option.text}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </MoodAssessmentCard>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Box>

      {/* Mood Modal */}
      <Dialog
        open={openMoodModal}
        onClose={handleMoodModalClose}
        maxWidth="sm"
        fullWidth
        sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#fff',
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          borderBottom: '2px solid #e0e0e0'
        }}>
          {modalMode === "edit" ? "Edit Mood" : modalMode === "add" ? "Add New Mood" : "View Mood"}
        </DialogTitle>
        <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Mood"
            name="mood"
            value={selectedMood?.mood || ''}
            onChange={(e) => setSelectedMood({ ...selectedMood, mood: e.target.value })}
            disabled={modalMode === 'view'}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={selectedMood?.description || ''}
            onChange={(e) => setSelectedMood({ ...selectedMood, description: e.target.value })}
            disabled={modalMode === 'view'}
          />
          {modalMode !== 'view' && (
            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={() => setShowColorPicker(!showColorPicker)}
                sx={{ marginBottom: 2 }}
              >
                {showColorPicker ? 'Close Color Picker' : 'Open Color Picker'}
              </Button>
              {showColorPicker && (
                <ChromePicker
                  color={selectedMood?.hexColor || '#ffffff'}
                  onChange={handleColorChange}
                  disableAlpha={true}
                />
              )}
            </Box>
          )}
          {modalMode === 'view' && (
            <Box mt={2} display="flex" alignItems="center">
              <Typography variant="body1" sx={{ marginRight: 2 }}>Color:</Typography>
              <Box
                width={40}
                height={40}
                bgcolor={selectedMood?.hexColor || '#ffffff'}
                border="1px solid #000"
                borderRadius="4px"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoodModalClose}>Cancel</Button>
          {modalMode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSaveMood}
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

      {/* Assessment Modal */}
      <Dialog
        open={openAssessmentModal}
        onClose={handleAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalMode === "edit" ? "Edit Assessment" : modalMode === "add" ? "Add New Assessment" : "View Assessment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            name="question"
            value={selectedAssessment?.question || ''}
            onChange={(e) => setSelectedAssessment({ ...selectedAssessment, question: e.target.value })}
            disabled={modalMode === 'view'}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            margin="normal"
            label="Type"
            name="type"
            value={selectedAssessment?.type || ''}
            onChange={(e) => setSelectedAssessment({ ...selectedAssessment, type: e.target.value })}
            disabled={modalMode === 'view'}
            sx={{ mb: 2 }}
          >
            <MenuItem value='' disabled>Select Mood</MenuItem>
            {moods.map((mood) => (
              <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
            ))}
          </Select>

          {selectedAssessment?.answer.map((answer, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={answer.option}
                onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
                disabled={modalMode === 'view'}
              />
              <Select
                value={answer.moodLevel}
                onChange={(e) => handleOptionChange(index, 'moodLevel', e.target.value)}
                disabled={modalMode === 'view'}
                sx={{ ml: 2, minWidth: 120 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="extreme">Extreme</MenuItem>
              </Select>
              {modalMode !== 'view' && (
                <IconButton onClick={() => removeOption(index)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          {modalMode !== 'view' && (
            <Button onClick={addOption} startIcon={<Add />} sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}>
              Add Option
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssessmentModalClose}>Cancel</Button>
          {modalMode !== 'view' && (
            <Button onClick={handleSaveAssessment} variant="contained" color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Mood Level Assessment Modal */}
      <Dialog
        open={openMoodLevelAssessmentModal}
        onClose={handleMoodLevelAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalMode === "edit" ? "Edit Mood Level Assessment" : modalMode === "add" ? "Add New Mood Level Assessment" : "View Mood Level Assessment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            name="question"
            value={selectedMoodLevelAssessment?.question || ''}
            onChange={(e) => setSelectedMoodLevelAssessment({ ...selectedMoodLevelAssessment, question: e.target.value })}
            disabled={modalMode === 'view'}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            margin="normal"
            label="Type"
            name="type"
            value={selectedMoodLevelAssessment?.type || ''}
            onChange={(e) => setSelectedMoodLevelAssessment({ ...selectedMoodLevelAssessment, type: e.target.value })}
            disabled={modalMode === 'view'}
            sx={{ mb: 2 }}
          >
            <MenuItem value='' disabled>Select Mood</MenuItem>
            {moods.map((mood) => (
              <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
            ))}
          </Select>

          {selectedMoodLevelAssessment?.answer.map((answer, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={answer.option}
                onChange={(e) => {
                  const updatedAnswers = [...selectedMoodLevelAssessment.answer];
                  updatedAnswers[index].option = e.target.value;
                  setSelectedMoodLevelAssessment({ ...selectedMoodLevelAssessment, answer: updatedAnswers });
                }}
                disabled={modalMode === 'view'}
              />
              <Select
                value={answer.moodLevel}
                onChange={(e) => {
                  const updatedAnswers = [...selectedMoodLevelAssessment.answer];
                  updatedAnswers[index].moodLevel = e.target.value;
                  setSelectedMoodLevelAssessment({ ...selectedMoodLevelAssessment, answer: updatedAnswers });
                }}
                disabled={modalMode === 'view'}
                sx={{ ml: 2, minWidth: 120 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="extreme">Extreme</MenuItem>
              </Select>
              {modalMode !== 'view' && (
                <IconButton onClick={() => {
                  const updatedAnswers = selectedMoodLevelAssessment.answer.filter((_, i) => i !== index);
                  setSelectedMoodLevelAssessment({ ...selectedMoodLevelAssessment, answer: updatedAnswers });
                }}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          {modalMode !== 'view' && (
            <Button
              onClick={() => {
                const newAnswer = { option: '', moodLevel: 'low' };
                setSelectedMoodLevelAssessment({
                  ...selectedMoodLevelAssessment,
                  answer: [...selectedMoodLevelAssessment.answer, newAnswer]
                });
              }}
              startIcon={<Add />}
              sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}
            >
              Add Option
            </Button>
          )}
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Note: You can add up to 3 options.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoodLevelAssessmentModalClose}>Cancel</Button>
          {modalMode !== 'view' && (
            <Button onClick={handleSaveMoodLevelAssessment} variant="contained" color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Mood Level Assessment Modal */}
      <Dialog
        open={openAddMoodLevelAssessmentModal}
        onClose={handleAddMoodLevelAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Mood Level Assessment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            name="question"
            value={newMoodLevelAssessment.question}
            onChange={handleNewMoodLevelAssessmentChange}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            margin="normal"
            label="Type"
            name="type"
            value={newMoodLevelAssessment.type}
            onChange={handleNewMoodLevelAssessmentChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value='' disabled>Select Mood</MenuItem>
            {moods.map((mood) => (
              <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
            ))}
          </Select>

          {newMoodLevelAssessment.answer.map((answer, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={answer.option}
                onChange={(e) => handleNewMoodLevelAssessmentOptionChange(index, 'option', e.target.value)}
              />
              <Select
                value={answer.moodLevel}
                onChange={(e) => handleNewMoodLevelAssessmentOptionChange(index, 'moodLevel', e.target.value)}
                sx={{ ml: 2, minWidth: 120 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="extreme">Extreme</MenuItem>
              </Select>
              <IconButton onClick={() => handleRemoveNewMoodLevelAssessmentOption(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={handleAddNewMoodLevelAssessmentOption}
            startIcon={<Add />}
            sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Add Option
          </Button>
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Note: You can add up to 3 options.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMoodLevelAssessmentModalClose}>Cancel</Button>
          <Button onClick={handleSaveNewMoodLevelAssessment} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mood Assessment Modal */}
      <Dialog
        open={openMoodAssessmentModal}
        onClose={handleMoodAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalMode === "edit" ? "Edit Mood Assessment" : "View Mood Assessment"}
        </DialogTitle>
        <DialogContent>
          {selectedMoodAssessment && (
            <>
              <TextField
                fullWidth
                label="Question"
                value={selectedMoodAssessment.question || ''}
                disabled={modalMode === 'view'}
                sx={{ mb: 2, mt: 2 }}
              />
              <TextField
                fullWidth
                label="Category"
                value={selectedMoodAssessment.category?.mood || ''}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Score"
                value={selectedMoodAssessment.score || ''}
                disabled={modalMode === 'view'}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Type"
                value={selectedMoodAssessment.type || ''}
                disabled
                sx={{ mb: 2 }}
              />
              {selectedMoodAssessment.type === 'blanks' && (
                <TextField
                  fullWidth
                  label="Answer"
                  value={selectedMoodAssessment.answer || ''}
                  disabled={modalMode === 'view'}
                  sx={{ mb: 2 }}
                />
              )}
              {selectedMoodAssessment.type === 'mcq' && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Options:</Typography>
                  {selectedMoodAssessment.mcqOptions.map((option, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option.text}
                        disabled={modalMode === 'view'}
                        sx={{ mr: 1 }}
                      />
                      <Checkbox
                        checked={option.isCorrect}
                        disabled={modalMode === 'view'}
                      />
                    </Box>
                  ))}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoodAssessmentModalClose}>Close</Button>
          {modalMode === 'edit' && (
            <Button onClick={handleEditMoodAssessment} variant="contained" color="primary">
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Mood Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedMood}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMoodModalOpen('view')}><Visibility sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={() => handleMoodModalOpen('edit')}><Edit sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleDeleteMood}><Delete sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>

      {/* Assessment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedAssessment}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAssessmentModalOpen('view')}><Visibility sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={() => handleAssessmentModalOpen('edit')}><Edit sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleDelete}><Delete sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>

      {/* Mood Level Assessment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedMoodLevelAssessment}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMoodLevelAssessmentModalOpen('view')}><Visibility sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={() => handleMoodLevelAssessmentModalOpen('edit')}><Edit sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleDeleteMoodLevelAssessment}><Delete sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>

      {/* Mood Assessment Menu */}
      <Menu
        anchorEl={moodAssessmentAnchorEl}
        open={Boolean(moodAssessmentAnchorEl)}
        onClose={handleMoodAssessmentMenuClose}
      >
        <MenuItem onClick={() => {
          handleMoodAssessmentModalOpen('view', selectedMoodAssessment._id);
          handleMoodAssessmentMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={() => {
          handleMoodAssessmentModalOpen('edit', selectedMoodAssessment._id);
          handleMoodAssessmentMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteMoodAssessment(selectedMoodAssessment._id);
          handleMoodAssessmentMenuClose();
        }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create Mood Assessment Modal */}
      <Dialog
        open={openCreateMoodAssessmentModal}
        onClose={handleCreateMoodAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Mood Assessment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            name="question"
            value={newMoodAssessment.question}
            onChange={handleNewMoodAssessmentChange}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            margin="normal"
            label="Type"
            name="type"
            value={newMoodAssessment.type}
            onChange={handleNewMoodAssessmentChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="mcq">Multiple Choice</MenuItem>
            <MenuItem value="blanks">Fill in the Blanks</MenuItem>
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Score"
            name="score"
            type="number"
            value={newMoodAssessment.score}
            onChange={handleNewMoodAssessmentChange}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            margin="normal"
            label="Category (Mood)"
            name="category"
            value={newMoodAssessment.category}
            onChange={handleNewMoodAssessmentChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Select Mood</MenuItem>
            {moods.map((mood) => (
              <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
            ))}
          </Select>
          {renderMediaUpload()}
          {newMoodAssessment.type === 'blanks' && (
            <TextField
              fullWidth
              margin="normal"
              label="Answer"
              name="answer"
              value={newMoodAssessment.answer}
              onChange={handleNewMoodAssessmentChange}
              sx={{ mb: 2 }}
            />
          )}
          {newMoodAssessment.type === 'mcq' && (
            <>
              {newMoodAssessment.mcqOptions.map((option, index) => (
                <Box key={index} display="flex" alignItems="center" mt={2}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleNewMoodAssessmentOptionChange(index, 'text', e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(e) => handleNewMoodAssessmentOptionChange(index, 'isCorrect', e.target.checked)}
                      />
                    }
                    label="Correct"
                  />
                  <IconButton onClick={() => handleRemoveNewMoodAssessmentOption(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={handleAddNewMoodAssessmentOption}
                startIcon={<Add />}
                sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}
              >
                Add Option
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateMoodAssessmentModalClose}>Cancel</Button>
          <Button onClick={handleSaveNewMoodAssessment} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}