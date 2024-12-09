import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseUrl from '../../api';
import { 
    Box, Container, Card, Typography, TextField, Button, 
    Modal, CircularProgress, styled, CardContent, IconButton 
} from '@mui/material';
import { LockReset, Close as CloseIcon } from '@mui/icons-material';

const apiUrl = `${BaseUrl}/api`;

const AnimatedBackground = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: `
        linear-gradient(135deg, 
            rgba(31, 41, 55, 0.02) 0%,
            rgba(190, 142, 60, 0.02) 100%)
    `,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 0% 0%, rgba(31, 41, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(190, 142, 60, 0.03) 0%, transparent 50%)
        `,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l8.485-8.485h-1.414zM32 0l-9.9 9.9 1.415 1.415L33.414 0H32zM0 0c0 .142 0 .33.457.457L1.915 0H0zm0 8.485L8.485 0h-1.414L0 7.07v1.415zm0-5.657L5.657 0h-1.414L0 4.243v1.414zm0 2.828L2.828 0H1.414L0 1.414v1.414zm8.485 0L16.97 0h-1.414L7.07 8.485h1.415zm-5.657 0L11.314 0H9.9L2.828 7.07 4.243 8.486zm2.828 0L13.142 0h-1.414L5.657 7.07 7.07 8.486zM0 60c0-.142 0-.33.457-.457L1.915 60H0zm0-8.485L8.485 60h-1.414L0 52.93v-1.415zm0 5.657L5.657 60h-1.414L0 55.757v-1.414zm0-2.828L2.828 60H1.414L0 58.586v-1.414zm8.485 0L16.97 60h-1.414L7.07 51.515h1.415zm-5.657 0L11.314 60H9.9L2.828 52.93l1.415-1.414zm2.828 0L13.142 60h-1.414L5.657 52.93l1.414-1.414zM60 0c0 .142 0 .33-.457.457L58.085 0H60zm0 8.485L51.515 0h1.414L60 7.07v1.415zm0-5.657L54.343 0h1.414L60 4.243v1.414zm0 2.828L57.172 0h1.414L60 1.414v1.414zm-8.485 0L43.03 0h1.414l7.071 8.485h-1.415zm5.657 0L48.686 0h1.415l7.07 7.07-1.414 1.415zm-2.828 0L46.858 0h1.414l7.07 7.07-1.414 1.415zM60 60c0-.142 0-.33-.457-.457L58.085 60H60zm0-8.485L51.515 60h1.414L60 52.93v1.415zm0 5.657L54.343 60h1.414L60 55.757v1.414zm0-2.828L57.172 60h1.414L60 58.586v1.414zm-8.485 0L43.03 60h1.414l7.071-8.485h-1.415zm5.657 0L48.686 60h1.415l7.07-7.07-1.414-1.415zm-2.828 0L46.858 60h1.414l7.07-7.07-1.414-1.415z" fill-rule="evenodd" fill="%231F2937" fill-opacity="0.02"/%3E%3C/svg%3E")',
    },
});

const StyledCard = styled(Card)(({ theme }) => ({
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid rgba(31, 41, 55, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    maxWidth: '450px',
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
    marginBottom: '24px',
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
    '&.Mui-disabled': {
        color: '#FFFFFF',
        '& .MuiCircularProgress-root': {
            color: '#FFFFFF',
        },
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
        },
        '& fieldset': {
            borderColor: 'rgba(31, 41, 55, 0.2)',
            borderWidth: '1.5px',
            transition: 'all 0.3s ease',
        },
        '&:hover fieldset': {
            borderColor: '#BE8E3C',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1F2937',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#1F2937',
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 500,
        '&.Mui-focused': {
            color: '#1F2937',
        },
    },
    '& .MuiInputBase-input': {
        padding: '16px',
        fontSize: '1rem',
        lineHeight: 1.6,
    },
    marginBottom: theme.spacing(3),
}));

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
});

const ModalContent = styled(Box)(({ theme }) => ({
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid rgba(31, 41, 55, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    maxWidth: '450px',
    overflow: 'hidden',
    margin: '20px',
    animation: 'modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #1F2937, #BE8E3C)',
        opacity: 1,
    },
    '@keyframes modalFadeIn': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 16,
    top: 16,
    color: '#1F2937',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(31, 41, 55, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: '#F3F4F6',
        transform: 'rotate(90deg)',
    },
}));

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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const apiEndpoints = {
        forgotPassword: `${apiUrl}/manager/forgot-password`,
        resetPassword: `${apiUrl}/manager/reset-password`,
    };

    const validateForm = () => {
        const newErrors = {};
        const emailPattern = /^\S+@\S+\.\S+$/;
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (showModal) {
            if (!otp) {
                newErrors.otp = 'OTP is required';
            }
            if (!newPassword) {
                newErrors.newPassword = 'New password is required';
            } else if (!passwordPattern.test(newPassword)) {
                newErrors.newPassword =
                    'Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character';
            }
            if (newPassword !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(apiEndpoints.forgotPassword, { email });

            if (response.status === 200) {
                toast.success(
                    <div>
                        <strong>OTP Sent Successfully! 📧</strong>
                        <p style={{ marginTop: '8px', fontSize: '14px' }}>
                            Please check your email: {email}
                        </p>
                    </div>,
                    {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        style: {
                            background: '#4CAF50',
                            color: 'white',
                        },
                    }
                );
                setShowModal(true);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to send OTP',
                {
                    position: 'top-right',
                    autoClose: 5000,
                    style: {
                        background: '#f44336',
                        color: 'white',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(apiEndpoints.resetPassword, {
                email,
                otp,
                newPassword,
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Password reset successfully!',
                }).then(() => {
                    window.location.href = '/manager-login';
                });
                setShowModal(false);
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to reset password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            position: 'relative',
            py: { xs: 4, md: 6 },
            color: '#1F2937',
        }}>
            <GlassBackground />
            <Container maxWidth="sm" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: { xs: 4, md: 6 },
            }}>
                <StyledCard>
                    <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 4,
                    }}>
                        <IconWrapper>
                            <LockReset style={{
                                fontSize: '3.0rem',
                                color: '#FFFFFF',
                            }} />
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
                            Forgot Password?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                color: 'rgba(31, 41, 55, 0.8)',
                                flex: 1,
                            }}
                        >
                            Don't worry! It happens. Please enter your email address.
                        </Typography>

                        <form onSubmit={handleSendOtp} noValidate style={{ width: '100%' }}>
                            <StyledTextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                margin="normal"
                                required
                            />

                            <StyledButton
                                type="submit"
                                fullWidth
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} sx={{ color: 'white' }} />}
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </StyledButton>
                        </form>
                    </CardContent>
                </StyledCard>
            </Container>

            <StyledModal 
                open={showModal} 
                onClose={(e) => {
                    if (e.target === e.currentTarget) {
                        return;
                    }
                }}
            >
                <ModalContent>
                    <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 4,
                        pt: 5,
                    }}>
                        <CloseButton onClick={() => setShowModal(false)}>
                            <CloseIcon />
                        </CloseButton>

                        <IconWrapper>
                            <LockReset style={{
                                fontSize: '3.0rem',
                                color: '#FFFFFF',
                            }} />
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
                            Reset Password
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                color: 'rgba(31, 41, 55, 0.8)',
                            }}
                        >
                            Enter the OTP sent to your email and set your new password
                        </Typography>

                        <form onSubmit={handleResetPassword} noValidate style={{ width: '100%' }}>
                            <StyledTextField
                                fullWidth
                                label="OTP"
                                variant="outlined"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                error={!!errors.otp}
                                helperText={errors.otp}
                                margin="normal"
                                required
                            />
                            <StyledTextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                margin="normal"
                                required
                            />
                            <StyledTextField
                                fullWidth
                                label="Confirm New Password"
                                variant="outlined"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                margin="normal"
                                required
                            />
                            <StyledButton
                                type="submit"
                                fullWidth
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} sx={{ color: 'white' }} />}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </StyledButton>
                        </form>
                    </CardContent>
                </ModalContent>
            </StyledModal>

            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
};

export default ForgotPassword;
