# NEERIVA

NEERIVA is a full-stack custom water bottle ordering platform with a React + Vite frontend, Express API backend, and Supabase PostgreSQL database support.

Original design reference: https://www.figma.com/design/nv6uoQr3KKbOSBvpP7epWf/NEERIVA

## Website Architecture

NEERIVA is organized in 3 clear layers:

1. **Frontend (React, Vite, Tailwind)**  
   - Path: `/home/runner/work/NEERIVA/NEERIVA/src`  
   - Handles marketing pages, user dashboard, and admin panel UI.  
   - Uses route-based separation for:
     - Public website (`/`, `/info`, `/contact-support`, `/login`)
     - User app (`/app/*`)
     - Admin app (`/admin/*`)

2. **Backend API (Node.js, Express)**  
   - Path: `/home/runner/work/NEERIVA/NEERIVA/server`  
   - MVC-style structure:
     - `routes/` for API endpoints
     - `controllers/` for business logic
     - `middleware/` for JWT auth and access control
   - Core API domains:
     - Auth (`/api/auth/*`)
     - Orders (`/api/orders/*`)
     - Support (`/api/support/*`)
     - Contact (`/api/contact/*`)

3. **Data Layer (Supabase PostgreSQL)**  
   - Path: `/home/runner/work/NEERIVA/NEERIVA/supabase/migrations`  
   - Main entities: users, admins, orders, support tickets, contact messages  
   - Security model includes JWT-based API protection and Row Level Security (RLS) patterns.

## Special Things This Project Has

- **Dual-portal architecture in one app**: separate user and admin experiences with their own protected layouts and flows.
- **Full order lifecycle workflow**: `pending → accepted → processing → shipped → delivered` (+ rejected/cancelled paths).
- **Profile-completion gate**: users are redirected to complete profile setup before entering core app flows.
- **Production-ready backend + demo-friendly frontend**: frontend is immediately runnable with seeded in-memory flows, while a complete Express + Supabase backend exists for persistent/API-driven deployment.
- **Security-focused design**: bcrypt password hashing, JWT auth, role-aware middleware, and DB-level protections.

## Running the Project

Install dependencies:

```bash
npm i
```

Start frontend dev server:

```bash
npm run dev
```

Start backend API server:

```bash
npm run server
```
  
