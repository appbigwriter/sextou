-- Projetos de lançamento (multiusuário + múltiplos projetos)
CREATE TABLE launch_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  slug text NOT NULL,
  target_audience text NOT NULL,
  initial_briefing text NOT NULL,
  status text DEFAULT 'draft', -- draft | interviewing | planning | ready | launched | archived
  launch_type text, -- seed | internal | joint | evergreen | business
  fidelity_score numeric, -- 0-100 fidelidade à PLF
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Respostas da entrevista multi-step
CREATE TABLE launch_interview_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES launch_projects(id),
  step_number integer NOT NULL,
  step_slug text NOT NULL,
  answers jsonb NOT NULL,
  coach_tip_shown text,
  created_at timestamptz DEFAULT now()
);

-- Dossiês gerados
CREATE TABLE launch_dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES launch_projects(id),
  version integer DEFAULT 1,
  payload jsonb NOT NULL, -- avatar, offer, sequence, copy, triggers, calendar
  pdf_url text,
  zip_url text,
  markdown_url text,
  created_at timestamptz DEFAULT now()
);

-- Fases do plano PLF
CREATE TABLE launch_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES launch_dossiers(id),
  phase_slug text NOT NULL, -- pre_pre | plc1 | plc2 | plc3 | cart_open | cart_close
  scheduled_date date,
  triggers_activated text[],
  copy_blocks jsonb,
  status text DEFAULT 'planned'
);

-- Estímulos mentais ativados
CREATE TABLE launch_triggers_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES launch_dossiers(id),
  trigger_name text NOT NULL, -- authority | reciprocity | trust | anticipation | empathy | events | community | scarcity | social_proof
  phase_slug text NOT NULL,
  intensity integer DEFAULT 5,
  implementation_notes text
);