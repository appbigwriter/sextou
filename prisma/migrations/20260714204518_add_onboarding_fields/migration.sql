-- AlterTable
ALTER TABLE "users" ADD COLUMN     "business_type" TEXT,
ADD COLUMN     "ideal_customer" TEXT,
ADD COLUMN     "main_sales_channel" TEXT,
ADD COLUMN     "preferred_language" TEXT NOT NULL DEFAULT 'pt-BR',
ADD COLUMN     "what_you_sell" TEXT;
