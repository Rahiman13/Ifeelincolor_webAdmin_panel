import React, { useState, useEffect, useRef } from "react";
import { useTheme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Tooltip,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  CircularProgress,
  Backdrop,
  ListItemAvatar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles';
import OrgChart from "@dabeng/react-orgchart";
import Icon from '@mdi/react';
import {
  mdiEmailOutline,
  mdiPhoneOutline,
  mdiMapMarkerOutline,
  mdiOfficeBuilding,
  mdiAccountGroup,
  mdiBriefcaseOutline,
  mdiAccountPlus,
  mdiDomain,
  mdiAccountTie,
  mdiCalendarCheck,
  mdiEarth,
  mdiLink,
  mdiEmail,
  mdiCellphone,
  mdiHospitalBox,
  mdiAccount,
  mdiImage,
  mdiInstagram,
  mdiTwitter,
  mdiFacebook,
  mdiLinkedin
} from '@mdi/js';
import Face1 from "../../assets/face1.jpg";
import { motion } from "framer-motion";
import axios from 'axios';
import { Edit as EditIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    width: '100%',
  },
  card: {
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginBottom: theme.spacing(4),
  },
  media: {
    height: 140,
    borderRadius: "50%",
    width: 140,
    margin: "0 auto",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "#333",
  },
  text: {
    fontSize: 18,
    color: "#666",
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: '20px',
    padding: '10px 20px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)',
    transition: 'all 0.15s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08)',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: theme.spacing(4),
    outline: 'none',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '600px',
    },
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      outline: '1px solid slategrey',
      borderRadius: '4px',
    },
  },
  modalTitle: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 600,
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  profileContent: {
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    width: 150,
    height: 150,
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  sectionTitle: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    display: 'inline-block',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  previewImage: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  inputIcon: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
        transition: theme.transitions.create(['border-color', 'box-shadow']),
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
  },
  inline: {
    display: 'inline',
  },
  teamMembersList: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '8px',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  myChart: {
    '& .orgchart': {
      background: 'transparent',
      padding: '20px',
      '& .node': {
        border: 'none',
        borderRadius: '12px',
        padding: '16px',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      '& .lines': {
        '& .downLine': {
          background: theme.palette.primary.main,
          width: '2px',
        },
        '& .rightLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
        '& .leftLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
        '& .topLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
      },
    },
  },
  clinicianCard: {
    background: theme.palette.background.paper,
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid',
    borderColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    },
  },
  clinicianHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  clinicianAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    fontSize: '1.2rem',
    marginRight: theme.spacing(2),
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  clinicianInfo: {
    flex: 1,
  },
  clinicianName: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
  licenseChip: {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
    fontWeight: 500,
    borderRadius: '6px',
    '& .MuiChip-label': {
      padding: '4px 8px',
    },
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    paddingBottom: theme.spacing(2),
  },
  teamTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
  clinicianCount: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function ProfilePage() {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState("manager");
  const [showModal, setShowModal] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    companyName: '',
    founder: '',
    established: '',
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [managers, setManagers] = useState([]);
  const [clinicians, setClinicians] = useState([]);
  const [companyInfoHeight, setCompanyInfoHeight] = useState(0);
  const companyInfoRef = useRef(null);
  const [managerData, setManagerData] = useState(null);
  const [managerClinicians, setManagerClinicians] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState('organization');
  const [hierarchyData, setHierarchyData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingTeamMembers(true);
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');

      if (!token) {
        setError('Unauthorized. Please log in.');
        setLoading(false);
        setLoadingTeamMembers(false);
        return;
      }

      try {
        if (role === 'organization') {
          const [profileResponse, managersResponse, cliniciansResponse] = await Promise.all([
            axios.get('https://rough-1-gcic.onrender.com/api/organization/me', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('https://rough-1-gcic.onrender.com/api/organization/managers', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('https://rough-1-gcic.onrender.com/api/organization/doctors', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          if (profileResponse.data.status === 'success') {
            setOrganizationData(profileResponse.data.body);
          }

          if (managersResponse.data.status === 'success' && cliniciansResponse.data.status === 'success') {
            const managers = managersResponse.data.body;
            const clinicians = cliniciansResponse.data.body;
            
            setManagers(managers);
            setClinicians(clinicians);

            const hierarchyStructure = {
              id: 'organization',
              name: profileResponse.data.body.name || 'Organization',
              title: 'Organization Admin',
              email: profileResponse.data.body.email,
              children: managers.map(manager => ({
                id: manager._id,
                name: manager.name,
                title: 'Manager',
                email: manager.email,
                children: clinicians
                  .filter(clinician => clinician.managerId === manager._id)
                  .map(clinician => ({
                    id: clinician._id,
                    name: clinician.name,
                    title: clinician.specializedIn || 'Clinician',
                    email: clinician.email
                  }))
              }))
            };

            setHierarchyData(hierarchyStructure);
          }
        } else if (role === 'manager') {
          const profileResponse = await axios.get('https://rough-1-gcic.onrender.com/api/manager/info', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileResponse.data.status === 'success') {
            setManagerData(profileResponse.data.body.manager);
            setOrganizationData(profileResponse.data.body.organization);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
        setLoadingTeamMembers(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (companyInfoRef.current) {
      setCompanyInfoHeight(companyInfoRef.current.clientHeight);
    }
  }, [organizationData]);

  useEffect(() => {
    const fetchClinicians = async () => {
      const role = sessionStorage.getItem('role');
      const token = sessionStorage.getItem('token');
      
      if (role === 'manager') {
        setLoadingTeamMembers(true);
        try {
          const response = await axios.get(
            'https://rough-1-gcic.onrender.com/api/manager/clinicians-created',
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (response.data.status === 'success') {
            setManagerClinicians(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching clinicians:', error);
        } finally {
          setLoadingTeamMembers(false);
        }
      }
    };

    fetchClinicians();
  }, []);

  const renderTeamMembersList = () => {
    const role = sessionStorage.getItem('role');

    if (loadingTeamMembers) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
          <CircularProgress size={40} />
          <Typography variant="body2" style={{ marginTop: 16 }}>
            Loading team members...
          </Typography>
        </Box>
      );
    }

    if (role === 'manager') {
      return (
        <Box className={classes.teamMembersList}>
          {/* <div className={classes.teamHeader}>
            <Typography variant="h6" className={classes.teamTitle}>
              <Icon path={mdiAccountGroup} size={1} />
              Your Clinicians
            </Typography>
            <span className={classes.clinicianCount}>
              {managerClinicians.length} Members
            </span>
          </div> */}
          
          {loadingTeamMembers ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : managerClinicians.length > 0 ? (
            managerClinicians.map((clinician) => (
              <motion.div
                key={clinician._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box className={classes.clinicianCard}>
                  <div className={classes.clinicianHeader}>
                    <Avatar 
                      className={classes.clinicianAvatar}
                      src={clinician.image || ''}
                      alt={clinician.name}
                    >
                      {clinician.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className={classes.clinicianInfo}>
                      <Typography className={classes.clinicianName}>
                        {clinician.name}
                      </Typography>
                      <Chip
                        label={`License: ${clinician.licenseNumber || 'N/A'}`}
                        className={classes.licenseChip}
                        size="small"
                      />
                    </div>
                  </div>
                  
                  <div className={classes.infoRow}>
                    <Icon path={mdiEmail} size={0.9} />
                    <Typography variant="body2">
                      {clinician.email}
                    </Typography>
                  </div>
                </Box>
              </motion.div>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={6}
              px={3}
              textAlign="center"
            >
              <Icon
                path={mdiAccountPlus}
                size={2}
                color={alpha(theme.palette.text.secondary, 0.5)}
              />
              <Typography
                variant="h6"
                color="textSecondary"
                style={{ marginTop: theme.spacing(2) }}
              >
                No Clinicians Yet
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ maxWidth: 300, marginTop: theme.spacing(1) }}
              >
                Start building your team by adding clinicians to your practice.
              </Typography>
            </Box>
          )}
        </Box>
      );
    } else {
      return (
        <>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: theme.spacing(2) }}>
            <InputLabel id="team-member-select-label">Select Team Member</InputLabel>
            <Select
              labelId="team-member-select-label"
              id="team-member-select"
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              label="Select Team Member"
            >
              <MenuItem value="organization">Organization</MenuItem>
              <MenuItem value="manager">Managers</MenuItem>
              <MenuItem value="clinician">Clinicians</MenuItem>
            </Select>
          </FormControl>
          <List className={classes.teamMembersList}>
            {selectedTeamMember === 'organization' && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={organizationData.image || ''}>
                    {organizationData.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={organizationData.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        <Icon path={mdiEmail} size={0.8} /> {organizationData.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            )}
            {selectedTeamMember === 'manager' && managers.map((manager) => (
              <ListItem key={manager._id}>
                <ListItemAvatar>
                  <Avatar src={manager.image || ''}>
                    {manager.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={manager.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        <Icon path={mdiEmail} size={0.8} /> {manager.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
            {selectedTeamMember === 'clinician' && clinicians.map((clinician) => (
              <ListItem key={clinician._id}>
                <ListItemAvatar>
                  <Avatar src={clinician.image || ''}>
                    {clinician.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={clinician.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        <Icon path={mdiEmail} size={0.8} /> {clinician.email}
                      </Typography>
                      {clinician.specializedIn && (
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textSecondary"
                        >
                          <br />
                          <Icon path={mdiBriefcaseOutline} size={0.8} /> {clinician.specializedIn}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      );
    }
  };

  if (loading) {
    return (
      <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!organizationData) {
    return <Typography>No organization data available.</Typography>;
  }

  const NodeTemplate = ({ nodeData }) => {
    const getNodeColor = (title) => {
      if (title.toLowerCase().includes('admin')) return theme.palette.primary.main;
      if (title.toLowerCase().includes('manager')) return theme.palette.secondary.main;
      return theme.palette.success.main;
    };

    return (
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          border: `2px solid ${getNodeColor(nodeData.title)}`,
          backgroundColor: theme.palette.background.paper,
          minWidth: '220px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Avatar
          style={{
            width: 60,
            height: 60,
            backgroundColor: getNodeColor(nodeData.title),
            marginBottom: '8px'
          }}
        >
          {nodeData.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: getNodeColor(nodeData.title) }}>
          {nodeData.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
          {nodeData.title}
        </Typography>
        {nodeData.email && (
          <Typography variant="body2" style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
            <Icon path={mdiEmail} size={0.8} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {nodeData.email}
          </Typography>
        )}
      </div>
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderClinicians = (clinicians) => (
    <List>
      {clinicians.map((clinician, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Icon path={mdiHospitalBox} size={1} />
          </ListItemIcon>
          <ListItemText
            primary={clinician.name}
            secondary={`${clinician.role} - ${clinician.specialization}`}
          />
        </ListItem>
      ))}
    </List>
  );

  const handleEditClick = () => {
    setEditFormData({
      name: organizationData.name || '',
      email: organizationData.email || '',
      mobile: organizationData.mobile || '',
      address: organizationData.address || '',
      companyName: organizationData.companyName || '',
      founder: organizationData.founder || '',
      established: organizationData.established ? new Date(organizationData.established).toISOString().split('T')[0] : '',
      instagram: organizationData.socialProfile?.instagram || '',
      twitter: organizationData.socialProfile?.twitter || '',
      facebook: organizationData.socialProfile?.facebook || '',
      linkedin: organizationData.socialProfile?.linkedin || '',
    });
    setSelectedFile(null);
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    setPreviewImage(organizationData.image || '');
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (!token || role !== 'organization') {
      setError('Unauthorized. Please log in as an organization.');
      setActionLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(editFormData).forEach(key => {
      if (key === 'established') {
        formData.append(key, new Date(editFormData[key]).toISOString());
      } else if (key.startsWith('instagram') || key.startsWith('twitter') || key.startsWith('facebook') || key.startsWith('linkedin')) {
        formData.append(`socialProfile[${key}]`, editFormData[key]);
      } else {
        formData.append(key, editFormData[key]);
      }
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await axios.put(
        'https://rough-1-gcic.onrender.com/api/organization/update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        setOrganizationData(response.data.body);
        setEditModalOpen(false);
      } else {
        setError(response.data.message || 'Failed to update organization data');
      }
    } catch (err) {
      console.error('Error updating organization data:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
        setError(`Server error: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const renderHierarchySection = () => {
    const role = sessionStorage.getItem('role');
    
    if (role !== 'organization') return null;

    return (
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.sectionTitle}>
                <Icon path={mdiAccountGroup} size={1} className={classes.icon} />
                Organization Hierarchy
              </Typography>
              {loadingTeamMembers ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : hierarchyData ? (
                <Box sx={{ overflowX: 'auto', py: 4 }}>
                  <OrgChart
                    datasource={hierarchyData}
                    collapsible={false}
                    pan={true}
                    zoom={true}
                    NodeTemplate={NodeTemplate}
                    chartClass={classes.myChart}
                  />
                </Box>
              ) : (
                <Typography variant="body1" align="center">
                  No hierarchy data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  return (
    <Container className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} lg={12} xl={12} className="profile-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.profileContainer}
          >
            <div className={classes.profileContent}>
              <Card className={classes.card}>
                <CardContent>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload">
                    <Tooltip title="Click to change profile picture">
                      <Avatar
                        alt="Profile Image"
                        src={sessionStorage.getItem('role') === 'manager' ? (managerData?.image || '') : (organizationData?.image || '')}
                        className={classes.avatar}
                        onClick={handleAvatarClick}
                      />
                    </Tooltip>
                  </label>
                  <Typography variant="h4" className={classes.title}>
                    {sessionStorage.getItem('role') === 'manager' ? managerData?.name : organizationData?.name}
                  </Typography>
                  <Chip
                    icon={<Icon path={mdiBriefcaseOutline} size={0.8} />}
                    label={sessionStorage.getItem('role') === 'manager' ? "Manager" : "Organization"}
                    color="primary"
                    className={classes.chip}
                  />
                  <Grid container spacing={2} style={{ marginTop: '16px' }}>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon path={mdiEmail} size={1} className={classes.inputIcon} />
                        <Typography variant="body2">
                          {sessionStorage.getItem('role') === 'manager' ? managerData?.email : organizationData?.email}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon path={mdiPhoneOutline} size={1} className={classes.inputIcon} />
                        <Typography variant="body2">{organizationData?.mobile || 'Not available'}</Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon path={mdiMapMarkerOutline} size={1} className={classes.inputIcon} />
                        <Typography variant="body2">{organizationData?.address || 'Not available'}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                  {sessionStorage.getItem('role') === 'organization' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEditClick}
                      style={{ marginTop: '16px' }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </Grid>

        <Grid container item xs={12} spacing={4}>
          <Grid item xs={12} md={8} style={{ display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ display: 'flex', width: '100%' }}
            >
              <Card className={classes.card} style={{ display: 'flex', flexDirection: 'column', width: '100%' }} ref={companyInfoRef}>
                <CardContent>
                  <Typography variant="h5" className={classes.sectionTitle}>
                    <Icon path={mdiDomain} size={1} className={classes.icon} />
                    Company Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiDomain} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Company Name"
                            secondary={organizationData.companyName || "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiAccountTie} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Founder"
                            secondary={organizationData.founder || "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiCalendarCheck} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Established"
                            secondary={organizationData.established ? new Date(organizationData.established).toLocaleDateString() : "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiEarth} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Location"
                            secondary={organizationData.address || "Not available"}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiInstagram} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Instagram"
                            secondary={organizationData.socialProfile?.instagram || "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiTwitter} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Twitter"
                            secondary={organizationData.socialProfile?.twitter || "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiFacebook} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Facebook"
                            secondary={organizationData.socialProfile?.facebook || "Not available"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Icon path={mdiLinkedin} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary="LinkedIn"
                            secondary={organizationData.socialProfile?.linkedin || "Not available"}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4} style={{ display: 'flex' }}>
            <Card className={classes.card} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: `${companyInfoHeight}px` }}>
              <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  <Icon path={mdiAccountGroup} size={1} className={classes.icon} />
                  Team Members
                </Typography>
                {loadingTeamMembers ? (
                  <CircularProgress style={{ margin: 'auto' }} />
                ) : (
                  renderTeamMembersList()
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {renderHierarchySection()}

        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          className={classes.modal}
        >
          <div className={classes.modalPaper}>
            <Typography variant="h4" className={classes.modalTitle}>
              Edit Organization Profile
            </Typography>
            <form onSubmit={handleEditSubmit} className={classes.formContainer}>
              {previewImage && (
                <img src={previewImage} alt="Preview" className={classes.previewImage} />
              )}
              <TextField
                label="Name"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiAccount} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiEmail} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Mobile"
                name="mobile"
                value={editFormData.mobile}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiCellphone} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Location"
                name="address"
                value={editFormData.address}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiMapMarkerOutline} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Company Name"
                name="companyName"
                value={editFormData.companyName}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiDomain} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Founder"
                name="founder"
                value={editFormData.founder}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiAccountTie} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Established Date"
                name="established"
                type="date"
                value={editFormData.established}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiCalendarCheck} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Instagram"
                name="instagram"
                value={editFormData.instagram}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiInstagram} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Twitter"
                name="twitter"
                value={editFormData.twitter}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiTwitter} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Facebook"
                name="facebook"
                value={editFormData.facebook}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiFacebook} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="LinkedIn"
                name="linkedin"
                value={editFormData.linkedin}
                onChange={handleEditInputChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiLinkedin} size={1} className={classes.inputIcon} />
                  ),
                }}
              />
              <TextField
                label="Profile Picture"
                name="profilePicture"
                type="file"
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <Icon path={mdiImage} size={1} className={classes.inputIcon} />
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {selectedFile && (
                <Typography variant="body2">
                  Selected file: {selectedFile.name}
                </Typography>
              )}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditModalOpen(false)}
                  className={classes.button}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={actionLoading}
                >
                  {actionLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </div>
        </Modal>
      </Grid>
      <Backdrop 
        ref={backdropRef}
        open={actionLoading} 
        className={classes.backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}