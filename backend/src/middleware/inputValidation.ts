import { Request, Response, NextFunction } from 'express';

/**
 * Input Validation Middleware
 * Sanitizes and validates common API inputs to prevent:
 * - SQL injection
 * - XSS attacks
 * - Large payload DOS attacks
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

/**
 * Sanitize string input - remove potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove HTML/JS special chars
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 10) return {}; // Prevent deeply nested objects
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) {
    return obj.slice(0, 1000).map(item => sanitizeObject(item, depth + 1));
  }
  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

/**
 * Middleware to validate request body
 * - Sanitizes all string inputs
 * - Prevents deeply nested objects
 * - Limits field counts
 */
export function validateRequestBody(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body && typeof req.body === 'object') {
      // Count fields to prevent object expansion attacks
      const fieldCount = Object.keys(req.body).length;
      if (fieldCount > 50) {
        return res.status(400).json({
          error: 'Request has too many fields',
          maxFields: 50,
          receivedFields: fieldCount,
        });
      }

      // Sanitize all string inputs
      req.body = sanitizeObject(req.body);
    }
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid request body',
      message: error instanceof Error ? error.message : 'Parsing error',
    });
  }
}

/**
 * Validate authentication credentials
 */
export function validateCredentials(email: string, password: string): { valid: boolean; error?: string } {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Note: Password validation is optional for login (different from registration)
  // For registration, might want to enforce isValidPassword
  if (password.length < 6 || password.length > 128) {
    return { valid: false, error: 'Password must be between 6 and 128 characters' };
  }

  return { valid: true };
}

/**
 * Middleware for SQL injection prevention
 * Checks for common SQL injection patterns
 */
export function preventSQLInjection(req: Request, res: Response, next: NextFunction) {
  const sqlPatterns = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'SELECT', '--', '/*', '*/', 'xp_', 'sp_'];
  const checkString = (str: string) => {
    const upper = str.toUpperCase();
    return sqlPatterns.some(pattern => upper.includes(pattern));
  };

  const checkObject = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return checkString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some((val: any) => checkObject(val));
    }
    return false;
  };

  // Check query parameters
  if (checkObject(req.query)) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  // Check body
  if (checkObject(req.body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  next();
}

/**
 * Middleware for XSS prevention (Content-Security-Policy already set in securityHeaders)
 * This provides an additional layer of protection
 */
export function preventXSS(req: Request, res: Response, next: NextFunction) {
  const xssPatterns = ['<script', '</script>', 'javascript:', 'onerror=', 'onclick=', 'onload='];
  const checkString = (str: string) => {
    const lower = str.toLowerCase();
    return xssPatterns.some(pattern => lower.includes(pattern));
  };

  const checkObject = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return checkString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some((val: any) => checkObject(val));
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query)) {
    return res.status(400).json({ error: 'Request contains potentially malicious content' });
  }

  next();
}
