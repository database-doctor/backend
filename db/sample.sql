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

INSERT INTO "Table" ("tid", "name", "sid") VALUES 
    ('2', 'Test Table 2', '1');

INSERT INTO "Table" ("tid", "name", "sid") VALUES 
    ('3', 'Test Table 3', '1');

INSERT INTO "Table" ("tid", "name", "sid") VALUES 
    ('4', 'Test Table 4', '1');

INSERT INTO "JobTableAccess" ("jid", "tid") VALUES 
    ('1', '1');

INSERT INTO "TableSnapshot" ("rowCount", "sizeBytes", "tid") VALUES
    ('0', '1', '1');

INSERT INTO "UserProjectToken" ("uid", "pid", "token") VALUES
    ('1', '1', 'SecretToken');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('1', 'TestColumn 1', 'VARCHAR', '1');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('2', 'TestColumn 2', 'VARCHAR', '1');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('3', 'TestColumn 3', 'VARCHAR', '1');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('4', 'TestColumn 4', 'VARCHAR', '2');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('5', 'TestColumn 5', 'VARCHAR', '2');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('6', 'TestColumn 6', 'VARCHAR', '3');

INSERT INTO "Column" ("cid", "name", "type", "tid") VALUES
    ('7', 'TestColumn 7', 'VARCHAR', '4');

INSERT INTO "TableAccessFreq" ("tid", "frequency") VALUES
    ('1', '4');

INSERT INTO "TableAccessFreq" ("tid", "frequency") VALUES
    ('2', '1');

INSERT INTO "TableAccessFreq" ("tid", "frequency") VALUES
    ('3', '2');

INSERT INTO "TableAccessFreq" ("tid", "frequency") VALUES
    ('4', '10');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('1', '5');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('2', '4');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('3', '1');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('4', '8');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('5', '5');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('6', '2');

INSERT INTO "ColumnAccessFreq" ("cid", "frequency") VALUES
    ('7', '15');
