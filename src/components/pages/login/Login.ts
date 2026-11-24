import Block, { BaseProps } from "../../../core/Block";
import Form from "../../ui/form/Form";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import { SignInData } from "../../../types";

export interface LoginPageProps extends BaseProps {
  errors: Record<string, string> | null;
  values: Record<string, string> | null;
  onSubmit: (data: SignInData) => void;
  onNavigate: (path: string) => void;
}

export default class LoginPage extends Block<LoginPageProps> {
  constructor(props: LoginPageProps) {
    const form = new Form({
      id: "login-form",
      class: "auth-card__form",
      inputs: [
        new Input({
          id: "login",
          name: "login",
          type: "text",
          label: "Логин",
          placeholder: "ivanivanov",
          value: props.values?.login || "",
          error: props.errors?.login || "",
          required: true,
        }),
        new Input({
          id: "password",
          name: "password",
          type: "password",
          label: "Пароль",
          placeholder: "••••••••••••",
          value: props.values?.password || "",
          error: props.errors?.password || "",
          required: true,
        }),
      ],
      button: new Button({
        type: "submit",
        text: "Авторизоваться",
        class: "auth-card__submit-btn",
      }),
      onSubmit: (values) => {
        props.onSubmit({
          login: values.login,
          password: values.password,
        });
      },
    });

    super({
      ...props,
      form,
    });
  }

  protected componentDidMount(): void {
    const toSignupBtn = this.element?.querySelector("#to-signup-btn");
    toSignupBtn?.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.props.onNavigate("/sign-up");
    });

  }

  protected render(): string {
    return `
      <div class="auth-container">
        <main class="auth-card">
          <h1 class="auth-card__title">Вход</h1>
          {{{form}}}
          {{> link href="/sign-up" id="to-signup-btn" text="Нет аккаунта?" class="auth-card__link"}}
        </main>
      </div>
    `;
  }
}
