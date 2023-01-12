import UserModel from "./user-model";
import secure from "bcrypt";

export async function createUser(user: SecureUser) {
  try {
    // hash password with bcrypt library
    const password = await secure.hash(user.password, 10);

    const newUser = new UserModel({ ...user, password });
    const saved = await newUser.save().then(doc => doc.toObject());
    return saved;
  } catch (error) {
    throw error;
  }
}

export async function authenticateUser(user: UserCreds) {
  try {
    const storedUser = await UserModel.findOne({
      email: user.email,
    })
      .then(doc => {
        if (!doc) {
          throw new Error("no user found");
        }
        return doc.toObject();
      })
      .catch(e => {
        throw e;
      });

    const verify = await secure.compare(
      user.password,
      storedUser.password
    );

    if (!verify) {
      return false;
    }

    return storedUser;
  } catch (error) {
    throw error;
  }
}
