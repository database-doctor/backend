INSERT INTO "User" ("uid", "username", "name", "email", "password") VALUES 
    ('1', 'adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password');

INSERT INTO "Project" ("pid", "name", "dbUrl", "createdById") VALUES
    ('1', 'TestProject', 'http://example-url.com', '1');

INSERT INTO "Job" ("jid", "statement", "type", "issuedById", "pid") VALUES
    ('1', 'SELECT * FROM Table', 'SELECT', '1', '1');

INSERT INTO "Schema" ("sid", "name", "pid", "createdById") VALUES
    ('1', 'TestSchema', '1', '1');

INSERT INTO "Table" ("tid", "name", "sid") VALUES 
    ('1', 'TestTable', '1');

INSERT INTO "JobTableAccess" ("jid", "tid") VALUES 
    ('1', '1');

INSERT INTO "TableSnapshot" ("rowCount", "sizeBytes", "tid") VALUES
    ('0', '1', '1');

INSERT INTO "UserProjectToken" ("uid", "pid", "token") VALUES
    ('1', '1', 'SecretToken');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('1', 'TestColumn', 'VARCHAR', '1');
