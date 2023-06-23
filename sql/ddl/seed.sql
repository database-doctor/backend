-- User table
INSERT INTO "User" ("userId", "username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('1', 'adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('2', 'jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('3', 'malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectId", "projectName", "connUrl", "createdById") VALUES
    ('1', 'TestProject', 'http://example-url.com', '1');

INSERT INTO "QueryType" ("queryTypeId", "queryTypeName") VALUES ('1', 'SELECT');

INSERT INTO "Query" ("queryId", "statement", "userId", "projectId", "queryTypeId") VALUES
    ('1,', 'SELECT * FROM Table', '1', '1', '1');

INSERT INTO "Schema" ("schemaId", "schemaName", "projectId", "createdById") VALUES
    ('1', 'TestSchema', '1', '1');

INSERT INTO "Table" ("tableId", "tableName", "schemaId") VALUES 
    ('1', 'TestTable', '1');

INSERT INTO "QueryTableAccess" ("queryId", "tableId") VALUES 
    ('1', '1');

INSERT INTO "TableStorageSnapshot" ("rowCount", "sizeBytes", "tableId") VALUES
    ('0', '1', '1');
