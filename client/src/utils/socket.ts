import socketClient from "socket.io-client";
import env from "@data/env.json";
import { getUser } from "@services/user";

export default async function serverIO() {
  const userID = await getUser().then(user => (user ? user.id : null));
  if (!userID) return;
  const io = socketClient(env.SERVER_URL, {
    auth: { userID },
  });

  return io;
}
