SELECT
    date_trunc('hour', "TS"."createdAt") AS "atTime",
    MAX("TS"."rowCount") AS "rowCount",
    MAX("TS"."sizeBytes") AS "sizeBytes",
    COUNT("J"."atHour") AS "queryCount"
FROM
    "TableSnapshot" "TS"
LEFT JOIN
    "JobTableAccess" "JTA"
ON
    "TS"."tid" = "JTA"."tid"
LEFT JOIN
    (SELECT
        "J1"."jid",
        date_trunc('hour', "J1"."issuedAt") AS "atHour"
    FROM
        "Job" "J1") "J"
ON
    "JTA"."jid" = "J"."jid" AND date_trunc('hour', "TS"."createdAt") = "J"."atHour"
WHERE
    "TS"."tid" = '1' AND
    '2023-05-01'::date <= "TS"."createdAt" AND
    "TS"."createdAt" <= '2023-05-31'::date
GROUP BY
    date_trunc('hour', "TS"."createdAt")
ORDER BY
    date_trunc('hour', "TS"."createdAt") ASC;
