import ChatModel from "./chat-model";
import UserModel from "../users/user-model";
import { clientIO } from "..";

// create new chat

export async function createChat(user: SafeUser, chat: NewChat) {
  try {
    // find the other users
    const secondUser = await UserModel.findOne({ email: chat.members })
      .then(doc => {
        if (!doc) {
          throw new Error("user_not_found");
        }
        return doc;
      })
      .catch(e => {
        throw e;
      });

    const newChat = new ChatModel({
      ...chat,
      members: [user, secondUser.toObject()],
    });

    const savedChat = await newChat
      .save()
      .then(doc => {
        return doc.toObject();
      })
      .catch(e => {
        throw new Error(e);
      });

    // add chat to both users
    secondUser.chats.push(savedChat);
    secondUser.save();

    // tell the client a new chat has been created
    clientIO.to(secondUser.id).emit("new_chat");

    const firstUser = await UserModel.findOne({
      id: user.id,
      email: user.email,
    });
    if (firstUser) {
      firstUser.chats.push(savedChat);
      firstUser.save();
    }

    return savedChat;
  } catch (error) {
    throw error;
  }
}

// get user chats
export async function getChats(user: SafeUser) {
  const savedUser = await UserModel.findOne({
    id: user.id,
    email: user.email,
  });

  if (!savedUser) {
    throw new Error("user_not_found");
  }

  return savedUser.toObject().chats;
}

// get a single chat
export async function getChat(user: SafeUser, chatID: string) {
  const chat = await ChatModel.findOne({
    id: chatID,
  }).then(doc => {
    if (!doc) {
      throw new Error("no_chat_found");
    }
    return doc.toObject();
  });

  if (chat.members.find(member => member.id === user.id) === undefined) {
    throw new Error("not_a_member");
  }

  // TODO: catch client-side emit of "join_chat"
  clientIO.on("join_chat", chatID => {
    console.log("user joining chat: ", chatID);
  });

  return chat;
}

// send a message
export async function sendMessage(message: Message, chatID: string) {
  try {
    const chat = await ChatModel.findOne({ id: chatID }).then(doc => {
      if (!doc) {
        throw new Error("no_chat_found");
      }

      return doc;
    });

    chat.messages.push(message);
    chat.save();

    clientIO.to(chatID).emit("message", message);

    for (const user of chat.members) {
      clientIO.to(user.id).emit("chat_update", chatID);
    }
  } catch (error) {
    throw error;
  }
}
