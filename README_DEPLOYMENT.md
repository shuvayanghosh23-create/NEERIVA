# NEERIVA - Custom Water Bottle Service

Complete full-stack application with React frontend, Node.js/Express backend, and Supabase PostgreSQL database.

## Project Structure

```
NEERIVA/
├── src/                          # React Frontend
│   ├── app/
│   │   ├── components/          # UI Components
│   │   │   ├── Hero.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoginSection.tsx
│   │   │   ├── InfoSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Root.tsx         # Main layout
│   │   │   ├── UserLayout.tsx   # User dashboard layout
│   │   │   ├── AdminLayout.tsx  # Admin panel layout
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   └── figma/
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── InfoPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfileSetupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── PlaceOrderPage.tsx
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   ├── OrderTrackPage.tsx
│   │   │   ├── SupportPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLoginPage.tsx
│   │   │       ├── AdminDashboardPage.tsx
│   │   │       └── AdminProfilePage.tsx
│   │   ├── routes.tsx           # React Router configuration
│   │   ├── store.tsx            # State management (Context API)
│   │   └── App.tsx
│   ├── styles/                  # CSS files
│   │   ├── index.css
│   │   ├── fonts.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   └── main.tsx                 # Entry point
│
├── server/                       # Node.js/Express Backend
│   ├── config/
│   │   └── database.js          # Supabase connection
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── supportController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── supportRoutes.js
│   │   └── contactRoutes.js
│   └── server.js                # Express app entry
│
├── index.html
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── .env                         # Environment variables
├── .env.example                 # Example env file
└── README_DEPLOYMENT.md         # This file
```

## Database Schema (Supabase PostgreSQL)

### Tables Created:

1. **users** - Customer accounts
   - id, title, name, email_or_mobile, password (hashed)
   - address, profile_picture, bio
   - is_profile_setup, created_at, updated_at

2. **admins** - Administrator accounts
   - id, username, password (hashed)
   - name, profile_picture
   - created_at, updated_at

3. **orders** - Water bottle orders
   - id (ORD-001, ORD-002...), user_id
   - bottle_size (1L, 500ml, 250ml), quantity
   - design_image, delivery details
   - status (pending, accepted, processing, shipped, delivered, cancelled, rejected)
   - total_price, admin_note
   - created_at, updated_at

4. **support_tickets** - Customer support
   - id (TKT-001, TKT-002...), user_id
   - subject, message, reply
   - status (open, in-progress, resolved)
   - created_at, updated_at

5. **contact_messages** - Contact form submissions
   - id, name, email, message
   - created_at

All tables have Row Level Security (RLS) enabled with proper policies.

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/admin/login` - Admin login
- PUT `/api/auth/profile` - Update user profile (auth required)

### Orders
- POST `/api/orders` - Place new order (auth required)
- GET `/api/orders/user` - Get user's orders (auth required)
- PUT `/api/orders/:orderId` - Update order (auth required)
- DELETE `/api/orders/:orderId` - Cancel order (auth required)
- GET `/api/orders/admin/all` - Get all orders (admin only)
- PUT `/api/orders/admin/:orderId/status` - Update order status (admin only)

### Support
- POST `/api/support/tickets` - Create support ticket (auth required)
- GET `/api/support/tickets/user` - Get user's tickets (auth required)
- GET `/api/support/tickets/admin/all` - Get all tickets (admin only)
- PUT `/api/support/tickets/admin/:ticketId/reply` - Reply to ticket (admin only)
- PUT `/api/support/tickets/admin/:ticketId/resolve` - Resolve ticket (admin only)

### Contact
- POST `/api/contact` - Submit contact form (public)
- GET `/api/contact/admin/all` - Get all messages (admin only)

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with Bolt's Supabase credentials.

If running locally, update these values:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secure_jwt_secret
```

### 3. Database Setup

Database tables are already created with the migration.

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Running the Application

### Option 1: Development Mode (Separate Terminals)

Terminal 1 - Frontend:
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

Terminal 2 - Backend:
```bash
npm run server
```
Backend runs on: http://localhost:3001

### Option 2: Production Build

Build frontend:
```bash
npm run build
```

Start backend:
```bash
npm run server
```

## Features

### User Features
- User registration and login
- Profile setup and management
- Place custom water bottle orders (1L, 500ml, 250ml)
- Upload custom designs
- Track order status in real-time
- Modify/cancel pending orders
- Raise support tickets
- Contact form

### Admin Features
- Admin authentication
- View all users and orders
- Accept/reject orders
- Update order status (pending → accepted → processing → shipped → delivered)
- Add notes to orders
- Manage support tickets
- Reply to customer inquiries
- View contact form submissions

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Row Level Security (RLS) on database
- Protected API routes
- CORS configuration
- Input validation
- Error handling

## Pricing

- 250ml: ₹30 per bottle
- 500ml: ₹45 per bottle
- 1L: ₹65 per bottle

## Frontend Fixes Applied

1. Viewport meta tag verified
2. CSS loading order optimized
3. Flexbox/Grid layouts properly configured
4. Responsive design with media queries
5. Button visibility and hover states fixed
6. Component spacing and alignment corrected
7. Mobile, tablet, and desktop responsive breakpoints
8. Gradient backgrounds and animations working
9. Image scaling and overflow handled
10. Tailwind CSS v4 properly configured

## Technologies Used

### Frontend
- React 18.3.1
- React Router 7.13.0
- Vite 6.3.5
- Tailwind CSS 4.1.12
- Framer Motion (motion)
- Radix UI components
- Lucide React icons
- Sonner (toast notifications)

### Backend
- Node.js
- Express 5.2.1
- Supabase PostgreSQL
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- CORS
- body-parser

## Testing the Application

### Test User Login
Use the demo credentials in the login page or register a new account.

### Test Admin Panel
1. Navigate to `/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Access admin dashboard at `/admin/dashboard`

### Test Order Flow
1. Login as user
2. Complete profile setup
3. Place an order with custom design
4. Track order status
5. Login as admin to manage orders

## Support

For issues or questions, use the contact form or raise a support ticket through the user dashboard.

## License

Private project for NEERIVA water bottle service.
