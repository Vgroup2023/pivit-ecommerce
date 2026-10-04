import { query } from '../config/database';
import { Product } from '../types';

export async function getProductsByTenant(tenantId: string, limit = 50, offset = 0): Promise<Product[]> {
  const result = await query(
    `SELECT * FROM products WHERE tenant_id = $1 AND is_active = true
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [tenantId, limit, offset]
  );
  return result.rows;
}

export async function getProductById(id: string, tenantId: string): Promise<Product | null> {
  const result = await query(
    'SELECT * FROM products WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );
  return result.rows[0] || null;
}

export async function createProduct(
  tenantId: string,
  name: string,
  price: number,
  description?: string,
  sku?: string,
  cost?: number,
  stockQuantity = 0,
  images: string[] = []
): Promise<Product> {
  const result = await query(
    `INSERT INTO products (tenant_id, name, price, description, sku, cost, stock_quantity, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [tenantId, name, price, description, sku, cost, stockQuantity, JSON.stringify(images)]
  );
  return result.rows[0];
}

export async function updateProduct(
  id: string,
  tenantId: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'tenant_id' && key !== 'created_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) return getProductById(id, tenantId);

  values.push(id, tenantId);

  const result = await query(
    `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function updateInventory(
  productId: string,
  tenantId: string,
  quantity: number
): Promise<boolean> {
  const result = await query(
    `UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND tenant_id = $3`,
    [quantity, productId, tenantId]
  );
  return result.rowCount! > 0;
}
