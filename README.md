# CRM SaaS Dashboard

A complete multi-tenant CRM SaaS application built with React, Node.js/Express, and PostgreSQL.

## 📋 Project Structure

```
crm-dashboard/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── docs/            # Documentation
├── .gitignore       # Git ignore rules
├── README.md        # This file
└── docker-compose.yml  # Docker configuration
```

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, JWT
- **Database:** PostgreSQL
- **Authentication:** JWT tokens
- **Deployment:** Docker, AWS EC2

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- Git

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd crm-dashboard
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
```bash
# server/.env
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db
JWT_SECRET=your-secret-key
PORT=5000

# client/.env
VITE_API_URL=http://localhost:5000
```

5. Set up the database
```bash
cd server
npm run db:init
```

6. Run the application
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

## 📅 Development Timeline

- **Week 1:** Foundation & Project Setup
- **Week 2:** Core API & Database Schema
- **Week 3:** Frontend UI & Components
- **Week 4:** Integration & Deployment

## 📝 License

MIT
