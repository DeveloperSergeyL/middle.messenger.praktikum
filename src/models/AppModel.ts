import EventBus from "../core/EventBus";
import { mockChats } from "../mocks/mockData";
import { AppState, Chat, User } from "../types";

export default class AppModel extends EventBus {
    static EVENTS = {
        STATE_UPDATED: "state:updated",
    } as const;

    private state: AppState;
    private chats: Chat[];

    constructor() {
        super();
        const isAuth = localStorage.getItem("isAuth") === "true";
        this.state = {
            isAuth,
            currentPage: isAuth ? "chat" : "login",
            activeChatId: null,
            formErrors: null,
            formValues: null,
            searchQuery: "",
            isAttachMenuOpen: false,
            isChatMenuOpen: false,
            activeModal: null,
            modalError: null,
            modalValue: "",
            profileMode: "view",
            isAvatarModalOpen: false,
            avatarModalState: "select",
            avatarFileName: "",
            avatarModalError: null,
            currentUser: {
                email: "pochta@yandex.ru",
                login: "ivanivanov",
                first_name: "Иван",
                second_name: "Иванов",
                display_name: "Иван",
                phone: "+7 (909) 967 30 30",
                avatarUrl: "",
            },
        };
        this.chats = [...mockChats];
    }

    public getState(): AppState {
        return this.state;
    }

    public setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.emit(AppModel.EVENTS.STATE_UPDATED, this.state);
    }

    public getFilteredChats(): Chat[] {
        const query = this.state.searchQuery.toLowerCase().trim();
        if (!query) return this.chats;
        return this.chats.filter((chat) =>
            chat.title.toLowerCase().includes(query)
        );
    }

    public addMessage(chatId: number, text: string): void {
        const chat = this.chats.find((c) => c.id === chatId);
        if (!chat) return;

        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
        ).padStart(2, "0")}`;

        const newMsg = {
            id: String(Date.now()),
            autor: "My",
            text,
            time,
        };

        if (chat.messages.length > 0) {
            chat.messages[chat.messages.length - 1].list.push(newMsg);
        } else {
            chat.messages.push({ date: "20.06.2020", list: [newMsg] });
        }

        this.emit(AppModel.EVENTS.STATE_UPDATED, this.state);
    }

    public updateUser(user: User): void {
        this.setState({
            currentUser: user,
            profileMode: "view",
        });
    }

    public login(): void {
        localStorage.setItem("isAuth", "true");
        this.setState({
            formErrors: null,
            formValues: null,
            isAuth: true,
            currentPage: "chat",
        });
    }

    public logout(): void {
        localStorage.removeItem("isAuth");
        this.setState({
            isAuth: false,
            currentPage: "login",
            activeChatId: null,
            formErrors: null,
            formValues: null,
            searchQuery: "",
        });
    }
}
