import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; // Import Modal from React Bootstrap
import { v4 as uuidv4 } from 'uuid'; // Import uuid

function AdminRegistration() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false); // Function to close the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const adminId = uuidv4();

    try {
      const dataWithId = {
        ...formData,
        adminId: adminId
      };

      const response = await axios.post('http://localhost:3000/api/AdminRegistration', dataWithId);
      
      console.log(response.data.message);

      setShowModal(true); // Show modal on successful registration
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">EncrypTrade</h1>
              <h3 className="text-center">Sign Up</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Admin</Form.Label>
                  <Form.Control type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" name="phoneNumber" placeholder="Enter phone number" value={formData.phoneNumber} onChange={handleChange} />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Register
                </Button>
                <div className="card-footer text-center">
                  <p className="mb-0"> Already have an account? <Link to="/AdminLogin">Login</Link></p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal to show upon successful registration */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your registration as an admin was successful.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default AdminRegistration;
