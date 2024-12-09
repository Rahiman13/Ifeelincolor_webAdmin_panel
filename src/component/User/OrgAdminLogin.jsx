import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/lockscreen-bg.jpg';
import './login.scss';
import BaseUrl from '../../api';

const OrgAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const loginUrl = `${BaseUrl}/api/orgadmin/login`;

    setLoading(true);

    try {
      const response = await axios.post(loginUrl, { email, password });

      if (response.data.status === 'success') {
        toast.success('Login successful!');

        sessionStorage.setItem('token', response.data.body.token);
        sessionStorage.setItem('OrganizationId', response.data.body.orgAdmin.organization);
        sessionStorage.setItem('role', "orgadmin");

        setTimeout(() => {
          navigate('/dashboard');
          setLoading(false);
        }, 3000);
      } else {
        setLoading(false);
        toast.error('Invalid credentials');
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.response && error.response.status === 500) {
        toast.error('Internal server error. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
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
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-8">
            <div className="auth-form-light text-left py-4 px-4 px-sm-5 bg-white rounded-md shadow">
              <div className="brand-logo text-center mb-2">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">OrgAdmin Login</h4>
              <h6 className="font-weight-light text-center mb-3">
                Sign in to continue as an OrgAdmin.
              </h6>
              <Form onSubmit={handleSubmit} className="pt-3">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    size="lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </Form.Group>
                <div className="my-2 d-flex justify-content-end align-items-center">
                  <Link to='/orgadmin-forget' className="auth-link underline">Forgot password?</Link>
                </div>
                <div className="mt-3 d-flex justify-content-center">
                  <Button
                    type="submit"
                    className="btn btn-block login-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'SIGN IN'
                    )}
                  </Button>
                </div>
              </Form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminLogin;