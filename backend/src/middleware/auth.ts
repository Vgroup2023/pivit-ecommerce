import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
  next();
}

export function requireAdminRole(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }

  if (!['admin', 'fulfillment', 'finance'].includes((req.session as any).role || '')) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req.session as any).userId) {
      return res.status(401).json({ error: 'Unauthorized - Please log in' });
    }

    if (!allowedRoles.includes((req.session as any).role || '')) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }

    next();
  };
}

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }
  next();
}
