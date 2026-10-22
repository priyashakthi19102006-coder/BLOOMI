# BLOOMI 🌸
> **An Inclusive Learning Adventure for Grade 3 Learners**

BLOOMI is an inclusive, accessible educational web application engineered specifically for Grade 3 children, accommodating learners with diverse literacy, speech, communication, and sensory support needs.

---

## ✨ Features (Stage 1 Foundation)
- **Four Core Learning Worlds:**
  - ✍️ **Writing World:** Word Garden of Wonders (sentence structures, phonics, story creation).
  - 🗣️ **Speaking World:** Echo Valley of Voices (speech clarity, pronunciation adventures, AAC cues).
  - 🔍 **Visual Discovery:** Prism Meadow Explorer (visual memory, symbol-to-word matching, spatial discovery).
  - 🤝 **Social Adventure:** Kindness Kingdom (empathy scenarios, turn-taking, emotion detectives).
- **Built-in Accessibility & Sensory Controls:**
  - High-contrast mode toggle for visual clarity.
  - Scalable, dyslexia-friendly typography (`Lexend` and `Fredoka`).
  - Reduced-motion toggles for sensory comfort.
  - Responsive cross-device layouts for desktops, iPads, and smartphones.
- **Dedicated Portals:**
  - Student Adventure Hub with friendly avatar selection.
  - Educator & Therapist Portal for classroom management.

---

## 🛠️ Technology Stack
- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Future Backend:** [Supabase](https://supabase.com/)

---

## 📋 Prerequisites
- **Node.js:** v18.0.0 or later (v24+ recommended)
- **npm:** v9.0.0 or later
- Modern web browser (Chrome, Edge, Safari, Firefox)

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
   *(Note: For Stage 1, placeholder credentials are not required for local frontend preview).*

4. **Start the development server:**
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
| `npm run preview` | Previews production build locally |

---

## 🔒 Security & Privacy Practices
- **No Hardcoded Secrets:** Sensitive keys must never be committed to Git. `.gitignore` excludes all `.env*` files except `.env.example`.
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
