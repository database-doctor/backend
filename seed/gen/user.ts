import bcrypt from "bcryptjs";
import { client } from "../config";
import { faker } from "@faker-js/faker";
import { logger } from "../../src/util";

export type User = {
  uid: number;
  username: string;
  name: string;
  email: string;
  password: string;
};

const generateUser = async (isBot: boolean): Promise<User> => {
  const query = `
    INSERT INTO "User" ("name", "username", "email", "password", "createdAt")
    VALUES ($1, $2, $3, $4, $5) RETURNING "uid";
  `;

  const [name, username, email] = isBot
    ? [
        "service-account-" + faker.string.alphanumeric(8),
        "service-account-" + faker.string.alphanumeric(8),
        "service-account-" + faker.string.alphanumeric(8) + "@example.com",
      ]
    : [
        faker.person.fullName(),
        faker.internet.userName(),
        faker.internet.email(),
      ];

  const password = bcrypt.hashSync(faker.internet.password(), 10);
  const createdAt = faker.date.between({
    from: "2023-01-01",
    to: "2023-01-31",
  });

  const res = await client.query(query, [
    name,
    username,
    email,
    password,
    createdAt,
  ]);
  const uid = res.rows[0].uid;
  return { uid, name, username, email, password };
};

export const generateUsers = async (count: number): Promise<User[]> => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser(false));
  }

  logger.info(`generated ${count} users`);
  return users;
};

export const generateBots = async (count: number): Promise<User[]> => {
  const bots: User[] = [];
  for (let i = 0; i < count; i++) {
    bots.push(await generateUser(true));
  }

  logger.info(`generated ${count} bot accounts`);
  return bots;
};
