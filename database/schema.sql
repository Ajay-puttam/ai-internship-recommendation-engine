-- AI Internship Recommendation Engine
-- PostgreSQL Schema
-- Run: psql -U postgres -d internship_db -f schema.sql

-- ── Extensions ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree               VARCHAR(100),
    branch               VARCHAR(100),
    college              VARCHAR(255),
    skills               TEXT[] DEFAULT '{}',
    interests            TEXT[] DEFAULT '{}',
    location_preference  VARCHAR(255),
    internship_mode      VARCHAR(50) CHECK (internship_mode IN ('remote', 'onsite', 'hybrid')),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Resumes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url    TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Internships ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internships (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    company          VARCHAR(255) NOT NULL,
    domain           VARCHAR(100),
    skills_required  TEXT[] DEFAULT '{}',
    description      TEXT,
    location         VARCHAR(255),
    mode             VARCHAR(50) CHECK (mode IN ('remote', 'onsite', 'hybrid')),
    duration         VARCHAR(100),
    stipend          VARCHAR(100),
    apply_link       TEXT,
    source           VARCHAR(100)
);

-- ── Indexes ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id    ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id     ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_internships_domain  ON internships(domain);
CREATE INDEX IF NOT EXISTS idx_internships_mode    ON internships(mode);

-- ── Seed: sample internships ─────────────────────────────
INSERT INTO internships (title, company, domain, skills_required, description, location, mode, duration, stipend, apply_link, source)
VALUES
  ('Machine Learning Intern', 'TechCorp AI', 'AI / Machine Learning',
   ARRAY['Python', 'TensorFlow', 'scikit-learn'],
   'Work on NLP and computer vision projects with our AI research team.',
   'Bangalore', 'remote', '3 months', '₹20,000/month', 'https://example.com/apply/ml-intern', 'manual'),

  ('Data Science Intern', 'DataWave Analytics', 'Data Science',
   ARRAY['Python', 'Pandas', 'SQL', 'Power BI'],
   'Build dashboards and ML pipelines for business intelligence.',
   'Remote', 'remote', '2 months', '₹15,000/month', 'https://example.com/apply/ds-intern', 'manual'),

  ('Full Stack Developer Intern', 'BuildRight Technologies', 'Web Development',
   ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
   'Develop scalable web applications for enterprise clients.',
   'Hyderabad', 'onsite', '6 months', '₹18,000/month', 'https://example.com/apply/fullstack-intern', 'manual'),

  ('Cloud Engineering Intern', 'SkyNet Cloud', 'Cloud Computing',
   ARRAY['AWS', 'Terraform', 'Linux', 'Docker'],
   'Deploy and manage cloud infrastructure for SaaS products.',
   'Pune', 'hybrid', '3 months', '₹22,000/month', 'https://example.com/apply/cloud-intern', 'manual'),

  ('Cybersecurity Intern', 'SecureLayer', 'Cybersecurity',
   ARRAY['Ethical Hacking', 'Kali Linux', 'Network Security', 'Python'],
   'Perform security audits, penetration testing, and threat analysis.',
   'Delhi', 'onsite', '4 months', '₹16,000/month', 'https://example.com/apply/cyber-intern', 'manual')
ON CONFLICT DO NOTHING;
