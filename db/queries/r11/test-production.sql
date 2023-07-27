WITH "LatestSchema"("sid") AS
(
    SELECT
        "S"."sid"
    FROM
        "Schema" "S"
    WHERE
        "S"."pid" = '1'
    ORDER BY
        "S"."createdAt" DESC
    LIMIT 1
)
SELECT
    "T"."tid", "C"."cid"
FROM
    "Table" "T"
NATURAL JOIN
    "Column" "C"
WHERE
    "T"."sid" = (SELECT "sid" FROM "LatestSchema");

