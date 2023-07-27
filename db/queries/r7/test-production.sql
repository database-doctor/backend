SELECT
    "Project"."pid",
    "Project"."name",
    "Project"."dbUrl",
    "Project"."createdAt",
    "User"."username" AS "createdBy"
FROM
    "Project"
JOIN
    "UserProjectToken"
ON "Project"."pid" = "UserProjectToken"."pid"
    AND "UserProjectToken"."uid" = '3'
JOIN "User"
    ON "User"."uid" = "Project"."createdById";
