-- 005_rls_policy_templates.sql
-- Row Level Security (RLS) templates for Supabase. REVIEW and ADAPT these templates
-- before enabling in production. They reference auth functions and JWT claims that
-- must be present in your auth tokens (role and department claims).

-- NOTE: Run these only after you understand/update JWT claims mapping for your auth provider.

-- Example: enable RLS on disruptions
-- ALTER TABLE disruptions ENABLE ROW LEVEL SECURITY;

-- Allow students to INSERT their own disruptions (student_id must equal auth.uid())
-- CREATE POLICY "Students can insert own disruptions" ON disruptions
--   FOR INSERT
--   WITH CHECK (student_id = auth.uid());

-- Allow students to SELECT their own disruptions
-- CREATE POLICY "Students can select own disruptions" ON disruptions
--   FOR SELECT USING (student_id = auth.uid());

-- Allow admins to SELECT disruptions for their department
-- This assumes you include a 'department' claim in JWT (e.g. jwt.claims.department)
-- CREATE POLICY "Admins can select department disruptions" ON disruptions
--   FOR SELECT USING (
--     auth.role() = 'admin' AND category = current_setting('request.jwt.claims.department', true)
--   );

-- Allow admins to UPDATE status/resolution for their department
-- CREATE POLICY "Admins can update department disruptions" ON disruptions
--   FOR UPDATE USING (
--     auth.role() = 'admin' AND category = current_setting('request.jwt.claims.department', true)
--   ) WITH CHECK (
--     auth.role() = 'admin' AND category = current_setting('request.jwt.claims.department', true)
--   );

-- Students can only read their notifications
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can read own notifications" ON notifications
--   FOR SELECT USING (user_id = auth.uid());

-- Audit logs: recommended to restrict to admin/system roles only
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can read audit logs" ON audit_logs
--   FOR SELECT USING (auth.role() = 'admin');

-- IMPORTANT: The `auth.role()` and `current_setting('request.jwt.claims.department', true)`
-- usages depend on how you map JWT claims into Postgres session settings. Supabase
-- can populate `request.jwt.claims.*` but you should confirm the exact shape of the JWT
-- and tests in your environment before enabling policies.
