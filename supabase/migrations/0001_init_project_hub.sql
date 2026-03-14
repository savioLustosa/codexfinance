CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE workspace_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'manager', 'member');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES app_user(id),
  plan workspace_plan NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_member (
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status project_status NOT NULL DEFAULT 'planning',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  created_by UUID REFERENCES app_user(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES app_user(id),
  due_date DATE,
  created_by UUID REFERENCES app_user(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE task_comment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES task(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES app_user(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_invite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  role member_role NOT NULL DEFAULT 'member',
  status invite_status NOT NULL DEFAULT 'pending',
  invited_by UUID NOT NULL REFERENCES app_user(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, invited_email)
);

CREATE TABLE activity_log (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES app_user(id),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_workspace ON project (workspace_id);
CREATE INDEX idx_task_project ON task (project_id);
CREATE INDEX idx_task_assignee ON task (assignee_id);
CREATE INDEX idx_activity_workspace_date ON activity_log (workspace_id, created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated BEFORE UPDATE ON app_user FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER trg_workspace_updated BEFORE UPDATE ON workspace FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER trg_project_updated BEFORE UPDATE ON project FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER trg_task_updated BEFORE UPDATE ON task FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
