import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/bg-3.png';
import BaseUrl from '../../api';

const OrganizationRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/api/organization/register`, {
        name,
        email,
        password,
      });

      if (response.data.status === 'success') {
        toast.success('Organization registered successfully!')
        // toast.success('Organization registered successfully!', {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        // Navigate to login page after a short delay to allow the toast to be seen
        setTimeout(() => {
          navigate('/organization-login');
        }, 2000); // Adjust delay as needed
      } else {
        toast.error('Registration failed. Please try again.')
        // toast.error('Registration failed. Please try again.', {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    //   toast.error(error.response?.data?.message || 'Registration failed. Please try again.',
    //     {
    //       position: toast.POSITION.TOP_RIGHT,
    //     }
    //   );
    } finally {
      setLoading(false);
    }
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
            Join our innovative platform and harness the power of color psychology for your organization. Create more engaging, effective, and emotionally resonant experiences through the strategic use of color.
          </p>
          <p className="lead text-white-50" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Register now to transform your approach to branding, marketing, and user experience design with IFEELINCOLOR.
          </p>
        </div>
      </div>
      
      {/* Right side: Registration form */}
      <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white">
        <div className="w-75">
          <div className="text-center mb-5">
            <img src={Logo} alt="IFEELINCOLOR logo" className="mb-4" style={{ maxWidth: '300px' }} />
            <h2 style={{ fontWeight: 300, color: '#333', letterSpacing: '1px' }}>Organization Registration</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Create your IFEELINCOLOR account</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="name">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Organization Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
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
            <Form.Group className="mb-4" controlId="email">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
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
            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {loading ? <Spinner animation="border" size="sm" /> : 'Register Organization'}
            </Button>
          </Form>
          <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#555' }}>
            Already have an account? <Link to='/organization-login' style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrganizationRegister;