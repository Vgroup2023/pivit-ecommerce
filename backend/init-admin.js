#!/usr/bin/env node
/**
 * Database Initialization Script
 * Creates initial tenant and admin user for PIVIT Fishing
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." node init-admin.js
 *
 * Or create .env.init file with DATABASE_URL and run:
 *   node init-admin.js
 */

require('dotenv').config({ path: '.env.init' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    console.log('\n🚀 Initializing PIVIT Fishing Database...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Create tenant
    console.log('📦 Creating tenant...');
    const tenantRes = await pool.query(
      `INSERT INTO tenants (name, slug, is_active)
       VALUES ($1, $2, true)
       RETURNING id, name, slug`,
      ['PIVIT Fishing', 'pivit-fishing']
    );
    const tenant = tenantRes.rows[0];
    console.log(`   ✅ Tenant created`);
    console.log(`      ID: ${tenant.id}`);
    console.log(`      Name: ${tenant.name}`);
    console.log(`      Slug: ${tenant.slug}\n`);

    // 2. Create admin user
    console.log('👤 Creating admin user...');
    const tempPassword = 'TemporaryPassword123!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const userRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, first_name, last_name`,
      ['simplicioviegaz@gmail.com', passwordHash, 'Mario', 'Viegas']
    );
    const user = userRes.rows[0];
    console.log(`   ✅ Admin user created`);
    console.log(`      ID: ${user.id}`);
    console.log(`      Email: ${user.email}`);
    console.log(`      Name: ${user.first_name} ${user.last_name}\n`);

    // 3. Assign admin role
    console.log('🔑 Assigning admin role...');
    await pool.query(
      `INSERT INTO admin_users (tenant_id, user_id, role, is_active)
       VALUES ($1, $2, $3, true)`,
      [tenant.id, user.id, 'admin']
    );
    console.log(`   ✅ Admin role assigned\n`);

    // 4. Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ DATABASE INITIALIZED SUCCESSFULLY!\n');

    console.log('📋 LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${tempPassword}\n`);

    console.log('⚠️  IMPORTANT NEXT STEPS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   1. Login to: https://shop.pivitfishing.com/admin');
    console.log('   2. Use the credentials above');
    console.log('   3. IMMEDIATELY change your password!');
    console.log('   4. Create additional users as needed\n');

    console.log('🚀 READY TO GO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ ERROR DURING INITIALIZATION:\n');
    console.error(`   ${error.message}\n`);

    console.log('🔧 TROUBLESHOOTING:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (error.message.includes('connect')) {
      console.error('   • DATABASE_URL connection failed');
      console.error('   • Verify Supabase project is active');
      console.error('   • Check password and hostname in connection string');
    } else if (error.message.includes('relation')) {
      console.error('   • Database tables not found');
      console.error('   • Run STEP 1 migration first');
      console.error('   • Verify all 9 tables exist in Supabase');
    } else if (error.message.includes('duplicate')) {
      console.error('   • Admin user already exists');
      console.error('   • This is OK - you can login with those credentials');
    } else {
      console.error('   • Unknown error');
      console.error('   • Check the error message above');
      console.error('   • Review SETUP_STEP4_INIT_DATABASE.md');
    }

    console.error('\n📞 Need help? See SETUP_STEP4_INIT_DATABASE.md\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
