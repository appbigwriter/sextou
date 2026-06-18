ALTER TABLE "users"
ADD COLUMN "premium_plan_slug" TEXT,
ADD COLUMN "premium_since" TIMESTAMP(3),
ADD COLUMN "premium_expires_at" TIMESTAMP(3);
