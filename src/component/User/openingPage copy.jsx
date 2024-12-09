import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, AppBar, Toolbar, Container, useMediaQuery } from '@mui/material';
import { AdminPanelSettings, Business } from '@mui/icons-material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Logo from '../../assets/logo.svg';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f3f4f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const AnimatedBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
  backgroundSize: '400% 400%',
  animation: 'gradientAnimation 15s ease infinite',
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
});

const AnimatedFooter = styled(Box)(({ theme }) => ({
  py: 3,
  textAlign: 'center',
  color: 'rgba(255,255,255,0.7)',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  animation: 'footerAnimation 15s ease infinite',
  '@keyframes footerAnimation': {
    '0%': { backgroundColor: 'rgba(238, 119, 82, 0.1)' },
    '25%': { backgroundColor: 'rgba(231, 60, 126, 0.1)' },
    '50%': { backgroundColor: 'rgba(35, 166, 213, 0.1)' },
    '75%': { backgroundColor: 'rgba(35, 213, 171, 0.1)' },
    '100%': { backgroundColor: 'rgba(238, 119, 82, 0.1)' },
  },
}));

const CardWrapper = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(3), // Reduced padding
  height: '90%', // Reduced height
  minHeight: '350px', // Reduced minimum height
}));

export default function Component() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px', // Reduced padding
    height: '90%', // Reduced height
    minHeight: '300px', // Reduced minimum height
  };

  const iconStyle = {
    fontSize: isMobile ? '3.5rem' : '6rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '8px',
  };

  const btnStyle = {
    padding: '14px 28px',
    borderRadius: '30px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatedBackground />
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Box component="img" src={Logo} alt="Company Logo" sx={{ height: 40 }} />
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              width: '100%',
            }}
          >
            <CardComponent
              icon={<AdminPanelSettings sx={iconStyle} />}
              title="Admin Portal"
              description="Access the admin dashboard to manage users, settings, and more."
              buttonText="Go to Ifeelincolor Portal"
              href="/landingpage_Ifeelincolor"
              cardStyle={cardStyle}
              btnStyle={btnStyle}
            />

            <CardComponent
              icon={<Business sx={iconStyle} />}
              title="Organization"
              description="View and manage your organization's structure and members."
              buttonText="Go to Organization"
              href="/landingpage"
              cardStyle={cardStyle}
              btnStyle={btnStyle}
            />
          </Box>
        </Container>

        {/* <AnimatedFooter component="footer" className='py-4'>
          <Typography variant="body2">© 2024 IFEELINCOLOR. All rights reserved.</Typography>
        </AnimatedFooter> */}
      </Box>
    </ThemeProvider>
  );
}

function CardComponent({ icon, title, description, buttonText, href, btnStyle }) {
  const handleClick = () => {
    if (title === "Admin Portal") {
      sessionStorage.setItem('adminPortal', 'true');
    } else {
      sessionStorage.setItem('adminPortal', 'false');
    }
  };

  return (
    <CardWrapper>
      <CardContent sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 3, transform: 'scale(1.2)', transition: 'transform 0.3s ease' }}>
          {icon}
        </Box>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3, lineHeight: 1.6 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          href={href}
          onClick={handleClick}
          sx={{
            ...btnStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </CardWrapper>
  );
}