import React, { useState } from 'react';
import { Modal, Button, Dropdown, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEllipsisV, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom'
import './Banner.scss'
import Announcement  from '../../assets/Announcement.jpg';

// Dummy Data
const dummyBanners = [
  {
    id: 1,
    imageUrl: `${Announcement}`,
    comment: 'Spring Sale - 20% Off!',
    postedBy: 'John Doe',
    postedDate: '2024-08-21T12:00:00Z',
  },
  {
    id: 2,
    imageUrl: `${Announcement}`,
    comment: 'New Arrivals in Store',
    postedBy: 'Jane Smith',
    postedDate: '2024-08-20T12:00:00Z',
  },
];

// Add Banner Modal Component
const AddBannerModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    image: null,
    comment: '',
    postedBy: '',
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate adding banner
    console.log('Adding banner:', formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Posted By</label>
            <input
              type="text"
              className="form-control"
              value={formData.postedBy}
              onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button variant="banner-primary" type="submit">
            Add Banner
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// Edit Banner Modal Component
const EditBannerModal = ({ show, handleClose, bannerData, onSave }) => {
  const [formData, setFormData] = useState(bannerData);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Call the function to save changes
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Posted By</label>
            <input
              type="text"
              className="form-control"
              value={formData.postedBy}
              onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload New Image (Optional)</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <Button variant="banner-primary" type="submit">
            Save Changes
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// Banner Management Page Component
const BannerManagementPage = () => {
  const [banners, setBanners] = useState(dummyBanners);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleDelete = (bannerId) => {
    // Simulate deleting banner
    console.log(`Deleting banner with id ${bannerId}`);
    setBanners(banners.filter((banner) => banner.id !== bannerId));
  };

  const handleSaveEdit = (updatedBanner) => {
    // Simulate updating banner
    console.log('Updating banner:', updatedBanner);
    setBanners(banners.map((banner) => (banner.id === updatedBanner.id ? updatedBanner : banner)));
  };

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-bullhorn fs-5"></i>
          </span> Banner Management
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span>
                Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          <Button variant="banner-primary banner-add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Banner
          </Button>
        </div>
        <div className="row">
          {banners.map((banner) => (
            <div className="col-md-4 mb-4" key={banner.id}>
              <Card className="position-relative banner-card ">
                <Card.Img variant="top" className='banner-card-img-top' src={banner.imageUrl} />
                <Dropdown className="banner-dropdown position-absolute" style={{ top: '10px', right: '10px', color: '#000' }}>
                  <Dropdown.Toggle variant="" className='banner-dropdown-toggle' id="dropdown-basic">
                    <FaEllipsisV />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className='banner-dropdown-menu'>
                    <Dropdown.Item onClick={() => {
                      setSelectedBanner(banner);
                      setShowEditModal(true);
                      // className = 'banner-dropdown-item'
                    }}>
                      <FaEdit /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(banner.id)} className='banner-dropdown-item'>
                      <FaTrash /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Card.Body className='px-4 py-3'>
                  <Card.Title className='banner-card-title '>{banner.comment}</Card.Title>
                  <Card.Text className='banner-card-text'>
                    <strong>Posted By:</strong> {banner.postedBy}
                    <br />
                    <strong>Posted Date:</strong> {new Date(banner.postedDate).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <AddBannerModal show={showAddModal} handleClose={() => setShowAddModal(false)} />
        {selectedBanner && (
          <EditBannerModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            bannerData={selectedBanner}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </>
  );
};

export default BannerManagementPage;
