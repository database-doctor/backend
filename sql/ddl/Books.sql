INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (1, "Books", 3);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (2, "Authors", 3);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (3, "Publishers", 3);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (4, "Customers", 3);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (5, "Orders", 3);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('book_id', 1, 7),
    ('title', 1, 11),
    ('author', 1, 11),
    ('publication_date', 1, 4),
    ('publisher', 1, 11),
    ('price', 1, 5),
    ('category_id', 1, 7);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('author_id', 2, 7),
    ('first_name', 2, 11),
    ('last_name', 2, 11),
    ('birth_date', 2, 4),
    ('country', 2, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('publisher_id', 3, 7),
    ('publisher_name', 3, 11),
    ('established_date', 3, 4),
    ('country', 3, 11),
    ('website', 3, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('customer_id', 4, 7),
    ('first_name', 4, 11),
    ('last_name', 4, 11),
    ('email', 4, 11),
    ('phone_number', 4, 11),
    ('address', 4, 11),
    ('city', 4, 11),
    ('state', 4, 11),
    ('zip_code', 4, 11),
    ('country', 4, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('order_id', 5, 7),
    ('customer_id', 5, 7),
    ('order_date', 5, 4),
    ('total_amount', 5, 5),
    ('status', 5, 11),
    ('shipping_address', 5, 11),
    ('shipping_city', 5, 11),
    ('shipping_state', 5, 11),
    ('shipping_zip_code', 5, 11),
    ('shipping_country', 5, 11);