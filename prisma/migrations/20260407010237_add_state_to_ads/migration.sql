/*
  Warnings:

  - Added the required column `state` to the `ads` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL,
    "offer_type" TEXT NOT NULL,
    "price" REAL,
    "promotion_text" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "delivery_type" TEXT NOT NULL,
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
INSERT INTO "new_ads" ("admin_notes", "category_id", "city", "clicks_count", "created_at", "delivery_type", "expires_at", "external_link", "full_description", "id", "is_featured", "offer_type", "payment_amount", "payment_date", "payment_status", "price", "promotion_text", "published_at", "rejection_reason", "scheduled_date", "short_description", "status", "title", "updated_at", "user_id", "views_count", "whatsapp_contact") SELECT "admin_notes", "category_id", "city", "clicks_count", "created_at", "delivery_type", "expires_at", "external_link", "full_description", "id", "is_featured", "offer_type", "payment_amount", "payment_date", "payment_status", "price", "promotion_text", "published_at", "rejection_reason", "scheduled_date", "short_description", "status", "title", "updated_at", "user_id", "views_count", "whatsapp_contact" FROM "ads";
DROP TABLE "ads";
ALTER TABLE "new_ads" RENAME TO "ads";
CREATE INDEX "ads_user_id_idx" ON "ads"("user_id");
CREATE INDEX "ads_category_id_idx" ON "ads"("category_id");
CREATE INDEX "ads_status_idx" ON "ads"("status");
CREATE INDEX "ads_scheduled_date_idx" ON "ads"("scheduled_date");
CREATE INDEX "ads_published_at_idx" ON "ads"("published_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
