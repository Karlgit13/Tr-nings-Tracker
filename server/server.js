// Configurations and library imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Route imports
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require("./routes/loginRoutes")

// Model imports
const User = require("./models/User");

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for all domains/origins
app.use(express.json()); // Parse JSON in incoming requests

// Routes setup
app.use(userRoutes); // Mount user routes
app.use(loginRoutes)

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');

        // Start listening for requests on the specified port
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB...', err);
    });
