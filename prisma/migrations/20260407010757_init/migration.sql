/*
  Warnings:

  - You are about to drop the column `permissions` on the `admin_users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admin_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_actions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_admin_actions" ("action_type", "admin_id", "created_at", "details", "entity_id", "entity_type", "id") SELECT "action_type", "admin_id", "created_at", "details", "entity_id", "entity_type", "id" FROM "admin_actions";
DROP TABLE "admin_actions";
ALTER TABLE "new_admin_actions" RENAME TO "admin_actions";
CREATE INDEX "admin_actions_admin_id_idx" ON "admin_actions"("admin_id");
CREATE INDEX "admin_actions_entity_type_entity_id_idx" ON "admin_actions"("entity_type", "entity_id");
CREATE TABLE "new_admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MODERATOR',
    "last_login" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_admin_users" ("created_at", "email", "full_name", "id", "last_login", "password_hash", "role", "updated_at") SELECT "created_at", "email", "full_name", "id", "last_login", "password_hash", "role", "updated_at" FROM "admin_users";
DROP TABLE "admin_users";
ALTER TABLE "new_admin_users" RENAME TO "admin_users";
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
CREATE TABLE "new_ads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL,
    "offer_type" TEXT NOT NULL DEFAULT 'PRODUCT',
    "price" REAL,
    "promotion_text" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "delivery_type" TEXT NOT NULL DEFAULT 'LOCAL',
    "external_link" TEXT,
    "whatsapp_contact" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_amount" REAL,
    "payment_date" DATETIME,
    "scheduled_date" DATETIME,
    "published_at" DATETIME,
    "expires_at" DATETIME,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "clicks_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "rejection_reason" TEXT,
    "admin_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ads_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ads" ("admin_notes", "category_id", "city", "clicks_count", "created_at", "delivery_type", "expires_at", "external_link", "full_description", "id", "is_featured", "offer_type", "payment_amount", "payment_date", "payment_status", "price", "promotion_text", "published_at", "rejection_reason", "scheduled_date", "short_description", "state", "status", "title", "updated_at", "user_id", "views_count", "whatsapp_contact") SELECT "admin_notes", "category_id", "city", "clicks_count", "created_at", "delivery_type", "expires_at", "external_link", "full_description", "id", "is_featured", "offer_type", "payment_amount", "payment_date", "payment_status", "price", "promotion_text", "published_at", "rejection_reason", "scheduled_date", "short_description", "state", "status", "title", "updated_at", "user_id", "views_count", "whatsapp_contact" FROM "ads";
DROP TABLE "ads";
ALTER TABLE "new_ads" RENAME TO "ads";
CREATE INDEX "ads_user_id_idx" ON "ads"("user_id");
CREATE INDEX "ads_category_id_idx" ON "ads"("category_id");
CREATE INDEX "ads_status_idx" ON "ads"("status");
CREATE TABLE "new_coupons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "discount_value" REAL NOT NULL,
    "valid_from" DATETIME NOT NULL,
    "valid_until" DATETIME NOT NULL,
    "max_uses" INTEGER NOT NULL,
    "times_used" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_coupons" ("code", "created_at", "discount_type", "discount_value", "id", "is_active", "max_uses", "times_used", "valid_from", "valid_until") SELECT "code", "created_at", "discount_type", "discount_value", "id", "is_active", "max_uses", "times_used", "valid_from", "valid_until" FROM "coupons";
DROP TABLE "coupons";
ALTER TABLE "new_coupons" RENAME TO "coupons";
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");
CREATE TABLE "new_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad_id" TEXT NOT NULL,
    "user_name" TEXT,
    "user_email" TEXT,
    "user_phone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEBSITE_CLICK',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leads_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leads" ("ad_id", "created_at", "id", "ip_address", "source", "user_agent", "user_email", "user_name", "user_phone") SELECT "ad_id", "created_at", "id", "ip_address", "source", "user_agent", "user_email", "user_name", "user_phone" FROM "leads";
DROP TABLE "leads";
ALTER TABLE "new_leads" RENAME TO "leads";
CREATE INDEX "leads_ad_id_idx" ON "leads"("ad_id");
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IN_APP',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("created_at", "id", "message", "sent_at", "status", "subject", "type", "user_id") SELECT "created_at", "id", "message", "sent_at", "status", "subject", "type", "user_id" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "payment_method" TEXT NOT NULL DEFAULT 'ZELLE',
    "transaction_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_proof_url" TEXT,
    "confirmed_by" TEXT,
    "confirmed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_payments" ("ad_id", "amount", "confirmed_at", "confirmed_by", "created_at", "id", "payment_method", "payment_proof_url", "status", "transaction_id", "updated_at", "user_id") SELECT "ad_id", "amount", "confirmed_at", "confirmed_by", "created_at", "id", "payment_method", "payment_proof_url", "status", "transaction_id", "updated_at", "user_id" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE INDEX "payments_ad_id_idx" ON "payments"("ad_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");
CREATE TABLE "new_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("description", "id", "key", "updated_at", "value") SELECT "description", "id", "key", "updated_at", "value" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
