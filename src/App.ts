import LoginPage from "./components/pages/login/Login";
import SignupPage from "./components/pages/signup/Signup";
import MessengerPage from "./components/pages/messenger/Messenger";
import ProfilePage from "./components/pages/profile/Profile";
import ErrorPage from "./components/pages/error/ErrorPage";
import AppModel from "./models/AppModel";
import AppController from "./controllers/AppController";
import Router from "./core/Router";

export default class App {
  private model: AppModel;
  private controller: AppController;
  private router: Router;

  constructor() {
    this.model = new AppModel();
    this.router = new Router("#app");
    this.controller = new AppController(this.model, this.router);

    this.model.on(AppModel.EVENTS.STATE_UPDATED, () => {
      this.router.rerenderCurrent();
      this._restoreSearchFocus();
    });
  }

  private _restoreSearchFocus(): void {
    const state = this.model.getState();
    const searchInput =
      document.querySelector<HTMLInputElement>(".sidebar__search");
    if (searchInput && state.searchQuery) {
      searchInput.value = state.searchQuery;
      const length = searchInput.value.length;
      searchInput.focus();
      searchInput.setSelectionRange(length, length);
    }
  }

  public async render(): Promise<void> {
    await this.controller.checkAuth();

    this.router
      .setGuard((pathname: string) => {
        const { isAuth } = this.model.getState();
        const isPublicRoute = pathname === "/" || pathname === "/sign-up";

        if (!isAuth && !isPublicRoute && pathname !== "/404" && pathname !== "/500") {
          return "/";
        }

        if (isAuth && isPublicRoute) {
          return "/messenger";
        }

        return null;
      })
      .use("/", LoginPage, () => ({
        errors: this.model.getState().formErrors,
        values: this.model.getState().formValues,
        onSubmit: this.controller.handleSignIn,
        onNavigate: (path: string) => this.router.go(path),
      }))
      .use("/sign-up", SignupPage, () => ({
        errors: this.model.getState().formErrors,
        values: this.model.getState().formValues,
        onSubmit: this.controller.handleSignUp,
        onNavigate: (path: string) => this.router.go(path),
      }))
      .use("/messenger", MessengerPage, () => {
        const state = this.model.getState();
        return {
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
          onCreateChat: this.controller.handleCreateChat,
          onChatUserAction: this.controller.handleChatUserAction,
          onNavigate: (path: string) => this.router.go(path),
          onLogout: this.controller.handleLogout,
        };
      })
      .use("/settings", ProfilePage, () => {
        const state = this.model.getState();
        return {
          user: state.currentUser,
          profileMode: state.profileMode,
          isAvatarModalOpen: state.isAvatarModalOpen,
          avatarModalState: state.avatarModalState,
          avatarFileName: state.avatarFileName,
          avatarFile: state.avatarFile,
          avatarModalError: state.avatarModalError,
          onStateChange: this.controller.handleStateChange,
          onUpdateProfile: this.controller.handleUpdateProfile,
          onUpdatePassword: this.controller.handleUpdatePassword,
          onUpdateAvatar: this.controller.handleUpdateAvatar,
          onNavigate: (path: string) => this.router.go(path),
          onLogout: this.controller.handleLogout,
        };
      })
      .use("/404", ErrorPage, () => ({
        code: 404 as const,
        onNavigate: (path: string) => this.router.go(path),
      }))
      .use("/500", ErrorPage, () => ({
        code: 500 as const,
        onNavigate: (path: string) => this.router.go(path),
      }))
      .start();
  }
}
