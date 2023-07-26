import { Context } from "../middleware";
import {
  Role,
  RolePermissionMap,
  Permission,
  RolePermissionMapCreateManyInput,
} from "@generated/type-graphql";
import { MaxLength, MinLength, ValidateNested } from "class-validator";
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
  InputType,
  Mutation,
  Arg,
} from "type-graphql";

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@InputType()
class CreateRoleInput {
  @Field()
  pid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => [Int])
  permissions?: number[];
}

@InputType()
class ModifyRoleInput {
  @Field()
  rid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @Field(() => [Int])
  permissions?: number[];
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
    const mapping = await ctx.prisma.rolePermissionMap.findMany({
      where: {
        rid: role.rid,
      },
    });

    return await ctx.prisma.permission.findMany({
      where: {
        pid: { in: mapping.map((p) => p.pid) },
      },
    });
  }
}

@Resolver(() => Role)
export class CreateRoleResolver {
  @Mutation(() => Role)
  async createRole(
    @Arg("newRole") newRole: CreateRoleInput,
    @Ctx() ctx: Context
  ): Promise<Role> {
    const role = await ctx.prisma.role.create({
      // @ts-ignore
      data: {
        pid: newRole.pid,
        name: newRole.name,
      },
    });

    const roleToPermissionMaps = newRole.permissions?.map((permission) => ({
      rid: role.rid,
      pid: permission,
    }));

    console.log(roleToPermissionMaps);

    const inserted = await ctx.prisma.rolePermissionMap.createMany({
      // @ts-ignore
      data: roleToPermissionMaps,
    });

    console.log("inserted: ", inserted);

    return role;
  }

  @Mutation(() => Role)
  async modifyRole(
    @Arg("modifiedRole") modifiedRole: ModifyRoleInput,
    @Ctx() ctx: Context
  ): Promise<Role | null> {
    const existingRole = await ctx.prisma.role.findFirstOrThrow({
      where: { rid: modifiedRole.rid },
    });

    if (modifiedRole.name && existingRole.name !== modifiedRole.name) {
      // Update the name
      await ctx.prisma.role.update({
        where: { rid: modifiedRole.rid },
        data: { name: modifiedRole.name },
      });
    }

    if (modifiedRole.permissions) {
      const existingRolePermissions =
        await ctx.prisma.rolePermissionMap.findMany({
          where: { rid: modifiedRole.rid },
        });

      const rolePermissionPids = existingRolePermissions.map((p) => p.pid);

      // Remove removed permissions
      const removedPermissions = rolePermissionPids.filter(
        (x) => !modifiedRole.permissions?.includes(x)
      );
      await ctx.prisma.rolePermissionMap.deleteMany({
        where: {
          rid: modifiedRole.rid,
          pid: { in: removedPermissions },
        },
      });

      // Add added permissions
      const newRolePermissions = modifiedRole.permissions
        .filter((x) => !rolePermissionPids.includes(x))
        .map((p) => ({ rid: modifiedRole.rid, pid: p }));

      await ctx.prisma.rolePermissionMap.createMany({
        data: newRolePermissions,
      });
    }

    return ctx.prisma.role.findFirst({
      where: { rid: modifiedRole.rid },
    });
  }
}
