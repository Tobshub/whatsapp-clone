import ThemeContext from "@context/theme";
import { getUser } from "@services/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import csx from "@utils/csx";
import serverIO from "@utils/socket";
import trpc from "@utils/trpc";
import React, { useState, useContext, useEffect } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.chatID;
  return id;
}

export default function ChatPage() {
  const id = useLoaderData() as string;
  const { theme } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // message state
  const [newMessage, setNewMessage] = useState("");

  // handle message state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  if (!user) {
    if (userLoading) {
      return <>Loading...</>;
    } else {
      throw new Error("no_user_found");
    }
  }

  // join room on mount
  useEffect(() => {
    serverIO().then(socket => {
        socket.emit("join_chat", id);
    });
    // TODO: leave the room on dismount
  }, []);

  const {
    data: chat,
    error,
    isLoading: chatLoading,
  } = trpc.chats.one.useQuery({ user, chatID: id });

  const messageMutation = trpc.chats.message.useMutation();

  const sendMessage = async (messageContent: string) => {
    if (chat) {
      const message = {
        content: messageContent,
        sender: user.id,
        time: Date.now(),
      };

      chat.messages.push(message);

      queryClient.setQueryData(["chats", "one"], chat);

      // is this needed ?
      serverIO().then(socket => {
        // emit a new message event with the message object and the chat id
        socket.emit("new_message", message, id);
      });

      await messageMutation.mutateAsync({
        user,
        chatID: id,
        message,
      });
    }
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(newMessage);
    setNewMessage("");
  };
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
          {chat.messages.map(message =>
            message.sender === user.id ? (
              <li key={message.time}>
                <em>You:</em>
                <span>{message.content}</span>
              </li>
            ) : (
              <li key={message.time}>
                <em>Them:</em>
                <span>{message.content}</span>
              </li>
            )
          )}
        </ul>
        <form className="input-group w-50" onSubmit={handleSubmit}>
          <input
            className="form-control"
            onChange={handleChange}
            value={newMessage}
          />
          <button className={csx(theme.buttons)} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
