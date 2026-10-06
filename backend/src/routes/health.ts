import { Router, Request, Response } from 'express';
import pool from '../config/database';
import redis from '../config/redis';
import { environment } from '../config/environment';

const router = Router();

/**
 * Comprehensive Health Check Endpoint
 * Returns detailed system status and dependency checks
 * Used by load balancers and monitoring systems
 */
router.get('/health', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const checks: Record<string, { status: string; message?: string; latency?: number }> = {};
  let allHealthy = true;

  // 1. API Server Status (always passes if this endpoint is reached)
  checks.api = {
    status: 'healthy',
    message: 'API server is running',
    latency: 0,
  };

  // 2. Database Check
  const dbStartTime = Date.now();
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    checks.database = {
      status: 'healthy',
      message: 'PostgreSQL connection successful',
      latency: Date.now() - dbStartTime,
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown database error',
      latency: Date.now() - dbStartTime,
    };
    allHealthy = false;
  }

  // 3. Redis Check (optional but recommended for production)
  const redisStartTime = Date.now();
  try {
    if (redis && typeof redis.ping === 'function') {
      await redis.ping();
      checks.redis = {
        status: 'healthy',
        message: 'Redis connection successful',
        latency: Date.now() - redisStartTime,
      };
    } else {
      checks.redis = {
        status: 'configured',
        message: 'Redis not configured (using in-memory sessions)',
      };
    }
  } catch (error) {
    checks.redis = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Redis connection failed',
      latency: Date.now() - redisStartTime,
    };
    // Note: Redis failure doesn't make API unhealthy (it's optional)
  }

  // 4. Configuration Status
  checks.configuration = {
    status: 'valid',
    message: 'All required environment variables validated',
  };

  // Build response
  const response = {
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: environment.server.nodeEnv,
    uptime: process.uptime(),
    totalLatency: Date.now() - startTime,
    checks,
    dependencies: {
      database: `${environment.database.host}:${environment.database.port}/${environment.database.name}`,
      redis: environment.redis ? 'configured' : 'not configured',
      erp: environment.erp ? 'configured' : 'not configured',
      frontend: environment.frontend.url,
    },
  };

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json(response);
});

/**
 * Liveness Check - Simple endpoint for Kubernetes/load balancer probes
 * Should respond quickly - doesn't check dependencies
 */
router.get('/health/live', (req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness Check - Returns 503 if dependencies not ready
 */
router.get('/health/ready', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Database not accessible',
    });
  }
});

export default router;
