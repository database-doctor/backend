-- User table
INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt") VALUES ('adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt');
INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt") VALUES ('jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt');
INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt") VALUES ('malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

-- Permission table
INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES
(1, 'Read'),
(2, 'Write'),
(3, 'Execute');

-- Role table
INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES
(1, 'Admin', 1),
(2, 'Editor', 1),
(3, 'Viewer', 2);

-- RolePermissionMap table
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES
(1, 1, 1),
(1, 1, 2),
(2, 1, 2),
(2, 1, 3),
(3, 2, 1),
(3, 2, 3);

-- UserRoleMap table
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES
(1, 1, 1),
(1, 2, 1),
(2, 3, 2);

-- Project table
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdAt", "createdById")
VALUES
(1, 'Project 1', 'http://example.com/project1', '2023-06-20 12:34:56.789', 1),
(2, 'Project 2', 'http://example.com/project2', '2023-06-20 12:34:56.789', 2);

-- UserProjectToken table
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES
('token123', 1, 1),
('token456', 2, 2);

-- Schema table
INSERT INTO "Schema" ("schemaId", "schemaName", "createdAt", "projectId", "createdById")
VALUES
(1, 'Schema 1', '2023-06-20 12:34:56.789', 1, 1),
(2, 'Schema 2', '2023-06-20 12:34:56.789', 2, 2);

-- Table table
INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES
(1, 'Table 1', 1),
(2, 'Table 2', 1),
(3, 'Table 3', 2);

-- TableStorageSnapshot table
INSERT INTO "TableStorageSnapshot" ("createdAt", "rowCount", "sizeBytes", "tableId")
VALUES
('2023-06-20 12:34:56.789', 100, 1024, 1),
('2023-06-20 12:34:56.789', 200, 2048, 2),
('2023-06-20 12:34:56.789', 300, 3072, 3);
