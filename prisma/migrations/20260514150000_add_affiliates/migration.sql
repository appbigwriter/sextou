-- AlterTable
ALTER TABLE "users" ADD COLUMN "affiliate_id" TEXT;
ALTER TABLE "users" ADD COLUMN "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
