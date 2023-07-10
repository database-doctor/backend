import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { context } from "./context";
import { queryRoutes } from "./query";

const app = express();

const apolloServer = new ApolloServer({
  introspection: true,
  schema,
  context,
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({
    app,
  });
});

app.use(express.json());
app.use("/query", queryRoutes.routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started at port ${port}.`);
  console.log(`Query the GraphQL API at /graphql.`);
  console.log(`POST sql queries to REST API at /query.`);
});
