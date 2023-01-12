import mongoose from "mongoose";

const UserSchema = new mongoose.Schema<RiskyUser>({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true, maxlength: 64 },
  name: { type: String, required: true, maxlength: 64 },
  chats: {
    type: [
      {
        title: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    default: [],
  },
  password: { type: String, minlength: 8, maxlength: 64 },
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
