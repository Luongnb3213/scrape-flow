-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN "lasRunAt" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunId" TEXT;
ALTER TABLE "Workflow" ADD COLUMN "lastRunStatus" TEXT;
