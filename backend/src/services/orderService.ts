import { query } from '../config/database';
import { Order, OrderItem } from '../types';

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
