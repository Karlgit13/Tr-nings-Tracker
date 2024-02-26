// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const registerHandler = require('./register');
const loginHandler = require('./login');

const loginRoutes = require("./loginRoutes");
const userRoutes = require("./userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

let db;

const connectToDatabase = async () => {
    if (db) return db;
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db();
    return db;
};

app.use(cors());
app.use(express.json());
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);

app.use(async (req, res, next) => {
    req.db = await connectToDatabase();
    next();
});

app.use(userRoutes);
app.use(loginRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
