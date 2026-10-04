# PIVIT Fishing E-Commerce Platform

A multi-tenant SaaS e-commerce platform built for PIVIT Fishing with progressive web app (PWA) capabilities, secure admin portal, and ERP integration.

## Project Structure

```
pivit-ecommerce/
├── backend/           # Node.js + Express API
├── frontend/          # React 18 + TypeScript PWA
├── docs/              # Documentation
└── .gitignore
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, PWA (Service Workers)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Session-based with Redis
- **Payments**: Stripe
- **Real-time**: Socket.io
- **ERP Integration**: GloblexAI Office ERP Copilot (bi-directional sync)

## Development Timeline

- **Phase 1** (Day 1-2): Core Infrastructure - Backend API, Database
- **Phase 2** (Day 2-3): Storefront - Product catalog, cart, checkout
- **Phase 3** (Day 3-5): Admin Portal - Dashboard, orders, inventory
- **Phase 4** (Day 3-5): ERP Integration - Sync worker, real-time updates
- **Phase 5** (Day 5-6): Security & PWA - Service workers, deployment

## Getting Started

See individual README files in `/backend` and `/frontend` directories.
