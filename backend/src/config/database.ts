import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Parse database connection config from environment variables.
 * Supports both DATABASE_URL and individual parameter env vars.
 * Handles special characters in passwords properly by using decodeURIComponent.
 */
function parseConnectionConfig(): { user: string; password: string; host: string; port: number; database: string } {
  const databaseUrl = process.env.DATABASE_URL;

  // Option 1: Use individual environment variables (most reliable)
  if (process.env.DATABASE_HOST && process.env.DATABASE_USER) {
    console.log('✓ Using individual DATABASE_* environment variables');
    return {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD || '',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'pivit_ecommerce',
    };
  }

  // Option 2: Parse DATABASE_URL
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL or DATABASE_HOST not set');
    process.exit(1);
  }

  if (!databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('postgresql://')) {
    console.error('❌ Invalid DATABASE_URL format. Must start with postgres:// or postgresql://');
    console.error('❌ First 50 chars:', databaseUrl.substring(0, 50));
    process.exit(1);
  }

  console.log('✓ Parsing DATABASE_URL:', databaseUrl.substring(0, 50) + '...[REDACTED]');

  try {
    // Parse URL carefully, handling special characters in password
    const url = new URL(databaseUrl);

    // Decode username and password in case they contain special characters
    // (they should be URL-encoded in the connection string)
    const user = decodeURIComponent(url.username || 'postgres');
    const password = decodeURIComponent(url.password || '');
    const host = url.hostname || 'localhost';
    const port = url.port ? parseInt(url.port) : 5432;
    const database = url.pathname.slice(1) || 'pivit_ecommerce'; // Remove leading /

    console.log('✓ Database URL parsed successfully');
    console.log(`✓ Connecting to ${user}@${host}:${port}/${database}`);

    return { user, password, host, port, database };
  } catch (e) {
    console.error('❌ Failed to parse DATABASE_URL:', (e as Error).message);
    console.error('Ensure PASSWORD contains URL-encoded special characters:');
    console.error('  ! → %21');
    console.error('  # → %23');
    console.error('  : → %3A');
    console.error('  @ → %40');
    process.exit(1);
  }
}

const connectionConfig = parseConnectionConfig();

const pool = new Pool({
  ...connectionConfig,
  ssl: {
    rejectUnauthorized: false, // AWS RDS uses self-signed certificates
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

export async function initializeDatabase() {
  try {
    // Test connection
    const result = await query('SELECT NOW()');
    console.log('✓ Database connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

export default pool;
