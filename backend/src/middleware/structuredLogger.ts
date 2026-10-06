import { Request, Response, NextFunction } from 'express';
import { environment } from '../config/environment';

/**
 * Structured Logging Middleware
 * Logs all requests and responses in JSON format for better debugging and monitoring
 * Integrates with logging platforms (ELK, Datadog, Splunk, CloudWatch, etc.)
 */

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  method: string;
  path: string;
  statusCode?: number;
  duration: number;
  requestId: string;
  userId?: string | number;
  message: string;
  error?: {
    message: string;
    stack?: string;
  };
  ip: string;
  userAgent?: string;
  environment: string;
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get client IP address from request
 */
function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  ).trim();
}

/**
 * Log entry at specified level
 */
function log(entry: LogEntry) {
  const logMethod = console[entry.level.toLowerCase() as 'info' | 'warn' | 'error' | 'debug'] || console.log;
  logMethod(JSON.stringify(entry));
}

/**
 * Request/Response logging middleware
 */
export function structuredLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const ip = getClientIp(req);

  // Attach request ID to request object for use in handlers
  (req as any).requestId = requestId;

  // Log incoming request
  if (environment.server.nodeEnv === 'development') {
    log({
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      method: req.method,
      path: req.path,
      requestId,
      message: `Incoming ${req.method} request`,
      ip,
      userAgent: req.get('user-agent'),
      duration: 0,
      environment: environment.server.nodeEnv,
    });
  }

  // Capture the response
  const originalSend = res.send;

  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Determine log level based on status code
    let level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' = 'INFO';
    if (statusCode >= 400 && statusCode < 500) level = 'WARN';
    if (statusCode >= 500) level = 'ERROR';

    // Log response
    log({
      timestamp: new Date().toISOString(),
      level,
      method: req.method,
      path: req.path,
      statusCode,
      requestId,
      message: `${req.method} ${req.path} ${statusCode}`,
      duration,
      ip,
      userAgent: req.get('user-agent'),
      environment: environment.server.nodeEnv,
    });

    // Call original send
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Error logging middleware
 * Should be used as the last middleware
 */
export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = (req as any).requestId || 'unknown';
  const duration = (Date.now() as any) - ((req as any).startTime || Date.now());

  const errorEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500,
    requestId,
    message: err.message || 'Unhandled error',
    duration,
    ip: getClientIp(req),
    environment: environment.server.nodeEnv,
    error: {
      message: err.message,
      stack: environment.server.nodeEnv === 'development' ? err.stack : undefined,
    },
  };

  log(errorEntry);

  // Pass to next error handler if exists
  next(err);
}

/**
 * Log application startup info
 */
export function logStartup() {
  log({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    method: 'N/A',
    path: 'N/A',
    requestId: 'startup',
    message: '🚀 PIVIT E-Commerce API Starting',
    duration: 0,
    ip: 'internal',
    environment: environment.server.nodeEnv,
  });

  log({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    method: 'N/A',
    path: 'N/A',
    requestId: 'startup',
    message: `Environment: ${environment.server.nodeEnv} | Port: ${environment.server.port} | Database: ${environment.database.host}`,
    duration: 0,
    ip: 'internal',
    environment: environment.server.nodeEnv,
  });
}

/**
 * Log shutdown info
 */
export function logShutdown(reason: string) {
  log({
    timestamp: new Date().toISOString(),
    level: 'WARN',
    method: 'N/A',
    path: 'N/A',
    requestId: 'shutdown',
    message: `🛑 PIVIT E-Commerce API Shutting down: ${reason}`,
    duration: 0,
    ip: 'internal',
    environment: environment.server.nodeEnv,
  });
}
