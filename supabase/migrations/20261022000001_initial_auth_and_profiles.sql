-- =====================================================================
-- BLOOMI Database Schema & Row-Level Security (Stage 2)
-- Migration: 20261022000001_initial_auth_and_profiles.sql
-- =====================================================================

-- Ensure necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) >= 1),
  registration_number TEXT UNIQUE CHECK (registration_number IS NULL OR char_length(trim(registration_number)) >= 3),
  grade_level INTEGER NOT NULL DEFAULT 3 CHECK (grade_level >= 1 AND grade_level <= 12),
  avatar_id TEXT DEFAULT 'panda' CHECK (avatar_id IN ('lion', 'panda', 'fox', 'dolphin', 'default') OR avatar_id IS NULL),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Learner and educator profiles linked directly to Supabase Auth user IDs.';
COMMENT ON COLUMN public.profiles.registration_number IS 'Unique school-assigned registration identifier for students; resolved securely on the server.';

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_registration_number ON public.profiles(registration_number) WHERE registration_number IS NOT NULL;

-- ---------------------------------------------------------------------
-- 2. CLASSES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) >= 1),
  grade_level INTEGER NOT NULL DEFAULT 3 CHECK (grade_level >= 1 AND grade_level <= 12),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  class_code TEXT NOT NULL UNIQUE CHECK (char_length(trim(class_code)) >= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.classes IS 'Classrooms managed by authorized teachers.';

-- Indexes for classes
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_class_code ON public.classes(class_code);

-- ---------------------------------------------------------------------
-- 3. CLASS_STUDENTS TABLE (Join Table for Enrollment)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

COMMENT ON TABLE public.class_students IS 'Student enrollment records within teachers classrooms.';

-- Indexes for class_students
CREATE INDEX IF NOT EXISTS idx_class_students_class_id ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student_id ON public.class_students(student_id);

-- ---------------------------------------------------------------------
-- 4. ROLE TAMPER PREVENTION & AUTOMATION TRIGGERS
-- ---------------------------------------------------------------------

-- Function: prevent users from updating their own role or registration_number
CREATE OR REPLACE FUNCTION public.prevent_profile_role_tampering()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Disallow modifying role or registration number from normal client sessions
  IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.registration_number IS DISTINCT FROM NEW.registration_number) THEN
    -- Check if the request is executed with service_role privileges
    IF coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') != 'service_role' THEN
      RAISE EXCEPTION 'Security Violation: Modifying user role or registration number directly is prohibited.';
    END IF;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_tampering();

-- Function: automatically create profile on auth.user signup (e.g. for teachers or admin invites)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  assigned_role TEXT;
  assigned_name TEXT;
  assigned_reg_no TEXT;
BEGIN
  -- Extract metadata safely if present
  assigned_role := coalesce(NEW.raw_user_meta_data->>'role', 'student');
  -- Enforce valid roles
  IF assigned_role NOT IN ('student', 'teacher', 'admin') THEN
    assigned_role := 'student';
  END IF;

  assigned_name := coalesce(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1),
    'Bloom Explorer'
  );

  assigned_reg_no := NEW.raw_user_meta_data->>'registration_number';

  INSERT INTO public.profiles (id, role, display_name, registration_number, grade_level)
  VALUES (NEW.id, assigned_role, assigned_name, assigned_reg_no, 3)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- 1. Users can always read their own profile
CREATE POLICY "profiles_read_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Teachers can read profiles of students enrolled in classes they teach
CREATE POLICY "profiles_teacher_read_students"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.class_students cs
      JOIN public.classes c ON c.id = cs.class_id
      WHERE cs.student_id = public.profiles.id
      AND c.teacher_id = auth.uid()
    )
  );

-- 3. Users can update only their own profile (role tampering blocked by trigger)
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CLASSES POLICIES
-- 1. Teachers can select classes they teach
CREATE POLICY "classes_teacher_select"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid());

-- 2. Teachers can insert classes they own
CREATE POLICY "classes_teacher_insert"
  ON public.classes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- 3. Teachers can update classes they own
CREATE POLICY "classes_teacher_update"
  ON public.classes
  FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- 4. Teachers can delete classes they own
CREATE POLICY "classes_teacher_delete"
  ON public.classes
  FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

-- 5. Enrolled students can select their classes
CREATE POLICY "classes_student_select"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.class_students cs
      WHERE cs.class_id = public.classes.id
      AND cs.student_id = auth.uid()
    )
  );

-- CLASS_STUDENTS POLICIES
-- 1. Teachers can view student enrollments for their classes
CREATE POLICY "class_students_teacher_select"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = public.class_students.class_id
      AND c.teacher_id = auth.uid()
    )
  );

-- 2. Teachers can add/remove student enrollments in their classes
CREATE POLICY "class_students_teacher_insert"
  ON public.class_students
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = public.class_students.class_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "class_students_teacher_delete"
  ON public.class_students
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = public.class_students.class_id
      AND c.teacher_id = auth.uid()
    )
  );

-- 3. Students can view their own enrollment records
CREATE POLICY "class_students_student_select"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());
