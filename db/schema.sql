-- CreateEnum
CREATE TYPE "ColumnType" AS ENUM ('BIGINT', 'BOOLEAN', 'CHAR', 'DATE', 'DECIMAL', 'DOUBLE', 'INTEGER', 'NUMERIC', 'REAL', 'SMALLINT', 'TEXT', 'TIME', 'TIMESTAMP', 'VARCHAR', 'SERIAL');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Permission" (
    "pid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "Role" (
    "rid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pid" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("rid")
);

-- CreateTable
CREATE TABLE "RolePermissionMap" (
    "rid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,

    CONSTRAINT "RolePermissionMap_pkey" PRIMARY KEY ("rid","pid")
);

-- CreateTable
CREATE TABLE "UserRoleMap" (
    "uid" INTEGER NOT NULL,
    "rid" INTEGER NOT NULL,

    CONSTRAINT "UserRoleMap_pkey" PRIMARY KEY ("uid","rid")
);

-- CreateTable
CREATE TABLE "Project" (
    "pid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dbUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "UserProjectToken" (
    "token" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,

    CONSTRAINT "UserProjectToken_pkey" PRIMARY KEY ("uid","pid")
);

-- CreateTable
CREATE TABLE "Schema" (
    "sid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pid" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Table" (
    "tid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sid" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("tid")
);

-- CreateTable
CREATE TABLE "TableSnapshot" (
    "tsid" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rowCount" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "tid" INTEGER NOT NULL,

    CONSTRAINT "TableSnapshot_pkey" PRIMARY KEY ("tsid")
);

-- CreateTable
CREATE TABLE "Column" (
    "cid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ColumnType" NOT NULL,
    "tid" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "Job" (
    "jid" SERIAL NOT NULL,
    "statement" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,
    "issuedById" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jid")
);

-- CreateTable
CREATE TABLE "JobTableAccess" (
    "jid" INTEGER NOT NULL,
    "tid" INTEGER NOT NULL,

    CONSTRAINT "JobTableAccess_pkey" PRIMARY KEY ("jid","tid")
);

-- CreateTable
CREATE TABLE "JobColumnAccess" (
    "jid" INTEGER NOT NULL,
    "cid" INTEGER NOT NULL,

    CONSTRAINT "JobColumnAccess_pkey" PRIMARY KEY ("jid","cid")
);

-- CreateTable
CREATE TABLE "Alert" (
    "aid" SERIAL NOT NULL,
    "condExpr" TEXT NOT NULL,
    "returnExpr" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sid" INTEGER NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "AlertHistory" (
    "ahid" SERIAL NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aid" INTEGER NOT NULL,

    CONSTRAINT "AlertHistory_pkey" PRIMARY KEY ("ahid")
);

-- CreateTable
CREATE TABLE "AlertUserMap" (
    "aid" INTEGER NOT NULL,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "AlertUserMap_pkey" PRIMARY KEY ("aid","uid")
);

-- CreateTable
CREATE TABLE "AlertRoleMap" (
    "aid" INTEGER NOT NULL,
    "rid" INTEGER NOT NULL,

    CONSTRAINT "AlertRoleMap_pkey" PRIMARY KEY ("aid","rid")
);

-- CreateTable
CREATE TABLE "AlertNotification" (
    "anid" SERIAL NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aid" INTEGER NOT NULL,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "AlertNotification_pkey" PRIMARY KEY ("anid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Role_pid_idx" ON "Role"("pid");

-- CreateIndex
CREATE INDEX "Project_createdById_createdAt_idx" ON "Project"("createdById", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserProjectToken_token_key" ON "UserProjectToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Schema_name_key" ON "Schema"("name");

-- CreateIndex
CREATE INDEX "Schema_pid_createdAt_idx" ON "Schema"("pid", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Table_sid_name_key" ON "Table"("sid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Column_tid_name_key" ON "Column"("tid", "name");

-- CreateIndex
CREATE INDEX "AlertNotification_uid_issuedAt_idx" ON "AlertNotification"("uid", "issuedAt" DESC);

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Role"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Permission"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Role"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectToken" ADD CONSTRAINT "UserProjectToken_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectToken" ADD CONSTRAINT "UserProjectToken_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_sid_fkey" FOREIGN KEY ("sid") REFERENCES "Schema"("sid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableSnapshot" ADD CONSTRAINT "TableSnapshot_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Table"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Table"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTableAccess" ADD CONSTRAINT "JobTableAccess_jid_fkey" FOREIGN KEY ("jid") REFERENCES "Job"("jid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTableAccess" ADD CONSTRAINT "JobTableAccess_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Table"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobColumnAccess" ADD CONSTRAINT "JobColumnAccess_jid_fkey" FOREIGN KEY ("jid") REFERENCES "Job"("jid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobColumnAccess" ADD CONSTRAINT "JobColumnAccess_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Column"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_sid_fkey" FOREIGN KEY ("sid") REFERENCES "Schema"("sid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertUserMap" ADD CONSTRAINT "AlertUserMap_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertUserMap" ADD CONSTRAINT "AlertUserMap_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRoleMap" ADD CONSTRAINT "AlertRoleMap_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRoleMap" ADD CONSTRAINT "AlertRoleMap_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Role"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertNotification" ADD CONSTRAINT "AlertNotification_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertNotification" ADD CONSTRAINT "AlertNotification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
