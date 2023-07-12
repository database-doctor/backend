SELECT "projectName", "connUrl" AS "projectUrl", "Project"."createdAt", "username" AS "createdBy"
FROM "Project"
JOIN "User" ON "Project"."createdById" = "User"."userId"
WHERE "projectId" = 'project_id_value';