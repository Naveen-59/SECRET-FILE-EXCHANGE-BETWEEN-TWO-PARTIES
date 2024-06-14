import React, { useState } from 'react';
import './UploadData.css'; // Import custom styles

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file && data && selectedKey) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', data);
        formData.append('selectedKey', selectedKey);
        formData.append('fileName', file.name);

        const response = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setShowModal(true);
        } else {
          console.error('Upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('Please fill in all fields and select a file');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="upload-data">
      <h2>Upload Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <label htmlFor="dataFile" className="file-label">Select Data File:</label>
          <input
            type="file"
            id="dataFile"
            accept=".csv,.txt,.doc,.pdf,.ppt"
            onChange={handleFileChange}
            className="file-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="data">Data:</label>
          <input
            type="text"
            id="data"
            value={data}
            onChange={handleDataChange}
            className="form-control"
            placeholder="Enter data"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="selectedKey">Select Key To Encrypt:</label>
          <select
            id="selectedKey"
            value={selectedKey}
            onChange={handleKeyChange}
            className="form-control"
            required
          >
            <option value="">Select...</option>
            <option value="AES">AES</option>
            <option value="DES">DES</option>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="MD-5">MD-5</option>
          </select>
        </div>
        <button type="submit" className="upload-button">Upload</button>
      </form>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>File uploaded successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadData;
