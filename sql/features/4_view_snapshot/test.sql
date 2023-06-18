SELECT
    date_trunc('hour', T.createdAt) AS atTime,
    T.rowCount,
    T.sizeBytes,
    COUNT(Q1.atHour) AS queryCount
FROM
    TableStorageSnapshot T
LEFT JOIN
    (SELECT
        Q1.tableId,
        date_trunc('hour', Q1.issuedAt) AS atHour
     FROM
        Query Q1) Q
ON
    T.tableId = Q.tableId AND date_trunc('hour', T.createdAt) = Q.atHour
WHERE
    T.tableId = INtableId AND
    INfromTime <= T.createdAt AND
    T.createdAt <= INtoTime
GROUP BY
    T.tableId, T.createdAt;
