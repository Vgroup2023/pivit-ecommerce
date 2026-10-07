import { query } from '../config/database';
import { createRefund as stripeCreateRefund } from './stripeService';

export interface RefundRequest {
  id: number;
  order_id: number;
  user_id: number;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
  requested_at: Date;
  resolved_at: Date | null;
  refund_amount: number;
  stripe_refund_id: string | null;
}

export async function createRefundRequest(
  orderId: number,
  userId: number,
  reason: string,
  description: string,
  refundAmount: number
): Promise<RefundRequest> {
  const result = await query(
    `INSERT INTO refund_requests (order_id, user_id, reason, description, status, refund_amount)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [orderId, userId, reason, description, 'pending', refundAmount]
  );
  return result.rows[0];
}

export async function getRefundRequest(refundId: number): Promise<RefundRequest | null> {
  const result = await query(
    `SELECT * FROM refund_requests WHERE id = $1`,
    [refundId]
  );
  return result.rows[0] || null;
}

export async function getOrderRefunds(orderId: number): Promise<RefundRequest[]> {
  const result = await query(
    `SELECT * FROM refund_requests
     WHERE order_id = $1
     ORDER BY requested_at DESC`,
    [orderId]
  );
  return result.rows;
}

export async function getTenantRefunds(
  tenantId: string,
  status?: string,
  limit = 50,
  offset = 0
): Promise<RefundRequest[]> {
  let sql = `
    SELECT r.* FROM refund_requests r
    JOIN orders o ON r.order_id = o.id
    WHERE o.tenant_id = $1
  `;
  const params: any[] = [tenantId];

  if (status) {
    sql += ` AND r.status = $${params.length + 1}`;
    params.push(status);
  }

  sql += ` ORDER BY r.requested_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

export async function approveRefund(refundId: number, notes?: string): Promise<RefundRequest | null> {
  const result = await query(
    `UPDATE refund_requests
     SET status = 'approved'
     WHERE id = $1
     RETURNING *`,
    [refundId]
  );
  return result.rows[0] || null;
}

export async function rejectRefund(refundId: number, reason: string): Promise<RefundRequest | null> {
  const result = await query(
    `UPDATE refund_requests
     SET status = 'rejected', resolved_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [refundId]
  );
  return result.rows[0] || null;
}

export async function processRefund(
  refundId: number,
  paymentIntentId: string
): Promise<RefundRequest | null> {
  try {
    // Create Stripe refund
    const stripeRefund = await stripeCreateRefund(paymentIntentId);

    // Update refund request with Stripe refund ID
    const result = await query(
      `UPDATE refund_requests
       SET status = 'processed',
           stripe_refund_id = $1,
           resolved_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [stripeRefund.id, refundId]
    );

    return result.rows[0] || null;
  } catch (error) {
    // Mark as failed if Stripe refund fails
    const result = await query(
      `UPDATE refund_requests
       SET status = 'failed', resolved_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [refundId]
    );
    throw error;
  }
}

export async function getRefundStats(tenantId: string) {
  const result = await query(
    `SELECT
      status,
      COUNT(*) as count,
      COALESCE(SUM(refund_amount), 0) as total_amount
    FROM refund_requests r
    JOIN orders o ON r.order_id = o.id
    WHERE o.tenant_id = $1
    GROUP BY status`,
    [tenantId]
  );

  const stats = {
    pending: { count: 0, total_amount: 0 },
    approved: { count: 0, total_amount: 0 },
    rejected: { count: 0, total_amount: 0 },
    processed: { count: 0, total_amount: 0 },
    failed: { count: 0, total_amount: 0 },
  };

  for (const row of result.rows) {
    stats[row.status as keyof typeof stats] = {
      count: parseInt(row.count),
      total_amount: parseFloat(row.total_amount),
    };
  }

  return stats;
}
