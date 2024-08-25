import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Modal,
  Container,
  Row,
  Col
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.scss'; // Custom styles
import OrgChart from '@dabeng/react-orgchart';
import Face1 from '../../assets/face1.jpg'

export default function ProfilePage() {
  const [selectedRole, setSelectedRole] = useState("superadmin");
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState("/placeholder-user.jpg");

  const companyDetails = {
    name: "Ifeelincolor",
    founder: "Jane Smith",
    established: "2010",
    profileLink: "https://ifeelincolor.com",
    location: '123, XYZ street, US',
  };

  const teamMembers = {
    superadmin: { name: "John Doe", role: "Super Admin", organization: "Ifeelincolor HQ" },
    admins: [
      { name: "Alice Johnson", role: "Admin", organization: "Ifeelincolor Branch 1" },
      { name: "Bob Williams", role: "Admin", organization: "Ifeelincolor Branch 2" }
    ],
    managers: [
      { name: "Carol Brown", role: "Manager", admin: "Alice Johnson", organization: "Ifeelincolor Branch 1" },
      { name: "David Lee", role: "Manager", admin: "Bob Williams", organization: "Ifeelincolor Branch 2" },
      { name: "Cooper", role: "Manager", admin: "Bob Williams", organization: "Ifeelincolor Branch 2" },
      { name: "Eve Taylor", role: "Manager", admin: "Alice Johnson", organization: "Ifeelincolor Branch 1" }
    ]
  };

  const NodeTemplate = ({ nodeData }) => {
    return (
      <div className="node">
        <h5>{nodeData?.name || "No Name Available"}</h5>
        <p>{nodeData?.role || "No Role Available"}</p>
        <p>{nodeData?.organization || "No Organization Available"}</p>
      </div>
    );
  };

  const orgData = {
    name: teamMembers.superadmin.name,
    role: teamMembers.superadmin.role,
    children: [
      {
        name: teamMembers.admins[0]?.name,
        role: teamMembers.admins[0]?.role,
        organization: teamMembers.admins[0]?.organization,
        children: teamMembers.managers
          .filter(manager => manager.admin === teamMembers.admins[0]?.name)
          .map(manager => ({
            name: manager.name,
            role: manager.role,
            organization: manager.organization
          }))
      },
      {
        name: teamMembers.admins[1]?.name,
        role: teamMembers.admins[1]?.role,
        organization: teamMembers.admins[1]?.organization,
        children: teamMembers.managers
          .filter(manager => manager.admin === teamMembers.admins[1]?.name)
          .map(manager => ({
            name: manager.name,
            role: manager.role,
            organization: manager.organization
          }))
      }
    ]
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container className="p-4">
      <Row className="mb-4">
        <Col>
          <Card className="text-center trendy-card">
            <Card.Body>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
                id="imageUpload"
              />
              <label htmlFor="imageUpload">
                <Card.Img 
                  variant="top" 
                  src={Face1} 
                  className="rounded-circle trendy-avatar clickable-image" 
                />
              </label>
              <Card.Title className="trendy-title">{teamMembers.superadmin?.name || "No Name Available"}</Card.Title>
              <Card.Text className="trendy-text">{teamMembers.superadmin?.role || "No Role Available"}</Card.Text>
              <Button variant="primary" onClick={() => setShowModal(true)} className="trendy-btn">Follow</Button>
              <Button variant="outline-primary" className="ml-2 trendy-btn-outline">Message</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="trendy-card">
            <Card.Body>
              <Card.Title className="trendy-title">Contact Information</Card.Title>
              <ul className="list-unstyled trendy-list">
                <li><strong>Full Name:</strong> Kenneth Valdez</li>
                <li><strong>Email:</strong> fip@jukmuh.al</li>
                <li><strong>Phone:</strong> (239) 816-9029</li>
                <li><strong>Mobile:</strong> (320) 380-4539</li>
                <li><strong>Address:</strong> Bay Area, San Francisco, CA</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="trendy-card">
            <Card.Body>
              <Card.Title className="trendy-title">Company Details</Card.Title>
              <ul className="list-unstyled trendy-list">
                <li><strong>Company Name:</strong> {companyDetails.name}</li>
                <li><strong>Founder:</strong> {companyDetails.founder}</li>
                <li><strong>Established:</strong> {companyDetails.established}</li>
                <li><strong>Location:</strong> {companyDetails.location}</li>
                <li><strong>Profile Link:</strong> <a href={companyDetails.profileLink} className="trendy-link">{companyDetails.profileLink}</a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="trendy-card" style={{ height: '300px', overflowY: 'scroll' }}>
            <Card.Body>
              <Card.Title className="trendy-title">Members</Card.Title>
              <Form.Group>
                <Form.Label className="trendy-label">Role</Form.Label>
                <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="trendy-select">
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </Form.Control>
              </Form.Group>
              <div className="mt-4 trendy-content">
                {selectedRole === "superadmin" && (
                  <div>
                    <h5 className="trendy-title">{teamMembers.superadmin?.name || "No Name Available"}</h5>
                    <p>{teamMembers.superadmin?.role || "No Role Available"}</p>
                    <p>{teamMembers.superadmin?.organization || "No Organization Available"}</p>
                  </div>
                )}
                {selectedRole === "admin" && teamMembers.admins.map((admin, index) => (
                  <div key={index} className="mb-3 trendy-item">
                    <h5 className="trendy-title">{admin?.name || "No Name Available"}</h5>
                    <p>{admin?.role || "No Role Available"}</p>
                    <p>{admin?.organization || "No Organization Available"}</p>
                  </div>
                ))}
                {selectedRole === "manager" && teamMembers.managers.map((manager, index) => (
                  <div key={index} className="mb-3 trendy-item">
                    <h5 className="trendy-title">{manager?.name || "No Name Available"}</h5>
                    <p>{manager?.role || "No Role Available"}</p>
                    <p>{manager?.organization || "No Organization Available"}</p>
                    <p>Reports to: {manager?.admin || "No Admin Available"}</p>
                  </div>
                ))}
              </div>
              <Modal show={showModal} onHide={() => setShowModal(false)} className="trendy-modal">
                <Modal.Header closeButton className="trendy-modal-header">
                  <Modal.Title>Add New Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter name" className="trendy-input" />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                      <Form.Label>Role</Form.Label>
                      <Form.Control as="select" className="trendy-select">
                        <option>Admin</option>
                        <option>Manager</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="trendy-modal-footer">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="trendy-btn-outline">Close</Button>
                  <Button variant="primary" onClick={() => setShowModal(false)} className="trendy-btn">Save changes</Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Row className="mb-4">
        <Col md={4}>
          <Card className="trendy-card">
            <Card.Body>
              <Card.Title className="trendy-title">Company Details</Card.Title>
              <ul className="list-unstyled trendy-list">
                <li><strong>Company Name:</strong> {companyDetails.name}</li>
                <li><strong>Founder:</strong> {companyDetails.founder}</li>
                <li><strong>Established:</strong> {companyDetails.established}</li>
                <li><strong>Profile Link:</strong> <a href={companyDetails.profileLink} className="trendy-link">{companyDetails.profileLink}</a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={6}>
              <Card className="trendy-card">
                <Card.Body>
                  <Card.Title className="trendy-title">Upcoming Projects</Card.Title>
                  <ul className="list-unstyled trendy-list">
                    <li><strong>Project:</strong> New Dashboard Design</li>
                    <li><strong>Status:</strong> Planning</li>
                    <li><strong>Start Date:</strong> 1st October 2024</li>
                    <li><strong>Expected Completion:</strong> 15th October 2024</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="trendy-card">
                <Card.Body>
                  <Card.Title className="trendy-title">Recent Updates</Card.Title>
                  <ul className="list-unstyled trendy-list">
                    <li><strong>Update:</strong> Version 2.1.0 Released</li>
                    <li><strong>Date:</strong> 20th August 2024</li>
                    <li><strong>Description:</strong> Added new features and fixed bugs.</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row> */}

      <Row>
        <Col>
          <Card className="trendy-card">
            <Card.Body>
              <Card.Title className="trendy-title">Organization Hierarchy</Card.Title>
              <OrgChart
                datasource={orgData}
                collapsible={true}
                pan={true}
                zoom={false}
                NodeTemplate={NodeTemplate}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}































































// import React, { useState } from "react";
// import {
//   Button,
//   Card,
//   Form,
//   Modal,
//   Container,
//   Row,
//   Col
// } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Profile.scss'; // Custom styles
// import OrgChart from '@dabeng/react-orgchart';
// // import '@dabeng/react-orgchart/dist/styles.css';

// export default function ProfilePage() {
//   const [selectedRole, setSelectedRole] = useState("superadmin");
//   const [showModal, setShowModal] = useState(false);

//   const companyDetails = {
//     name: "Ifeelincolor",
//     founder: "Jane Smith",
//     established: "2010",
//     profileLink: "https://ifeelincolor.com"
//   };

//   const teamMembers = {
//     superadmin: { name: "John Doe", role: "Super Admin", organization: "Ifeelincolor HQ" },
//     admins: [
//       { name: "Alice Johnson", role: "Admin", organization: "Ifeelincolor Branch 1" },
//       { name: "Bob Williams", role: "Admin", organization: "Ifeelincolor Branch 2" }
//     ],
//     managers: [
//       { name: "Carol Brown", role: "Manager", admin: "Alice Johnson", organization: "Ifeelincolor Branch 1" },
//       { name: "David Lee", role: "Manager", admin: "Bob Williams", organization: "Ifeelincolor Branch 2" },
//       { name: "Cooper", role: "Manager", admin: "Bob Williams", organization: "Ifeelincolor Branch 2" },
//       { name: "Eve Taylor", role: "Manager", admin: "Alice Johnson", organization: "Ifeelincolor Branch 1" }
//     ]
//   };

//   const NodeTemplate = ({ nodeData }) => {
//     return (
//       <div className="node">
//         <h5 style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{nodeData?.name || "No Name Available"}</h5>
//         <p style={{ fontSize: 14, color: '#666' }}>{nodeData?.role || "No Role Available"}</p>
//         <p style={{ fontSize: 14, color: '#666' }}>{nodeData?.organization || "No Organization Available"}</p>
//       </div>
//     );
//   };

//   const orgData = {
//     name: teamMembers.superadmin.name,
//     role: teamMembers.superadmin.role,
//     children: [
//       {
//         name: teamMembers.admins[0]?.name,
//         role: teamMembers.admins[0]?.role,
//         organization: teamMembers.admins[0]?.organization,
//         children: teamMembers.managers
//           .filter(manager => manager.admin === teamMembers.admins[0]?.name)
//           .map(manager => ({
//             name: manager.name,
//             role: manager.role,
//             organization: manager.organization
//           }))
//       },
//       {
//         name: teamMembers.admins[1]?.name,
//         role: teamMembers.admins[1]?.role,
//         organization: teamMembers.admins[1]?.organization,
//         children: teamMembers.managers
//           .filter(manager => manager.admin === teamMembers.admins[1]?.name)
//           .map(manager => ({
//             name: manager.name,
//             role: manager.role,
//             organization: manager.organization
//           }))
//       }
//     ]
//   };

//   return (
//     <Container className="p-4" style={{ fontFamily: 'Open Sans', fontSize: 16 }}>
//       <Row className="mb-4">
//         <Col>
//           <Card className="text-center trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Img variant="top" src="/placeholder-user.jpg" className="rounded-circle trendy-avatar" style={{ width: 100, height: 100, objectFit: 'cover' }} />
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>{teamMembers.superadmin?.name || "No Name Available"}</Card.Title>
//               <Card.Text className="trendy-text" style={{ fontSize: 18, color: '#666' }}>{teamMembers.superadmin?.role || "No Role Available"}</Card.Text>
//               <Button variant="primary" onClick={() => setShowModal(true)} className="trendy-btn" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', padding: '10px 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Follow</Button>
//               <Button variant="outline-primary" className="ml-2 trendy-btn-outline" style={{ padding: '10px 20px', fontSize: 16, fontWeight: 600, color: '#4CAF50', borderColor: '#4CAF50' }}>Message</Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Contact Information</Card.Title>
//               <ul className="list-unstyled trendy-list">
//                 <li><strong>Full Name:</strong> Kenneth Valdez</li>
//                 <li><strong>Email:</strong> fip@jukmuh.al</li>
//                 <li><strong>Phone:</strong> (239) 816-9029</li>
//                 <li><strong>Mobile:</strong> (320) 380-4539</li>
//                 <li><strong>Address:</strong> Bay Area, San Francisco, CA</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={8}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', height: '300px', overflowY: 'scroll' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Members</Card.Title>
//               <Form.Group>
//                 <Form.Label className="trendy-label" style={{ fontSize: 18, color: '#666' }}>Role</Form.Label>
//                 <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="trendy-select" style={{ padding: '10px 20px', fontSize: 16, color: '#333' }}>
//                   <option value="superadmin">Super Admin</option>
//                   <option value="admin">Admin</option>
//                   <option value="manager">Manager</option>
//                 </Form.Control>
//               </Form.Group>
//               <div className="mt-4 trendy-content">
//                 {selectedRole === "superadmin" && (
//                   <div>
//                     <h5 className="trendy-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{teamMembers.superadmin?.name || "No Name Available"}</h5>
//                     <p style={{ fontSize: 14, color: '#666' }}>{teamMembers.superadmin?.role || "No Role Available"}</p>
//                     <p style={{ fontSize: 14, color: '#666' }}>{teamMembers.superadmin?.organization || "No Organization Available"}</p>
//                   </div>
//                 )}
//                 {selectedRole === "admin" && teamMembers.admins.map((admin, index) => (
//                   <div key={index} className="mb-3 trendy-item">
//                     <h5 className="trendy-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{admin?.name || "No Name Available"}</h5>
//                     <p style={{ fontSize: 14, color: '#666' }}>{admin?.role || "No Role Available"}</p>
//                     <p style={{ fontSize: 14, color: '#666' }}>{admin?.organization || "No Organization Available"}</p>
//                   </div>
//                 ))}
//                 {selectedRole === "manager" && teamMembers.managers.map((manager, index) => (
//                   <div key={index} className="mb-3 trendy-item">
//                     <h5 className="trendy-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{manager?.name || "No Name Available"}</h5>
//                     <p style={{ fontSize: 14, color: '#666' }}>{manager?.role || "No Role Available"}</p>
//                     <p style={{ fontSize: 14, color: '#666' }}>{manager?.organization || "No Organization Available"}</p>
//                     <p style={{ fontSize: 14, color: '#666' }}>Reports to: {manager?.admin || "No Admin Available"}</p>
//                   </div>
//                 ))}
//               </div>
//               <Modal show={showModal} onHide={() => setShowModal(false)} className="trendy-modal" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//                 <Modal.Header closeButton className="trendy-modal-header" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px', borderRadius: '10px 10px 0 0' }}>
//                   <Modal.Title>Add New Team Member</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <Form>
//                     <Form.Group controlId="formName">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control type="text" placeholder="Enter name" className="trendy-input" style={{ padding: '10px 20px', fontSize: 16, color: '#333' }} />
//                     </Form.Group>
//                     <Form.Group controlId="formRole">
//                       <Form.Label>Role</Form.Label>
//                       <Form.Control as="select" className="trendy-select" style={{ padding: '10px 20px', fontSize: 16, color: '#333' }}>
//                         <option>Admin</option>
//                         <option>Manager</option>
//                       </Form.Control>
//                     </Form.Group>
//                   </Form>
//                 </Modal.Body>
//                 <Modal.Footer className="trendy-modal-footer" style={{ backgroundColor: '#f7f7f7', padding: '10px', borderRadius: '0 0 10px 10px' }}>
//                   <Button variant="secondary" onClick={() => setShowModal(false)} className="trendy-btn-outline" style={{ padding: '10px 20px', fontSize: 16, fontWeight: 600, color: '#4CAF50', borderColor: '#4CAF50' }}>Close</Button>
//                   <Button variant="primary" onClick={() => setShowModal(false)} className="trendy-btn" style={{ padding: '10px 20px', fontSize: 16, fontWeight: 600, color: '#fff', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>Save changes</Button>
//                 </Modal.Footer>
//               </Modal>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Company Details</Card.Title>
//               <ul className="list-unstyled trendy-list">
//                 <li><strong>Company Name:</strong> {companyDetails.name}</li>
//                 <li><strong>Founder:</strong> {companyDetails.founder}</li>
//                 <li><strong>Established:</strong> {companyDetails.established}</li>
//                 <li><strong>Profile Link:</strong> <a href={companyDetails.profileLink} className="trendy-link" style={{ fontSize: 16, color: '#4CAF50', textDecoration: 'none' }}>{companyDetails.profileLink}</a></li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={8}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Project Status</Card.Title>
//               <ul className="list-unstyled trendy-list">
//                 <li><strong>Project Name:</strong> Ifeelcolor Admin Panel</li>
//                 <li><strong>Status:</strong> Ongoing</li>
//                 <li><strong>Completion:</strong> 75%</li>
//                 <li><strong>Deadline:</strong> 20th September 2024</li>
//               </ul>
//               <div className="progress trendy-progress" style={{ height: 20, borderRadius: 10, backgroundColor: '#f7f7f7' }}>
//                 <div
//                   className="progress-bar"
//                   role="progressbar"
//                   style={{ width: "75%", backgroundColor: '#4CAF50', height: 20, borderRadius: 10 }}
//                   aria-valuenow="75"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 >
//                   75%
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Project Details</Card.Title>
//               <ul className="list-unstyled trendy-list">
//                 <li><strong>Project Name:</strong> Ifeelcolor Admin Panel</li>
//                 <li><strong>Project Type:</strong> Web Development</li>
//                 <li><strong>Project Manager:</strong> John Doe</li>
//                 <li><strong>Project Status:</strong> Ongoing</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={8}>
//           <Card className="trendy-card" style={{ backgroundColor: '#f7f7f7', borderRadius: 10, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//             <Card.Body>
//               <Card.Title className="trendy-title" style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>Project Timeline</Card.Title>
//               <div className="trendy-timeline">
//                 <div className="trendy-timeline-item">
//                   <div className="trendy-timeline-icon">
//                     <i className="fas fa-circle" style={{ fontSize: 16, color: '#4CAF50' }}></i>
//                   </div>
//                   <div className="trendy-timeline-content">
//                     <h5 className="trendy-timeline-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Project Kickoff</h5>
//                     <p className="trendy-timeline-description" style={{ fontSize: 14, color: '#666' }}>Project kickoff meeting with the team.</p>
//                     <p className="trendy-timeline-date" style={{ fontSize: 14, color: '#666' }}>20th January 2024</p>
//                   </div>
//                 </div>
//                 <div className="trendy-timeline-item">
//                   <div className="trendy-timeline-icon">
//                     <i className="fas fa-circle" style={{ fontSize: 16, color: '#4CAF50' }}></i>
//                   </div>
//                   <div className="trendy-timeline-content">
//                     <h5 className="trendy-timeline-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Design Phase</h5>
//                     <p className="trendy-timeline-description" style={{ fontSize: 14, color: '#666' }}>Design phase of the project.</p>
//                     <p className="trendy-timeline-date" style={{ fontSize: 14, color: '#666' }}>25th January 2024 - 10th February 2024</p>
//                   </div>
//                 </div>
//                 <div className="trendy-timeline-item">
//                   <div className="trendy-timeline-icon">
//                     <i className="fas fa-circle" style={{ fontSize: 16, color: '#4CAF50' }}></i>
//                   </div>
//                   <div className="trendy-timeline-content">
//                     <h5 className="trendy-timeline-title" style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Development Phase</h5>
//                     <p className="trendy-timeline-description" style={{ fontSize: 14, color: '#666' }}>Development phase of the project.</p>
//                     <p className="trendy-timeline-date" style={{ fontSize: 14, color: '#666' }}>15th February 2024 - 20th March 2024</p>
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// // export default App;