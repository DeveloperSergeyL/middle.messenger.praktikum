import Block, { BaseProps } from "../../../core/Block";
import profilePageTpl from "./profile.hbs?raw";
import {
  AppState,
  AvatarModalState,
  ProfileMode,
  User,
} from "../../../types";
import { validateField, validateForm } from "../../../utils/validator";

export interface ProfilePageProps extends BaseProps {
  user: User;
  profileMode: ProfileMode;
  isAvatarModalOpen: boolean;
  avatarModalState: AvatarModalState;
  avatarFileName: string;
  avatarModalError: string | null;
  onStateChange: (newState: Partial<AppState>) => void;
  onLogout: () => void;
}

export default class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps) {
    super({
      ...props,
      profileMode: props.profileMode || "view",
    });
  }

  protected componentDidMount(): void {
    this._attachListeners();
  }

  protected componentDidUpdate(): boolean {
    setTimeout(() => this._attachListeners(), 0);
    return true;
  }

  private _bindFormValidation(form: HTMLFormElement | null): void {
    if (!form) return;
    const inputs = form.querySelectorAll<HTMLInputElement>("input");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        const error = validateField(input.name, input.value);
        const fieldWrapper = input.closest(".form-field");
        const errorSpan = fieldWrapper?.querySelector(".form-field__error");

        if (error) {
          fieldWrapper?.classList.add("form-field--error");
          if (errorSpan) errorSpan.textContent = error;
        } else {
          fieldWrapper?.classList.remove("form-field--error");
          if (errorSpan) errorSpan.textContent = "";
        }
      });
    });
  }

  private _attachListeners(): void {
    const root = this.element;
    if (!root) return;

    const backBtn = root.querySelector("#profile-back-btn");
    backBtn?.addEventListener("click", () => {
      if (this.props.profileMode === "view") {
        this.props.onStateChange({ currentPage: "chat" });
      } else {
        this.props.onStateChange({ profileMode: "view" });
      }
    });

    if (this.props.profileMode === "view") {
      root
        .querySelector("#edit-data-btn")
        ?.addEventListener("click", (e: Event) => {
          e.preventDefault();
          this.props.onStateChange({ profileMode: "edit-data" });
        });

      root
        .querySelector("#edit-pass-btn")
        ?.addEventListener("click", (e: Event) => {
          e.preventDefault();
          this.props.onStateChange({ profileMode: "edit-password" });
        });

      root
        .querySelector("#profile-logout-btn")
        ?.addEventListener("click", (e: Event) => {
          e.preventDefault();
          this.props.onLogout();
        });
    }

    if (this.props.profileMode === "edit-data") {
      const dataForm =
        root.querySelector<HTMLFormElement>("#profile-data-form");
      this._bindFormValidation(dataForm);

      dataForm?.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(dataForm);
        const values: Record<string, string> = {
          email: String(formData.get("email") || "").trim(),
          login: String(formData.get("login") || "").trim(),
          first_name: String(formData.get("first_name") || "").trim(),
          second_name: String(formData.get("second_name") || "").trim(),
          display_name: String(formData.get("display_name") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
        };

        const errors = validateForm(values);
        dataForm.querySelectorAll<HTMLInputElement>("input").forEach((inp) => {
          const err = errors[inp.name] || "";
          const wrap = inp.closest(".form-field");
          const span = wrap?.querySelector(".form-field__error");
          wrap?.classList.toggle("form-field--error", Boolean(err));
          if (span) span.textContent = err;
        });

        if (Object.keys(errors).length > 0) return;

        const updatedUser: User = {
          ...this.props.user,
          email: values.email,
          login: values.login,
          first_name: values.first_name,
          second_name: values.second_name,
          display_name: values.display_name,
          phone: values.phone,
        };

        console.log("Новые данные профиля сохранены:", values);
        this.props.onStateChange({
          currentUser: updatedUser,
          profileMode: "view",
        });
      });
    }

    if (this.props.profileMode === "edit-password") {
      const passForm =
        root.querySelector<HTMLFormElement>("#profile-pass-form");
      this._bindFormValidation(passForm);

      passForm?.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(passForm);
        const passwords: Record<string, string> = {
          oldPassword: String(formData.get("oldPassword") || ""),
          newPassword: String(formData.get("newPassword") || ""),
          newPasswordConfirm: String(formData.get("newPasswordConfirm") || ""),
        };

        const errors = validateForm(passwords);
        passForm.querySelectorAll<HTMLInputElement>("input").forEach((inp) => {
          const err = errors[inp.name] || "";
          const wrap = inp.closest(".form-field");
          const span = wrap?.querySelector(".form-field__error");
          wrap?.classList.toggle("form-field--error", Boolean(err));
          if (span) span.textContent = err;
        });

        if (Object.keys(errors).length > 0) return;

        console.log("Пароль успешно изменён:", passwords);
        this.props.onStateChange({ profileMode: "view" });
      });
    }

    const avatarTrigger = root.querySelector(".profile-avatar-wrapper");
    avatarTrigger?.addEventListener("click", () => {
      this.props.onStateChange({
        isAvatarModalOpen: true,
        avatarModalState: "select",
        avatarFileName: "",
        avatarModalError: null,
      });
    });

    if (this.props.isAvatarModalOpen) {
      const overlay = root.querySelector("#avatar-modal-overlay");
      const fileLink = root.querySelector("#avatar-choose-link");
      const fileInput =
        root.querySelector<HTMLInputElement>("#avatar-file-input");
      const modalForm =
        root.querySelector<HTMLFormElement>("#avatar-modal-form");

      overlay?.addEventListener("click", (e: Event) => {
        if (e.target === overlay) {
          this.props.onStateChange({ isAvatarModalOpen: false });
        }
      });

      fileLink?.addEventListener("click", (e: Event) => {
        e.preventDefault();
        fileInput?.click();
      });

      fileInput?.addEventListener("change", (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          this.props.onStateChange({
            avatarModalState: "uploaded",
            avatarFileName: file.name,
            avatarModalError: null,
          });
        }
      });

      modalForm?.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();

        if (this.props.avatarModalState === "select") {
          this.props.onStateChange({ avatarModalError: "Нужно выбрать файл" });
          return;
        }

        if (this.props.avatarFileName === "error.jpg") {
          this.props.onStateChange({
            avatarModalState: "error",
            avatarFileName: "",
            avatarModalError: null,
          });
          return;
        }

        console.log("Отправка формы аватара:", {
          avatar: this.props.avatarFileName,
        });
        this.props.onStateChange({ isAvatarModalOpen: false });
      });
    }
  }

  protected render(): string {
    return profilePageTpl;
  }
}

