INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (1, "Students", 4);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (2, "Courses", 4);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (3, "Enrollments", 4);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (4, "Instructors", 4);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (5, "Departments", 4);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('student_id', 1, 7),
    ('first_name', 1, 11),
    ('last_name', 1, 11),
    ('email', 1, 11),
    ('date_of_birth', 1, 4),
    ('address', 1, 11),
    ('city', 1, 11),
    ('state', 1, 11),
    ('zip_code', 1, 11),
    ('country', 1, 11),
    ('enrollment_date', 1, 4);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('course_id', 2, 7),
    ('course_name', 2, 11),
    ('course_code', 2, 11),
    ('department', 2, 11),
    ('credits', 2, 2),
    ('instructor_id', 2, 7),
    ('start_date', 2, 4),
    ('end_date', 2, 4);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('enrollment_id', 3, 7),
    ('student_id', 3, 7),
    ('course_id', 3, 7),
    ('enrollment_date', 3, 4),
    ('grade', 3, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('instructor_id', 4, 7),
    ('first_name', 4, 11),
    ('last_name', 4, 11),
    ('email', 4, 11),
    ('phone_number', 4, 11),
    ('department', 4, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('department_id', 5, 7),
    ('department_name', 5, 11),
    ('location', 5, 11),
    ('head_id', 5, 7);