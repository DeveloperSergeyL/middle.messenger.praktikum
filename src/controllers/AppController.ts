import AppModel from "../models/AppModel";
import HTTPTransport from "../utils/HTTPTransport";
import { AppState, User } from "../types";

export default class AppController {
    private model: AppModel;
    protected api: HTTPTransport;

    constructor(model: AppModel) {
        this.model = model;
        this.api = new HTTPTransport("https://ya-praktikum.tech");

        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public handleStateChange(newState: Partial<AppState>): void {
        if (newState.isAuth === true) {
            this.model.login();
            return;
        }
        this.model.setState(newState);
    }

    public handleSendMessage(chatId: number, text: string): void {
        this.model.addMessage(chatId, text);
    }

    public handleUpdateProfile(user: User): void {
        this.model.updateUser(user);
    }

    public handleLogout(): void {
        this.model.logout();
    }
}
