import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import './config/cloudinary'; // Initialize Cloudinary on startup

import authRoutes from './routes/authRoutes';
import paintingRoutes from './routes/paintingRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ─── Root Route ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'KPaint API is active and ready 🎨' });
});

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
    'https://k-paint.vercel.app' // Adding your known live URL as a backup
  ].filter(Boolean) as string[],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/paintings', paintingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'KPaint API is running 🎨' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
