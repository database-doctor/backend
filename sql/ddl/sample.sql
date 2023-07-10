I/* Decide what we actually want to keep in this file Ex. Col Type Query Type etc.. */
INSERT INTO "User" ("userId", "username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('16', 'adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('17', 'jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('18', 'malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById") VALUES
    ('6', 'TestProject', 'http://example-url.com', '1');

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