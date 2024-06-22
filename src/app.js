// Import necessary modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import route modules
import adminRouter from './routes/admin.routes.js';
import newTraineeRouter from './routes/newTrainee.routes.js';
import currentTraineeRouter from './routes/currentTrainee.routes.js';
import pastTraineeRouter from './routes/pastTrainee.routes.js';

// Initialize Express application
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

// Middleware for parsing JSON requests
app.use(express.json({ limit: '16kb' }));

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Middleware for serving static files from 'public' directory
app.use(express.static('public'));

// Middleware for parsing cookies
app.use(cookieParser());

// Routes
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/newTrainees', newTraineeRouter);
app.use('/api/v1/currentTrainees', currentTraineeRouter);
app.use('/api/v1/pastTrainees', pastTraineeRouter);

// Export the configured Express app
export { app };
