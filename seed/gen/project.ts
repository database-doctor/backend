import { RoleConfig } from "./role";
import { client } from "../util";
import { logger } from "../../src/util";

export type ProjectConfig = {
  name: string;
  roles: RoleConfig[];
  users: {
    role: string;
  }[];
  bots: {
    role: string;
  }[];
};
