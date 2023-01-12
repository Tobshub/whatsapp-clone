import chatRouter from "./chats/chat-router";
import { tRouter } from "./trpc";
import userRouter from "./users/user-router";

export const appRouter = tRouter({
  user: userRouter,
  chats: chatRouter,
});

export type AppRouter = typeof appRouter;
