import { AuthChecker } from "type-graphql";
import { Context } from "./context";

export const authChecker: AuthChecker<Context> = (authInfo) => {
  return !!authInfo.context.user;
};
