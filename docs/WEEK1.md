# Week 1: Foundation & Project Setup

## Goal
Set up the environment, initialize frontend + backend, connect them, and prepare the database.

## ✅ Completed Tasks

### 1. Environment Setup
- ✅ Node.js project structure created
- ✅ Package managers configured (npm)
- ✅ Git repository initialized (ready for .git)
- ✅ VS Code extensions configured (.vscode/extensions.json ready)

### 2. Project Structure
```
crm-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Login, Dashboard)
│   │   ├── api.js         # Axios API client with interceptors
│   │   ├── store.js       # Zustand stores (Auth, Company, Contact)
│   │   ├── App.jsx        # Main app routing
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind CSS styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   ├── package.json       # Frontend dependencies
│   └── .env.example       # Environment variables template
│
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── server.js      # Main Express server
│   │   ├── db.js          # PostgreSQL connection pool
│   │   └── auth.js        # JWT utilities & middleware
│   ├── scripts/
│   │   └── initDb.js      # Database initialization
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
│
├── docs/                   # Documentation
├── README.md              # Project README
└── .gitignore             # Git ignore rules
```

### 3. Backend Setup (Node.js + Express)

**Key Files:**
- `server/package.json` - Dependencies: express, pg, jsonwebtoken, bcryptjs, cors, helmet
- `server/src/server.js` - Express server with CORS & Helmet middleware
- `server/src/db.js` - PostgreSQL connection pool
- `server/src/auth.js` - JWT token generation/verification & auth middleware

**Features Implemented:**
- ✅ Express server with health check endpoint
- ✅ CORS & security middleware
- ✅ JWT authentication utilities
- ✅ Database connection pool
- ✅ Error handling middleware

### 4. Frontend Setup (React + Vite)

**Key Files:**
- `client/package.json` - Dependencies: react, vite, tailwind, zustand, axios
- `client/src/App.jsx` - Main routing component
- `client/src/api.js` - Axios API client with JWT interceptors
- `client/src/store.js` - Zustand stores for state management
- `client/src/pages/LoginPage.jsx` - Login form component
- `client/src/pages/DashboardPage.jsx` - Dashboard skeleton
- `client/index.html` - HTML template
- `client/vite.config.js` - Vite with dev proxy to backend
- `client/tailwind.config.js` - Tailwind CSS configuration

**Features Implemented:**
- ✅ Vite dev server with API proxy
- ✅ React Router for client-side routing
- ✅ Zustand for state management
- ✅ Axios API client with automatic JWT attachment
- ✅ Tailwind CSS styling
- ✅ Protected dashboard route

### 5. Database Schema

**Tables Created:**
- `tenants` - Multi-tenant support
- `users` - User accounts with tenant isolation
- `companies` - Company/organization records
- `contacts` - Contact information linked to companies
- `deals` - Sales opportunities
- `activities` - Activity log

**Key Features:**
- ✅ Full multi-tenant architecture with tenant isolation
- ✅ UUID primary keys
- ✅ Proper foreign keys & cascade deletes
- ✅ Timestamps for all records
- ✅ Indexes on frequently queried columns

### 6. Environment Configuration

**Backend (.env.example):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db
JWT_SECRET=your-secret-key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env.example):**
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=CRM SaaS Dashboard
```

## 🚀 Next Steps (Week 2)

1. **Implement Authentication API**
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/refresh
   - User password hashing with bcryptjs

2. **Build Core API Endpoints**
   - Company CRUD: GET, POST, PUT, DELETE
   - Contact CRUD: GET, POST, PUT, DELETE
   - Deal CRUD: GET, POST, PUT, DELETE

3. **Add Database Queries**
   - Service layer for data access
   - Proper error handling & validation

4. **Implement Middleware**
   - Tenant isolation middleware
   - Rate limiting
   - Request validation

## 💡 Running the Application

### Prerequisites
- Node.js v16+
- PostgreSQL v13+

### Installation & Setup

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Install frontend dependencies
cd ../client
npm install

# 3. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Configure database connection in server/.env
# Update DATABASE_URL with your PostgreSQL credentials

# 5. Initialize the database
cd server
npm run db:init

# 6. Run backend (Terminal 1)
npm run dev

# 7. Run frontend (Terminal 2)
cd ../client
npm run dev
```

Access the application at `http://localhost:5173`

## 📋 Testing Checklist

- [ ] Backend server starts on port 5000
- [ ] Frontend dev server starts on port 5173
- [ ] API proxy works (frontend requests to /api are routed to backend)
- [ ] Database connection established
- [ ] JWT utilities working
- [ ] Login page renders
- [ ] Dashboard page renders (when authenticated)
