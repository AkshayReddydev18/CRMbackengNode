const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeelogin.route');
const passwordRoute = require('./routes/forgotpassword.route');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://TT:TT@akshay.r4q5410.mongodb.net/crm')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use combined employee routes
app.use('/api', employeeRoutes); // Now handles both /api/login and /api/signup
app.use('/api/password', passwordRoute);

app.listen(3000, () => console.log('Server running on port 3000'));
