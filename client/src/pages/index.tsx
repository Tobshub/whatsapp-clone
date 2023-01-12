import ThemeContext, { themes } from "@context/theme";
import { getUser } from "@services/user";
import { useQuery } from "@tanstack/react-query";
import ChatSideBar from "@ui-components/chat-sidebar";
import csx from "@utils/csx";
import trpc from "@utils/trpc";
import { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState<SafeUser>();
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then(user => {
      if (!user) {
        navigate("/user/login", { replace: true });
      } else {
        setUser(user);
      }
    });
  }, []);

  return (
    <div
      className={csx(
        "w-100 h-100",
        "d-flex justify-content-start align-items-center",
        theme.background,
        theme.foreground
      )}
    >
      <ChatSideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
