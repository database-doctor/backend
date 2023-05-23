# `datalens`

## About

### A database monitoring tool

`datalens` is a project created for CS 348 at the University of Waterloo. More details coming soon.

## Running locally

### For development

To run the `datalens` backend locally, first clone this repository:

```bash
$ git clone https://github.com/malav-mehta/datalens.git
```

Install all dependencies:

```bash
$ cd datalens
$ npm install
```

Create a `.env` file with the environment variables listed in `[root]/.env.example`. Then, setup the database with the Prisma ORM and GraphQL by running:

```bash
$ npx prisma generate
```

To spin up the project in development mode:

```bash
$ npm run dev
```

This will run two concurrent processes. 1) Will watch files in `src` for changes and compile them to `dist` with `tsc`. 2) Will use `nodemon` to keep the server live (run from `dist/index.js`).

### Using Prisma

The `prisma` tool can be called with `npx prisma [...]`. The most useful commands are:

- `npx prisma generate`
- `npx prisma studio`
- `npx prisma migrate dev --name [changes_name]`

## Tech stack

- TypeScript
- Node.js
- Express
- GraphQL
- PrismaORM
- PostgreSQL
