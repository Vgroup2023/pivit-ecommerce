import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createOrder, getOrdersByTenant, getOrderById, updateOrderStatus, getOrderItems } from '../services/orderService';
import { requireAuth, requireAdminRole, requireTenant } from '../middleware/auth';

const router = Router();

// Get all orders (admin only)
router.get('/', requireAuth, requireAdminRole, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const orders = await getOrdersByTenant(tenantId as string, limit, offset);
    res.json({ orders, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const order = await getOrderById(req.params.id, tenantId as string);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await getOrderItems(order.id);
    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post(
  '/',
  [
    body('tenantId').notEmpty(),
    body('items').isArray({ min: 1 }),
    body('subtotal').isFloat({ min: 0 }),
    body('tax').isFloat({ min: 0 }),
    body('shipping').isFloat({ min: 0 }),
    body('total').isFloat({ min: 0 }),
    body('shippingAddress').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tenantId, customerId, items, subtotal, tax, shipping, total, shippingAddress, billingAddress } = req.body;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      const order = await createOrder(
        tenantId,
        customerId || null,
        orderNumber,
        items,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        billingAddress || shippingAddress
      );

      res.status(201).json({
        message: 'Order created successfully',
        order,
        orderNumber,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// Update order status (admin only)
router.patch(
  '/:id/status',
  requireAuth,
  requireAdminRole,
  [
    body('status').notEmpty(),
    body('trackingNumber').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tenantId } = req.query;
      const { status, trackingNumber } = req.body;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
      }

      const order = await updateOrderStatus(req.params.id, tenantId as string, status, trackingNumber);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        message: 'Order status updated',
        order,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

export default router;
