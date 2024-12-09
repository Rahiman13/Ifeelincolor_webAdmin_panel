import React, { useState, useEffect } from "react";
import { useTheme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Modal,
  TextField,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Backdrop,
  Paper
} from "@material-ui/core";
import { makeStyles, alpha } from "@material-ui/core/styles";
import Icon from '@mdi/react';
import {
  mdiEmail,
  mdiPhone,
  mdiMapMarkerOutline,
  mdiDomain,
  mdiAccountTie,
  mdiCalendarCheck
} from '@mdi/js';
import { motion } from "framer-motion";
import axios from 'axios';
import { Edit as EditIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    width: '100%',
  },
  profileHeader: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    borderRadius: '20px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  headerAvatar: {
    width: 120,
    height: 120,
    border: '4px solid white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  infoCard: {
    height: '100%',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  sectionIcon: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    padding: theme.spacing(2),
    borderRadius: '12px',
    marginBottom: theme.spacing(2),
  },
  listItem: {
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  },
  editButton: {
    borderRadius: '25px',
    padding: '10px 25px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: '15px',
    maxWidth: '500px',
    width: '90%',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  statCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  statLabel: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
}));

export default function ProfilePage() {
  const classes = useStyles();
  const theme = useTheme();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    address: '',
    founderName: '',
    established: '',
    bio: '',
    contact: {
      email: '',
      mobile: ''
    }
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const isAdminPortal = sessionStorage.getItem('adminPortal');

      if (!token || !isAdminPortal) {
        setError('Unauthorized. Please log in as admin.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://rough-1-gcic.onrender.com/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.status === 'success') {
          setAdminData(response.data.body);
          setEditFormData({
            name: response.data.body.name || '',
            email: response.data.body.email || '',
            companyName: response.data.body.companyName || '',
            address: response.data.body.address || '',
            founderName: response.data.body.founderName || '',
            established: response.data.body.established || '',
            bio: response.data.body.bio || '',
            contact: {
              email: response.data.body.contact?.email || '',
              mobile: response.data.body.contact?.mobile || ''
            }
          });
        }
      } catch (err) {
        setError('Failed to fetch admin profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    
    try {
      const response = await axios.put(
        'https://rough-1-gcic.onrender.com/api/admin/profile/update',
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setAdminData(response.data.body);
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Backdrop
        open={loading}
        style={{ 
          zIndex: 9999, 
          color: '#fff',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <Paper className={classes.profileHeader} elevation={0}>
          <Grid container spacing={4} alignItems="center">
            <Grid item>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar
                  src={adminData?.image || ''}
                  className={classes.headerAvatar}
                  alt={adminData?.name}
                >
                  {adminData?.name?.charAt(0)}
                </Avatar>
              </motion.div>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" gutterBottom>
                {adminData?.name || 'Admin'}
              </Typography>
              <Typography variant="h6" style={{ opacity: 0.8 }}>
                {adminData?.email}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditModalOpen(true)}
                className={classes.editButton}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Paper className={classes.statCard}>
                    <Icon path={mdiDomain} size={1.5} color={theme.palette.primary.main} />
                    <Typography className={classes.statValue}>
                      {adminData?.companyName || 'N/A'}
                    </Typography>
                    <Typography className={classes.statLabel}>Company</Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Paper className={classes.statCard}>
                    <Icon path={mdiCalendarCheck} size={1.5} color={theme.palette.primary.main} />
                    <Typography className={classes.statValue}>
                      {adminData?.established || 'N/A'}
                    </Typography>
                    <Typography className={classes.statLabel}>Established</Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Paper className={classes.statCard}>
                    <Icon path={mdiAccountTie} size={1.5} color={theme.palette.primary.main} />
                    <Typography className={classes.statValue}>
                      {adminData?.founderName || 'N/A'}
                    </Typography>
                    <Typography className={classes.statLabel}>Founder</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* Company Details */}
          <Grid item xs={12} md={6}>
            <Card className={classes.infoCard}>
              <CardContent>
                <div className={classes.sectionIcon}>
                  <Icon path={mdiDomain} size={1.5} color={theme.palette.primary.main} />
                </div>
                <Typography variant="h5" gutterBottom>
                  Company Information
                </Typography>
                <List>
                  {[
                    { icon: mdiMapMarkerOutline, label: 'Address', value: adminData?.address },
                    { icon: mdiAccountTie, label: 'Founder', value: adminData?.founderName },
                    { icon: mdiCalendarCheck, label: 'Established', value: adminData?.established }
                  ].map((item, index) => (
                    <ListItem key={index} className={classes.listItem}>
                      <ListItemIcon>
                        <Icon path={item.icon} size={1} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.value || 'Not specified'}
                        primaryTypographyProps={{ variant: 'subtitle1', style: { fontWeight: 600 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card className={classes.infoCard}>
              <CardContent>
                <div className={classes.sectionIcon}>
                  <Icon path={mdiPhone} size={1.5} color={theme.palette.primary.main} />
                </div>
                <Typography variant="h5" gutterBottom>
                  Contact Details
                </Typography>
                <List>
                  {[
                    { icon: mdiEmail, label: 'Email', value: adminData?.contact?.email || adminData?.email },
                    { icon: mdiPhone, label: 'Mobile', value: adminData?.contact?.mobile }
                  ].map((item, index) => (
                    <ListItem key={index} className={classes.listItem}>
                      <ListItemIcon>
                        <Icon path={item.icon} size={1} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.value || 'Not specified'}
                        primaryTypographyProps={{ variant: 'subtitle1', style: { fontWeight: 600 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Bio Section */}
          {adminData?.bio && (
            <Grid item xs={12}>
              <Card className={classes.bioCard}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    About Me
                  </Typography>
                  <Typography variant="body1" style={{ lineHeight: 1.8 }}>
                    {adminData.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className={classes.modal}
      >
        <div className={classes.modalPaper}>
          <Typography variant="h6" className={classes.modalTitle}>
            Edit Profile
          </Typography>
          <form onSubmit={handleEditSubmit} className={classes.formContainer}>
            <TextField
              label="Name"
              name="name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              fullWidth
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              label="Company Name"
              name="companyName"
              value={editFormData.companyName}
              onChange={(e) => setEditFormData({...editFormData, companyName: e.target.value})}
              fullWidth
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              label="Address"
              name="address"
              value={editFormData.address}
              onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              fullWidth
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              label="Founder Name"
              name="founderName"
              value={editFormData.founderName}
              onChange={(e) => setEditFormData({...editFormData, founderName: e.target.value})}
              fullWidth
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={editFormData.contact.mobile}
              onChange={(e) => setEditFormData({
                ...editFormData, 
                contact: {...editFormData.contact, mobile: e.target.value}
              })}
              fullWidth
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              label="Bio"
              name="bio"
              value={editFormData.bio}
              onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              className={classes.textField}
            />
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="outlined"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
    </Container>
  );
}