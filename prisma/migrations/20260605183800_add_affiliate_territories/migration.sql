-- CreateTable
CREATE TABLE "affiliate_territories" (
    "id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_territories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_territories_affiliate_id_idx" ON "affiliate_territories"("affiliate_id");

-- AddForeignKey
ALTER TABLE "affiliate_territories" ADD CONSTRAINT "affiliate_territories_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
