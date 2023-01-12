import localforage from "localforage";

const userStorage = localforage.createInstance({
  name: "whichapp",
});

export async function saveUser(user: SafeUser) {
  await userStorage.setItem("user", user);
}

export async function getUser(): Promise<SafeUser | false> {
  const user = await userStorage
    .getItem("user")
    .then(user => {
      return user as SafeUser;
    })
    .catch(e => {
      return false as const;
    });
  return user;
}

export function removeUser() {
  userStorage.removeItem("user");
}
