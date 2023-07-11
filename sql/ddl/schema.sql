-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,  -- TODO : MAKE USERNAME UNIQUE
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL, -- TODO : MAKE EMAIL UNIQUE
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permissionId" SERIAL NOT NULL,
    "permissionName" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permissionId")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId","projectId")
);

-- CreateTable
CREATE TABLE "RolePermissionMap" (
    "roleId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermissionMap_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserRoleMap" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "UserRoleMap_pkey" PRIMARY KEY ("userId","roleId","projectId")
);

-- CreateTable
CREATE TABLE "Project" (
    "projectId" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "connUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "UserProjectToken" (
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "UserProjectToken_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Schema" (
    "schemaId" SERIAL NOT NULL,
    "schemaName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("schemaId")
);

-- CreateTable
CREATE TABLE "Table" (
    "tableId" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "schemaId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("tableId")
);

-- CreateTable
CREATE TABLE "TableStorageSnapshot" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rowCount" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,

    CONSTRAINT "TableStorageSnapshot_pkey" PRIMARY KEY ("tableId","createdAt")
);

-- CreateTable
CREATE TABLE "ColumnType" (
    "columnTypeId" SERIAL NOT NULL,
    "columnTypeName" TEXT NOT NULL,

    CONSTRAINT "ColumnType_pkey" PRIMARY KEY ("columnTypeId")
);

-- CreateTable
CREATE TABLE "Column" (
    "columnId" SERIAL NOT NULL,
    "columnName" TEXT NOT NULL,
    "tableId" INTEGER NOT NULL,
    "columnTypeId" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("columnId")
);

-- CreateTable
CREATE TABLE "QueryType" (
    "queryTypeId" SERIAL NOT NULL,
    "queryTypeName" TEXT NOT NULL,

    CONSTRAINT "QueryType_pkey" PRIMARY KEY ("queryTypeId")
);

-- CreateTable
CREATE TABLE "Query" (
    "queryId" SERIAL NOT NULL,
    "statement" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "hasError" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "queryTypeId" INTEGER NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("queryId")
);

-- CreateTable
CREATE TABLE "QueryColumnAccess" (
    "queryId" INTEGER NOT NULL,
    "columnId" INTEGER NOT NULL,

    CONSTRAINT "QueryColumnAccess_pkey" PRIMARY KEY ("queryId","columnId")
);

-- CreateTable
CREATE TABLE "QueryTableAccess" (
    "queryId" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,

    CONSTRAINT "QueryTableAccess_pkey" PRIMARY KEY ("queryId","tableId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Table_schemaId_tableName_key" ON "Table"("schemaId", "tableName");

-- CreateIndex
CREATE UNIQUE INDEX "Column_tableId_columnName_key" ON "Column"("tableId", "columnName");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_roleId_projectId_fkey" FOREIGN KEY ("roleId", "projectId") REFERENCES "Role"("roleId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("permissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_roleId_projectId_fkey" FOREIGN KEY ("roleId", "projectId") REFERENCES "Role"("roleId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectToken" ADD CONSTRAINT "UserProjectToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectToken" ADD CONSTRAINT "UserProjectToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("schemaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableStorageSnapshot" ADD CONSTRAINT "TableStorageSnapshot_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("tableId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("tableId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_columnTypeId_fkey" FOREIGN KEY ("columnTypeId") REFERENCES "ColumnType"("columnTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_queryTypeId_fkey" FOREIGN KEY ("queryTypeId") REFERENCES "QueryType"("queryTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryColumnAccess" ADD CONSTRAINT "QueryColumnAccess_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("queryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryColumnAccess" ADD CONSTRAINT "QueryColumnAccess_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("columnId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryTableAccess" ADD CONSTRAINT "QueryTableAccess_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("queryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryTableAccess" ADD CONSTRAINT "QueryTableAccess_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("tableId") ON DELETE RESTRICT ON UPDATE CASCADE;
