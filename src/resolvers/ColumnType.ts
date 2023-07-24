import { Authorized, Field, ObjectType, Query, Resolver } from "type-graphql";

import { ColumnType as ColumnTypeEnum } from "@generated/type-graphql";

const COLUMN_TYPES = Object.values(ColumnTypeEnum);

@Resolver()
export class ColumnTypeResolver {
  @Authorized()
  @Query(() => [String])
  async columnTypes(): Promise<string[]> {
    return COLUMN_TYPES as string[];
  }
}
