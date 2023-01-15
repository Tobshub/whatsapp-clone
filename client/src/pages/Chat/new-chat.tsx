import ThemeContext from "@context/theme";
import UserForm from "@layouts/forms/user-form";
import genId from "@services/id";
import { getUser } from "@services/user";
import { useQueryClient } from "@tanstack/react-query";
import csx from "@utils/csx";
import trpc from "@utils/trpc";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";

export default function NewChat() {
  const { theme } = useContext(ThemeContext);
  const createNewChat = trpc.chats.new.useMutation();
  const [errorState, setErrorState] = useState(false);

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
    const user = await getUser();
    if (user) {
      await createNewChat
        .mutateAsync({
          user,
          chat: { ...values, id: genId("chat") },
        })
        .catch(e => {
          setErrorState(true);
        });
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (createNewChat.data) {
      navigate(`/chat/${createNewChat.data.id}`, { replace: true });
    }
  }, [createNewChat.data]);

  return (
    <UserForm handleSubmit={handleSubmit} theme={theme}>
      <fieldset className="input-group">
        <label>
          <span>Chat Title:</span>
          <input
            name="title"
            className="form-control"
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <fieldset className="input-group">
        <label>
          <span>Chat Members (email):</span>
          <input
            name="members"
            className="form-control"
            onChange={handleChange}
          />
        </label>
        {errorState && (
          <span className={csx("alert alert-danger p-1")}>
            The member you tried to add is not a user
          </span>
        )}
      </fieldset>
      <button type="submit" className={csx(theme.buttons)}>
        Create
      </button>
    </UserForm>
  );
}
