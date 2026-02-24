/*
  # NEERIVA Water Bottle Service - Database Schema

  ## Tables Created
  
  ### 1. users
  - id (uuid, primary key)
  - title (text) - Mr., Ms., Dr., etc.
  - name (text)
  - email_or_mobile (text, unique)
  - password (text) - hashed
  - address (text)
  - profile_picture (text) - URL or base64
  - bio (text)
  - is_profile_setup (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 2. admins
  - id (uuid, primary key)
  - username (text, unique)
  - password (text) - hashed
  - name (text)
  - profile_picture (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 3. orders
  - id (text, primary key) - Order ID like ORD-001
  - user_id (uuid, foreign key to users)
  - user_name (text)
  - bottle_size (text) - 1L, 500ml, 250ml
  - quantity (integer)
  - design_image (text)
  - delivery_name (text)
  - delivery_phone (text)
  - delivery_address (text)
  - status (text) - pending, accepted, processing, shipped, delivered, cancelled, rejected
  - total_price (numeric)
  - admin_note (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 4. support_tickets
  - id (text, primary key) - Ticket ID like TKT-001
  - user_id (uuid, foreign key to users)
  - user_name (text)
  - subject (text)
  - message (text)
  - status (text) - open, in-progress, resolved
  - reply (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 5. contact_messages
  - id (uuid, primary key)
  - name (text)
  - email (text)
  - message (text)
  - created_at (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users
  - Add admin-only policies
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  name text NOT NULL,
  email_or_mobile text UNIQUE NOT NULL,
  password text NOT NULL,
  address text DEFAULT '',
  profile_picture text DEFAULT '',
  bio text DEFAULT '',
  is_profile_setup boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  profile_picture text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  bottle_size text NOT NULL CHECK (bottle_size IN ('1L', '500ml', '250ml')),
  quantity integer NOT NULL CHECK (quantity > 0),
  design_image text DEFAULT '',
  delivery_name text NOT NULL,
  delivery_phone text NOT NULL,
  delivery_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected')),
  total_price numeric NOT NULL,
  admin_note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved')),
  reply text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins policies (service role only)
CREATE POLICY "Service role can manage admins"
  ON admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Support tickets policies
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all tickets"
  ON support_tickets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can view contact messages"
  ON contact_messages FOR SELECT
  TO service_role
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_or_mobile ON users(email_or_mobile);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- Insert default admin (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO admins (username, password, name)
VALUES ('admin', '$2a$10$X9kQ9ZJQeJ5yZ5vZ5vZ5vOpQqJQeJ5yZ5vZ5vZ5vZ5vZ5vZ5vZ5v', 'NEERIVA Admin')
ON CONFLICT (username) DO NOTHING;