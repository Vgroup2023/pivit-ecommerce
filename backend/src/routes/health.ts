import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database
    await pool.query('SELECT NOW()');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        api: 'ok',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
