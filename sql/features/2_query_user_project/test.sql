SELECT "projectName", "connUrl" AS "projectUrl", "createdAt", "username" AS "createdBy"
FROM "Project" NATURAL JOIN "User"
WHERE "projectName" = 'project_query_string'