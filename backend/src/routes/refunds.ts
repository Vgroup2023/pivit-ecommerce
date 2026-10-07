import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  createRefundRequest,
  getRefundRequest,
  getOrderRefunds,
  getTenantRefunds,
  approveRefund,
  rejectRefund,
  processRefund,
  getRefundStats,
} from '../services/refundService';
import { getOrderById } from '../services/orderService';
import { requireAuth, requireAdminRole } from '../middleware/auth';

const router = Router();

// Create refund request (customer)
router.post(
  '/',
  requireAuth,
  [
    body('orderId').isInt({ min: 1 }),
    body('reason').notEmpty().trim(),
    body('description').optional().trim(),
    body('refundAmount').isFloat({ min: 0.01 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { orderId, reason, description, refundAmount } = req.body;

      // Verify order exists and belongs to user
      const order = await getOrderById(orderId.toString(), (req.session as any)?.tenantId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Verify order is eligible for refund (not already cancelled/refunded)
      const refundableStatuses = ['delivered', 'paid', 'processing', 'shipped'];
      if (!refundableStatuses.includes(order.status)) {
        return res.status(400).json({ error: `Order with status '${order.status}' is not eligible for refund` });
      }

      // Verify refund amount doesn't exceed order total
      if (refundAmount > order.total) {
        return res.status(400).json({ error: `Refund amount cannot exceed order total (${order.total})` });
      }

      const refundRequest = await createRefundRequest(
        parseInt(orderId),
        parseInt(userId),
        reason,
        description || '',
        refundAmount
      );

      res.status(201).json({
        message: 'Refund request created',
        refund_request: refundRequest,
      });
    } catch (error) {
      console.error('Error creating refund request:', error);
      res.status(500).json({ error: 'Failed to create refund request' });
    }
  }
);

// Get refund request details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const refundId = parseInt(req.params.id);
    const refundRequest = await getRefundRequest(refundId);

    if (!refundRequest) {
      return res.status(404).json({ error: 'Refund request not found' });
    }

    res.json({ refund_request: refundRequest });
  } catch (error) {
    console.error('Error fetching refund request:', error);
    res.status(500).json({ error: 'Failed to fetch refund request' });
  }
});

// Get order refunds
router.get('/order/:orderId', requireAuth, async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const refunds = await getOrderRefunds(orderId);

    res.json({ order_id: orderId, refunds });
  } catch (error) {
    console.error('Error fetching order refunds:', error);
    res.status(500).json({ error: 'Failed to fetch order refunds' });
  }
});

// Get tenant refunds (admin only)
router.get('/', requireAuth, requireAdminRole, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const status = (req.query.status as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const refunds = await getTenantRefunds(tenantId as string, status, limit, offset);
    const stats = await getRefundStats(tenantId as string);

    res.json({ refunds, stats, limit, offset });
  } catch (error) {
    console.error('Error fetching tenant refunds:', error);
    res.status(500).json({ error: 'Failed to fetch tenant refunds' });
  }
});

// Approve refund (admin only)
router.patch(
  '/:id/approve',
  requireAuth,
  requireAdminRole,
  [body('notes').optional().trim()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const refundId = parseInt(req.params.id);
      const { notes } = req.body;

      const refundRequest = await approveRefund(refundId, notes);
      if (!refundRequest) {
        return res.status(404).json({ error: 'Refund request not found' });
      }

      res.json({
        message: 'Refund request approved',
        refund_request: refundRequest,
      });
    } catch (error) {
      console.error('Error approving refund:', error);
      res.status(500).json({ error: 'Failed to approve refund' });
    }
  }
);

// Reject refund (admin only)
router.patch(
  '/:id/reject',
  requireAuth,
  requireAdminRole,
  [body('reason').notEmpty().trim()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const refundId = parseInt(req.params.id);
      const { reason } = req.body;

      const refundRequest = await rejectRefund(refundId, reason);
      if (!refundRequest) {
        return res.status(404).json({ error: 'Refund request not found' });
      }

      res.json({
        message: 'Refund request rejected',
        refund_request: refundRequest,
      });
    } catch (error) {
      console.error('Error rejecting refund:', error);
      res.status(500).json({ error: 'Failed to reject refund' });
    }
  }
);

// Process refund (charge Stripe) - admin only
router.post(
  '/:id/process',
  requireAuth,
  requireAdminRole,
  [body('paymentIntentId').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const refundId = parseInt(req.params.id);
      const { paymentIntentId } = req.body;

      const refundRequest = await processRefund(refundId, paymentIntentId);
      if (!refundRequest) {
        return res.status(404).json({ error: 'Refund request not found' });
      }

      res.json({
        message: 'Refund processed successfully',
        refund_request: refundRequest,
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ error: 'Failed to process refund' });
    }
  }
);

export default router;
