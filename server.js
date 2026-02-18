require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = 3030;
const HOSTNAME = 'localhost';
const http = require('http');
const bodyParser = require('body-parser');

const authRoutes = require('./Routes/auth.routes');
const blogRoutes = require('./Routes/blog.routes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.use(authRoutes);
// app.use('/api/blogs', blogRoutes);

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure this directory exists and contains your EJS templates.

// Body parser to handle form data
app.use(express.static('public')); // serve static files from the 'public' directory
// app.use(express.bodyparser({ extended: true}))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve Login Page
app.get('/', (req, res) => {
    res.render('login', { message: 'You are welcome, this is G-blog login page!' }); // Pass empty message initially
});

// Handle Login POST
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    // Add authentication logic here
    res.render('login', { message: 'Login attempt received' });
});

// app.get('/', (req, res) => {
//   res.send('welcome to the bloggong API')
// })

const server = http.createServer(app)


app.listen(process.env.PORT || 3030, HOSTNAME, () => console.log('Server running on http://localhost:3030'));

module.exports = app; // for testing
