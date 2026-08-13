-- CreateEnum
CREATE TYPE "MatchStage" AS ENUM ('GROUP', 'SEMIFINAL', 'FINAL');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "bracketSlot" INTEGER,
ADD COLUMN     "stage" "MatchStage" NOT NULL DEFAULT 'GROUP',
ADD COLUMN     "winnerId" TEXT;

-- AlterTable
ALTER TABLE "Sport" ADD COLUMN     "scoreLabel" TEXT NOT NULL DEFAULT 'Mata';

-- CreateIndex
CREATE INDEX "Match_divisionId_stage_idx" ON "Match"("divisionId", "stage");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
