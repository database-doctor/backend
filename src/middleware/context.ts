import { Logger, logger } from "../util";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { User } from "@generated/type-graphql";
import { extractUserFromAuthToken } from "../auth";
import { prisma } from "../config";

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  logger: Logger;
  user?: User;
}

export const context = async (ctx: any): Promise<Context> => {
  const req: Request = ctx.req;
  const res: Response = ctx.res;
  const user = req.headers.authorization
    ? await extractUserFromAuthToken(req.headers.authorization)
    : undefined;

  return {
    req,
    res,
    prisma,
    logger,
    user,
  };
};
