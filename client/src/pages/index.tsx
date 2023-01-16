import ThemeContext, { themes } from "@context/theme";
import { getUser } from "@services/user";
import { useQuery } from "@tanstack/react-query";
import ChatSideBar from "@ui-components/chat-sidebar";
import csx from "@utils/csx";
import serverIO from "@utils/socket";
import trpc from "@utils/trpc";
import { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to the login screen if there is no user
    if (!user && !isLoading && !isFetching) {
      navigate("/user/login", { replace: true });
    } else if (user) {
      // add userID to the handshake to use as default room
      serverIO().then(socket => socket.connect()).catch();
    }
  }, [user, isLoading]);

  if (!user) return <>Loading...</>;

  return (
    <div
      className={csx(
        "w-100 h-100",
        "d-flex justify-content-start align-items-center",
        theme.background,
        theme.foreground
      )}
    >
      <ChatSideBar user={user} />
      <main className={csx("w-100 h-100")}>
        <Outlet />
      </main>
    </div>
  );
}
