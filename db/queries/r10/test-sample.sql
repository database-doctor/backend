with "ARG"("jid") AS
(
    INSERT INTO "Job" ("statement", "type", "issuedById", "pid")
    VALUES ('SELECT "TestColumn" FROM "TestTable"', 'SELECT', '1', '1')
    RETURNING "jid"
),
"insert1" AS 
(
    INSERT INTO "JobColumnAccess" ("jid", "cid")
    VALUES ((SELECT "jid" FROM "ARG"), '1')
)
INSERT INTO "JobTableAccess" ("jid", "tid")
VALUES ((SELECT "jid" FROM "ARG"), '1');
