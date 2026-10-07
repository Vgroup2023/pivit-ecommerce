import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { environment } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import { securityHeaders } from './middleware/securityHeaders';
import { structuredLogger, errorLogger, logStartup, logShutdown } from './middleware/structuredLogger';
import { validateRequestBody, preventSQLInjection, preventXSS } from './middleware/inputValidation';

// Import routes
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import refundsRouter from './routes/refunds';

dotenv.config();

const app: Express = express();

// Middleware (order matters - first in chain processes first)
// 1. Security headers first (affects all responses)
app.use(securityHeaders);

// 2. Structured logging (logs all requests)
app.use(structuredLogger);

// 3. Parse request body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Input validation and sanitization (before business logic)
app.use(validateRequestBody);
app.use(preventSQLInjection);
app.use(preventXSS);

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
app.use('/api/refunds', refundsRouter);

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

// Structured error logging (captures uncaught errors)
app.use(errorLogger);

// 404 handler (after all routes and error handlers)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize and start server
async function start() {
  try {
    logStartup();

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
    const server = app.listen(environment.server.port, () => {
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

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logShutdown('SIGTERM signal received');
      server.close(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logShutdown('SIGINT signal received');
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    logShutdown(`Startup error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

start();

export default app;

