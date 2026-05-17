-- CreateTable
CREATE TABLE "ErpIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturerId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ODOO',
    "baseUrl" TEXT NOT NULL,
    "database" TEXT,
    "username" TEXT,
    "apiKey" TEXT NOT NULL,
    "targetModel" TEXT NOT NULL DEFAULT 'stock.lot',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ErpIntegration_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ErpIntegration_manufacturerId_key" ON "ErpIntegration"("manufacturerId");
