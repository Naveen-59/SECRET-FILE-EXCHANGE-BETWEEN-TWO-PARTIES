const mongoose = require('mongoose');

// Define the schema for your ID collection
const IdSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true // Ensures uniqueness of adminId
  },
  // Add more fields as needed
});

// Create the ID model
const Id = mongoose.model('Id', idSchema);

module.exports = Id;
