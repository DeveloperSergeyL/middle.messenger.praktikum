import Handlebars from "handlebars";
import Block, { BaseProps } from "../../../core/Block";
import messengerPageTpl from "./messenger.hbs?raw";

import sidebarTpl from "../../ui/sidebar/sidebar.hbs?raw";
import chatItemTpl from "../../ui/chat-item/chat-item.hbs?raw";
import chatWindowTpl from "../../ui/chat-window/chat-window.hbs?raw";
import messageTpl from "../../ui/message/message.hbs?raw";
import { AppState, Chat } from "../../../types";
import { validateField } from "../../../utils/validator";

Handlebars.registerPartial("sidebar", sidebarTpl);
Handlebars.registerPartial("chat-item", chatItemTpl);
Handlebars.registerPartial("chat-window", chatWindowTpl);
Handlebars.registerPartial("message", messageTpl);

export interface MessengerPageProps extends BaseProps {
  chats: Chat[];
  activeChatId: number | string | null;
  searchQuery: string;
  isAttachMenuOpen: boolean;
  isChatMenuOpen: boolean;
  activeModal: string | null;
  modalError: string | null;
  modalValue: string;
  onStateChange: (newState: Partial<AppState>) => void;
  onSendMessage?: (chatId: number, text: string) => void;
  onLogout: () => void;
}

type DropdownStateKey = "isAttachMenuOpen" | "isChatMenuOpen";

export default class MessengerPage extends Block<MessengerPageProps> {
  constructor(props: MessengerPageProps) {
    const activeChat = props.chats.find(
      (chat) => chat.id === Number(props.activeChatId)
    );
    super({
      ...props,
      activeChat,
    });
  }

  protected componentDidMount(): void {
    this._attachListeners();
  }

  protected componentDidUpdate(): boolean {
    setTimeout(() => this._attachListeners(), 0);
    return true;
  }

  private _attachListeners(): void {
    const root = this.element;
    if (!root) return;

    this._setupDropdownMenu(
      "attach-btn",
      this.props.isAttachMenuOpen,
      "isAttachMenuOpen"
    );
    this._setupDropdownMenu(
      "chat-actions-btn",
      this.props.isChatMenuOpen,
      "isChatMenuOpen"
    );

    const chatListContainer = root.querySelector(".sidebar__chat-list");
    chatListContainer?.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement | null;
      const chatItem = target?.closest<HTMLElement>(".chat-item");
      if (chatItem?.dataset.id) {
        this.props.onStateChange({ activeChatId: Number(chatItem.dataset.id) });
      }
    });

    const searchInput = root.querySelector<HTMLInputElement>(".sidebar__search");
    searchInput?.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.props.onStateChange({ searchQuery: target.value });
    });

    // Форма отправки сообщения (валидация по blur и submit)
    const messageForm = root.querySelector<HTMLFormElement>("#message-form");
    const messageInput =
      root.querySelector<HTMLInputElement>("#message-input");

    messageInput?.addEventListener("blur", () => {
      const error = validateField("message", messageInput.value);
      const wrapper = messageInput.closest(".form-field");
      const errorSpan = wrapper?.querySelector(".form-field__error");
      wrapper?.classList.toggle("form-field--error", Boolean(error));
      if (errorSpan) errorSpan.textContent = error;
    });

    messageForm?.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      if (!messageInput) return;

      const text = messageInput.value.trim();
      const error = validateField("message", text);
      const wrapper = messageInput.closest(".form-field");
      const errorSpan = wrapper?.querySelector(".form-field__error");

      wrapper?.classList.toggle("form-field--error", Boolean(error));
      if (errorSpan) errorSpan.textContent = error;

      if (error) return;

      console.log("Отправка формы сообщения:", { message: text });
      if (this.props.activeChatId) {
        this.props.onSendMessage?.(Number(this.props.activeChatId), text);
      }
    });

    root.querySelector("#add-user-btn")?.addEventListener("click", () => {
      this.props.onStateChange({
        activeModal: "add-user",
        isChatMenuOpen: false,
        modalError: null,
        modalValue: "",
      });
    });

    root.querySelector("#delete-user-btn")?.addEventListener("click", () => {
      this.props.onStateChange({
        activeModal: "delete-user",
        isChatMenuOpen: false,
        modalError: null,
        modalValue: "",
      });
    });

    if (this.props.activeModal) {
      const modalOverlay = root.querySelector("#modal-overlay");
      const modalForm = root.querySelector<HTMLFormElement>("#modal-form");
      const modalInput = root.querySelector<HTMLInputElement>("#modal-login");

      modalInput?.addEventListener("blur", () => {
        const error = validateField("login", modalInput.value);
        const wrapper = modalInput.closest(".form-field");
        const errorSpan = wrapper?.querySelector(".form-field__error");
        wrapper?.classList.toggle("form-field--error", Boolean(error));
        if (errorSpan) errorSpan.textContent = error;
      });

      modalOverlay?.addEventListener("click", (e: Event) => {
        if (e.target === modalOverlay) {
          this.props.onStateChange({
            activeModal: null,
            modalError: null,
            modalValue: "",
          });
        }
      });

      modalForm?.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();
        const loginValue = modalInput ? modalInput.value.trim() : "";
        const error = validateField("login", loginValue);
        const actionType = modalForm.dataset.action;

        if (error) {
          this.props.onStateChange({
            modalError: error,
            modalValue: loginValue,
          });
        } else {
          console.log(`Отправка формы [${actionType}]:`, {
            login: loginValue,
          });
          this.props.onStateChange({
            activeModal: null,
            modalError: null,
            modalValue: "",
          });
        }
      });
    }

    root
      .querySelector("#logout-btn")
      ?.addEventListener("click", () => this.props.onLogout());

    root
      .querySelector("#to-profile-btn")
      ?.addEventListener("click", (e: Event) => {
        e.preventDefault();
        this.props.onStateChange({ currentPage: "profile" });
      });
  }

  private _setupDropdownMenu(
    buttonId: string,
    isOpenFlag: boolean,
    stateKey: DropdownStateKey
  ): void {
    const btn = this.element?.querySelector(`#${buttonId}`);
    if (!btn) return;

    btn.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      const stateUpdate: Partial<AppState> = { [stateKey]: !isOpenFlag };

      if (!isOpenFlag) {
        if (stateKey === "isAttachMenuOpen") {
          stateUpdate.isChatMenuOpen = false;
        } else if (stateKey === "isChatMenuOpen") {
          stateUpdate.isAttachMenuOpen = false;
        }
      }

      this.props.onStateChange(stateUpdate);
    });

    if (isOpenFlag) {
      document.addEventListener(
        "click",
        () => {
          this.props.onStateChange({ [stateKey]: false });
        },
        { once: true }
      );
    }
  }

  protected render(): string {
    return messengerPageTpl;
  }
}

