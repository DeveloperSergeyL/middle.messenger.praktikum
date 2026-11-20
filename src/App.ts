import LoginPage from "./components/pages/login/Login";
import SignupPage from "./components/pages/signup/Signup";
import MessengerPage from "./components/pages/messenger/Messenger";
import ProfilePage from "./components/pages/profile/Profile";
import ErrorPage from "./components/pages/error/ErrorPage";
import Block from "./core/Block";
import AppModel from "./models/AppModel";
import AppController from "./controllers/AppController";

export default class App {
  private model: AppModel;
  private controller: AppController;
  private appElement: HTMLElement | null;

  constructor() {
    this.model = new AppModel();
    this.controller = new AppController(this.model);
    this.appElement = document.getElementById("app");

    this.model.on(AppModel.EVENTS.STATE_UPDATED, () => {
      this.render();
    });
  }

  private mountPage(page: Block): void {
    if (!this.appElement) return;
    this.appElement.replaceChildren(page.getContent());
    page.dispatchComponentDidMount();
  }

  public render(): void {
    if (!this.appElement) return;
    const state = this.model.getState();

    if (state.currentPage === 404 || state.currentPage === 500) {
      const errorPage = new ErrorPage({
        code: state.currentPage,
        onStateChange: this.controller.handleStateChange,
      });
      this.mountPage(errorPage);
      return;
    }

    if (!state.isAuth) {
      if (state.currentPage === "signup") {
        const signupPage = new SignupPage({
          errors: state.formErrors,
          values: state.formValues,
          onStateChange: this.controller.handleStateChange,
        });
        this.mountPage(signupPage);
      } else {
        const loginPage = new LoginPage({
          errors: state.formErrors,
          values: state.formValues,
          onStateChange: this.controller.handleStateChange,
        });
        this.mountPage(loginPage);
      }
      return;
    }

    if (state.currentPage === "profile") {
      const profilePage = new ProfilePage({
        user: state.currentUser,
        profileMode: state.profileMode,
        isAvatarModalOpen: state.isAvatarModalOpen,
        avatarModalState: state.avatarModalState,
        avatarFileName: state.avatarFileName,
        avatarModalError: state.avatarModalError,
        onStateChange: this.controller.handleStateChange,
        onLogout: this.controller.handleLogout,
      });
      this.mountPage(profilePage);
    } else {
      const messengerPage = new MessengerPage({
        chats: this.model.getFilteredChats(),
        activeChatId: state.activeChatId,
        searchQuery: state.searchQuery,
        isAttachMenuOpen: state.isAttachMenuOpen,
        isChatMenuOpen: state.isChatMenuOpen,
        activeModal: state.activeModal,
        modalError: state.modalError,
        modalValue: state.modalValue,
        onStateChange: this.controller.handleStateChange,
        onSendMessage: this.controller.handleSendMessage,
        onLogout: this.controller.handleLogout,
      });
      this.mountPage(messengerPage);
    }

    const searchInput =
      this.appElement.querySelector<HTMLInputElement>(".sidebar__search");
    if (searchInput && state.searchQuery) {
      searchInput.value = state.searchQuery;
      const length = searchInput.value.length;
      searchInput.focus();
      searchInput.setSelectionRange(length, length);
    }
  }
}
