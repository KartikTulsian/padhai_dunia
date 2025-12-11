-- DropIndex
DROP INDEX "public"."Message_isRead_idx";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "courseId" TEXT;

-- CreateIndex
CREATE INDEX "Message_courseId_idx" ON "Message"("courseId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
