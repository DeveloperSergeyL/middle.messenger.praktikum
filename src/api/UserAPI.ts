import HTTPTransport from "../utils/HTTPTransport";
import { UpdatePasswordData, UpdateProfileData, UserDTO } from "../types";

export default class UserAPI {
    private http = new HTTPTransport("https://ya-praktikum.tech/api/v2");

    public updateProfile(data: UpdateProfileData): Promise<UserDTO> {
        return this.http.put("/user/profile", { data });
    }

    public updateAvatar(data: FormData): Promise<UserDTO> {
        return this.http.put("/user/profile/avatar", { data });
    }

    public updatePassword(data: UpdatePasswordData): Promise<string> {
        return this.http.put("/user/password", { data });
    }

    public searchByLogin(login: string): Promise<UserDTO[]> {
        return this.http.post("/user/search", { data: { login } });
    }
}
