-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WORKSPACE_INVITE', 'WORKSPACE_JOIN_REQUEST', 'WORKSPACE_JOIN_ACCEPTED', 'CLASSROOM_ENROLLED', 'POST_COMMENT', 'POST_LIKE', 'NEW_FOLLOWER', 'ACCOUNT_WARNING', 'SECURITY_ALERT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "LessonKind" AS ENUM ('VIDEO', 'DOCUMENT', 'CANVAS', 'QUIZ');

-- AlterEnum
ALTER TYPE "CodePurpose" ADD VALUE 'LOGIN_2FA';

-- DropForeignKey
ALTER TABLE "WorkspaceFile" DROP CONSTRAINT "WorkspaceFile_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceFile" DROP CONSTRAINT "WorkspaceFile_workspaceId_fkey";

-- DropIndex
DROP INDEX "WorkspaceInvite_tokenHash_key";

-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "specialty" TEXT,
ADD COLUMN     "verificationDocUrl" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Canvas" ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "durationLabel" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "targetAudience" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "ClassroomEnrollment" DROP COLUMN "progress";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "heightMm" DECIMAL(10,2),
ADD COLUMN     "lengthMm" DECIMAL(10,2),
ADD COLUMN     "trade" TEXT,
ADD COLUMN     "weightKg" DECIMAL(10,2),
ADD COLUMN     "widthMm" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "searchIndexing" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkspaceInvite" DROP COLUMN "tokenHash",
ADD COLUMN     "declinedAt" TIMESTAMP(3),
ADD COLUMN     "token" TEXT NOT NULL,
ALTER COLUMN "expiresAt" DROP NOT NULL;

-- DropTable
DROP TABLE "WorkspaceFile";

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actorId" TEXT,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceJoinRequest" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "WorkspaceJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceActivity" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "actorId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasFolder" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasProduct" (
    "canvasId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasProduct_pkey" PRIMARY KEY ("canvasId","productId")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "LessonKind" NOT NULL,
    "position" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "body" TEXT,
    "resourceUrl" TEXT,
    "canvasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonCompletion" (
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonCompletion_pkey" PRIMARY KEY ("lessonId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_key_key" ON "Upload"("key");

-- CreateIndex
CREATE INDEX "Upload_ownerId_idx" ON "Upload"("ownerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceJoinRequest_workspaceId_userId_key" ON "WorkspaceJoinRequest"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "WorkspaceActivity_workspaceId_createdAt_idx" ON "WorkspaceActivity"("workspaceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CanvasFolder_workspaceId_name_key" ON "CanvasFolder"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_position_idx" ON "Lesson"("moduleId", "position");

-- CreateIndex
CREATE INDEX "LessonCompletion_userId_idx" ON "LessonCompletion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_token_key" ON "WorkspaceInvite"("token");

-- CreateIndex
CREATE INDEX "WorkspaceInvite_email_idx" ON "WorkspaceInvite"("email");

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceJoinRequest" ADD CONSTRAINT "WorkspaceJoinRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceJoinRequest" ADD CONSTRAINT "WorkspaceJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceActivity" ADD CONSTRAINT "WorkspaceActivity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceActivity" ADD CONSTRAINT "WorkspaceActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasFolder" ADD CONSTRAINT "CanvasFolder_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "CanvasFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasProduct" ADD CONSTRAINT "CanvasProduct_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasProduct" ADD CONSTRAINT "CanvasProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasProduct" ADD CONSTRAINT "CanvasProduct_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ClassroomModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

