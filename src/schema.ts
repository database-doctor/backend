import * as resolvers from "./resolvers";
import { buildSchemaSync } from "type-graphql";

export const schema = buildSchemaSync({
  resolvers: [
    resolvers.ColumnResolver,
    resolvers.ColumnTypeResolver,
    resolvers.ProjectResolver,
    resolvers.SchemaResolver,
    resolvers.TableResolver,
    resolvers.UserResolver,
    resolvers.SqlQueryResolver, 
    resolvers.UserProjectTokenResolver, 
  ],
  validate: false,
});
