import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/lockscreen-bg.jpg';
import './login.scss';
import BaseUrl from '../../api';

const apiUrl=`${BaseUrl}/api/admin/login`
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}`,  { email, password });
      if (response.data.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-8">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5 bg-white rounded shadow">
              <div className="brand-logo text-center mb-2">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">Hello! Let's get started</h4>
              <h6 className="font-weight-light text-center mb-3">
                Sign in to continue.
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
                    onChange={(e) => setEmail(e.target.value)}

                    // onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={(e) => setPassword(e.target.value)}

                    // onChange={handleChange}
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
                <div className="my-3 d-flex justify-content-end align-items-center">
                  {/* <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="keepSignedIn"
                    />
                    <label className="form-check-label text-muted" htmlFor="keepSignedIn">
                      Keep me signed in
                    </label>
                  </div> */}
                  <Link to="#" className="auth-link text-black">Forgot password?</Link>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{' '}
                  <Link to="/dist/" className="text-primary">Create</Link>
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

export default Login;
