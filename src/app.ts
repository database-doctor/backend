import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import { context } from "./middleware";
import express from "express";
import { routes } from "./routes";
import { schema } from "./config";

export const app = express();
export const port = process.env.PORT || 8080;

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

app.use("/", routes);
