import trpc from "@utils/trpc";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appQueryClient, appTrpcClient } from "@lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import Index from "@pages/index";
import NewChat from "@pages/Chat/new-chat";
import ChatPage, { loader as chatPageLoader } from "@pages/Chat/chat-page";
import ThemeContext, { themes } from "@context/theme";
import { useState } from "react";
import UserLogin from "@pages/Account/login";
import UserSignUp from "@pages/Account/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "new-chat",
        element: <NewChat />,
      },
      {
        path: "/chat/:chatID",
        element: <ChatPage />,
        loader: chatPageLoader,
      },
    ],
  },
  {
    path: "/user",
    children: [
      {
        path: "login",
        element: <UserLogin />,
      },
      {
        path: "sign-up",
        element: <UserSignUp />,
      },
    ],
  },
]);

export default function App() {
  // handle theme at the top layer of the app
  const [theme, setTheme] = useState<
    typeof themes.light | typeof themes.dark
  >(themes.dark);

  const toggleTheme = () => {
    if (theme.background === "bg-dark") {
      setTheme(themes.light);
    } else {
      setTheme(themes.dark);
    }
  };
  return (
    <trpc.Provider client={appTrpcClient} queryClient={appQueryClient}>
      <QueryClientProvider client={appQueryClient}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <RouterProvider router={router} />
        </ThemeContext.Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

