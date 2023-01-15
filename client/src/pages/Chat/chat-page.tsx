import ThemeContext from "@context/theme";
import { getUser } from "@services/user";
import { useQuery } from "@tanstack/react-query";
import csx from "@utils/csx";
import serverIO from "@utils/socket";
import trpc from "@utils/trpc";
import { useState, useContext, useEffect } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.chatID;
  return id;
}

export default function ChatPage() {
  const id = useLoaderData() as string;
  const { theme } = useContext(ThemeContext);
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  if (!user) {
    if (userLoading) {
      return <>Loading...</>;
    } else {
      throw new Error("no_user_found");
    }
  }

  const joinChat = trpc.chats.join.useQuery(
    { chatID: id, user },
    { enabled: false }
  );

  // join room on mount
  useEffect(() => {
    serverIO().then(socket => {
      if (socket) {
        console.log("joining...");
        socket.emit("join_chat", id);
      }
    });
    // leave the room on dismount
    return () => {};
  }, []);

  // const messageMutation = trpc.chats.message.useMutation

  const sendMessage = async () => {};

  const {
    data: chat,
    error,
    isLoading: chatLoading,
  } = trpc.chats.one.useQuery({ user, chatID: id });

  if (error) throw error;
  if (chatLoading) return <>Loading...</>;

  return (
    <div>
      <h1>{chat.title}</h1>
      <h3>
        {chat.members[0].name} | {chat.members[1].name}
      </h3>
      <div>
        <ul>
          {chat.messages.map(message => (
            <li>{message.content}</li>
          ))}
        </ul>
        <form className="input-group w-50">
          <input className="form-control" />
          <button className={csx(theme.buttons)}>Send</button>
        </form>
      </div>
    </div>
  );
}
