import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { environment } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import { securityHeaders } from './middleware/securityHeaders';

// Import routes
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';

dotenv.config();

const app: Express = express();

// Middleware (in order of importance)
app.use(securityHeaders); // Security headers (HSTS, X-Frame-Options, CSP, etc)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration (uses validated environment)
app.use(cors({
  origin: environment.frontend.url,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Session configuration (uses validated environment secrets)
app.use(session({
  secret: environment.auth.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: environment.server.nodeEnv === 'production',
    httpOnly: true,
    sameSite: 'lax',
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

    // Initialize Redis (optional - graceful degradation if not configured)
    const redisReady = await initializeRedis();
    if (!redisReady) {
      console.warn('⚠️ Redis not configured - using in-memory sessions (not suitable for production scaling)');
    }

    // Start server using validated environment configuration
    app.listen(environment.server.port, () => {
      console.log(`✓ API running on http://localhost:${environment.server.port}`);
      console.log(`✓ Environment: ${environment.server.nodeEnv}`);
      console.log(`✓ Frontend URL: ${environment.frontend.url}`);
      if (environment.redis) {
        console.log('✓ Redis: Connected');
      }
      if (environment.erp) {
        console.log('✓ ERP Integration: Configured');
      }
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;

