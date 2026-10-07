import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  createOrder,
  getOrdersByTenant,
  getOrderById,
  updateOrderStatus,
  getOrderItems,
  getOrderStatusHistory,
  updateOrderStatusWithHistory,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount
} from '../services/orderService';
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
    body('shippedDate').optional().isISO8601(),
    body('deliveryDate').optional().isISO8601(),
    body('shippingMethod').optional().trim(),
    body('shippingCost').optional().isFloat({ min: 0 }),
    body('notes').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tenantId } = req.query;
      const { status, trackingNumber, shippedDate, deliveryDate, shippingMethod, shippingCost, notes } = req.body;
      const userId = (req.session as any)?.userId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
      }

      const order = await updateOrderStatusWithHistory(
        req.params.id,
        tenantId as string,
        status,
        userId ? parseInt(userId) : null,
        notes,
        trackingNumber,
        shippedDate ? new Date(shippedDate) : undefined,
        deliveryDate ? new Date(deliveryDate) : undefined,
        shippingMethod,
        shippingCost ? parseFloat(shippingCost) : undefined
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Create notification for customer
      if (order.customer_id) {
        const notificationMessages: Record<string, { title: string; message: string }> = {
          'pending': { title: 'Order Received', message: 'Your order has been received and is being prepared.' },
          'processing': { title: 'Processing', message: 'Your order is being processed.' },
          'shipped': { title: 'Shipped', message: `Your order has been shipped. Tracking: ${trackingNumber || 'N/A'}` },
          'delivered': { title: 'Delivered', message: 'Your order has been delivered. Thank you for your purchase!' },
          'cancelled': { title: 'Cancelled', message: 'Your order has been cancelled.' },
          'refunded': { title: 'Refunded', message: 'Your refund has been processed.' },
        };

        const notification = notificationMessages[status];
        if (notification && order.customer_id) {
          await createNotification(
            parseInt(order.customer_id),
            parseInt(order.id),
            'order_status',
            notification.title,
            notification.message
          );
        }
      }

      res.json({
        message: 'Order status updated',
        order,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

// ===== Phase 2: Status History & Tracking =====

// Get order status history
router.get('/:id/status-history', requireAuth, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    // Verify order belongs to tenant
    const order = await getOrderById(req.params.id, tenantId as string);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const history = await getOrderStatusHistory(parseInt(req.params.id));
    res.json({ order_id: req.params.id, status_history: history });
  } catch (error) {
    console.error('Error fetching status history:', error);
    res.status(500).json({ error: 'Failed to fetch status history' });
  }
});

// ===== Phase 2: Notifications =====

// Get user notifications
router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';

    const notifications = await getUserNotifications(parseInt(userId), limit, offset, unreadOnly);
    const unreadCount = await getUnreadNotificationCount(parseInt(userId));

    res.json({ notifications, unread_count: unreadCount, limit, offset });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread notification count
router.get('/notifications/unread/count', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const count = await getUnreadNotificationCount(parseInt(userId));
    res.json({ unread_count: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark notification as read
router.patch(
  '/notifications/:id/read',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await markNotificationAsRead(notificationId);

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }
);

export default router;
