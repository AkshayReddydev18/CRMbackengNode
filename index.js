const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup.route.js');
const loginRoute = require('./routes/login.route.js');

const app = express();
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://TT:TT@akshay.r4q5410.mongodb.net/crm', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Use signup route
app.use('/api/signup', signupRoute);

app.use('/api/login', loginRoute);

app.listen(3000, () => console.log('Server running on port 3000'));

// `MongoDB Connected: ${conn.connection.host}`