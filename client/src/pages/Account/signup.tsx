import ThemeContext from "@context/theme";
import UserForm from "@layouts/forms/user-form";
import genId from "@services/id";
import csx from "@utils/csx";
import trpc from "@utils/trpc";
import { useState, useContext } from "react";
import { Form, Link } from "react-router-dom";

export default function UserSignUp() {
  const { theme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails(state => ({
      ...state,
      [e.target.name]: e.target.value ?? "",
    }));
  };

  const signUp = trpc.user.new.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signUp
      .mutateAsync({ ...userDetails, id: genId() })
      .then(user => {
        console.log(user);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <UserForm handleSubmit={handleSubmit} theme={theme}>
      <h1>Sign Up</h1>
      <fieldset className="input-group">
        <label>
          <span>Name: </span>
          <input
            className="form-control py-2 px-3"
            name="name"
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <fieldset className="input-group">
        <label>
          <span>Email: </span>
          <input
            className="form-control py-2 px-3"
            name="email"
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <fieldset className="input-group">
        <label>
          <span>Password: </span>
          <input
            className="form-control py-2 px-3"
            name="password"
            onChange={handleChange}
          />
        </label>
      </fieldset>

      <button type="submit" className={csx(theme.buttons, "text-reset ")}>
        Sign Up
      </button>
      <Link to={"/user/login"}>Login instead</Link>
    </UserForm>
  );
}
