require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = 3030;
const HOSTNAME = 'localhost';
const http = require('http');

const authRoutes = require('./Routes/auth.routes');
const blogRoutes = require('./Routes/blog.routes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const server = http.createServer(app)


app.listen(process.env.PORT || 3030, HOSTNAME, () => console.log('Server running on http://localhost:3030'));

module.exports = app; // for testing
