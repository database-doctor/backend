import { ProjectConfig } from "../gen/project";
import { faker } from "@faker-js/faker";

export const workplaceProject: ProjectConfig = {
  name: "Workplace",
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
      name: "Schema4",
      tables: [],
    },
    {
      name: "Schema5",
      tables: [
        {
          name: "Employees",
          columns: [
            {
              name: "employee_id",
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
              name: "hire_date",
              type: "DATE",
            },
            {
              name: "job_title",
              type: "STRING",
            },
            {
              name: "department",
              type: "STRING",
            },
            {
              name: "salary",
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
              name: "manager_id",
              type: "INTEGER",
            },
            {
              name: "location",
              type: "STRING",
            },
            {
              name: "budget",
              type: "INTEGER",
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
          name: "Projects",
          columns: [
            {
              name: "project_id",
              type: "INTEGER",
            },
            {
              name: "project_name",
              type: "STRING",
            },
            {
              name: "start_date",
              type: "DATE",
            },
            {
              name: "end_date",
              type: "DATE",
            },
            {
              name: "status",
              type: "STRING",
            },
            {
              name: "budget",
              type: "INTEGER",
            },
            {
              name: "department_id",
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
          name: "Tasks",
          columns: [
            {
              name: "task_id",
              type: "INTEGER",
            },
            {
              name: "task_name",
              type: "INTEGER",
            },
            {
              name: "description",
              type: "STRING",
            },
            {
              name: "start_date",
              type: "DATE",
            },
            {
              name: "end_date",
              type: "DATE",
            },
            {
              name: "status",
              type: "STRING",
            },
            {
              name: "project_id",
              type: "INTEGER",
            },
            {
              name: "employee_id",
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
          name: "Timesheets",
          columns: [
            {
              name: "timesheet_id",
              type: "INTEGER",
            },
            {
              name: "employee_id",
              type: "INTEGER",
            },
            {
              name: "project_id",
              type: "INTEGER",
            },
            {
              name: "task_id",
              type: "INTEGER",
            },
            {
              name: "date",
              type: "DATE",
            },
            {
              name: "hours_worked",
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
        const query = `SELECT 'email' FROM "Employees" WHERE "employee_id" = '${params.employee_id}'`;
        return query;
      },
      generateParams: () => {
        return {
          employee_id: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Employees",
          columns: ["email", "employee_id"],
        },
      ],
    },
    {
      count: 4000,
      generateStatement: (params: any) => {
        const query = `SELECT 'email' FROM "Employees" NATURAL JOIN "Timesheets" WHERE "hours_worked" = '${params.hours}'`;
        return query;
      },
      generateParams: () => {
        return {
          hours: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "SELECT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Employees",
          columns: ["email", "employee_id"],
        },
        {
          table: "Timesheets",
          columns: ["hours_worked"],
        },
      ],
    },
    {
      count: 10000,
      generateStatement: (params: any) => {
        const query = `INSERT INTO Departments (department_name, manager_id, location, budget)
        VALUES ('${params.department_name}', '${params.manager_id}', ${params.location}, '${params.budget}')`;
        return query;
      },
      generateParams: () => {
        return {
          department_name: faker.word.noun(),
          manager_id: faker.number.int({ min: 1, max: 5000 }),
          location: faker.word.noun(),
          budget: faker.number.int({ min: 1, max: 800 }),
        };
      },
      type: "INSERT",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Departments",
          columns: [
            "department_id",
            "department_name",
            "manager_id",
            "location",
            "budget",
          ],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Projects WHERE project_id = ${params.project_id};`;
        return query;
      },
      generateParams: () => {
        return {
          project_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Projects",
          columns: [
            "project_id",
            "project_name",
            "start_date",
            "end_date",
            "status",
            "budget",
            "department_id",
          ],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `DELETE FROM Tasks WHERE task_id = ${params.task_id};`;
        return query;
      },
      generateParams: () => {
        return {
          task_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "DELETE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Tasks",
          columns: [
            "task_id",
            "task_name",
            "description",
            "start_date",
            "end_date",
            "project_id",
            "employee_id",
          ],
        },
      ],
    },
    {
      count: 5000,
      generateStatement: (params: any) => {
        const query = `UPDATE Employees SET first_name = ${params.first_name} WHERE employee_id = ${params.employee_id};`;
        return query;
      },
      generateParams: () => {
        return {
          first_name: faker.word.noun(),
          customer_id: faker.number.int({ min: 1, max: 10000 }),
        };
      },
      type: "UPDATE",
      duration: () => faker.number.float({ min: 0.1, max: 0.5 }),
      errorRatio: 0.001,
      botRatio: 0.8,
      accessed: [
        {
          table: "Employees",
          columns: ["first_name", "employee_id"],
        },
      ],
    },
  ],
};
