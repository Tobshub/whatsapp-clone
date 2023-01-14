import { ParserWithInputOutput } from "@trpc/server/dist/core/parser";
import { tError, tProcedure, tRouter } from "../trpc";
import { createUser, authenticateUser } from "./user-controller";
import { z } from "zod";

const userRouter = tRouter({
  new: tProcedure
    .input<ParserWithInputOutput<SecureUser, SecureUser>>(
      z.object({
        password: z.string().min(8).max(64),
        name: z.string(),
        email: z.string().email(),
        id: z.string().startsWith("wa"),
      })
    )
    .mutation(async ({ input }): Promise<SafeUser> => {
      const newUser = await createUser(input).catch((e: Error) => {
        throw new tError({
          code: "INTERNAL_SERVER_ERROR",
          message: e.message,
          cause: "unknown",
        });
      });

      return { id: newUser.id, email: newUser.email, name: newUser.name };
    }),
  login: tProcedure
    .input<ParserWithInputOutput<UserCreds, UserCreds>>(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(64),
      })
    )
    .query(async ({ input }): Promise<SafeUser> => {
      const user = await authenticateUser(input).catch((e: Error) => {
        throw new tError({
          code: "INTERNAL_SERVER_ERROR",
          message: e.message,
          cause: "unknown",
        });
      });

      if (!user) {
        throw new tError({
          code: "BAD_REQUEST",
          message: "email or password is wrong",
          cause: "could not authenticate user",
        });
      }

      return { id: user.id, name: user.name, email: user.email };
    }),
});

export default userRouter;
