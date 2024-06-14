import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    try {
      const dataWithId = {
        ...formData,
      
      };

      const response = await axios.post('http://localhost:3000/api/registration', dataWithId);
      
      console.log(response.data.message);
      setModalMessage('Registration successful.');
      setShowModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again later.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">EncrypTrade</h1>
              <h3 className="text-center">User Registration</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
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
              </Form>
            </div>
            <div className="card-footer text-center">
              <p className="mb-0"> Already have an account? <Link to="/UserLogin">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
