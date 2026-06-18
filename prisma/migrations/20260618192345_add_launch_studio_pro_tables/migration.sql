-- AlterTable
ALTER TABLE "master_territories" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'United States';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "zelle_code" TEXT;

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_executions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tool_slug" TEXT NOT NULL,
    "input_json" JSONB,
    "output_json" JSONB,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_leads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "estimated_value" DOUBLE PRECISION,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_quotes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "quote_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_company" TEXT,
    "client_email" TEXT,
    "client_phone" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "issue_date" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "notes" TEXT,
    "line_items_json" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_invoices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "quote_id" TEXT,
    "invoice_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_company" TEXT,
    "client_email" TEXT,
    "client_phone" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3),
    "notes" TEXT,
    "line_items_json" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "email_subject" TEXT,
    "email_message" TEXT,
    "last_email_sent_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignee_name" TEXT,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolkit_directory_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "short_description" TEXT NOT NULL,
    "services_summary" TEXT,
    "badge_label" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolkit_directory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "display_number" TEXT,
    "waba_phone_id" TEXT,
    "session_ref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'disconnected',
    "risk_acknowledged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zap_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap_groups" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "connection_id" TEXT,
    "external_group_id" TEXT NOT NULL,
    "name" TEXT,
    "member_count" INTEGER,
    "last_extracted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zap_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap_group_extractions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "declared_purpose" TEXT NOT NULL,
    "limit_applied" INTEGER,
    "total_found" INTEGER,
    "total_imported" INTEGER,
    "total_skipped" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zap_group_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "phone_e164" TEXT NOT NULL,
    "display_name" TEXT,
    "email" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "source_type" TEXT NOT NULL DEFAULT 'group',
    "source_group_id" TEXT,
    "persona" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap_leads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'frio',
    "heat_score" INTEGER NOT NULL DEFAULT 0,
    "owner_id" TEXT,
    "estimated_value" DOUBLE PRECISION,
    "next_followup_at" TIMESTAMP(3),
    "first_contacted_at" TIMESTAMP(3),
    "became_hot_at" TIMESTAMP(3),
    "last_interaction_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zap_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_status_history" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "reason" TEXT,
    "changed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_events" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB,
    "detected_intent" TEXT,
    "sentiment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap_messages" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "body" TEXT,
    "template_id" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "external_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zap_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "tone" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "body" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT,
    "action" TEXT NOT NULL,
    "basis" TEXT,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb7_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "raw_idea" TEXT NOT NULL,
    "brand_voice" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "channels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sb7_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb7_interview_sessions" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "answers" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sb7_interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb7_brandscripts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "hero_want" TEXT NOT NULL,
    "problem_external" TEXT NOT NULL,
    "problem_internal" TEXT NOT NULL,
    "problem_philosophical" TEXT NOT NULL,
    "villain" TEXT,
    "empathy" TEXT NOT NULL,
    "authority" JSONB NOT NULL,
    "planProcess" JSONB NOT NULL,
    "planAgreement" JSONB,
    "cta_direct" TEXT NOT NULL,
    "cta_transitional" TEXT,
    "stakes" JSONB NOT NULL,
    "success" JSONB NOT NULL,
    "one_liner" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sb7_brandscripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb7_collateral" (
    "id" TEXT NOT NULL,
    "brandscript_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wireframe" JSONB NOT NULL,
    "leadGenerator" JSONB,
    "nurtureEmails" JSONB,
    "salesEmails" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sb7_collateral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_app_runs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "artifact_type" TEXT NOT NULL,
    "artifact_status" TEXT NOT NULL DEFAULT 'pending',
    "total_estimated_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_actual_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_latency_ms" INTEGER NOT NULL DEFAULT 0,
    "total_llm_calls" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_app_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_llm_calls" (
    "id" TEXT NOT NULL,
    "premium_run_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "provider_slug" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "actual_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_ms" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premium_llm_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_channels" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "primary_offer" TEXT,
    "target_audience" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tone" TEXT,
    "goal" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "weekly_frequency" INTEGER NOT NULL DEFAULT 2,
    "include_shorts" BOOLEAN NOT NULL DEFAULT true,
    "include_lives" BOOLEAN NOT NULL DEFAULT false,
    "competitor_channels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "focus_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "content_restrictions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_content_plans" (
    "id" TEXT NOT NULL,
    "premium_run_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_videos" INTEGER,
    "total_shorts" INTEGER,
    "total_posts" INTEGER,
    "strategy_summary" TEXT,
    "calendar_json" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "youtube_content_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_content_items" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "hook" TEXT,
    "script_json" JSONB,
    "seo_pack" JSONB,
    "social_pack" JSONB,
    "carousel_json" JSONB,
    "captions_json" JSONB,
    "thumbnail_brief" JSONB,
    "thumbnail_url" TEXT,
    "cta" TEXT,
    "quality_score" DOUBLE PRECISION,
    "warnings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "youtube_content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_trends_cache" (
    "id" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "city" TEXT,
    "trend_data" JSONB NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_trends_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_network_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "basic_idea" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_network_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_network_campaigns" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "premium_run_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "dor_principal" TEXT NOT NULL,
    "medo" TEXT NOT NULL,
    "sonho" TEXT NOT NULL,
    "promessa" TEXT NOT NULL,
    "prova_social" TEXT NOT NULL,
    "escassez" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_network_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_network_contents" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "framework" TEXT,
    "pronomes_ok" BOOLEAN NOT NULL DEFAULT true,
    "readability_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_network_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "initial_briefing" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "launch_type" TEXT,
    "fidelity_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "launch_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_interview_answers" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "step_number" INTEGER NOT NULL,
    "step_slug" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "coach_tip_shown" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "launch_interview_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_dossiers" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "payload" JSONB NOT NULL,
    "pdf_url" TEXT,
    "zip_url" TEXT,
    "markdown_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "launch_dossiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_phases" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "phase_slug" TEXT NOT NULL,
    "scheduled_date" DATE,
    "triggers_activated" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "copy_blocks" JSONB,
    "status" TEXT NOT NULL DEFAULT 'planned',

    CONSTRAINT "launch_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_triggers_map" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "trigger_name" TEXT NOT NULL,
    "phase_slug" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 5,
    "implementation_notes" TEXT,

    CONSTRAINT "launch_triggers_map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tool_executions_user_id_created_at_idx" ON "tool_executions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "tool_executions_tool_slug_idx" ON "tool_executions"("tool_slug");

-- CreateIndex
CREATE INDEX "toolkit_leads_user_id_status_idx" ON "toolkit_leads"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_leads_created_at_idx" ON "toolkit_leads"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "toolkit_quotes_quote_number_key" ON "toolkit_quotes"("quote_number");

-- CreateIndex
CREATE INDEX "toolkit_quotes_user_id_status_idx" ON "toolkit_quotes"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_quotes_lead_id_idx" ON "toolkit_quotes"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "toolkit_invoices_invoice_number_key" ON "toolkit_invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "toolkit_invoices_user_id_status_idx" ON "toolkit_invoices"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_invoices_lead_id_idx" ON "toolkit_invoices"("lead_id");

-- CreateIndex
CREATE INDEX "toolkit_invoices_quote_id_idx" ON "toolkit_invoices"("quote_id");

-- CreateIndex
CREATE INDEX "toolkit_projects_user_id_status_idx" ON "toolkit_projects"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_tasks_user_id_status_idx" ON "toolkit_tasks"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_tasks_project_id_status_idx" ON "toolkit_tasks"("project_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_directory_entries_user_id_status_idx" ON "toolkit_directory_entries"("user_id", "status");

-- CreateIndex
CREATE INDEX "toolkit_directory_entries_status_category_idx" ON "toolkit_directory_entries"("status", "category");

-- CreateIndex
CREATE INDEX "zap_connections_user_id_idx" ON "zap_connections"("user_id");

-- CreateIndex
CREATE INDEX "zap_groups_user_id_idx" ON "zap_groups"("user_id");

-- CreateIndex
CREATE INDEX "zap_group_extractions_user_id_idx" ON "zap_group_extractions"("user_id");

-- CreateIndex
CREATE INDEX "zap_group_extractions_group_id_idx" ON "zap_group_extractions"("group_id");

-- CreateIndex
CREATE INDEX "contacts_user_id_source_group_id_idx" ON "contacts"("user_id", "source_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_user_id_phone_e164_key" ON "contacts"("user_id", "phone_e164");

-- CreateIndex
CREATE INDEX "zap_leads_user_id_status_idx" ON "zap_leads"("user_id", "status");

-- CreateIndex
CREATE INDEX "zap_leads_user_id_heat_score_idx" ON "zap_leads"("user_id", "heat_score" DESC);

-- CreateIndex
CREATE INDEX "zap_leads_user_id_next_followup_at_idx" ON "zap_leads"("user_id", "next_followup_at");

-- CreateIndex
CREATE INDEX "lead_status_history_lead_id_idx" ON "lead_status_history"("lead_id");

-- CreateIndex
CREATE INDEX "lead_events_lead_id_created_at_idx" ON "lead_events"("lead_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "lead_events_user_id_idx" ON "lead_events"("user_id");

-- CreateIndex
CREATE INDEX "zap_messages_lead_id_created_at_idx" ON "zap_messages"("lead_id", "created_at");

-- CreateIndex
CREATE INDEX "zap_messages_user_id_idx" ON "zap_messages"("user_id");

-- CreateIndex
CREATE INDEX "message_templates_user_id_idx" ON "message_templates"("user_id");

-- CreateIndex
CREATE INDEX "consent_log_contact_id_action_idx" ON "consent_log"("contact_id", "action");

-- CreateIndex
CREATE INDEX "consent_log_user_id_idx" ON "consent_log"("user_id");

-- CreateIndex
CREATE INDEX "sb7_projects_user_id_idx" ON "sb7_projects"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sb7_projects_user_id_name_key" ON "sb7_projects"("user_id", "name");

-- CreateIndex
CREATE INDEX "sb7_interview_sessions_project_id_idx" ON "sb7_interview_sessions"("project_id");

-- CreateIndex
CREATE INDEX "sb7_brandscripts_project_id_is_current_idx" ON "sb7_brandscripts"("project_id", "is_current");

-- CreateIndex
CREATE UNIQUE INDEX "sb7_brandscripts_project_id_version_key" ON "sb7_brandscripts"("project_id", "version");

-- CreateIndex
CREATE INDEX "sb7_collateral_brandscript_id_idx" ON "sb7_collateral"("brandscript_id");

-- CreateIndex
CREATE INDEX "premium_app_runs_user_id_idx" ON "premium_app_runs"("user_id");

-- CreateIndex
CREATE INDEX "premium_llm_calls_premium_run_id_idx" ON "premium_llm_calls"("premium_run_id");

-- CreateIndex
CREATE INDEX "youtube_channels_user_id_idx" ON "youtube_channels"("user_id");

-- CreateIndex
CREATE INDEX "youtube_content_plans_user_id_idx" ON "youtube_content_plans"("user_id");

-- CreateIndex
CREATE INDEX "youtube_content_plans_channel_id_idx" ON "youtube_content_plans"("channel_id");

-- CreateIndex
CREATE INDEX "youtube_content_items_plan_id_idx" ON "youtube_content_items"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "youtube_trends_cache_niche_city_key" ON "youtube_trends_cache"("niche", "city");

-- CreateIndex
CREATE INDEX "social_network_projects_user_id_idx" ON "social_network_projects"("user_id");

-- CreateIndex
CREATE INDEX "social_network_campaigns_project_id_idx" ON "social_network_campaigns"("project_id");

-- CreateIndex
CREATE INDEX "social_network_contents_campaign_id_idx" ON "social_network_contents"("campaign_id");

-- CreateIndex
CREATE INDEX "launch_projects_user_id_idx" ON "launch_projects"("user_id");

-- CreateIndex
CREATE INDEX "launch_interview_answers_project_id_idx" ON "launch_interview_answers"("project_id");

-- CreateIndex
CREATE INDEX "launch_dossiers_project_id_idx" ON "launch_dossiers"("project_id");

-- CreateIndex
CREATE INDEX "launch_phases_dossier_id_idx" ON "launch_phases"("dossier_id");

-- CreateIndex
CREATE INDEX "launch_triggers_map_dossier_id_idx" ON "launch_triggers_map"("dossier_id");

-- AddForeignKey
ALTER TABLE "tool_executions" ADD CONSTRAINT "tool_executions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_leads" ADD CONSTRAINT "toolkit_leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_quotes" ADD CONSTRAINT "toolkit_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_quotes" ADD CONSTRAINT "toolkit_quotes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "toolkit_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_invoices" ADD CONSTRAINT "toolkit_invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_invoices" ADD CONSTRAINT "toolkit_invoices_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "toolkit_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_invoices" ADD CONSTRAINT "toolkit_invoices_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "toolkit_quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_projects" ADD CONSTRAINT "toolkit_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_tasks" ADD CONSTRAINT "toolkit_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_tasks" ADD CONSTRAINT "toolkit_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "toolkit_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolkit_directory_entries" ADD CONSTRAINT "toolkit_directory_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_connections" ADD CONSTRAINT "zap_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_groups" ADD CONSTRAINT "zap_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_groups" ADD CONSTRAINT "zap_groups_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "zap_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_group_extractions" ADD CONSTRAINT "zap_group_extractions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_group_extractions" ADD CONSTRAINT "zap_group_extractions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "zap_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_source_group_id_fkey" FOREIGN KEY ("source_group_id") REFERENCES "zap_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_leads" ADD CONSTRAINT "zap_leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_leads" ADD CONSTRAINT "zap_leads_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "zap_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "zap_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_messages" ADD CONSTRAINT "zap_messages_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "zap_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zap_messages" ADD CONSTRAINT "zap_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_log" ADD CONSTRAINT "consent_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_log" ADD CONSTRAINT "consent_log_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb7_projects" ADD CONSTRAINT "sb7_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb7_interview_sessions" ADD CONSTRAINT "sb7_interview_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "sb7_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb7_brandscripts" ADD CONSTRAINT "sb7_brandscripts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "sb7_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb7_collateral" ADD CONSTRAINT "sb7_collateral_brandscript_id_fkey" FOREIGN KEY ("brandscript_id") REFERENCES "sb7_brandscripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_app_runs" ADD CONSTRAINT "premium_app_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_llm_calls" ADD CONSTRAINT "premium_llm_calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_llm_calls" ADD CONSTRAINT "premium_llm_calls_premium_run_id_fkey" FOREIGN KEY ("premium_run_id") REFERENCES "premium_app_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "youtube_channels" ADD CONSTRAINT "youtube_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "youtube_content_plans" ADD CONSTRAINT "youtube_content_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "youtube_content_plans" ADD CONSTRAINT "youtube_content_plans_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "youtube_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "youtube_content_items" ADD CONSTRAINT "youtube_content_items_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "youtube_content_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_network_projects" ADD CONSTRAINT "social_network_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_network_campaigns" ADD CONSTRAINT "social_network_campaigns_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "social_network_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_network_contents" ADD CONSTRAINT "social_network_contents_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "social_network_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_projects" ADD CONSTRAINT "launch_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_interview_answers" ADD CONSTRAINT "launch_interview_answers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "launch_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_dossiers" ADD CONSTRAINT "launch_dossiers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "launch_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_phases" ADD CONSTRAINT "launch_phases_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "launch_dossiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_triggers_map" ADD CONSTRAINT "launch_triggers_map_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "launch_dossiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
