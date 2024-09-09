import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaBuilding, FaUserShield, FaUserTie } from 'react-icons/fa'; // Importing React Icons
import { useNavigate } from 'react-router-dom'; // Importing useNavigate

function LandingPage() {
  const navigate = useNavigate(); // useNavigate hook

  const handleNavigation = (path) => {
    navigate(path); // Using useNavigate instead of window.location.href
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    height: 'auto', // Adjust height to fit content
    minHeight: '250px', // Minimum height to maintain card integrity
    position: 'relative', // For positioning icons
  };

  const iconContainerStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    opacity: 0.1,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
  };

  const cardIconStyle = {
    fontSize: '5rem',
    color: 'blue',
  };

  const btnGradientStyle = {
    padding: '12px 24px',
    borderRadius: '25px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    border: 'none',
  };

  const organizationBtnStyle = {
    background: 'linear-gradient(45deg, #007bff, #0056b3)',
  };

  const adminBtnStyle = {
    background: 'linear-gradient(45deg, #28a745, #1e7e34)',
  };

  const managerBtnStyle = {
    background: 'linear-gradient(45deg, #ffc107, #e0a800)',
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '20px' }}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={5} className="mb-4">
            <Card style={cardStyle}>
              <Card.Body className="text-center">
                <div style={iconContainerStyle}>
                  <FaBuilding style={cardIconStyle} />
                </div>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px', color: '#333' }}>Organization</Card.Title>
                <Card.Text style={{ marginBottom: '20px', color: '#555' }}>
                  Manage your organization's settings and details.
                </Card.Text>
                <Button
                  style={{ ...btnGradientStyle, ...organizationBtnStyle }}
                  onClick={() => handleNavigation('/dist/organization-login')}
                >
                  Go to Organization
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={5} lg={4} className="mb-4">
            <Card style={cardStyle}>
              <Card.Body className="text-center">
                <div style={iconContainerStyle}>
                  <FaUserShield style={cardIconStyle} />
                </div>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px', color: '#333' }}>Admin</Card.Title>
                <Card.Text style={{ marginBottom: '20px', color: '#555' }}>
                  Administer your organization and manage users.
                </Card.Text>
                <Button
                  style={{ ...btnGradientStyle, ...adminBtnStyle }}
                  onClick={() => handleNavigation('/dist/orgadmin-login')}
                >
                  Go to Admin
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={5} lg={4} className="mb-4">
            <Card style={cardStyle}>
              <Card.Body className="text-center">
                <div style={iconContainerStyle}>
                  <FaUserTie style={cardIconStyle} />
                </div>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px', color: '#333' }}>Manager</Card.Title>
                <Card.Text style={{ marginBottom: '20px', color: '#555' }}>
                  Manage your team and resources efficiently.
                </Card.Text>
                <Button
                  style={{ ...btnGradientStyle, ...managerBtnStyle }}
                  onClick={() => handleNavigation('/dist/manager-login')}
                >
                  Go to Manager
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
