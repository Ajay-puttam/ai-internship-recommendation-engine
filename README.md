# 🤖 AI-Based Internship Recommendation Engine

> A production-grade full-stack web application that recommends the top 3–5 internships to students using AI — built with Next.js, FastAPI, and PostgreSQL.

---

## 📁 Project Structure

```
major_project1/
├── frontend/          # Next.js 14 (TypeScript + TailwindCSS + Framer Motion)
├── backend/           # Python FastAPI (JWT Auth + SQLAlchemy)
├── database/          # PostgreSQL schema.sql + seed data
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** (local or [Supabase](https://supabase.com))

---

### 1. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE internship_db;"

# Run the schema (creates tables + seeds 5 internships)
psql -U postgres -d internship_db -f database/schema.sql
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET_KEY

# Start the server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**
Swagger docs: **http://localhost:8000/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, How it Works, Features) |
| `/login` | Email + Password login / register (tabbed) |
| `/profile-setup` | 3-step profile wizard |
| `/dashboard` | Dashboard with feature cards |
| `/dashboard/recommendations` | AI-matched internship cards |
| `/dashboard/skill-insights` | Skill gap analysis (Phase 2) |
| `/dashboard/resume` | Resume NLP analysis (Phase 2) |
| `/dashboard/chatbot` | Multilingual chatbot (Phase 2) |

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register with name/email/password |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| POST | `/api/auth/logout` | ❌ | Logout (client deletes token) |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/profile` | ✅ | Create/update profile |
| GET | `/api/profile` | ✅ | Get profile |
| GET | `/api/internships` | ❌ | List internships (filterable) |
| GET | `/api/recommendations` | ✅ | Get AI recommendations |

---

## 🔒 Authentication

- Passwords hashed with **bcrypt** via `passlib`
- JWT tokens signed with **HS256** via `python-jose`
- Token stored in `localStorage` + cookie (for Next.js middleware)
- Protected routes: `/dashboard/*`, `/profile-setup`

---

## 🗄️ Database Schema

```
users       — id, name, email, password_hash, created_at
profiles    — user_id, degree, branch, college, skills[], interests[], location, mode
resumes     — id, user_id, file_url, uploaded_at
internships — id, title, company, domain, skills[], location, mode, stipend, apply_link
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Framer Motion, Lucide Icons |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic v2 |
| Auth | bcrypt + JWT (python-jose) |
| Database | PostgreSQL |
| Deploy | Frontend → Vercel, Backend → Render, DB → Supabase |

---

## 🔭 Roadmap (Phase 2)

- [ ] NLP resume parser (spaCy / HuggingFace)
- [ ] Hybrid ML recommendation engine (content + collaborative)
- [ ] Skill gap analyzer with learning roadmap
- [ ] Multilingual chatbot (Hindi, Tamil, Telugu...)
- [ ] PM Internship Scheme dataset integration
- [ ] Kaggle internship dataset scraper
