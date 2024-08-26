import React, { useState, useEffect } from 'react';
import { Dropdown, Form, Button, Table, Card, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Setting.scss'

const Settings = () => {
  // Dummy data for managers
  const dummyManagers = [
    {
      id: 1,
      name: 'Manager 1',
      email: 'manager1@example.com',
      organization: 'Org 1',
      subscriptionType: 'Premium',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      plan: 'Yearly'
    },
    {
      id: 2,
      name: 'Manager 2',
      email: 'manager2@example.com',
      organization: 'Org 2',
      subscriptionType: 'Basic',
      startDate: '2023-01-01',
      endDate: '2023-06-30',
      plan: 'Quarterly'
    },
    {
      id: 3,
      name: 'Manager 3',
      email: 'manager3@example.com',
      organization: 'Org 3',
      subscriptionType: 'Standard',
      startDate: '2023-07-01',
      endDate: '2024-06-30',
      plan: 'Yearly'
    },
  ];

  // Initial permissions state for dummy data
  const initialPermissions = {
    'Dashboard': { view: false, add: false, edit: false, delete: false },
    'Patient Management': { view: false, add: false, edit: false, delete: false },
    'Subscription Management': { view: false, add: false, edit: false, delete: false },
    'Test Management': { view: false, add: false, edit: false, delete: false },
    'Banner Management': { view: false, add: false, edit: false, delete: false },
    'Budget Analysis': { view: false, add: false, edit: false, delete: false },
    'Settings': { view: false, add: false, edit: false, delete: false },
  };

  const [selectedManager, setSelectedManager] = useState(null);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [managers, setManagers] = useState([]);
  const [savedPermissions, setSavedPermissions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const pages = Object.keys(initialPermissions);

  useEffect(() => {
    // Simulate fetching managers from backend
    setManagers(dummyManagers);
  }, []);

  const handleManagerChange = (manager) => {
    setSelectedManager(manager);
    // Simulate fetching manager's current permissions from backend
    setPermissions(initialPermissions);
  };

  const handleCheckboxChange = (page, action) => {
    setPermissions((prevPermissions) => {
      const newPermissions = {
        ...prevPermissions,
        [page]: {
          ...prevPermissions[page],
          [action]: !prevPermissions[page][action],
          view: action !== 'view' ? true : prevPermissions[page].view || !prevPermissions[page][action],
        },
      };
      return newPermissions;
    });
  };

  const savePermissions = () => {
    // Save the current manager's permissions
    const updatedPermissions = [...savedPermissions];
    const existingIndex = updatedPermissions.findIndex(
      (perm) => perm.manager.id === selectedManager.id
    );
    if (existingIndex > -1) {
      updatedPermissions[existingIndex] = { manager: selectedManager, permissions };
    } else {
      updatedPermissions.push({ manager: selectedManager, permissions });
    }
    setSavedPermissions(updatedPermissions);

    // Reset for another manager
    setSelectedManager(null);
    setPermissions(initialPermissions);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = (managerId) => {
    // Handle delete logic
    setSavedPermissions((prev) =>
      prev.filter((perm) => perm.manager.id !== managerId)
    );
  };

  const handleEditSave = () => {
    // Handle save logic for edited details
    setShowEditModal(false);
  };

  return (
    <div className="settings-container">
      <h3 className="settings-title">Assign Permissions to Managers</h3>
      <Dropdown onSelect={handleManagerChange} className="manager-dropdown">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedManager ? selectedManager.name : 'Select Manager'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {managers.map((manager) => (
            <Dropdown.Item
              key={manager.id}
              eventKey={manager}
              onClick={() => handleManagerChange(manager)}
            >
              {manager.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedManager && (
        <>
          <Table striped bordered hover className="permissions-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>View</th>
                <th>Add</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page}>
                  <td>{page}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={permissions[page]?.view || false}
                      onChange={() => handleCheckboxChange(page, 'view')}
                      className="view-checkbox"
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={permissions[page]?.add || false}
                      onChange={() => handleCheckboxChange(page, 'add')}
                      className="add-checkbox"
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={permissions[page]?.edit || false}
                      onChange={() => handleCheckboxChange(page, 'edit')}
                      className="edit-checkbox"
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={permissions[page]?.delete || false}
                      onChange={() => handleCheckboxChange(page, 'delete')}
                      className="delete-checkbox"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="primary" onClick={savePermissions} className="save-button">
            Save Permissions
          </Button>
        </>
      )}

      <div className="saved-permissions-container">
        {savedPermissions.map((savedPerm) => (
          <Card key={savedPerm.manager.id} className="manager-card mt-4">
            <Card.Header className="card-header">
              <h4 className="card-title">Manager Details</h4>
              <div className="card-actions d-flex justify-content-end">
                <Button variant="warning" onClick={handleEditClick} className="edit-button">
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(savedPerm.manager.id)}
                  className="delete-button ml-2"
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="card-body">
              <p className="card-text">
                <strong>Name:</strong> {savedPerm.manager.name}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {savedPerm.manager.email}
              </p>
              <p className="card-text">
                <strong>Organization:</strong> {savedPerm.manager.organization}
              </p>
              <p className="card-text">
                <strong>Subscription Type:</strong> {savedPerm.manager.subscriptionType}
              </p>
              <p className="card-text">
                <strong>Start Date:</strong> {savedPerm.manager.startDate}
              </p>
              <p className="card-text">
                <strong>End Date:</strong> {savedPerm.manager.endDate}
              </p>
              <p className="card-text">
                <strong>Plan:</strong> {savedPerm.manager.plan}
              </p>
              <Table striped bordered hover className="saved-permissions-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>View</th>
                    <th>Add</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page}>
                      <td>{page}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={savedPerm.permissions[page].view}
                          onChange={() => handleCheckboxChange(page, 'view')}
                          className="view-checkbox"
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={savedPerm.permissions[page].add}
                          onChange={() => handleCheckboxChange(page, 'add')}
                          className="add-checkbox"
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={savedPerm.permissions[page].edit}
                          onChange={() => handleCheckboxChange(page, 'edit')}
                          className="edit-checkbox"
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={savedPerm.permissions[page].delete}
                            onChange={() => handleCheckboxChange(page, 'delete')}
                            className="delete-checkbox"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </div>
  
        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Manager Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={selectedManager?.name || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      name: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={selectedManager?.email || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      email: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editOrganization" className="mt-3">
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter organization"
                  value={selectedManager?.organization || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      organization: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editSubscriptionType" className="mt-3">
                <Form.Label>Subscription Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subscription type"
                  value={selectedManager?.subscriptionType || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      subscriptionType: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editStartDate" className="mt-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter start date"
                  value={selectedManager?.startDate || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      startDate: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editEndDate" className="mt-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter end date"
                  value={selectedManager?.endDate || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      endDate: e.target.value,
                    }))
                  }
                />
              </Form.Group>
  
              <Form.Group controlId="editPlan" className="mt-3">
                <Form.Label>Plan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter plan (Monthly/Quarterly/Yearly)"
                  value={selectedManager?.plan || ''}
                  onChange={(e) =>
                    setSelectedManager((prevManager) => ({
                      ...prevManager,
                      plan: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  export default Settings;
  
