import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/bg-3.png';
import './login.scss';
import BaseUrl from '../../api';

const ManagerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/privacy/latest`);
      setPrivacyPolicy(response.data.body);
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const loginUrl = `${BaseUrl}/api/manager/login`;

    setLoading(true);
    try {
      const response = await axios.post(loginUrl, { email, password });

      if (response.data.status === 'success') {
        sessionStorage.setItem('token', response.data.body.token);
        sessionStorage.setItem('OrganizationId', response.data.body.manager.organization);
        sessionStorage.setItem('role', response.data.body.manager.role);

        toast.success('Login successful!');
        await fetchPrivacyPolicy();
        setShowPrivacyModal(true);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacySubmit = () => {
    setShowPrivacyModal(false);
    navigate('/dashboard/orgmanager');
  };

  return (
    <div className="d-flex vh-100">
      {/* Left side: IFEELINCOLOR description */}
      <div className="col-lg-7 p-0 d-none d-lg-block">
        <div
          className="h-100 d-flex flex-column justify-content-center p-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="display-4 text-white mb-4" style={{ fontWeight: 300 }}>Welcome to IFEELINCOLOR</h1>
          <p className="lead text-white-50 mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Unlock the power of color psychology for your organization. Our innovative platform helps businesses create more engaging, effective, and emotionally resonant experiences through the strategic use of color.
          </p>
          <p className="lead text-white-50" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Discover how IFEELINCOLOR can transform your approach to branding, marketing, and user experience design.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white">
        <div className="w-75">
          <div className="text-center mb-5">
            <img src={Logo} alt="IFEELINCOLOR logo" className="mb-4" style={{ maxWidth: '300px' }} />
            <h2 style={{ fontWeight: 300, color: '#333', letterSpacing: '1px' }}>Manager Sign In</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Access your IFEELINCOLOR dashboard</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Manager Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control-lg"
                style={{
                  fontSize: '1rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control-lg"
                style={{
                  fontSize: '1rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }}
                disabled={loading}
              />
            </Form.Group>
            <div className="d-flex justify-content-end align-items-center mb-4">
              {/* <Form.Check 
                type="checkbox" 
                label="Remember me" 
                style={{ fontSize: '0.9rem', color: '#555' }}
              /> */}
              <Link to='/manager-forget' style={{ fontSize: '0.9rem', color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
            </div>
            <Button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              style={{
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                fontSize: '1rem',
                padding: '0.75rem 1rem',
                fontWeight: 500,
                letterSpacing: '0.5px',
                boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.2s ease-in-out'
              }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Sign In to Dashboard'}
            </Button>
          </Form>
        </div>
      </div>

      <Modal
        show={showPrivacyModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>{privacyPolicy?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{privacyPolicy?.content}</p>
          <p>Last Updated: {privacyPolicy?.updatedAt}</p>
          <Form.Check
            type="checkbox"
            id="privacy-checkbox"
            label="I have read and agree to the Privacy Policy"
            checked={acceptPolicy}
            onChange={(e) => setAcceptPolicy(e.target.checked)}
            className="mt-3 d-flex align-items-center gap-0"
            style={{
              cursor: 'pointer',
              fontSize: '1rem',
              paddingLeft: '20px',
              marginLeft: '1px',
              // backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}
          />
          <style>
            {`
    #privacy-checkbox {
      width: 20px !important;
      height: 20px !important;
      border: 2px solid #007bff !important;
    }
    #privacy-checkbox:checked {
      background-color: #007bff !important;
      border-color: #007bff !important;
    }
    #privacy-checkbox:focus {
      border-color: #007bff !important;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
    }
    .form-check-input {
      margin-right: 10px !important;
    }
  `}
          </style>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handlePrivacySubmit}
            disabled={!acceptPolicy}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ManagerLogin;