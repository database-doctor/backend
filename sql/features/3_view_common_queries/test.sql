-- View commonly queried statements
WITH "QueryCount" AS 
    (SELECT "statement", COUNT(*) AS "queryCount" 
     FROM "Query" 
     GROUP BY "statement"), 
"avgQueryCount" AS 
    (SELECT AVG("queryCount") FROM "QueryCount"), 
"CommonQueries" AS 
    (SELECT "statement"
     FROM "QueryCount"
     WHERE "queryCount" >= "avgQueryCount")
SELECT DISTINCT "User"."username", "Project"."projectName", "Q"."statement" AS "queryStatement", "QueryType"."queryTypeName" AS "queryType", "Q"."issuedAt", "Q"."finishedAt", "Q"."hasError", "Q".'errorMsg'
FROM "Query" "Q"
JOIN "QueryType" ON "Query"."queryType" = "QueryType"."queryTypeId"
JOIN "User" ON "Query"."userId" = "User"."userId"
JOIN "Project" ON "Query"."projectId" = "Project"."projectId"
WHERE "Query"."statement" IN "CommonQueries";

-- View common users that query
WITH "UserQueries" AS 
    (SELECT "userId", COUNT(*) AS "queryCount" 
     FROM "Query" 
     GROUP BY "userId"), 
"avgQueryCount" AS 
    (SELECT AVG("queryCount") FROM "UserQueries"), 
"CommonUsers" AS 
    (SELECT "user_id"
     FROM "UserQueries"
     WHERE "queryCount" >= "avgQueryCount")
SELECT DISTINCT "User"."username"
FROM "User"
WHERE "User"."user_id" IN "CommonUsers";