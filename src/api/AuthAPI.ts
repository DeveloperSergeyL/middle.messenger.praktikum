import HTTPTransport from "../utils/HTTPTransport";
import { SignInData, SignUpData, UserDTO } from "../types";

export default class AuthAPI {
    private http = new HTTPTransport("https://ya-praktikum.tech/api/v2");

    public signUp(data: SignUpData): Promise<{ id: number }> {
        return this.http.post("/auth/signup", { data });
    }

    public signIn(data: SignInData): Promise<string> {
        return this.http.post("/auth/signin", { data });
    }

    public getUser(): Promise<UserDTO> {
        return this.http.get("/auth/user");
    }

    public logout(): Promise<string> {
        return this.http.post("/auth/logout");
    }
}
