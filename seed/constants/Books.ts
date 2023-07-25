import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const BooksProject: ProjectConfig = {
  name: "Books",
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
      name: "Schema6",
      tables: [],
    },
    {
      name: "Schema7",
      tables: [
        {
          name: "Books",
          columns: [
            {
              name: "book_id",
              type: "INTEGER",
            },
            {
              name: "title",
              type: "STRING",
            },
            {
              name: "author",
              type: "STRING",
            },
            {
              name: "publication_date",
              type: "DATE",
            },
            {
              name: "publisher",
              type: "STRING",
            },
            {
              name: "price",
              type: "INTEGER",
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
          name: "Authors",
          columns: [
            {
              name: "author_id",
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
              name: "birth_date",
              type: "DATE",
            },
            {
                name: "country",
                type: "STRING"
            },
          ],
          snapshot: {
            initialRowCount: 1000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.01 ? 0 : 1),
            sizeBytesFactor: 388,
          },
        },
        {
          name: "Publishers",
          columns: [
            {
              name: "publisher_id",
              type: "INTEGER",
            },
            {
              name: "publisher_name",
              type: "STRING",
            },
            {
              name: "established_date",
              type: "DATE",
            },
            {
              name: "country",
              type: "STRING",
            },
            {
              name: "website",
              type: "STRING",
            },
          ],
          snapshot: {
            initialRowCount: 1000000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 10, max: 30 }),
            sizeBytesFactor: 20,
          },
        },
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
                type: "STRING"
            },
            {
                name: "phone_number",
                type: "STRING"
            },
            {
                name: "address",
                type: "STRING"
            },
            {
                name: "city",
                type: "STRING"
            },
            {
                name: "state",
                type: "INTEGER"
            },
            {
                name: "zip_code",
                type: "STRING"
            },
            {
                name: "country",
                type: "STRING"
            }
          ],
          snapshot: {
            initialRowCount: 20,
            nextRowCount: (prevRowCount: number) => prevRowCount,
            sizeBytesFactor: 12,
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
                name: "status",
                type: "STRING",
            },
            {
                name: "shipping_address",
                type: "STRING",
            },
            {
                name: "shipping_city",
                type: "STRING",
            },
            {
                name: "shipping_state",
                type: "STRING",
            },
            {
                name: "shipping_zip_code",
                type: "STRING",
            },
            {
                name: "shipping_country",
                type: "STRING",
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
        const query = `SELECT 'shipping_city' FROM "Orders" WHERE "order_id" = '${params.order_id}'`;
        return query;
      },
      generateParams: () => {
        return {
          order_id: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Orders",
          columns: ["shipping_city", "order_id"],
        },
      ],
    },
    {
      count: 4000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Customers" NATURAL JOIN "Orders" WHERE "order_id" = '${params.order_id}'`;
        return query;
      },
      generateParams: () => {
        return {
          order_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Customers",
          columns: ["email"],
        },
        {
          table: "Orders",
          columns: ["order_id"],
        },
      ],
    },
    {
      count: 10000,
      generateStatement: (params: any) => {
        const query = `INSERT INTO Authors (author_id, first_name, last_name, birth_date, country)
        VALUES ('${params.auother_id}', '${params.first_name}', ${params.last_name}, '${params.birth_date}', '${params.country}')`;
        return query;
      },
      generateParams: () => {
        return {
          auother_id: faker.number.int({min: 1, max: 5000}),
          first_name: faker.word.noun(),
          last_name: faker.word.noun(),
          birth_date: faker.date.past(),
          country: faker.word.noun(),
        };
      },
      type: "INSERT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Authors",
          columns: ["author_id", "first_name", "last_name", "birth_date", "country"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Publishers WHERE publisher_id = ${params.publisher_id};`;
        return query;
      },
      generateParams: () => {
        return {
          publisher_id: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Publishers",
          columns: ["publisher_id", "publisher_name", "established_date", "country", "website"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Books WHERE book_id = ${params.book_id};`;
        return query;
      },
      generateParams: () => {
        return {
          book_id: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Books",
          columns: ["book_id", "title", "author", "publication_date", "publisher", "price"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `UPDATE Customers SET first_name = ${params.first_name} WHERE customer_id = ${params.employee_id};`;
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