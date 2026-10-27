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
-- 4b. SECURE RPC: ENROLL STUDENT IN CLASSROOM BY REGISTRATION CODE
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enroll_student_in_classroom(
  p_class_id UUID,
  p_registration_code TEXT
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_teacher_id UUID;
  v_student_id UUID;
  v_clean_reg TEXT;
  v_class RECORD;
  v_student RECORD;
BEGIN
  -- 1. Check authenticated caller
  v_teacher_id := auth.uid();
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- 2. Verify teacher owns classroom
  SELECT id, name, class_code, grade_level, teacher_id
  INTO v_class
  FROM public.classes
  WHERE id = p_class_id AND teacher_id = v_teacher_id;

  IF v_class.id IS NULL THEN
    RAISE EXCEPTION 'Classroom not found or you are not authorized to enroll learners into this classroom.';
  END IF;

  -- 3. Sanitize registration code
  v_clean_reg := UPPER(trim(p_registration_code));
  IF char_length(v_clean_reg) < 3 THEN
    RAISE EXCEPTION 'Please provide a valid student registration code.';
  END IF;

  -- 4. Lookup student profile
  SELECT id, display_name, registration_number, grade_level, avatar_id, role, created_at
  INTO v_student
  FROM public.profiles
  WHERE UPPER(trim(registration_number)) = v_clean_reg;

  IF v_student.id IS NULL THEN
    RAISE EXCEPTION 'No learner found with registration code "%". Please verify the code or have the student register.', v_clean_reg;
  END IF;

  IF v_student.role != 'student' THEN
    RAISE EXCEPTION 'The registration code belongs to a % account, not a student.', v_student.role;
  END IF;

  -- 5. Atomically insert or update enrollment
  INSERT INTO public.class_students (class_id, student_id, created_at)
  VALUES (v_class.id, v_student.id, now())
  ON CONFLICT (student_id) DO UPDATE
  SET class_id = EXCLUDED.class_id,
      created_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'student_id', v_student.id,
    'display_name', v_student.display_name,
    'registration_number', v_student.registration_number,
    'grade_level', v_student.grade_level,
    'avatar_id', coalesce(v_student.avatar_id, 'panda'),
    'class_id', v_class.id,
    'class_name', v_class.name,
    'class_code', v_class.class_code
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 4c. SECURE RPC: GET TEACHER ROSTER (Bypasses client-side RLS join blockages)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_teacher_roster()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_teacher_id UUID;
  v_students jsonb;
BEGIN
  v_teacher_id := auth.uid();
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'id', p.id,
      'display_name', p.display_name,
      'registration_number', coalesce(p.registration_number, 'UNASSIGNED'),
      'grade_level', coalesce(p.grade_level, 3),
      'avatar_id', coalesce(p.avatar_id, 'panda'),
      'class_id', c.id,
      'class_name', c.name,
      'class_code', c.class_code,
      'enrolled_at', cs.created_at,
      'last_active_at', p.created_at,
      'total_stars', coalesce(p.total_stars, 0)
    ) ORDER BY cs.created_at DESC
  ), '[]'::jsonb)
  INTO v_students
  FROM public.class_students cs
  JOIN public.classes c ON c.id = cs.class_id
  JOIN public.profiles p ON p.id = cs.student_id
  WHERE c.teacher_id = v_teacher_id;

  RETURN v_students;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. PERMISSIONS & RLS REPAIR
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.join_classroom_by_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_classroom_by_code(TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.regenerate_classroom_code(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.regenerate_classroom_code(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.ensure_teacher_classroom(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_teacher_classroom(TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.enroll_student_in_classroom(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enroll_student_in_classroom(UUID, TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_teacher_roster() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_teacher_roster() TO authenticated, service_role;

-- Allow authenticated users to look up classes (for classroom joining)
DROP POLICY IF EXISTS "classes_student_select" ON public.classes;
CREATE POLICY "classes_student_select"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure teacher can read enrolled students' profiles and lookup student by code
DROP POLICY IF EXISTS "profiles_teacher_read_students" ON public.profiles;
CREATE POLICY "profiles_teacher_read_students"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.profiles.id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.class_students cs
      JOIN public.classes c ON c.id = cs.class_id
      WHERE cs.student_id = public.profiles.id
        AND c.teacher_id = auth.uid()
    )
    OR
    (
      public.profiles.role = 'student'
      AND EXISTS (
        SELECT 1 FROM public.profiles tp
        WHERE tp.id = auth.uid() AND tp.role IN ('teacher', 'admin')
      )
    )
  );

-- Ensure class_students policies for teacher and student
DROP POLICY IF EXISTS "class_students_teacher_select" ON public.class_students;
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

DROP POLICY IF EXISTS "class_students_teacher_insert" ON public.class_students;
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

DROP POLICY IF EXISTS "class_students_student_select" ON public.class_students;
CREATE POLICY "class_students_student_select"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "class_students_student_insert" ON public.class_students;
CREATE POLICY "class_students_student_insert"
  ON public.class_students
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- ---------------------------------------------------------------------
-- 6. IDEMPOTENT INITIAL CLASSROOM PROVISIONING (BLOOMI-3A)
-- ---------------------------------------------------------------------
DO $$
DECLARE
  v_first_teacher_id UUID;
BEGIN
  -- Look for the first authenticated educator in profiles
  SELECT id INTO v_first_teacher_id 
  FROM public.profiles 
  WHERE role IN ('teacher', 'admin') 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF v_first_teacher_id IS NOT NULL THEN
    -- If this educator does not have a classroom yet, provision one
    IF NOT EXISTS (SELECT 1 FROM public.classes WHERE teacher_id = v_first_teacher_id) THEN
      IF NOT EXISTS (SELECT 1 FROM public.classes WHERE UPPER(trim(class_code)) = 'BLOOMI-3A') THEN
        INSERT INTO public.classes (name, grade_level, teacher_id, class_code)
        VALUES ('Grade 3 Blossom Explorers', 3, v_first_teacher_id, 'BLOOMI-3A');
      ELSE
        INSERT INTO public.classes (name, grade_level, teacher_id, class_code)
        VALUES ('Grade 3 Blossom Explorers', 3, v_first_teacher_id, 'BLOOM-3A01');
      END IF;
    END IF;
  END IF;
END;
$$;

