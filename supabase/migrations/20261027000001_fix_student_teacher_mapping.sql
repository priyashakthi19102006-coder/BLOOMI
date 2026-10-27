-- =====================================================================
-- BLOOMI Database Migration: Complete Student-Teacher Mapping
-- Migration: 20261027000001_fix_student_teacher_mapping.sql
--
-- Goals:
-- 1. Ensure single active classroom membership per student (no duplicate memberships).
-- 2. Provide atomic, secure classroom joining via join_classroom_by_code RPC.
-- 3. Provide secure classroom code regeneration via regenerate_classroom_code RPC.
-- 4. Provide automatic teacher classroom provisioning via ensure_teacher_classroom RPC.
-- 5. Guarantee student and teacher RLS access without recursion or leakage.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENFORCE SINGLE MEMBERSHIP PER STUDENT & DEDUPLICATE IF NEEDED
-- ---------------------------------------------------------------------

-- Deduplicate any existing multi-memberships, retaining the most recent
DELETE FROM public.class_students cs1
USING public.class_students cs2
WHERE cs1.student_id = cs2.student_id
  AND cs1.created_at < cs2.created_at;

-- Create unique index on student_id to guarantee exactly one active classroom membership
CREATE UNIQUE INDEX IF NOT EXISTS uq_class_students_student_id ON public.class_students (student_id);

-- Ensure index on class_code is uppercase-insensitive and unique
CREATE UNIQUE INDEX IF NOT EXISTS uq_classes_class_code_upper ON public.classes (UPPER(trim(class_code)));

-- ---------------------------------------------------------------------
-- 2. SECURE RPC: JOIN CLASSROOM BY CODE
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_classroom_by_code(p_class_code TEXT)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_student_id UUID;
  v_user_role TEXT;
  v_clean_code TEXT;
  v_class RECORD;
  v_teacher_name TEXT;
BEGIN
  -- 1. Verify authenticated user
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to join a classroom.';
  END IF;

  -- 2. Verify user is registered as a student
  SELECT role INTO v_user_role FROM public.profiles WHERE id = v_student_id;
  IF v_user_role IS NULL OR v_user_role != 'student' THEN
    RAISE EXCEPTION 'Only registered student accounts can join a classroom.';
  END IF;

  -- 3. Sanitize and validate class code
  v_clean_code := UPPER(trim(p_class_code));
  IF char_length(v_clean_code) < 3 THEN
    RAISE EXCEPTION 'Please provide a valid classroom code (at least 3 characters).';
  END IF;

  -- 4. Lookup classroom by code
  SELECT c.id, c.name, c.class_code, c.grade_level, c.teacher_id
  INTO v_class
  FROM public.classes c
  WHERE UPPER(trim(c.class_code)) = v_clean_code
  LIMIT 1;

  IF v_class.id IS NULL THEN
    RAISE EXCEPTION 'The classroom code is invalid or expired. Please verify the code with your teacher.';
  END IF;

  -- 5. Atomically insert or update student's single classroom membership
  INSERT INTO public.class_students (class_id, student_id, created_at)
  VALUES (v_class.id, v_student_id, now())
  ON CONFLICT (student_id) DO UPDATE
  SET class_id = EXCLUDED.class_id,
      created_at = now();

  -- 6. Retrieve teacher display name for friendly confirmation
  SELECT display_name INTO v_teacher_name FROM public.profiles WHERE id = v_class.teacher_id;

  RETURN jsonb_build_object(
    'success', true,
    'class_id', v_class.id,
    'class_name', v_class.name,
    'class_code', v_class.class_code,
    'grade_level', v_class.grade_level,
    'teacher_id', v_class.teacher_id,
    'teacher_name', coalesce(v_teacher_name, 'Your Teacher')
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 3. SECURE RPC: REGENERATE CLASSROOM JOINING CODE
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.regenerate_classroom_code(p_class_id UUID)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_teacher_id UUID;
  v_new_code TEXT;
  v_candidate TEXT;
  v_exists BOOLEAN;
  v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_i INT;
  v_random_str TEXT;
BEGIN
  v_teacher_id := auth.uid();
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Verify caller owns the classroom
  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = p_class_id AND teacher_id = v_teacher_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only regenerate codes for classrooms you manage.';
  END IF;

  -- Generate unique collision-resistant code: BLOOM-XXXX
  LOOP
    v_random_str := '';
    FOR v_i IN 1..4 LOOP
      v_random_str := v_random_str || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;
    v_candidate := 'BLOOM-' || v_random_str;

    SELECT EXISTS (SELECT 1 FROM public.classes WHERE UPPER(trim(class_code)) = v_candidate) INTO v_exists;
    IF NOT v_exists THEN
      v_new_code := v_candidate;
      EXIT;
    END IF;
  END LOOP;

  -- Update class code
  UPDATE public.classes
  SET class_code = v_new_code,
      updated_at = now()
  WHERE id = p_class_id AND teacher_id = v_teacher_id;

  RETURN jsonb_build_object(
    'success', true,
    'class_id', p_class_id,
    'class_code', v_new_code
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 4. SECURE RPC: ENSURE TEACHER HAS AN ACTIVE CLASSROOM
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_teacher_classroom(p_class_name TEXT DEFAULT 'Grade 3 Explorers')
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_teacher_id UUID;
  v_role TEXT;
  v_class RECORD;
  v_new_code TEXT;
  v_candidate TEXT;
  v_exists BOOLEAN;
  v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_i INT;
  v_random_str TEXT;
BEGIN
  v_teacher_id := auth.uid();
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Verify user is teacher or admin
  SELECT role INTO v_role FROM public.profiles WHERE id = v_teacher_id;
  IF v_role IS NULL OR v_role NOT IN ('teacher', 'admin') THEN
    RAISE EXCEPTION 'Only verified educators can create or own classrooms.';
  END IF;

  -- Return existing classroom if one already exists
  SELECT id, name, class_code, grade_level, teacher_id
  INTO v_class
  FROM public.classes
  WHERE teacher_id = v_teacher_id
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_class.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'id', v_class.id,
      'name', v_class.name,
      'class_code', v_class.class_code,
      'grade_level', v_class.grade_level,
      'teacher_id', v_class.teacher_id,
      'is_new', false
    );
  END IF;

  -- Generate unique code: BLOOM-XXXX
  LOOP
    v_random_str := '';
    FOR v_i IN 1..4 LOOP
      v_random_str := v_random_str || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;
    v_candidate := 'BLOOM-' || v_random_str;

    SELECT EXISTS (SELECT 1 FROM public.classes WHERE UPPER(trim(class_code)) = v_candidate) INTO v_exists;
    IF NOT v_exists THEN
      v_new_code := v_candidate;
      EXIT;
    END IF;
  END LOOP;

  -- Insert new classroom
  INSERT INTO public.classes (name, grade_level, teacher_id, class_code)
  VALUES (coalesce(trim(p_class_name), 'Grade 3 Explorers'), 3, v_teacher_id, v_new_code)
  RETURNING id, name, class_code, grade_level, teacher_id INTO v_class;

  RETURN jsonb_build_object(
    'id', v_class.id,
    'name', v_class.name,
    'class_code', v_class.class_code,
    'grade_level', v_class.grade_level,
    'teacher_id', v_class.teacher_id,
    'is_new', true
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 5. PERMISSIONS & RLS VERIFICATION
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.join_classroom_by_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_classroom_by_code(TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.regenerate_classroom_code(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.regenerate_classroom_code(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.ensure_teacher_classroom(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_teacher_classroom(TEXT) TO authenticated, service_role;

-- Ensure student select policy on class_students exists and is non-recursive
DROP POLICY IF EXISTS "class_students_student_select" ON public.class_students;
CREATE POLICY "class_students_student_select"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());
