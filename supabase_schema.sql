-- =====================================================================
-- DATABASE SCHEMA FOR ONLINE SAKIP CONSULTATION (PROVINSI GORONTALO)
-- COMPATIBLE WITH SUPABASE (POSTGRESQL)
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. DECLARE ALL TABLES FIRST
-- ==========================================

-- Table: opds (Organisasi Perangkat Daerah)
CREATE TABLE public.opds (
    code VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    lead_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: profiles (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    nip VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'OPD', -- 'ADMIN', 'OPD', 'KONSULTAN'
    opd_code VARCHAR(50) REFERENCES public.opds(code) ON DELETE SET NULL,
    phone_number VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: pohon_kinerja (Performance Tree Master)
CREATE TABLE public.pohon_kinerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opd_code VARCHAR(50) REFERENCES public.opds(code) ON DELETE CASCADE,
    visi TEXT NOT NULL,
    misi TEXT NOT NULL,
    rpjmn TEXT,
    isu_strategis TEXT,
    janji_politik TEXT,
    tujuan_pemda TEXT,
    sasaran_pemda TEXT,
    opd_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: pohon_kinerja_tracks (Hierarki T-S-O-RT-RS-RO)
CREATE TABLE public.pohon_kinerja_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pohon_id UUID REFERENCES public.pohon_kinerja(id) ON DELETE CASCADE,
    rt_name TEXT NOT NULL,
    rt_target VARCHAR(100),
    rs_name TEXT NOT NULL,
    rs_target VARCHAR(100),
    ro_name TEXT NOT NULL,
    ro_target VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: pohon_kinerja_programs (Hierarki RK - Rencana Kerja)
CREATE TABLE public.pohon_kinerja_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID REFERENCES public.pohon_kinerja_tracks(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    target VARCHAR(100),
    budget NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: pohon_kinerja_subactivities (Hierarki RSK - Rencana Sub Kegiatan)
CREATE TABLE public.pohon_kinerja_subactivities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.pohon_kinerja_programs(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    target VARCHAR(100),
    budget NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: consultation_tickets
CREATE TABLE public.consultation_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    opd_code VARCHAR(50) REFERENCES public.opds(code) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Pohon Kinerja', 'Perjanjian Kinerja', 'Renstra Visi & Sasaran', 'Laporan SAKIP', 'Kamus Indikator', 'Monev'
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH'
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Integration references
    pohon_kinerja_ref UUID, -- References pohon_kinerja_tracks or programs
    sakip_component_ref JSONB, -- E.g. {"type": "renstra_sasaran", "id": "uuid-here", "name": "Name of indicator"}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: consultation_messages
CREATE TABLE public.consultation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.consultation_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb, -- Array of objects: [{"name": "file.pdf", "url": "https://...", "size": 1024}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: consultation_ratings
CREATE TABLE public.consultation_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.consultation_tickets(id) ON DELETE CASCADE UNIQUE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==========================================
-- 2. PROCEDURES, FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to handle user profiles on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role, opd_code)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'Staff OPD'),
        COALESCE(new.raw_user_meta_data->>'role', 'OPD'),
        new.raw_user_meta_data->>'opd_code'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically generate unique consultation ticket numbers
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    prefix VARCHAR(30);
    new_ticket_num VARCHAR(50);
BEGIN
    prefix := 'SAKIP-' || to_char(NOW(), 'YYYYMM') || '-';
    
    -- Count existing tickets for this prefix
    SELECT COALESCE(COUNT(*), 0) + 1 INTO seq_num
    FROM public.consultation_tickets
    WHERE ticket_number LIKE prefix || '%';
    
    new_ticket_num := prefix || lpad(seq_num::text, 4, '0');
    new.ticket_number := new_ticket_num;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER before_insert_consultation_ticket
    BEFORE INSERT ON public.consultation_tickets
    FOR EACH ROW
    WHEN (new.ticket_number IS NULL)
    EXECUTE FUNCTION public.generate_ticket_number();

-- Function to update ticket 'updated_at' column automatically
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_consultation_ticket_modtime
    BEFORE UPDATE ON public.consultation_tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


-- ==========================================
-- 3. ENABLE ROW-LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.opds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pohon_kinerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pohon_kinerja_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pohon_kinerja_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pohon_kinerja_subactivities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_ratings ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 4. DEFINE RLS POLICIES (All tables are now declared)
-- ==========================================

-- Policies for public.opds
CREATE POLICY "Public read access to public.opds" ON public.opds
    FOR SELECT USING (true);

CREATE POLICY "Admin write access to public.opds" ON public.opds
    FOR ALL USING (auth.jwt()->>'role' = 'service_role' OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- Policies for public.profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for public.pohon_kinerja
CREATE POLICY "Pohon Kinerja viewable by authenticated users" ON public.pohon_kinerja
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "OPD can manage own Pohon Kinerja" ON public.pohon_kinerja
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'ADMIN' OR opd_code = public.pohon_kinerja.opd_code)
        )
    );

-- Policies for public.pohon_kinerja_tracks
CREATE POLICY "Pohon Kinerja Tracks viewable by authenticated users" ON public.pohon_kinerja_tracks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "OPD can manage own Pohon Kinerja Tracks" ON public.pohon_kinerja_tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.pohon_kinerja pk
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE pk.id = public.pohon_kinerja_tracks.pohon_id 
            AND (p.role = 'ADMIN' OR p.opd_code = pk.opd_code)
        )
    );

-- Policies for public.pohon_kinerja_programs
CREATE POLICY "Programs viewable by authenticated" ON public.pohon_kinerja_programs
    FOR SELECT TO authenticated USING (true);

-- Policies for public.pohon_kinerja_subactivities
CREATE POLICY "Subactivities viewable by authenticated" ON public.pohon_kinerja_subactivities
    FOR SELECT TO authenticated USING (true);

-- Policies for public.consultation_tickets
CREATE POLICY "Users can view their own OPD tickets, Admins can view all" ON public.consultation_tickets
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = public.consultation_tickets.opd_code)
        )
    );

CREATE POLICY "OPD can create consultation tickets" ON public.consultation_tickets
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.opd_code = public.consultation_tickets.opd_code
        )
    );

CREATE POLICY "Ticket owners and Admin can update tickets" ON public.consultation_tickets
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = public.consultation_tickets.opd_code)
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = public.consultation_tickets.opd_code)
        )
    );

-- Policies for public.consultation_messages
CREATE POLICY "Authenticated users can select messages for visible tickets" ON public.consultation_messages
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.consultation_tickets t
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE t.id = public.consultation_messages.ticket_id
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = t.opd_code)
        )
    );

CREATE POLICY "Authenticated users can insert messages into visible tickets" ON public.consultation_messages
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = public.consultation_messages.sender_id AND
        EXISTS (
            SELECT 1 FROM public.consultation_tickets t
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE t.id = public.consultation_messages.ticket_id
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = t.opd_code)
        )
    );

-- Policies for public.consultation_ratings
CREATE POLICY "Ratings viewable by ticket members" ON public.consultation_ratings
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.consultation_tickets t
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE t.id = public.consultation_ratings.ticket_id
            AND (p.role = 'ADMIN' OR p.role = 'KONSULTAN' OR p.opd_code = t.opd_code)
        )
    );

CREATE POLICY "OPD can create ratings for resolved tickets" ON public.consultation_ratings
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.consultation_tickets t
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE t.id = public.consultation_ratings.ticket_id
            AND t.status IN ('RESOLVED', 'CLOSED')
            AND p.opd_code = t.opd_code
        )
    );


-- ==========================================
-- 5. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==========================================
CREATE INDEX idx_tickets_opd_code ON public.consultation_tickets(opd_code);
CREATE INDEX idx_tickets_status ON public.consultation_tickets(status);
CREATE INDEX idx_messages_ticket_id ON public.consultation_messages(ticket_id);
CREATE INDEX idx_profiles_opd_code ON public.profiles(opd_code);
CREATE INDEX idx_pohon_kinerja_opd ON public.pohon_kinerja(opd_code);
CREATE INDEX idx_pohon_tracks_pohon ON public.pohon_kinerja_tracks(pohon_id);
CREATE INDEX idx_pohon_programs_track ON public.pohon_kinerja_programs(track_id);
CREATE INDEX idx_pohon_subact_prog ON public.pohon_kinerja_subactivities(program_id);

-- ==========================================
-- 6. STORAGE BUCKET CONFIGURATION (METADATA)
-- ==========================================
-- Note: This is an instructions guide for creating storage bucket in Supabase UI or migrations
-- Bucket Name: "consultation-attachments"
-- Public Access: False (Secure download)
-- Allowed File Types: pdf, doc, docx, xls, xlsx, ppt, pptx, png, jpg, jpeg
-- Max File Size: 10MB
