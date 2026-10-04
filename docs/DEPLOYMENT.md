# PIVIT Fishing E-Commerce - Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Domain name
- SSL certificate
- Stripe account (for payments)

## Local Development Setup

### 1. Database Setup

#### Using Supabase (Recommended for MVP)
```bash
# Create Supabase project
# Copy DATABASE_URL from project settings

# In backend/.env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

#### Local PostgreSQL
```bash
# Create database
createdb pivit_ecommerce

# Run migrations
psql pivit_ecommerce < backend/src/migrations/001_init.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Configure environment
# Edit .env with your settings

# Start dev server
npm run dev
```

Server runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Configure API URL
# VITE_API_URL=http://localhost:3001

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment
# Set VITE_API_URL to production backend URL
```

**Vercel Project Settings:**
- Framework: Vite
- Build: `npm run build`
- Output: `dist`
- Environment: Add `VITE_API_URL` and `VITE_STRIPE_PUBLIC_KEY`

#### Domain Configuration
```bash
# Add domain in Vercel settings
# Update CNAME records with Vercel DNS
```

### Option 2: AWS EC2 + RDS (Full Stack)

#### Prerequisites
- AWS account
- EC2 instance (t3.small minimum)
- RDS PostgreSQL instance
- ElastiCache Redis (optional)

#### Backend Deployment

**1. Create EC2 Instance**
```bash
# Ubuntu 22.04 LTS recommended
# Security group: Allow 3001 (API), 443 (HTTPS), 22 (SSH)
```

**2. SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

**3. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

**4. Deploy Backend**
```bash
# Clone repository
git clone <repo-url> /home/ubuntu/pivit-ecommerce
cd /home/ubuntu/pivit-ecommerce/backend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Configure production environment
nano .env
```

**5. Start with PM2**
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "pivit-api" -- start

# Save PM2 config
pm2 save

# Setup startup
pm2 startup
```

**6. Configure Nginx**
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/pivit-api

# Add:
server {
  server_name api.pivitfishing.com;
  
  location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pivit-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**7. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d api.pivitfishing.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### Frontend Deployment

**1. Build Frontend**
```bash
cd /home/ubuntu/pivit-ecommerce/frontend
npm install
npm run build
```

**2. Serve with Nginx**
```bash
# Copy build to web root
sudo cp -r dist /var/www/pivit-fishing

# Create Nginx config
sudo nano /etc/nginx/sites-available/pivit-fishing

# Add:
server {
  server_name pivitfishing.com www.pivitfishing.com;
  root /var/www/pivit-fishing;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api/ {
    proxy_pass https://api.pivitfishing.com;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

# Enable and test
sudo ln -s /etc/nginx/sites-available/pivit-fishing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Docker (Containerized)

#### Create Docker Files

**Backend Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pivit_ecommerce
      POSTGRES_USER: pivit
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://pivit:${DB_PASSWORD}@postgres:5432/pivit_ecommerce
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

#### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Environment Configuration

### Production .env (Backend)

```env
# Server
NODE_ENV=production
PORT=3001
API_URL=https://api.pivitfishing.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://host:6379

# Session
SESSION_SECRET=your-very-long-random-secret-string

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ERP
ERP_API_URL=https://api.globlex.ai
ERP_API_KEY=your-api-key
ERP_SYNC_INTERVAL=300000

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# CORS
FRONTEND_URL=https://pivitfishing.com
```

### Production .env (Frontend)

```env
VITE_API_URL=https://api.pivitfishing.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
VITE_APP_NAME=PIVIT Fishing
VITE_APP_URL=https://pivitfishing.com
```

## Database Migrations

### Running Migrations
```bash
# Local
psql pivit_ecommerce < backend/src/migrations/001_init.sql

# Production (with backup first)
pg_dump -h host -U user database > backup.sql
psql -h host -U user database < backend/src/migrations/001_init.sql
```

## Monitoring & Maintenance

### Health Checks
```bash
# API health
curl https://api.pivitfishing.com/api/health

# Frontend (check if loads)
curl https://pivitfishing.com
```

### Log Rotation
```bash
# PM2
pm2 install pm2-logrotate

# Nginx
sudo nano /etc/logrotate.d/nginx
```

### Backups
```bash
# Daily database backup
0 2 * * * pg_dump -h host -U user database | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Upload to S3
0 3 * * * aws s3 sync /backups/ s3://your-bucket/backups/
```

### Monitoring Tools (Recommended)
- **Uptime**: StatusPage.io, Pingdom
- **Errors**: Sentry
- **Performance**: Datadog, New Relic
- **Logs**: CloudWatch, Stackdriver

## Troubleshooting

### API Connection Issues
```bash
# Test backend
curl http://localhost:3001/api/health

# Check environment
pm2 show pivit-api

# View logs
pm2 logs pivit-api
```

### Database Connection Issues
```bash
# Test connection
psql -h host -U user -d database

# Check variables
echo $DATABASE_URL
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew --dry-run

# Check expiration
sudo certbot certificates
```

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Firewall configured (allow only necessary ports)
- [ ] Database backups enabled
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] API keys rotated
- [ ] Session secret changed
- [ ] Monitoring enabled
- [ ] Log retention configured
- [ ] Disaster recovery plan documented

## Post-Launch Steps

1. **DNS Configuration**
   - Update A records to point to production server
   - Configure SSL certificates

2. **Initial Data**
   - Create tenant account
   - Add initial products
   - Test checkout flow

3. **User Communication**
   - Update website with new store URL
   - Email existing customers
   - Social media announcement

4. **Monitoring Setup**
   - Configure alerts
   - Set up dashboards
   - Plan maintenance windows

5. **Documentation**
   - Update runbooks
   - Document admin procedures
   - Create troubleshooting guide
