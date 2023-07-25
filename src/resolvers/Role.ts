import { Context } from "../middleware";
import { Role, RolePermissionMap, Permission } from "@generated/type-graphql";
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

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@Resolver(() => Role)
export class RoleResolver {
  //   @Authorized() // TODO : UNCOMMENT
  @Query(() => [Role])
  async allRoles(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<Role[] | null> {
    const roles_in_project = await ctx.prisma.rolePermissionMap.findMany({
      where: {
        pid,
      },
    });

    return ctx.prisma.role.findMany({
      where: {
        rid: {
          in: roles_in_project.map((mapping: RolePermissionMap) => mapping.rid),
        },
      },
    });
  }

  //   @Authorized()
  @FieldResolver(() => [Permission])
  async permissions(@Root() role: Role, @Ctx() ctx: Context) {
    const mapping = await ctx.prisma.rolePermissionMap.findFirst({
      where: {
        rid: role.rid,
      },
    });

    return await ctx.prisma.permission.findMany({
      where: {
        pid: mapping?.pid || -1,
      },
    });
  }
}
