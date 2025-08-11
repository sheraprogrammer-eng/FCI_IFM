const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const database = require('./config/database');
const insuranceRoutes = require('./routes/insuranceRoutes');

const app = express();
const PORT = process.env.PORT || 8888;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/insurance', insuranceRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/confirmation.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Initialize database connection and start server
async function startServer() {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Frontend: http://localhost:${PORT}`);
            console.log(`API: http://localhost:${PORT}/api/insurance`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await database.close();
    process.exit(0);
});

startServer();