-- CreateEnum
CREATE TYPE "GarmentStatus" AS ENUM ('QUOTE', 'CONFIRMED', 'IN_PROGRESS', 'FITTING', 'FINISHING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Garment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "GarmentStatus" NOT NULL DEFAULT 'QUOTE',
    "price" DECIMAL(10,2),
    "deposit" DECIMAL(10,2),
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Garment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Garment" ADD CONSTRAINT "Garment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
