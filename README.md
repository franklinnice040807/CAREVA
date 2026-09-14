# CAREVA

**AI-Verified Skill Passport & Employability Matching Platform**

> **Verify Skills. Connect Talent. Build Careers.**  
> Turning practical skills into trusted opportunities.

> *A certificate tells an employer what a student completed.  
> CAREVA helps demonstrate what the student can actually do.*

---

## Overview

CAREVA is a full-stack web platform that bridges vocational students and employers through:

1. **Practical skill demonstration** (video / image / document evidence)
2. **AI-assisted competency evaluation** (Demo Mode with structured rubrics)
3. **Verified Skill Passport** (digital credentials with public verification)
4. **Intelligent job matching** (weighted algorithm + skill gap analysis)
5. **Employer feedback loop** (post-hire performance ratings)

Built as a college innovation project for live demonstration to judges, academicians, industry experts, and students.

---

## Problem

Certificates alone often fail to communicate **practical competency**. Employers struggle to screen for real hands-on ability; students struggle to prove what they can do beyond paper credentials.

## Solution

```
Student Profile → Practical Demonstration → AI-Assisted Evaluation
→ Competency Score + Level → Verified Skill Passport + Credential ID
→ Employer Matching → Hiring Pipeline → Employer Feedback
```

---

## Features

| Area | Capabilities |
|------|----------------|
| **Students** | Profile, skills (self vs verified), practical demos, AI evaluation, Skill Passport, job matches, apply, career insights, notifications |
| **Employers** | Company profile, post jobs with required skills/levels, find talent, view passports, shortlist, application pipeline, post-hire feedback |
| **Admin** | Platform stats, analytics charts (trade, competency, skill demand, hiring), users, skills, submissions |
| **Public** | Landing page, credential verification at `/verify/:credentialId` |
| **AI** | Modular DemoAIProvider (swap-ready for OpenAI/Gemini) |
| **Matching** | Skill 40% · Competency 30% · Experience 15% · Location 10% · Education 5% |

---

## Technology Stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide, Recharts, Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt + role-based middleware |
| AI | DemoAIProvider (deterministic, rubric-based) |
| Uploads | Multer (local; path ready for S3) |

---

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

### Setup

```bash
cd careva

# Install dependencies
npm run setup
# or: npm install && cd server && npm install && cd ../client && npm install

# Configure environment
cp .env.example server/.env
# Edit server/.env → set DATABASE_URL

# Database
cd server
npx prisma migrate dev --name init
npx prisma db seed

# Run (from project root)
cd ..
npm run dev
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:5000  
- **Health:** http://localhost:5000/api/health  

---

## Environment Variables

See `.env.example`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/careva?schema=public
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
AI_PROVIDER=demo
AI_API_KEY=
```

Never commit real secrets.

---

## Demo Accounts

**Password for all:** `Demo@123`

| Role | Email | Notes |
|------|--------|--------|
| **Admin** | admin@careva.app | Analytics dashboard |
| **Student** | rahul.electrical@careva.demo | Verified electrical skills, matches, applications |
| **Student** | priya.welding@careva.demo | Verified welding skills |
| **Student** | amit.mechanical@careva.demo | Mechanical |
| **Employer** | hr@precisioneng.in | Jobs, shortlist, applications |
| **Employer** | careers@steelcraft.in | Welding roles |

**Sample public credential:** `CAREVA-VER-2026-100001`  
Open: http://localhost:5173/verify/CAREVA-VER-2026-100001

---

## Competition Demo Flow (~3 minutes)

### STEP 1 — Login as Student
`rahul.electrical@careva.demo` / `Demo@123`

### STEP 2 — Open Skill Passport
Sidebar → **Skill Passport**  
See verified skills (Industrial Wiring 86%, Motor Control 82%, PLC 68%), credential IDs, education, projects.

### STEP 3 — Submit Practical Demonstration
**Practical Demos** → Submit Demo  
- Skill: e.g. Panel Assembly  
- Title + detailed description (mention safety, tools, steps)  
- Tools & steps  
- Optional file  

### STEP 4 — Run AI Demo Evaluation
On the submission → **Run AI Evaluation**  
Watch Demo Mode banner, rubric scores, overall %, level.

### STEP 5 — Show Competency Score
Overall score + Beginner / Intermediate / Job-ready classification.

### STEP 6 — Verified Badge
If score ≥ 50 → skill verified, credential ID issued, Passport updates.

### STEP 7 — Switch to Employer
Logout → Login `hr@precisioneng.in` / `Demo@123`

### STEP 8 — Open Job
**Jobs** → Industrial Electrician (required skills + Job-ready).

### STEP 9 — Matched Candidates
**Find Talent** → filter Electrical → see Rahul with scores.

### STEP 10 — Candidate Skill Passport
View Passport modal → verified skills & scores only (private data hidden).

### STEP 11 — Skill Gaps
Student **Find Jobs** or **Career Insights** → gaps shown with recommendations.

### STEP 12 — Employer Feedback
Move application to **Hired** → **Feedback** (`/employer/feedback`) → rate 6 categories → appears on student Passport.

---

## SDG Alignment

| SDG | Connection |
|-----|------------|
| **4 Quality Education** | Validates practical learning outcomes beyond certificates |
| **8 Decent Work** | Matches verified skills to jobs; reduces skill mismatch |
| **9 Industry & Innovation** | AI-assisted evaluation + digital credentials as skills infrastructure |
| **17 Partnerships** | Connects institutes, students, and employers in one trust loop |

---

## Matching Algorithm

```
Overall = Skill×0.40 + Competency×0.30 + Experience×0.15 + Location×0.10 + Education×0.05
```

Weights are stored in `PlatformConfig` and configurable. Skill gaps return `MISSING` or `LEVEL_GAP` with actionable recommendations.

---

## AI System

```
AIProvider (interface)
  └── DemoAIProvider   ← default (AI_PROVIDER=demo)
  └── OpenAIProvider   ← future
  └── GeminiProvider   ← future
```

Demo mode scores from description quality, steps, tools, media type, trade keywords, and self-assessment — **without** claiming computer vision or external model inference. UI always labels **Demo Mode**.

---

## User Roles

| Role | Access |
|------|--------|
| Student | Profile, skills, demos, evaluation, passport, jobs, insights, notifications |
| Employer | Company, jobs, candidates, applications, shortlist, feedback |
| Admin | Stats, analytics, users, skills, submissions (seed only; no public register) |

---

## Phase Completion Status

| Phase | Status |
|-------|--------|
| 0 Architecture | Complete |
| 1 Foundation | Complete |
| 2 Student Platform | Complete |
| 3 AI Verification | Complete |
| 4 Employer Platform | Complete |
| 5 Matching Engine | Complete |
| 6 Feedback & Analytics | Complete |
| 7 Competition Polish | Complete |

---

## Future Scope

- Real AI providers (OpenAI Vision / Gemini) for media analysis  
- Cloud file storage (S3 / Cloudinary)  
- Institute admin role and bulk student import  
- Mobile app / PWA  
- Multi-language support  

---

## Scripts

```bash
npm run dev          # client + server
npm run db:migrate   # prisma migrate
npm run db:seed      # competition demo data
npm run db:studio    # Prisma Studio
```

---

## License

College innovation project — for educational and demonstration purposes.

---

**CAREVA** · Verify Skills. Connect Talent. Build Careers.
