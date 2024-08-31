import React, { useState } from 'react';
import { Card, Form, Row, Col, Table, Button, Modal, Spinner } from 'react-bootstrap';
import { mdiAccountPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { TableContainer, Paper, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './SettingsPage.css';

const dummyUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'manager1@example.com',
    organization: 'Org 1',
    subscriptionType: 'Portal',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    plan: 'Yearly',
    role: 'Manager',
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
  },
  {
    id: 2,
    name: 'Manager',
    email: 'manager2@example.com',
    organization: 'Org 1',
    subscriptionType: 'Portal',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    plan: 'Yearly',
    role: 'Manager',
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
  },
  // Additional dummy users can be added here...
];

const SettingsPage = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Modal state variables
  const [showModal, setShowModal] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [roles] = useState([
    { value: 'orgAdmin', label: 'Organization Admin' },
    { value: 'manager', label: 'Manager' },
  ]);

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
    toast.success('User updated successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${selectedUser.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setSelectedUser(updatedUsers[0] || {});
        toast.success('User deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

  const handleAddManager = () => {
    setShowModal(true);
    setModalFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
  };

  // Modal form handlers
  const handleModalChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (modalFormData.password !== modalFormData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    if (!modalFormData.role) {
      Swal.fire('Error', 'Please select a role', 'error');
      return;
    }

    setModalLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name: modalFormData.name,
        email: modalFormData.email,
        organization: `Org ${users.length + 1}`,
        subscriptionType: 'Portal',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        plan: 'Monthly',
        role: modalFormData.role === 'orgAdmin' ? 'Organization Admin' : 'Manager',
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
      setUsers([...users, newUser]);
      setSelectedUser(newUser);
      setShowModal(false);
      setModalLoading(false);
      toast.success('Member added successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    }, 3000);
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
            <Col>
              <Form.Group controlId="name">
                <Form.Label><strong>Name:</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="email">
                <Form.Label><strong>Email:</strong></Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="organization">
                <Form.Label><strong>Organization:</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.organization}
                  onChange={(e) => setSelectedUser({ ...selectedUser, organization: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="role">
                <Form.Label><strong>Role:</strong></Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="subscriptionType">
                <Form.Label><strong>Subscription Type:</strong></Form.Label>
                <Form.Select
                  value={selectedUser.subscriptionType}
                  onChange={(e) => setSelectedUser({ ...selectedUser, subscriptionType: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                >
                  <option value="Portal">Portal</option>
                  <option value="Clinician">Clinician</option>
                  <option value="Organization">Organization</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label><strong>Start Date:</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={selectedUser.startDate}
                  onChange={(e) => setSelectedUser({ ...selectedUser, startDate: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label><strong>End Date:</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={selectedUser.endDate}
                  onChange={(e) => setSelectedUser({ ...selectedUser, endDate: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="plan">
                <Form.Label><strong>Plan:</strong></Form.Label>
                <Form.Select
                  value={selectedUser.plan}
                  onChange={(e) => setSelectedUser({ ...selectedUser, plan: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'editable-field' : ''}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4 "><strong>Permissions</strong></h4>
          <TableContainer component={Paper}>
            <Table bordered hover className="permissions-table mt-3">
              <TableHead>
                <TableRow>
                  <TableCell>Page</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Add</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(selectedUser.permissions).map((page) => (
                  <TableRow key={page}>
                    <TableCell>{page.charAt(0).toUpperCase() + page.slice(1)}</TableCell>
                    {Object.keys(selectedUser.permissions[page]).map((permissionType) => (
                      <TableCell key={permissionType}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedUser.permissions[page][permissionType]}
                          onChange={() => handlePermissionChange(page, permissionType)}
                          disabled={!isEditing}
                          className="center-checkbox"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Registration Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-dark">Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
          <Form onSubmit={handleModalSubmit}>
            <Form.Group className="mb-3" controlId="modalName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={modalFormData.name}
                onChange={handleModalChange}
                required
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={modalFormData.email}
                onChange={handleModalChange}
                required
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={modalFormData.role}
                onChange={handleModalChange}
                required
                style={{ borderRadius: '5px' }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={modalFormData.password}
                onChange={handleModalChange}
                required
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={modalFormData.confirmPassword}
                onChange={handleModalChange}
                required
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
                style={{
                  background: 'linear-gradient(90deg, #f78ca0 0%, #f9748f 100%)',
                  border: 'none',
                  borderRadius: '20px',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={modalLoading}
                style={{
                  background: 'linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)',
                  border: 'none',
                  borderRadius: '20px',
                }}
              >
                {modalLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="visually-hidden">Loading...</span>
                  </>
                ) : (
                  'Add Member'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>



      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
