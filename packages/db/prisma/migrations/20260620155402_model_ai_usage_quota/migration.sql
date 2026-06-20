-- CreateTable
CREATE TABLE "AIUsageQuota" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "tokenUsed" INTEGER NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "AIUsageQuota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIUsageQuota_userId_month_key" ON "AIUsageQuota"("userId", "month");

-- AddForeignKey
ALTER TABLE "AIUsageQuota" ADD CONSTRAINT "AIUsageQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
