import ThemeContext from "@context/theme";
import UserForm from "@layouts/forms/user-form";
import { saveUser } from "@services/user";
import csx from "@utils/csx";
import trpc from "@utils/trpc";
import { useState, useEffect, useContext } from "react";
import { Form, Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const { theme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [errorState, setErrorState] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails(state => ({
      ...state,
      [e.target.name]: e.target.value ?? "",
    }));
    if (errorState) {
      setErrorState(false);
    }
  };

  const login = trpc.user.login.useQuery(userDetails, { enabled: false });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.refetch();
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (login.data) {
      saveUser(login.data).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [login.data]);

  useEffect(() => {
    if (login.error) {
      const { message } = login.error;
      if (message === "user_not_found") {
        console.log(message);
        setErrorState(true);
      }
    }
  }, [login.error]);

  if (login.isLoading && login.isFetching) return <>Loading...</>;

  return (
    <UserForm handleSubmit={handleSubmit} theme={theme}>
      <h1>Login</h1>
      {errorState ? (
        <p className={csx("alert alert-danger p-1")}>
          Email or password is incorrect
        </p>
      ) : null}
      <fieldset className="input-group">
        <label>
          <span>Email: </span>
          <input
            className={csx("form-control", "py-2 px-3")}
            name="email"
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <fieldset className="input-group">
        <label>
          <span>Password: </span>
          <input
            className={csx("form-control", "py-2 px-3")}
            name="password"
            onChange={handleChange}
          />
        </label>
      </fieldset>

      <button className={csx(theme.buttons, "text-reset ")}>Login</button>
      <Link to={"/user/sign-up"}>Sign-up instead</Link>
    </UserForm>
  );
}
