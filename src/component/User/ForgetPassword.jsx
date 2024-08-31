import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import './forget.scss';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Updated from useHistory to useNavigate

  const handleSendOtp = () => {
    // Send OTP to the entered email logic here
    setShowOtpModal(true);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      if (otp === '123456') { // Replace with actual OTP verification logic
        setIsOtpVerified(true);
        setShowOtpModal(false);
      }
      setLoading(false);
    }, 2000); // Simulating OTP verification delay
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Password change logic here (e.g., API call to update password)
      navigate('/dist/'); // Updated from history.push to navigate
    }
  };

  return (
    <div className="forget-password-container">
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOtpVerified}
          />
          {isOtpVerified && <i className="bi bi-check-circle-fill text-success"></i>}
        </Form.Group>

        {!isOtpVerified && (
          <Button variant="primary" onClick={handleSendOtp} className="btn-gradient">
            Send OTP
          </Button>
        )}

        {isOtpVerified && (
          <>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleChangePassword}
              className="btn-gradient"
            >
              Change Password
            </Button>
          </>
        )}
      </Form>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formOtp">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handleVerifyOtp} className="btn-gradient" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="visually-hidden">Verifying...</span>
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ForgetPassword;
