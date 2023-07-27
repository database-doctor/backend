import { Alert, AlertNotification } from "@generated/type-graphql";
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { MinLength } from "class-validator";

import { Context } from "../middleware";

@InputType()
class CreateAlertInput {
  @Field(() => String)
  @MinLength(1)
  condExpr!: string;

  @Field(() => String)
  @MinLength(1)
  returnExpr!: string;

  @Field(() => Int)
  frequency!: number;

  @Field(() => String)
  @MinLength(1)
  message!: string;

  @Field(() => Int)
  sid!: number;

  @Field(() => [String])
  users!: string[];

  @Field(() => [String])
  roles!: string[];
}

@ArgsType()
class AlertId {
  @Field(() => Int)
  aid!: number;
}

@ArgsType()
class SchemaId {
  @Field(() => Int)
  sid!: number;
}

@Resolver(() => Alert)
export class AlertResolver {
  @Authorized()
  @Query(() => [Alert])
  async allAlerts(
    @Args() { sid }: SchemaId,
    @Ctx() ctx: Context
  ): Promise<Alert[]> {
    const alerts = await ctx.prisma.alert.findMany({
      where: { sid },
    });

    return alerts;
  }

  @Authorized()
  @Mutation(() => Alert)
  async createAlert(
    @Arg("newAlert") newAlert: CreateAlertInput,
    @Ctx() ctx: Context
  ): Promise<Alert> {
    const project = await ctx.prisma.schema.findUnique({
      where: { sid: newAlert.sid },
      select: { pid: true },
    });

    if (!project) {
      throw new Error("Schema not found");
    }

    const alert = await ctx.prisma.alert.create({
      data: {
        condExpr: newAlert.condExpr,
        returnExpr: newAlert.returnExpr,
        frequency: newAlert.frequency,
        message: newAlert.message,
        sid: newAlert.sid,
      },
    });

    for (const userEmail of newAlert.users) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.prisma.alertUserMap.create({
        data: {
          aid: alert.aid,
          uid: user.uid,
        },
      });
    }

    for (const roleName of newAlert.roles) {
      const roles = await ctx.prisma.role.findMany({
        where: { name: roleName, pid: project.pid },
      });

      for (const role of roles) {
        await ctx.prisma.alertRoleMap.create({
          data: {
            aid: alert.aid,
            rid: role.rid,
          },
        });
      }
    }

    return alert;
  }

  @Authorized()
  @Mutation()
  async deleteAlert(@Args() { aid }: AlertId, @Ctx() ctx: Context) {
    await ctx.prisma.alert.delete({
      where: { aid },
    });
  }

  @Authorized()
  @Mutation()
  async markAlertRead(@Args() { aid }: AlertId, @Ctx() ctx: Context) {
    const uid = ctx.user?.uid;

    await ctx.prisma.alertNotification.updateMany({
      where: { aid, uid },
      data: { isRead: true },
    });
  }

  @Authorized()
  @Query(() => [AlertNotification])
  async getNotifications(
    @Args() { aid }: AlertId,
    @Ctx() ctx: Context
  ): Promise<AlertNotification[]> {
    const uid = ctx.user?.uid;

    const notifications = await ctx.prisma.alertNotification.findMany({
      where: { aid, uid, isRead: false },
      include: {
        alert: true,
      },
    });

    return notifications;
  }
}
