WITH QueryCount AS 
    (SELECT query_type, COUNT(*) AS query_count 
     FROM Query 
     GROUP BY query_type)
WITH avg_query_count AS 
    (SELECT AVG(query_count) FROM QueryCount)
WITH CommonQueries AS 
    (SELECT query_type_id
     FROM QueryCount
     WHERE query_count >= avg_query_count)
SELECT username AS "user", project_name, statement AS "query_statement", query_type_name AS "query_type", issued_at, finished_at, has_error, error_msg
FROM Query
NATURAL JOIN QueryType
NATURAL JOIN "User"
NATURAL JOIN Project
WHERE query_type_id IN CommonQueries.query_type_id