import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example API call to send OTP
      const response = await axios.post('http://localhost:3000/api/ForgotPassword', { email: 'naveenkanasani96@gmail.com' });
      console.log(response.data.message); // Log success message
      navigate('/reset-password'); // Redirect to reset password page
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // Handle error state
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">Forgot Password</h1>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Send OTP
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
