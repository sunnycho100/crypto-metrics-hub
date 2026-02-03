import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import heatmapRoutes from './routes/heatmap.js';
import { startSessionCleanup, closeDatabase } from './services/database.js';

// Load environment variables
dotenv.config();

// Start session cleanup (database is already initialized in database.ts)
startSessionCleanup();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/heatmap', heatmapRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  closeDatabase();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Auth endpoints available at http://localhost:${PORT}/api/auth`);
  console.log(`� Heatmap endpoint: http://localhost:${PORT}/api/heatmap/liquidation-levels`);
  console.log(`💾 Database ready at: server/data/btc_metrics.db`);
  console.log(`\n✅ Backend is ready! Frontend should connect successfully.`);
});
