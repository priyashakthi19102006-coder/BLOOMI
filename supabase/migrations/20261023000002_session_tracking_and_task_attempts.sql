-- =====================================================================
-- BLOOMI Database Migration: Session Tracking, Task Attempts & Teacher Verification
-- Migration: 20261023000002_session_tracking_and_task_attempts.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STUDENT SESSIONS TABLE (Accurate Session Duration & Activity Tracking)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  portal_seconds INTEGER NOT NULL DEFAULT 0 CHECK (portal_seconds >= 0),
  active_learning_seconds INTEGER NOT NULL DEFAULT 0 CHECK (active_learning_seconds >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'interrupted', 'idle_timeout')),
  device_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.student_sessions IS 'Auditable student learning sessions tracking start, last activity, duration, active learning vs portal time, and disconnect states.';
COMMENT ON COLUMN public.student_sessions.active_learning_seconds IS 'Seconds spent interacting directly with learning tasks and adventure challenges (not idle or passive navigation).';
COMMENT ON COLUMN public.student_sessions.portal_seconds IS 'Seconds spent exploring the kingdom map, reviewing achievements, or in hub navigation.';
COMMENT ON COLUMN public.student_sessions.status IS 'active, completed (explicit logout), interrupted (tab close/disconnect), or idle_timeout.';

CREATE INDEX IF NOT EXISTS idx_student_sessions_student ON public.student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_sessions_start ON public.student_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_student_sessions_status ON public.student_sessions(status);

ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;

-- Students can read their own sessions
DROP POLICY IF EXISTS "students_read_own_sessions" ON public.student_sessions;
CREATE POLICY "students_read_own_sessions"
  ON public.student_sessions
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Students can insert their own session starts
DROP POLICY IF EXISTS "students_insert_own_sessions" ON public.student_sessions;
CREATE POLICY "students_insert_own_sessions"
  ON public.student_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Students can update their own active session heartbeats and end states
DROP POLICY IF EXISTS "students_update_own_sessions" ON public.student_sessions;
CREATE POLICY "students_update_own_sessions"
  ON public.student_sessions
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Teachers can view session records for their enrolled students
DROP POLICY IF EXISTS "teachers_view_enrolled_student_sessions" ON public.student_sessions;
CREATE POLICY "teachers_view_enrolled_student_sessions"
  ON public.student_sessions
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.student_sessions.student_id)
  );

-- Service role full access
DROP POLICY IF EXISTS "service_role_full_access_sessions" ON public.student_sessions;
CREATE POLICY "service_role_full_access_sessions"
  ON public.student_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.student_sessions TO authenticated;
GRANT ALL ON public.student_sessions TO service_role;

-- ---------------------------------------------------------------------
-- 2. STUDENT TASK ATTEMPTS TABLE (Detailed granular activity history)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_task_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.student_sessions(id) ON DELETE SET NULL,
  world_id TEXT NOT NULL CHECK (world_id IN ('writing', 'speaking', 'visual', 'social')),
  level_number INTEGER NOT NULL CHECK (level_number >= 1 AND level_number <= 50),
  task_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  attempts_count INTEGER NOT NULL DEFAULT 1 CHECK (attempts_count >= 1),
  hints_used INTEGER NOT NULL DEFAULT 0 CHECK (hints_used >= 0),
  response_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.student_task_attempts IS 'Granular activity attempt log recording completed tasks, retries, hints, and response modalities.';

CREATE INDEX IF NOT EXISTS idx_task_attempts_student ON public.student_task_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_task_attempts_lookup ON public.student_task_attempts(student_id, world_id, level_number);
CREATE INDEX IF NOT EXISTS idx_task_attempts_session ON public.student_task_attempts(session_id);

ALTER TABLE public.student_task_attempts ENABLE ROW LEVEL SECURITY;

-- Students can read their own attempts
DROP POLICY IF EXISTS "students_read_own_attempts" ON public.student_task_attempts;
CREATE POLICY "students_read_own_attempts"
  ON public.student_task_attempts
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Students can insert their own attempts
DROP POLICY IF EXISTS "students_insert_own_attempts" ON public.student_task_attempts;
CREATE POLICY "students_insert_own_attempts"
  ON public.student_task_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Teachers can view attempts for enrolled students
DROP POLICY IF EXISTS "teachers_view_enrolled_task_attempts" ON public.student_task_attempts;
CREATE POLICY "teachers_view_enrolled_task_attempts"
  ON public.student_task_attempts
  FOR SELECT
  TO authenticated
  USING (
    public.is_teacher_of_student(auth.uid(), public.student_task_attempts.student_id)
  );

-- Service role full access
DROP POLICY IF EXISTS "service_role_full_access_attempts" ON public.student_task_attempts;
CREATE POLICY "service_role_full_access_attempts"
  ON public.student_task_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.student_task_attempts TO authenticated;
GRANT ALL ON public.student_task_attempts TO service_role;

-- ---------------------------------------------------------------------
-- 3. APPROVED TEACHER INVITATIONS (Restricts teacher role to verified onboarding)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_code TEXT NOT NULL UNIQUE CHECK (char_length(trim(invitation_code)) >= 4),
  school_name TEXT NOT NULL CHECK (char_length(trim(school_name)) >= 2),
  used_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.teacher_invitations IS 'Approved school-issued invitations required for verified educator account creation.';

-- Seed default approved test codes if table is empty
INSERT INTO public.teacher_invitations (invitation_code, school_name)
VALUES
  ('BLOOMI-TEACH-2026', 'Bloom Elementary School'),
  ('BLOOMI-EDU-GRADE3', 'Valley Oak Grade 3 Learning Team'),
  ('BLOOMI-SPECIALIST-2026', 'Inclusive Learning & Support Department')
ON CONFLICT (invitation_code) DO NOTHING;

ALTER TABLE public.teacher_invitations ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated can verify if a code is valid (without revealing all codes)
DROP POLICY IF EXISTS "anyone_can_check_active_invitation" ON public.teacher_invitations;
CREATE POLICY "anyone_can_check_active_invitation"
  ON public.teacher_invitations
  FOR SELECT
  TO anon, authenticated
  USING (used_at IS NULL AND expires_at > now());

-- Service role full access
DROP POLICY IF EXISTS "service_role_full_access_invitations" ON public.teacher_invitations;
CREATE POLICY "service_role_full_access_invitations"
  ON public.teacher_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.teacher_invitations TO anon, authenticated;
GRANT ALL ON public.teacher_invitations TO service_role;
