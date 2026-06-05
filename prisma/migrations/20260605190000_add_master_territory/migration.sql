-- CreateTable
CREATE TABLE "master_territories" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_territories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_territories_city_state_key" ON "master_territories"("city", "state");

-- Empty existing affiliate territories to avoid foreign key issues since we are dropping columns and adding a required relation.
DELETE FROM "affiliate_territories";

-- AlterTable
ALTER TABLE "affiliate_territories" DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN "territory_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "affiliate_territories_territory_id_idx" ON "affiliate_territories"("territory_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_territories_affiliate_id_territory_id_key" ON "affiliate_territories"("affiliate_id", "territory_id");

-- AddForeignKey
ALTER TABLE "affiliate_territories" ADD CONSTRAINT "affiliate_territories_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "master_territories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
