INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (1, "Movies", 5);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (2, "Actors", 5);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (3, "Reviews", 5);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (4, "Theaters", 5);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (5, "Screenings", 5);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('movie_id', 1, 7),
    ('title', 1, 11),
    ('release_date', 1, 4),
    ('genre', 1, 11),
    ('director', 1, 11),
    ('duration', 1, 5),
    ('rating', 1, 5);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('actor_id', 2, 7),
    ('first_name', 2, 11),
    ('last_name', 2, 11),
    ('date_of_birth', 2, 4),
    ('gender', 2, 11),
    ('nationality', 2, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('review_id', 3, 7),
    ('movie_id', 3, 7),
    ('user_id', 3, 7),
    ('rating', 3, 3),
    ('comment', 3, 11),
    ('review_date', 3, 4);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('theater_id', 4, 7),
    ('theater_name', 4, 11),
    ('location', 4, 11),
    ('capacity', 4, 7),
    ('phone_number', 4, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('screening_id', 5, 7),
    ('movie_id', 5, 7),
    ('theater_id', 5, 7),
    ('start_time', 5, 4),
    ('end_time', 5, 4),
    ('ticket_price', 5, 5);