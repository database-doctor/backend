# <img src='https://github.com/database-doctor/backend/blob/main/database-doctors-logo.png?raw=true' width='300'>

## About

### A database monitoring tool

`database_doctor` is a project created for CS 348 at the University of Waterloo.

## Running locally

### For development

To run the `database_doctor` backend locally, first clone this repository:

```bash
git clone https://github.com/database-doctor/backend.git
```

Install all dependencies:

```bash
cd backend
npm install
```

(Optional, requires Docker) To spin up a local PostgreSQL database for testing, run:

```bash
npm run db:start
```

Then, create a `.env` file with the environment variables listed in `[root]/.env.example`. Setup the database with the Prisma ORM and GraphQL by running:

```bash
npm run db:push
```

To spin up the project in development mode:

```bash
npm run dev
```

This will run two concurrent processes. 1) Will watch files in `src` for changes and compile them to `dist` with `tsc`. 2) Will use `nodemon` to keep the server live (run from `dist/index.js`).

### Using Prisma

The `prisma` tool can be called with `npx prisma [...]`. The most useful commands are:

- `npm run db:studio` or `npx prisma studio`
- `npm run db:push` or `npx prisma db push`
- `npx prisma generate`
- `npx prisma migrate dev --name [changes_name]`

### Using helper scripts

The following scripts provided through `npm run` in `package.json` might be useful:

- `npm run db:start` starts a local Docker DB instance
- `npm run db:stop` stops the local Docker DB instance
- `npm run db:reset` completely resets the local Docker DB instance by removing all volumes, and updates that database's schema to the latest schema (e.g. freshens the database)
- `npm run db:seed` seeds the database with production data (might fail if the database is not fresh)
- `npm run db [-f filename] [-o output]` opens an interactive prompt with the local docker DB instance. The prompt is non-interactive and runs the query inside `filename` against the database when `-f` is set. When `-o` is set, the output from the prompt is written to `output`

## SQL

Many of the sections below require downloading `psql`. To install `psql` with Homebrew on MacOS, run:

```bash
brew install libpq
brew link --force libpq
```

Assuming that the database was created/ran using the provided `docker-compose` configuration, then running the following command opens the CLI tool for the database:

```bash
psql -h localhost -U dev -W -d postgres
```

Enter the password `password` when prompted. Also, use double quotation marks `"` for queries referring to any tables. Now, to run any SQL file against the database, you can run:

```bash
psql -h localhost -U dev -W -d postgres < PATH/TO/FILE_NAME.sql
```

After entering the password, the SQL commands in `PATH/TO/FILE_NAME.sql` will be run against the database. To inspect changes, you can run

```bash
npx prisma studio
```

which opens a nice web interface to go through the database.

### Creating tables

We chose the Prisma DDL for this project, so the database schema is defined in [`prisma/schema.pisma`](prisma/schema.prisma), which, after preprocessing from Prisma, will generate a new migration under [`prisma/migrations/*/migration.sql`](prisma/migrations).

To add the schema to the database, running:

```bash
npx prisma db push
```

from the root folder will suffice.

### Sample and production datasets

The sample data was generated manually in combination with ChatGPT to create sample database schemas and database queries.

#### 1. Generating database schemas

To generate the populate the tables in schema.sql the following prompt was used:

```sql
-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- Give 15 distinct users using INSERT statements.
```

This was pattern was repeated for all tables in Schema except 'Table' and 'Column'.

To populate 'Table' and 'Column' we firstly created the fake projects using the following prompt:

```
Give me 5 SQL projects that each contain 5 tables with at least 5 collumns each
```

We then manually populated the 'Table' table and gave the following prompt to complete the 'Column' table:

```sql
CREATE TABLE "Column" (
    "columnId" SERIAL NOT NULL,
    "columnName" TEXT NOT NULL,
    "tableId" INTEGER NOT NULL,
    "columnTypeId" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("columnId")
);

-- Based on the above table insert the columns of every project into this table
```

#### 2. Procedural Data Generation

The data is procedurally generated using a custom library developed under `[root]/seed`. To use the library, data generation behavior can be specified through the configuration files in `[root]/seed/constants`. For example, you can look at `[root]/seed/constants/theatre.ts` to see how the `Theatre` project's data generation was specified. For more information, explore types in `[root]/seed` whose names end with `Config`.

#### 3. Populating the database with production data

To use the data generation script to load production dataset, you can simply run:

```bash
npm run db:reset
npm run db:seed
```

#### 4. Populating the database with sample data

To populate the database with sample data, assuming you have `psql` already set up, run the following command from root:

```bash
npm run db:reset
npm run db -- -f db/sample.sql
```

### Testing features

After performing all of the above steps (e.g. setting up the database and seeding it with the sample data), you can run the SQL feature queries from [sql/features/](sql/features/) by running:

```bash
npm run db -- -f db/queries/r[n]/test-production.sql
```

## Application features

To run actual features against the application, you will need to run the application (see instructions for running locally). Then, you can visit `localhost:8080/graphql` from your browser, and make queries and mutations against the database. All features from our submitted report are now implemented.

The GraphQL interface is self-documenting.

## Tech stack

- TypeScript
- Node.js
- Express
- GraphQL
- PrismaORM
- PostgreSQL
