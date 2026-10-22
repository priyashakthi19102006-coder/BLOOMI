-- =====================================================================
-- BLOOMI Database Schema & Row-Level Security (Stage 7)
-- Migration: 20261022000003_teacher_observations.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TEACHER OBSERVATIONS & SUPPORT NOTES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  observation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_context TEXT NOT NULL CHECK (char_length(trim(activity_context)) >= 1),
  observed_content TEXT NOT NULL CHECK (char_length(trim(observed_content)) >= 1),
  strategy_tried TEXT,
  follow_up_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.teacher_observations IS 'Educator observations and educational support strategies for enrolled students. Strictly educational; not clinical diagnoses.';
COMMENT ON COLUMN public.teacher_observations.observed_content IS 'Factual direct observations of student activity and learning steps.';
COMMENT ON COLUMN public.teacher_observations.strategy_tried IS 'Pedagogical strategy or accommodation tested during the activity.';

-- Indexes for efficient querying by teacher and student
CREATE INDEX IF NOT EXISTS idx_teacher_observations_teacher ON public.teacher_observations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_observations_student ON public.teacher_observations(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_observations_lookup ON public.teacher_observations(teacher_id, student_id);

-- ---------------------------------------------------------------------
-- 2. ROW-LEVEL SECURITY POLICIES
-- ---------------------------------------------------------------------
ALTER TABLE public.teacher_observations ENABLE ROW LEVEL SECURITY;

-- Teachers can view observations they authored for their enrolled students
CREATE POLICY "Teachers can view observations for enrolled students"
  ON public.teacher_observations
  FOR SELECT
  TO authenticated
  USING (
    teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.class_students cs ON cs.class_id = c.id
      WHERE c.teacher_id = auth.uid()
      AND cs.student_id = public.teacher_observations.student_id
    )
  );

-- Teachers can record observations for their enrolled students
CREATE POLICY "Teachers can insert observations for enrolled students"
  ON public.teacher_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.class_students cs ON cs.class_id = c.id
      WHERE c.teacher_id = auth.uid()
      AND cs.student_id = public.teacher_observations.student_id
    )
  );

-- Teachers can update their own observations
CREATE POLICY "Teachers can update their own observations"
  ON public.teacher_observations
  FOR UPDATE
  TO authenticated
  USING (
    teacher_id = auth.uid()
  )
  WITH CHECK (
    teacher_id = auth.uid()
  );

-- Teachers can delete their own observations
CREATE POLICY "Teachers can delete their own observations"
  ON public.teacher_observations
  FOR DELETE
  TO authenticated
  USING (
    teacher_id = auth.uid()
  );

-- Service role administrative access
CREATE POLICY "Service role full access on teacher observations"
  ON public.teacher_observations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
