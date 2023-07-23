import { User } from ".prisma/client";
import { generateRandomString } from "../util";
import jwt from "jsonwebtoken";
import { logger } from "../util";
import { prisma } from "../config";

export const jwtSecretKey =
  process.env.JWT_SECRET_KEY || generateRandomString(64);
export const jwtExpiryTime = process.env.JWT_EXPIRY_TIME || "1d";

export const extractUserFromAuthToken = async (
  authorizationHeader: string,
): Promise<User | undefined> => {
  const bearerToken = authorizationHeader.split(" ");
  if (bearerToken.length !== 2 || bearerToken[0] !== "Bearer") {
    logger.info(`invalid bearer token: ${bearerToken}`);
    return undefined;
  }

  const uid = verifyAuthToken(bearerToken[1]);
  if (!uid) return undefined;

  const user = await prisma.user.findUnique({
    where: {
      uid,
    },
    include: {
      roles: true,
    },
  });

  if (!user) return undefined;

  return user;
};

export const createAuthToken = (userId: number): string => {
  logger.info(`creating jwt token for user ${userId}`);
  return jwt.sign({ userId }, jwtSecretKey, {
    expiresIn: jwtExpiryTime,
  });
};

export const verifyAuthToken = (authToken: string): number | null => {
  try {
    const { userId } = jwt.verify(authToken, jwtSecretKey) as any;
    return userId;
  } catch (err) {
    logger.error(`failed to verify jwt token: ${err}`);
    return null;
  }
};
