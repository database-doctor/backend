-- User table
INSERT INTO "User" ("userId", "username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('1', 'adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('2', 'jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('3', 'malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById") VALUES
    ('1', 'TestProject', 'http://example-url.com', '1');

INSERT INTO "QueryType" ("queryTypeId", "queryTypeName") VALUES
    ('1', 'SELECT'),
    ('2', 'INSERT'),
    ('3', 'UPDATE'),
    ('4', 'DELETE');

INSERT INTO "SqlQuery" ("queryId", "statement", "userId", "projectId", "queryTypeId") VALUES
    ('1', 'SELECT * FROM Table', '1', '1', '1');

INSERT INTO "Schema" ("schemaId", "schemaName", "projectId", "createdById") VALUES
    ('1', 'TestSchema', '1', '1');

INSERT INTO "Table" ("tableId", "tableName", "schemaId") VALUES 
    ('1', 'TestTable', '1');

INSERT INTO "QueryTableAccess" ("queryId", "tableId") VALUES 
    ('1', '1');

INSERT INTO "TableStorageSnapshot" ("rowCount", "sizeBytes", "tableId") VALUES
    ('0', '1', '1');

INSERT INTO "UserProjectToken" ("userId", "projectId", "accessToken") VALUES
    ('2', '1', 'SecretToken');

INSERT INTO "ColumnType" ("columnTypeId", "columnTypeName") VALUES
    ('1', 'INTEGER'),
    ('2', 'VARCHAR'),
    ('3', 'FLOAT'),
    ('4', 'BOOLEAN'),
    ('5', 'DATE');

INSERT INTO "Column" ("columnId", "columnName", "columnTypeId", "tableId") VALUES
    ('1', 'TestColumn', '1', '1');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user1', 'John Doe', 'john.doe@gmail.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'salta1');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user2', 'Jane Smith', 'jane.smith@gmail.com', '098f6bcd4621d373cade4e832627b4f6', 'saltb2');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user3', 'David Johnson', 'david.johnson@gmail.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 'saltc3');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user4', 'Sarah Williams', 'sarah.williams@gmail.com', '1bc29b36f623ba82aaf6724fd3b16718', 'saltd4');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user5', 'Michael Brown', 'michael.brown@gmail.com', 'e99a18c428cb38d5f260853678922e03', 'salte5');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user6', 'Lisa Davis', 'lisa.davis@gmail.com', 'fcea920f7412b5da7be0cf42b8c93759', 'saltf6');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user7', 'Robert Wilson', 'robert.wilson@gmail.com', '4d186321c1a7f0f354b297e8914ab240', 'saltg7');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user8', 'Karen Taylor', 'karen.taylor@gmail.com', '98f13708210194c475687be6106a3b84', 'salth8');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user9', 'Daniel Anderson', 'daniel.anderson@gmail.com', '3c59dc048e8850243be8079a5c74d079', 'salti9');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user10', 'Jessica Martinez', 'jessica.martinez@gmail.com', '1679091c5a880faf6fb5e6087eb1b2dc', 'saltj10');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user11', 'Christopher Thomas', 'christopher.thomas@gmail.com', 'ec370b3e67b01b8d4f09a5d2e26ce4b4', 'saltk11');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user12', 'Amanda Garcia', 'amanda.garcia@gmail.com', '5f6d01c20b6e4475e9a07f3a363058cf', 'saltl12');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user13', 'Matthew Martinez', 'matthew.martinez@gmail.com', '4b43b0aee35624cd95b910189b3dc231', 'saltm13');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user14', 'Elizabeth Wilson', 'elizabeth.wilson@gmail.com', 'b14a7b8059d9c055954c92674ce60032', 'saltn14');

INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt")
VALUES ('user15', 'Joshua Taylor', 'joshua.taylor@gmail.com', 'ebf0c674dfab1ec862bfb8d014203c41', 'salto15');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (1, 'Read');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (2, 'Write');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (3, 'Delete');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (4, 'Create');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (5, 'Update');

INSERT INTO "Permission" ("permissionId", "permissionName")
VALUES (6, 'Execute');

/* Role table is kind of confusing. Do we just want a generic set of roles or do we want product specific */

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (1, 'Administrator', 1);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (2, 'Manager', 1);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (3, 'Developer', 1);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (4, 'Tester', 2);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (5, 'Analyst', 2);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (6, 'Administrator', 3);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (7, 'Manager', 3);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (8, 'Developer', 3);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (9, 'Tester', 4);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (10, 'Analyst', 4);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (11, 'Administrator', 5);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (12, 'Manager', 5);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (13, 'Developer', 5);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (14, 'Tester', 5);

INSERT INTO "Role" ("roleId", "roleName", "projectId")
VALUES (15, 'Analyst', 5);

/* Previous comment above */

-- Mapping for Project ID 1
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (1, 1, 1); -- Administrator role has Read permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (2, 1, 2); -- Manager role has Write permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (3, 1, 3); -- Developer role has Delete permission

-- Mapping for Project ID 2
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (4, 2, 4); -- Tester role has Create permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (5, 2, 5); -- Analyst role has Update permission

-- Mapping for Project ID 3
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (6, 3, 1); -- Administrator role has Read permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (7, 3, 2); -- Manager role has Write permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (8, 3, 3); -- Developer role has Delete permission

-- Mapping for Project ID 4
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (9, 4, 4); -- Tester role has Create permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (10, 4, 5); -- Analyst role has Update permission

-- Mapping for Project ID 5
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (11, 5, 1); -- Administrator role has Read permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (12, 5, 2); -- Manager role has Write permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (13, 5, 3); -- Developer role has Delete permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (14, 5, 4); -- Tester role has Create permission
INSERT INTO "RolePermissionMap" ("roleId", "projectId", "permissionId")
VALUES (15, 5, 5); -- Analyst role has Update permission

-- Mapping for User ID 1 (User 1) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 1, 1); -- User 1 is mapped to Administrator role in Project 1

INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 2, 1); -- User 1 is mapped to Manager role in Project 1

-- Mapping for User ID 1 (User 1) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 3, 2); -- User 1 is mapped to Developer role in Project 2

-- Mapping for User ID 2 (User 2) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (2, 2, 1); -- User 2 is mapped to Manager role in Project 1

-- Mapping for User ID 3 (User 3) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (3, 3, 2); -- User 3 is mapped to Developer role in Project 2

-- Mapping for User ID 1 (User 1) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 1, 3); -- User 1 is mapped to Administrator role in Project 3

-- Mapping for User ID 2 (User 2) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (2, 2, 3); -- User 2 is mapped to Manager role in Project 3

-- Mapping for User ID 3 (User 3) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (3, 3, 3); -- User 3 is mapped to Developer role in Project 3

-- Mapping for User ID 1 (User 1) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 1, 4); -- User 1 is mapped to Administrator role in Project 4

-- Mapping for User ID 2 (User 2) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (2, 2, 4); -- User 2 is mapped to Manager role in Project 4

-- Mapping for User ID 3 (User 3) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (3, 3, 4); -- User 3 is mapped to Developer role in Project 4

-- Mapping for User ID 1 (User 1) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (1, 1, 5); -- User 1 is mapped to Administrator role in Project 5

-- Mapping for User ID 2 (User 2) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (2, 2, 5); -- User 2 is mapped to Manager role in Project 5

-- Mapping for User ID 3 (User 3) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (3, 3, 5); -- User 3 is mapped to Developer role in Project 5

-- Mapping for User ID 4 (User 4) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (4, 2, 1); -- User 4 is mapped to Manager role in Project 1

-- Mapping for User ID 4 (User 4) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (4, 5, 2); -- User 4 is mapped to Analyst role in Project 2

-- Mapping for User ID 4 (User 4) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (4, 7, 3); -- User 4 is mapped to Manager role in Project 3

-- Mapping for User ID 4 (User 4) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (4, 10, 4); -- User 4 is mapped to Analyst role in Project 4

-- Mapping for User ID 4 (User 4) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (4, 12, 5); -- User 4 is mapped to Manager role in Project 5

-- Mapping for User ID 5 (User 5) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (5, 3, 1); -- User 5 is mapped to Developer role in Project 1

-- Mapping for User ID 5 (User 5) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (5, 4, 2); -- User 5 is mapped to Tester role in Project 2

-- Mapping for User ID 5 (User 5) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (5, 8, 3); -- User 5 is mapped to Developer role in Project 3

-- Mapping for User ID 5 (User 5) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (5, 9, 4); -- User 5 is mapped to Tester role in Project 4

-- Mapping for User ID 5 (User 5) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (5, 13, 5); -- User 5 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 6 (User 6) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (6, 3, 1); -- User 6 is mapped to Developer role in Project 1

-- Mapping for User ID 6 (User 6) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (6, 4, 2); -- User 6 is mapped to Tester role in Project 2

-- Mapping for User ID 6 (User 6) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (6, 8, 3); -- User 6 is mapped to Developer role in Project 3

-- Mapping for User ID 6 (User 6) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (6, 9, 4); -- User 6 is mapped to Tester role in Project 4

-- Mapping for User ID 6 (User 6) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (6, 13, 5); -- User 6 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 7 (User 7) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (7, 2, 1); -- User 7 is mapped to Manager role in Project 1

-- Mapping for User ID 7 (User 7) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (7, 5, 2); -- User 7 is mapped to Analyst role in Project 2

-- Mapping for User ID 7 (User 7) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (7, 7, 3); -- User 7 is mapped to Manager role in Project 3

-- Mapping for User ID 7 (User 7) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (7, 10, 4); -- User 7 is mapped to Analyst role in Project 4

-- Mapping for User ID 7 (User 7) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (7, 12, 5); -- User 7 is mapped to Manager role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 8 (User 8) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (8, 3, 1); -- User 8 is mapped to Developer role in Project 1

-- Mapping for User ID 8 (User 8) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (8, 4, 2); -- User 8 is mapped to Tester role in Project 2

-- Mapping for User ID 8 (User 8) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (8, 8, 3); -- User 8 is mapped to Developer role in Project 3

-- Mapping for User ID 8 (User 8) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (8, 9, 4); -- User 8 is mapped to Tester role in Project 4

-- Mapping for User ID 8 (User 8) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (8, 13, 5); -- User 8 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 9 (User 9) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (9, 2, 1); -- User 9 is mapped to Manager role in Project 1

-- Mapping for User ID 9 (User 9) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (9, 5, 2); -- User 9 is mapped to Analyst role in Project 2

-- Mapping for User ID 9 (User 9) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (9, 7, 3); -- User 9 is mapped to Manager role in Project 3

-- Mapping for User ID 9 (User 9) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (9, 10, 4); -- User 9 is mapped to Analyst role in Project 4

-- Mapping for User ID 9 (User 9) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (9, 12, 5); -- User 9 is mapped to Manager role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 10 (User 10) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (10, 3, 1); -- User 10 is mapped to Developer role in Project 1

-- Mapping for User ID 10 (User 10) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (10, 4, 2); -- User 10 is mapped to Tester role in Project 2

-- Mapping for User ID 10 (User 10) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (10, 8, 3); -- User 10 is mapped to Developer role in Project 3

-- Mapping for User ID 10 (User 10) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (10, 9, 4); -- User 10 is mapped to Tester role in Project 4

-- Mapping for User ID 10 (User 10) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (10, 13, 5); -- User 10 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 11 (User 11) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 2, 1); -- User 11 is mapped toApologies for the previous incomplete response. Here are the remaining `INSERT` statements to map the rest of the users (11 to 15) to roles for each project and role combination:

-- Mapping for User ID 11 (User 11) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 2, 1); -- User 11 is mapped to Manager role in Project 1

-- Mapping for User ID 11 (User 11) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 5, 2); -- User 11 is mapped to Analyst role in Project 2

-- Mapping for User ID 11 (User 11) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 7, 3); -- User 11 is mapped to Manager role in Project 3

-- Mapping for User ID 11 (User 11) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 10, 4); -- User 11 is mapped to Analyst role in Project 4

-- Mapping for User ID 11 (User 11) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (11, 12, 5); -- User 11 is mapped to Manager role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 12 (User 12) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (12, 3, 1); -- User 12 is mapped to Developer role in Project 1

-- Mapping for User ID 12 (User 12) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (12, 4, 2); -- User 12 is mapped to Tester role in Project 2

-- Mapping for User ID 12 (User 12) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (12, 8, 3); -- User 12 is mapped to Developer role in Project 3

-- Mapping for User ID 12 (User 12) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (12, 9, 4); -- User 12 is mapped to Tester role in Project 4

-- Mapping for User ID 12 (User 12) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (12, 13, 5); -- User 12 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 13 (User 13) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (13, 2, 1); -- User 13 is mapped to Manager role in Project 1

-- Mapping for User ID 13 (User 13) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (13, 5, 2); -- User 13 is mapped to Analyst role in Project 2

-- Mapping for User ID 13 (User 13) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (13, 7, 3); -- User 13 is mapped to Manager role in Project 3

-- Mapping for User ID 13 (User 13) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (13, 10, 4); -- User 13 is mapped to Analyst role in Project 4

-- Mapping for User ID 13 (User 13) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (13, 12, 5); -- User 13 is mapped to Manager role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 14 (User 14) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (14, 3, 1); -- User 14 is mapped to Developer role in Project 1

-- Mapping for User ID 14 (User 14) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (14, 4, 2); -- User 14 is mapped to Tester role in Project 2

-- Mapping for User ID 14 (User 14) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (14, 8, 3); -- User 14 is mapped to Developer role in Project 3

-- Mapping for User ID 14 (User 14) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (14, 9, 4); -- User 14 is mapped to Tester role in Project 4

-- Mapping for User ID 14 (User 14) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (14, 13, 5); -- User 14 is mapped to Developer role in Project 5

-- Continue mapping for the remaining users and projects...

-- Mapping for User ID 15 (User 15) in Project 1
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (15, 2, 1); -- User 15 is mapped to Manager role in Project 1

-- Mapping for User ID 15 (User 15) in Project 2
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (15, 5, 2); -- User 15 is mapped to Analyst role in Project 2

-- Mapping for User ID 15 (User 15) in Project 3
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (15, 7, 3); -- User 15 is mapped to Manager role in Project 3

-- Mapping for User ID 15 (User 15) in Project 4
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (15, 10, 4); -- User 15 is mapped to Analyst role in Project 4

-- Mapping for User ID 15 (User 15) in Project 5
INSERT INTO "UserRoleMap" ("userId", "roleId", "projectId")
VALUES (15, 12, 5); -- User 15 is mapped to Manager role in Project 5

/* can Any user create project */

-- E-commerceDB
-- User 1 (createdById) has the Administrator role (roleId = 1)
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById")
VALUES (1, 'E-commerceDB', 'https://project1.example.com', 1);

-- EmployeesDB
-- User 1 (createdById) has the Administrator role (roleId = 1)
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById")
VALUES (2, 'EmployeesDB', 'https://project2.example.com', 1);

-- BooksDB
-- User 2 (createdById) has the Manager role (roleId = 2)
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById")
VALUES (3, 'BooksDB', 'https://project3.example.com', 2);

-- StudentsDB
-- User 2 (createdById) has the Manager role (roleId = 2)
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById")
VALUES (4, 'StudentsDB', 'https://project4.example.com', 2);

-- MoviesDB
-- User 3 (createdById) has the Developer role (roleId = 3)
INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById")
VALUES (5, 'MoviesDB', 'https://project5.example.com', 3);

/* Previous comment above */

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user1_project1', 1, 1); -- User 1, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user1_project2', 1, 2); -- User 1, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user1_project3', 1, 3); -- User 1, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user1_project4', 1, 4); -- User 1, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user1_project5', 1, 5); -- User 1, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user2_project1', 2, 1); -- User 2, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user2_project2', 2, 2); -- User 2, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user2_project3', 2, 3); -- User 2, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user2_project4', 2, 4); -- User 2, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user2_project5', 2, 5); -- User 2, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user3_project1', 3, 1); -- User 3, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user3_project2', 3, 2); -- User 3, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user3_project3', 3, 3); -- User 3, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user3_project4', 3, 4); -- User 3, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user3_project5', 3, 5); -- User 3, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user4_project1', 4, 1); -- User 4, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user4_project2', 4, 2); -- User 4, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user4_project3', 4, 3); -- User 4, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user4_project4', 4, 4); -- User 4, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user4_project5', 4, 5); -- User 4, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user5_project1', 5, 1); -- User 5, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user5_project2', 5, 2); -- User 5, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user5_project3', 5, 3); -- User 5, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user5_project4', 5, 4); -- User 5, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user5_project5', 5, 5); -- User 5, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user6_project1', 6, 1); -- User 6, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user6_project2', 6, 2); -- User 6, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user6_project3', 6, 3); -- User 6, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user6_project4', 6, 4); -- User 6, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user6_project5', 6, 5); -- User 6, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user7_project1', 7, 1); -- User 7, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user7_project2', 7, 2); -- User 7, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user7_project3', 7, 3); -- User 7, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user7_project4', 7, 4); -- User 7, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user7_project5', 7, 5); -- User 7, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user8_project1', 8, 1); -- User 8, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user8_project2', 8, 2); -- User 8, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user8_project3', 8, 3); -- User 8, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user8_project4', 8, 4); -- User 8, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user8_project5', 8, 5); -- User 8, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user9_project1', 9, 1); -- User 9, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user9_project2', 9, 2); -- User 9, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user9_project3', 9, 3); -- User 9, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user9_project4', 9, 4); -- User 9, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user9_project5', 9, 5); -- User 9, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user10_project1', 10, 1); -- User 10, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user10_project2', 10, 2); -- User 10, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user10_project3', 10, 3); -- User 10, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user10_project4', 10, 4); -- User 10, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user10_project5', 10, 5); -- User 10, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user11_project1', 11, 1); -- User 11, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user11_project2', 11, 2); -- User 11, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user11_project3', 11, 3); -- User 11, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user11_project4', 11, 4); -- User 11, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user11_project5', 11, 5); -- User 11, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user12_project1', 12, 1); -- User 12, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user12_project2', 12, 2); -- User 12, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user12_project3', 12, 3); -- User 12, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user12_project4', 12, 4); -- User 12, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user12_project5', 12, 5); -- User 12, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user13_project1', 13, 1); -- User 13, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user13_project2', 13, 2); -- User 13, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user13_project3', 13, 3); -- User 13, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user13_project4', 13, 4); -- User 13, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user13_project5', 13, 5); -- User 13, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user14_project1', 14, 1); -- User 14, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user14_project2', 14, 2); -- User 14, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user14_project3', 14, 3); -- User 14, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user14_project4', 14, 4); -- User 14, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user14_project5', 14, 5); -- User 14, Project 5

INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user15_project1', 15, 1); -- User 15, Project 1
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user15_project2', 15, 2); -- User 15, Project 2
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user15_project3', 15, 3); -- User 15, Project 3
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user15_project4', 15, 4); -- User 15, Project 4
INSERT INTO "UserProjectToken" ("accessToken", "userId", "projectId")
VALUES ('access_token_user15_project5', 15, 5); -- User 15, Project 5