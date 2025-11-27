-- 001_extensions_and_sequences.sql
-- Enable useful Postgres extensions and create sequences used by migrations

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable uuid-ossp (optional, for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequence for human-friendly disruption numbering (optional)
CREATE SEQUENCE IF NOT EXISTS disruption_seq START 1;

-- Set a timezone default for consistent timestamps (optional)
SET timezone = 'UTC';
