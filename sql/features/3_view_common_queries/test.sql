-- View commonly queried statements
WITH "QueryCount" AS 
    (SELECT "statement", COUNT(*) AS "query_count" 
     FROM "Query" 
     GROUP BY "statement")
WITH "avg_query_count" AS 
    (SELECT AVG("query_count") FROM "QueryCount")
WITH "CommonQueries" AS 
    (SELECT "statement"
     FROM "QueryCount"
     WHERE "query_count" >= "avg_query_count")
SELECT DISTINCT "User"."username", "Project"."project_name", "Table"."table_accessed", "Q"."statement" AS "query_statement", "QueryType"."query_type_name" AS "query_type", "Q"."issued_at", "Q"."finished_at", "Q"."has_error", "Q".'error_msg'
FROM "Query" "Q"
JOIN "QueryType" ON "Query"."query_type" = "QueryType"."query_type_id"
JOIN "User" ON "Query"."userId" = "User"."userId"
JOIN "Project" ON "Query"."projectId" = "Project"."projectId"
WHERE "Query"."statement" IN "CommonQueries";

-- View common users that query
WITH "UserQueries" AS 
    (SELECT "user_id", COUNT(*) AS "query_count" 
     FROM "Query" 
     GROUP BY "user_id")
WITH "avg_query_count" AS 
    (SELECT AVG("query_count") FROM "UserQueries")
WITH "CommonUsers" AS 
    (SELECT "user_id"
     FROM "UserQueries"
     WHERE "query_count" >= "avg_query_count")
SELECT DISTINCT "User"."username"
FROM "User"
WHERE "User"."user_id" IN "CommonUsers";