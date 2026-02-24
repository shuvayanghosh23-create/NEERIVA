# NEERIVA - Quick Start Guide

## Current Status: READY TO RUN ✓

The application has been fully configured with:
- ✓ Frontend built and working
- ✓ Backend API created (Node.js/Express)
- ✓ Database schema deployed (Supabase PostgreSQL)
- ✓ All authentication and security configured
- ✓ Admin account created

## Run the Application

### Start Backend Server:
```bash
npm run server
```
Backend will run on: http://localhost:3001

### In Bolt Environment:
The frontend dev server is auto-started by Bolt.
Just run the backend server with the command above.

### Check Backend Health:
```bash
curl http://localhost:3001/api/health
```

## Login Credentials

### Admin Access:
- URL: /admin/login
- Username: `admin`
- Password: `admin123`

### User Access:
- URL: /login
- Register new account or use demo: `ravi@example.com` / `demo123`
  (Note: Demo users are in-memory only, register for database persistence)

## API Base URL
http://localhost:3001/api

## Available Routes

### Public Routes:
- / - Home page
- /info - Information page
- /contact-support - Contact form
- /login - User login/register
- /admin/login - Admin login

### User Routes (after login):
- /app/dashboard - User dashboard
- /app/profile - Edit profile
- /app/orders/place - Place new order
- /app/orders/track - Track orders
- /app/support - Support tickets

### Admin Routes (after admin login):
- /admin/dashboard - Overview & orders
- /admin/orders - Order management
- /admin/users - User list
- /admin/tickets - Support tickets
- /admin/profile - Admin profile

## Project Features

### Order Management:
- 3 bottle sizes: 250ml (₹30), 500ml (₹45), 1L (₹65)
- Custom design upload
- Real-time status tracking
- Order modification for pending orders

### Admin Panel:
- Accept/reject orders
- Update order status
- View all customers
- Manage support tickets
- View contact form submissions

## Environment Variables

Already configured in .env file:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- PORT
- FRONTEND_URL

## Database Tables Created:
1. users - Customer accounts
2. admins - Administrator accounts
3. orders - Water bottle orders
4. support_tickets - Customer support
5. contact_messages - Contact form data

## Troubleshooting

### Backend won't start:
Check if .env file has Supabase credentials

### API returns 404:
Ensure backend is running on port 3001

### Database errors:
Run test connection:
```bash
node server/test-connection.js
```

## Next Steps

1. Start the backend: `npm run server`
2. Open the app in browser (Bolt auto-starts frontend)
3. Register a new user account
4. Place a test order
5. Login as admin to manage orders

## Support

Raise an issue through the support ticket system in the user dashboard.
