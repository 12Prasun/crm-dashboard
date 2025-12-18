# Quick Start Guide

## Prerequisites
- Node.js v16 or higher
- PostgreSQL v13 or higher
- Git
- VS Code (recommended)

## Installation Steps

### 1. Clone/Setup Project
```bash
cd c:\Users\hp\OneDrive\Desktop\crm-dashboard
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment template
Copy-Item .env.example .env

# Edit .env with your PostgreSQL credentials
# Example:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm_db
# JWT_SECRET=your-super-secret-key-123
# PORT=5000

# Initialize database
npm run db:init

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment template
Copy-Item .env.example .env

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Verify Setup

1. Open `http://localhost:5173` in your browser
2. You should see the login page
3. Backend API health check: `http://localhost:5000/api/health`

## Database Setup

Make sure PostgreSQL is running, then:

```bash
cd server
npm run db:init
```

This creates all necessary tables for:
- Tenants (multi-tenant support)
- Users (with authentication)
- Companies
- Contacts
- Deals
- Activities

## Troubleshooting

**PostgreSQL Connection Error:**
- Ensure PostgreSQL is running: `psql -U postgres`
- Update `DATABASE_URL` in `server/.env`

**Port Already in Use:**
- Change `PORT` in `server/.env` (default: 5000)
- Vite frontend uses port 5173 by default

**Module Not Found:**
- Delete `node_modules` folder
- Run `npm install` again

## Demo Credentials

```
Email: demo@example.com
Password: demo123
```

*(Will be created after authentication endpoints are implemented in Week 2)*

## Next Steps

1. Review [WEEK1.md](./WEEK1.md) for detailed setup information
2. Follow [ROADMAP.md](./ROADMAP.md) for the complete development plan
3. Implement Week 2 tasks: Core API & Database Schema

## Useful Commands

```bash
# Backend
cd server
npm run dev        # Start dev server with watch mode
npm start          # Start production server
npm run db:init    # Initialize database tables
npm test           # Run tests (when available)

# Frontend
cd ../client
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Project Structure

```
crm-dashboard/
├── client/         # React frontend (port 5173)
├── server/         # Express backend (port 5000)
├── docs/           # Documentation
└── README.md       # Main README
```

Happy coding! 🚀
