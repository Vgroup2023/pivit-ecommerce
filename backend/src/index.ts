import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'PIVIT Fishing E-Commerce API',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize and start server
async function start() {
  try {
    console.log('🚀 Starting PIVIT Fishing E-Commerce API...');

    // Initialize database
    const dbReady = await initializeDatabase();
    if (!dbReady) {
      throw new Error('Database initialization failed');
    }

    // Initialize Redis
    const redisReady = await initializeRedis();
    if (!redisReady) {
      console.warn('⚠️ Redis connection failed - some features may be limited');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ API running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
