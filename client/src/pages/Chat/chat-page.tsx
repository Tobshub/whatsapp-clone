import trpc from "@utils/trpc";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.chatID;
  return id;
}

export default function ChatPage() {
  const id = useLoaderData() as string | undefined;
  if (!id) throw new Error("no chat id provided");

  const { data: chat, error, isLoading } = trpc.chats.one.useQuery({ id });

  if (error) throw error;
  if (isLoading) return <>Loading...</>;

  return (
    <div>
      <h1>{chat.title}</h1>
      <h3>{chat.members}</h3>
      <ul>
        {chat.messages.map(message => (
          <li>{message.content}</li>
        ))}
      </ul>
    </div>
  );
}
