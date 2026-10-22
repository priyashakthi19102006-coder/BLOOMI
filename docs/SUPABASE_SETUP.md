# Supabase Backend & Authentication Setup Guide for BLOOMI (Stage 2)

This document provides exact, step-by-step instructions for provisioning and configuring Supabase for the BLOOMI inclusive educational platform.

---

## 1. Prerequisites
- A free or Pro account at [Supabase](https://supabase.com/).
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (optional for local development, or you can use the Supabase web dashboard).

---

## 2. Project Creation & Environment Setup

1. Sign in to [https://supabase.com/dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Set the project name to **BLOOMI** and generate a strong database password.
3. Once the project is provisioned, navigate to:
   **Project Settings > API**.
4. Retrieve the following credentials:
   - **Project URL:** `https://<your-project-ref>.supabase.co`
   - **anon / public key:** `eyJ...` (Safe for browser / frontend)
   - **service_role key:** `eyJ...` (**SECRET! NEVER PUT THIS IN FRONTEND CODE OR GIT**)
5. In your local repository root, create `.env.local` by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
6. Add your URL and anon key to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   ```

---

## 3. Database Migration Execution

Run the version-controlled migration located at:
[`supabase/migrations/20261022000001_initial_auth_and_profiles.sql`](file:///c:/Users/priya%20shakthi/OneDrive/Desktop/Bloomi_APP/supabase/migrations/20261022000001_initial_auth_and_profiles.sql)

### Option A: Via Supabase Dashboard (Fastest)
1. In your Supabase Dashboard, click **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of `supabase/migrations/20261022000001_initial_auth_and_profiles.sql`.
4. Paste into the editor and click **Run**.
5. Verify in **Table Editor** that `profiles`, `classes`, and `class_students` exist with Row-Level Security enabled.

### Option B: Via Supabase CLI
```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

---

## 4. Deploying the Student Login Edge Function

Because student accounts are authenticated using school-issued registration numbers rather than personal emails, authentication is resolved server-side through a Supabase Edge Function using privileged credentials safely isolated on the server.

### Deploying the Function:
1. Ensure the Supabase CLI is linked to your project:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
2. Deploy the `student-login` function:
   ```bash
   npx supabase functions deploy student-login
   ```
3. Set the required secrets in Supabase Dashboard (**Edge Functions > student-login > Secrets** or via CLI):
   ```bash
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
   *(Note: `SUPABASE_URL` and `SUPABASE_ANON_KEY` are automatically injected by the Supabase runtime).*

---

## 5. Provisioning Test Accounts

### A. Creating a Verified Educator Account
1. In Supabase Dashboard, go to **Authentication > Users** > **Add User** > **Create User**.
2. Enter email: `teacher@bloomi.edu` and a secure password.
3. Check "Auto Confirm User".
4. In the **SQL Editor**, verify or update the profile to have role `'teacher'`:
   ```sql
   UPDATE public.profiles
   SET role = 'teacher', display_name = 'Ms. Priya (Grade 3)'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'teacher@bloomi.edu');
   ```

### B. Creating a Provisioned Student Account
1. In Supabase Dashboard, go to **Authentication > Users** > **Add User** > **Create User**.
2. Enter email: `student_01@bloomi.internal` and a password (e.g. `adventure2026`).
3. Check "Auto Confirm User".
4. In the **SQL Editor**, link the student's registration number and avatar:
   ```sql
   UPDATE public.profiles
   SET role = 'student',
       display_name = 'Leo Adams',
       registration_number = 'BLOOMI-3A-01',
       avatar_id = 'lion',
       grade_level = 3
   WHERE id = (SELECT id FROM auth.users WHERE email = 'student_01@bloomi.internal');
   ```

---

## 6. Testing the Security Controls

1. **Role Tamper Protection:**
   Attempting to update a profile's `role` to `'teacher'` from the client will fail because of the PostgreSQL trigger `prevent_profile_role_tampering`.
2. **Row-Level Security (RLS):**
   Students can only query their own row in `profiles`. Teachers can only query student rows belonging to classes they teach.
3. **No Credential Leakage:**
   The client never receives student emails, registration number mappings, or administrative keys.
