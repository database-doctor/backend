SELECT
    date_trunc('hour', T."createdAt") AS "atTime",
    T."rowCount",
    T."sizeBytes",
    COUNT(Q."atHour") AS "queryCount"
FROM
    "TableStorageSnapshot" T
LEFT JOIN
    "QueryTableAccess" TA
ON
    T."tableId" = TA."tableId"
LEFT JOIN
    (SELECT
        Q1."queryId",
        date_trunc('hour', Q1."issuedAt") AS "atHour"
     FROM
        "SqlQuery" Q1) Q
ON
    TA."queryId" = Q."queryId" AND date_trunc('hour', T."createdAt") = Q."atHour"
WHERE
    T."tableId" = 5 AND
    '2023-01-01'::date <= T."createdAt" AND
    T."createdAt" <= '2023-12-31'::date
GROUP BY
    T."tableId", T."createdAt";
