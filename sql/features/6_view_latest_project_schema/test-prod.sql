WITH "LatestSchema"("schemaId") AS
(
    SELECT
        S."schemaId"
    FROM
        "Schema" S
    WHERE
        S."projectId" = '3'
    ORDER BY
        S."createdAt" DESC
    LIMIT 1
)
SELECT
    T."tableId", TC."columnId"
FROM
    "Table" T
NATURAL JOIN
    "Column" TC
WHERE
    T."schemaId" = (SELECT "schemaId" FROM "LatestSchema");
