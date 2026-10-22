-- =====================================================================
-- BLOOMI Test & Seed Data Script
-- File: supabase/seed.sql
-- Run this in your Supabase SQL Editor after running migrations.
-- Note: Replace password hashes or provision via Supabase Auth dashboard.
-- =====================================================================

-- Example: Provisioning a test classroom
DO $$
DECLARE
  v_teacher_id UUID;
  v_student_id UUID;
  v_class_id UUID;
BEGIN
  -- Check if a teacher profile exists or create sample records for demonstration
  SELECT id INTO v_teacher_id FROM public.profiles WHERE role = 'teacher' LIMIT 1;

  IF v_teacher_id IS NOT NULL THEN
    -- Create sample Grade 3 class if none exists
    INSERT INTO public.classes (name, grade_level, teacher_id, class_code)
    VALUES ('Grade 3 Blossom Explorers', 3, v_teacher_id, 'BLOOM-3A')
    ON CONFLICT (class_code) DO NOTHING
    RETURNING id INTO v_class_id;

    -- If a student exists, enroll student into class
    SELECT id INTO v_student_id FROM public.profiles WHERE role = 'student' LIMIT 1;
    IF v_student_id IS NOT NULL AND v_class_id IS NOT NULL THEN
      INSERT INTO public.class_students (class_id, student_id)
      VALUES (v_class_id, v_student_id)
      ON CONFLICT (class_id, student_id) DO NOTHING;
    END IF;
  END IF;
END $$;
