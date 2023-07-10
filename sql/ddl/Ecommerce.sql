INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (1, "Customers", 1);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (2, "Orders", 1);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (3, "Products", 1);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (4, "Categories", 1);

INSERT INTO "Table" ("tableId", "tableName", "schemaId")
VALUES (5, "OrderItems", 1);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('customer_id', 1, 7),
    ('first_name', 1, 11),
    ('last_name', 1, 11),
    ('email', 1, 11),
    ('phone_number', 1, 11),
    ('address', 1, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('order_id', 2, 7),
    ('customer_id', 2, 7),
    ('order_date', 2, 4),
    ('total_amount', 2, 6),
    ('payment_method', 2, 11),
    ('shipping_address', 2, 11);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('product_id', 3, 7),
    ('product_name', 3, 11),
    ('category', 3, 11),
    ('price', 3, 5),
    ('description', 3, 11),
    ('quantity', 3, 7);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('category_id', 4, 7),
    ('category_name', 4, 11),
    ('description', 4, 11),
    ('parent_category_id', 4, 7);

INSERT INTO "Column" ("columnName", "tableId", "columnTypeId")
VALUES
    ('order_item_id', 5, 7),
    ('order_id', 5, 7),
    ('product_id', 5, 7),
    ('quantity', 5, 4),
    ('unit_price', 5, 3);

