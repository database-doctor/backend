/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `UserProjectToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProjectToken_accessToken_key" ON "UserProjectToken"("accessToken");
