import express from 'express';
const app = express();

import authRoutes from './routes/auth.js';
import assistantRoutes from './routes/assistant.js';

import cors from 'cors';

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/upload', assistantRoutes);

export default app;
