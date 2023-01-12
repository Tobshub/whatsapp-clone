import socketClient from "socket.io-client";
import env from "@data/env.json";

const serverIO = socketClient(env.SERVER_URL, { auth: {
  // add user-id
} });
export default serverIO;
