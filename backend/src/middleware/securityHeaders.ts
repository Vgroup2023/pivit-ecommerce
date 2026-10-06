import { Request, Response, NextFunction } from 'express';

/**
 * Security Headers Middleware
 * Applies industry-standard security headers to all responses
 * Protects against: XSS, clickjacking, MIME sniffing, etc.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Strict-Transport-Security: Force HTTPS in production
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // X-Content-Type-Options: Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection: Legacy XSS protection header (modern browsers use CSP)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Content-Security-Policy: Restrict resource loading
  // This prevents inline scripts and restricts where resources can be loaded from
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Referrer-Policy: Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Control browser features
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  next();
}
