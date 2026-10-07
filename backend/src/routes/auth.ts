import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getUserByEmail, createUser, verifyPassword, getAdminRole } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }

      // Create user
      const user = await createUser(email, password, firstName, lastName);

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).email = user.email;

      res.json({
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, tenantId } = req.body;

      const user = await getUserByEmail(email);
      if (!user) {
        throw new AppError(401, 'Invalid email or password');
      }

      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid email or password');
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).email = user.email;

      // If tenant ID provided, check admin role
      if (tenantId) {
        const role = await getAdminRole(user.id, tenantId);
        (req.session as any).tenantId = tenantId;
        (req.session as any).role = role || 'customer';
      }

      res.json({
        message: 'Logged in successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail((req.session as any).email!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
