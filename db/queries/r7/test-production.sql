SELECT "Project"."projectId", "projectName", "connUrl" AS "projectUrl",
"Project"."createdAt", "username" AS "createdBy"
FROM "Project"
JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
WHERE "User"."userId" = 1;
