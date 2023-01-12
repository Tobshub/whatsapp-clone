export {};

declare global {
  // Users
  interface SafeUser {
    id: string;
    email: string;
    name: string;
  }

  interface UserCreds {
    email: string;
    password: string;
  }

  interface SecureUser extends SafeUser {
    password: string;
  }

  interface RiskyUser extends SecureUser {
    chats: ChatRef[];
  }

  // Chat

  interface Chat {
    id: string;
    title: string;
    members: SafeUser[];
    messages: Messages[];
  }

  interface ChatRef {
    id: string;
    title: string;
  }

  interface Messages {
    time: number;
    content: string;
  }
}
