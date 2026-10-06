import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable validation and configuration
 * Runs at startup to catch missing or invalid configuration early
 * Provides helpful error messages for deployment issues
 */

interface EnvironmentConfig {
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    url?: string;
  };
  server: {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
  };
  auth: {
    jwtSecret: string;
    sessionSecret: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret?: string;
  };
  redis?: {
    url: string;
  };
  frontend: {
    url: string;
  };
  erp?: {
    apiUrl: string;
    apiKey: string;
  };
}

/**
 * Validate and parse environment variables
 * Throws descriptive errors if configuration is invalid
 */
export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = [];

  // Required database configuration
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasDatabaseHost = !!process.env.DATABASE_HOST;
  const hasDatabaseUser = !!process.env.DATABASE_USER;

  if (!hasDatabaseUrl && !hasDatabaseHost) {
    errors.push(
      'Missing database configuration. Provide either:\n' +
      '  - DATABASE_URL (complete connection string), OR\n' +
      '  - DATABASE_HOST + DATABASE_USER + DATABASE_PASSWORD + DATABASE_PORT + DATABASE_NAME\n' +
      'See .env.example for details.'
    );
  }

  if (hasDatabaseHost && !hasDatabaseUser) {
    errors.push('DATABASE_HOST is set but DATABASE_USER is missing. Both are required for Option A.');
  }

  // Required authentication
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    errors.push(
      'JWT_SECRET is missing or too short (minimum 32 characters).\n' +
      'Generate with: openssl rand -hex 32'
    );
  }

  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    errors.push(
      'SESSION_SECRET is missing or too short (minimum 32 characters).\n' +
      'Generate with: openssl rand -hex 32'
    );
  }

  // Required Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push(
      'STRIPE_SECRET_KEY is missing.\n' +
      'Get it from: https://dashboard.stripe.com/apikeys'
    );
  }

  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    errors.push(
      'STRIPE_PUBLISHABLE_KEY is missing.\n' +
      'Get it from: https://dashboard.stripe.com/apikeys'
    );
  }

  // Required frontend URL
  if (!process.env.FRONTEND_URL) {
    errors.push(
      'FRONTEND_URL is missing.\n' +
      'Set to your deployed frontend URL (e.g., https://shop.pivitfishing.com)'
    );
  }

  // Throw all errors at once
  if (errors.length > 0) {
    console.error('❌ ENVIRONMENT CONFIGURATION ERRORS:\n');
    errors.forEach((error, index) => {
      console.error(`${index + 1}. ${error}\n`);
    });
    process.exit(1);
  }

  // Parse environment variables with type safety
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const port = parseInt(process.env.PORT || '3001', 10);

  const config: EnvironmentConfig = {
    database: {
      host: process.env.DATABASE_HOST || '',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      user: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASSWORD || '',
      name: process.env.DATABASE_NAME || 'pivit_ecommerce',
      url: process.env.DATABASE_URL,
    },
    server: {
      port,
      nodeEnv,
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET!,
      sessionSecret: process.env.SESSION_SECRET!,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    frontend: {
      url: process.env.FRONTEND_URL!,
    },
  };

  // Optional Redis configuration
  if (process.env.REDIS_URL) {
    config.redis = {
      url: process.env.REDIS_URL,
    };
  }

  // Optional ERP configuration
  if (process.env.ERP_API_URL && process.env.ERP_API_KEY) {
    config.erp = {
      apiUrl: process.env.ERP_API_URL,
      apiKey: process.env.ERP_API_KEY,
    };
  }

  // Log successful validation
  console.log('✅ Environment configuration validated successfully');
  console.log(`   Environment: ${nodeEnv}`);
  console.log(`   Database: ${config.database.url ? 'PostgreSQL (URL)' : `${config.database.host}:${config.database.port}/${config.database.name}`}`);
  console.log(`   Frontend URL: ${config.frontend.url}`);
  if (config.redis) console.log('   Redis: Configured');
  if (config.erp) console.log('   ERP: Configured');

  return config;
}

// Export singleton instance
export const environment = validateEnvironment();
export default environment;
