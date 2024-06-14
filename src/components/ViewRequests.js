import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRequests.css';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ViewRequests');
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/acceptRequest', { requestId });
      console.log('Request accepted:', response.data);
      updateRequestStatus(requestId, 'Accepted');
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/rejectRequest', { requestId });
      console.log('Request rejected:', response.data);
      updateRequestStatus(requestId, 'Rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const updateRequestStatus = (requestId, status) => {
    const updatedRequests = requests.map((request) =>
      request._id === requestId ? { ...request, status } : request
    );
    setRequests(updatedRequests);
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-requests-container">
      <h1>View Requests</h1>
      <div className="request-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <div className="request-details">
              <p><strong>User:</strong> {request.username}</p>
              
              <p><strong>Status:</strong> {request.status}</p>
            </div>
            {request.status !== 'Sent to Admin' && (
              <div className="request-actions">
                <button onClick={() => acceptRequest(request._id)}>Accept</button>
                <button onClick={() => rejectRequest(request._id)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRequests;
