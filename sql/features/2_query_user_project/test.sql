SELECT "projectName", "connUrl" AS "projectUrl", "createdAt", "username" AS "createdBy"
FROM "Project"
JOIN "User" ON "Project"."createdById" = "User"."userId"
WHERE "projectName" = 'project_query_string'