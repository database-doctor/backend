import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const theatreProject: ProjectConfig = {
  name: "Theatre",
  roles: [
    {
      name: "Admin",
      permissions: [
        "project:read",
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
      name: "Employee",
      permissions: ["alert:read", "alert:update"],
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
    { roles: ["Employee"] },
  ],
  bots: [{ roles: ["WebServer"] }, { roles: ["WebServer"] }],
  schemas: [
    {
      name: "Schema0",
      tables: [],
    },
    {
      name: "Schema1",
      tables: [
        {
          name: "Movie",
          columns: [
            {
              name: "movieId",
              type: "INTEGER",
            },
            {
              name: "title",
              type: "STRING",
            },
            {
              name: "releaseDate",
              type: "DATE",
            },
            {
              name: "duration",
              type: "INTEGER",
            },
            {
              name: "rating",
              type: "INTEGER",
            },
            {
              name: "description",
              type: "STRING",
            },
            {
              name: "genre",
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
          name: "Actor",
          columns: [
            {
              name: "actorId",
              type: "INTEGER",
            },
            {
              name: "firstName",
              type: "STRING",
            },
            {
              name: "lastName",
              type: "STRING",
            },
            {
              name: "nationality",
              type: "STRING",
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
          name: "Review",
          columns: [
            {
              name: "reviewId",
              type: "INTEGER",
            },
            {
              name: "movieId",
              type: "INTEGER",
            },
            {
              name: "rating",
              type: "INTEGER",
            },
            {
              name: "reviewDate",
              type: "DATE",
            },
            {
              name: "reviewer",
              type: "INTEGER",
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
          name: "Screen",
          columns: [
            {
              name: "screenId",
              type: "INTEGER",
            },
            {
              name: "screenNumber",
              type: "INTEGER",
            },
            {
              name: "capacity",
              type: "INTEGER",
            },
          ],
          snapshot: {
            initialRowCount: 20,
            nextRowCount: (prevRowCount: number) => prevRowCount,
            sizeBytesFactor: 12,
          },
        },
        {
          name: "Show",
          columns: [
            {
              name: "showId",
              type: "INTEGER",
            },
            {
              name: "movieId",
              type: "INTEGER",
            },
            {
              name: "screenId",
              type: "INTEGER",
            },
            {
              name: "showTime",
              type: "DATE",
            },
          ],
          snapshot: {
            initialRowCount: 10000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.14 ? 0 : 1000),
            sizeBytesFactor: 16,
          },
        },
        {
          name: "Ticket",
          columns: [
            {
              name: "ticketId",
              type: "INTEGER",
            },
            {
              name: "showId",
              type: "INTEGER",
            },
            {
              name: "customerId",
              type: "INTEGER",
            },
            {
              name: "seatNumber",
              type: "INTEGER",
            },
            {
              name: "price",
              type: "INTEGER",
            },
          ],
          snapshot: {
            initialRowCount: 20000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 10 }),
            sizeBytesFactor: 20,
          },
        },
        {
          name: "Customer",
          columns: [
            {
              name: "customerId",
              type: "INTEGER",
            },
            {
              name: "firstName",
              type: "STRING",
            },
            {
              name: "lastName",
              type: "STRING",
            },
            {
              name: "email",
              type: "STRING",
            },
          ],
          snapshot: {
            initialRowCount: 800,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 4 }),
            sizeBytesFactor: 196,
          },
        },
      ],
    },
  ],
  jobs: [
    {
      count: 6000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Customer" WHERE "customerId" = '${params.customerId}'`;
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
          table: "Customer",
          columns: ["email", "customerId"],
        },
      ],
    },
    {
      count: 4000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Customer" NATURAL JOIN "Ticket" WHERE "price" = '${params.price}'`;
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
          table: "Customer",
          columns: ["email", "customerId"],
        },
        {
          table: "Ticket",
          columns: ["price"],
        },
      ],
    },
    {
      count: 10000,
      generateStatement: (params: any) => {
        const query = `INSERT INTO Movie (title, releaseDate, duration, rating, description, genre)
        VALUES ('${params.title}', '${params.releaseDate}', ${params.duration}, '${params.description}', '${params.genre}')`;
        return query;
      },
      generateParams: () => {
        return {
          title: faker.internet.userName(),
          releaseDate: faker.date.past(),
          duration: faker.number.int({min: 10, max: 100}),
          rating: faker.number.int({min: 1, max: 5}),
          description: faker.word.sample(),
          genre: faker.word.adjective(),
        };
      },
      type: "INSERT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Movie",
          columns: ["movieId", "title", "releaseDate", "duration", "rating", "description", "genre"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Show WHERE showId = ${params.showId};`;
        return query;
      },
      generateParams: () => {
        return {
          showId: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Show",
          columns: ["showId", "movieId", "screenId", "showTime"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Review WHERE reviewId = ${params.reviewId};`;
        return query;
      },
      generateParams: () => {
        return {
          reviewId: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Review",
          columns: ["reviewId", "movieId", "rating", "reviewDate", "reviewer"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `UPDATE Screen SET capacity = ${params.cap} WHERE screenId = ${params.screenId};`;
        return query;
      },
      generateParams: () => {
        return {
          cap: faker.number.int({min: 1, max: 1000}),
          screenId: faker.number.int({min: 1, max: 10000}),
        };
      },
      type: "UPDATE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Screen",
          columns: ["screenId", "capacity"],
        },
      ],
    },
  ],
};