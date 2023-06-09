with "ARG"("queryId") AS
(
    INSERT INTO "SqlQuery" ("statement", "userId", "projectId", "queryTypeId")
    VALUES ('SELECT "TestColumn" FROM "TestTable"', '1', '1', '1')
    RETURNING "queryId"
),
"insert1" AS 
(
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES ((SELECT "queryId" FROM "ARG" LIMIT 1), '1')
)
INSERT INTO "QueryTableAccess" ("queryId", "tableId")
VALUES ((SELECT "queryId" FROM "ARG" LIMIT 1), '1');
