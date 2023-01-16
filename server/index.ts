import express from "express";
import { config } from "dotenv";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./server";
import { Server } from "http";
import { Server as socketServer } from "socket.io";
import MongoConnect from "./config/mongodb";

// load environment variable from .env
config();

MongoConnect(process.env.MONGO_URI);

const app = express();

app.use(cors(), express.json());

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

const server = new Server(app);

export const clientIO = new socketServer(server, {
  cors: { origin: "*" },
});

clientIO.on("connection", socket => {
  socket.join(socket.handshake.auth.userID);

  socket.on("join_chat", chatID => {
    // join a chat room with its ID
    socket.join(chatID);
  });

  // should this be here ???
  socket.on("new_message", (message, chatID) => {
    console.log("sending message...");
    // retaliate by sending the message to the room with the specified chat-id
    socket.to(chatID).emit("message", message);
  });
});

server.listen(2048, () => {
  console.log(`live (Port 2048)`);
});
