-- 003_indexes_triggers.sql
-- Indexes, triggers and full-text search setup

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_disruptions_category_status ON disruptions(category, status);
CREATE INDEX IF NOT EXISTS idx_disruptions_created_at ON disruptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disruptions_student ON disruptions(student_id);
CREATE INDEX IF NOT EXISTS idx_images_disruption ON disruption_images(disruption_id);
CREATE INDEX IF NOT EXISTS idx_ai_disruption ON ai_analysis(disruption_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);

-- Trigger to update updated_at on disruptions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_disruptions_updated_at') THEN
    CREATE TRIGGER trg_disruptions_updated_at BEFORE UPDATE ON disruptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

-- Full-text search: tsvector column and trigger
ALTER TABLE disruptions ADD COLUMN IF NOT EXISTS description_tsv tsvector;

CREATE OR REPLACE FUNCTION disruptions_tsv_trigger() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.description_tsv := to_tsvector('english', coalesce(NEW.description,''));
  RETURN NEW;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_disruptions_tsv') THEN
    CREATE TRIGGER trg_disruptions_tsv BEFORE INSERT OR UPDATE
    ON disruptions FOR EACH ROW EXECUTE FUNCTION disruptions_tsv_trigger();
  END IF;
END$$;

-- GIN index for tsvector
CREATE INDEX IF NOT EXISTS idx_disruptions_description_tsv ON disruptions USING GIN(description_tsv);
