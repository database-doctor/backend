WITH "LatestSchema"("sid") AS
(
    SELECT
        "S"."sid"
    FROM
        "Schema" "S"
    WHERE
        "S"."pid" = '1'
    ORDER BY
        "S"."sid" DESC
    LIMIT 1
)
SELECT
    "T"."tid", "C"."cid"
FROM
    "Table" "T"
JOIN
    "Column" "C"
ON
    "T"."tid" = "C"."tid"
WHERE
    "T"."sid" = (SELECT "sid" FROM "LatestSchema");
