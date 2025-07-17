/*
  Warnings:

  - Added the required column `server_id` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "server_id" TEXT NOT NULL;
