const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Heart Hunters API is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
