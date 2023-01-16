import { tError, tProcedure, tRouter } from "../trpc";
import z from "zod";
import { ParserWithInputOutput } from "@trpc/server/dist/core/parser";
import { clientIO } from "..";
import {
  createChat,
  getChat,
  getChats,
  sendMessage,
} from "./chat-controller";

const chatRouter = tRouter({
  new: tProcedure
    .input<
      ParserWithInputOutput<
        { user: SafeUser; chat: NewChat },
        { user: SafeUser; chat: NewChat }
      >
    >(
      z.object({
        user: z.object({
          id: z.string().startsWith("wa"),
          email: z.string().email(),
          name: z.string(),
        }),
        chat: z.object({
          id: z.string(),
          title: z.string(),
          members: z.string().email(),
        }),
      })
    )
    .mutation(async ({ input }): Promise<Chat> => {
      const newChat = await createChat(input.user, input.chat)
        .then(chat => {
          return chat;
        })
        .catch(e => {
          if (e.messsage === "user_not_found") {
            throw new tError({
              code: "BAD_REQUEST",
              message: "user_not_found",
              cause: "the member you tried to add does not exist",
            });
          } else {
            throw new tError({
              code: "INTERNAL_SERVER_ERROR",
              message: "an error occurred",
              cause: "unknown",
            });
          }
        });

      return {
        id: newChat.id,
        members: newChat.members,
        title: newChat.title,
        messages: newChat.messages,
      };
    }),
  get: tProcedure
    .input<ParserWithInputOutput<SafeUser, SafeUser>>(
      z.object({
        id: z.string().startsWith("wa"),
        name: z.string(),
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const chat = await getChats(input).catch(e => {
        throw new tError({
          code: "NOT_FOUND",
          message: "user was not found",
          cause: "you are not a registered user",
        });
      });

      return chat;
    }),
  one: tProcedure
    .input<
      ParserWithInputOutput<
        { user: SafeUser; chatID: string },
        { user: SafeUser; chatID: string }
      >
    >(
      z.object({
        user: z.object({
          id: z.string().startsWith("wau"),
          email: z.string().email(),
          name: z.string(),
        }),
        chatID: z.string().startsWith("wac"),
      })
    )
    .query(async ({ input }): Promise<Chat> => {
      const chat = await getChat(input.user, input.chatID).catch(e => {
        if (e.message === "no_chat_found") {
          throw new tError({
            code: "NOT_FOUND",
            cause: "chat might have been deleted",
            message: e.message,
          });
        } else if (e.message === "not_a_member") {
          throw new tError({
            code: "UNAUTHORIZED",
            cause: "user is not a member of this chat",
            message: e.message,
          });
        } else {
          throw new tError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "unknown",
            message: e.message,
          });
        }
      });

      return {
        id: chat.id,
        members: chat.members,
        messages: chat.messages,
        title: chat.title,
      };
    }),
  message: tProcedure
    .input<
      ParserWithInputOutput<
        { user: SafeUser; chatID: string; message: Message },
        { user: SafeUser; chatID: string; message: Message }
      >
    >(
      z.object({
        user: z.object({
          id: z.string().startsWith("wau"),
          email: z.string().email(),
          name: z.string(),
        }),
        chatID: z.string().startsWith("wac"),
        message: z.object({
          sender: z.string().startsWith("wau"),
          time: z.number(),
          content: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await sendMessage(input.message, input.chatID).catch(e => {
        throw new tError({
          code: "NOT_FOUND",
          message: e.message,
          cause: "could not find chat with that id",
        });
      });

      return;
    }),
});

export default chatRouter;
