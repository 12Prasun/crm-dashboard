# Project Structure & File Organization

## Directory Tree

```
crm-dashboard/
│
├── 📁 client/                          # React Frontend (Port 5173)
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── LoginPage.jsx           # Login form with API integration
│   │   │   └── DashboardPage.jsx       # Dashboard overview skeleton
│   │   ├── api.js                      # Axios client with JWT interceptors
│   │   ├── store.js                    # Zustand stores (Auth, Company, Contact)
│   │   ├── App.jsx                     # Main routing & layout
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Tailwind CSS styles
│   ├── index.html                      # HTML template
│   ├── vite.config.js                  # Vite dev server config with API proxy
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── postcss.config.js               # PostCSS configuration
│   ├── .eslintrc.json                  # ESLint rules
│   ├── package.json                    # Dependencies
│   └── .env.example                    # Environment variables template
│
├── 📁 server/                          # Express Backend (Port 5000)
│   ├── 📁 src/
│   │   ├── server.js                   # Express app setup & routes
│   │   ├── db.js                       # PostgreSQL connection pool
│   │   └── auth.js                     # JWT utilities & middleware
│   ├── 📁 scripts/
│   │   └── initDb.js                   # Database initialization script
│   ├── .eslintrc.json                  # ESLint rules
│   ├── package.json                    # Dependencies
│   └── .env.example                    # Environment variables template
│
├── 📁 docs/                            # Documentation
│   ├── ROADMAP.md                      # 4-week development roadmap
│   ├── WEEK1.md                        # Week 1 detailed guide
│   ├── QUICKSTART.md                   # Quick start setup guide
│   ├── WEEK2.md                        # Week 2 tasks *(to create)*
│   ├── WEEK3.md                        # Week 3 tasks *(to create)*
│   └── WEEK4.md                        # Week 4 tasks *(to create)*
│
├── README.md                           # Main project README
├── .gitignore                          # Git ignore rules
└── .prettierrc                         # Prettier code formatting

```

## Key Files Overview

### Frontend (client/)

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main React component with routing |
| `src/main.jsx` | React entry point with ReactDOM.createRoot |
| `src/api.js` | Axios API client with JWT auto-attach |
| `src/store.js` | Zustand stores for Auth/Company/Contact state |
| `src/pages/LoginPage.jsx` | Login form with email/password |
| `src/pages/DashboardPage.jsx` | Dashboard with stats cards |
| `vite.config.js` | Vite dev server (port 5173) with /api proxy |
| `tailwind.config.js` | Tailwind CSS theme configuration |

### Backend (server/)

| File | Purpose |
|------|---------|
| `src/server.js` | Express app with middleware setup |
| `src/db.js` | PostgreSQL connection pool |
| `src/auth.js` | JWT generation, verification, middleware |
| `scripts/initDb.js` | Create all database tables |

### Database Schema

Tables created by `initDb.js`:
- `tenants` - Multi-tenant organizations
- `users` - User accounts (email, password, role)
- `companies` - Company/organization records
- `contacts` - Contact persons linked to companies
- `deals` - Sales opportunities
- `activities` - Activity log for audit trail

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 |

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db
JWT_SECRET=your-secret-key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=CRM SaaS Dashboard
```

## Development Commands

```bash
# Backend
cd server
npm install                # Install dependencies
npm run db:init           # Initialize database
npm run dev               # Start with watch mode
npm start                 # Start production server

# Frontend
cd ../client
npm install               # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
```

## Dependencies

### Frontend (client/package.json)
- react, react-dom - UI framework
- vite - Build tool & dev server
- react-router-dom - Routing
- axios - HTTP client
- zustand - State management
- tailwindcss - CSS framework

### Backend (server/package.json)
- express - Web framework
- pg - PostgreSQL client
- jsonwebtoken - JWT auth
- bcryptjs - Password hashing
- cors - Cross-origin requests
- helmet - Security middleware
- express-validator - Input validation
- uuid - UUID generation

## Week 1 Completion Checklist

- [x] Directory structure created
- [x] Backend initialized with Express
- [x] Frontend initialized with React + Vite
- [x] PostgreSQL database schema designed
- [x] JWT authentication utilities
- [x] Zustand state management
- [x] Axios API client with interceptors
- [x] Login & Dashboard pages
- [x] Environment configuration
- [x] ESLint & Prettier setup
- [x] Documentation (ROADMAP, QUICKSTART, WEEK1)

## Next Steps (Week 2)

1. Implement authentication endpoints (register, login)
2. Build Company CRUD APIs
3. Build Contact CRUD APIs
4. Build Deal CRUD APIs
5. Add input validation & error handling
6. Implement tenant isolation middleware

---

*Last Updated: Week 1 - Foundation & Project Setup*
