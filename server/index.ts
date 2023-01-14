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
  console.log("new connection established", socket.handshake.auth.userID);
  socket.join(socket.handshake.auth.userID);
});

server.listen(2048, () => {
  console.log(`live (Port 2048)`);
});
