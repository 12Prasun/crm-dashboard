# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│                         Port: 5173                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  App.jsx (Router)                                           │  │
│  │  ├─ LoginPage.jsx     → /login                             │  │
│  │  └─ DashboardPage.jsx → /dashboard (protected)            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ▲                                         │
│                           │ HTTP                                    │
│  ┌────────────────────────┴──────────────────────────────────────┐ │
│  │  API Client (Axios) - api.js                                │ │
│  │  - Auto JWT attachment in headers                           │ │
│  │  - Token refresh on 401                                     │ │
│  │  - Base URL: http://localhost:5000                          │ │
│  └────────────────────────┬──────────────────────────────────────┘ │
│                           │                                        │
│  ┌────────────────────────┴──────────────────────────────────────┐ │
│  │  Zustand Stores - store.js                                   │ │
│  │  ├─ useAuthStore    (user, token, login, logout)           │ │
│  │  ├─ useCompanyStore (companies, CRUD operations)           │ │
│  │  └─ useContactStore (contacts, CRUD operations)            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                   HTTP Requests │ API Calls
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SERVER (Express.js)                               │
│                      Port: 5000                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  server.js (Express App)                                    │  │
│  │  ├─ Middleware: helmet, cors, express.json                │  │
│  │  ├─ GET /api/health → server status                       │  │
│  │  └─ /api/* routes (to be implemented in Week 2)           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Authentication - auth.js                                   │  │
│  │  ├─ generateToken(payload)                                 │  │
│  │  ├─ verifyToken(token)                                     │  │
│  │  └─ authenticateToken (middleware)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                        │
│         PostgreSQL        │ SQL Queries                            │
│         Connection        │                                        │
│         Pool (db.js)      │                                        │
│                           ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Database Connection - db.js                                │  │
│  │  - Pool: pgClient                                           │  │
│  │  - Connection String: DATABASE_URL                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    Database    │
                    Queries     │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 DATABASE (PostgreSQL)                               │
│                 Port: 5432                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Tables:                                                            │
│  ├─ tenants          (tenant_id PRIMARY KEY)                       │
│  ├─ users            (id, tenant_id FK, email, password_hash)      │
│  ├─ companies        (id, tenant_id FK, name, industry, ...)       │
│  ├─ contacts         (id, tenant_id FK, company_id FK, ...)        │
│  ├─ deals            (id, tenant_id FK, company_id FK, ...)        │
│  └─ activities       (id, tenant_id FK, entity_type, ...)          │
│                                                                     │
│  Features:                                                          │
│  ├─ UUIDs for primary keys                                         │
│  ├─ Foreign key constraints with CASCADE deletes                   │
│  ├─ Tenant isolation (all queries filtered by tenant_id)           │
│  ├─ Timestamps (created_at, updated_at)                            │
│  └─ Indexes on frequently queried columns                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Example: User Login

```
1. User enters credentials
   LoginPage.jsx (email, password)
              │
              ▼
2. Form submission
   api.post('/api/auth/login', { email, password })
              │
              ▼
3. API Request
   axios sends to http://localhost:5000/api/auth/login
              │
              ▼
4. Backend Processing
   server.js receives request
   ├─ Check credentials
   ├─ Hash password verification
   └─ Generate JWT token
              │
              ▼
5. API Response
   { user: { id, email, ... }, token: 'jwt...' }
              │
              ▼
6. Frontend State Update
   useAuthStore.login(user, token)
   ├─ Save to localStorage
   ├─ Update Zustand store
   └─ Redirect to /dashboard
              │
              ▼
7. Protected Route Access
   DashboardPage rendered with user data
   API requests include Authorization header
```

## Multi-Tenant Architecture

```
┌────────────────────────────────────────────────┐
│         Tenant A Organization                  │
├────────────────────────────────────────────────┤
│ Users: user@tenantA.com                       │
│ Companies: Acme Corp, TechCo                  │
│ Contacts: 50 contacts                         │
│ Deals: 10 open, 5 closed                      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│         Tenant B Organization                  │
├────────────────────────────────────────────────┤
│ Users: user@tenantB.com                       │
│ Companies: StartupXYZ                         │
│ Contacts: 20 contacts                         │
│ Deals: 3 open, 2 closed                       │
└────────────────────────────────────────────────┘

Each tenant has:
- Isolated data (tenant_id on all tables)
- Separate users
- Separate companies, contacts, deals
- Independent database records

Query Example:
SELECT * FROM companies 
WHERE tenant_id = $1    ← Always filter by tenant
AND created_by = $2     ← Additional user filter
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  LOGIN FLOW                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Login                                             │
│     LoginPage.jsx → api.post('/api/auth/login')           │
│                                                             │
│  2. Backend Verification (Week 2)                         │
│     server.js                                             │
│     ├─ Find user by email                                │
│     ├─ Verify password (bcryptjs)                        │
│     └─ Generate JWT token                                │
│                                                             │
│  3. Token Response                                         │
│     Returns: { user: {...}, token: 'jwt...' }            │
│                                                             │
│  4. Frontend Storage                                       │
│     ├─ Save token to localStorage                        │
│     ├─ Update useAuthStore                               │
│     └─ Redirect to /dashboard                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AUTHENTICATED REQUESTS                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Request with Token                                    │
│     api.js intercepts all requests                        │
│     Adds: Authorization: Bearer <jwt_token>               │
│                                                             │
│  2. Backend Verification                                  │
│     auth.js authenticateToken middleware                  │
│     ├─ Extract token from header                          │
│     ├─ Verify token signature                             │
│     ├─ Check expiration                                   │
│     └─ Attach user to req.user                            │
│                                                             │
│  3. Protected Routes                                       │
│     All /api/* routes (except /auth/login)               │
│     ├─ Require valid JWT                                 │
│     ├─ Verify tenant_id                                   │
│     └─ Enforce row-level security                         │
│                                                             │
│  4. Response                                               │
│     Return authorized data                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LOGOUT FLOW                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Logout                                           │
│     DashboardPage.jsx → handleLogout()                   │
│                                                             │
│  2. Frontend Cleanup                                       │
│     ├─ Remove token from localStorage                    │
│     ├─ Clear useAuthStore                                │
│     └─ Redirect to /login                                │
│                                                             │
│  3. Future Requests                                        │
│     No Authorization header                               │
│     API returns 401 → redirect to login                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx (Router)
├─ LoginPage.jsx
│  ├─ Form inputs (email, password)
│  ├─ API call: api.post('/api/auth/login')
│  └─ Store: useAuthStore.login()
│
└─ DashboardPage.jsx (Protected)
   ├─ Navigation Bar
   │  ├─ User menu
   │  └─ Logout button
   │
   ├─ Stats Cards (Companies, Contacts, Deals)
   │
   ├─ Recent Activity Section
   │
   └─ Sidebar (Week 3)
      ├─ Companies link
      ├─ Contacts link
      ├─ Deals link
      └─ Settings link
```

## State Management (Zustand Stores)

```
useAuthStore
├─ State
│  ├─ user: null | { id, email, ... }
│  ├─ token: null | "jwt..."
│  └─ isAuthenticated: boolean
│
└─ Actions
   ├─ login(user, token)
   ├─ logout()
   └─ setUser(user)

useCompanyStore
├─ State
│  ├─ companies: []
│  └─ selectedCompany: null
│
└─ Actions
   ├─ setCompanies(companies)
   ├─ selectCompany(company)
   ├─ addCompany(company)
   ├─ updateCompany(id, data)
   └─ deleteCompany(id)

useContactStore
├─ State
│  ├─ contacts: []
│  └─ filteredContacts: []
│
└─ Actions
   ├─ setContacts(contacts)
   ├─ addContact(contact)
   ├─ updateContact(id, data)
   ├─ deleteContact(id)
   └─ filterContacts(query)
```

---

This architecture provides:
- ✅ Secure multi-tenant isolation
- ✅ JWT-based authentication
- ✅ Clean separation of concerns
- ✅ Scalable state management
- ✅ RESTful API design
- ✅ Database integrity with foreign keys
- ✅ Ready for Week 2-4 implementation
