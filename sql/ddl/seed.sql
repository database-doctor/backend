-- User table
INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectName", "connUrl", "createdById") VALUES
    ('TestProject', 'http://example-url.com', '1');

INSERT INTO "QueryType" ("queryTypeName") VALUES ('SELECT');

INSERT INTO "Query" ("statement", "userId", "projectId", "queryTypeId") VALUES
    ('SELECT * FROM Table', '1', '3', '1');

INSERT INTO "Schema" ("schemaName", "projectId", "createdById") VALUES
    ('TestSchema', '3', '1');

INSERT INTO "Table" ("tableName", "schemaId") VALUES 
    ('TestTable', '3');

INSERT INTO "QueryTableAccess" ("queryId", "tableId") VALUES 
    ('4', '5');

INSERT INTO "TableStorageSnapshot" ("rowCount", "sizeBytes", "tableId") VALUES
    ('0', '1', '5');
