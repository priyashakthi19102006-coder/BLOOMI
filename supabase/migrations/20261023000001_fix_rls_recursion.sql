-- =====================================================================
-- BLOOMI Database Migration: Fix RLS Mutual Recursion & Harden Isolation
-- Migration: 20261023000001_fix_rls_recursion.sql
--
-- ROOT CAUSE:
-- In migration 20261022000001, policy 'class_students_teacher_select'
-- queries 'classes', while policy 'classes_student_select' queries
-- 'class_students'. When evaluating 'profiles_teacher_read_students',
-- PostgreSQL enters mutual recursion between 'class_students' and 'classes',
-- aborting queries with:
--   "infinite recursion detected in policy for relation 'class_students'"
-- This broke profile loading on student/teacher login.
--
-- REMEDY:
-- Use STABLE SECURITY DEFINER helper functions with fixed search_path.
-- These bypass table RLS during membership lookups without recursive policy checks,
-- while strictly preserving identical security boundaries.
-- =====================================================================

-- 1. Helper function: verify if teacher teaches a class containing student
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(teacher_uuid uuid, student_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.class_students cs
    JOIN public.classes c ON c.id = cs.class_id
    WHERE cs.student_id = student_uuid
      AND c.teacher_id = teacher_uuid
  );
$$;

-- 2. Helper function: verify if teacher teaches a class
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(teacher_uuid uuid, class_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.classes c
    WHERE c.id = class_uuid
      AND c.teacher_id = teacher_uuid
  );
$$;

-- 3. Helper function: verify if student is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_student_in_class(student_uuid uuid, class_uuid uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.class_students cs
    WHERE cs.class_id = class_uuid
      AND cs.student_id = student_uuid
  );
$$;

-- ---------------------------------------------------------------------
-- 4. RECREATE POLICIES ON PROFILES
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
-- 5. RECREATE POLICIES ON CLASSES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "classes_student_select" ON public.classes;
CREATE POLICY "classes_student_select"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    public.is_student_in_class(auth.uid(), public.classes.id)
  );

-- ---------------------------------------------------------------------
-- 6. RECREATE POLICIES ON CLASS_STUDENTS
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
-- 7. RECREATE POLICIES ON STUDENT_LEVEL_PROGRESS
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
-- 8. RECREATE POLICIES ON TEACHER_OBSERVATIONS
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
