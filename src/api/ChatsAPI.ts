import HTTPTransport from "../utils/HTTPTransport";
import { ChatDTO, ChatUserDTO } from "../types";

export default class ChatsAPI {
    private http = new HTTPTransport('/chats');

    public getChats(title?: string): Promise<ChatDTO[]> {
        return this.http.get("", { data: title ? { title } : undefined });
    }

    public createChat(title: string): Promise<{ id: number }> {
        return this.http.post("", { data: { title } });
    }

    public addUsers(chatId: number, users: number[]): Promise<string> {
        return this.http.put("/users", { data: { users, chatId } });
    }

    public deleteUsers(chatId: number, users: number[]): Promise<string> {
        return this.http.delete("/users", { data: { users, chatId } });
    }

    public getToken(chatId: number): Promise<{ token: string }> {
        return this.http.post(`/token/${chatId}`);
    }
    public deleteChat(chatId: number): Promise<unknown> {
        return this.http.delete('', { data: { chatId } });
    }

    public updateChatAvatar(data: FormData): Promise<ChatDTO> {
        return this.http.put('/avatar', { data });
    }

    public getChatUsers(chatId: number): Promise<ChatUserDTO[]> {
        return this.http.get(`/${chatId}/users`);
    }
}

