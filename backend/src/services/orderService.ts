import { query } from '../config/database';
import { Order, OrderItem } from '../types';

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: string;
  changed_at: Date;
  updated_by: number | null;
  notes: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  order_id: number | null;
  type: string;
  title: string;
  message: string;
  sent_at: Date;
  read_at: Date | null;
}

export async function createOrder(
  tenantId: string,
  customerId: string | null,
  orderNumber: string,
  items: any[],
  subtotal: number,
  tax: number,
  shipping: number,
  total: number,
  shippingAddress: any,
  billingAddress: any
): Promise<Order> {
  const result = await query(
    `INSERT INTO orders (tenant_id, customer_id, order_number, status, subtotal, tax, shipping, total, shipping_address, billing_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [tenantId, customerId, orderNumber, 'pending', subtotal, tax, shipping, total, JSON.stringify(shippingAddress), JSON.stringify(billingAddress)]
  );

  const order = result.rows[0];

  // Insert order items
  for (const item of items) {
    await query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, item.product_id, item.quantity, item.unit_price, item.total_price]
    );
  }

  // Create initial status history entry
  await createStatusHistory(order.id, 'pending', null, 'Order created');

  return order;
}

export async function getOrdersByTenant(tenantId: string, limit = 50, offset = 0): Promise<Order[]> {
  const result = await query(
    `SELECT * FROM orders WHERE tenant_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [tenantId, limit, offset]
  );
  return result.rows;
}

export async function getOrderById(id: string, tenantId: string): Promise<Order | null> {
  const result = await query(
    'SELECT * FROM orders WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );
  return result.rows[0] || null;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const result = await query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );
  return result.rows;
}

export async function updateOrderStatus(
  orderId: string,
  tenantId: string,
  status: string,
  trackingNumber?: string
): Promise<Order | null> {
  const result = await query(
    `UPDATE orders SET status = $1, tracking_number = COALESCE($2, tracking_number), updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 AND tenant_id = $4
     RETURNING *`,
    [status, trackingNumber || null, orderId, tenantId]
  );
  return result.rows[0] || null;
}

export async function getOrdersByCustomer(customerId: string, tenantId: string): Promise<Order[]> {
  const result = await query(
    `SELECT * FROM orders WHERE customer_id = $1 AND tenant_id = $2
     ORDER BY created_at DESC`,
    [customerId, tenantId]
  );
  return result.rows;
}

export async function getOrdersByStatus(tenantId: string, status: string): Promise<Order[]> {
  const result = await query(
    `SELECT * FROM orders WHERE tenant_id = $1 AND status = $2
     ORDER BY created_at DESC`,
    [tenantId, status]
  );
  return result.rows;
}

// ===== Phase 2: Status History & Tracking =====

export async function createStatusHistory(
  orderId: number,
  status: string,
  updatedBy: number | null = null,
  notes: string | null = null
): Promise<OrderStatusHistory> {
  const result = await query(
    `INSERT INTO order_status_history (order_id, status, updated_by, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [orderId, status, updatedBy, notes]
  );
  return result.rows[0];
}

export async function getOrderStatusHistory(orderId: number): Promise<OrderStatusHistory[]> {
  const result = await query(
    `SELECT * FROM order_status_history
     WHERE order_id = $1
     ORDER BY changed_at DESC`,
    [orderId]
  );
  return result.rows;
}

export async function updateOrderStatusWithHistory(
  orderId: string,
  tenantId: string,
  newStatus: string,
  updatedBy: number | null = null,
  notes: string | null = null,
  trackingNumber?: string,
  shippedDate?: Date,
  deliveryDate?: Date,
  shippingMethod?: string,
  shippingCost?: number
): Promise<Order | null> {
  // Update main order table
  const updateParams = [newStatus, trackingNumber || null, shippedDate || null, deliveryDate || null, shippingMethod || null, shippingCost || null, orderId, tenantId];

  const result = await query(
    `UPDATE orders
     SET status = $1,
         tracking_number = COALESCE($2, tracking_number),
         shipped_date = COALESCE($3, shipped_date),
         delivery_date = COALESCE($4, delivery_date),
         shipping_method = COALESCE($5, shipping_method),
         shipping_cost = COALESCE($6, shipping_cost),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $7 AND tenant_id = $8
     RETURNING *`,
    updateParams
  );

  if (result.rows.length === 0) {
    return null;
  }

  // Create status history record
  await createStatusHistory(parseInt(orderId), newStatus, updatedBy, notes);

  return result.rows[0];
}

// ===== Phase 2: Notifications =====

export async function createNotification(
  userId: number,
  orderId: number | null,
  type: string,
  title: string,
  message: string
): Promise<Notification> {
  const result = await query(
    `INSERT INTO notifications (user_id, order_id, type, title, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, orderId, type, title, message]
  );
  return result.rows[0];
}

export async function getUserNotifications(
  userId: number,
  limit = 50,
  offset = 0,
  unreadOnly = false
): Promise<Notification[]> {
  let sql = `SELECT * FROM notifications WHERE user_id = $1`;
  const params: any[] = [userId];

  if (unreadOnly) {
    sql += ` AND read_at IS NULL`;
  }

  sql += ` ORDER BY sent_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification | null> {
  const result = await query(
    `UPDATE notifications
     SET read_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [notificationId]
  );
  return result.rows[0] || null;
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) as count FROM notifications
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
  return parseInt(result.rows[0].count) || 0;
}
