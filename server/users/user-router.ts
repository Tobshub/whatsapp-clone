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
    .mutation(async ({ input }) => {
      const newUser = await createUser(input).catch(e => {
        if (e) {
          throw new tError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occured while trying to create user",
            cause: "unknown",
          });
        }
      });

      return newUser;
    }),
  login: tProcedure
    .input<ParserWithInputOutput<UserCreds, UserCreds>>(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(64),
      })
    )
    .query(async ({ input }): Promise<SafeUser> => {
      const user = await authenticateUser(input).catch(e => {
        throw new tError({
          code: "INTERNAL_SERVER_ERROR",
          message: "an error occured",
          cause: "unknown",
        });
      });

      if (!user) {
        throw new tError({
          code: "BAD_REQUEST",
          message: "could not authenticate user",
          cause: "email or password is wrong",
        });
      }

      return { id: user.id, name: user.name, email: user.email };
    }),
});

export default userRouter;
