import * as resolvers from "./resolvers";
import { buildSchemaSync } from "type-graphql";

export const schema = buildSchemaSync({
  resolvers: [
    resolvers.ColumnResolver,
    resolvers.ColumnTypeResolver,
    resolvers.ProjectResolver,
    resolvers.ProjectDetailResolver, 
    resolvers.SchemaResolver,
    resolvers.TableResolver,
    resolvers.TableSnapshotResolver,
    resolvers.UserResolver,
    resolvers.SqlQueryResolver, 
    resolvers.SqlQueryDetailResolver, 
    resolvers.QueryColumnDetailResolver, 
    resolvers.QueryTableDetailResolver, 
    resolvers.UserProjectTokenResolver, 
  ],
  validate: false,
});
