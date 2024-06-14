import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewFiles.css'; // Import custom styles

const ViewFiles = () => {
  const [decryptedFiles, setDecryptedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchDecryptedFiles = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          console.error('Username not found in local storage');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/decryptedFiles', {
          params: { username: storedUsername } // Send the username as a query parameter
        });
        setDecryptedFiles(response.data);
      } catch (error) {
        console.error('Error fetching decrypted files:', error);
      }
    };

    fetchDecryptedFiles();
  }, []);

  const handleView = async (file) => {
    setSelectedFile(file);
    setError('');
    setPassword('');
    setDecryptedContent('');
    setStatusMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/verifyPassword', {
        fileId: file._id,
        password: password
      });
      if (response.data.success) {
        setDecryptedContent(response.data.decryptedContent);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('An error occurred while verifying password. Please try again later.');
    }
  };

  const handleRequest = async (file) => {
    try {
      const response = await axios.post('http://localhost:3000/api/requestFile', {
        username: username,
        fileId: file._id
      });

      if (response.status === 200) {
        file.requestStatus = 'Request Sent';
        setDecryptedFiles([...decryptedFiles]);
        setError('');
        setStatusMessage('Request sent to the admin successfully.');
      } else {
        setError('Failed to send request. Please try again later.');
      }
    } catch (error) {
      console.error('Error requesting file:', error);
      setError('An error occurred while requesting the file. Please try again later.');
    }
  };

  return (
    <div className="view-files-container">
      <h1>Decrypted Files</h1>
      <div className="file-list">
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Action</th>
              <th>Request</th>
            </tr>
          </thead>
          <tbody>
            {decryptedFiles.map((file) => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>
                  <button onClick={() => handleView(file)}>View</button>
                </td>
                <td>
                  {file.requestStatus === 'Accepted' ? (
                    <span>File ID: {file._id}</span>
                  ) : (
                    <button onClick={() => handleRequest(file)}>
                      {file.requestStatus ? 'Request Sent' : 'Request'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedFile && (
        <div className="file-content">
          <h2>View File: {selectedFile.fileName}</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button onClick={() => handleView(selectedFile)}>Submit</button>
          {decryptedContent && <p>{decryptedContent}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default ViewFiles;
