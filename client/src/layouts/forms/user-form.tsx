import "./forms.scss";
import type { Themes } from "@context/theme";
import csx from "@utils/csx";
import { Form } from "react-router-dom";

interface UserFormProps extends React.PropsWithChildren {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  theme: Themes;
}

export default function UserForm(props: UserFormProps) {
  return (
    <div
      className={csx(
        "w-100 h-100 ",
        "d-flex justify-content-center align-items-center",
        props.theme.background,
        props.theme.foreground
      )}
    >
      <Form
        onSubmit={props.handleSubmit}
        className={csx(
          "d-flex flex-column align-items-center gap-2 user-form"
        )}
      >
        {props.children}
      </Form>
    </div>
  );
}
