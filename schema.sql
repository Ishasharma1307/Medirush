-- Enable UUID generation if not already enabled (Supabase usually has this by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enums for strict validation
CREATE TYPE user_role AS ENUM ('user', 'pharmacy', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'packed', 'out_for_delivery', 'delivered', 'cancelled');

-- 1) users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2) pharmacies
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pharmacy_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_open BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3) medicines
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    requires_prescription BOOLEAN DEFAULT FALSE,
    images TEXT[], -- TEXT[] allows an array of strings for multiple image URLs
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4) orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    prescription_url TEXT,
    delivery_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5) order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 6) prescriptions (For emergency prescription uploads)
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prescription_url TEXT NOT NULL,
    note TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending_verification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── STORAGE BUCKETS INITIALIZATION (Supabase Storage setup) ───────────────────

-- 1. Create storage bucket for prescriptions
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

-- Drop policies if they already exist to prevent errors
DROP POLICY IF EXISTS "Prescription Public Access Policy" ON storage.objects;
DROP POLICY IF EXISTS "Prescription Insert Policy" ON storage.objects;

-- Enable public select access for prescription images
CREATE POLICY "Prescription Public Access Policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'prescriptions');

-- Enable upload access for authenticated and anonymous uploads
CREATE POLICY "Prescription Insert Policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'prescriptions');


-- 2. Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop policies if they already exist to prevent errors
DROP POLICY IF EXISTS "Avatar Public Access Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Insert Policy" ON storage.objects;

-- Enable public select access for avatars
CREATE POLICY "Avatar Public Access Policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Enable upload access for avatar uploads
CREATE POLICY "Avatar Insert Policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars');

