import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/lockscreen-bg.jpg';
import { Navigate, useNavigate } from 'react-router-dom';
// import './login.scss';
import BaseUrl from '../../api'

const apiUrl = `${BaseUrl}/api/admin/login`;

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, { email, password });
      console.log(response.data);
      // const tok=response.data.token
      // Store token or handle successful login logic here
      sessionStorage.setItem('token', response.data.token)
      navigate('/dist/dashboard')
      toast.success('Login successful!');
    } catch (err) {
      console.error(err.response.data);
      setError('Login failed. Please check your credentials.');
      toast.error('Login failed. Please try again.');
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
      <Container>
        <Row className="justify-content-center">
          <Col lg={4} md={6} sm={8}>
            <div className="auth-form-light text-left py-4 rounded-full px-4 px-sm-5 bg-white  shadow">
              <div className="brand-logo text-center mb-2">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">Super Admin Login</h4>
              <h6 className="font-weight-light text-center mb-3">
                Sign in to continue.
              </h6>
              {error && <p className="text-danger mb-3 text-center">{error}</p>}
              <Form onSubmit={handleSubmit} className="pt-3">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button
                    type="submit"
                    className="btn btn-block login-btn"
                  >
                    SIGN IN
                  </Button>
                </div>
              </Form>
              <ToastContainer />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SuperAdminLogin;
