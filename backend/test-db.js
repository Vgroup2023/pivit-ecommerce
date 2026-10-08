#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run: node test-db.js
 *
 * This script tests connectivity to AWS RDS before deploying backend.
 * It will verify:
 * 1. Network connectivity to RDS endpoint
 * 2. Authentication with provided credentials
 * 3. Database accessibility
 */

const { Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'postgres',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

console.log('\n📊 Testing Database Connection...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Database: ${config.database}`);
console.log(`  User: ${config.user}`);
console.log(`  Password: ${config.password ? '***' + config.password.slice(-4) : 'NOT SET'}\n`);

const pool = new Pool(config);

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Connection Failed:\n');
    console.error(`Error: ${err.message}`);
    console.error(`Code: ${err.code}`);

    if (err.code === '28P01') {
      console.error('\n💡 Fix: Password authentication failed. Verify RDS password in AWS Console.');
    } else if (err.code === 'ENOTFOUND') {
      console.error('\n💡 Fix: Cannot reach RDS endpoint. Check host name and network connectivity.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 Fix: RDS refused connection. Check port (5432) and security groups.');
    }

    process.exit(1);
  } else {
    console.log('✅ Connection Successful!\n');
    console.log(`Server Time: ${result.rows[0].now}`);
    console.log('\n✨ Database is ready for deployment!\n');
    process.exit(0);
  }
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
  process.exit(1);
});
