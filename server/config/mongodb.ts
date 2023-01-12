import mongoose from "mongoose";
mongoose.set("strictQuery", true);

export default function MongoConnect(uri: string | undefined) {
  if (!uri) {
    throw new Error("cluster uri cannot be undefined");
  }
  mongoose
    .connect(uri)
    .then(() => {
      console.log("mongo-connected");
    })
    .catch(e => new Error(e));
}
