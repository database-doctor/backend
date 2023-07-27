-- Top Queries
WITH "QueryCount" AS 
	(SELECT "statement", COUNT(*) AS "queryCount" 
	 FROM "Job"
	 GROUP BY "statement")
SELECT DISTINCT "Project"."name", "J"."statement" AS "queryStatement", 
	"J"."type" AS "queryType", "J"."issuedAt", "J"."finishedAt", "J"."error"
FROM "Job" "J"
JOIN "Project" ON "J"."pid" = "Project"."pid"
WHERE "J"."statement" IN 
	(SELECT "statement" 
	 FROM "QueryCount" 
	 WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount")) AND "Project"."pid" = '1';

-- Top Users
WITH "UserQueries" AS 
	(SELECT "issuedById", COUNT(*) AS "queryCount" 
     FROM "Job"
     GROUP BY "issuedById")
SELECT DISTINCT *
FROM "User"
JOIN "UserProjectToken" ON "User"."uid" = "UserProjectToken"."uid"
JOIN "Project" ON "UserProjectToken"."pid" = "Project"."pid"
WHERE "Project"."pid" = '1' AND "User"."uid" IN 
    (SELECT "issuedById"
     FROM "UserQueries"
     WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "UserQueries"));
