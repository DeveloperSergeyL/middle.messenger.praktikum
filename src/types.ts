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

export interface SignInData {
    login: string;
    password: string;
}

export interface SignUpData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface UserDTO {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    email: string;
    phone: string;
    avatar: string | null;
}

export interface ChatUserDTO extends UserDTO {
    role: string;
}

export interface UpdateProfileData {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}

export interface UpdatePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface ChatDTO {
    id: number;
    title: string;
    avatar: string | null;
    unread_count: number;
    created_by: number;
    last_message: {
        user: UserDTO;
        time: string;
        content: string;
    } | null;
}

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
    avatarFile: File | null;
    avatarModalError: string | null;
    currentUser: User;
    chatUsers: ChatUserDTO[];
    isChatAvatarModalOpen: boolean;
}
