-- 004_seed_data.sql
-- Seed initial data for departments and a demo admin (adjust before production)

-- Departments
INSERT INTO departments (id, name) VALUES
  ('infrastructure', 'Infrastructure')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name) VALUES
  ('it', 'IT Department')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name) VALUES
  ('library', 'Library')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name) VALUES
  ('classroom', 'Classroom/Staff-room')
  ON CONFLICT (id) DO NOTHING;

-- Optional: create a demo admin user (replace email and handle password/auth in your auth system)
INSERT INTO users (id, email, role, admin_department, name)
VALUES (
  gen_random_uuid(),
  'admin@example.edu',
  'admin',
  'infrastructure',
  'Demo Admin'
) ON CONFLICT (email) DO NOTHING;

-- Optional: admin recognition code (for small deployments)
INSERT INTO admin_codes (id, department_id, code, is_active)
VALUES (gen_random_uuid(), 'infrastructure', 'ADMIN-CODE-1234', TRUE)
ON CONFLICT DO NOTHING;
