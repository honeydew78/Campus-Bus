// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

// Import route modules
import adminRouter from './routes/admin.routes.js';
import seatRouter from './routes/seat.routes.js';
import seat2Router from './routes/seat2.routes.js';
import ticketRouter from './routes/ticket.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express application
const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: "*" ,// Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

// Middleware for parsing JSON requests
app.use(express.json({ limit: '16kb' }));

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Middleware for serving static files from 'uploads' directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware for parsing cookies
app.use(cookieParser());

// Routes
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/seats', seatRouter);
app.use('/api/v1/seat2s', seat2Router);
app.use('/api/v1/tickets', ticketRouter);

// Socket.io for handling live map tracking
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('send-location', (data) => {
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    io.emit('user-disconnected', socket.id);
  });
});

// Export the configured Express app
export { app };
