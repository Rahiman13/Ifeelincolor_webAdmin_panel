import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg'; // Replace with your logo
import bg from '../../assets/lockscreen-bg.jpg'; // Replace with your background image
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
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
          navigate('/dist/organization-login');
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
    <div
      className="login d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-7 col-sm-10">
            <div className="auth-form-light text-left py-4 px-4 px-sm-5 bg-white rounded-md shadow">
              <div className="brand-logo text-center mb-2">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">Register Your Organization</h4>
              <h6 className="font-weight-light text-center mb-3">
                Please fill in the details below.
              </h6>
              <Form onSubmit={handleSubmit} className="pt-3">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter organization name"
                    size="lg"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    size="lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    size="lg"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <div className="mt-3 d-flex justify-content-center">
                  <Button
                    type="submit"
                    className="btn btn-block login-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </Form>
              <ToastContainer autoClose={5000} />
              <div className="">
                <p className="text-center mt-3">
                  Already have an account?{' '}
                  <a href="/dist/organization-login">Sign In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister;
