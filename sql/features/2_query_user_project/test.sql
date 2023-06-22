SELECT "project_name", "conn_url" AS "project_url", "created_at", "username" AS "created_by"
FROM "Project" NATURAL JOIN "User"
WHERE "project_name" = "project_query"