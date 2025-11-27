-- 006_add_auth_uid.sql
-- Add auth_uid column to users to store external auth provider UID (e.g., Firebase uid)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_uid TEXT UNIQUE;

-- Index to lookup by auth_uid
CREATE INDEX IF NOT EXISTS idx_users_auth_uid ON users(auth_uid);
