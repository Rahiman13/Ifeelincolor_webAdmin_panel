import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseUrl from '../../api';

const apiUrl=`${BaseUrl}/api`
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const apiEndpoints = {
        forgotPassword: `${apiUrl}/orgadmin/forgot-password`,
        resetPassword: `${apiUrl}/orgadmin/reset-password`,
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
                toast.success('OTP sent to your email!', {
                    position: 'top-right',
                });
                setShowModal(true);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to send OTP',
                {
                    position: 'top-right',
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
                    window.location.href = '/dist/orgadmin-login';
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
        <Container
            fluid
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                }}
            >
                <div className="text-center mb-4">
                    <FaLock size={50} style={{ color: '#6a11cb' }} />
                </div>
                <h2 className="text-center mb-4">Forgot Password</h2>

                <Form onSubmit={handleSendOtp} noValidate>
                    <Form.Group controlId="emailInput" className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            isInvalid={!!errors.email}
                            style={{ borderRadius: '30px', padding: '10px 15px' }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            width: '100%',
                        }}
                    >
                        {loading ? (
                            <Spinner as="span" animation="border" size="sm" />
                        ) : (
                            'Send OTP'
                        )}
                    </Button>
                </Form>

                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    centered
                    dialogClassName="modal-trendy"
                >
                    <Modal.Header
                        closeButton
                        style={{
                            //   backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                            color: '#000',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                            borderBottom: 'none',
                        }}
                    >
                        <Modal.Title style={{
                            fontWeight: '900',
                            fontSize: '20px',


                        }}>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#fff', borderRadius: '15px' }}>
                        <Form onSubmit={handleResetPassword} noValidate>
                            <Form.Group controlId="otpInput" className="mb-3">
                                <Form.Label>OTP:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    isInvalid={!!errors.otp}
                                    style={{ borderRadius: '5px' }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.otp}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newPasswordInput" className="mb-3">
                                <Form.Label>New Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    isInvalid={!!errors.newPassword}
                                    style={{ borderRadius: '5px' }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.newPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                controlId="confirmPasswordInput"
                                className="mb-3"
                            >
                                <Form.Label>Confirm New Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm new password"
                                    isInvalid={!!errors.confirmPassword}
                                    style={{ borderRadius: '5px' }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundImage:
                                        'linear-gradient(to right, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    width: '100%',
                                }}
                            >
                                {loading ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <ToastContainer />
            </Card>
        </Container>
    );
};

export default ForgotPassword;
