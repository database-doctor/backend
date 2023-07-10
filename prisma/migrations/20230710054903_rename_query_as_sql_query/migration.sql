/*
  Warnings:

  - You are about to drop the `Query` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_queryTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_userId_fkey";

-- DropForeignKey
ALTER TABLE "QueryColumnAccess" DROP CONSTRAINT "QueryColumnAccess_queryId_fkey";

-- DropForeignKey
ALTER TABLE "QueryTableAccess" DROP CONSTRAINT "QueryTableAccess_queryId_fkey";

-- DropTable
DROP TABLE "Query";

-- CreateTable
CREATE TABLE "SqlQuery" (
    "queryId" SERIAL NOT NULL,
    "statement" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "hasError" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "queryTypeId" INTEGER NOT NULL,

    CONSTRAINT "SqlQuery_pkey" PRIMARY KEY ("queryId")
);

-- AddForeignKey
ALTER TABLE "SqlQuery" ADD CONSTRAINT "SqlQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SqlQuery" ADD CONSTRAINT "SqlQuery_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SqlQuery" ADD CONSTRAINT "SqlQuery_queryTypeId_fkey" FOREIGN KEY ("queryTypeId") REFERENCES "QueryType"("queryTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryColumnAccess" ADD CONSTRAINT "QueryColumnAccess_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "SqlQuery"("queryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryTableAccess" ADD CONSTRAINT "QueryTableAccess_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "SqlQuery"("queryId") ON DELETE RESTRICT ON UPDATE CASCADE;
