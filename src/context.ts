import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

const prisma = new PrismaClient();

export const context = (ctx: any): Context => {
  const req: Request = ctx.req;
  const res: Response = ctx.res;

  return {
    prisma,
    req,
    res,
  };
};
