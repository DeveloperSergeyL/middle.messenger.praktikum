import EventBus from "../core/EventBus";
import { AppState, Chat, ChatDTO, User, UserDTO } from "../types";
import { BASE_URL } from "../utils/HTTPTransport";

const RESOURCES_URL = `${BASE_URL}/resources`;

export default class AppModel extends EventBus {
    static EVENTS = {
        STATE_UPDATED: "state:updated",
    } as const;

    private state: AppState;
    private chats: Chat[] = [];

    constructor() {
        super();
        this.state = {
            isAuth: false,
            currentPage: "login",
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
            avatarFile: null,
            avatarModalError: null,
            chatUsers: [],
            isChatAvatarModalOpen: false,
            currentUser: {
                email: "",
                login: "",
                first_name: "",
                second_name: "",
                display_name: "",
                phone: "",
                avatarUrl: "",
            },
        };
    }

    public getState(): AppState {
        return this.state;
    }

    public setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.emit(AppModel.EVENTS.STATE_UPDATED, this.state);
    }

    public mapUserDTO(dto: UserDTO): User {
        return {
            email: dto.email,
            login: dto.login,
            first_name: dto.first_name,
            second_name: dto.second_name,
            display_name: dto.display_name || dto.first_name,
            phone: dto.phone,
            avatarUrl: dto.avatar ? `${RESOURCES_URL}${dto.avatar}` : "",
        };
    }

    public setChats(dtos: ChatDTO[]): void {
        this.chats = dtos.map((dto) => {
            const existing = this.chats.find((c) => c.id === dto.id);
            const messages = existing ? existing.messages : [];

            if (dto.last_message && messages.length === 0) {
                const dateObj = new Date(dto.last_message.time);
                const time = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
                    dateObj.getMinutes()
                ).padStart(2, "0")}`;

                messages.push({
                    date: dateObj.toLocaleDateString("ru-RU"),
                    list: [
                        {
                            id: String(Date.now()),
                            autor:
                                dto.last_message.user.login === this.state.currentUser.login
                                    ? "My"
                                    : dto.last_message.user.first_name,
                            text: dto.last_message.content,
                            time,
                        },
                    ],
                });
            }

            return {
                id: dto.id,
                title: dto.title,
                avatarUrl: dto.avatar ? `${RESOURCES_URL}${dto.avatar}` : "",
                unreadCount: dto.unread_count,
                messages,
            };
        });

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
            chat.messages.push({
                date: now.toLocaleDateString("ru-RU"),
                list: [newMsg],
            });
        }

        this.emit(AppModel.EVENTS.STATE_UPDATED, this.state);
    }
}
