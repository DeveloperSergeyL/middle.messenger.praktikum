import HTTPTransport from "../utils/HTTPTransport";
import { ChatDTO } from "../types";

export default class ChatsAPI {
    private http = new HTTPTransport("https://ya-praktikum.tech/api/v2");

    public getChats(title?: string): Promise<ChatDTO[]> {
        return this.http.get("/chats", { data: title ? { title } : undefined });
    }

    public createChat(title: string): Promise<{ id: number }> {
        return this.http.post("/chats", { data: { title } });
    }

    public addUsers(chatId: number, users: number[]): Promise<string> {
        return this.http.put("/chats/users", { data: { users, chatId } });
    }

    public deleteUsers(chatId: number, users: number[]): Promise<string> {
        return this.http.delete("/chats/users", { data: { users, chatId } });
    }

    public getToken(chatId: number): Promise<{ token: string }> {
        return this.http.post(`/token/${chatId}`);
    }
}
