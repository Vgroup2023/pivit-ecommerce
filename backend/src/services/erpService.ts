import axios from 'axios';
import { query } from '../config/database';
import { Order, Product } from '../types';

const erpClient = axios.create({
  baseURL: process.env.ERP_API_URL || 'https://api.globlex.ai',
  headers: {
    Authorization: `Bearer ${process.env.ERP_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function syncOrdersToERP(tenantId: string, orders: Order[]) {
  try {
    const payload = {
      tenantId,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total,
        tax: order.tax,
        shipping: order.shipping,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      })),
    };

    await erpClient.post('/sync/orders', payload);

    // Log sync
    await query(
      `INSERT INTO erp_sync_logs (tenant_id, sync_type, status, records_synced)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, 'orders', 'completed', orders.length]
    );

    return true;
  } catch (error) {
    console.error('ERP sync error:', error);

    // Log error
    await query(
      `INSERT INTO erp_sync_logs (tenant_id, sync_type, status, error_message)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, 'orders', 'failed', error instanceof Error ? error.message : 'Unknown error']
    );

    return false;
  }
}

export async function syncInventoryToERP(tenantId: string, products: Product[]) {
  try {
    const payload = {
      tenantId,
      inventory: products.map(product => ({
        id: product.id,
        sku: product.sku,
        quantity: product.stock_quantity,
        name: product.name,
      })),
    };

    await erpClient.post('/sync/inventory', payload);

    await query(
      `INSERT INTO erp_sync_logs (tenant_id, sync_type, status, records_synced)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, 'inventory', 'completed', products.length]
    );

    return true;
  } catch (error) {
    console.error('ERP inventory sync error:', error);

    await query(
      `INSERT INTO erp_sync_logs (tenant_id, sync_type, status, error_message)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, 'inventory', 'failed', error instanceof Error ? error.message : 'Unknown error']
    );

    return false;
  }
}

export async function fetchInventoryFromERP(tenantId: string) {
  try {
    const response = await erpClient.get(`/inventory/${tenantId}`);
    return response.data;
  } catch (error) {
    console.error('ERP inventory fetch error:', error);
    throw error;
  }
}

export async function updateInventoryFromERP(tenantId: string, sku: string, quantity: number) {
  try {
    const payload = { sku, quantity };
    await erpClient.post(`/sync/inventory/${tenantId}`, payload);
    return true;
  } catch (error) {
    console.error('ERP inventory update error:', error);
    return false;
  }
}

export function getERPClient() {
  return erpClient;
}
