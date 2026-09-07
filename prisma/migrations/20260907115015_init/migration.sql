-- CreateTable
CREATE TABLE "ata_items" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,4) NOT NULL,
    "supplier" VARCHAR(160) NOT NULL,
    "ata_number" VARCHAR(40) NOT NULL,
    "valid_until" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ata_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ata_items_ata_number_idx" ON "ata_items"("ata_number");
