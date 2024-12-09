import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, Container, useMediaQuery } from '@mui/material';
import { AdminPanelSettings, Business } from '@mui/icons-material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Logo from '../../assets/logo.svg';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F2937',
      light: '#374151',
      dark: '#111827',
    },
    secondary: {
      main: '#BE8E3C',
      light: '#D4AF37',
      dark: '#996515',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    h4: {
      fontFamily: '"Cabinet Grotesk", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#1F2937',
    },
    h5: {
      fontFamily: '"Cabinet Grotesk", "Manrope", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontFamily: '"Manrope", sans-serif',
      lineHeight: 1.8,
      fontSize: '1.05rem',
    },
  },
});

const GlassBackground = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    linear-gradient(120deg, 
      rgba(248, 250, 252, 1) 0%,
      rgba(241, 245, 249, 1) 20%,
      rgba(226, 232, 240, 0.8) 40%,
      rgba(248, 250, 252, 0.9) 60%,
      rgba(241, 245, 249, 1) 80%,
      rgba(248, 250, 252, 1) 100%
    )
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, 
        rgba(219, 234, 254, 0.4) 0%, 
        rgba(219, 234, 254, 0) 40%
      ),
      radial-gradient(circle at 80% 80%, 
        rgba(254, 215, 170, 0.4) 0%, 
        rgba(254, 215, 170, 0) 40%
      )
    `,
  },
  zIndex: -1,
});

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: '#F9FAFB',
  position: 'relative',
  padding: '40px 0',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2.5rem',
  position: 'relative',
  padding: '0px 20px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #64748B, #94A3B8)',
  },
});

const HeadingContainer = styled(Box)({
  textAlign: 'center',
  marginBottom: '4rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '1px',
    height: '40px',
    background: 'linear-gradient(to bottom, transparent, #94A3B8)',
  },
});

const CardsContainer = styled(Box)({
  display: 'flex',
  gap: '2.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '0 20px',
});

const ModernCard = styled(Card)(({ theme }) => ({
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid rgba(31, 41, 55, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '430px',
  width: '100%',
  maxWidth: '450px', // Increased card width
  overflow: 'hidden',
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1F2937, #BE8E3C)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 22px 45px rgba(0, 0, 0, 0.08)',
    '&::before': {
      opacity: 1,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    border: '1px solid rgba(190, 142, 60, 0.1)',
    borderRadius: '16px',
    pointerEvents: 'none',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1F2937, #2C3E50)',
  padding: '28px',
  borderRadius: '20px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.4s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -2,
    background: 'linear-gradient(135deg, #1F2937, #BE8E3C)',
    borderRadius: '18px',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    '&::after': {
      opacity: 1,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 30px',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontWeight: 500,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #1F2937, #2C3E50)',
  color: '#FFFFFF',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(31, 41, 55, 0.1)',
  fontFamily: '"Outfit", sans-serif',
  letterSpacing: '0.5px',
  '&:hover': {
    background: '#111827',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  },
}));

function CardComponent({ icon, title, description, buttonText, href }) {
  return (
    <ModernCard>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        p: 4,
      }}>
        <IconWrapper>
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: '3.0rem', 
              color: '#FFFFFF',
            } 
          })}
        </IconWrapper>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            color: '#1F2937',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '2px',
              background: '#BE8E3C',
            }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: 'rgba(31, 41, 55, 0.8)',
            flex: 1,
          }}
        >
          {description}
        </Typography>
        <StyledButton 
          variant="contained" 
          href={href}
          onClick={() => {
            if (title === "Admin Portal") {
              sessionStorage.setItem('adminPortal', 'true');
            } else {
              sessionStorage.setItem('adminPortal', 'false');
            }
          }}
        >
          {buttonText}
        </StyledButton>
      </CardContent>
    </ModernCard>
  );
}

export default function Component() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        position: 'relative',
        py: { xs: 4, md: 6 },
      }}>
        <GlassBackground />
        <Container maxWidth="lg">
          <LogoContainer 
            sx={{ 
              transform: 'scale(1.2)',
              mb: { xs: 4, md: 6 },
            }}
          >
            <Box 
              component="img" 
              src={Logo} 
              alt="Logo" 
              sx={{ 
                height: { xs: 60, md: 80 },
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.06))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }} 
            />
          </LogoContainer>

          <HeadingContainer>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#1F2937',
                position: 'relative',
                display: 'inline-block',
                padding: '0 1rem',
                mb: { xs: 3, md: 4 },
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  width: '40px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #64748B, #94A3B8)',
                  transform: 'translateY(-50%)',
                },
                '&::before': {
                  left: '-50px',
                },
                '&::after': {
                  right: '-50px',
                },
              }}
            >
              Welcome to Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#475569',
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Choose your portal to access specialized features and management tools
            </Typography>
          </HeadingContainer>

          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 2, md: 0 },
          }}>
            <CardComponent
              icon={<AdminPanelSettings />}
              title="Admin Portal"
              description="Access the administrative dashboard to manage users, monitor system performance, and configure settings with enhanced security controls."
              buttonText="Access Admin Portal"
              href="/landingpage_Ifeelincolor"
            />

            <CardComponent
              icon={<Business />}
              title="Organization Portal"
              description="Manage your organization's structure, track team performance, and access comprehensive reporting tools for better decision-making."
              buttonText="Enter Organization Portal"
              href="/landingpage"
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}