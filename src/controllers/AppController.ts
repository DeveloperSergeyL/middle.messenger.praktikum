import AppModel from "../models/AppModel";
import Router from "../core/Router";
import AuthAPI from "../api/AuthAPI";
import UserAPI from "../api/UserAPI";
import ChatsAPI from "../api/ChatsAPI";
import { HTTPError } from "../utils/HTTPTransport";
import {
    AppState,
    SignInData,
    SignUpData,
    UpdatePasswordData,
    UpdateProfileData,
} from "../types";

export default class AppController {
    private model: AppModel;
    private router: Router;
    private authAPI = new AuthAPI();
    private userAPI = new UserAPI();
    private chatsAPI = new ChatsAPI();

    constructor(model: AppModel, router: Router) {
        this.model = model;
        this.router = router;

        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
        this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
        this.handleUpdateAvatar = this.handleUpdateAvatar.bind(this);
        this.handleCreateChat = this.handleCreateChat.bind(this);
        this.handleChatUserAction = this.handleChatUserAction.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.loadChatUsers = this.loadChatUsers.bind(this);
        this.handleRemoveUserById = this.handleRemoveUserById.bind(this);
        this.handleDeleteChat = this.handleDeleteChat.bind(this);
        this.handleUpdateChatAvatar = this.handleUpdateChatAvatar.bind(this);
    }

    private getErrorReason(error: unknown, fallback: string): string {
        if (error instanceof HTTPError) {
            if (error.status >= 500) {
                this.router.go("/500");
                return "Ошибка сервера";
            }
            const body = error.response as { reason?: string } | undefined;
            if (body?.reason) return body.reason;
        }
        return fallback;
    }

    public async checkAuth(): Promise<boolean> {
        try {
            const userDTO = await this.authAPI.getUser();
            this.model.setState({
                isAuth: true,
                currentUser: this.model.mapUserDTO(userDTO),
            });
            await this.loadChats();
            return true;
        } catch {
            this.model.setState({ isAuth: false });
            return false;
        }
    }

    public async handleSignIn(data: SignInData): Promise<void> {
        try {
            await this.authAPI.signIn(data);
            const userDTO = await this.authAPI.getUser();
            this.model.setState({
                isAuth: true,
                formErrors: null,
                formValues: null,
                currentUser: this.model.mapUserDTO(userDTO),
            });
            await this.loadChats();
            this.router.go("/messenger");
        } catch (error) {
            const reason = this.getErrorReason(error, "Неверный логин или пароль");
            if (reason === "User already in system") {
                await this.checkAuth();
                this.router.go("/messenger");
                return;
            }
            this.model.setState({
                formErrors: { login: reason },
                formValues: { login: data.login, password: data.password },
            });
        }
    }

    public async handleSignUp(data: SignUpData): Promise<void> {
        try {
            await this.authAPI.signUp(data);
            const userDTO = await this.authAPI.getUser();
            this.model.setState({
                isAuth: true,
                formErrors: null,
                formValues: null,
                currentUser: this.model.mapUserDTO(userDTO),
            });
            await this.loadChats();
            this.router.go("/messenger");
        } catch (error) {
            const reason = this.getErrorReason(error, "Ошибка регистрации");
            this.model.setState({
                formErrors: { login: reason },
                formValues: {
                    email: data.email,
                    login: data.login,
                    first_name: data.first_name,
                    second_name: data.second_name,
                    phone: data.phone,
                },
            });
        }
    }

    public async handleLogout(): Promise<void> {
        try {
            await this.authAPI.logout();
        } finally {
            this.model.setState({
                isAuth: false,
                activeChatId: null,
                profileMode: "view",
            });
            this.router.go("/");
        }
    }

    public async handleUpdateProfile(data: UpdateProfileData): Promise<void> {
        try {
            const userDTO = await this.userAPI.updateProfile(data);
            this.model.setState({
                currentUser: this.model.mapUserDTO(userDTO),
                profileMode: "view",
            });
        } catch (error) {
            const reason = this.getErrorReason(error, "Не удалось обновить профиль");
            this.model.setState({ formErrors: { login: reason } });
        }
    }

    public async handleUpdatePassword(data: UpdatePasswordData): Promise<void> {
        try {
            await this.userAPI.updatePassword(data);
            this.model.setState({ profileMode: "view" });
        } catch (error) {
            const reason = this.getErrorReason(error, "Неверный старый пароль");
            this.model.setState({ formErrors: { oldPassword: reason } });
        }
    }

    public async handleUpdateAvatar(file: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const userDTO = await this.userAPI.updateAvatar(formData);
            this.model.setState({
                currentUser: this.model.mapUserDTO(userDTO),
                isAvatarModalOpen: false,
                avatarModalState: "select",
                avatarFileName: "",
                avatarFile: null,
                avatarModalError: null,
            });
        } catch {
            this.model.setState({
                avatarModalState: "error",
                avatarFileName: "",
                avatarFile: null,
                avatarModalError: null,
            });
        }
    }

    public async loadChats(): Promise<void> {
        try {
            const chats = await this.chatsAPI.getChats();
            this.model.setChats(chats);
        } catch (error) {
            this.getErrorReason(error, "Ошибка загрузки чатов");
        }
    }

    public async handleCreateChat(title: string): Promise<void> {
        try {
            await this.chatsAPI.createChat(title);
            await this.loadChats();
            this.model.setState({
                activeModal: null,
                modalError: null,
                modalValue: "",
            });
        } catch (error) {
            const reason = this.getErrorReason(error, "Не удалось создать чат");
            this.model.setState({ modalError: reason, modalValue: title });
        }
    }

    public async handleChatUserAction(
        action: "add" | "delete",
        login: string
    ): Promise<void> {
        const chatId = Number(this.model.getState().activeChatId);
        if (!chatId) return;

        try {
            const foundUsers = await this.userAPI.searchByLogin(login);
            const targetUser = foundUsers.find((u) => u.login === login) || foundUsers[0];

            if (!targetUser) {
                this.model.setState({
                    modalError: "Пользователь не найден",
                    modalValue: login,
                });
                return;
            }

            if (action === "add") {
                await this.chatsAPI.addUsers(chatId, [targetUser.id]);
            } else {
                await this.chatsAPI.deleteUsers(chatId, [targetUser.id]);
            }

            this.model.setState({
                activeModal: null,
                modalError: null,
                modalValue: "",
            });
        } catch (error) {
            const reason = this.getErrorReason(error, "Ошибка операции с пользователем");
            this.model.setState({ modalError: reason, modalValue: login });
        }
    }

    public handleStateChange(newState: Partial<AppState>): void {
        this.model.setState(newState);
    }

    public handleSendMessage(chatId: number, text: string): void {
        this.model.addMessage(chatId, text);
    }

    public async loadChatUsers(chatId: number): Promise<void> {
        try {
            const users = await this.chatsAPI.getChatUsers(chatId);
            const currentLogin = this.model.getState().currentUser.login;
            this.model.setState({
                chatUsers: users.filter((u) => u.login !== currentLogin),
            });
        } catch (error) {
            this.getErrorReason(error, "Не удалось загрузить участников чата");
        }
    }

    public async handleRemoveUserById(userId: number): Promise<void> {
        const chatId = Number(this.model.getState().activeChatId);
        if (!chatId) return;

        try {
            await this.chatsAPI.deleteUsers(chatId, [userId]);
            await this.loadChatUsers(chatId);
        } catch (error) {
            this.getErrorReason(error, "Не удалось удалить пользователя");
        }
    }

    public async handleDeleteChat(): Promise<void> {
        const chatId = Number(this.model.getState().activeChatId);
        if (!chatId) return;

        try {
            await this.chatsAPI.deleteChat(chatId);
            this.model.setState({
                activeChatId: null,
                isChatMenuOpen: false,
            });
            await this.loadChats();
        } catch (error) {
            if (error instanceof HTTPError && error.status === 403) {
                this.model.setState({
                    isChatMenuOpen: false,
                    activeModal: "error-info",
                    modalError: "Чат может удалить только его создатель",
                });
                return;
            }

            const reason = this.getErrorReason(error, "Не удалось удалить чат");
            this.model.setState({
                isChatMenuOpen: false,
                activeModal: "error-info",
                modalError: reason,
            });
        }
    }


    public async handleUpdateChatAvatar(file: File): Promise<void> {
        const chatId = Number(this.model.getState().activeChatId);
        if (!chatId) return;

        try {
            const formData = new FormData();
            formData.append("chatId", String(chatId));
            formData.append("avatar", file);

            await this.chatsAPI.updateChatAvatar(formData);
            await this.loadChats();
            this.model.setState({
                isChatAvatarModalOpen: false,
                avatarModalState: "select",
                avatarFileName: "",
                avatarFile: null,
                avatarModalError: null,
            });
        } catch {
            this.model.setState({
                avatarModalState: "error",
                avatarFileName: "",
                avatarFile: null,
                avatarModalError: null,
            });
        }
    }

}
