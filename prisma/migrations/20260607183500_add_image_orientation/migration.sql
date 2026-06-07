-- AlterTable: add image_orientation column to ads
ALTER TABLE "ads" ADD COLUMN "image_orientation" TEXT NOT NULL DEFAULT 'VERTICAL';
