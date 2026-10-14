-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "classroomId" TEXT;

-- CreateIndex
CREATE INDEX "Post_classroomId_idx" ON "Post"("classroomId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

