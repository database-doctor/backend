SELECT
    date_trunc('hour', T."createdAt") AS "atTime",
    T."rowCount",
    T."sizeBytes",
    COUNT(Q1."atHour") AS "queryCount"
FROM
    "TableStorageSnapshot" T
LEFT JOIN
    (SELECT
        Q1."tableId",
        date_trunc('hour', Q1."issuedAt") AS "atHour"
     FROM
        "Query" Q1) Q
ON
    T."tableId" = Q."tableId" AND date_trunc('hour', T."createdAt") = Q."atHour"
WHERE
    T."tableId" = 1 AND
    '2023-01-01'::date <= T."createdAt" AND
    T."createdAt" <= '2023-12-31'::date
GROUP BY
    T."tableId", T."createdAt";