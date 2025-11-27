-- 002_schema.sql
-- Core schema for CampusFlow

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student','admin')),
  admin_department TEXT REFERENCES departments(id),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Disruptions table
CREATE TABLE IF NOT EXISTS disruptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disruption_id TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  student_name TEXT,
  student_email TEXT,
  category TEXT NOT NULL REFERENCES departments(id),
  priority TEXT NOT NULL CHECK (priority IN ('high','low')),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','in_progress','resolved','archived')) DEFAULT 'pending',
  ai_tone TEXT,
  ai_confidence NUMERIC(4,3),
  ai_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Disruption images
CREATE TABLE IF NOT EXISTS disruption_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disruption_id UUID REFERENCES disruptions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT,
  filesize INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Resolutions table
CREATE TABLE IF NOT EXISTS resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disruption_id UUID REFERENCES disruptions(id) ON DELETE CASCADE,
  resolved_by UUID REFERENCES users(id),
  resolution_description TEXT NOT NULL,
  resolution_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI analysis history
CREATE TABLE IF NOT EXISTS ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disruption_id UUID REFERENCES disruptions(id) ON DELETE CASCADE,
  tone TEXT,
  confidence NUMERIC(4,3),
  recommendation TEXT,
  model_version TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  disruption_id UUID REFERENCES disruptions(id),
  channel TEXT NOT NULL CHECK (channel IN ('email','in_app','sms','push','webhook')),
  payload JSONB,
  sent_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin recognition codes (optional)
CREATE TABLE IF NOT EXISTS admin_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id TEXT REFERENCES departments(id),
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
