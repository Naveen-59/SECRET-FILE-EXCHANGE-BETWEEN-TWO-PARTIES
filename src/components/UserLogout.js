import React from 'react';
import Button from 'react-bootstrap/Button';

function UserLogout() {
  const handleLogout = (e) => {
    // Perform logout logic here, such as clearing session/local storage
    // For example, you can remove the admin token from localStorage
    localStorage.removeItem('adminToken');
    window.location.href="/UserLogin";
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">UserLogout</h1>
            </div>
            <div className="card-body">
              <p>Are you sure you want to logout?</p>
              <Button variant="primary" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogout;
