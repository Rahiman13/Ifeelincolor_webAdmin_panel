import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.scss'; // Custom SCSS file for additional styling
import Logo from '../../assets/logo.svg';
import bg from '../../assets/lockscreen-bg.jpg';
import BaseUrl from '../../api';

const apiUrl = `${BaseUrl}`;

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [roles] = useState([
    { value: 'orgAdmin', label: 'Organization Admin' },
    { value: 'manager', label: 'Manager' }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const organizationId = sessionStorage.getItem('organizationId');
    if (organizationId) {
      setFormData((prevData) => ({
        ...prevData,
        organization: organizationId
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'No token found, please login again', 'error');
      return;
    }

    setLoading(true); // Start loading

    try {
      const endpoint = formData.role === 'orgAdmin'
        ? `${apiUrl}/api/orgadmin/register`
        : `${apiUrl}/api/manager/register`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTimeout(() => { // Simulate a 3-second delay
        setLoading(false); // Stop loading
        if (response.data.status === 'success') {
          toast.success('Registration successful!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }, 3000);

    } catch (error) {
      setLoading(false); // Stop loading
      toast.error('Registration failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      className="register d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="auth-form-light text-left py-3 px-4 px-sm-5 bg-white rounded shadow-lg">
              <div className="brand-logo text-center mb-4">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">Join Us Today</h4>
              <h6 className="font-weight-light text-center mb-2">
                Sign up to get started. It only takes a few steps.
              </h6>
              <Form onSubmit={handleSubmit} className="pt-3">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4 register-btn" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                </Button>
              </Form>
              <div className="text-center mt-4 font-weight-light">
                Already have an account?{' '}
                <Link to="/login" className="text-primary">Login</Link>
              </div>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Registration;
