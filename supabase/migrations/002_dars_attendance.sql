-- ============================================================================
-- Migration: 002_dars_attendance.sql
-- Description: Schema and RLS policies for SSF TKMCE Weekly Darse QR Attendance
-- Created: 2026-11-14
-- ============================================================================

-- 1. Darse Sessions Table
CREATE TABLE IF NOT EXISTS public.dars_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_number INT NOT NULL,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL DEFAULT 'Campus Usthad',
    location TEXT NOT NULL DEFAULT 'TKMCE Prayer Hall / Campus Masjid',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'completed', 'cancelled')),
    session_pin CHAR(4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Registered Students / Attendees Master
CREATE TABLE IF NOT EXISTS public.dars_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL CHECK (department IN ('Civil', 'Mechanical', 'Electrical & Electronics', 'Electronics & Comm', 'Computer Science', 'Chemical', 'Production', 'Architecture', 'MCA', 'Other')),
    semester TEXT NOT NULL CHECK (semester IN ('S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'M.Tech', 'PhD', 'Alumni')),
    residence_type TEXT NOT NULL CHECK (residence_type IN ('Campus Hostel', 'Private Hostel / PG', 'Day Scholar')),
    first_attended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Attendance Records (One entry per student per session)
CREATE TABLE IF NOT EXISTS public.dars_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.dars_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.dars_students(id) ON DELETE CASCADE,
    checkin_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    checkin_method TEXT NOT NULL DEFAULT 'qr_scan' CHECK (checkin_method IN ('qr_scan', 'manual_coordinator')),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (session_id, student_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_dars_attendances_session ON public.dars_attendances(session_id);
CREATE INDEX IF NOT EXISTS idx_dars_attendances_student ON public.dars_attendances(student_id);
CREATE INDEX IF NOT EXISTS idx_dars_students_phone ON public.dars_students(whatsapp_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.dars_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dars_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dars_attendances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view active sessions" ON public.dars_sessions;
DROP POLICY IF EXISTS "Public can insert or update student profile" ON public.dars_students;
DROP POLICY IF EXISTS "Public can log attendance for live session" ON public.dars_attendances;
DROP POLICY IF EXISTS "Public can read session attendance counts" ON public.dars_attendances;

-- RLS Policies
CREATE POLICY "Public can view active sessions" ON public.dars_sessions
    FOR SELECT USING (status = 'live' OR status = 'completed');

CREATE POLICY "Public can insert or update student profile" ON public.dars_students
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can log attendance for live session" ON public.dars_attendances
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.dars_sessions s 
            WHERE s.id = session_id AND s.status = 'live'
        )
    );

CREATE POLICY "Public can read session attendance counts" ON public.dars_attendances
    FOR SELECT USING (true);
