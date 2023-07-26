import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const EcommerceProject: ProjectConfig = {
  name: "Ecommerce",
  roles: [
    {
      name: "Admin",
      permissions: [
        "project:share",
        "schema:read",
        "schema:update",
        "job:read",
        "job:create",
        "job:update",
        "snapshot:read",
        "alert:create",
        "alert:read",
        "alert:update",
        "alert:delete",
      ],
    },
    {
      name: "Manager",
      permissions: [
        "job:create",
        "job:update",
        "snapshot:read",
        "alert:create",
        "alert:read",
        "alert:update",
        "alert:delete",
      ],
    },
    {
      name: "Employee",
      permissions: ["alert:read"],
    },
    {
      name: "WebServer",
      permissions: ["job:create"],
    },
  ],
  users: [
    { roles: ["Admin"] },
    { roles: ["Manager"] },
    { roles: ["Employee"] },
  ],
  bots: [{ roles: ["WebServer"] }, { roles: ["WebServer"] }],
  schemas: [
    {
      name: "Schema2",
      tables: [],
    },
    {
      name: "Schema3",
      tables: [
        {
          name: "Customers",
          columns: [
            {
              name: "customer_id",
              type: "INTEGER",
            },
            {
              name: "first_name",
              type: "STRING",
            },
            {
              name: "last_name",
              type: "STRING",
            },
            {
              name: "email",
              type: "STRING",
            },
            {
              name: "phone_number",
              type: "STRING",
            },
            {
              name: "address",
              type: "STRING",
            },
          ],
          snapshot: {
            initialRowCount: 5000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 1 }),
            sizeBytesFactor: 400,
          },
        },
        {
          name: "Orders",
          columns: [
            {
              name: "order_id",
              type: "INTEGER",
            },
            {
              name: "customer_id",
              type: "INTEGER",
            },
            {
              name: "order_date",
              type: "DATE",
            },
            {
              name: "total_amount",
              type: "INTEGER",
            },
            {
                name: "payment_method",
                type: "STRING"
            },
            {
                name: "shipping_address",
                type: "STRING"
            }
          ],
          snapshot: {
            initialRowCount: 1000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.01 ? 0 : 1),
            sizeBytesFactor: 388,
          },
        },
        {
          name: "Products",
          columns: [
            {
              name: "product_id",
              type: "INTEGER",
            },
            {
              name: "product_name",
              type: "STRING",
            },
            {
              name: "category",
              type: "STRING",
            },
            {
              name: "price",
              type: "INTEGER",
            },
            {
              name: "description",
              type: "STRING",
            },
            {
                name: "quantity",
                type: "INTEGER"
            }
          ],
          snapshot: {
            initialRowCount: 1000000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 10, max: 30 }),
            sizeBytesFactor: 20,
          },
        },
        {
          name: "Categories",
          columns: [
            {
              name: "category_id",
              type: "INTEGER",
            },
            {
              name: "category_name",
              type: "INTEGER",
            },
            {
              name: "description",
              type: "INTEGER",
            },
            {
                name: "parent_category_id",
                type: "INTEGER"
            }
          ],
          snapshot: {
            initialRowCount: 20,
            nextRowCount: (prevRowCount: number) => prevRowCount,
            sizeBytesFactor: 12,
          },
        },
        {
          name: "OrderItems",
          columns: [
            {
              name: "order_item_id",
              type: "INTEGER",
            },
            {
              name: "order_id",
              type: "INTEGER",
            },
            {
              name: "product_id",
              type: "INTEGER",
            },
            {
              name: "quantity",
              type: "INTEGER",
            },
            {
                name: "unit_price",
                type: "INTEGER",
            }
          ],
          snapshot: {
            initialRowCount: 10000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.14 ? 0 : 1000),
            sizeBytesFactor: 16,
          },
        },
      ],
    },
  ],
  jobs: [
    {
      count: 6000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Customers" WHERE "customer_id" = '${params.customerId}'`;
        return query;
      },
      generateParams: () => {
        return {
          customerId: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Customers",
          columns: ["email", "customer_id"],
        },
      ],
    },
    {
      count: 4000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Customers" NATURAL JOIN "Orders" WHERE "total_amount" = '${params.price}'`;
        return query;
      },
      generateParams: () => {
        return {
          price: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Customers",
          columns: ["email", "customer_id"],
        },
        {
          table: "Orders",
          columns: ["total_amount"],
        },
      ],
    },
    {
      count: 10000,
      generateStatement: (params: any) => {
        const query = `INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
        VALUES ('${params.order_id}', '${params.product_id}', ${params.quantity}, '${params.unit_price}')`;
        return query;
      },
      generateParams: () => {
        return {
          order_id: faker.number.int({min: 1, max: 5000}),
          product_id: faker.number.int({min: 1, max: 5000}),
          quantity: faker.number.int({min: 1, max: 800}),
          unit_price: faker.number.int({min: 1, max: 800}),
        };
      },
      type: "INSERT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "OrderItems",
          columns: ["order_item_id", "order_id", "product_id", "quantity", "unit_price"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Categories WHERE parent_category_id = ${params.parentId};`;
        return query;
      },
      generateParams: () => {
        return {
          parentId: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Categories",
          columns: ["category_id", "category_name", "description", "parent_category_id"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Products WHERE product_id = ${params.product_id};`;
        return query;
      },
      generateParams: () => {
        return {
          product_id: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Products",
          columns: ["product_id", "product_name", "category", "price", "description", "quantity"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `UPDATE Customers SET first_name = ${params.first_name} WHERE customer_id = ${params.customer_id};`;
        return query;
      },
      generateParams: () => {
        return {
          first_name: faker.word.noun(),
          customer_id: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "UPDATE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Customers",
          columns: ["first_name", "customer_id"],
        },
      ],
    },
  ],
};