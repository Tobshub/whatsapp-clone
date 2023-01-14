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

  interface NewChat {
    id: string;
    title: string;
    // add other members with their email
    members: string;
  }

  interface Chat {
    id: string;
    title: string;
    members: SafeUser[];
    messages: Message[];
  }

  interface ChatRef {
    id: string;
    title: string;
  }

  interface Message {
    // use userID to signify the sender
    sender: string;
    time: number;
    content: string;
  }
}
