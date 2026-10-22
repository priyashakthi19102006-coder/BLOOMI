# BLOOMI 🌸
> **An Inclusive Learning Adventure for Grade 3 Learners**

BLOOMI is an inclusive, accessible educational web application engineered specifically for Grade 3 children, accommodating learners with diverse literacy, speech, communication, and sensory support needs.

---

## ✨ Features
- **Four Core Learning Worlds:**
  - ✍️ **Writing World:** Word Garden of Wonders (sentence structures, phonics, story creation).
  - 🗣️ **Speaking World:** Echo Valley of Voices (speech clarity, pronunciation adventures, AAC cues).
  - 🔍 **Visual Discovery:** Prism Meadow Explorer (visual memory, symbol-to-word matching, spatial discovery).
  - 🤝 **Social Adventure:** Kindness Kingdom (empathy scenarios, turn-taking, emotion detectives).
- **Stage 2 Supabase Authentication & Security:**
  - **Educator Auth:** Email/password login with database-verified role validation and protected educator dashboard.
  - **Student Auth:** School-issued registration number + secret password resolved server-side through a Supabase Edge Function without exposing private student emails or service-role keys.
  - **Row-Level Security (RLS):** Fully enabled across `profiles`, `classes`, and `class_students` with PostgreSQL role tampering prevention triggers.
- **Built-in Accessibility & Sensory Controls:**
  - High-contrast mode toggle for visual clarity.
  - Scalable, dyslexia-friendly typography (`Lexend` and `Fredoka`).
  - Reduced-motion toggles for sensory comfort.
  - Responsive cross-device layouts for desktops, iPads, and smartphones.

---

## 🛠️ Technology Stack
- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL with RLS & Edge Functions)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)

---

## 📋 Prerequisites
- **Node.js:** v18.0.0 or later (v24+ recommended)
- **npm:** v9.0.0 or later
- Supabase account (free tier compatible)

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/priyashakthi19102006-coder/BLOOMI.git
   cd Bloomi_APP
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example template to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your public Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   ```
   *(Note: The app will run gracefully even with placeholder variables, displaying helpful notices on login pages until credentials are supplied).*

4. **Run Database Migrations & Deploy Edge Function:**
   Follow the detailed guide in [docs/SUPABASE_SETUP.md](file:///c:/Users/priya%20shakthi/OneDrive/Desktop/Bloomi_APP/docs/SUPABASE_SETUP.md) to apply the migration:
   - `supabase/migrations/20261022000001_initial_auth_and_profiles.sql`
   - Deploy `supabase/functions/student-login/index.ts`

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Verification & Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Compiles TypeScript and runs production Vite bundle |
| `npm run lint` | Runs oxlint checks across source code |
| `npm run test` | Executes unit and authorization tests with Vitest |
| `npm run preview` | Previews production build locally |

---

## 🔒 Security & Privacy Practices
- **No Hardcoded Secrets:** Sensitive keys must never be committed to Git. `.gitignore` excludes all `.env*` files except `.env.example`.
- **Privileged Credentials Isolated:** The `SUPABASE_SERVICE_ROLE_KEY` is never used client-side; student registration lookup is performed strictly in Supabase Edge Functions.
- **PostgreSQL Role Protection:** Users cannot alter their own `role` or `registration_number` via client queries due to PostgreSQL `BEFORE UPDATE` trigger enforcement.
- **COPPA & Learner Privacy Conscious:** Student records, voice recordings, and activity logs are strictly isolated and anonymized.

---

## 🌐 Future Deployment (Vercel)
The production bundle is optimized for deployment on Vercel:
1. Connect the GitHub repository in the Vercel dashboard.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel Environment Variables.

---

## 📄 License
Private &bull; Confidential Educational Software
