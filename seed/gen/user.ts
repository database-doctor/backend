import bcrypt from "bcryptjs";
import { client } from "../config";
import { faker } from "@faker-js/faker";

export type User = {
  uid: number;
  name: string;
  email: string;
  password: string;
};

const generateUser = async (isBot: boolean): Promise<User> => {
  const query = `
    INSERT INTO "User" ("name", "email", "password", "createdAt")
    VALUES ($1, $2, $3, $4) RETURNING "uid";
  `;

  const name = isBot
    ? "service-account-" + faker.string.alphanumeric(8)
    : faker.person.fullName();
  const email = isBot ? name + "@example.com" : faker.internet.email();
  const password = bcrypt.hashSync(faker.internet.password(), 10);
  const createdAt = faker.date.between({
    from: "2023-01-01",
    to: "2023-01-31",
  });

  const res = await client.query(query, [name, email, password, createdAt]);
  const uid = res.rows[0].uid;
  return { uid, name, email, password };
};

export const generateUsers = async (count: number): Promise<User[]> => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser(false));
  }
  return users;
};

export const generateBots = async (count: number): Promise<User[]> => {
  const bots: User[] = [];
  for (let i = 0; i < count; i++) {
    bots.push(await generateUser(true));
  }
  return bots;
};
