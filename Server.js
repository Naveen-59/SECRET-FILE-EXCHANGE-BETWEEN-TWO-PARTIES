const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const { adminSchema } = require('./adminSchema'); // Import adminSchema
const AdminModel = require('./adminSchema'); 
const { v4: uuidv4 } = require('uuid');
const FileRequest = require('./fileRequestModel'); // Adjust path as per your file structure




const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/Backend';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true }
  });
  
  const User = mongoose.model('User', UserSchema);
  
  // Registration endpoint
  app.post('/api/registration', async (req, res) => {
    const { username, email, phoneNumber, password } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ username });
  
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user instance
      user = new User({
        username,
        email,
        phoneNumber,
        password
      });
  
      // Save user to database
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(400).json({ message: 'Registration failed', error: error.message });
    }
  });
  
  
const AdminSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String
});

const adminid = mongoose.models.Admin || mongoose.model('Admin', AdminSchema); // Check if Admin model is already defined

app.post('/api/AdminRegistration', async (req, res) => {
  try {
    const { username, password } = req.body;
    const id = uuidv4(); // Generate unique ID
    const admin = new Admin({ id, username, password });
    await admin.save();
    res.json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/AdminLogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the admin by username and password
    const admin = await AdminModel.findOne({ username, password }); // Use AdminModel instead of Admin
    if (admin) {
      res.status(200).json({ success: true, message: 'Admin login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

  
  


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const UploadSchema = new mongoose.Schema({
  fileName: String,
  fileContent: String,
  data: String,
  selectedKey: String,
  fileIV: String,
  dataIV: String,
  selectedKeyIV: String,
  encryptionKey: String
});

const Upload = mongoose.model('Upload', UploadSchema);

const ALGORITHM = 'aes-256-cbc';

function generateEncryptionKey() {
  return crypto.randomBytes(32);
}

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const encryptionKey = generateEncryptionKey();

  const data = req.body.data;
  const selectedKey = req.body.selectedKey;

  try {
    const fileData = await fs.promises.readFile(req.file.path, 'utf8');
    const fileName = req.file.originalname;

    const { encryptedData: encryptedFileData, iv: fileIV } = encrypt(fileData, encryptionKey);
    const { encryptedData: encryptedData, iv: dataIV } = encrypt(data, encryptionKey);
    const { encryptedData: encryptedSelectedKey, iv: selectedKeyIV } = encrypt(selectedKey, encryptionKey);

    const upload = new Upload({
      fileName: fileName,
      fileContent: encryptedFileData,
      fileIV: fileIV,
      data: encryptedData,
      dataIV: dataIV,
      selectedKey: encryptedSelectedKey,
      selectedKeyIV: selectedKeyIV,
      encryptionKey: encryptionKey.toString('hex')
    });

    await upload.save();

    const report = {
      fileName: fileName,
      fileContent: fileData,
      data: data,
      selectedKey: selectedKey
    };
    res.status(200).json({ message: 'File uploaded successfully', report, encryptionKey: encryptionKey.toString('hex') });
  } catch (err) {
    console.error('Error saving upload to database:', err);
    return res.status(500).json({ error: 'Error saving upload to database' });
  }
});

app.get('/api/files', async (req, res) => {
  try {
    const files = await Upload.find();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

function decrypt(encryptedData, key, iv) {
  if (!encryptedData || !key || !iv) {
    throw new Error('Invalid arguments for decryption');
  }
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
app.get('/api/decryptedFiles', async (req, res) => {
  try {
    const { username } = req.query; // Extract the username from query parameters

    const encryptedFiles = await Upload.find();
    const requests = await FileRequest.find({ username }); // Find requests by the username
    const decryptedFiles = await Promise.all(encryptedFiles.map(async file => {
      try {
        const encryptionKey = Buffer.from(file.encryptionKey, 'hex');
        const decryptedContent = decrypt(file.fileContent, encryptionKey, file.fileIV);
        const request = requests.find(req => req.fileId === file._id.toString());
        return { 
          ...file.toObject(), 
          decryptedContent,
          requestStatus: request ? request.status : null,
          requestId: request ? request._id : null 
        };
      } catch (error) {
        console.error(`Error decrypting file ${file._id}:`, error);
        return { 
          ...file.toObject(), 
          decryptedContent: null,
          requestStatus: null,
          requestId: null
        };
      }
    }));
    res.json(decryptedFiles);
  } catch (error) {
    console.error('Error fetching and decrypting files:', error);
    res.status(500).json({ error: 'Error fetching and decrypting files' });
  }
});
app.post('/api/verifyPassword', async (req, res) => {
  const { fileId, password } = req.body;

  try {
    // Find the file in the database
    const file = await Upload.findById(fileId);

    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // Compare the provided password with the encrypted selected key
    if (fileId === password) {
      // Convert encryption key from hex to buffer
      const encryptionKey = Buffer.from(file.encryptionKey, 'hex');

      // Decrypt the file content
      const decryptedContent = decrypt(file.fileContent, encryptionKey, file.fileIV);
      
      // Send the decrypted content to the client
      return res.status(200).json({ success: true, decryptedContent });
    } else {
      // Incorrect password
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return res.status(500).json({ error: 'Error verifying password' });
  }
});
const Admin = mongoose.model('Admin', adminSchema);

// Route to handle admin login details storage
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/forgot-password', (req, res) => {
  const { phoneNumber } = req.body;

  if (phoneNumber) {
    // Logic to send OTP to the phone number
    // This could be using a service like Twilio
    console.log(`Sending OTP to phone number: ${phoneNumber}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } else {
    res.status(400).json({ message: 'Phone number is required' });
  }
});
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for user: ${username}`); // Add logging

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the plain-text password entered with the stored password
    if (password !== user.password) {
      console.error('Password mismatch');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error); // Add detailed error logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
const FileRequestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fileId: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

app.post('/api/requestFile', async (req, res) => {
  try {
    const { username, fileId } = req.body;

    // Example: Create a new file request record
    const newRequest = new FileRequest({
      username: username,
      fileId: fileId,
      status: 'Pending',
    });

    await newRequest.save();

    res.status(200).json({ message: 'File request successful' });
  } catch (error) {
    console.error('Error requesting file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/ViewRequests', async (req, res) => {
  try {
    const requests = await FileRequest.find();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// Send request to admin (Update status to 'Sent to Admin')
app.post('/api/sendToAdmin', async (req, res) => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await FileRequest.findByIdAndUpdate(
      requestId,
      { status: 'Sent to Admin' },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error sending request to admin:', error);
    res.status(500).json({ message: 'Failed to send request to admin' });
  }
});

// Accept request (Update status to 'Accepted')
app.post('/api/acceptRequest', async (req, res) => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await FileRequest.findByIdAndUpdate(
      requestId,
      { status: 'Accepted' },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Failed to accept request' });
  }
});

// Reject request (Update status to 'Rejected')
app.post('/api/rejectRequest', async (req, res) => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await FileRequest.findByIdAndUpdate(
      requestId,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Failed to reject request' });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});