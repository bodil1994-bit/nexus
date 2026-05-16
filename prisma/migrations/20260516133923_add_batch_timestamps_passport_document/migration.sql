/*
  Warnings:

  - Added the required column `updatedAt` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PassportDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "extractedFields" JSONB NOT NULL,
    "missingFields" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PassportDocument_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "manufacturerSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "rawInputText" TEXT,
    "sourceFormat" TEXT,
    "missingFieldsJson" TEXT,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "supplierNotifiedAt" DATETIME,
    "erpSyncedAt" DATETIME,
    "erpPayloadJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Batch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch" ("batchNumber", "erpPayloadJson", "erpSyncedAt", "id", "manufacturerSku", "missingFieldsJson", "orderId", "quantity", "rawInputText", "readinessScore", "sourceFormat", "status", "supplierNotifiedAt") SELECT "batchNumber", "erpPayloadJson", "erpSyncedAt", "id", "manufacturerSku", "missingFieldsJson", "orderId", "quantity", "rawInputText", "readinessScore", "sourceFormat", "status", "supplierNotifiedAt" FROM "Batch";
DROP TABLE "Batch";
ALTER TABLE "new_Batch" RENAME TO "Batch";
CREATE UNIQUE INDEX "Batch_orderId_batchNumber_key" ON "Batch"("orderId", "batchNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
