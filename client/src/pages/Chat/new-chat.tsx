import genId from "@services/id";
import trpc from "@utils/trpc";
import { useState } from "react";
import { Form } from "react-router-dom";

export default function NewChat() {
  const createNewChat = trpc.chats.new.useMutation();

  const [values, setValues] = useState<{
    title: string;
    members: string;
  }>({
    title: "",
    members: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(state => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // createNewChat
    //   .mutateAsync({ ...values, id: genId(), messages: [] })
    //   .then(val => console.log("data", val));
  };

  return (
    <Form onSubmit={handleSubmit} method="post">
      <div>
        <label htmlFor="new-chat-title">Chat Title: </label>
        <input
          id="new-chat-title"
          name="title"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="new-chat-title">Chat Members: </label>
        <input
          id="new-chat-members"
          name="members"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary ">
        Create
      </button>
    </Form>
  );
}
