const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeelogin.route');
const passwordRoute = require('./routes/employeelogin.route');
require('dotenv').config(); 

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using .env variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', employeeRoutes); 
app.use('/api/password', passwordRoute);

app.listen(3000, () => console.log('Server running on port 3000'));
