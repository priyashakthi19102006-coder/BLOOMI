-- =====================================================================
-- BLOOMI Database Migration: Fix RLS Mutual Recursion, Harden Isolation,
-- and Protect Sensitive Support Records (Stage 8)
-- Migration: 20261023000001_fix_rls_recursion.sql
--
-- ROOT CAUSE RESOLUTION:
-- In migration 20261022000001, policy 'class_students_teacher_select'
-- queried 'classes', while policy 'classes_student_select' queried
-- 'class_students'. When evaluating 'profiles_teacher_read_students',
-- PostgreSQL entered mutual recursion between 'class_students' and 'classes',
-- aborting queries with:
--   "infinite recursion detected in policy for relation 'class_students'"
-- This caused profile loading to fail for both student and teacher logins.
--
-- SECURITY HARDENING:
-- 1. Helper functions use fixed, secure search_path = public, pg_temp.
-- 2. Strict caller validation prevents callers from probing unauthorized relationships.
-- 3. Execution permissions are revoked from PUBLIC and anon; granted only to authenticated and service_role.
-- 4. Cross-class boundaries are enforced: teachers can only access enrolled students.
-- 5. Dedicated sensitive_support_records table with strict RLS policies:
--    teachers can view/record support plans only for their enrolled students;
--    students cannot view or modify sensitive medical/IEP accommodations.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. HARDENED SECURITY DEFINER HELPER FUNCTIONS
-- ---------------------------------------------------------------------

-- Helper 1: verify if teacher teaches a class containing student
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(teacher_uuid uuid, student_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- Strict caller check: callers can only verify their own teacher identity unless running as service_role
  IF teacher_uuid IS DISTINCT FROM auth.uid() AND coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') != 'service_role' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.class_students cs
    JOIN public.classes c ON c.id = cs.class_id
    WHERE cs.student_id = student_uuid
      AND c.teacher_id = teacher_uuid
  );
END;
$$;

-- Helper 2: verify if teacher teaches a class
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(teacher_uuid uuid, class_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- Strict caller check: callers can only verify their own teacher identity unless running as service_role
  IF teacher_uuid IS DISTINCT FROM auth.uid() AND coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') != 'service_role' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.classes c
    WHERE c.id = class_uuid
      AND c.teacher_id = teacher_uuid
  );
END;
$$;

-- Helper 3: verify if student is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_student_in_class(student_uuid uuid, class_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- Strict caller check: callers can only verify their own student identity unless running as service_role
  IF student_uuid IS DISTINCT FROM auth.uid() AND coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') != 'service_role' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.class_students cs
    WHERE cs.class_id = class_uuid
      AND cs.student_id = student_uuid
  );
END;
$$;

-- Explicitly revoke public execution privileges and restrict to authenticated and service_role
REVOKE ALL ON FUNCTION public.is_teacher_of_student(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_student(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_teacher_of_class(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_class(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_student_in_class(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_student_in_class(uuid, uuid) TO authenticated, service_role;

-- ---------------------------------------------------------------------
-- 2. RECREATE POLICIES ON PROFILES (Eliminates recursion)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_teacher_read_students" ON public.profiles;
CREATE POLICY "profiles_teacher_read_students"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.profiles.id)
  );

-- ---------------------------------------------------------------------
-- 3. RECREATE POLICIES ON CLASSES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "classes_student_select" ON public.classes;
CREATE POLICY "classes_student_select"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    public.is_student_in_class(auth.uid(), public.classes.id)
  );

DROP POLICY IF EXISTS "classes_teacher_insert" ON public.classes;
CREATE POLICY "classes_teacher_insert"
  ON public.classes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid()
  );

-- ---------------------------------------------------------------------
-- 4. RECREATE POLICIES ON CLASS_STUDENTS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "class_students_teacher_select" ON public.class_students;
CREATE POLICY "class_students_teacher_select"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_class(auth.uid(), public.class_students.class_id)
  );

DROP POLICY IF EXISTS "class_students_teacher_insert" ON public.class_students;
CREATE POLICY "class_students_teacher_insert"
  ON public.class_students
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_teacher_of_class(auth.uid(), public.class_students.class_id)
  );

DROP POLICY IF EXISTS "class_students_teacher_delete" ON public.class_students;
CREATE POLICY "class_students_teacher_delete"
  ON public.class_students
  FOR DELETE
  TO authenticated
  USING (
    public.is_teacher_of_class(auth.uid(), public.class_students.class_id)
  );

-- ---------------------------------------------------------------------
-- 5. RECREATE POLICIES ON STUDENT_LEVEL_PROGRESS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Teachers can view enrolled student progress" ON public.student_level_progress;
CREATE POLICY "Teachers can view enrolled student progress"
  ON public.student_level_progress
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.student_level_progress.student_id)
  );

-- ---------------------------------------------------------------------
-- 6. RECREATE POLICIES ON TEACHER_OBSERVATIONS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Teachers can view observations for enrolled students" ON public.teacher_observations;
CREATE POLICY "Teachers can view observations for enrolled students"
  ON public.teacher_observations
  FOR SELECT
  TO authenticated
  USING (
    teacher_id = auth.uid()
    AND public.is_teacher_of_student(auth.uid(), public.teacher_observations.student_id)
  );

DROP POLICY IF EXISTS "Teachers can insert observations for enrolled students" ON public.teacher_observations;
CREATE POLICY "Teachers can insert observations for enrolled students"
  ON public.teacher_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid()
    AND public.is_teacher_of_student(auth.uid(), public.teacher_observations.student_id)
  );

-- ---------------------------------------------------------------------
-- 7. SENSITIVE SUPPORT RECORDS & ACCOMMODATIONS (Dedicated Table & Strict RLS)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sensitive_support_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  documented_by TEXT NOT NULL CHECK (char_length(trim(documented_by)) >= 1),
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  lawful_basis TEXT NOT NULL CHECK (lawful_basis IN ('Parent Consent', 'IEP Education Plan', 'Specialist Assessment')),
  category TEXT NOT NULL CHECK (category IN ('Accommodations', 'Communication Preferences', 'Sensory Needs', 'Documented Educational Support')),
  details TEXT NOT NULL CHECK (char_length(trim(details)) >= 1),
  review_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sensitive_support_records IS 'Legally protected educational support records, IEP accommodations, and communication preferences. Accessible strictly to authorized enrolled educators.';
COMMENT ON COLUMN public.sensitive_support_records.lawful_basis IS 'Documented legal basis for sensitive educational accommodation records.';

CREATE INDEX IF NOT EXISTS idx_sensitive_support_student ON public.sensitive_support_records(student_id);
CREATE INDEX IF NOT EXISTS idx_sensitive_support_review ON public.sensitive_support_records(review_date);

ALTER TABLE public.sensitive_support_records ENABLE ROW LEVEL SECURITY;

-- Only authenticated teachers who teach the enrolled student can view sensitive support records
DROP POLICY IF EXISTS "Teachers can view support records for enrolled students" ON public.sensitive_support_records;
CREATE POLICY "Teachers can view support records for enrolled students"
  ON public.sensitive_support_records
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.sensitive_support_records.student_id)
  );

-- Only authenticated teachers who teach the enrolled student can record sensitive support records
DROP POLICY IF EXISTS "Teachers can insert support records for enrolled students" ON public.sensitive_support_records;
CREATE POLICY "Teachers can insert support records for enrolled students"
  ON public.sensitive_support_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_teacher_of_student(auth.uid(), public.sensitive_support_records.student_id)
  );

-- Only authenticated teachers who teach the enrolled student can update sensitive support records
DROP POLICY IF EXISTS "Teachers can update support records for enrolled students" ON public.sensitive_support_records;
CREATE POLICY "Teachers can update support records for enrolled students"
  ON public.sensitive_support_records
  FOR UPDATE
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.sensitive_support_records.student_id)
  )
  WITH CHECK (
    public.is_teacher_of_student(auth.uid(), public.sensitive_support_records.student_id)
  );

-- Only authenticated teachers who teach the enrolled student can delete sensitive support records
DROP POLICY IF EXISTS "Teachers can delete support records for enrolled students" ON public.sensitive_support_records;
CREATE POLICY "Teachers can delete support records for enrolled students"
  ON public.sensitive_support_records
  FOR DELETE
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.sensitive_support_records.student_id)
  );

-- Service role has full administrative access
DROP POLICY IF EXISTS "Service role full access on sensitive support records" ON public.sensitive_support_records;
CREATE POLICY "Service role full access on sensitive support records"
  ON public.sensitive_support_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Explicitly grant table permissions to authenticated role (policies enforce row security)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sensitive_support_records TO authenticated;
GRANT ALL ON public.sensitive_support_records TO service_role;
