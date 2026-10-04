import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { User } from '../types';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, passwordHash, firstName, lastName]
  );
  return result.rows[0];
}

export async function getAdminRole(userId: string, tenantId: string) {
  const result = await query(
    `SELECT role FROM admin_users
     WHERE user_id = $1 AND tenant_id = $2 AND is_active = true`,
    [userId, tenantId]
  );
  return result.rows[0]?.role || null;
}

export async function assignAdminRole(
  userId: string,
  tenantId: string,
  role: 'admin' | 'fulfillment' | 'finance' | 'viewer'
): Promise<boolean> {
  const result = await query(
    `INSERT INTO admin_users (user_id, tenant_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = $3
     RETURNING id`,
    [userId, tenantId, role]
  );
  return !!result.rows[0];
}
