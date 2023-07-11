I/* Decide what we actually want to keep in this file Ex. Col Type Query Type etc.. */
INSERT INTO "User" ("userId", "username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('16', 'adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('17', 'jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('18', 'malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById") VALUES
    ('6', 'TestProject', 'http://example-url.com', '16');

INSERT INTO "SqlQuery" ("queryId", "statement", "userId", "projectId", "queryTypeId") VALUES
    ('1', 'SELECT * FROM Table', '1', '6', '1');

INSERT INTO "Schema" ("schemaId", "schemaName", "projectId", "createdById") VALUES
    ('6', 'TestSchema', '6', '1');

INSERT INTO "Table" ("tableId", "tableName", "schemaId") VALUES 
    ('1', 'TestTable', '6');

INSERT INTO "QueryTableAccess" ("queryId", "tableId") VALUES 
    ('1', '1');

INSERT INTO "TableStorageSnapshot" ("rowCount", "sizeBytes", "tableId") VALUES
    ('0', '1', '1');

INSERT INTO "UserProjectToken" ("userId", "projectId", "accessToken") VALUES
    ('2', '1', 'SecretToken');

INSERT INTO "Column" ("columnId", "columnName", "columnTypeId", "tableId") VALUES
    ('1', 'TestColumn', '7', '1');