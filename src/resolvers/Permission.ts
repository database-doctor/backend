import { Context } from "../middleware";
import {
  Field,
  Int,
  Args,
  ArgsType,
  Ctx,
  Resolver,
  Query,
  FieldResolver,
  Root,
  Authorized,
  ObjectType,
} from "type-graphql";
import { MaxLength, MinLength } from "class-validator";

@ObjectType()
class PermissionDetail {
  @Field(() => Int)
  pid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;
}

@Resolver(() => PermissionDetail)
export class PermissionResolver {
  //   @Authorized() // TODO : UNCOMMENT
  @Query(() => [PermissionDetail])
  async allPermissions(
    @Ctx() ctx: Context
  ): Promise<PermissionDetail[] | null> {
    return await ctx.prisma.permission.findMany();
  }
}
