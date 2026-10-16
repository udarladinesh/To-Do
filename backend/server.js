import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRoutes from './routes/todoRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and enabling CORS
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Connect to MongoDB, then start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
