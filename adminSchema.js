const mongoose = require('mongoose');

// Define the schema for Admin
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Admin', adminSchema);
