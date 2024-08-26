import React, { useState } from 'react';
import { Card, Form, Row, Col, Table, Button } from 'react-bootstrap';
import { mdiAccountPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { TableContainer, Paper, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './SettingsPage.css';

const dummyUsers = [
  {
    id: 1,
    name: 'Manager 1',
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
  // Additional dummy users can be added here...
];

const SettingsPage = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleAddManager = () => {
    const newManager = {
      id: users.length + 1,
      name: `Manager ${users.length + 1}`,
      email: `manager${users.length + 1}@example.com`,
      organization: `Org ${users.length + 1}`,
      subscriptionType: 'Portal',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      plan: 'Monthly',
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
    };
    setUsers([...users, newManager]);
    setSelectedUser(newManager);
    setIsEditing(true);
  };

  return (
    <div className="settings-page">
      <Card className="user-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>User Details</h5>
          <div className="d-flex">
            <Form.Select onChange={handleUserChange} value={selectedUser.id} className="user-select me-2">
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
            <Button variant="primary" onClick={handleAddManager}>
              <Icon path={mdiAccountPlus} size={1} /> Add Manager
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
              <TableHead className=''>
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
    </div>
  );
};

export default SettingsPage;