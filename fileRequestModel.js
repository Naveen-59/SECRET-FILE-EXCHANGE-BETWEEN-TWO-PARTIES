// fileRequestModel.js
const mongoose = require('mongoose');

// Define FileRequest schema
const fileRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fileId: { type: String, required: true },
  status: { type: String, default: 'Pending' }
  // Add more fields as needed
});

// Create FileRequest model
const FileRequest = mongoose.model('FileRequest', fileRequestSchema);

module.exports = FileRequest;
