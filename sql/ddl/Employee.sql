INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (1, "Employees", 2);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (2, "Departments", 2);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (3, "Projects", 2);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (4, "Tasks", 2);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (5, "Timesheets", 2);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('employee_id', 1, 7),
    ('first_name', 1, 11),
    ('last_name', 1, 11),
    ('email', 1, 11),
    ('phone_number', 1, 11),
    ('hire_date', 1, 4),
    ('job_title', 1, 11),
    ('department', 1, 11),
    ('salary', 1, 5);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('department_id', 2, 7),
    ('department_name', 2, 11),
    ('manager_id', 2, 7),
    ('location', 2, 11),
    ('budget', 2, 5);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('project_id', 3, 7),
    ('project_name', 3, 11),
    ('start_date', 3, 4),
    ('end_date', 3, 4),
    ('status', 3, 11),
    ('budget', 3, 5),
    ('department_id', 3, 7);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('task_id', 4, 7),
    ('task_name', 4, 11),
    ('description', 4, 11),
    ('start_date', 4, 4),
    ('end_date', 4, 4),
    ('status', 4, 11),
    ('project_id', 4, 7),
    ('employee_id', 4, 7);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('timesheet_id', 5, 7),
    ('employee_id', 5, 7),
    ('project_id', 5, 7),
    ('task_id', 5, 7),
    ('date', 5, 4),
    ('hours_worked', 5, 5);

