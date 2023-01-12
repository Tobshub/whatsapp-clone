import { string } from "zod";
import { tError, tProcedure, tRouter } from "../trpc";
import z from "zod";
import { ParserWithInputOutput } from "@trpc/server/dist/core/parser";
import { clientIO } from "..";

const chats: Chat[] = [];

const chatRouter = tRouter({
  new: tProcedure
    .input<ParserWithInputOutput<Chat, Chat>>(
      z.object({
        id: z.string(),
        title: z.string(),
        members: z
          .object({
            id: z.string().startsWith("wa"),
            email: z.string().email(),
            name: z.string(),
          })
          .array(),
        messages: z
          .object({ time: z.number(), content: z.string() })
          .array(),
      })
    )
    .mutation(async ({ input }) => {
      chats.push(input);
      clientIO.emit("new_chat");
      return chats;
    }),
  get: tProcedure.query(() => {
    return chats;
  }),
  one: tProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const chat = chats.find(chat => chat.id === input.id);
      if (!chat) {
        throw new tError({
          code: "NOT_FOUND",
          cause: "invalid chat id",
          message: `the chat with chat-id ${input.id} was not found`,
        });
      }
      return chat;
    }),
  message: tProcedure
    .input(
      z.object({
        id: z.string(),
        message: z.object({ time: z.number(), content: z.string() }),
      })
    )
    .mutation(({ input }) => {
      const i = chats.findIndex(chat => chat.id === input.id);
      chats[i].messages.push(input.message);
    }),
});

export default chatRouter;
