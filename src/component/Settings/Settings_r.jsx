import React, { useState } from 'react';
import { Card, Form, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { mdiAccountPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { TableContainer } from '@mui/material';
import axios from 'axios';
import './SettingsPage.css';

const dummyUsers = [
  // ... (your existing dummy users)
];

const SettingsPage = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    role: 'Manager',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handlePermissionChange = (page, permissionType) => {
    const updatedPermissions = {
      ...selectedUser.permissions,
      [page]: {
        ...selectedUser.permissions[page],
        [permissionType]: !selectedUser.permissions[page][permissionType],
      },
    };

    if (permissionType !== 'view' && updatedPermissions[page][permissionType]) {
      updatedPermissions[page].view = true;
    }
    setSelectedUser({ ...selectedUser, permissions: updatedPermissions });
  };

  const handleSave = () => {
    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    setIsEditing(false);
  };

  const handleDelete = () => {
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setSelectedUser(updatedUsers[0] || {});
  };

  const handleAddManager = () => setShowAddModal(true);

  const handleAddUserSubmit = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const orgId = sessionStorage.getItem('organizationId');
    const endpoint =
      newUser.role === 'Organization Admin'
        ? '/api/orgadmin/login'
        : '/api/manager/login';

    try {
      await axios.post(`http://localhost:3000${endpoint}`, {
        ...newUser,
        organizationId: orgId,
      });
      // Add new user to the list and close modal
      const newManager = {
        id: users.length + 1,
        ...newUser,
        organization: `Org ${users.length + 1}`,
        subscriptionType: 'Portal',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        plan: 'Monthly',
        permissions: {
          dashboard: { view: false, add: false, edit: false, delete: false },
          budgetAnalysis: { view: false, add: false, edit: false, delete: false },
          patientManagement: { view: false, add: false, edit: false, delete: false },
          subscription: { view: false, add: false, edit: false, delete: false },
          assessment: { view: false, add: false, edit: false, delete: false },
          bannerManagement: { view: false, add: false, edit: false, delete: false },
          settings: { view: false, add: false, edit: false, delete: false },
          profile: { view: false, add: false, edit: false, delete: false },
        },
      };
      setUsers([...users, newManager]);
      setSelectedUser(newManager);
      setShowAddModal(false);
      setNewUser({
        role: 'Manager',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="settings-page">
      <Card className="user-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Settings</h3>
          <div className="d-flex">
            <Form.Select onChange={handleUserChange} value={selectedUser.id} className="user-select me-3">
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
            <Button variant="primary" className='settings-card-btn' onClick={handleAddManager}>
              <Icon path={mdiAccountPlus} size={1} className='me-2' />
              <span>Add</span>
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            {/* ... (rest of your form fields) */}
          </Row>
          <h4 className="mt-4 "><strong>Permissions</strong></h4>
          <TableContainer >
            {/* ... (permissions table) */}
          </TableContainer>
          {isEditing ? (
            <div className="d-flex justify-content-end mt-3">
              <Button variant="success" onClick={handleSave} className="me-2">Save</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" onClick={() => setIsEditing(true)} className="me-2">Edit</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="role">
              <Form.Label>Role:</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="Organization Admin">Organization Admin</option>
                <option value="Manager">Manager</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUserSubmit}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;
