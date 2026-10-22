# BLOOMI Architecture & Technical Roadmap

## 1. Project Overview
**BLOOMI** is an inclusive, accessible educational web application tailored for Grade 3 learners, with particular focus on neurodiverse children and those with diverse literacy, speech, and communication support requirements (e.g., emerging readers, ADHD, autism spectrum, and AAC communicators).

---

## 2. Technical Stack (Stage 1 Foundation)
- **Runtime & Tooling:** Node.js, Vite 6, TypeScript 5
- **Frontend Core:** React 19, React Router v7
- **Styling & Design System:** Tailwind CSS v4 (`@tailwindcss/vite`), custom typography (`Lexend` & `Fredoka`)
- **Animation & Micro-interactions:** Framer Motion (respecting `prefers-reduced-motion`)
- **Icons & Assets:** Lucide React, scalable SVGs
- **Backend & Cloud (Future Stage 2+):** Supabase (PostgreSQL, Row Level Security, Auth, Storage)

---

## 3. Directory Layout
```text
Bloomi_APP/
├── docs/                      # Architectural, compliance, and design documents
│   └── ARCHITECTURE.md
├── public/                    # Static assets (favicons, SVGs, manifest)
│   └── bloomi-logo.svg
├── src/
│   ├── components/            # Reusable UI components (Navbar, Footer, WorldCard, etc.)
│   ├── data/                  # Static domain datasets (Learning Worlds, initial activities)
│   ├── layouts/               # Application-level structural frames (RootLayout)
│   ├── lib/                   # External client abstractions (Supabase client wrapper)
│   ├── pages/                 # Route views (HomePage, StudentLogin, TeacherLogin, etc.)
│   ├── services/              # API & Data access abstractions
│   ├── types/                 # Domain and TypeScript interfaces
│   ├── App.tsx                # Client-side router declarations
│   ├── index.css              # Tailwind CSS v4 imports and accessibility styling
│   ├── main.tsx               # Application bootstrap
│   └── vite-env.d.ts          # Vite client environment typing
├── .env.example               # Environment variables template
├── .gitignore                 # Secrets and build ignore rules
├── .oxlintrc.json             # Code linting configuration
├── index.html                 # Accessible HTML5 document root
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # Application TypeScript compiler settings
├── tsconfig.node.json         # Tooling TypeScript compiler settings
└── vite.config.ts             # Vite bundler configuration
```

---

## 4. Universal Design for Learning (UDL) Principles
1. **Sensory Comfort:** Soft background palettes with high-contrast toggle option.
2. **Accessible Typography:** Open, differentiated fonts (`Lexend` and `Fredoka`) to mitigate letter confusion and dyslexia stress.
3. **Paced Interactions:** No sudden loud buzzer sounds or anxiety-inducing timers.
4. **Motion Safety:** Automatic reduction of motion when `prefers-reduced-motion` is enabled or manually toggled.

---

## 5. Implementation Roadmap
- [x] **Stage 1 (Current):** Foundation & Structure — Vite + React + TS setup, Tailwind v4, accessible routing, learning world previews, clean repository initialization.
- [ ] **Stage 2:** Supabase Authentication & Student/Teacher Profiles with Row Level Security.
- [ ] **Stage 3:** Interactive Mini-Games for the 4 Learning Worlds (Writing, Speaking, Visual, Social).
- [ ] **Stage 4:** Teacher Analytics & Progress Insights.
- [ ] **Stage 5:** Humanoid-robot & IoT integration hooks (optional modular extension).
