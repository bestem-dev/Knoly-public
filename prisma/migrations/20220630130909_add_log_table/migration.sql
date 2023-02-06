-- CreateTable
CREATE TABLE "Log" (
    "level" TEXT NOT NULL,
    "meta" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "message" JSONB NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "log_timestamp_idx" ON "Log"("timestamp");
