import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const THEATRE_PROJECT: ProjectConfig = {
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
};
