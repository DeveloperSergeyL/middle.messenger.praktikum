export interface User {
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    avatarUrl: string;
}

export interface Message {
    id: string;
    autor: string;
    text?: string;
    imageUrl?: string;
    time: string;
}

export interface MessageGroup {
    date: string;
    list: Message[];
}

export interface Chat {
    id: number;
    title: string;
    avatarUrl: string;
    unreadCount: number;
    activeChatId?: boolean;
    messages: MessageGroup[];
}

export type PageName = "login" | "signup" | "messenger" | "chat" | "profile" | 404 | 500;
export type ProfileMode = "view" | "edit-data" | "edit-password";
export type AvatarModalState = "select" | "uploaded" | "error";

export interface AppState {
    isAuth: boolean;
    currentPage: PageName;
    activeChatId: number | string | null;
    formErrors: Record<string, string> | null;
    formValues: Record<string, string> | null;
    searchQuery: string;
    isAttachMenuOpen: boolean;
    isChatMenuOpen: boolean;
    activeModal: string | null;
    modalError: string | null;
    modalValue: string;
    profileMode: ProfileMode;
    isAvatarModalOpen: boolean;
    avatarModalState: AvatarModalState;
    avatarFileName: string;
    avatarModalError: string | null;
    currentUser: User;
}
