import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const studentsProject: ProjectConfig = {
  name: "Students",
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
      name: "Schema8",
      tables: [],
    },
    {
      name: "Schema9",
      tables: [
        {
          name: "Students",
          columns: [
            {
              name: "student_id",
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
              name: "date_of_birth",
              type: "DATE",
            },
            {
              name: "address",
              type: "STRING",
            },
            {
              name: "city",
              type: "STRING",
            },
            {
              name: "state",
              type: "STRING",
            },
            {
              name: "zip_code",
              type: "STRING",
            },
            {
              name: "country",
              type: "STRING",
            },
            {
              name: "enrollment_date",
              type: "DATE",
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
          name: "Courses",
          columns: [
            {
              name: "course_id",
              type: "INTEGER",
            },
            {
              name: "course_name",
              type: "STRING",
            },
            {
              name: "course_code",
              type: "STRING",
            },
            {
              name: "department",
              type: "STRING",
            },
            {
              name: "credits",
              type: "INTEGER",
            },
            {
              name: "instructor_id",
              type: "INTEGER",
            },
            {
              name: "start_date",
              type: "DATE",
            },
            {
              name: "end_date",
              type: "DATE",
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
          name: "Enrollments",
          columns: [
            {
              name: "enrollment_id",
              type: "INTEGER",
            },
            {
              name: "student_id",
              type: "INTEGER",
            },
            {
              name: "course_id",
              type: "INTEGER",
            },
            {
              name: "enrollment_date",
              type: "DATE",
            },
            {
              name: "grade",
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
          name: "Instructors",
          columns: [
            {
              name: "instructor_id",
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
              name: "department",
              type: "STRING",
            },
          ],
          snapshot: {
            initialRowCount: 20,
            nextRowCount: (prevRowCount: number) => prevRowCount,
            sizeBytesFactor: 12,
          },
        },
        {
          name: "Departments",
          columns: [
            {
              name: "department_id",
              type: "INTEGER",
            },
            {
              name: "department_name",
              type: "STRING",
            },
            {
              name: "location",
              type: "STRING",
            },
            {
              name: "head_id",
              type: "INTEGER",
            },
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
        const query = `SELECT 'shipping_city' FROM "Students" WHERE "student_id" = '${params.student_id}'`;
        return query;
      },
      generateParams: () => {
        return {
          student_id: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Students",
          columns: ["email", "student_id"],
        },
      ],
    },
    {
      count: 4000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Students" NATURAL JOIN "Enrollments" WHERE "grade" = '${params.grade}'`;
        return query;
      },
      generateParams: () => {
        return {
          grade: faker.number.int({ min: 1, max: 100 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Students",
          columns: ["email"],
        },
        {
          table: "Enrollments",
          columns: ["grade"],
        },
      ],
    },
    {
      count: 10000,
      generateStatement: (params: any) => {
        const query = `INSERT INTO Departments (department_name, location, head_id)
        VALUES ('${params.department_name}', '${params.location}', ${params.head_id})`;
        return query;
      },
      generateParams: () => {
        return {
          department_name: faker.word.noun(),
          location: faker.word.noun(),
          head_id: faker.number.int({ min: 1, max: 1000 }),
        };
      },
      type: "INSERT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Departments",
          columns: ["department_id", "department_name", "location", "head_id"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Departments WHERE department_id = ${params.department_id};`;
        return query;
      },
      generateParams: () => {
        return {
          department_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Departments",
          columns: ["department_id", "department_name", "location", "head_id"],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Instructors WHERE instructor_id = ${params.instructor_id};`;
        return query;
      },
      generateParams: () => {
        return {
          instructor_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Instructors",
          columns: [
            "instructor_id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "department",
          ],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `UPDATE Enrollments SET grade = ${params.grade} WHERE student_id = ${params.student_id};`;
        return query;
      },
      generateParams: () => {
        return {
          grade: faker.number.int({ min: 1, max: 100 }),
          student_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "UPDATE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Enrollments",
          columns: ["grade", "student_id"],
        },
      ],
    },
  ],
};
