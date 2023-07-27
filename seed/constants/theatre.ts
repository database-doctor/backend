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
      name: "Empty Schema",
      tables: [],
    },
    {
      name: "Schema with Tables",
      tables: [
        {
          name: "Movie",
          columns: [
            {
              name: "movieId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "title",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "releaseDate",
              type: "DATE",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "duration",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "rating",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "description",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "genre",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 5000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 1 }),
            sizeBytesFactor: 400,
          },
          frequency: 5342,
        },
        {
          name: "Actor",
          columns: [
            {
              name: "actorId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "firstName",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "lastName",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "nationality",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 1000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.01 ? 0 : 1),
            sizeBytesFactor: 388,
          },
          frequency: 6012,
        },
        {
          name: "Review",
          columns: [
            {
              name: "reviewId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "movieId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "rating",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "reviewDate",
              type: "DATE",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "reviewer",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 1000000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 10, max: 30 }),
            sizeBytesFactor: 20,
          },
          frequency: faker.number.int({ min: 3000, max: 4500 }),
        },
        {
          name: "Screen",
          columns: [
            {
              name: "screenId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "screenNumber",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "capacity",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 20,
            nextRowCount: (prevRowCount: number) => prevRowCount,
            sizeBytesFactor: 12,
          },
          frequency: faker.number.int({ min: 3000, max: 4500 }),
        },
        {
          name: "Show",
          columns: [
            {
              name: "showId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "movieId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "screenId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "showTime",
              type: "DATE",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 10000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + (faker.number.float() > 0.14 ? 0 : 1000),
            sizeBytesFactor: 16,
          },
          frequency: faker.number.int({ min: 3000, max: 4500 }),
        },
        {
          name: "Ticket",
          columns: [
            {
              name: "ticketId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "showId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "customerId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "seatNumber",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "price",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 20000,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 10 }),
            sizeBytesFactor: 20,
          },
          frequency: faker.number.int({ min: 3000, max: 4500 }),
        },
        {
          name: "Customer",
          columns: [
            {
              name: "customerId",
              type: "INTEGER",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "firstName",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "lastName",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
            {
              name: "email",
              type: "STRING",
              frequency: faker.number.int({ min: 3000, max: 4500 }),
            },
          ],
          snapshot: {
            initialRowCount: 800,
            nextRowCount: (prevRowCount: number) =>
              prevRowCount + faker.number.int({ min: 0, max: 4 }),
            sizeBytesFactor: 196,
          },
          frequency: faker.number.int({ min: 3000, max: 4500 }),
        },
      ],
    },
  ],
  jobs: [
    {
      count: 561,
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
      count: 234,
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
      count: 154,
      generateStatement: (params: any) => {
        const query = `INSERT INTO Movie (title, releaseDate, duration, rating, description, genre)
        VALUES ('${params.title}', '${params.releaseDate}', ${params.duration}, '${params.description}', '${params.genre}')`;
        return query;
      },
      generateParams: () => {
        return {
          title: faker.internet.userName(),
          releaseDate: faker.date.past(),
          duration: faker.number.int({ min: 10, max: 100 }),
          rating: faker.number.int({ min: 1, max: 5 }),
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
          columns: [
            "movieId",
            "title",
            "releaseDate",
            "duration",
            "rating",
            "description",
            "genre",
          ],
        },
      ],
    },
    {
      count: 512,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Show WHERE showId = ${params.showId};`;
        return query;
      },
      generateParams: () => {
        return {
          showId: faker.number.int({ min: 1, max: 10000 }),
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
      count: 373,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Review WHERE reviewId = ${params.reviewId};`;
        return query;
      },
      generateParams: () => {
        return {
          reviewId: faker.number.int({ min: 1, max: 10000 }),
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
      count: 983,
      generateStatement: (params: any) => {
        const query = `UPDATE Screen SET capacity = ${params.cap} WHERE screenId = ${params.screenId};`;
        return query;
      },
      generateParams: () => {
        return {
          cap: faker.number.int({ min: 1, max: 1000 }),
          screenId: faker.number.int({ min: 1, max: 10000 }),
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
