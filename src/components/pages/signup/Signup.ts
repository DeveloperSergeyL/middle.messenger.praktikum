import Block, { BaseProps } from "../../../core/Block";
import Form from "../../ui/form/Form";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import { AppState } from "../../../types";

export interface SignupPageProps extends BaseProps {
  errors: Record<string, string> | null;
  values: Record<string, string> | null;
  onStateChange: (newState: Partial<AppState>) => void;
}

export default class SignupPage extends Block<SignupPageProps> {
  constructor(props: SignupPageProps) {
    const form = new Form({
      id: "signup-form",
      class: "auth-card__form",
      inputs: [
        new Input({
          id: "email",
          name: "email",
          type: "email",
          label: "Почта",
          placeholder: "pochta@yandex.ru",
          value: props.values?.email || "",
          error: props.errors?.email || "",
          required: true,
        }),
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
          id: "first_name",
          name: "first_name",
          type: "text",
          label: "Имя",
          placeholder: "Иван",
          value: props.values?.first_name || "",
          error: props.errors?.first_name || "",
          required: true,
        }),
        new Input({
          id: "second_name",
          name: "second_name",
          type: "text",
          label: "Фамилия",
          placeholder: "Иванов",
          value: props.values?.second_name || "",
          error: props.errors?.second_name || "",
          required: true,
        }),
        new Input({
          id: "phone",
          name: "phone",
          type: "tel",
          label: "Телефон",
          placeholder: "+7 (***) *** ** **",
          value: props.values?.phone || "",
          error: props.errors?.phone || "",
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
        new Input({
          id: "password_confirm",
          name: "password_confirm",
          type: "password",
          label: "Пароль (ещё раз)",
          placeholder: "••••••••••••",
          value: props.values?.password_confirm || "",
          error: props.errors?.password_confirm || "",
          required: true,
        }),
      ],
      button: new Button({
        type: "submit",
        text: "Зарегистрироваться",
        class: "auth-card__submit-btn",
      }),
      onSubmit: () => {
        localStorage.setItem("isAuth", "true");
        props.onStateChange({
          formErrors: null,
          formValues: null,
          isAuth: true,
          currentPage: "chat",
        });
      },
    });

    super({
      ...props,
      form,
    });
  }

  protected componentDidMount(): void {
    const toLoginBtn = this.element?.querySelector("#to-login-btn");
    toLoginBtn?.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.props.onStateChange({
        formErrors: null,
        formValues: null,
        currentPage: "login",
      });
    });
  }

  protected render(): string {
    return `
      <div class="auth-container">
        <main class="auth-card auth-card--signup">
          <h1 class="auth-card__title">Регистрация</h1>
          {{{form}}}
          {{> link href="/login" id="to-login-btn" text="Войти" class="auth-card__link"}}
        </main>
      </div>
    `;
  }
}

