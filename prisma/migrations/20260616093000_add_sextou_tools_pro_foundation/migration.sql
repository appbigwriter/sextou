-- CreateTable
CREATE TABLE "sextou_tools_pro_generations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "input_data" JSONB NOT NULL,
    "output_data" JSONB NOT NULL,
    "output_text" TEXT NOT NULL,
    "metadata_json" JSONB,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "model" TEXT NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "source_action" TEXT NOT NULL DEFAULT 'GENERATE',
    "source_generation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sextou_tools_pro_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sextou_tools_pro_prompt_templates" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "schema_name" TEXT NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "schema_json" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sextou_tools_pro_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sextou_tools_pro_usage_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "generation_id" TEXT,
    "action_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sextou_tools_pro_usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sextou_tools_pro_generations_user_id_app_id_created_at_idx" ON "sextou_tools_pro_generations"("user_id", "app_id", "created_at");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_generations_user_id_status_created_at_idx" ON "sextou_tools_pro_generations"("user_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_generations_source_generation_id_idx" ON "sextou_tools_pro_generations"("source_generation_id");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_prompt_templates_app_id_is_active_idx" ON "sextou_tools_pro_prompt_templates"("app_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "sextou_tools_pro_prompt_templates_app_id_version_key" ON "sextou_tools_pro_prompt_templates"("app_id", "version");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_usage_events_user_id_created_at_idx" ON "sextou_tools_pro_usage_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_usage_events_user_id_app_id_created_at_idx" ON "sextou_tools_pro_usage_events"("user_id", "app_id", "created_at");

-- CreateIndex
CREATE INDEX "sextou_tools_pro_usage_events_generation_id_action_type_idx" ON "sextou_tools_pro_usage_events"("generation_id", "action_type");

-- AddForeignKey
ALTER TABLE "sextou_tools_pro_generations" ADD CONSTRAINT "sextou_tools_pro_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sextou_tools_pro_generations" ADD CONSTRAINT "sextou_tools_pro_generations_source_generation_id_fkey" FOREIGN KEY ("source_generation_id") REFERENCES "sextou_tools_pro_generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sextou_tools_pro_usage_events" ADD CONSTRAINT "sextou_tools_pro_usage_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sextou_tools_pro_usage_events" ADD CONSTRAINT "sextou_tools_pro_usage_events_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "sextou_tools_pro_generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
