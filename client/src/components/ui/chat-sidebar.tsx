import ThemeContext from "@context/theme";
import { getUser } from "@services/user";
import serverIO from "@utils/socket";
import trpc from "@utils/trpc";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function ChatSideBar({ user }: { user: SafeUser }) {
  const { theme } = useContext(ThemeContext);
  const chats = trpc.chats.get.useQuery(user);

  if (chats.error) console.warn(chats.error);

  useEffect(() => {
    serverIO().then(socket => {
      socket.on("new_chat", chatID => {
        console.log("new chat alert from server", { chatID });
        chats.refetch();
      });
    });
  }, []);

  return (
    <header className={`sidebar h-100 ${theme.middleground}`}>
      <nav className="navbar d-flex flex-column">
        <h1>
          <Link to={{ pathname: "/" }} className="navbar-brand text-reset">
            WhichApp
          </Link>
        </h1>
        <div className="nav-content d-flex flex-column justify-content-between">
          <ul className="navbar-nav navbar-collapse flex-column justify-content-start gap-2">
            {!!chats.data &&
              chats.data.map(chat => (
                <ChatNav chat={chat} key={chat.id} />
              ))}
          </ul>
          <Link
            to={{ pathname: "/new-chat" }}
            className="action-button btn btn-primary"
            role="button"
          >
            New Chat
          </Link>
        </div>
      </nav>
    </header>
  );
}

function ChatNav({ chat }: { chat: ChatRef }) {
  return (
    <li className="nav-item text-reset w-100">
      <NavLink
        to={{ pathname: `/chat/${chat.id}` }}
        className={({ isActive }) =>
          `w-100 nav-link text-reset btn btn-sm ${
            isActive ? "btn-primary" : "btn-outline-secondary"
          }`
        }
      >
        {chat.title}
      </NavLink>
    </li>
  );
}
