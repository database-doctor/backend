-- Creating a user account
INSERT INTO "User"("username", "name", "email", "passwordHash", "passwordSalt") VALUES ('new_user', 'New User', 'new_user@uwaterloo.ca', 'hashed_password', 'salt');

-- Modifying a user account
UPDATE "User"
SET "email" = 'akdavila03@gmail.com'
WHERE "userId" = 1;

-- Accessing profile information sample query
SELECT "username", "name", "email", "createdAt"
FROM "User"
WHERE "userId" = 1;
