-- User table
INSERT INTO "User" ("username", "name", "email", "passwordHash", "passwordSalt") VALUES 
    ('adriandavila', 'Adrian Davila', 'a4davila@uwaterloo.ca', 'hashed_password', 'salt'),
    ('jasondu', 'Jason Du', 'j79du@uwaterloo.ca', 'hashed_password', 'salt'),
    ('malavmehta', 'Malav Mehta', 'mmehta@uwaterloo.ca', 'hashed_password', 'salt');

INSERT INTO "Project" ("projectName", "connUrl", "createdById") VALUES
    ('TestProject', 'http://example-url.com', '1');
