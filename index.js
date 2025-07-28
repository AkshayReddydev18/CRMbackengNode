const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeelogin.route');
require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using .env variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', employeeRoutes); 
app.use('/api/password', employeeRoutes); 

app.listen(3000, () => console.log('Server running on port 3000'));
