# NEERIVA - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (React App - Port 5173)                               │
│  ├── Public Routes                                             │
│  │   ├── / (Home)                                             │
│  │   ├── /info (Information)                                  │
│  │   ├── /contact-support (Contact)                           │
│  │   ├── /login (User Login/Register)                         │
│  │   └── /admin/login (Admin Login)                           │
│  │                                                             │
│  ├── User Routes (Protected)                                   │
│  │   ├── /app/dashboard (User Dashboard)                      │
│  │   ├── /app/profile (Profile Management)                    │
│  │   ├── /app/orders/place (Place Order)                      │
│  │   ├── /app/orders/track (Track Orders)                     │
│  │   └── /app/support (Support Tickets)                       │
│  │                                                             │
│  └── Admin Routes (Protected)                                  │
│      ├── /admin/dashboard (Overview)                           │
│      ├── /admin/orders (Order Management)                      │
│      ├── /admin/users (User Management)                        │
│      ├── /admin/tickets (Support Management)                   │
│      └── /admin/profile (Admin Profile)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Express Server (Port 3001)                                     │
│  │                                                              │
│  ├── Middleware                                                 │
│  │   ├── CORS (Cross-Origin)                                   │
│  │   ├── Body Parser (JSON)                                    │
│  │   ├── JWT Authentication                                     │
│  │   └── Error Handling                                        │
│  │                                                              │
│  ├── Routes                                                     │
│  │   ├── /api/auth/* (Authentication)                          │
│  │   ├── /api/orders/* (Orders)                                │
│  │   ├── /api/support/* (Support)                              │
│  │   └── /api/contact/* (Contact)                              │
│  │                                                              │
│  └── Controllers                                                │
│      ├── authController (Login, Register, Profile)             │
│      ├── orderController (Order CRUD)                           │
│      ├── supportController (Tickets)                            │
│      └── contactController (Messages)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Supabase PostgreSQL                                            │
│  │                                                              │
│  ├── Tables                                                     │
│  │   ├── users (Customer accounts)                             │
│  │   ├── admins (Administrator accounts)                       │
│  │   ├── orders (Water bottle orders)                          │
│  │   ├── support_tickets (Customer support)                    │
│  │   └── contact_messages (Contact form)                       │
│  │                                                              │
│  ├── Security                                                   │
│  │   ├── Row Level Security (RLS)                              │
│  │   ├── User-specific policies                                │
│  │   ├── Admin-only policies                                   │
│  │   └── Foreign key constraints                               │
│  │                                                              │
│  └── Indexes                                                    │
│      ├── idx_users_email_or_mobile                             │
│      ├── idx_admins_username                                    │
│      ├── idx_orders_user_id                                     │
│      ├── idx_orders_status                                      │
│      ├── idx_support_tickets_user_id                            │
│      └── idx_support_tickets_status                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration Flow
```
User → Frontend → POST /api/auth/register
                      ↓
                  Validate Input
                      ↓
                  Check Existing User
                      ↓
                  Hash Password (bcrypt)
                      ↓
                  Insert to users table
                      ↓
                  Generate JWT Token
                      ↓
User ← Frontend ← Return token + user data
```

### Order Placement Flow
```
User → Frontend → POST /api/orders (with JWT)
                      ↓
                  Verify JWT Token
                      ↓
                  Validate Order Data
                      ↓
                  Calculate Price
                      ↓
                  Generate Order ID (ORD-XXX)
                      ↓
                  Insert to orders table
                      ↓
User ← Frontend ← Return order confirmation
```

### Admin Order Management Flow
```
Admin → Frontend → PUT /api/orders/admin/:id/status (with JWT)
                      ↓
                  Verify Admin JWT
                      ↓
                  Validate Status Change
                      ↓
                  Update order in database
                      ↓
                  Add admin note (optional)
                      ↓
Admin ← Frontend ← Return updated order
```

## Authentication Flow

```
┌──────────────┐
│  User/Admin  │
└──────┬───────┘
       │
       │ 1. Login (email + password)
       ↓
┌──────────────────┐
│  Auth Controller │
└──────┬───────────┘
       │
       │ 2. Query database
       ↓
┌──────────────────┐
│  Database        │
└──────┬───────────┘
       │
       │ 3. Return user/admin record
       ↓
┌──────────────────┐
│  bcrypt.compare  │ 4. Verify password hash
└──────┬───────────┘
       │
       │ 5. Generate JWT token
       ↓
┌──────────────────┐
│  JWT Sign        │
└──────┬───────────┘
       │
       │ 6. Return token to client
       ↓
┌──────────────────┐
│  Frontend Store  │ 7. Store token
└──────┬───────────┘
       │
       │ 8. Include in Authorization header
       ↓
┌──────────────────┐
│  Protected Route │ 9. JWT middleware verifies
└──────────────────┘
```

## Database Schema Relationships

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │──┐
│ title           │  │
│ name            │  │
│ email_or_mobile │  │ 1:N
│ password        │  │
│ address         │  │
│ profile_picture │  │
│ bio             │  │
│ is_profile_setup│  │
│ created_at      │  │
│ updated_at      │  │
└─────────────────┘  │
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ↓              ↓              ↓
┌─────────────┐ ┌─────────────┐ ┌──────────────────┐
│   orders    │ │  support_   │ │      admins      │
│─────────────│ │  tickets    │ │──────────────────│
│ id (PK)     │ │─────────────│ │ id (PK)          │
│ user_id (FK)│ │ id (PK)     │ │ username (unique)│
│ user_name   │ │ user_id (FK)│ │ password         │
│ bottle_size │ │ user_name   │ │ name             │
│ quantity    │ │ subject     │ │ profile_picture  │
│ design_image│ │ message     │ │ created_at       │
│ delivery_*  │ │ status      │ │ updated_at       │
│ status      │ │ reply       │ └──────────────────┘
│ total_price │ │ created_at  │
│ admin_note  │ │ updated_at  │
│ created_at  │ └─────────────┘
│ updated_at  │
└─────────────┘

┌──────────────────┐
│ contact_messages │ (Independent)
│──────────────────│
│ id (PK)          │
│ name             │
│ email            │
│ message          │
│ created_at       │
└──────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Network Security                              │
│  ├── CORS (Cross-Origin Resource Sharing)              │
│  └── HTTPS (Production)                                 │
│                                                         │
│  Layer 2: Application Security                          │
│  ├── JWT Authentication                                 │
│  ├── Token Expiration (7 days)                          │
│  ├── Password Hashing (bcrypt, 10 rounds)               │
│  ├── Input Validation                                   │
│  └── Error Handling (no data leaks)                     │
│                                                         │
│  Layer 3: API Security                                  │
│  ├── Protected Routes (JWT Middleware)                  │
│  ├── Admin-Only Routes (Admin Middleware)               │
│  ├── Request Size Limits (50mb)                         │
│  └── SQL Injection Prevention (Supabase)                │
│                                                         │
│  Layer 4: Database Security                             │
│  ├── Row Level Security (RLS)                           │
│  ├── User-Specific Policies                             │
│  ├── Admin Service Role Policies                        │
│  ├── Foreign Key Constraints                            │
│  └── Indexed Queries (Performance)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Order Status Workflow

```
┌─────────┐
│ pending │ ◄── User places order
└────┬────┘
     │
     ├─── Admin can: Accept or Reject
     │
     ↓ (Accept)
┌──────────┐
│ accepted │ ◄── Admin accepts order
└────┬─────┘
     │
     ↓ Admin updates status
┌────────────┐
│ processing │ ◄── Order being prepared
└─────┬──────┘
     │
     ↓ Admin updates status
┌─────────┐
│ shipped │ ◄── Order dispatched
└────┬────┘
     │
     ↓ Admin updates status
┌───────────┐
│ delivered │ ◄── Order completed
└───────────┘

Alternative flows:
pending → rejected (Admin rejects)
pending → cancelled (User cancels)
```

## Component Architecture (Frontend)

```
App.tsx
  │
  ├── Root (Marketing Layout)
  │   ├── Header
  │   ├── Hero
  │   ├── InfoSection
  │   ├── ContactSection
  │   └── Footer
  │
  ├── UserLayout (User Dashboard)
  │   ├── Sidebar
  │   ├── DashboardPage
  │   ├── ProfilePage
  │   ├── PlaceOrderPage
  │   ├── OrderTrackPage
  │   └── SupportPage
  │
  └── AdminLayout (Admin Panel)
      ├── Sidebar
      ├── AdminDashboardPage
      ├── Orders Management
      ├── Users Management
      ├── Tickets Management
      └── AdminProfilePage
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Production Environment             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  CDN / Static Hosting                   │   │
│  │  ├── dist/ (Built React App)            │   │
│  │  └── index.html                          │   │
│  └─────────────────────────────────────────┘   │
│                      ↕                          │
│  ┌─────────────────────────────────────────┐   │
│  │  Node.js Server (PM2 / Docker)          │   │
│  │  ├── Express API                         │   │
│  │  ├── Port 3001                           │   │
│  │  └── Environment Variables               │   │
│  └─────────────────────────────────────────┘   │
│                      ↕                          │
│  ┌─────────────────────────────────────────┐   │
│  │  Supabase (Cloud PostgreSQL)            │   │
│  │  ├── Database Tables                     │   │
│  │  ├── RLS Policies                        │   │
│  │  └── Automated Backups                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Technology Stack Overview

```
┌──────────────────────────────────────────────┐
│  Frontend (React)                            │
│  ├── React 18.3.1                            │
│  ├── React Router 7.13.0                     │
│  ├── Vite 6.3.5                              │
│  ├── Tailwind CSS 4.1.12                     │
│  ├── Framer Motion (animations)              │
│  ├── Radix UI (components)                   │
│  └── Lucide React (icons)                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Backend (Node.js)                           │
│  ├── Express 5.2.1                           │
│  ├── bcryptjs (password hashing)             │
│  ├── jsonwebtoken (JWT auth)                 │
│  ├── @supabase/supabase-js                   │
│  ├── cors (CORS handling)                    │
│  └── body-parser (request parsing)           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Database (Supabase PostgreSQL)              │
│  ├── PostgreSQL 15+                          │
│  ├── Row Level Security (RLS)                │
│  ├── Automated backups                       │
│  ├── Real-time subscriptions                 │
│  └── Built-in authentication                 │
└──────────────────────────────────────────────┘
```

This architecture ensures:
- Scalability (separate frontend/backend/database)
- Security (multiple layers of protection)
- Maintainability (clean MVC structure)
- Performance (indexed queries, RLS policies)
- Reliability (proper error handling, validation)
