-- =====================================================================
-- BLOOMI Database Schema & Row-Level Security (Stage 5)
-- Migration: 20261022000002_student_progress.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STUDENT LEVEL PROGRESS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  world_id TEXT NOT NULL CHECK (world_id IN ('writing', 'speaking', 'visual', 'social')),
  level_number INTEGER NOT NULL CHECK (level_number >= 1 AND level_number <= 50),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_tasks INTEGER NOT NULL DEFAULT 0 CHECK (completed_tasks >= 0 AND completed_tasks <= 5),
  stars_earned INTEGER NOT NULL DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 3),
  completed_task_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_attempt_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_world_level UNIQUE (student_id, world_id, level_number)
);

COMMENT ON TABLE public.student_level_progress IS 'Per-student level progression and task completion history across all 4 learning worlds.';
COMMENT ON COLUMN public.student_level_progress.completed_task_ids IS 'Array of task identifier strings completed by the student within this level.';

-- Indexes for efficient querying by student, world, and level
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON public.student_level_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_lookup ON public.student_level_progress(student_id, world_id, level_number);

-- ---------------------------------------------------------------------
-- 2. ROW-LEVEL SECURITY POLICIES
-- ---------------------------------------------------------------------
ALTER TABLE public.student_level_progress ENABLE ROW LEVEL SECURITY;

-- Students can view their own progress records
CREATE POLICY "Students can view their own curriculum progress"
  ON public.student_level_progress
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
  );

-- Students can insert or update their own progress records
CREATE POLICY "Students can insert their own curriculum progress"
  ON public.student_level_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
  );

CREATE POLICY "Students can update their own curriculum progress"
  ON public.student_level_progress
  FOR UPDATE
  TO authenticated
  USING (
    student_id = auth.uid()
  )
  WITH CHECK (
    student_id = auth.uid()
  );

-- Teachers can view progress of students enrolled in their classes
CREATE POLICY "Teachers can view enrolled student progress"
  ON public.student_level_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.class_students cs ON cs.class_id = c.id
      WHERE c.teacher_id = auth.uid()
      AND cs.student_id = public.student_level_progress.student_id
    )
  );

-- Service role has full administrative access
CREATE POLICY "Service role full access on student progress"
  ON public.student_level_progress
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
