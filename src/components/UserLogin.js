import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

function UserLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', formData);
      console.log(response.data.message); // Login successful
      localStorage.setItem('username', formData.username); // Store username in local storage
      navigate('/Useradminboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      // Handle login error
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">EncrypTrade</h1>
              <h3 className="text-center">Sign In</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <Button variant="primary" type="submit" className="mt-3">Sign In</Button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p className="mb-0">Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
