import * as resolvers from "./resolvers";
import { buildSchemaSync } from "type-graphql";

export const schema = buildSchemaSync({
  resolvers: [resolvers.UserResolver],
  validate: false,
});
