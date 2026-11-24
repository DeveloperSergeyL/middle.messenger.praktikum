import HTTPTransport from "../utils/HTTPTransport";
import { SignInData, SignUpData, UserDTO } from "../types";

export default class AuthAPI {
    private http = new HTTPTransport('/auth');

    public signUp(data: SignUpData): Promise<{ id: number }> {
        return this.http.post("/signup", { data });
    }

    public signIn(data: SignInData): Promise<string> {
        return this.http.post("/signin", { data });
    }

    public getUser(): Promise<UserDTO> {
        return this.http.get("/user");
    }

    public logout(): Promise<string> {
        return this.http.post("/logout");
    }
}
