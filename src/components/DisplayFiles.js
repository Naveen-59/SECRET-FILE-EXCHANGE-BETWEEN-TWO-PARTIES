import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios.get('http://localhost:3000/api/files')
      .then(response => {
        // Assuming response.data is an array of file objects
        setFiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center mb-4">Files in System</h1>
            </div>
            <div className="card-body">
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{index + 1}. {file.fileContent}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayFiles;
