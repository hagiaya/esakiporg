-- =====================================================================
-- SQL SCRIPT TO CREATE SAKIP ADMIN ACCOUNT (PROVINSI GORONTALO)
-- RUN THIS IN THE SUPABASE SQL EDITOR AFTER RUNNING THE MAIN SCHEMA
-- =====================================================================

-- 1. Ensure pgcrypto extension is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Seed all OPDs (or at least BIRO_ORG) so we don't violate the foreign key constraint
-- when the trigger handle_new_user creates the profiles record referencing 'BIRO_ORG'
INSERT INTO public.opds (code, name, lead_name) VALUES
('SETDA', 'Sekretariat Daerah', 'Drs. H. Darda Daraba, M.Si'),
('SEKWAN', 'Sekretariat DPRD', 'Sudirman, SH'),
('INSPEKTORAT', 'Inspektorat', 'Nirwan Utiarahman, SE, MM'),
('BAPPEDA', 'Bappeda', 'Budiyanto Sidiki, S.Sos, M.Si'),
('BKAD', 'Badan Keuangan dan Aset Daerah', 'Danial Ibrahim, SE'),
('BKD', 'Badan Kepegawaian Daerah', 'Zukri Surotinojo, S.Sos'),
('DIKLAT', 'Badan Pendidikan dan Pelatihan', 'Sofian Ibrahim, M.Si'),
('KESBANGPOL', 'Badan Kesatuan Bangsa dan Politik', 'Muh. Ali, SE'),
('BPBD', 'Badan Penanggulangan Bencana Daerah', 'Rusli Nusi, SE'),
('DIKBUDPORA', 'Dinas Pendidikan dan Kebudayaan', 'Dr. Wahyudin Katili, S.STP, ME'),
('DINKES', 'Dinas Kesehatan', 'dr. Yana Yanti Suleman, SH'),
('PUPR', 'Dinas Pekerjaan Umum dan Penataan Ruang', 'Arizal Efendi, ST'),
('PERKIM', 'Dinas Perumahan Rakyat dan Kawasan Permukiman', 'H. Nurdin Mokoginta, ST'),
('SATPOLPP', 'Satuan Polisi Pamong Praja', 'Masri Madjow, S.Sos'),
('DINSOS', 'Dinas Sosial', 'H. Sagita Wartabone, SE'),
('NAKERTRANS', 'Dinas Tenaga Kerja dan Transmigrasi', 'Sukur, SE'),
('DPPPA', 'Dinas Pemberdayaan Perempuan dan Perlindungan Anak', 'dr. Rosina Katon, M.Kes'),
('PANGAN', 'Dinas Pangan', 'Sutrisno, S.Pt'),
('DLHK', 'Dinas Lingkungan Hidup dan Kehutanan', 'Fayzal Mohamad, SE'),
('DUKCAPIL', 'Dinas Kependudukan dan Catatan Sipil', 'Zulkifli Monoarfa, SH'),
('PMD', 'Dinas Pemberdayaan Masyarakat Desa', 'Slamet Bakri, M.Si'),
('DISHUB', 'Dinas Perhubungan', 'M. Jamal Nganro, ST'),
('DISKOMINFO', 'Dinas Komunikasi, Informatika dan Statistik', 'Wahyu H. Hasan, M.Si'),
('DISKOPERINDAG', 'Dinas Koperasi, UMKM, Perindustrian dan Perdagangan', 'Risjon Sunge, M.Si'),
('DPM-PTSP', 'Dinas Penanaman Modal dan PTSP', 'Sukri Botutihe, SE'),
('DKP', 'Dinas Kelautan dan Perikanan', 'Sila Botutihe, M.Si'),
('PARIWISATA', 'Dinas Pariwisata', 'Rifli Katili, ME'),
('PERTANIAN', 'Dinas Pertanian', 'Mulyadi Mario, M.Si'),
('PUSARSIP', 'Dinas Perpustakaan dan Kearsipan', 'Sul A. Moito, S.Sos'),
('RS_AINUN', 'RSUD dr. Hasri Ainun Habibie', 'dr. Fitriyanto Rajak'),
('BIRO_ORG', 'Biro Organisasi', 'Sri Wahyuni D. Matulu, S.Sos'),
('BIRO_HUKUM', 'Biro Hukum', 'Taufiqurrahman Monoarfa, SH'),
('BIRO_PBJ', 'Biro Pengadaan Barang dan Jasa', 'Sultan Kaluara, SE'),
('BIRO_UMUM', 'Biro Umum', 'Yusran Lapananda, SH')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, lead_name = EXCLUDED.lead_name;

-- 3. Create the Admin user in Supabase auth.users table
-- This automatically fires the 'on_auth_user_created' trigger which inserts into public.profiles
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '3de16d1f-8255-46b7-a728-6623bc415e98', -- Fixed UUID for easy referencing
    'authenticated',
    'authenticated',
    'sakipemprov@atomicmail.io',
    crypt('Sakip123@#', gen_salt('bf', 10)), -- bcrypt hashes the password
    NOW(),
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Admin Pemprov Gorontalo","role":"ADMIN","opd_code":"BIRO_ORG"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 4. In case the trigger wasn't created or active during import, we guarantee 
-- the profile is established and explicitly set to ADMIN role.
INSERT INTO public.profiles (id, name, role, opd_code, created_at, updated_at)
VALUES (
    '3de16d1f-8255-46b7-a728-6623bc415e98',
    'Admin Pemprov Gorontalo',
    'ADMIN',
    'BIRO_ORG',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN', opd_code = 'BIRO_ORG', name = 'Admin Pemprov Gorontalo', updated_at = NOW();

-- Verification Selects (Comment out if running inside full automatic pipeline)
-- SELECT * FROM auth.users WHERE email = 'sakipemprov@atomicmail.io';
-- SELECT * FROM public.profiles WHERE id = '3de16d1f-8255-46b7-a728-6623bc415e98';
