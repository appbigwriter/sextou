-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  business_name text NOT NULL,
  whatsapp text NOT NULL,
  instagram text,
  website text,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL DEFAULT 'United States'::text,
  profile_image text,
  status text NOT NULL DEFAULT 'ACTIVE'::text,
  is_vip boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  affiliate_id text,
  balance double precision NOT NULL DEFAULT 0,
  has_active_ads boolean NOT NULL DEFAULT false,
  is_premium boolean NOT NULL DEFAULT false,
  premium_plan_slug text,
  premium_since timestamp without time zone,
  premium_expires_at timestamp without time zone,
  zelle_code text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id)
);
CREATE TABLE public.categories (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  icon text,
  order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ads (
  id text NOT NULL,
  user_id text NOT NULL,
  category_id text NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  offer_type text NOT NULL DEFAULT 'PRODUCT'::text,
  price double precision,
  promotion_text text,
  city text NOT NULL,
  state text,
  delivery_type text NOT NULL DEFAULT 'LOCAL'::text,
  external_link text,
  whatsapp_contact text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT'::text,
  payment_status text NOT NULL DEFAULT 'PENDING'::text,
  payment_amount double precision,
  payment_date timestamp without time zone,
  scheduled_date timestamp without time zone,
  published_at timestamp without time zone,
  expires_at timestamp without time zone,
  views_count integer NOT NULL DEFAULT 0,
  clicks_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  rejection_reason text,
  admin_notes text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  latitude double precision,
  longitude double precision,
  image_orientation text NOT NULL DEFAULT 'VERTICAL'::text,
  CONSTRAINT ads_pkey PRIMARY KEY (id),
  CONSTRAINT ads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT ads_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.ad_images (
  id text NOT NULL,
  ad_id text NOT NULL,
  image_url text NOT NULL,
  order integer NOT NULL DEFAULT 0,
  uploaded_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ad_images_pkey PRIMARY KEY (id),
  CONSTRAINT ad_images_ad_id_fkey FOREIGN KEY (ad_id) REFERENCES public.ads(id)
);
CREATE TABLE public.ad_videos (
  id text NOT NULL,
  ad_id text NOT NULL,
  video_url text NOT NULL,
  uploaded_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ad_videos_pkey PRIMARY KEY (id),
  CONSTRAINT ad_videos_ad_id_fkey FOREIGN KEY (ad_id) REFERENCES public.ads(id)
);
CREATE TABLE public.payments (
  id text NOT NULL,
  ad_id text NOT NULL,
  user_id text NOT NULL,
  amount double precision NOT NULL,
  payment_method text NOT NULL DEFAULT 'ZELLE'::text,
  transaction_id text,
  status text NOT NULL DEFAULT 'PENDING'::text,
  payment_proof_url text,
  confirmed_by text,
  confirmed_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  transaction_date timestamp without time zone,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_ad_id_fkey FOREIGN KEY (ad_id) REFERENCES public.ads(id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.leads (
  id text NOT NULL,
  ad_id text NOT NULL,
  user_name text,
  user_email text,
  user_phone text,
  source text NOT NULL DEFAULT 'WEBSITE_CLICK'::text,
  ip_address text,
  user_agent text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_ad_id_fkey FOREIGN KEY (ad_id) REFERENCES public.ads(id)
);
CREATE TABLE public.admin_users (
  id text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'MODERATOR'::text,
  last_login timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.admin_actions (
  id text NOT NULL,
  admin_id text NOT NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  details text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_actions_pkey PRIMARY KEY (id),
  CONSTRAINT admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_users(id)
);
CREATE TABLE public.coupons (
  id text NOT NULL,
  code text NOT NULL,
  discount_type text NOT NULL DEFAULT 'PERCENTAGE'::text,
  discount_value double precision NOT NULL,
  valid_from timestamp without time zone NOT NULL,
  valid_until timestamp without time zone NOT NULL,
  max_uses integer NOT NULL,
  times_used integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id text NOT NULL,
  user_id text NOT NULL,
  type text NOT NULL DEFAULT 'IN_APP'::text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'::text,
  sent_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.settings (
  id text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.password_reset_tokens (
  id text NOT NULL,
  user_id text NOT NULL,
  token text NOT NULL,
  expires_at timestamp without time zone NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.affiliate_territories (
  id text NOT NULL,
  affiliate_id text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  territory_id text NOT NULL,
  CONSTRAINT affiliate_territories_pkey PRIMARY KEY (id),
  CONSTRAINT affiliate_territories_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id),
  CONSTRAINT affiliate_territories_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.master_territories(id)
);
CREATE TABLE public.master_territories (
  id text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  country text NOT NULL DEFAULT 'United States'::text,
  CONSTRAINT master_territories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sextou_tools_pro_generations (
  id text NOT NULL,
  user_id text NOT NULL,
  app_id text NOT NULL,
  title text NOT NULL,
  input_data jsonb NOT NULL,
  output_data jsonb NOT NULL,
  output_text text NOT NULL,
  metadata_json jsonb,
  language text NOT NULL DEFAULT 'pt-BR'::text,
  model text NOT NULL,
  prompt_version text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE'::text,
  is_favorite boolean NOT NULL DEFAULT false,
  source_action text NOT NULL DEFAULT 'GENERATE'::text,
  source_generation_id text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT sextou_tools_pro_generations_pkey PRIMARY KEY (id),
  CONSTRAINT sextou_tools_pro_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT sextou_tools_pro_generations_source_generation_id_fkey FOREIGN KEY (source_generation_id) REFERENCES public.sextou_tools_pro_generations(id)
);
CREATE TABLE public.sextou_tools_pro_prompt_templates (
  id text NOT NULL,
  app_id text NOT NULL,
  version text NOT NULL,
  model text NOT NULL,
  schema_name text NOT NULL,
  system_prompt text NOT NULL,
  schema_json jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT sextou_tools_pro_prompt_templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sextou_tools_pro_usage_events (
  id text NOT NULL,
  user_id text NOT NULL,
  app_id text NOT NULL,
  generation_id text,
  action_type text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sextou_tools_pro_usage_events_pkey PRIMARY KEY (id),
  CONSTRAINT sextou_tools_pro_usage_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT sextou_tools_pro_usage_events_generation_id_fkey FOREIGN KEY (generation_id) REFERENCES public.sextou_tools_pro_generations(id)
);
CREATE TABLE public.videos (
  id text NOT NULL,
  title text NOT NULL,
  youtube_url text NOT NULL,
  description text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT videos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tool_executions (
  id text NOT NULL,
  user_id text NOT NULL,
  tool_slug text NOT NULL,
  input_json jsonb,
  output_json jsonb,
  metadata_json jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT tool_executions_pkey PRIMARY KEY (id),
  CONSTRAINT tool_executions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.toolkit_leads (
  id text NOT NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  source text NOT NULL DEFAULT 'MANUAL'::text,
  status text NOT NULL DEFAULT 'NEW'::text,
  estimated_value double precision,
  notes text,
  tags ARRAY DEFAULT ARRAY[]::text[],
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_leads_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.toolkit_quotes (
  id text NOT NULL,
  user_id text NOT NULL,
  lead_id text,
  quote_number text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT'::text,
  title text NOT NULL,
  client_name text NOT NULL,
  client_company text,
  client_email text,
  client_phone text,
  currency text NOT NULL DEFAULT 'USD'::text,
  issue_date timestamp without time zone NOT NULL,
  valid_until timestamp without time zone,
  notes text,
  line_items_json jsonb NOT NULL,
  subtotal double precision NOT NULL,
  tax_percent double precision NOT NULL DEFAULT 0,
  tax_amount double precision NOT NULL DEFAULT 0,
  discount_amount double precision NOT NULL DEFAULT 0,
  total double precision NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_quotes_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT toolkit_quotes_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.toolkit_leads(id)
);
CREATE TABLE public.toolkit_invoices (
  id text NOT NULL,
  user_id text NOT NULL,
  lead_id text,
  quote_id text,
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT'::text,
  title text NOT NULL,
  client_name text NOT NULL,
  client_company text,
  client_email text,
  client_phone text,
  currency text NOT NULL DEFAULT 'USD'::text,
  issue_date timestamp without time zone NOT NULL,
  due_date timestamp without time zone,
  notes text,
  line_items_json jsonb NOT NULL,
  subtotal double precision NOT NULL,
  tax_percent double precision NOT NULL DEFAULT 0,
  tax_amount double precision NOT NULL DEFAULT 0,
  discount_amount double precision NOT NULL DEFAULT 0,
  total double precision NOT NULL,
  email_subject text,
  email_message text,
  last_email_sent_at timestamp without time zone,
  paid_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT toolkit_invoices_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.toolkit_leads(id),
  CONSTRAINT toolkit_invoices_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.toolkit_quotes(id)
);
CREATE TABLE public.toolkit_projects (
  id text NOT NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'PLANNING'::text,
  priority text NOT NULL DEFAULT 'MEDIUM'::text,
  due_date timestamp without time zone,
  progress integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_projects_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.toolkit_tasks (
  id text NOT NULL,
  user_id text NOT NULL,
  project_id text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'TODO'::text,
  priority text NOT NULL DEFAULT 'MEDIUM'::text,
  assignee_name text,
  due_date timestamp without time zone,
  completed_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT toolkit_tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.toolkit_projects(id)
);
CREATE TABLE public.toolkit_directory_entries (
  id text NOT NULL,
  user_id text NOT NULL,
  business_name text NOT NULL,
  owner_name text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  phone text,
  whatsapp text,
  email text,
  instagram text,
  website text,
  short_description text NOT NULL,
  services_summary text,
  badge_label text,
  status text NOT NULL DEFAULT 'PENDING'::text,
  is_public boolean NOT NULL DEFAULT true,
  admin_notes text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT toolkit_directory_entries_pkey PRIMARY KEY (id),
  CONSTRAINT toolkit_directory_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.zap_connections (
  id text NOT NULL,
  user_id text NOT NULL,
  mode text NOT NULL,
  display_number text,
  waba_phone_id text,
  session_ref text,
  status text NOT NULL DEFAULT 'disconnected'::text,
  risk_acknowledged_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT zap_connections_pkey PRIMARY KEY (id),
  CONSTRAINT zap_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.zap_groups (
  id text NOT NULL,
  user_id text NOT NULL,
  connection_id text,
  external_group_id text NOT NULL,
  name text,
  member_count integer,
  last_extracted_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT zap_groups_pkey PRIMARY KEY (id),
  CONSTRAINT zap_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT zap_groups_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES public.zap_connections(id)
);
CREATE TABLE public.zap_group_extractions (
  id text NOT NULL,
  user_id text NOT NULL,
  group_id text NOT NULL,
  declared_purpose text NOT NULL,
  limit_applied integer,
  total_found integer,
  total_imported integer,
  total_skipped integer,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT zap_group_extractions_pkey PRIMARY KEY (id),
  CONSTRAINT zap_group_extractions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT zap_group_extractions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.zap_groups(id)
);
CREATE TABLE public.contacts (
  id text NOT NULL,
  user_id text NOT NULL,
  phone_e164 text NOT NULL,
  display_name text,
  email text,
  company text,
  notes text,
  source_type text NOT NULL DEFAULT 'group'::text,
  source_group_id text,
  persona text,
  tags ARRAY DEFAULT ARRAY[]::text[],
  is_valid boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT contacts_pkey PRIMARY KEY (id),
  CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT contacts_source_group_id_fkey FOREIGN KEY (source_group_id) REFERENCES public.zap_groups(id)
);
CREATE TABLE public.zap_leads (
  id text NOT NULL,
  user_id text NOT NULL,
  contact_id text NOT NULL,
  status text NOT NULL DEFAULT 'frio'::text,
  heat_score integer NOT NULL DEFAULT 0,
  owner_id text,
  estimated_value double precision,
  next_followup_at timestamp without time zone,
  first_contacted_at timestamp without time zone,
  became_hot_at timestamp without time zone,
  last_interaction_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT zap_leads_pkey PRIMARY KEY (id),
  CONSTRAINT zap_leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT zap_leads_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);
CREATE TABLE public.lead_status_history (
  id text NOT NULL,
  lead_id text NOT NULL,
  from_status text,
  to_status text NOT NULL,
  reason text,
  changed_by text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lead_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT lead_status_history_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.zap_leads(id)
);
CREATE TABLE public.lead_events (
  id text NOT NULL,
  lead_id text NOT NULL,
  user_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb,
  detected_intent text,
  sentiment text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lead_events_pkey PRIMARY KEY (id),
  CONSTRAINT lead_events_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.zap_leads(id),
  CONSTRAINT lead_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.zap_messages (
  id text NOT NULL,
  lead_id text NOT NULL,
  user_id text NOT NULL,
  direction text NOT NULL,
  channel text NOT NULL DEFAULT 'whatsapp'::text,
  body text,
  template_id text,
  ai_generated boolean NOT NULL DEFAULT false,
  status text,
  external_message_id text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT zap_messages_pkey PRIMARY KEY (id),
  CONSTRAINT zap_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.zap_leads(id),
  CONSTRAINT zap_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.message_templates (
  id text NOT NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  objective text,
  tone text,
  language text NOT NULL DEFAULT 'pt-BR'::text,
  body text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT message_templates_pkey PRIMARY KEY (id),
  CONSTRAINT message_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.consent_log (
  id text NOT NULL,
  user_id text NOT NULL,
  contact_id text,
  action text NOT NULL,
  basis text,
  source text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT consent_log_pkey PRIMARY KEY (id),
  CONSTRAINT consent_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT consent_log_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);
CREATE TABLE public.sb7_projects (
  id text NOT NULL,
  user_id text NOT NULL,
  app_id text NOT NULL,
  name text NOT NULL,
  target_audience text NOT NULL,
  raw_idea text NOT NULL,
  brand_voice text,
  language text NOT NULL DEFAULT 'pt-BR'::text,
  channels ARRAY DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT sb7_projects_pkey PRIMARY KEY (id),
  CONSTRAINT sb7_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.sb7_interview_sessions (
  id text NOT NULL,
  project_id text NOT NULL,
  user_id text NOT NULL,
  questions jsonb NOT NULL,
  answers jsonb,
  status text NOT NULL DEFAULT 'open'::text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT sb7_interview_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sb7_interview_sessions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.sb7_projects(id)
);
CREATE TABLE public.sb7_brandscripts (
  id text NOT NULL,
  project_id text NOT NULL,
  user_id text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  hero_want text NOT NULL,
  problem_external text NOT NULL,
  problem_internal text NOT NULL,
  problem_philosophical text NOT NULL,
  villain text,
  empathy text NOT NULL,
  authority jsonb NOT NULL,
  planProcess jsonb NOT NULL,
  planAgreement jsonb,
  cta_direct text NOT NULL,
  cta_transitional text,
  stakes jsonb NOT NULL,
  success jsonb NOT NULL,
  one_liner text NOT NULL,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sb7_brandscripts_pkey PRIMARY KEY (id),
  CONSTRAINT sb7_brandscripts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.sb7_projects(id)
);
CREATE TABLE public.sb7_collateral (
  id text NOT NULL,
  brandscript_id text NOT NULL,
  user_id text NOT NULL,
  wireframe jsonb NOT NULL,
  leadGenerator jsonb,
  nurtureEmails jsonb,
  salesEmails jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sb7_collateral_pkey PRIMARY KEY (id),
  CONSTRAINT sb7_collateral_brandscript_id_fkey FOREIGN KEY (brandscript_id) REFERENCES public.sb7_brandscripts(id)
);
CREATE TABLE public.premium_app_runs (
  id text NOT NULL,
  user_id text NOT NULL,
  app_id text NOT NULL,
  artifact_type text NOT NULL,
  artifact_status text NOT NULL DEFAULT 'pending'::text,
  total_estimated_cost double precision NOT NULL DEFAULT 0,
  total_actual_cost double precision NOT NULL DEFAULT 0,
  total_latency_ms integer NOT NULL DEFAULT 0,
  total_llm_calls integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT premium_app_runs_pkey PRIMARY KEY (id),
  CONSTRAINT premium_app_runs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.premium_llm_calls (
  id text NOT NULL,
  premium_run_id text NOT NULL,
  user_id text NOT NULL,
  app_id text NOT NULL,
  phase text NOT NULL,
  provider_slug text NOT NULL,
  model_id text NOT NULL,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  actual_cost double precision NOT NULL DEFAULT 0,
  latency_ms integer NOT NULL DEFAULT 0,
  status text NOT NULL,
  error_message text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT premium_llm_calls_pkey PRIMARY KEY (id),
  CONSTRAINT premium_llm_calls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT premium_llm_calls_premium_run_id_fkey FOREIGN KEY (premium_run_id) REFERENCES public.premium_app_runs(id)
);
CREATE TABLE public.youtube_channels (
  id text NOT NULL,
  user_id text NOT NULL,
  channel_name text NOT NULL,
  niche text NOT NULL,
  city text,
  state text,
  primary_offer text,
  target_audience ARRAY DEFAULT ARRAY[]::text[],
  tone text,
  goal text,
  language text NOT NULL DEFAULT 'pt-BR'::text,
  weekly_frequency integer NOT NULL DEFAULT 2,
  include_shorts boolean NOT NULL DEFAULT true,
  include_lives boolean NOT NULL DEFAULT false,
  competitor_channels ARRAY DEFAULT ARRAY[]::text[],
  focus_keywords ARRAY DEFAULT ARRAY[]::text[],
  content_restrictions ARRAY DEFAULT ARRAY[]::text[],
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT youtube_channels_pkey PRIMARY KEY (id),
  CONSTRAINT youtube_channels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.youtube_content_plans (
  id text NOT NULL,
  premium_run_id text NOT NULL,
  user_id text NOT NULL,
  channel_id text NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  total_videos integer,
  total_shorts integer,
  total_posts integer,
  strategy_summary text,
  calendar_json jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT youtube_content_plans_pkey PRIMARY KEY (id),
  CONSTRAINT youtube_content_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT youtube_content_plans_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.youtube_channels(id)
);
CREATE TABLE public.youtube_content_items (
  id text NOT NULL,
  plan_id text NOT NULL,
  item_type text NOT NULL,
  scheduled_date timestamp without time zone NOT NULL,
  title text,
  hook text,
  script_json jsonb,
  seo_pack jsonb,
  social_pack jsonb,
  carousel_json jsonb,
  captions_json jsonb,
  thumbnail_brief jsonb,
  thumbnail_url text,
  cta text,
  quality_score double precision,
  warnings jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT youtube_content_items_pkey PRIMARY KEY (id),
  CONSTRAINT youtube_content_items_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.youtube_content_plans(id)
);
CREATE TABLE public.youtube_trends_cache (
  id text NOT NULL,
  niche text NOT NULL,
  city text,
  trend_data jsonb NOT NULL,
  fetched_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamp without time zone NOT NULL,
  CONSTRAINT youtube_trends_cache_pkey PRIMARY KEY (id)
);
CREATE TABLE public.social_network_projects (
  id text NOT NULL,
  user_id text NOT NULL,
  project_name text NOT NULL,
  target_audience text NOT NULL,
  basic_idea text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT social_network_projects_pkey PRIMARY KEY (id),
  CONSTRAINT social_network_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.social_network_campaigns (
  id text NOT NULL,
  project_id text NOT NULL,
  premium_run_id text NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  dor_principal text NOT NULL,
  medo text NOT NULL,
  sonho text NOT NULL,
  promessa text NOT NULL,
  prova_social text NOT NULL,
  escassez text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  version integer NOT NULL DEFAULT 1,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT social_network_campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT social_network_campaigns_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.social_network_projects(id)
);
CREATE TABLE public.social_network_contents (
  id text NOT NULL,
  campaign_id text NOT NULL,
  content_type text NOT NULL,
  channel text NOT NULL,
  title text,
  body text NOT NULL,
  framework text,
  pronomes_ok boolean NOT NULL DEFAULT true,
  readability_score double precision,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT social_network_contents_pkey PRIMARY KEY (id),
  CONSTRAINT social_network_contents_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.social_network_campaigns(id)
);
CREATE TABLE public.launch_projects (
  id text NOT NULL,
  user_id text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  target_audience text NOT NULL,
  initial_briefing text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  launch_type text,
  fidelity_score double precision,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL,
  deleted_at timestamp without time zone,
  CONSTRAINT launch_projects_pkey PRIMARY KEY (id),
  CONSTRAINT launch_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.launch_interview_answers (
  id text NOT NULL,
  project_id text NOT NULL,
  step_number integer NOT NULL,
  step_slug text NOT NULL,
  answers jsonb NOT NULL,
  coach_tip_shown text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT launch_interview_answers_pkey PRIMARY KEY (id),
  CONSTRAINT launch_interview_answers_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.launch_projects(id)
);
CREATE TABLE public.launch_dossiers (
  id text NOT NULL,
  project_id text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  payload jsonb NOT NULL,
  pdf_url text,
  zip_url text,
  markdown_url text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT launch_dossiers_pkey PRIMARY KEY (id),
  CONSTRAINT launch_dossiers_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.launch_projects(id)
);
CREATE TABLE public.launch_phases (
  id text NOT NULL,
  dossier_id text NOT NULL,
  phase_slug text NOT NULL,
  scheduled_date date,
  triggers_activated ARRAY DEFAULT ARRAY[]::text[],
  copy_blocks jsonb,
  status text NOT NULL DEFAULT 'planned'::text,
  CONSTRAINT launch_phases_pkey PRIMARY KEY (id),
  CONSTRAINT launch_phases_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.launch_dossiers(id)
);
CREATE TABLE public.launch_triggers_map (
  id text NOT NULL,
  dossier_id text NOT NULL,
  trigger_name text NOT NULL,
  phase_slug text NOT NULL,
  intensity integer NOT NULL DEFAULT 5,
  implementation_notes text,
  CONSTRAINT launch_triggers_map_pkey PRIMARY KEY (id),
  CONSTRAINT launch_triggers_map_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.launch_dossiers(id)
);