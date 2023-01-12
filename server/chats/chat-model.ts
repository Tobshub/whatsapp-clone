import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema<Chat>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  members: {
    type: [
      {
        id: { type: String, required: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    required: true,
  },
  messages: {
    type: [
      {
        time: { type: Number, required: true },
        content: { type: String, required: true },
      },
    ],
    default: [],
  },
});

const ChatModel = mongoose.model("chats", ChatSchema);
export default ChatModel;
