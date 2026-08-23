-- =============================================================================
-- MEDIRUSH PHARMACY MODULE DATABASE SCHEMA & RLS POLICIES (PART 1 FOUNDATION)
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure user_role enum exists (user, pharmacy, admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'pharmacy', 'admin');
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE (Reference / Existing Sync)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. PHARMACIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pharmacy_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verified BOOLEAN DEFAULT FALSE,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for spatial & owner queries
CREATE INDEX IF NOT EXISTS idx_pharmacies_owner ON pharmacies(owner_id);
CREATE INDEX IF NOT EXISTS idx_pharmacies_verification ON pharmacies(verification_status);

-- -----------------------------------------------------------------------------
-- 3. PHARMACY STAFF TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pharmacy_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'pharmacist' CHECK (role IN ('owner', 'pharmacist', 'staff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_pharmacy_user UNIQUE (pharmacy_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_staff_pharmacy ON pharmacy_staff(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_staff_user ON pharmacy_staff(user_id);

-- -----------------------------------------------------------------------------
-- 4. PHARMACY INVENTORY TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID, -- Optional foreign key to master medicines catalog
    medicine_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price >= 0),
    availability BOOLEAN DEFAULT TRUE,
    expiry_date DATE,
    batch_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_pharmacy ON pharmacy_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_medicine ON pharmacy_inventory(medicine_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_available ON pharmacy_inventory(availability);

-- -----------------------------------------------------------------------------
-- 5. PHARMACY DOCUMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pharmacy_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('drug_license', 'gstin_certificate', 'identity_proof', 'store_photo', 'other')),
    document_url TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_docs_pharmacy ON pharmacy_documents(pharmacy_id);

-- -----------------------------------------------------------------------------
-- 6. PHARMACY OPERATING HOURS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pharmacy_operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    open_time TIME DEFAULT '09:00:00',
    close_time TIME DEFAULT '21:00:00',
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_pharmacy_day UNIQUE (pharmacy_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_operating_hours_pharmacy ON pharmacy_operating_hours(pharmacy_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_operating_hours ENABLE ROW LEVEL SECURITY;

-- helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- helper function: is_pharmacy_owner_or_staff
CREATE OR REPLACE FUNCTION public.is_pharmacy_owner_or_staff(p_pharmacy_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.pharmacies WHERE id = p_pharmacy_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.pharmacy_staff WHERE pharmacy_id = p_pharmacy_id AND user_id = auth.uid() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 1. PHARMACIES POLICIES ────────────────----------------------------------

-- Public read for active/verified pharmacies (Customers read)
DROP POLICY IF EXISTS "Public can view verified or open pharmacies" ON pharmacies;
CREATE POLICY "Public can view verified or open pharmacies"
ON pharmacies FOR SELECT
USING (verified = TRUE OR is_open = TRUE OR owner_id = auth.uid() OR public.is_admin());

-- Pharmacy owners can insert their pharmacy
DROP POLICY IF EXISTS "Pharmacy owner can insert own pharmacy" ON pharmacies;
CREATE POLICY "Pharmacy owner can insert own pharmacy"
ON pharmacies FOR INSERT
WITH CHECK (owner_id = auth.uid() OR public.is_admin());

-- Pharmacy owner can update own pharmacy
DROP POLICY IF EXISTS "Pharmacy owner can update own pharmacy" ON pharmacies;
CREATE POLICY "Pharmacy owner can update own pharmacy"
ON pharmacies FOR UPDATE
USING (owner_id = auth.uid() OR public.is_admin());

-- ── 2. PHARMACY INVENTORY POLICIES ────────────────-------------------------

-- Public read for available inventory items
DROP POLICY IF EXISTS "Public can read available inventory" ON pharmacy_inventory;
CREATE POLICY "Public can read available inventory"
ON pharmacy_inventory FOR SELECT
USING (
    availability = TRUE 
    OR public.is_pharmacy_owner_or_staff(pharmacy_id)
    OR public.is_admin()
);

-- Pharmacy owner/staff can insert inventory
DROP POLICY IF EXISTS "Pharmacy staff can insert inventory" ON pharmacy_inventory;
CREATE POLICY "Pharmacy staff can insert inventory"
ON pharmacy_inventory FOR INSERT
WITH CHECK (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

-- Pharmacy owner/staff can update inventory
DROP POLICY IF EXISTS "Pharmacy staff can update inventory" ON pharmacy_inventory;
CREATE POLICY "Pharmacy staff can update inventory"
ON pharmacy_inventory FOR UPDATE
USING (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

-- Pharmacy owner/staff can delete inventory
DROP POLICY IF EXISTS "Pharmacy staff can delete inventory" ON pharmacy_inventory;
CREATE POLICY "Pharmacy staff can delete inventory"
ON pharmacy_inventory FOR DELETE
USING (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

-- ── 3. PHARMACY DOCUMENTS POLICIES ────────────────-------------------------

DROP POLICY IF EXISTS "Pharmacy staff can view own documents" ON pharmacy_documents;
CREATE POLICY "Pharmacy staff can view own documents"
ON pharmacy_documents FOR SELECT
USING (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

DROP POLICY IF EXISTS "Pharmacy staff can insert documents" ON pharmacy_documents;
CREATE POLICY "Pharmacy staff can insert documents"
ON pharmacy_documents FOR INSERT
WITH CHECK (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

DROP POLICY IF EXISTS "Pharmacy staff can update documents" ON pharmacy_documents;
CREATE POLICY "Pharmacy staff can update documents"
ON pharmacy_documents FOR UPDATE
USING (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

-- ── 4. PHARMACY OPERATING HOURS POLICIES ────────────────-------------------

DROP POLICY IF EXISTS "Public can view operating hours" ON pharmacy_operating_hours;
CREATE POLICY "Public can view operating hours"
ON pharmacy_operating_hours FOR SELECT
USING (TRUE);

DROP POLICY IF EXISTS "Pharmacy staff can manage operating hours" ON pharmacy_operating_hours;
CREATE POLICY "Pharmacy staff can manage operating hours"
ON pharmacy_operating_hours FOR ALL
USING (public.is_pharmacy_owner_or_staff(pharmacy_id) OR public.is_admin());

-- ── 5. PHARMACY STAFF POLICIES ────────────────------------------------------

DROP POLICY IF EXISTS "Pharmacy owner can manage staff" ON pharmacy_staff;
CREATE POLICY "Pharmacy owner can manage staff"
ON pharmacy_staff FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.pharmacies WHERE id = pharmacy_staff.pharmacy_id AND owner_id = auth.uid())
    OR public.is_admin()
);
