# PIVIT Fishing E-Commerce Frontend

React 18 + TypeScript progressive web app for the PIVIT Fishing e-commerce platform.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:3001`

## Build for Production
```bash
npm run build
npm run preview
```

## Features

### ✓ Progressive Web App (PWA)
- Service worker for offline support
- Installable on mobile, tablet, and desktop
- Offline fallback pages
- Background sync for pending orders
- Push notification support

### ✓ Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for phones, tablets, and desktops
- Touch-friendly interface

### ✓ Customer Features
- Product catalog with search and filtering
- Shopping cart with persistent storage
- Checkout process with shipping address
- Order tracking
- Account management

### ✓ Admin Portal
- Dashboard with key metrics
- Order management and status tracking
- Inventory management
- Customer and product analytics
- ERP integration status monitoring

### ✓ Authentication
- Secure login and registration
- Session-based authentication
- Role-based access control
- Multi-tenant support

### ✓ State Management
- Zustand for lightweight state management
- Persistent cart storage
- Authentication state

## Project Structure

```
frontend/
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── service-worker.js     # Service worker
│   └── offline.html          # Offline fallback
├── src/
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   ├── api/                 # API client
│   ├── store/               # Zustand stores
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind configuration
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Service Workers** - Offline support

## PWA Installation

Users can install PIVIT Fishing on:
- **Mobile**: Add to home screen via browser menu
- **Desktop**: Install button in header (Chrome/Edge)
- **Tablet**: Add to home screen or install

## Offline Capabilities

- Cached product pages
- Offline shopping cart
- Pending order queue
- Offline error pages
- Background sync when connection restored

## Development Tips

### Hot Module Replacement
Changes to files automatically reload the dev server without losing state.

### Local API Testing
The dev server proxies `/api/*` requests to the backend at `http://localhost:3001`.

### Browser DevTools
- React Developer Tools extension
- Redux DevTools (compatible with Zustand)
- Service Worker debugging in Chrome DevTools

## Building for Production

```bash
npm run build
```

Output goes to `dist/` directory. Files can be deployed to:
- Static hosting (Vercel, Netlify, GitHub Pages)
- Traditional web servers (Apache, Nginx)
- Cloud storage (S3, Azure Blob)

## Environment Variables

See `.env.example` for all available options:

- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe API key (future use)
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Frontend URL

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Verify HTTPS in production
- Clear browser cache and reload

### Offline Features Not Working
- Enable service workers in browser
- Check browser storage permissions
- Verify IndexedDB support

### API Calls Failing
- Ensure backend is running on port 3001
- Check CORS configuration in backend
- Verify VITE_API_URL environment variable
